"""
Standalone CLI for Empire Titan Color Match.

Same preset format as the ComfyUI node - presets live in ../presets/ and are
interchangeable between the CLI and the node.

Two modes:

  build  : learn a color correction from a reference pair (source -> target).
           Optionally save as a preset and/or apply to images.
  apply  : load a saved preset and apply it to images.

Usage:
  # Learn + save + apply in one shot
  python color_match_cli.py build \\
      --source drifted.png --target clean.png \\
      --method reinhard --save moneybags \\
      --apply sheet.png --out sheet_matched.png

  # Apply a saved preset to a folder of frames
  python color_match_cli.py apply \\
      --preset moneybags \\
      --apply-dir ./frames --out-dir ./frames_matched --strength 0.8

Dependencies: numpy, opencv-python.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import cv2


PRESETS_DIR = Path(__file__).resolve().parent / "presets"
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".webp", ".bmp"}


# ---------- image / mask I/O ----------

def load_rgba(path: Path) -> tuple[np.ndarray, np.dtype]:
    """Load image as BGRA float32 [0,1], preserving full input precision.
    Returns (rgba_float, original_dtype) so writer can restore bit depth."""
    img = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    if img is None:
        raise FileNotFoundError(path)
    original_dtype = img.dtype

    if img.dtype == np.uint16:
        f = img.astype(np.float32) / 65535.0
    elif img.dtype == np.uint8:
        f = img.astype(np.float32) / 255.0
    else:
        f = np.clip(img.astype(np.float32) / 255.0, 0.0, 1.0)

    if f.ndim == 2:
        f = cv2.cvtColor(f, cv2.COLOR_GRAY2BGRA)
    elif f.shape[2] == 3:
        f = cv2.cvtColor(f, cv2.COLOR_BGR2BGRA)
    return f, original_dtype


def write_rgba(path: Path, rgba_f: np.ndarray, original_dtype) -> None:
    """Write output, matching the input bit depth (8 or 16 bit)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    clipped = np.clip(rgba_f, 0.0, 1.0)
    if original_dtype == np.uint16:
        out = (clipped * 65535.0 + 0.5).astype(np.uint16)
    else:
        out = (clipped * 255.0 + 0.5).astype(np.uint8)
    cv2.imwrite(str(path), out)


def foreground_mask(rgba_f: np.ndarray, alpha_thresh: int = 16) -> np.ndarray:
    """alpha_thresh is in 8-bit units (0..255); applied against the float alpha."""
    if rgba_f.shape[2] < 4:
        return np.ones(rgba_f.shape[:2], dtype=bool)
    return rgba_f[:, :, 3] > (alpha_thresh / 255.0)


# ---------- color math (mirrors EmpireTitanNodes/color_match.py) ----------

def _build_channel_lut(src_vals: np.ndarray, tgt_vals: np.ndarray) -> np.ndarray:
    src_hist, _ = np.histogram(src_vals, bins=256, range=(0, 256))
    tgt_hist, _ = np.histogram(tgt_vals, bins=256, range=(0, 256))
    src_cdf = np.cumsum(src_hist).astype(np.float64)
    tgt_cdf = np.cumsum(tgt_hist).astype(np.float64)
    src_cdf /= max(src_cdf[-1], 1)
    tgt_cdf /= max(tgt_cdf[-1], 1)
    lut = np.interp(src_cdf, tgt_cdf, np.arange(256))
    return np.clip(lut, 0, 255).astype(np.uint8)


def _rgba_f_to_bgr_u8(rgba_f: np.ndarray) -> np.ndarray:
    """For preset building, downcast float BGR to uint8 so stats live in the same
    8-bit LAB space the ComfyUI node uses - keeps presets interchangeable."""
    bgr_u8 = (np.clip(rgba_f[:, :, :3], 0.0, 1.0) * 255.0 + 0.5).astype(np.uint8)
    return bgr_u8


def build_hist_model(src_rgba_f, tgt_rgba_f, src_mask, tgt_mask):
    src_lab = cv2.cvtColor(_rgba_f_to_bgr_u8(src_rgba_f), cv2.COLOR_BGR2LAB)
    tgt_lab = cv2.cvtColor(_rgba_f_to_bgr_u8(tgt_rgba_f), cv2.COLOR_BGR2LAB)
    luts = [
        _build_channel_lut(src_lab[:, :, c][src_mask], tgt_lab[:, :, c][tgt_mask])
        for c in range(3)
    ]
    return ("hist", {"luts": luts})


def build_reinhard_model(src_rgba_f, tgt_rgba_f, src_mask, tgt_mask):
    src_lab = cv2.cvtColor(_rgba_f_to_bgr_u8(src_rgba_f), cv2.COLOR_BGR2LAB).astype(np.float32)
    tgt_lab = cv2.cvtColor(_rgba_f_to_bgr_u8(tgt_rgba_f), cv2.COLOR_BGR2LAB).astype(np.float32)
    stats = {}
    for name, lab, mask in (("src", src_lab, src_mask), ("tgt", tgt_lab, tgt_mask)):
        means, stds = [], []
        for c in range(3):
            vals = lab[:, :, c][mask]
            means.append(float(vals.mean()))
            stds.append(float(vals.std() + 1e-6))
        stats[name + "_mean"] = np.array(means, dtype=np.float32)
        stats[name + "_std"] = np.array(stds, dtype=np.float32)
    return ("reinhard", stats)


