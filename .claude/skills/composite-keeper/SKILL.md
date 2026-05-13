---
name: composite-keeper
description: Apply drift-mitigation diff-mask composite to a locked keeper PNG against its prior-level chain input. Run AFTER a level keeper is selected (and optionally NAFNet-deblurred), BEFORE chaining forward to the next level. Preserves L_input pixels byte-perfect in unchanged regions while keeping L_raw pixels in edit regions. Outputs the composited PNG plus a 5-tile QC review image and a QC metrics JSON. Used by the EMTD unit-progression pipeline (Archer / Infantry / Cavalry / future units).
argument-hint: --raw <keeper.png> --input <prior_composited.png> --output <out.png> [--low 10 --high 25 --dilate 10] [--qc-image ...] [--qc-json ...]
---

# Composite Keeper

Drift-mitigation composite for chained image edits in the unit-progression pipeline.

## What it does

For a freshly locked level keeper (`L_raw`) and the prior level's composited keeper (`L_input`), build a per-pixel mask from `|L_raw - L_input|` and composite:

- `mask = 1` → use **L_input** pixel (preserved, byte-perfect — face/cape/legs the model lightly retouched)
- `mask = 0` → use **L_raw** pixel (the actual edit — new armor / kit piece)
- `0 < mask < 1` → linear blend at the boundary

This bounds drift across the L1→L10 chain without needing a no-op calibration call.

## Script

Located at: `.claude/skills/composite-keeper/scripts/composite_keeper.py`

Run with the project's local `.venv`:

```bash
.venv/Scripts/python .claude/skills/composite-keeper/scripts/composite_keeper.py \
  --raw    out/v<N>/L<n>/composite/<unit>_L<n>_v<keeper>_denoise.png \
  --input  out/v<N>/L<n-1>/composite/<unit>_L<n-1>_v<j>_composited.png \
  --low 10 --high 25 \
  --output out/v<N>/L<n>/composite/<unit>_L<n>_v<keeper>_composited.png \
  --qc-image out/v<N>/L<n>/composite/<unit>_L<n>_v<keeper>_qc.png \
  --qc-json  out/v<N>/L<n>/composite/<unit>_L<n>_v<keeper>_qc.json
```

If `$ARGUMENTS` is empty, ask the user which raw keeper / input pair to composite.

## Locked defaults (v2 onward)

| Flag | Locked default | Rationale |
|------|---------------|-----------|
| `--low` | **10** | The original `5` leaked faint face touch-ups (model lightly retouches the face on every edit) into the composite's edit zone, producing a residual blob over the brow/eyes. `10` keeps the face byte-locked. |
| `--high` | **25** | Pairs with `--low 10` for a clean threshold band. |
| `--pool` | 8 (gaussian sigma) | Smooths the diff before thresholding so the mask isn't leopard-spotted. |
| `--mask-blur` | 3 (gaussian sigma) | Soft-feathered boundary to avoid visible mask seams. |
| `--dilate` | **10 px** (within-tier) | Grows the edit zone outward so the mask captures soft halos around the actual edit. |

**Tier-break dilation bumps:**
- `--dilate 15` for tier breaks (Archer L4 / L7, Infantry L4 / L7, Cavalry equivalents) — larger edit area (sleeves, plate transitions).
- `--dilate 20` for very large edit areas — e.g. helm reshape + finial replacement at L10.

The locked defaults were established by the seed_calibration experiments (2026-05-05; see `UnitProgression/<UnitName>/experiments/seed_calibration/composite_boundary_test/`).

## QC — healthy ranges

After every composite, open `_qc.png` (5-tile: `L_input | L_raw | composite | mask | residual`) and `_qc.json` (metrics). Resolve any printed warnings before chaining forward — they propagate.

| Metric | Healthy range | Reading the failure |
|--------|---------------|---------------------|
| `mask_avg_pct` | 70–95% | <30% = barely any preservation; >99% = no edit captured |
| `transition_pct` | <10% | Large soft band → sharper thresholds or smaller `--mask-blur` |
| `preserved_drift_mean_abs` | <0.5 | Unchanged regions still drift; check `--input` matches expected prior composite |
| `edit_signal_mean_abs` | >5 | Very weak edit; prompt may not have made changes or thresholds too tight |
| `edit_fidelity_mean_abs` | <0.5 | (composite vs L_raw inside edit zone — should be near-0 because composite IS the raw inside the edit zone) |
| `mask_islands` | <30 | Leopard-spotted mask → bump `--pool` |

The residual tile should be bright ONLY in the actual edit zones (the new kit pieces) and near-black in unchanged regions (face, cape, legs). Unexpected brightness in unchanged regions = drift survived; bump thresholds, dilation, or pool sigma.

## CLI reference

```
--raw        Path to the locked keeper PNG (L_raw, ideally NAFNet-deblurred first)
--input      Path to the previous chain input PNG (L_input — the prior level's composite)
--output     Path to write the composited PNG

--low        Lower diff threshold (default 10; locked)
--high       Upper diff threshold (default 25; locked)
--pool       Diff-pool gaussian sigma (default 8)
--mask-blur  Mask blur gaussian sigma (default 3)
--dilate     Edit-zone dilation in px (default 10; bump 15 at tier breaks, 20 for L10)

--qc-image   Optional path for the 5-tile QC review PNG
--qc-json    Optional path for the QC metrics JSON
```

## Python API

```python
from pathlib import Path
import sys
sys.path.insert(0, ".claude/skills/composite-keeper/scripts")
from composite_keeper import composite_with_qc

composited, qc = composite_with_qc(
    L_raw_path=Path("out/v3/L4/composite/archer_L4_v2_denoise.png"),
    L_input_path=Path("out/v3/L3/composite/archer_L3_v1_composited.png"),
    output_path=Path("out/v3/L4/composite/archer_L4_v2_composited.png"),
    low=10, high=25, dilate_edit_px=15,
    qc_image_path=Path("out/v3/L4/composite/archer_L4_v2_qc.png"),
    qc_json_path=Path("out/v3/L4/composite/archer_L4_v2_qc.json"),
)
print(qc["warnings"])
```

## Critical ordering rules

- **Denoise the raw keeper FIRST, then composite.** Never NAFNet the composite — it would drift the bytes-locked face/hood/cape from upstream. See `UnitProgression/Archer/CLAUDE.md` § Part 1 § G2.
- **Never chain off the raw keeper.** The composite is what becomes `image_urls[0]` in the next level's prompt.
- **Always check QC warnings before chaining.** They propagate.

## Where this fits in the pipeline

This is **Step 11** of the per-level loop in the `unit-progression` skill. Order:

1. Generate 4 variants from chained composite + L1_Base anchor
2. User picks keeper
3. NAFNet deblur the RAW keeper → `_denoise.png`
4. **`composite-keeper` against the prior composited keeper → `_composited.png`** ← (this skill)
5. Inspect QC, resolve warnings
6. The `_composited.png` becomes `image_urls[0]` for the next level

See `.claude/skills/unit-progression/SKILL.md` for the full per-level loop.
