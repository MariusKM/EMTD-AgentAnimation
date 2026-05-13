"""
Detect eye + foot anchors on the first processed frame of a keyed clip.

Writes a sidecar `anchors.json` into the clip directory. The webapp's alignment
UI reads/writes this file; compose_frames.py reads it when run with
--align-to-template.

Anchor source priority (eye):
  1. MediaPipe FaceMesh  — uses landmarks 33 (right eye outer) and 263 (left eye
     outer) averaged. Most reliable on 3/4-view stylized faces when available.
  2. OpenCV Haar eye cascade  — classical, noisy but zero-extra-dep fallback.
  3. Heuristic  — bbox_top + 0.18 * bbox_height (chibi proportions, low confidence).

Foot is alpha-bbox bottom by default (fast, exact). If a hero has a
long cloak/robe the result will need manual correction in the webapp.

Usage:
    python detect_anchors.py <clip_dir>                    # single clip
    python detect_anchors.py <Animations_parent> --all     # every clip dir under parent
    python detect_anchors.py <clip_dir> --force            # overwrite existing anchors.json
    python detect_anchors.py <clip_dir> --frame N          # measure on frame N (default 0)

Sidecar schema (anchors.json):
{
  "schemaVersion": 1,
  "frame": { "width": 1280, "height": 720, "index": 0, "path": "Processed/frame_000000.png" },
  "eye":  { "x": 640.0, "y": 288.0, "confidence": 0.92, "source": "mediapipe" },
  "foot": { "x": 645.0, "y": 656.0, "confidence": 1.00, "source": "alpha-bbox" },
  "detectedAt": "2026-04-21T14:30:00Z",
  "notes": ""
}
"""

import argparse
import datetime as dt
import json
import sys
from pathlib import Path

import cv2
import numpy as np


SCHEMA_VERSION = 1


def find_first_rgba_frame(clip_dir: Path, frame_index: int = 0) -> tuple[Path | None, str]:
    """Locate the reference frame — prefer Processed/ (post-key), fall back to FG+Matte."""
    processed = clip_dir / "Processed"
    if processed.is_dir():
        frames = sorted(processed.glob("*.png"))
        if frames and frame_index < len(frames):
            return frames[frame_index], "Processed"

    fg_dir = clip_dir / "FG"
    matte_dir = clip_dir / "Matte"
    if fg_dir.is_dir() and matte_dir.is_dir():
        fg_frames = sorted(fg_dir.glob("*.png"))
        if fg_frames and frame_index < len(fg_frames):
            return fg_frames[frame_index], "FG+Matte"

    return None, ""


def load_rgba(frame_path: Path, matte_dir: Path | None) -> np.ndarray | None:
    """Load an RGBA image. If the frame is BGR and matte_dir is provided, compose alpha from matte."""
    img = cv2.imread(str(frame_path), cv2.IMREAD_UNCHANGED)
    if img is None:
        return None
    if img.ndim == 3 and img.shape[2] == 4:
        return img

    if matte_dir is not None:
        matte_path = matte_dir / frame_path.name
        if matte_path.exists():
            matte = cv2.imread(str(matte_path), cv2.IMREAD_GRAYSCALE)
            if matte is not None:
                if matte.shape[:2] != img.shape[:2]:
                    matte = cv2.resize(matte, (img.shape[1], img.shape[0]))
                bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
                bgra[:, :, 3] = matte
                return bgra
    return None


def detect_foot_from_alpha(alpha: np.ndarray, threshold: int = 10) -> tuple[float, float, float]:
    """(x, y, confidence) — bottom-most alpha row, x is mean of bottom-2 rows."""
    mask = alpha >= threshold
    if not mask.any():
        return float(alpha.shape[1] / 2), float(alpha.shape[0] - 1), 0.0
    ys, xs = np.where(mask)
    max_y = int(ys.max())
    bottom = ys >= (max_y - 2)
    return float(xs[bottom].mean()), float(max_y), 1.0