def apply_model(rgba_f: np.ndarray, model, mask: np.ndarray, strength: float) -> np.ndarray:
    """Apply a color-match preset to a float32 [0,1] BGRA image.

    LAB math is done in float precision against the OpenCV float LAB range
    (L in [0,100], a,b in [-127,127]). Presets are stored in 8-bit LAB
    coordinates, so we temporarily convert the image into that same scaled
    space, apply the transform, and convert back - no pixel quantization.
    """
    method, data = model
    bgr_f = rgba_f[:, :, :3].astype(np.float32)
    lab_f = cv2.cvtColor(bgr_f, cv2.COLOR_BGR2LAB)  # L:[0,100], a,b:[-127,127]

    # Scale float LAB to "virtual 8-bit LAB" coordinates (OpenCV's convention:
    # L_u8 = L_f * 255/100; a_u8 = a_f + 128; b_u8 = b_f + 128).
    scales = np.array([255.0 / 100.0, 1.0, 1.0], dtype=np.float32)
    shifts = np.array([0.0, 128.0, 128.0], dtype=np.float32)
    lab_vu8 = lab_f * scales + shifts  # float, but in 8-bit value range
    lab_out_vu8 = lab_vu8.copy()

    if method == "hist":
        luts = data["luts"]
        for c in range(3):
            ch = lab_vu8[:, :, c]
            ch_clamped = np.clip(ch, 0.0, 255.0)
            # Linear-interpolated LUT lookup to avoid quantization banding.
            i0 = np.floor(ch_clamped).astype(np.int32)
            i1 = np.minimum(i0 + 1, 255)
            frac = ch_clamped - i0
            lut = luts[c].astype(np.float32)
            mapped = lut[i0] * (1.0 - frac) + lut[i1] * frac
            blended = (1.0 - strength) * ch + strength * mapped
            lab_out_vu8[:, :, c] = np.where(mask, blended, ch)
    else:  # reinhard
        sm, ss = data["src_mean"], data["src_std"]
        tm, ts = data["tgt_mean"], data["tgt_std"]
        for c in range(3):
            ch = lab_vu8[:, :, c]
            shifted = (ch - sm[c]) * (ts[c] / max(float(ss[c]), 1e-6)) + tm[c]
            blended = (1.0 - strength) * ch + strength * shifted
            lab_out_vu8[:, :, c] = np.where(mask, blended, ch)

    lab_out_f = (lab_out_vu8 - shifts) / scales
    out_bgr_f = cv2.cvtColor(lab_out_f, cv2.COLOR_LAB2BGR)
    out_bgr_f = np.clip(out_bgr_f, 0.0, 1.0)

    out = rgba_f.copy()
    out[:, :, :3] = np.where(mask[:, :, None], out_bgr_f, bgr_f)
    return out


# ---------- preset (de)serialization ----------

def serialize_model(model) -> dict:
    method, data = model
    if method == "hist":
        return {"method": "hist", "luts": [lut.tolist() for lut in data["luts"]]}
    return {
        "method": "reinhard",
        "src_mean": data["src_mean"].tolist(),
        "src_std": data["src_std"].tolist(),
        "tgt_mean": data["tgt_mean"].tolist(),
        "tgt_std": data["tgt_std"].tolist(),
    }


def deserialize_model(d: dict):
    method = d["method"]
    if method == "hist":
        luts = [np.array(lut, dtype=np.uint8) for lut in d["luts"]]
        return ("hist", {"luts": luts})
    return ("reinhard", {
        "src_mean": np.array(d["src_mean"], dtype=np.float32),
        "src_std": np.array(d["src_std"], dtype=np.float32),
        "tgt_mean": np.array(d["tgt_mean"], dtype=np.float32),
        "tgt_std": np.array(d["tgt_std"], dtype=np.float32),
    })


def _sanitize_name(name: str) -> str:
    return "".join(c for c in name if c.isalnum() or c in ("-", "_")).strip()


def save_preset(model, name: str, overwrite: bool = True) -> Path:
    PRESETS_DIR.mkdir(exist_ok=True)
    safe = _sanitize_name(name)
    if not safe:
        raise ValueError("Preset name must contain at least one alphanumeric char.")
    path = PRESETS_DIR / f"{safe}.json"
    if path.exists() and not overwrite:
        raise FileExistsError(f"Preset '{safe}' exists and --no-overwrite was set.")
    path.write_text(json.dumps(serialize_model(model), indent=2))
    return path


def load_preset(name: str):
    path = PRESETS_DIR / f"{name}.json"
    if not path.exists():
        raise FileNotFoundError(f"Preset not found: {path}")
    return deserialize_model(json.loads(path.read_text()))


