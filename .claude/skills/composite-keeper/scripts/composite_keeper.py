"""
composite_keeper — apply drift-mitigation composite to a locked keeper.

Run AFTER a level keeper is locked, BEFORE chaining forward to the next level.
The composite preserves L_input pixels in unchanged regions (byte-perfect)
while keeping L_raw pixels in edit regions. No no-op calibration call needed.

Default parameters were established by the seed_calibration experiments
(2026-05-05 — see ../experiments/seed_calibration/composite_boundary_test/):

    low_thresh=5, high_thresh=15, diff_pool_sigma=8, dilate_edit_px=10

For tier breaks (large edit areas like L1→L4 sleeves or L1→L7 plate) bump
dilate_edit_px to 15-20. For tiny add-ons drop dilate_edit_px to 0-5.

CLI:
  python composite_keeper.py \\
    --raw    out/L3/archer_L3_v3.png \\
    --input  out/L2/archer_L2_v3_composited.png \\
    --output out/L3/archer_L3_v3_composited.png

  Optional:
    --low 5 --high 15 --pool 8 --dilate 10 --mask-blur 3
    --qc-image out/L3/archer_L3_v3_qc.png    (debug visualization)
    --qc-json  out/L3/archer_L3_v3_qc.json   (metrics)

Python API:
  from composite_keeper import composite_with_qc
  composited, qc = composite_with_qc(L_raw_path, L_input_path,
                                     output_path, qc_image_path=...)
"""

import argparse
import json
from pathlib import Path
from typing import Optional

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import gaussian_filter, maximum_filter


# ---------- Defaults (locked 2026-05-05) ----------
DEFAULT_LOW              = 5
DEFAULT_HIGH             = 15
DEFAULT_DIFF_POOL_SIGMA  = 8
DEFAULT_MASK_BLUR_SIGMA  = 3
DEFAULT_DILATE_EDIT_PX   = 10


# ---------- IO ----------

def load_rgb(p: Path, size=(1024, 1024)) -> np.ndarray:
    img = Image.open(p)
    if img.mode == "RGBA":
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        img = Image.alpha_composite(bg, img).convert("RGB")
    else:
        img = img.convert("RGB")
    if img.size != size:
        img = img.resize(size, Image.LANCZOS)
    return np.array(img, dtype=np.int16)


def save_rgb(arr: np.ndarray, path: Path):
    a = np.clip(arr, 0, 255).astype(np.uint8)
    Image.fromarray(a, "RGB").save(path)


# ---------- Core ----------

def build_mask(
    L_raw: np.ndarray,
    L_input: np.ndarray,
    low: float = DEFAULT_LOW,
    high: float = DEFAULT_HIGH,
    diff_pool_sigma: float = DEFAULT_DIFF_POOL_SIGMA,
    mask_blur_sigma: float = DEFAULT_MASK_BLUR_SIGMA,
    dilate_edit_px: int = DEFAULT_DILATE_EDIT_PX,
) -> np.ndarray:
    """
    Returns a float32 mask in [0, 1].
      mask = 1  ->  use L_input pixel (preserve, byte-perfect)
      mask = 0  ->  use L_raw pixel   (model edit)
      0 < mask < 1  ->  linear blend at boundary
    """
    diff = L_raw.astype(np.int16) - L_input.astype(np.int16)
    diff_mag = np.abs(diff).max(axis=-1).astype(np.float32)
    if diff_pool_sigma > 0:
        diff_mag = gaussian_filter(diff_mag, sigma=diff_pool_sigma)
    mask = np.clip((high - diff_mag) / max(high - low, 1e-6), 0.0, 1.0)
    if dilate_edit_px > 0:
        edit = 1.0 - mask
        edit = maximum_filter(edit, size=dilate_edit_px * 2 + 1)
        mask = 1.0 - edit
    if mask_blur_sigma > 0:
        mask = gaussian_filter(mask, sigma=mask_blur_sigma)
        mask = np.clip(mask, 0.0, 1.0)
    return mask.astype(np.float32)


def composite(L_raw: np.ndarray, L_input: np.ndarray, mask: np.ndarray) -> np.ndarray:
    m = mask[..., None].astype(np.float32)
    out = L_input.astype(np.float32) * m + L_raw.astype(np.float32) * (1.0 - m)
    return np.clip(out, 0, 255).astype(np.uint8)


# ---------- Quality check ----------

