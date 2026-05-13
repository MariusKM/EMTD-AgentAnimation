"""
Compose processed frame sequences into video files.

Combines FG (RGB foreground) and Matte (alpha) frames into RGBA video,
and renders Comp (composite check) frames as a preview MP4.

Outputs per clip:
  - <clip>_fg_alpha.mov   — FG + Matte as PNG .mov with alpha channel
  - <clip>_fg_alpha.mp4   — FG + Matte as MP4 (premultiplied over black)
  - <clip>_comp.mp4       — Comp sequence as MP4 preview

Usage:
    python compose_frames.py <clip_dir_or_parent> [--fps 24] [--output-dir <path>]

Examples:
    # Process a single clip directory
    python compose_frames.py ../Output/New_King/Animations/I1_0

    # Process all clip directories under a parent
    python compose_frames.py ../Output/New_King/Animations

    # Custom output location
    python compose_frames.py ../Output/New_King/Animations/I1_0 --output-dir ../Output/New_King/Finals
"""

import argparse
import json
import subprocess
import sys
import shutil
import tempfile
from pathlib import Path

import cv2
import numpy as np


DEFAULT_TEMPLATE = {
    "eyeLevelY": 0.41,
    "groundY":   0.88,
    "centerX":   0.50,
    "outputCanvas": {"mode": "source"},
}


def load_template(template_path: Path | None) -> dict:
    if template_path is None:
        return DEFAULT_TEMPLATE
    tpl = json.loads(template_path.read_text())
    # Fill in defaults for any missing keys.
    for k, v in DEFAULT_TEMPLATE.items():
        tpl.setdefault(k, v)
    tpl.setdefault("outputCanvas", DEFAULT_TEMPLATE["outputCanvas"])
    return tpl


def compute_alignment_matrix(
    anchors: dict,
    template: dict,
    src_w: int,
    src_h: int,
    canvas_pad: int = 0,
    size_factor: float = 1.0,
) -> tuple[np.ndarray, int, int]:
    """Return (2x3 affine, out_w, out_h) mapping source frame → aligned canvas.

    `canvas_pad` grows the output canvas symmetrically by that many pixels per
    side, while keeping the character at the SAME pixel position relative to
    the original (un-padded) template canvas — i.e. eye still lands on the
    template's Eye Level row, foot on the Ground row, just embedded in a
    larger canvas with extra transparent room around. Use this when the
    delivery needs overflow padding to show animation that overshoots the
    standard alignment canvas (raised swords, big VFX).

    `size_factor` is a uniform multiplier on the alignment scale, used to
    differentiate hero sizes in-game (Fat King larger than Fat Princess).
    Anchored at the ground line: foot stays on `groundY` regardless of size,
    eye lands above/below the template's `eyeLevelY` depending on whether
    the character is up- or down-scaled. For size_factor=1.0 the result is
    identical to the legacy eye-anchored math.
    """
    eye_x = float(anchors["eye"]["x"])
    eye_y = float(anchors["eye"]["y"])
    foot_y = float(anchors["foot"]["y"])

    canvas = template.get("outputCanvas", {})
    mode = canvas.get("mode", "source")
    if mode == "template":
        base_w = int(canvas.get("width", 1000))
        base_h = int(canvas.get("height", 1000))
    else:  # "source" — keep input resolution
        base_w, base_h = src_w, src_h

    # Template lines are at fractions of the BASE canvas (so adding pad doesn't
    # change where the character lands within the original template region).
    tpl_eye_y    = template["eyeLevelY"] * base_h
    tpl_ground_y = template["groundY"]   * base_h
    tpl_center_x = template["centerX"]   * base_w

    eye_to_foot_src = foot_y - eye_y
    if eye_to_foot_src <= 1e-3:
        raise ValueError(f"Invalid anchors — foot ({foot_y}) must be below eye ({eye_y})")

    # Baseline scale lands the eye-foot delta exactly on the template's
    # eye-ground span; size_factor then scales the character relative to that.
    scale = size_factor * (tpl_ground_y - tpl_eye_y) / eye_to_foot_src

    # Ground-anchored translation: foot lands on tpl_ground_y regardless of
    # size_factor. Eye lands at (tpl_ground_y - size_factor * (tpl_ground_y -
    # tpl_eye_y)) — equal to tpl_eye_y when size_factor=1, above for >1, below
    # for <1. Plus canvas_pad shifts the whole thing for overflow padding.
    dx = tpl_center_x - eye_x  * scale + canvas_pad
    dy = tpl_ground_y - foot_y * scale + canvas_pad

    out_w = base_w + 2 * canvas_pad
    out_h = base_h + 2 * canvas_pad

    M = np.float32([[scale, 0.0, dx], [0.0, scale, dy]])
    return M, out_w, out_h