# ---------- apply helpers ----------

def apply_to_path(in_path: Path, out_path: Path, model, strength: float,
                  alpha_thresh: int = 16) -> None:
    img_f, orig_dtype = load_rgba(in_path)
    mask = foreground_mask(img_f, alpha_thresh)
    matched = apply_model(img_f, model, mask, strength)
    write_rgba(out_path, matched, orig_dtype)


def apply_to_dir(in_dir: Path, out_dir: Path, model, strength: float,
                 alpha_thresh: int = 16, recursive: bool = True) -> int:
    """Walk in_dir (recursively by default) and mirror structure into out_dir."""
    walker = in_dir.rglob("*") if recursive else in_dir.iterdir()
    files = sorted(
        p for p in walker
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS
    )
    for p in files:
        rel = p.relative_to(in_dir)
        apply_to_path(p, out_dir / rel, model, strength, alpha_thresh)
    return len(files)


# ---------- CLI ----------

def _add_apply_args(p):
    g = p.add_argument_group("apply (optional)")
    g.add_argument("--apply", help="Image to correct")
    g.add_argument("--apply-dir", help="Directory of images to correct")
    g.add_argument("--out", help="Output image path (single mode)")
    g.add_argument("--out-dir", help="Output directory (batch mode)")
    g.add_argument("--strength", type=float, default=1.0,
                   help="0=original, 1=fully matched (default 1.0)")
    g.add_argument("--alpha-thresh", type=int, default=16,
                   help="Alpha threshold for foreground masking (default 16)")
    g.add_argument("--non-recursive", action="store_true",
                   help="Only process --apply-dir's top level; skip subfolders")


def _run_apply(args, model):
    if args.apply:
        apply_to_path(Path(args.apply), Path(args.out or "matched.png"),
                      model, args.strength, args.alpha_thresh)
        print(f"wrote {args.out or 'matched.png'}")
    if args.apply_dir:
        in_dir = Path(args.apply_dir)
        out_dir = Path(args.out_dir or (in_dir.name + "_matched"))
        n = apply_to_dir(in_dir, out_dir, model, args.strength, args.alpha_thresh,
                         recursive=not args.non_recursive)
        print(f"wrote {n} files to {out_dir}")


def cmd_build(args):
    src, _ = load_rgba(Path(args.source))
    tgt, _ = load_rgba(Path(args.target))
    src_mask = foreground_mask(src, args.alpha_thresh)
    tgt_mask = foreground_mask(tgt, args.alpha_thresh)

    if args.method == "hist":
        model = build_hist_model(src, tgt, src_mask, tgt_mask)
    else:
        model = build_reinhard_model(src, tgt, src_mask, tgt_mask)
    print(f"built {args.method} model from {args.source} -> {args.target}")

    if args.save:
        path = save_preset(model, args.save, overwrite=not args.no_overwrite)
        print(f"saved preset: {path}")

    if args.apply or args.apply_dir:
        _run_apply(args, model)


def cmd_apply(args):
    model = load_preset(args.preset)
    print(f"loaded preset '{args.preset}' ({model[0]})")
    if not (args.apply or args.apply_dir):
        print("warning: no --apply or --apply-dir given, nothing to do")
        return
    _run_apply(args, model)


def cmd_list(args):
    PRESETS_DIR.mkdir(exist_ok=True)
    names = sorted(p.stem for p in PRESETS_DIR.glob("*.json"))
    if not names:
        print("(no presets)")
        return
    for n in names:
        data = json.loads((PRESETS_DIR / f"{n}.json").read_text())
        print(f"  {n:30s}  {data.get('method', '?')}")


def main():
    ap = argparse.ArgumentParser(
        prog="color_match_cli",
        description="Empire Titan Color Match - CLI (shares preset format with the ComfyUI node)",
    )
    sub = ap.add_subparsers(dest="cmd", required=True)

    pb = sub.add_parser("build", help="Learn a correction from a reference pair")
    pb.add_argument("--source", required=True, help="Drifted reference image")
    pb.add_argument("--target", required=True, help="Clean reference image")
    pb.add_argument("--method", choices=("reinhard", "hist"), default="reinhard")
    pb.add_argument("--save", help="Preset name to save (omit to only apply, not save)")
    pb.add_argument("--no-overwrite", action="store_true",
                    help="Fail if preset name already exists")
    _add_apply_args(pb)
    pb.set_defaults(func=cmd_build)

    pa = sub.add_parser("apply", help="Apply a saved preset")
    pa.add_argument("--preset", required=True, help="Preset name (without .json)")
    _add_apply_args(pa)
    pa.set_defaults(func=cmd_apply)

    pl = sub.add_parser("list", help="List saved presets")
    pl.set_defaults(func=cmd_list)

    args = ap.parse_args()
    try:
        args.func(args)
    except (FileNotFoundError, FileExistsError, ValueError) as e:
        print(f"error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