def quality_check(
    composite_arr: np.ndarray,
    L_raw: np.ndarray,
    L_input: np.ndarray,
    mask: np.ndarray,
) -> dict:
    """
    Compute summary metrics and emit warning flags. All values in 0-255 scale.

    Targets (typical kit-add edit, e.g. L2->L3):
      mask_avg_pct       70-95     (lower for tier breaks, higher for small adds)
      preserved_drift    <0.5      (composite vs L_input in mask>=0.9 regions)
      edit_signal        >5        (composite vs L_input in mask<=0.1 regions, the actual edit)
      transition_pct     <5        (mask in (0.1, 0.9) — soft boundary band)
      mask_islands       <30       (sanity: too many = leopard-spotted mask)
    """
    comp = composite_arr.astype(np.int16)
    Lin  = L_input.astype(np.int16)
    Lraw = L_raw.astype(np.int16)

    mask_avg_pct = float(mask.mean() * 100)
    transition = (mask > 0.1) & (mask < 0.9)
    transition_pct = float(transition.mean() * 100)

    preserved = mask >= 0.9
    edit_zone = mask <= 0.1

    diff_comp_input = np.abs(comp - Lin).max(axis=-1)
    diff_comp_raw   = np.abs(comp - Lraw).max(axis=-1)

    preserved_drift = float(diff_comp_input[preserved].mean()) if preserved.any() else 0.0
    edit_signal     = float(diff_comp_input[edit_zone].mean()) if edit_zone.any() else 0.0
    edit_fidelity   = float(diff_comp_raw[edit_zone].mean()) if edit_zone.any() else 0.0

    # Count connected mask "edit islands" (regions where mask is low enough to count as edit)
    binary_edit = (mask < 0.5).astype(np.uint8)
    from scipy.ndimage import label
    _, mask_islands = label(binary_edit)

    # Warnings
    warnings = []
    if mask_avg_pct < 30:
        warnings.append(f"mask_avg_pct={mask_avg_pct:.1f}%: very low — barely any preservation, drift correction not effective")
    if mask_avg_pct > 99:
        warnings.append(f"mask_avg_pct={mask_avg_pct:.1f}%: too high — almost no edit captured; thresholds may be too loose")
    if preserved_drift > 1.0:
        warnings.append(f"preserved_drift={preserved_drift:.2f}: unchanged regions still drift; check input matches expected")
    if edit_signal < 2.0:
        warnings.append(f"edit_signal={edit_signal:.2f}: very weak edit; prompt may not have made changes or thresholds too tight")
    if mask_islands > 50:
        warnings.append(f"mask_islands={mask_islands}: leopard-spotted mask; consider larger diff_pool_sigma")
    if transition_pct > 15:
        warnings.append(f"transition_pct={transition_pct:.1f}%: large soft boundary — consider sharper thresholds or smaller mask_blur_sigma")

    return {
        "mask_avg_pct": round(mask_avg_pct, 2),
        "transition_pct": round(transition_pct, 2),
        "preserved_drift_mean_abs": round(preserved_drift, 3),
        "edit_signal_mean_abs": round(edit_signal, 3),
        "edit_fidelity_mean_abs": round(edit_fidelity, 3),
        "mask_islands": int(mask_islands),
        "warnings": warnings,
    }


def make_qc_image(
    composite_arr: np.ndarray,
    L_raw: np.ndarray,
    L_input: np.ndarray,
    mask: np.ndarray,
    qc: dict,
    path: Path,
):
    """Save a 5-tile composite review image: input | raw | composite | mask | residual."""
    cell = 512
    pad = 12
    label_h = 28
    title_h = 60
    cols = 5
    panel_w = cols * cell + (cols + 1) * pad
    panel_h = cell + label_h + 2 * pad + title_h
    panel = Image.new("RGB", (panel_w, panel_h), (28, 28, 28))
    draw = ImageDraw.Draw(panel)
    try:
        font = ImageFont.truetype("arial.ttf", 16)
        title_font = ImageFont.truetype("arialbd.ttf", 18)
    except IOError:
        font = ImageFont.load_default()
        title_font = ImageFont.load_default()

    title = (
        f"QC  mask={qc['mask_avg_pct']:.0f}%  "
        f"transition={qc['transition_pct']:.1f}%  "
        f"preserved_drift={qc['preserved_drift_mean_abs']:.2f}  "
        f"edit_signal={qc['edit_signal_mean_abs']:.1f}  "
        f"islands={qc['mask_islands']}"
    )
    if qc["warnings"]:
        title += f"   ⚠  {len(qc['warnings'])} warning(s)"
    draw.text((pad, 10), title, font=title_font, fill=(240, 240, 240))
    if qc["warnings"]:
        for i, w in enumerate(qc["warnings"][:2]):
            draw.text((pad, 30 + i * 18), w, font=font, fill=(255, 200, 80))

    def to_pil_rgb(arr_int16):
        return Image.fromarray(np.clip(arr_int16, 0, 255).astype(np.uint8), "RGB").resize((cell, cell), Image.LANCZOS)

    def to_pil_l(arr_float01):
        return Image.fromarray((arr_float01 * 255).astype(np.uint8), "L").resize((cell, cell), Image.LANCZOS).convert("RGB")

    residual = np.abs(composite_arr.astype(np.int16) - L_input.astype(np.int16)).max(axis=-1)
    residual_vis = np.clip(residual * (255.0 / 30.0), 0, 255).astype(np.uint8)
    residual_pil = Image.fromarray(residual_vis, "L").resize((cell, cell), Image.LANCZOS).convert("RGB")

    tiles = [
        ("L_input",       to_pil_rgb(L_input)),
        ("L_raw",         to_pil_rgb(L_raw)),
        ("composite",     to_pil_rgb(composite_arr.astype(np.int16))),
        ("mask",          to_pil_l(mask)),
        ("residual",      residual_pil),
    ]
    for i, (label, img) in enumerate(tiles):
        x = pad + i * (cell + pad)
        y = title_h + pad
        panel.paste(img, (x, y))
        draw.text((x + 4, y + cell + 4), label, font=font, fill=(220, 220, 220))

    panel.save(path)


