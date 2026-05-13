"""
Remove background from hero animation videos.

Two methods available:
  - chroma: Fast green-screen keying via ffmpeg (default, no GPU needed)
  - sam2:   ML-based segmentation via SAM2 (handles any background, needs GPU)

Usage:
    python remove_bg.py <input_video> [--method chroma|sam2] [--output <path>]

Examples:
    # Green screen removal (fast, default)
    python remove_bg.py ../Output/New_King/power_v1.mov

    # Tune chroma key sensitivity
    python remove_bg.py input.mov --method chroma --similarity 0.15 --blend 0.08

    # SAM2 for complex backgrounds or soft edges
    python remove_bg.py input.mov --method sam2

    # Custom output path
    python remove_bg.py input.mov --output ../Output/New_King/power_v1_transparent.mov

Requirements:
    - chroma method: ffmpeg only
    - sam2 method: .venv with PyTorch+CUDA, SAM2, and checkpoint in HeroAnimation/models/
"""

import argparse
import subprocess
import sys
import tempfile
import shutil
from pathlib import Path

import cv2
import numpy as np


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def find_ffmpeg() -> str | None:
    """Find ffmpeg executable, checking PATH and common Windows install locations."""
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


def extract_frames_to_dir(video_path: Path, output_dir: Path) -> tuple[float, int, int, int]:
    """Extract all frames from video as JPEG files. Returns (fps, width, height, frame_count)."""
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imwrite(str(output_dir / f"{frame_idx:06d}.jpg"), frame)
        frame_idx += 1

    cap.release()
    print(f"  Extracted {frame_idx} frames ({width}x{height} @ {fps:.1f} FPS)")
    return fps, width, height, frame_idx


def encode_alpha_mov(ffmpeg_path: str, frames_dir: Path, output_path: Path, fps: float):
    """Encode a directory of RGBA PNGs into a .mov with alpha channel."""
    cmd = [
        ffmpeg_path, "-y",
        "-framerate", str(fps),
        "-i", str(frames_dir / "%06d.png"),
        "-c:v", "png",
        "-pix_fmt", "rgba",
        str(output_path),
        "-loglevel", "warning",
    ]
    print(f"  Encoding .mov with alpha channel...")
    subprocess.run(cmd, check=True)


# ---------------------------------------------------------------------------
# Method: Chroma Key (ffmpeg)
# ---------------------------------------------------------------------------

def remove_bg_chroma(
    input_path: Path,
    output_path: Path,
    color: str,
    similarity: float,
    blend: float,
    save_frames: bool = False,
):
    """Remove green screen background using ffmpeg chromakey filter."""
    ffmpeg_path = find_ffmpeg()
    if not ffmpeg_path:
        print("ERROR: ffmpeg not found. Install it or use --method sam2.", file=sys.stderr)
        sys.exit(1)

    print(f"  Method: chroma key (color={color}, similarity={similarity}, blend={blend})")
    print(f"  ffmpeg: {ffmpeg_path}")

    # Encode .mov
    cmd = [
        ffmpeg_path, "-y",
        "-i", str(input_path),
        "-vf", f"chromakey={color}:{similarity}:{blend}",
        "-c:v", "png",
        "-pix_fmt", "rgba",
        str(output_path),
        "-loglevel", "warning",
    ]
    subprocess.run(cmd, check=True)
    print(f"  Output: {output_path}")

    # Save individual RGBA PNGs
    if save_frames:
        frames_out_dir = output_path.parent / f"{output_path.stem}_frames"
        frames_out_dir.mkdir(parents=True, exist_ok=True)
        cmd_frames = [
            ffmpeg_path, "-y",
            "-i", str(input_path),
            "-vf", f"chromakey={color}:{similarity}:{blend}",
            "-pix_fmt", "rgba",
            str(frames_out_dir / "%06d.png"),
            "-loglevel", "warning",
        ]
        subprocess.run(cmd_frames, check=True)
        print(f"  Saved RGBA frames to: {frames_out_dir}")