def detect_eye_mediapipe(bgr: np.ndarray, alpha: np.ndarray | None) -> tuple[float, float, float] | None:
    """Return (x, y, confidence) from MediaPipe FaceMesh, or None if unavailable / no face."""
    try:
        import mediapipe as mp  # type: ignore
    except ImportError:
        return None

    mesh = mp.solutions.face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.3,
    )
    try:
        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        if alpha is not None:
            # Composite over a neutral mid-gray — MediaPipe prefers opaque input.
            a = (alpha.astype(np.float32) / 255.0)[..., None]
            rgb = (rgb.astype(np.float32) * a + 128.0 * (1.0 - a)).astype(np.uint8)
        result = mesh.process(rgb)
        if not result.multi_face_landmarks:
            return None

        lm = result.multi_face_landmarks[0].landmark
        h, w = bgr.shape[:2]
        # 33 = right-eye outer corner, 263 = left-eye outer corner (MediaPipe canonical).
        x = (lm[33].x + lm[263].x) * 0.5 * w
        y = (lm[33].y + lm[263].y) * 0.5 * h
        return float(x), float(y), 0.9
    finally:
        mesh.close()


def detect_eye_haar(bgr: np.ndarray) -> tuple[float, float, float] | None:
    cascade_path = Path(cv2.__file__).parent / "data" / "haarcascade_eye.xml"
    if not cascade_path.exists():
        return None
    cascade = cv2.CascadeClassifier(str(cascade_path))
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    eyes = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(20, 20))
    if len(eyes) == 0:
        return None
    # Take the two largest, average centers.
    eyes = sorted(eyes, key=lambda e: -(e[2] * e[3]))[:2]
    cxs = [float(x + w * 0.5) for (x, y, w, h) in eyes]
    cys = [float(y + h * 0.5) for (x, y, w, h) in eyes]
    return sum(cxs) / len(cxs), sum(cys) / len(cys), 0.5


def detect_eye_heuristic(alpha: np.ndarray) -> tuple[float, float, float]:
    """Last-resort: eye ~ 18% below top of alpha bbox, horizontally centered on bbox."""
    mask = alpha >= 10
    if not mask.any():
        return float(alpha.shape[1] / 2), float(alpha.shape[0] * 0.25), 0.1
    ys, xs = np.where(mask)
    top_y, bot_y = int(ys.min()), int(ys.max())
    left_x, right_x = int(xs.min()), int(xs.max())
    return (left_x + right_x) * 0.5, top_y + (bot_y - top_y) * 0.18, 0.2


def detect_anchors_on_rgba(rgba: np.ndarray) -> dict:
    """Run eye + foot detection on an already-loaded RGBA image. Returns a partial
    anchors dict (no `frame.path`, caller fills in context). Used by both the clip
    pipeline and the single-image --image mode."""
    bgr = rgba[:, :, :3]
    alpha = rgba[:, :, 3] if rgba.shape[2] == 4 else np.full(rgba.shape[:2], 255, dtype=np.uint8)
    h, w = rgba.shape[:2]

    eye_src = "heuristic"
    eye = detect_eye_mediapipe(bgr, alpha)
    if eye is not None:
        eye_src = "mediapipe"
    else:
        eye = detect_eye_haar(bgr)
        if eye is not None:
            eye_src = "haar"
        else:
            eye = detect_eye_heuristic(alpha)

    foot_x, foot_y, foot_conf = detect_foot_from_alpha(alpha)

    return {
        "frame": {"width": w, "height": h},
        "eye":   {"x": round(eye[0], 2), "y": round(eye[1], 2), "confidence": round(eye[2], 3), "source": eye_src},
        "foot":  {"x": round(foot_x, 2), "y": round(foot_y, 2), "confidence": round(foot_conf, 3), "source": "alpha-bbox"},
    }


