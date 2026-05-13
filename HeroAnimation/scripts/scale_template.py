"""
Produce a resolution-specific copy of character-alignment.png for overlay in an editor.

The master character-alignment.png is 1000x1000. Animations render at 960x960 and
the final game delivery is 550x550. Use this to generate pixel-matched overlays:

    python scale_template.py 960
    python scale_template.py 550
    python scale_template.py 960 550          # write both

Output: character-alignment_<W>x<H>.png in the same directory as the source PNG.
"""

import argparse
import sys
from pathlib import Path

import cv2


def scale(src: Path, size: int, out_dir: Path, transparent: bool = False) -> Path:
    """Resize character-alignment.png to `size`x`size`.

    When transparent=True, additionally strips the light-pink background so only the
    magenta guide lines remain — suitable for compositing over arbitrary video.
    """
    img = cv2.imread(str(src), cv2.IMREAD_UNCHANGED)
    if img is None:
        raise FileNotFoundError(src)

    if transparent:
        # Detect magenta/pink guide pixels (low G, high B+R) and make the rest transparent.
        bgr = img[:, :, :3]
        hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, (140, 80, 80), (175, 255, 255))
        # Build RGBA where alpha = mask.
        rgba = cv2.cvtColor(bgr, cv2.COLOR_BGR2BGRA)
        rgba[:, :, 3] = mask
        img = rgba

    resized = cv2.resize(img, (size, size), interpolation=cv2.INTER_LANCZOS4)
    suffix = "_overlay" if transparent else ""
    out_path = out_dir / f"{src.stem}_{size}x{size}{suffix}.png"
    cv2.imwrite(str(out_path), resized)
    return out_path


def main():
    ap = argparse.ArgumentParser(description="Resize character-alignment.png to match a target output resolution.")
    ap.add_argument("sizes", nargs="+", type=int, help="Target sizes in pixels (square). e.g. 960 550")
    ap.add_argument(
        "--src",
        default=str(Path(__file__).parent.parent / "character-alignment.png"),
        help="Source template PNG (default: ../character-alignment.png)",
    )
    ap.add_argument(
        "--transparent",
        action="store_true",
        help="Additionally write a transparent-background overlay (lines only, for compositing over video).",
    )
    args = ap.parse_args()

    src = Path(args.src).resolve()
    if not src.exists():
        print(f"ERROR: source not found: {src}", file=sys.stderr); sys.exit(1)

    for s in args.sizes:
        out = scale(src, s, src.parent)
        print(f"  -> {out}")
        if args.transparent:
            out_t = scale(src, s, src.parent, transparent=True)
            print(f"  -> {out_t}")


if __name__ == "__main__":
    main()