# ---------------------------------------------------------------------------
# Method: SAM2
# ---------------------------------------------------------------------------

def find_sam2_config(checkpoint_name: str) -> str:
    """Map checkpoint filename to the correct SAM2 config name."""
    config_map = {
        "sam2.1_hiera_large": "sam2.1_hiera_l",
        "sam2.1_hiera_base_plus": "sam2.1_hiera_b+",
        "sam2.1_hiera_small": "sam2.1_hiera_s",
        "sam2.1_hiera_tiny": "sam2.1_hiera_t",
        "sam2_hiera_large": "sam2_hiera_l",
        "sam2_hiera_base_plus": "sam2_hiera_b+",
        "sam2_hiera_small": "sam2_hiera_s",
        "sam2_hiera_tiny": "sam2_hiera_t",
    }
    stem = Path(checkpoint_name).stem
    if stem in config_map:
        return config_map[stem]
    print(f"  Warning: Unknown checkpoint '{stem}', defaulting to sam2.1_hiera_l config")
    return "sam2.1_hiera_l"


def detect_character_bbox(frame_path: Path, bg_color: str = "green") -> np.ndarray:
    """Detect the character's bounding box on the first frame by finding non-background pixels.
    Returns [x1, y1, x2, y2] with a small margin."""
    frame = cv2.imread(str(frame_path))
    h, w = frame.shape[:2]

    # Create a mask of non-background pixels
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    if bg_color == "green":
        # Green screen: hue ~35-85, high saturation
        lower = np.array([35, 80, 80])
        upper = np.array([85, 255, 255])
        bg_mask = cv2.inRange(hsv, lower, upper)
    elif bg_color == "white":
        # White background: high value, low saturation
        lower = np.array([0, 0, 200])
        upper = np.array([180, 30, 255])
        bg_mask = cv2.inRange(hsv, lower, upper)
    else:
        # Black background
        lower = np.array([0, 0, 0])
        upper = np.array([180, 255, 50])
        bg_mask = cv2.inRange(hsv, lower, upper)

    # Invert: foreground pixels
    fg_mask = cv2.bitwise_not(bg_mask)

    # Clean up noise
    kernel = np.ones((5, 5), np.uint8)
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_OPEN, kernel)
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)

    # Find bounding box of foreground
    coords = cv2.findNonZero(fg_mask)
    if coords is None:
        # Fallback: use most of the frame
        margin = int(min(w, h) * 0.05)
        return np.array([margin, margin, w - margin, h - margin], dtype=np.float32)

    x, y, bw, bh = cv2.boundingRect(coords)

    # Add margin (5% of frame size)
    margin = int(min(w, h) * 0.05)
    x1 = max(0, x - margin)
    y1 = max(0, y - margin)
    x2 = min(w, x + bw + margin)
    y2 = min(h, y + bh + margin)

    return np.array([x1, y1, x2, y2], dtype=np.float32)


def segment_video_sam2(
    frames_dir: Path,
    checkpoint: Path,
    frame_count: int,
    width: int,
    height: int,
    bg_color: str = "green",
) -> list[np.ndarray]:
    """Run SAM2 video predictor and return binary masks for each frame."""
    import torch
    from sam2.build_sam import build_sam2_video_predictor

    config_name = find_sam2_config(checkpoint.name)
    print(f"  Loading SAM2 model: {config_name}")

    predictor = build_sam2_video_predictor(
        config_file=f"configs/sam2.1/{config_name}.yaml",
        ckpt_path=str(checkpoint),
    )

    # Detect character bounding box on first frame
    first_frame = frames_dir / "000000.jpg"
    bbox = detect_character_bbox(first_frame, bg_color)
    print(f"  Detected character bbox: [{bbox[0]:.0f}, {bbox[1]:.0f}, {bbox[2]:.0f}, {bbox[3]:.0f}]")

    with torch.inference_mode(), torch.autocast("cuda", dtype=torch.bfloat16):
        state = predictor.init_state(video_path=str(frames_dir))

        # Use bounding box prompt — much more reliable for full-body segmentation
        _, obj_ids, _ = predictor.add_new_points_or_box(
            inference_state=state,
            frame_idx=0,
            obj_id=1,
            box=bbox,
        )
        print(f"  Initial segmentation on frame 0 — {len(obj_ids)} object(s)")

        print(f"  Propagating mask across {frame_count} frames...")
        masks = [None] * frame_count
        for frame_idx, obj_ids, mask_logits in predictor.propagate_in_video(state):
            # Keep raw logits for soft alpha edges instead of hard threshold
            logits = mask_logits[0].cpu().numpy().squeeze().astype(np.float32)
            masks[frame_idx] = logits

    return masks


