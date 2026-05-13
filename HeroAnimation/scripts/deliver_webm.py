"""
Produce final-delivery VP8/WebM with alpha from an aligned .mov.

Default output: <input_stem_without_suffix>_final_<size>.webm next to the input,
where the suffix '_fg_alpha_aligned' is stripped so the name reads cleanly
(P1_0_fg_alpha_aligned.mov -> P1_0_final_550.webm).

Usage:
    python deliver_webm.py <input.mov> [--size 550] [--output <path>]
"""

import argparse
import subprocess
import sys
import shutil
from pathlib import Path


def find_ffmpeg() -> str | None:
    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg:
        return ffmpeg
    winget_dir = Path.home() / "AppData/Local/Microsoft/WinGet/Packages"
    if winget_dir.exists():
        for d in winget_dir.iterdir():
            if "FFmpeg" in d.name or "ffmpeg" in d.name:
                matches = list(d.rglob("ffmpeg.exe"))
                if matches:
                    return str(matches[0])
    for p in [
        Path("C:/ffmpeg/bin/ffmpeg.exe"),
        Path("C:/Program Files/ffmpeg/bin/ffmpeg.exe"),
        Path("C:/tools/ffmpeg/bin/ffmpeg.exe"),
    ]:
        if p.exists():
            return str(p)
    return None


def default_output(input_path: Path, size: int) -> Path:
    stem = input_path.stem
    for suffix in ("_fg_alpha_aligned", "_fg_alpha"):
        if stem.endswith(suffix):
            stem = stem[: -len(suffix)]
            break
    return input_path.parent / f"{stem}_final_{size}.webm"


def probe_has_audio(ffmpeg: str, src: Path) -> bool:
    ffprobe = ffmpeg.replace("ffmpeg.exe", "ffprobe.exe").replace("ffmpeg", "ffprobe")
    if not Path(ffprobe).exists() and ffprobe != "ffprobe":
        return True
    try:
        r = subprocess.run(
            [ffprobe, "-v", "error", "-select_streams", "a", "-show_entries",
             "stream=codec_type", "-of", "csv=p=0", str(src)],
            capture_output=True, text=True,
        )
        return "audio" in (r.stdout or "").lower()
    except Exception:
        return True


