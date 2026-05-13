"""
Extract frames from video files at a configurable FPS rate.

Usage:
    python extract_frames.py <video_path_or_directory> [--fps 10] [--out-dir ./frames] [--format png]

If a directory is given, all .mov/.mp4/.avi/.webm files in it are processed.
Output goes to a temporary directory by default (printed to stdout) which the
caller can clean up, or to --out-dir if specified.

Examples:
    # Extract at 10 FPS from a single video to a temp dir
    python extract_frames.py ../Examples/diana-with-aac-audio.mov

    # Extract at 5 FPS from all videos in Examples, keep output
    python extract_frames.py ../Examples --fps 5 --out-dir ./frames

    # Extract as jpg for smaller files
    python extract_frames.py ../Examples/diana-with-aac-audio.mov --format jpg --fps 8
"""

import argparse
import cv2
import sys
import tempfile
import shutil
from pathlib import Path

VIDEO_EXTENSIONS = {".mov", ".mp4", ".avi", ".webm", ".mkv"}


def extract_frames(video_path: Path, output_dir: Path, target_fps: float, fmt: str) -> int:
    """Extract frames from a single video file. Returns number of frames written."""
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        print(f"  ERROR: Could not open {video_path}", file=sys.stderr)
        return 0

    source_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / source_fps if source_fps > 0 else 0

    print(f"  Source: {source_fps:.1f} FPS, {total_frames} frames, {duration:.1f}s")

    # Create a sub-directory per video
    video_out_dir = output_dir / video_path.stem
    video_out_dir.mkdir(parents=True, exist_ok=True)

    # Calculate frame interval
    frame_interval = source_fps / target_fps if target_fps < source_fps else 1

    written = 0
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Check if this frame should be sampled
        if frame_idx >= written * frame_interval:
            timestamp = frame_idx / source_fps
            filename = f"frame_{written:04d}_t{timestamp:.2f}s.{fmt}"
            filepath = video_out_dir / filename
            cv2.imwrite(str(filepath), frame)
            written += 1

        frame_idx += 1

    cap.release()
    print(f"  Extracted {written} frames -> {video_out_dir}")
    return written


def main():
    parser = argparse.ArgumentParser(description="Extract video frames at a target FPS")
    parser.add_argument("input", type=str, help="Video file or directory containing videos")
    parser.add_argument("--fps", type=float, default=10, help="Target extraction FPS (default: 10)")
    parser.add_argument("--out-dir", type=str, default=None, help="Output directory (default: temp dir)")
    parser.add_argument("--format", type=str, default="png", choices=["png", "jpg"], help="Image format (default: png)")
    args = parser.parse_args()

    input_path = Path(args.input).resolve()

    # Collect video files
    if input_path.is_file():
        videos = [input_path]
    elif input_path.is_dir():
        videos = sorted([f for f in input_path.iterdir() if f.suffix.lower() in VIDEO_EXTENSIONS])
    else:
        print(f"ERROR: {input_path} is not a valid file or directory", file=sys.stderr)
        sys.exit(1)

    if not videos:
        print(f"No video files found in {input_path}", file=sys.stderr)
        sys.exit(1)

    # Set up output directory
    using_temp = args.out_dir is None
    if using_temp:
        output_dir = Path(tempfile.mkdtemp(prefix="emtd_frames_"))
    else:
        output_dir = Path(args.out_dir).resolve()
        output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Output directory: {output_dir}")
    print(f"Target FPS: {args.fps}")
    print(f"Format: {args.format}")
    print(f"Videos to process: {len(videos)}")
    print()

    total_written = 0
    for video in videos:
        print(f"Processing: {video.name}")
        count = extract_frames(video, output_dir, args.fps, args.format)
        total_written += count
        print()

    print(f"Done. {total_written} total frames extracted to: {output_dir}")

    if using_temp:
        print(f"\nThis is a temp directory. To clean up, delete: {output_dir}")
        print("Or pass --out-dir to specify a persistent location.")

    return str(output_dir)


if __name__ == "__main__":
    main()