# ---------- Top-level convenience ----------

def composite_with_qc(
    L_raw_path: Path,
    L_input_path: Path,
    output_path: Path,
    *,
    low: float = DEFAULT_LOW,
    high: float = DEFAULT_HIGH,
    diff_pool_sigma: float = DEFAULT_DIFF_POOL_SIGMA,
    mask_blur_sigma: float = DEFAULT_MASK_BLUR_SIGMA,
    dilate_edit_px: int = DEFAULT_DILATE_EDIT_PX,
    qc_image_path: Optional[Path] = None,
    qc_json_path: Optional[Path] = None,
) -> tuple[np.ndarray, dict]:
    L_raw   = load_rgb(L_raw_path)
    L_input = load_rgb(L_input_path)

    mask = build_mask(
        L_raw, L_input,
        low=low, high=high,
        diff_pool_sigma=diff_pool_sigma,
        mask_blur_sigma=mask_blur_sigma,
        dilate_edit_px=dilate_edit_px,
    )
    out = composite(L_raw, L_input, mask)
    save_rgb(out, output_path)

    qc = quality_check(out, L_raw, L_input, mask)
    qc["params"] = {
        "low": low, "high": high,
        "diff_pool_sigma": diff_pool_sigma,
        "mask_blur_sigma": mask_blur_sigma,
        "dilate_edit_px": dilate_edit_px,
    }
    qc["paths"] = {
        "L_raw": str(L_raw_path),
        "L_input": str(L_input_path),
        "output": str(output_path),
    }

    if qc_image_path is not None:
        make_qc_image(out, L_raw, L_input, mask, qc, Path(qc_image_path))
    if qc_json_path is not None:
        Path(qc_json_path).write_text(json.dumps(qc, indent=2))

    return out, qc


# ---------- CLI ----------

def main():
    p = argparse.ArgumentParser(description="Drift-mitigation composite for chained image edits.")
    p.add_argument("--raw",    required=True, help="Path to the locked keeper PNG (L_raw)")
    p.add_argument("--input",  required=True, help="Path to the previous chain input PNG (L_input)")
    p.add_argument("--output", required=True, help="Path to write the composited PNG")
    p.add_argument("--low",    type=float, default=DEFAULT_LOW)
    p.add_argument("--high",   type=float, default=DEFAULT_HIGH)
    p.add_argument("--pool",   type=float, default=DEFAULT_DIFF_POOL_SIGMA, dest="diff_pool_sigma")
    p.add_argument("--mask-blur", type=float, default=DEFAULT_MASK_BLUR_SIGMA, dest="mask_blur_sigma")
    p.add_argument("--dilate", type=int, default=DEFAULT_DILATE_EDIT_PX, dest="dilate_edit_px")
    p.add_argument("--qc-image", type=str, default=None, help="Optional QC review image path")
    p.add_argument("--qc-json",  type=str, default=None, help="Optional QC metrics JSON path")
    args = p.parse_args()

    out, qc = composite_with_qc(
        Path(args.raw), Path(args.input), Path(args.output),
        low=args.low, high=args.high,
        diff_pool_sigma=args.diff_pool_sigma,
        mask_blur_sigma=args.mask_blur_sigma,
        dilate_edit_px=args.dilate_edit_px,
        qc_image_path=Path(args.qc_image) if args.qc_image else None,
        qc_json_path=Path(args.qc_json) if args.qc_json else None,
    )

    print(f"Composite saved: {args.output}")
    print(f"\nQC summary:")
    print(f"  mask_avg_pct          : {qc['mask_avg_pct']:.2f} %")
    print(f"  transition_pct        : {qc['transition_pct']:.2f} %")
    print(f"  preserved_drift       : {qc['preserved_drift_mean_abs']:.3f}  (target <0.5)")
    print(f"  edit_signal           : {qc['edit_signal_mean_abs']:.3f}  (target >5)")
    print(f"  edit_fidelity         : {qc['edit_fidelity_mean_abs']:.3f}  (target <0.5)")
    print(f"  mask_islands          : {qc['mask_islands']}")
    if qc["warnings"]:
        print(f"\n  WARNINGS:")
        for w in qc["warnings"]:
            print(f"    - {w}")
    else:
        print(f"\n  No warnings.")


if __name__ == "__main__":
    main()
