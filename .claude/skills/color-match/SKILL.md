---
name: color-match
description: Build, save, and apply LAB-space color-correction profiles to game-sprite renders. Use when the user wants to correct color drift in generated images (e.g. a terracotta wash, blue-shift, or character-specific palette drift in fal/Comfy output) by learning a transform from a drifted→clean reference pair and batch-applying it. Mirrors the input directory's subfolder structure when batch-applying.
argument-hint: build|apply|combine|list [...args]
---

# Color Match (EMTD)

Standalone CLI wrapper around the Empire Titan Color Match toolkit. **Learn** a LAB-space color-correction profile from a reference pair (drifted source → clean target), **save** it as a JSON preset, and **batch-apply** it to a folder of images while mirroring the input's subdirectory structure.

Shares preset format with the [ComfyUI EmpireTitan Nodes](D:/2025/Stillfront/Comfy/EmpireTitanNodes/) — presets built here are interchangeable with presets built in Comfy, but each side stores them in its own local presets dir.

## Methods

- **`reinhard`** *(default)* — LAB mean+std transfer. Low-parameter, generalizes well across palettes. Use for cross-character correction and combined "universal" presets.
- **`hist`** — LAB per-channel histogram matching. Stronger match but can clip highlights when applied to a different palette than the reference pair. Use for same-character correction.

## Scripts

- `scripts/color_match_cli.py` — build / apply / list
- `scripts/combine_presets.py` — average multiple presets into a "universal" one
- `scripts/presets/` — saved profile JSONs (gitted; ~20 lines for reinhard, ~800 bytes for hist)

Invoke with the project venv (it has `numpy` + `opencv-python`):

```bash
.venv/Scripts/python .claude/skills/color-match/scripts/color_match_cli.py <cmd> [...]
```

## Workflow 1 — Build + save a new profile

The user provides a **drifted** reference image (typical bad output from the AI pipeline) and a **clean** reference image (same subject, correct colors). The CLI learns the transform that maps drifted → clean and persists it.

```bash
# Learn + save (reinhard, the default)
.venv/Scripts/python .claude/skills/color-match/scripts/color_match_cli.py build \
  --source path/to/drifted.png \
  --target path/to/clean.png \
  --save <profile_name>

# Same, with histogram matching (stronger but palette-specific)
.venv/Scripts/python .claude/skills/color-match/scripts/color_match_cli.py build \
  --source drifted.png --target clean.png \
  --method hist --save <profile_name>

# Learn + save + apply to a folder in one shot
.venv/Scripts/python .claude/skills/color-match/scripts/color_match_cli.py build \
  --source drifted.png --target clean.png \
  --save <profile_name> \
  --apply-dir <input_dir> --out-dir <output_dir>
```

The profile lands at `.claude/skills/color-match/scripts/presets/<profile_name>.json`. Names are sanitized to alphanumerics + `-_` only. `--no-overwrite` blocks accidental clobber of an existing profile.

**Picking the reference pair.** The drifted source and clean target must be the **same subject in the same pose** — the transform is learned per-pixel-pair in LAB. Mask handling: if the inputs have an alpha channel, foreground pixels (alpha > 16/255) are used and the background is ignored. Provide RGBA PNGs whenever possible so the chroma backdrop doesn't bias the stats.

## Workflow 2 — Batch-apply a saved profile (recursive, mirrored)

The CLI walks the input directory recursively by default and **mirrors the subfolder structure** to the output directory.

```bash
.venv/Scripts/python .claude/skills/color-match/scripts/color_match_cli.py apply \
  --preset <profile_name> \
  --apply-dir <input_dir> \
  --out-dir <output_dir> \
  --strength 1.0
```

- **`--apply-dir`** — input root. Walked with `rglob` by default; pass `--non-recursive` to process only top-level files.
- **`--out-dir`** — output root. Mirrors the input layout exactly. Created on demand. If omitted, defaults to `<input_dir>_matched/`.
- **`--strength`** — 0.0 (no change) to 1.0 (fully matched). Use values like 0.7–0.9 when the profile over-corrects.
- **`--alpha-thresh`** — alpha threshold for the foreground mask, 0–255 (default 16). Pixels below this are passed through unchanged so background / transparent regions aren't tinted.
- **Accepted extensions**: `.png`, `.jpg`, `.jpeg`, `.tif`, `.tiff`, `.webp`, `.bmp`.
- **Bit-depth preservation**: 16-bit PNGs and TIFFs round-trip at 16-bit; 8-bit inputs stay 8-bit. The LAB math always runs at float32.

Example with subdirectories:

```
input/
├── Archer/
│   ├── L1.png
│   └── L5.png
└── Cavalry/
    └── L10.png
```

After `--apply-dir input --out-dir out`:

```
out/
├── Archer/
│   ├── L1.png
│   └── L5.png
└── Cavalry/
    └── L10.png
```

## Workflow 3 — Combine multiple profiles into a universal preset

If you have per-character presets and want a single "universal" correction that averages out per-character palette quirks while keeping the shared AI-pipeline drift, combine them:

```bash
# Pick specific profiles
.venv/Scripts/python .claude/skills/color-match/scripts/combine_presets.py \
  --presets cli_diana cli_moneybags cli_spy \
  --save cli_universal

# Or every preset in the dir
.venv/Scripts/python .claude/skills/color-match/scripts/combine_presets.py \
  --all --save pooled_all
```

Constraints: all selected profiles must share the same method (you can't combine `reinhard` + `hist`). Reinhard combines as an equal-weight mean of the 4 stat vectors; hist combines as a pointwise LUT mean.

This averages the **parameters** of the transforms, not the outputs of running each transform separately and averaging those — a first-order approximation that works well in practice. For true ensembling, run each profile separately and blend the resulting images externally.

## Workflow 4 — List saved profiles

```bash
.venv/Scripts/python .claude/skills/color-match/scripts/color_match_cli.py list
```

Prints each profile name with its method (`reinhard` or `hist`).

## Tips

- **Reinhard for new units / cross-character work; hist for same-character correction.** Reinhard's 12 floats generalize better across palettes; hist's three 256-entry LUTs match the reference pair's distribution exactly and can clip highlights when applied to a different palette.
- **Always provide alpha-channel inputs when possible.** The CLI uses `alpha > 16/255` to define the foreground; without an alpha channel every pixel including the backdrop contributes to the stats, which biases the transform toward the backdrop color.
- **Start at `--strength 1.0`**, then dial back if the correction is too aggressive. Profiles built from a single reference pair sometimes over-correct adjacent palettes — `--strength 0.7` often lands cleaner.
- **Don't re-build a profile on top of an already-corrected image.** The drifted source must be the raw AI output, not a previous color-match pass.
- **Profiles travel with the repo.** `scripts/presets/*.json` is gitted, so a new clone has the existing `cli_*` profiles ready to use.
- **Round-trip works with the Comfy node.** A profile built here loads in the ComfyUI `Color Match (EMTD)` node if you drop the JSON into Comfy's `EmpireTitanNodes/presets/` dir, and vice versa.

## Argument hints

When `$ARGUMENTS` is empty, ask the user which subcommand they want and what reference pair / preset / input dir to use. Confirm the planned `--out-dir` before running a batch apply, especially if it doesn't already exist — the CLI creates it without prompting.
