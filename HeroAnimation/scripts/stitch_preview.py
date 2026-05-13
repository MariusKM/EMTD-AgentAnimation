"""
Stitch a sequence of delivered WebMs into a single shareable preview, composited
over a mockup PNG (e.g. the Hero Screen mockup).

The mockup is used as a static background; each clip is scaled + overlaid inside
a rectangular slot, then all clips are concatenated in order. Audio from each
clip is preserved end-to-end.

Typical use:

    python stitch_preview.py \
        --clips Output/Fat_King/Final/I1_0_final_550.webm,Output/Fat_King/Final/P1_0_final_550.webm \
        --loops 2,1 \
        --mockup HeroAnimation/HeroScreen.png \
        --slot 60,300,630,640 \
        --output Output/Fat_King/Final/Fat_King_preview.mp4

`--slot` is x,y,w,h in MOCKUP pixels (top-left origin). The script does NOT
know about normalized rects — the caller passes absolute pixels.
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


def parse_slot(s: str) -> tuple[int, int, int, int]:
    parts = [p.strip() for p in s.split(",")]
    if len(parts) != 4:
        raise argparse.ArgumentTypeError("--slot must be 'x,y,w,h' in mockup pixels")
    try:
        x, y, w, h = (int(p) for p in parts)
    except ValueError:
        raise argparse.ArgumentTypeError("--slot values must be integers")
    if w <= 0 or h <= 0:
        raise argparse.ArgumentTypeError("--slot w and h must be positive")
    return x, y, w, h


def main():
    ap = argparse.ArgumentParser(description="Stitch delivered WebMs over a mockup PNG into a shareable MP4.")
    ap.add_argument("--clips", required=True, help="Comma-separated paths to .webm clips (in playback order)")
    ap.add_argument("--loops", required=True, help="Comma-separated loop counts per clip (must match --clips length)")
    ap.add_argument("--mockup", required=True, help="Path to mockup PNG used as the background")
    ap.add_argument("--slot", required=True, type=parse_slot, help="'x,y,w,h' character slot in mockup pixels")
    ap.add_argument("--output", required=True, help="Output path (.mp4)")
    ap.add_argument("--crf", type=int, default=18, help="H.264 CRF (lower=better, default 18)")
    ap.add_argument("--fps", type=int, default=24, help="Output fps (default 24)")
    ap.add_argument(
        "--edge-fades",
        default=None,
        help=("Comma-separated soft-mask fractions, one per clip in --clips. "
              "Each value is in [0, 1]: 0 = no mask, 0.2 = outer 20%% fades, 1.0 = fade from centre. "
              "If omitted, no mask is applied. If a single value is given, it applies to all clips."),
    )
    ap.add_argument(
        "--overflow-sizes",
        default=None,
        help=("Comma-separated overflow output sizes (px), one per clip in --clips. "
              "0 = clip is at the standard --content-size; >0 = clip's WebM is larger "
              "(content centred, transparent padding) so its action can render past "
              "the slot edges. Each clip's video is scaled and positioned such that "
              "its central content region maps to the slot."),
    )
    ap.add_argument(
        "--content-size",
        type=int,
        default=550,
        help=("The size (px) of the central content region inside each clip's WebM. "
              "Defaults to 550 (matches deliver_webm.py default --size). Used to "
              "compute per-clip scale factors when --overflow-sizes is set."),
    )
    args = ap.parse_args()

    clips = [Path(c.strip()).resolve() for c in args.clips.split(",") if c.strip()]
    loops = [int(n) for n in args.loops.split(",") if n.strip()]
    if len(clips) == 0:
        print("ERROR: --clips empty", file=sys.stderr); sys.exit(1)
    if len(clips) != len(loops):
        print(f"ERROR: --clips ({len(clips)}) and --loops ({len(loops)}) lengths must match", file=sys.stderr); sys.exit(1)
    for c in clips:
        if not c.exists():
            print(f"ERROR: clip not found: {c}", file=sys.stderr); sys.exit(1)

    # Parse --edge-fades into a per-clip list, broadcasting a single value if given.
    if args.edge_fades:
        raw = [float(x) for x in args.edge_fades.split(",") if x.strip()]
        if len(raw) == 1:
            fades = raw * len(clips)
        elif len(raw) == len(clips):
            fades = raw
        else:
            print(f"ERROR: --edge-fades ({len(raw)}) must be 1 value or match --clips length ({len(clips)})", file=sys.stderr); sys.exit(1)
        for f in fades:
            if f < 0 or f > 1:
                print(f"ERROR: --edge-fades values must be in [0, 1]; got {f}", file=sys.stderr); sys.exit(1)
    else:
        fades = [0.0] * len(clips)

    # Per-clip overflow sizes (0 = no overflow, just content-size).
    if args.overflow_sizes:
        raw = [int(x) for x in args.overflow_sizes.split(",") if x.strip()]
        if len(raw) == 1:
            overflows = raw * len(clips)
        elif len(raw) == len(clips):
            overflows = raw
        else:
            print(f"ERROR: --overflow-sizes ({len(raw)}) must be 1 value or match --clips length ({len(clips)})", file=sys.stderr); sys.exit(1)
    else:
        overflows = [0] * len(clips)

    mockup = Path(args.mockup).resolve()
    if not mockup.exists():
        print(f"ERROR: mockup not found: {mockup}", file=sys.stderr); sys.exit(1)

    out = Path(args.output).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        print("ERROR: ffmpeg not found", file=sys.stderr); sys.exit(1)

    sx, sy, sw, sh = args.slot

    cmd: list[str] = [ffmpeg, "-y"]

    # Each clip input — stream_loop = N-1 means N total plays.
    # Force the VP8 decoder so the alpha sidestream in our WebMs is decoded
    # into a yuva420p video frame (ffmpeg's default VP8 path can drop alpha).
    for clip, n in zip(clips, loops):
        if n > 1:
            cmd += ["-stream_loop", str(n - 1)]
        cmd += ["-c:v", "libvpx", "-i", str(clip)]

    # Mockup as a looping single-frame "video".
    mockup_idx = len(clips)
    cmd += ["-loop", "1", "-framerate", str(args.fps), "-i", str(mockup)]

    # Build filter graph. Per-clip overflow means each clip can have its own
    # scale factor and overlay position, so we composite each clip onto its own
    # copy of the mockup (via `split=N`), then concat the composited streams:
    #
    #   [mockup] -> format=rgba -> split N -> [bg0][bg1]...[bg{N-1}]
    #   for each clip i:
    #     [i:v] -> scale to (sw*Oi/S, sh*Oi/S) -> [maybe geq mask] -> [vi]
    #     [bgi][vi] -> overlay at slot-centre -> [ci]
    #   concat [c0][a0][c1][a1]... -> [vseq][aseq]
    #   [vseq] -> format=yuv420p -> [vout]
    #
    # For non-overflow clips, Oi == content_size so scale stays at (sw, sh)
    # and overlay position stays at (sx, sy) — same as the previous behaviour.
    #
    # geq alpha mask is per-clip (the lum/cb/cr passthroughs are required —
    # ffmpeg errors with "A luminance or RGB expression is mandatory" otherwise).
    def mask_for(fade: float) -> str | None:
        if fade <= 0:
            return None
        return (
            "geq="
            "lum='lum(X,Y)':cb='cb(X,Y)':cr='cr(X,Y)':"
            f"a='alpha(X,Y)*clip((1-hypot(X-W/2\\,Y-H/2)/(min(W\\,H)/2))/"
            f"{fade:.4f}\\,0\\,1)'"
        )

    content_size = args.content_size
    n = len(clips)

    filters: list[str] = []
    # Split the mockup N ways so each clip gets an independent background to
    # composite onto.
    bg_labels = "".join(f"[bg{i}]" for i in range(n))
    filters.append(f"[{mockup_idx}:v]format=rgba,split={n}{bg_labels}")

    concat_inputs: list[str] = []
    for i in range(n):
        # Effective dims of the WebM after upscaling so its central content
        # (content_size) aligns with the slot (sw, sh).
        eff_size = overflows[i] if overflows[i] and overflows[i] > content_size else content_size
        ratio = eff_size / content_size
        scaled_w = round(sw * ratio)
        scaled_h = round(sh * ratio)
        # Position: keep the clip's CENTRE on the slot's centre. For overflow
        # clips this means negative offsets so the padding extends past the
        # slot edges — overlay accepts negative coords natively.
        pos_x = round(sx + sw / 2 - scaled_w / 2)
        pos_y = round(sy + sh / 2 - scaled_h / 2)

        # Force a known fps and reset PTS to start at 0 — without these, the
        # per-clip overlay drops a blank frame at the start of every concat
        # segment because the overlay (vi) stream's first frame arrives slightly
        # after the mockup's, so overlay's first output frame has no character
        # composited yet. Equivalent reset on the audio side keeps a/v in sync
        # across boundaries.
        chain = f"[{i}:v]scale={scaled_w}:{scaled_h}:flags=lanczos,format=yuva420p"
        m = mask_for(fades[i])
        if m:
            chain += f",{m}"
        chain += f",setsar=1,fps={args.fps},setpts=PTS-STARTPTS[v{i}]"
        filters.append(chain)
        filters.append(f"[{i}:a]asetpts=PTS-STARTPTS[a{i}]")

        filters.append(
            f"[bg{i}][v{i}]overlay=x={pos_x}:y={pos_y}:shortest=1:format=auto,setpts=PTS-STARTPTS[c{i}]"
        )
        concat_inputs.append(f"[c{i}][a{i}]")

    filters.append(
        f"{''.join(concat_inputs)}concat=n={n}:v=1:a=1[vseq][aseq]"
    )
    filters.append("[vseq]format=yuv420p[vout]")

    cmd += ["-filter_complex", ";".join(filters)]
    cmd += ["-map", "[vout]", "-map", "[aseq]"]
    cmd += [
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", str(args.crf),
        "-preset", "medium",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-b:a", "128k",
        "-r", str(args.fps),
        str(out),
        "-loglevel", "warning",
    ]

    plan_parts = []
    for c, n_loops, f, o in zip(clips, loops, fades, overflows):
        bits = []
        if f > 0: bits.append(f"fade {f*100:.0f}%")
        if o and o > content_size: bits.append(f"overflow {o}")
        suffix = f" [{', '.join(bits)}]" if bits else ""
        plan_parts.append(f"{c.name}×{n_loops}{suffix}")
    plan = " + ".join(plan_parts)
    print(f"  stitching: {plan}")
    print(f"  mockup: {mockup.name}  slot: {sw}x{sh}@({sx},{sy})  content: {content_size}")
    rc = subprocess.run(cmd).returncode
    if rc != 0:
        print(f"ERROR: ffmpeg returned {rc}", file=sys.stderr); sys.exit(rc)
    print(f"  done: {out}")


if __name__ == "__main__":
    main()