def main():
    ap = argparse.ArgumentParser(description="Encode VP8/WebM with alpha at a target square resolution.")
    ap.add_argument("input", help="Input .mov (RGBA PNG codec, typically *_fg_alpha_aligned.mov)")
    ap.add_argument("--size", type=int, default=550, help="Output square size in pixels (default 550)")
    ap.add_argument("--output", default=None, help="Override output path (default: alongside input)")
    ap.add_argument("--crf", type=int, default=15, help="VP8 CRF (0-63, lower=better, default 15)")
    ap.add_argument("--bitrate", default="2M", help="VP8 target bitrate (default 2M)")
    ap.add_argument("--audio-source", default=None,
                    help="Optional file to pull an audio track from (e.g. the raw Seedance .mp4). "
                         "If omitted or the file has no audio, the output is silent.")
    ap.add_argument("--audio-bitrate", default="128k", help="Vorbis audio bitrate (default 128k)")
    ap.add_argument(
        "--edge-fade",
        type=float,
        default=0.0,
        help=("Soft circular alpha mask. Fraction of half-min-side that is the falloff. "
              "0 = no mask; 0.2 = outer 20%% fades to transparent; 1.0 = fade from centre. "
              "Used to hide hard clipping when an animation overshoots the slot in the in-game UI."),
    )
    ap.add_argument(
        "--overflow-size",
        type=int,
        default=0,
        help=("Outer canvas size in px. When > --size, the actual aligned content is "
              "scaled to --size and centred inside an --overflow-size square with "
              "transparent padding around it. Use this for clips whose action overshoots "
              "the in-game slot (raised swords, big VFX) so the engine can render past "
              "the slot edges by positioning the larger asset on the same slot centre. "
              "0 / unset = no overflow padding."),
    )
    args = ap.parse_args()
    if args.edge_fade < 0 or args.edge_fade > 1:
        ap.error("--edge-fade must be in [0, 1]")
    if args.overflow_size and args.overflow_size < args.size:
        ap.error(f"--overflow-size ({args.overflow_size}) must be >= --size ({args.size})")

    inp = Path(args.input).resolve()
    if not inp.exists():
        print(f"ERROR: input not found: {inp}", file=sys.stderr); sys.exit(1)

    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        print("ERROR: ffmpeg not found", file=sys.stderr); sys.exit(1)

    audio_src: Path | None = None
    if args.audio_source:
        candidate = Path(args.audio_source).resolve()
        if not candidate.exists():
            print(f"WARN: audio source not found, encoding silent: {candidate}", file=sys.stderr)
        elif not probe_has_audio(ffmpeg, candidate):
            print(f"WARN: audio source has no audio track, encoding silent: {candidate}", file=sys.stderr)
        else:
            audio_src = candidate

    out = Path(args.output).resolve() if args.output else default_output(inp, args.size)
    out.parent.mkdir(parents=True, exist_ok=True)

    cmd: list[str] = [ffmpeg, "-y", "-i", str(inp)]
    if audio_src is not None:
        cmd += ["-i", str(audio_src)]

    cmd += [
        "-map", "0:v:0",
    ]
    if audio_src is not None:
        cmd += ["-map", "1:a:0"]

    # Build the video filter chain. Order matters:
    #   1. scale to --size (the actual content size)
    #   2. format=yuva420p (preserve alpha for downstream filters)
    #   3. geq alpha mask (radial soft fade, only on the content region)
    #   4. pad to --overflow-size (transparent padding around the central
    #      content; only added if overflow > size, otherwise skipped)
    # This bakes both the mask and the overflow padding into the deliverable
    # so the in-game player can render the larger asset positioned on the
    # standard slot, with overshoot extending past the slot edges.
    vf_parts = [f"scale={args.size}:{args.size}:flags=lanczos"]
    needs_alpha_format = args.edge_fade > 0 or (args.overflow_size and args.overflow_size > args.size)
    if needs_alpha_format:
        vf_parts.append("format=yuva420p")
    if args.edge_fade > 0:
        # clip((1 - dist_from_centre/half_min_side) / fade, 0, 1) inside the
        # alpha-plane expression of geq. The lum/cb/cr passthroughs are
        # required — ffmpeg's geq errors out with "A luminance or RGB
        # expression is mandatory" if you only specify the alpha expression.
        vf_parts.append(
            "geq="
            "lum='lum(X,Y)':cb='cb(X,Y)':cr='cr(X,Y)':"
            "a='alpha(X,Y)*clip((1-hypot(X-W/2\\,Y-H/2)/(min(W\\,H)/2))/"
            f"{args.edge_fade:.4f}\\,0\\,1)'"
        )
    if args.overflow_size and args.overflow_size > args.size:
        # Pad to overflow_size with transparent black, centring the content.
        # `color=black@0` gives fully-transparent padding (works only on a
        # format that carries alpha — hence the format=yuva420p above).
        vf_parts.append(
            f"pad={args.overflow_size}:{args.overflow_size}:"
            f"(ow-iw)/2:(oh-ih)/2:color=black@0"
        )
    vf = ",".join(vf_parts)

    cmd += [
        "-c:v", "libvpx",
        "-pix_fmt", "yuva420p",
        "-auto-alt-ref", "0",
        "-vf", vf,
        "-b:v", args.bitrate,
        "-crf", str(args.crf),
        "-metadata:s:v:0", "alpha_mode=1",
    ]
    if audio_src is not None:
        cmd += [
            "-c:a", "libvorbis",
            "-b:a", args.audio_bitrate,
            "-shortest",
        ]
    else:
        cmd += ["-an"]

    cmd += [str(out), "-loglevel", "warning"]

    tag = "VP8 alpha + Vorbis" if audio_src is not None else "VP8 alpha, silent"
    fade_tag = f", edge-fade {args.edge_fade*100:.0f}%" if args.edge_fade > 0 else ""
    out_dim = (
        f"{args.overflow_size}x{args.overflow_size} (content {args.size})"
        if args.overflow_size and args.overflow_size > args.size
        else f"{args.size}x{args.size}"
    )
    print(f"  ffmpeg -> {out.name} ({out_dim}, {tag}{fade_tag})")
    rc = subprocess.run(cmd).returncode
    if rc != 0:
        print(f"ERROR: ffmpeg returned {rc}", file=sys.stderr); sys.exit(rc)
    print(f"  done: {out}")


if __name__ == "__main__":
    main()