def logits_to_soft_alpha(logits: np.ndarray, edge_width: float = 3.0) -> np.ndarray:
    """Convert raw SAM2 logits to a soft alpha channel with anti-aliased edges.

    The logits have a natural gradient at object boundaries. We apply a sigmoid
    with adjustable steepness to control edge softness, then feather slightly
    for smooth anti-aliasing.

    Args:
        logits: Raw mask logits from SAM2 (float, positive=foreground)
        edge_width: Controls edge softness. Lower = sharper, higher = softer.
                    Recommended range: 1.0 (crisp) to 5.0 (very soft).
    """
    # Sigmoid with adjustable steepness — maps logits to 0-1 with soft edges
    alpha = 1.0 / (1.0 + np.exp(-logits / max(edge_width, 0.1)))

    # Light gaussian for sub-pixel smoothing
    alpha = cv2.GaussianBlur(alpha, (5, 5), 0.8)

    # Clamp and convert to uint8
    alpha = np.clip(alpha * 255, 0, 255).astype(np.uint8)

    return alpha


def remove_bg_sam2(
    input_path: Path,
    output_path: Path,
    checkpoint: Path,
    bg_color: str = "green",
    edge_width: float = 3.0,
    save_frames: bool = False,
):
    """Remove background using SAM2 segmentation."""
    ffmpeg_path = find_ffmpeg()

    # Extract frames
    print("  Extracting frames...")
    frames_dir = Path(tempfile.mkdtemp(prefix="emtd_sam2_frames_"))
    temp_rgba_dir = Path(tempfile.mkdtemp(prefix="emtd_rgba_"))

    try:
        fps, width, height, frame_count = extract_frames_to_dir(input_path, frames_dir)

        # Segment
        print("\n  Segmenting with SAM2...")
        masks = segment_video_sam2(frames_dir, checkpoint, frame_count, width, height, bg_color)

        # Compose RGBA frames
        print(f"\n  Composing RGBA frames (edge_width={edge_width})...")
        for i in range(frame_count):
            frame = cv2.imread(str(frames_dir / f"{i:06d}.jpg"))
            if frame is None:
                continue

            logits = masks[i] if masks[i] is not None else np.zeros((height, width), dtype=np.float32)
            alpha = logits_to_soft_alpha(logits, edge_width)

            bgra = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)
            bgra[:, :, 3] = alpha
            cv2.imwrite(str(temp_rgba_dir / f"{i:06d}.png"), bgra)

        # Save frames if requested
        if save_frames:
            frames_out_dir = output_path.parent / f"{output_path.stem}_frames"
            frames_out_dir.mkdir(parents=True, exist_ok=True)
            for png in sorted(temp_rgba_dir.glob("*.png")):
                shutil.copy2(png, frames_out_dir / png.name)
            print(f"  Saved RGBA frames to: {frames_out_dir}")

        # Encode
        if ffmpeg_path:
            encode_alpha_mov(ffmpeg_path, temp_rgba_dir, output_path, fps)
        else:
            if not save_frames:
                fallback_dir = output_path.parent / (output_path.stem + "_frames")
                fallback_dir.mkdir(parents=True, exist_ok=True)
                for png in sorted(temp_rgba_dir.glob("*.png")):
                    shutil.copy2(png, fallback_dir / png.name)
            print(f"  ffmpeg not found — frames saved to: {output_path.stem}_frames/")
            return

        print(f"  Output: {output_path}")

    finally:
        shutil.rmtree(frames_dir, ignore_errors=True)
        shutil.rmtree(temp_rgba_dir, ignore_errors=True)