def align_rgba_frames(src_dir: Path, out_dir: Path, M: np.ndarray, out_w: int, out_h: int) -> int:
    """Apply a uniform affine to every RGBA PNG in src_dir. Preserves alpha (transparent border)."""
    out_dir.mkdir(parents=True, exist_ok=True)
    count = 0
    for p in sorted(src_dir.glob("*.png")):
        img = cv2.imread(str(p), cv2.IMREAD_UNCHANGED)
        if img is None:
            continue
        if img.ndim == 2 or img.shape[2] == 3:
            bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA) if img.ndim == 3 else cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
        else:
            bgra = img
        warped = cv2.warpAffine(
            bgra, M, (out_w, out_h),
            flags=cv2.INTER_LANCZOS4,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(0, 0, 0, 0),
        )
        cv2.imwrite(str(out_dir / p.name), warped)
        count += 1
    return count


def find_ffmpeg() -> str | None:
    """Find ffmpeg executable."""
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


def compute_anchor(matte: np.ndarray, mode: str, threshold: int = 10) -> tuple[float, float] | None:
    """Compute an anchor point (x, y) from a matte.

    - centroid: alpha-weighted center of mass of the whole character.
    - feet: x = mean x of the bottom-most alpha row; y = bottom-most alpha row.
    - bbox: center of the alpha bounding box.
    """
    mask = matte >= threshold
    if not mask.any():
        return None

    if mode == "centroid":
        w = matte.astype(np.float32)
        total = float(w.sum())
        if total <= 0:
            return None
        h, wd = matte.shape
        ys, xs = np.mgrid[0:h, 0:wd]
        cx = float((xs * w).sum() / total)
        cy = float((ys * w).sum() / total)
        return cx, cy

    ys, xs = np.where(mask)
    if mode == "feet":
        max_y = int(ys.max())
        bottom = ys >= (max_y - 2)
        return float(xs[bottom].mean()), float(max_y)
    if mode == "bbox":
        return float((xs.min() + xs.max()) * 0.5), float((ys.min() + ys.max()) * 0.5)
    raise ValueError(f"Unknown stabilize mode: {mode}")


def smooth_trajectory(anchors: list[tuple[float, float] | None], window: int) -> list[tuple[float, float] | None]:
    """Moving-average smoothing over an anchor trajectory, ignoring None entries."""
    if window <= 1:
        return anchors
    n = len(anchors)
    out: list[tuple[float, float] | None] = [None] * n
    half = window // 2
    for i in range(n):
        acc_x, acc_y, c = 0.0, 0.0, 0
        for j in range(max(0, i - half), min(n, i + half + 1)):
            a = anchors[j]
            if a is None:
                continue
            acc_x += a[0]
            acc_y += a[1]
            c += 1
        out[i] = (acc_x / c, acc_y / c) if c else None
    return out


