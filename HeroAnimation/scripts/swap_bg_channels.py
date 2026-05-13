"""Swap B and G channels on every PNG in one or more directories.

Used by the webapp's blue-screen keying path: the raw mp4 has its B/G channels
swapped before being fed to CorridorKey (so the green-only despill in
CorridorKeyModule/core/color_utils.py despill() sees what was originally blue
spill as if it were green spill and removes it correctly). After CorridorKey
finishes, this script swaps B/G back on the FG/, Comp/, Processed/ PNG
sequences so downstream tooling and review surfaces see the character's true
colors. The Matte/ dir contains grayscale alpha and is not touched.

Usage:
    python swap_bg_channels.py <dir> [<dir> ...]

The swap is in-place and idempotent (running twice restores the original).
RGB and RGBA are both handled; alpha is preserved as-is.
"""
from __future__ import annotations

import argparse
import os
import sys
from typing import Iterable

import numpy as np
from PIL import Image


def swap_png(path: str) -> None:
    img = Image.open(path)
    mode = img.mode
    if mode not in ("RGB", "RGBA"):
        # Grayscale / palette — leave alone.
        return
    arr = np.array(img)
    # Swap channels 1 and 2 (G <-> B). Channel 0 (R) and channel 3 (A, if present) untouched.
    arr[..., [1, 2]] = arr[..., [2, 1]]
    Image.fromarray(arr, mode=mode).save(path)


def iter_pngs(roots: Iterable[str]) -> Iterable[str]:
    for root in roots:
        if not os.path.isdir(root):
            continue
        for name in sorted(os.listdir(root)):
            if name.lower().endswith(".png"):
                yield os.path.join(root, name)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("dirs", nargs="+", help="One or more directories of PNGs to swap B<->G in place.")
    args = ap.parse_args()

    n = 0
    for png in iter_pngs(args.dirs):
        swap_png(png)
        n += 1
        if n % 50 == 0:
            print(f"  swapped {n}", flush=True)
    print(f"  swapped {n} PNGs across {len(args.dirs)} dir(s)", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
