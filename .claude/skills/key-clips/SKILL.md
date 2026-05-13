---
name: key-clips
description: Run the EZ-CorridorKey headless pipeline (video → EXR frames → BiRefNet/GVM alpha hint → CorridorKey inference) on one or more clips, producing PNG FG / Matte / Comp / Processed sequences. Use when the user wants to key greenscreen/blue-rim footage into foreground + matte outputs without opening the GUI.
argument-hint: <video-or-folder> [--output-dir <path>] [--alpha birefnet+chroma|birefnet|gvm|chroma] [--despill 0.2] [--keep-project]
---

# Key Clips (EZ-CorridorKey Headless)

Automate the same pipeline the EZ-CorridorKey GUI runs, without the GUI. For each input video it:

1. Creates a temp project under `EZ-CorridorKey/Projects/`
2. Extracts the video to an EXR DWAB frame sequence
3. Runs BiRefNet + chroma-key (default) or GVM to produce an alpha hint
4. Runs CorridorKey inference → writes FG / Matte / Comp / Processed PNGs
5. Deletes the project folder afterward (unless `--keep-project`)

## Script

Located at: `<EZ-CorridorKey install dir>/scripts/batch_pipeline.py`. The default install dir is `<parent-of-repo>/EZ-CorridorKey/` (per SETUP.md Step 2 / `/setup` skill Stage 5); override via `KEYCLIPS_PYTHON` + `KEYCLIPS_SCRIPT` env vars in `webapp/.env.local` if installed elsewhere.

Run with the EZ-CorridorKey venv (NOT the Empire Titans venv — this pipeline needs torch + CUDA + the CorridorKey models):

```bash
cd "<EZ-CorridorKey install dir>" && source .venv/Scripts/activate && \
  python scripts/batch_pipeline.py -i <input> -o <output-dir> $ARGUMENTS
```

If `$ARGUMENTS` is empty, ask the user which clip(s) to process and where to put the outputs.

## Defaults (baked into the script for this project)

- **Alpha method:** `birefnet+chroma` — BiRefNet subject hint max-merged with a chroma-key hint so VFX trails/gleams that BiRefNet misses are preserved
- **Chroma mode:** `subtract` (Ultimatte / Fusion-style color-difference keyer — `alpha = 1 - clip((G - max(R,B)) / threshold, 0, 1)`); naturally soft on motion trails and spill edges
- **Despill strength:** 0.2 (default — balances green spill removal with VFX preservation)
- **Output format:** PNG for all four channels (FG, Matte, Comp, Processed)
- **Cleanup:** project folder deleted after run; outputs land flat in `--output-dir` as `FG/`, `Matte/`, `Comp/`, `Processed/`
- **Model resolution:** 2048 (full quality)

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `-i`, `--input` | required | Video file(s) or a folder of videos |
| `-o`, `--output-dir` | required | Target folder — receives `FG/Matte/Comp/Processed/` directly |
| `--alpha` | `birefnet+chroma` | `birefnet`, `gvm`, `chroma`, `birefnet+chroma`, or `gvm+chroma`. `+chroma` max-merges a chroma-key hint with the subject hint so VFX trails aren't clipped. |
| `--chroma-mode` | `subtract` | `subtract` / `distance` / `box`. Subtract is Ultimatte-style color-difference keying. |
| `--despill` | `0.2` | 0.0–1.0; raise if heavy green spill remains |
| `--refiner` | (engine default) | 0.0–3.0, 0 disables edge refinement |
| `--keep-project` | off | Keep temp project under `Projects/` for debugging |
| `--copy-source` | off | Copy source video into project folder (off = reference in place) |
| `--pool-size` | 1 | Parallel inference engines (needs VRAM headroom) |
| `--model-resolution` | 2048 | 1024 or 2048 |
| `--log-level` | `INFO` | `DEBUG` / `INFO` / `WARNING` / `ERROR` |

## Usage Examples

```bash
# Single clip → outputs into a sibling folder named after the clip
cd "<EZ-CorridorKey install dir>" && source .venv/Scripts/activate && \
  python scripts/batch_pipeline.py \
    -i "HeroAnimation/Output/<HeroName>/Animations/<ClipName>.mp4" \
    -o "HeroAnimation/Output/<HeroName>/Animations/<ClipName>"

# Whole folder of videos, GVM alpha, higher despill
python scripts/batch_pipeline.py \
  -i "HeroAnimation/Output/<HeroName>/Animations" \
  -o "HeroAnimation/Output/<HeroName>/Keyed" \
  --alpha gvm --despill 0.4

# Debug a bad key — keep the project so you can inspect Frames/ and AlphaHint/
python scripts/batch_pipeline.py -i <video> -o <dir> --keep-project --log-level DEBUG
```

## Output Layout

When `-o` points at a fresh folder, outputs land flat (no project/clip nesting):

```
<output-dir>/
├── FG/          # frame_000000.png, frame_000001.png, ...
├── Matte/
├── Comp/
└── Processed/
```

## Follow-up

After keying, the user typically runs the `compose-frames` skill to assemble the PNG sequences into `.mov` (alpha) / `.mp4` deliverables. Compose writes those final videos to the clip root next to `FG/Matte/Comp/Processed/`.

## Notes & Gotchas

- **First run downloads FFmpeg** (~210 MB) into `EZ-CorridorKey/tools/ffmpeg/` if missing. One-time.
- **First run also JIT-compiles the CorridorKey model** (~2s). Subsequent runs skip this via FX graph cache.
- **GPU required.** Script errors out cleanly on CPU-only machines.
- **Default despill is 0.2** — balances green spill removal with preservation of intentional green tones (tunic, gems). Bump via `--despill 0.3`–`0.5` if heavy green spill remains on hair or edges.
- Model switching (BiRefNet → inference) is handled internally — no manual unload needed.
- For batch runs, the service is initialized once and models are reloaded as needed per clip.