def stabilize_clip_frames(
    fg_dir: Path,
    matte_dir: Path,
    comp_dir: Path,
    out_fg: Path,
    out_matte: Path,
    out_comp: Path,
    mode: str,
    smooth: int,
) -> int:
    """Compute anchor per frame from matte, translate FG/Matte/Comp to lock anchor to frame 0."""
    for d in (out_fg, out_matte, out_comp):
        d.mkdir(parents=True, exist_ok=True)

    matte_paths = sorted(matte_dir.glob("*.png"))
    if not matte_paths:
        return 0

    anchors: list[tuple[float, float] | None] = []
    for mp in matte_paths:
        m = cv2.imread(str(mp), cv2.IMREAD_GRAYSCALE)
        anchors.append(compute_anchor(m, mode) if m is not None else None)

    anchors = smooth_trajectory(anchors, smooth)

    ref = next((a for a in anchors if a is not None), None)
    if ref is None:
        print("    Warning: no valid matte anchors, skipping stabilization")
        return 0

    count = 0
    for mp, anchor in zip(matte_paths, anchors):
        name = mp.name
        fg = cv2.imread(str(fg_dir / name), cv2.IMREAD_COLOR)
        matte = cv2.imread(str(mp), cv2.IMREAD_GRAYSCALE)
        comp = cv2.imread(str(comp_dir / name), cv2.IMREAD_UNCHANGED) if (comp_dir / name).exists() else None
        if fg is None or matte is None:
            continue

        if anchor is None:
            dx = dy = 0.0
        else:
            dx = ref[0] - anchor[0]
            dy = ref[1] - anchor[1]

        M = np.float32([[1, 0, dx], [0, 1, dy]])
        h, w = fg.shape[:2]
        fg_s = cv2.warpAffine(fg, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        matte_s = cv2.warpAffine(matte, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        cv2.imwrite(str(out_fg / name), fg_s)
        cv2.imwrite(str(out_matte / name), matte_s)

        if comp is not None:
            ch, cw = comp.shape[:2]
            # Comp may be a different size; scale the translation accordingly.
            Mc = np.float32([[1, 0, dx * cw / w], [0, 1, dy * ch / h]])
            comp_s = cv2.warpAffine(comp, Mc, (cw, ch), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            cv2.imwrite(str(out_comp / name), comp_s)
        count += 1

    return count


def is_clip_dir(path: Path) -> bool:
    """Check if a directory contains FG, Matte, and Comp subdirectories."""
    return (path / "FG").is_dir() and (path / "Matte").is_dir() and (path / "Comp").is_dir()


def find_source_video(clip_dir: Path) -> Path | None:
    """Locate the original source video sitting alongside the clip dir (e.g. Animations/P5_1.mp4 next to Animations/P5_1/)."""
    for ext in (".mp4", ".mov", ".mkv", ".webm"):
        candidate = clip_dir.parent / f"{clip_dir.name}{ext}"
        if candidate.exists() and candidate.is_file():
            return candidate
    return None


def has_audio_stream(ffmpeg_path: str, video_path: Path) -> bool:
    """Probe a video for an audio stream using ffmpeg itself (no ffprobe dependency)."""
    result = subprocess.run(
        [ffmpeg_path, "-i", str(video_path), "-hide_banner"],
        capture_output=True,
        text=True,
    )
    return "Audio:" in result.stderr


def find_clip_dirs(path: Path) -> list[Path]:
    """Find all clip directories under a path, or return the path itself if it's a clip."""
    if is_clip_dir(path):
        return [path]

    clips = sorted([d for d in path.iterdir() if d.is_dir() and is_clip_dir(d)])
    return clips


def compose_fg_alpha_frames(fg_dir: Path, matte_dir: Path, rgba_dir: Path) -> int:
    """Combine FG RGB + Matte alpha into RGBA PNGs. Returns frame count."""
    fg_frames = sorted(fg_dir.glob("*.png"))
    count = 0

    for fg_path in fg_frames:
        matte_path = matte_dir / fg_path.name
        if not matte_path.exists():
            print(f"    Warning: No matte for {fg_path.name}, skipping")
            continue

        fg = cv2.imread(str(fg_path), cv2.IMREAD_COLOR)
        matte = cv2.imread(str(matte_path), cv2.IMREAD_GRAYSCALE)

        if fg is None or matte is None:
            continue

        # Resize matte if dimensions don't match
        if fg.shape[:2] != matte.shape[:2]:
            matte = cv2.resize(matte, (fg.shape[1], fg.shape[0]))

        bgra = cv2.cvtColor(fg, cv2.COLOR_BGR2BGRA)
        bgra[:, :, 3] = matte

        cv2.imwrite(str(rgba_dir / fg_path.name), bgra)
        count += 1

    return count


def encode_mov_alpha(
    ffmpeg_path: str,
    frames_dir: Path,
    output_path: Path,
    fps: int,
    audio_source: Path | None = None,
):
    """Encode RGBA PNGs to .mov with alpha (PNG codec). Optionally mux audio from a source video."""
    cmd = [
        ffmpeg_path, "-y",
        "-framerate", str(fps),
        "-i", str(frames_dir / "frame_%06d.png"),
    ]
    if audio_source is not None:
        cmd += ["-i", str(audio_source)]
    cmd += ["-c:v", "png", "-pix_fmt", "rgba"]
    if audio_source is not None:
        cmd += [
            "-map", "0:v:0",
            "-map", "1:a:0?",
            "-c:a", "pcm_s16le",
            "-shortest",
        ]
    cmd += [str(output_path), "-loglevel", "warning"]
    subprocess.run(cmd, check=True)


def compose_over_gray(rgba_dir: Path, gray_dir: Path) -> int:
    """Composite RGBA PNGs over a neutral gray background, write to gray_dir. Returns frame count."""
    gray_dir.mkdir(parents=True, exist_ok=True)
    bg_color = np.array([128, 128, 128], dtype=np.float32)
    count = 0

    for png_path in sorted(rgba_dir.glob("*.png")):
        img = cv2.imread(str(png_path), cv2.IMREAD_UNCHANGED)
        if img is None or img.shape[2] < 4:
            continue

        rgb = img[:, :, :3].astype(np.float32)
        alpha = img[:, :, 3:4].astype(np.float32) / 255.0

        composited = (rgb * alpha + bg_color * (1.0 - alpha)).astype(np.uint8)
        cv2.imwrite(str(gray_dir / png_path.name), composited)
        count += 1

    return count


def encode_mp4_from_sequence(
    ffmpeg_path: str,
    frames_dir: Path,
    output_path: Path,
    fps: int,
    audio_source: Path | None = None,
):
    """Encode a PNG sequence to .mp4. Optionally mux audio from a source video."""
    cmd = [
        ffmpeg_path, "-y",
        "-framerate", str(fps),
        "-i", str(frames_dir / "frame_%06d.png"),
    ]
    if audio_source is not None:
        cmd += ["-i", str(audio_source)]
    cmd += [
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "18",
        "-preset", "slow",
    ]
    if audio_source is not None:
        cmd += [
            "-map", "0:v:0",
            "-map", "1:a:0?",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
        ]
    cmd += [str(output_path), "-loglevel", "warning"]
    subprocess.run(cmd, check=True)


def process_clip(
    clip_dir: Path,
    output_dir: Path,
    fps: int,
    ffmpeg_path: str,
    stabilize: str = "none",
    stabilize_smooth: int = 1,
    include_audio: bool = True,
    align_to_template: bool = False,
    template: dict | None = None,
    canvas_pad: int = 0,
    output_suffix: str = "",
    size_factor: float = 1.0,
):
    """Process a single clip directory."""
    clip_name = clip_dir.name
    fg_dir = clip_dir / "FG"
    matte_dir = clip_dir / "Matte"
    comp_dir = clip_dir / "Comp"

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n  Processing: {clip_name}")

    audio_source: Path | None = None
    if include_audio:
        source_video = find_source_video(clip_dir)
        if source_video is None:
            print(f"    Audio: no source video found next to clip dir, skipping audio mux")
        elif not has_audio_stream(ffmpeg_path, source_video):
            print(f"    Audio: source {source_video.name} has no audio stream, skipping audio mux")
        else:
            audio_source = source_video
            print(f"    Audio: muxing from {source_video.name}")

    temp_stab_dir: Path | None = None
    if stabilize != "none":
        temp_stab_dir = Path(tempfile.mkdtemp(prefix=f"emtd_stab_{clip_name}_"))
        sfg, smatte, scomp = temp_stab_dir / "FG", temp_stab_dir / "Matte", temp_stab_dir / "Comp"
        n = stabilize_clip_frames(fg_dir, matte_dir, comp_dir, sfg, smatte, scomp, stabilize, stabilize_smooth)
        print(f"    Stabilized {n} frames (mode={stabilize}, smooth={stabilize_smooth})")
        fg_dir, matte_dir, comp_dir = sfg, smatte, scomp

    # Step 1: Compose FG + Matte -> RGBA frames
    temp_rgba_dir = Path(tempfile.mkdtemp(prefix=f"emtd_rgba_{clip_name}_"))

    temp_gray_dir = Path(tempfile.mkdtemp(prefix=f"emtd_gray_{clip_name}_"))

    temp_aligned_dir: Path | None = None
    aligned_ok = False

    try:
        frame_count = compose_fg_alpha_frames(fg_dir, matte_dir, temp_rgba_dir)
        print(f"    Composed {frame_count} RGBA frames")

        # Optional: align to template using anchors.json in clip_dir
        if align_to_template:
            anchors_path = clip_dir / "anchors.json"
            if not anchors_path.exists():
                print(f"    Align: no anchors.json in {clip_dir.name}, skipping alignment")
            else:
                anchors = json.loads(anchors_path.read_text())
                first = next(iter(sorted(temp_rgba_dir.glob("*.png"))), None)
                if first is None:
                    print("    Align: no frames to align, skipping")
                else:
                    probe = cv2.imread(str(first), cv2.IMREAD_UNCHANGED)
                    src_h, src_w = probe.shape[:2]
                    M, out_w, out_h = compute_alignment_matrix(
                        anchors, template or DEFAULT_TEMPLATE, src_w, src_h,
                        canvas_pad=canvas_pad,
                        size_factor=size_factor,
                    )
                    temp_aligned_dir = Path(tempfile.mkdtemp(prefix=f"emtd_aligned_{clip_name}_"))
                    n = align_rgba_frames(temp_rgba_dir, temp_aligned_dir, M, out_w, out_h)
                    pad_tag = f", pad={canvas_pad}px" if canvas_pad else ""
                    size_tag = f", size×{size_factor:.2f}" if abs(size_factor - 1.0) > 1e-3 else ""
                    print(f"    Aligned {n} frames to template ({out_w}x{out_h}, scale={M[0,0]:.3f}{pad_tag}{size_tag})")
                    aligned_ok = True

        # --- Encode originals (un-aligned), unless alignment is active.
        # Alignment writes its own suffixed outputs and leaves originals untouched.
        if not aligned_ok:
            mov_path = output_dir / f"{clip_name}_fg_alpha.mov"
            encode_mov_alpha(ffmpeg_path, temp_rgba_dir, mov_path, fps, audio_source)
            print(f"    -> {mov_path.name}")

            mp4_alpha_path = output_dir / f"{clip_name}_fg_alpha.mp4"
            gray_count = compose_over_gray(temp_rgba_dir, temp_gray_dir)
            encode_mp4_from_sequence(ffmpeg_path, temp_gray_dir, mp4_alpha_path, fps, audio_source)
            print(f"    -> {mp4_alpha_path.name} ({gray_count} frames over gray)")
        else:
            # Aligned outputs written with _aligned suffix — originals preserved.
            # Optional --output-suffix appends to the filename so callers can
            # produce variant aligned MOVs (e.g. with canvas padding) without
            # overwriting the standard aligned MOV.
            assert temp_aligned_dir is not None
            mov_path = output_dir / f"{clip_name}_fg_alpha_aligned{output_suffix}.mov"
            encode_mov_alpha(ffmpeg_path, temp_aligned_dir, mov_path, fps, audio_source)
            print(f"    -> {mov_path.name} (aligned)")

            mp4_alpha_path = output_dir / f"{clip_name}_fg_alpha_aligned{output_suffix}.mp4"
            # New temp dir for the aligned gray composite (temp_gray_dir is untouched).
            aligned_gray_dir = Path(tempfile.mkdtemp(prefix=f"emtd_aligned_gray_{clip_name}_"))
            try:
                gray_count = compose_over_gray(temp_aligned_dir, aligned_gray_dir)
                encode_mp4_from_sequence(ffmpeg_path, aligned_gray_dir, mp4_alpha_path, fps, audio_source)
                print(f"    -> {mp4_alpha_path.name} ({gray_count} frames over gray, aligned)")
            finally:
                shutil.rmtree(aligned_gray_dir, ignore_errors=True)

    finally:
        shutil.rmtree(temp_rgba_dir, ignore_errors=True)
        shutil.rmtree(temp_gray_dir, ignore_errors=True)
        if temp_aligned_dir is not None:
            shutil.rmtree(temp_aligned_dir, ignore_errors=True)

    # Step 4: Comp preview — only regenerate on a non-aligned pass (it's a keying-quality
    # preview, not an alignment preview, so aligning shouldn't overwrite it).
    if not aligned_ok:
        comp_mp4_path = output_dir / f"{clip_name}_comp.mp4"
        encode_mp4_from_sequence(ffmpeg_path, comp_dir, comp_mp4_path, fps, audio_source)
        print(f"    -> {comp_mp4_path.name}")

    if temp_stab_dir is not None:
        shutil.rmtree(temp_stab_dir, ignore_errors=True)


def main():
    parser = argparse.ArgumentParser(
        description="Compose FG + Matte frame sequences into video files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("input", help="Clip directory (with FG/Matte/Comp) or parent containing multiple clips")
    parser.add_argument("--fps", type=int, default=24, help="Output frame rate (default: 24)")
    parser.add_argument("--output-dir", default=None, help="Output directory (default: clip root).")
    parser.add_argument(
        "--stabilize",
        choices=["none", "centroid", "feet", "bbox"],
        default="none",
        help="Lock the character in-frame by counter-translating each frame. "
        "'feet' anchors the bottom of the alpha silhouette (best for grounded idle/power). "
        "'centroid' uses alpha-weighted center of mass. 'bbox' uses alpha bbox center.",
    )
    parser.add_argument(
        "--stabilize-smooth",
        type=int,
        default=1,
        help="Moving-average window (frames) applied to the anchor trajectory to absorb matte jitter. "
        "1 = no smoothing (hard lock). Try 5-9 if the matte edges flicker.",
    )
    parser.add_argument(
        "--no-audio",
        action="store_true",
        help="Skip muxing audio from the source video (audio is muxed by default when a sibling "
        "<clipName>.mp4/.mov/.mkv/.webm exists next to the clip directory).",
    )
    parser.add_argument(
        "--align-to-template",
        action="store_true",
        help="Apply a uniform affine so each clip's eye+foot anchors land on the template "
        "Eye Level / Ground lines. Reads anchors.json from each clip dir.",
    )
    parser.add_argument(
        "--template",
        default=None,
        help="Path to character-alignment.json (normalized template config). "
        "Defaults to built-in values if omitted.",
    )
    parser.add_argument(
        "--canvas-pad",
        type=int,
        default=0,
        help="When aligning, grow the output canvas by this many pixels on every side "
        "without changing where the character lands. Lets the affine transform extend "
        "past the standard template canvas boundary so animation that overshoots "
        "(raised swords, big VFX) is preserved instead of cropped.",
    )
    parser.add_argument(
        "--output-suffix",
        default="",
        help="Appended to the aligned output filename (e.g. '_padded' → "
        "<clip>_fg_alpha_aligned_padded.mov). Use with --canvas-pad to keep the "
        "standard aligned MOV intact while producing a padded sibling for delivery.",
    )
    parser.add_argument(
        "--size-factor",
        type=float,
        default=1.0,
        help="Uniform multiplier on the alignment scale, used to differentiate "
        "hero sizes (e.g. Fat King 1.0 / generic 0.85 / Fat Princess 0.7). "
        "Anchored at the ground line: foot stays on groundY at any size. "
        "Default 1.0 = legacy behaviour. Tune per-hero via "
        "character-alignment.json's heroSizes / sizeFactors maps and forward "
        "the resolved factor here from the caller.",
    )
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    if not input_path.exists():
        print(f"ERROR: Path not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    ffmpeg_path = find_ffmpeg()
    if not ffmpeg_path:
        print("ERROR: ffmpeg not found.", file=sys.stderr)
        sys.exit(1)

    clips = find_clip_dirs(input_path)
    if not clips:
        print(f"ERROR: No clip directories found (expected FG/Matte/Comp subdirs) in {input_path}", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(clips)} clip(s) to process")
    print(f"FPS: {args.fps}")
    print(f"ffmpeg: {ffmpeg_path}")

    template = load_template(Path(args.template).resolve() if args.template else None)
    if args.align_to_template:
        print(f"Alignment: ON (eye={template['eyeLevelY']}, ground={template['groundY']}, center={template['centerX']})")

    for clip_dir in clips:
        if args.output_dir:
            output_dir = Path(args.output_dir).resolve()
        else:
            output_dir = clip_dir

        process_clip(
            clip_dir,
            output_dir,
            args.fps,
            ffmpeg_path,
            args.stabilize,
            args.stabilize_smooth,
            include_audio=not args.no_audio,
            align_to_template=args.align_to_template,
            template=template,
            canvas_pad=args.canvas_pad,
            output_suffix=args.output_suffix,
            size_factor=args.size_factor,
        )

    print(f"\nDone! Processed {len(clips)} clip(s).")


if __name__ == "__main__":
    main()