def find_checkpoint(model_arg: str | None) -> Path:
    """Locate SAM2 checkpoint."""
    if model_arg:
        return Path(model_arg).resolve()

    script_dir = Path(__file__).parent
    models_dir = script_dir.parent / "models"
    candidates = list(models_dir.glob("sam2*.pt"))
    if not candidates:
        print(f"ERROR: No SAM2 checkpoint found in {models_dir}", file=sys.stderr)
        print("Download one from: https://github.com/facebookresearch/sam2#checkpoints")
        sys.exit(1)
    return candidates[0]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Remove background from hero animation videos",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Methods:
  chroma  Fast green-screen removal via ffmpeg (default)
  sam2    ML segmentation via SAM2 (any background, needs GPU)

Examples:
  %(prog)s input.mov                              # chroma key (default)
  %(prog)s input.mov --similarity 0.2 --blend 0.1 # looser chroma key
  %(prog)s input.mov --method sam2                 # SAM2 segmentation
  %(prog)s input.mov --color 0xFFFFFF              # white background key
""",
    )
    parser.add_argument("input", help="Input video file")
    parser.add_argument("--output", default=None, help="Output path (default: <input>_alpha.mov)")
    parser.add_argument("--save-frames", action="store_true", help="Also save RGBA PNG frames to a subdirectory")
    parser.add_argument(
        "--method",
        choices=["chroma", "sam2"],
        default="chroma",
        help="Background removal method (default: chroma)",
    )

    # Chroma key options
    chroma_group = parser.add_argument_group("chroma key options")
    chroma_group.add_argument(
        "--color",
        default="0x00FF00",
        help="Key color in hex (default: 0x00FF00 = green)",
    )
    chroma_group.add_argument(
        "--similarity",
        type=float,
        default=0.1,
        help="How close to the key color counts as background (0.01-1.0, default: 0.1)",
    )
    chroma_group.add_argument(
        "--blend",
        type=float,
        default=0.05,
        help="Edge blending/feathering amount (0.0-1.0, default: 0.05)",
    )

    # SAM2 options
    sam2_group = parser.add_argument_group("sam2 options")
    sam2_group.add_argument(
        "--model",
        default=None,
        help="SAM2 checkpoint path (default: auto-detect in HeroAnimation/models/)",
    )
    sam2_group.add_argument(
        "--bg-color",
        choices=["green", "white", "black"],
        default="green",
        help="Background color for auto-detecting the character bbox (default: green)",
    )
    sam2_group.add_argument(
        "--edge-width",
        type=float,
        default=3.0,
        help="Edge softness for anti-aliasing (1.0=crisp, 3.0=default, 5.0=soft)",
    )

    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    if not input_path.exists():
        print(f"ERROR: Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    if args.output:
        output_path = Path(args.output).resolve()
    else:
        output_path = input_path.parent / f"{input_path.stem}_alpha.mov"

    output_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"Input:  {input_path}")
    print(f"Output: {output_path}")
    print(f"Method: {args.method}")
    print()

    if args.method == "chroma":
        remove_bg_chroma(input_path, output_path, args.color, args.similarity, args.blend, args.save_frames)
    else:
        checkpoint = find_checkpoint(args.model)
        print(f"Checkpoint: {checkpoint}\n")
        remove_bg_sam2(input_path, output_path, checkpoint, args.bg_color, args.edge_width, args.save_frames)

    print("\nDone!")


if __name__ == "__main__":
    main()