def detect_anchors_for_clip(clip_dir: Path, frame_index: int = 0) -> dict:
    frame_path, source_kind = find_first_rgba_frame(clip_dir, frame_index)
    if frame_path is None:
        raise FileNotFoundError(f"No reference frame found in {clip_dir}. Looked in Processed/ and FG+Matte/.")

    matte_dir = clip_dir / "Matte" if source_kind == "FG+Matte" else None
    rgba = load_rgba(frame_path, matte_dir)
    if rgba is None:
        raise RuntimeError(f"Failed to load or compose RGBA from {frame_path}")

    partial = detect_anchors_on_rgba(rgba)

    try:
        rel = frame_path.relative_to(clip_dir).as_posix()
    except ValueError:
        rel = frame_path.name

    return {
        "schemaVersion": SCHEMA_VERSION,
        "frame": { **partial["frame"], "index": frame_index, "path": rel },
        "eye":   partial["eye"],
        "foot":  partial["foot"],
        "detectedAt": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "notes": "",
    }


def detect_anchors_on_image(image_path: Path) -> dict:
    """Run detection on a single RGBA PNG (e.g. a hero source) and return the partial
    anchors dict as JSON-ready. Used by the FFLFBuilder auto-align flow."""
    rgba = cv2.imread(str(image_path), cv2.IMREAD_UNCHANGED)
    if rgba is None:
        raise FileNotFoundError(image_path)
    if rgba.ndim == 2:
        rgba = cv2.cvtColor(rgba, cv2.COLOR_GRAY2BGRA)
    elif rgba.shape[2] == 3:
        rgba = cv2.cvtColor(rgba, cv2.COLOR_BGR2BGRA)
    return detect_anchors_on_rgba(rgba)


def is_clip_dir(p: Path) -> bool:
    return p.is_dir() and (
        (p / "Processed").is_dir() or ((p / "FG").is_dir() and (p / "Matte").is_dir())
    )


def main():
    ap = argparse.ArgumentParser(description="Detect eye + foot anchors for a keyed clip.")
    ap.add_argument("path", help="Clip dir (with Processed/ or FG+Matte/), parent with multiple clip dirs, or a single RGBA PNG when --image is set")
    ap.add_argument("--all", action="store_true", help="Treat path as a parent and process every clip dir under it")
    ap.add_argument("--force", action="store_true", help="Overwrite existing anchors.json")
    ap.add_argument("--frame", type=int, default=0, help="Frame index to measure on (default 0)")
    ap.add_argument(
        "--image",
        action="store_true",
        help="Treat path as a single RGBA PNG; print the partial anchors dict to stdout as JSON and exit (no anchors.json written).",
    )
    args = ap.parse_args()

    root = Path(args.path).resolve()
    if not root.exists():
        print(f"ERROR: not found: {root}", file=sys.stderr); sys.exit(1)

    if args.image:
        result = detect_anchors_on_image(root)
        print(json.dumps(result))
        return

    targets: list[Path]
    if args.all:
        targets = sorted([p for p in root.iterdir() if is_clip_dir(p)])
    else:
        if not is_clip_dir(root):
            print(f"ERROR: {root} is not a clip dir (need Processed/ or FG+Matte/)", file=sys.stderr); sys.exit(1)
        targets = [root]

    if not targets:
        print(f"No clip dirs found under {root}", file=sys.stderr); sys.exit(1)

    ok, skipped, failed = 0, 0, 0
    for clip in targets:
        out = clip / "anchors.json"
        if out.exists() and not args.force:
            print(f"  skip (exists): {clip.name}")
            skipped += 1
            continue
        try:
            data = detect_anchors_for_clip(clip, args.frame)
            out.write_text(json.dumps(data, indent=2))
            eye_c = data["eye"]["confidence"]; eye_s = data["eye"]["source"]
            print(f"  ok: {clip.name:32s} eye=({data['eye']['x']:.0f},{data['eye']['y']:.0f}) conf={eye_c:.2f} [{eye_s}] foot=({data['foot']['x']:.0f},{data['foot']['y']:.0f})")
            ok += 1
        except Exception as e:
            print(f"  FAIL: {clip.name}: {e}", file=sys.stderr)
            failed += 1

    print(f"\nDone. ok={ok} skipped={skipped} failed={failed}")


if __name__ == "__main__":
    main()
