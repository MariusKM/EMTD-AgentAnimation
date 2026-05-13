# EMTD Archer Unit — 10-Level Progression

Visual progression for the Archer unit in **Goodgame Empire: Titans & Dragons** (EMTD), a Stillfront / Goodgame mobile kingdom-builder game in the Supercell / Kingshot art lineage. The Archer line ramps from a basic conscript at L1 to a royal elite at L10, with each level introducing clearly visible armor / equipment upgrades while preserving the unit's identity (pose, face, livery colors, silhouette anchors).

> **Skill-driven pipeline.** Run via `/unit-progression Archer`. The agent uploads inputs, builds payloads, POSTs to the FAL queue directly (`curl`/`python` per CLAUDE.md § Part 1 § A), writes sidecars, polls, downloads, runs the cleanup pass (default ESRGAN 2× saved at 2048×2048; NAFNet deblur applied to the ESRGAN-upscaled raw as fallback — chain runs at 2K throughout) + composite-keeper from the shell (CLAUDE.md § Part 4 recipes).

## What we are doing

We're producing **10 PNG renders** (`L1_Base.png` → `archer_L10.png`) representing the Archer's rank progression. The same character at every level — same pose, same face, same scale, same canvas — with progressively more elaborate armor and kit. Each level must be readable at thumbnail scale as a distinct rank step from its neighbors.

### Two ground-truth anchors
- **L1 — Baseline Conscript** ([Refs/L1_Base.png](Refs/L1_Base.png)) — rescaled / reframed by the team to a clean 1024×1024 canvas; this is the canonical input image and scale anchor for every generation.
- **L10 — Royal Elite** ([../Source/Ref/Archer/level10archer.png](../Source/Ref/Archer/level10archer.png)) — the top-tier reference; the progression must visually arrive here at L10.

### Three armor tiers + royal topper
| Tier | Levels | Material read | Within-tier arc |
|------|--------|---------------|-----------------|
| **Tier 1 — Leather Scout** | L1–L3 | Cloth + leather, no metal | Bare-armed conscript → leather kit complete → full leather scout |
| **Tier 2 — Scale Mail** | L4–L6 | Scale mail + leather over-pieces | Basic mail (sleeves arrive) → mid mail (coif, studded pauldrons) → heavy mail with leather over-jerkin + first gold |
| **Tier 3 — Plate** | L7–L9 | Steel plate over mail | Basic plate (open helm, breastplate) → mid plate (gold trim, tassets first) → heavy plate (closed visor, gold accents) |
| **L10 — Royal Elite** | L10 | Plate + full gold accents + golden bow | Full gold spike finial + fully gold recurve bow |

Inside each tier, levels go **base → mid → top** with three to five distinct visible additions per step. Between tiers, the silhouette and material change meaningfully.

## How we are doing it

### Tooling
- **Image generation**: `fal-ai/nano-banana-pro/edit` (image-to-image edit endpoint). Run via the `fal-api-skills` skill at [.claude/skills/fal-api-skills/](../../.claude/skills/fal-api-skills/) — see [CLAUDE.md](CLAUDE.md) for the exact curl payload structure.
- **Output spec**: 1024×1024 PNG, 1:1 aspect, clean white background.
- **Resolution**: `1K` for review iterations; bump to `2K`/`4K` for final delivery.
- **Cost / time**: ~30–90s per 4-variant batch. Each `num_images: 4` call gives 4 variants for the same prompt.

### Input strategy (REVISED 2026-05-07: SINGLE-INPUT CHAINED ONLY)

**LOCKED 2026-05-07**: every chained generation uses **a SINGLE input** = the previous level's composited keeper. **Do NOT also send `Refs/L1_Base.png` as a second image.**

- **L2 (chain origin)**: single input = `Refs/L1_Base.png` (this is L2's content reference, not an anchor).
- **L3 onward (every level — within-tier AND tier-break)**: single input = previous level's composited keeper.
- **Tier-break anchored prompts (`archer_edit_L1_to_L4.json`, `archer_edit_L1_to_L7.json`) are DEPRECATED** in v3+. The chained variants (`archer_edit_L3_to_L4.json`, `archer_edit_L6_to_L7.json`) are the only L4 / L7 prompts in use.
- **L10**: single input = L9.5 composited keeper (already single-input).

Why the change: the previous v2-era rule sent `Refs/L1_Base.png` as `image_urls[1]` "scale anchor" on every chained call. In practice this caused chronic content drift (dagger sheath disappearing at L4, kit feature regression, gold accent soft-fails) because the model pulled features from both reference images. The framing-anchor benefit was largely illusory — the per-level prompt's FRAMING block already describes the canonical envelope numbers exactly, and the diff-mask composite step (CLAUDE.md § L) carries framing forward pixel-locked regardless. The cost (drift) outweighed the benefit (perceived framing lock). See [CLAUDE.md § Part 1 § B](CLAUDE.md) for the full rationale.

### Per-level workflow
1. **Prompt** — author/edit `Prompts/archer_edit_L<n-1>_to_L<n>.json` (or `archer_edit_L1_to_L<n>.json` for tier-break levels). Each prompt carries the EDIT GOAL, all carried-over kit from prior levels (numbered list), the preserve / pose / framing / style blocks, and an extensive negative list.
2. **Upload** — push the input image(s) to FAL CDN via [.claude/skills/fal-api-skills/skills/fal-generate/scripts/upload.sh](../../.claude/skills/fal-api-skills/skills/fal-generate/scripts/upload.sh).
3. **Pick mode** — fast mode (`num_images: 4`, single call, NOT seed-reproducible) for routine keeper-selection passes; reproducible mode (4 parallel `num_images: 1` calls with distinct seeds) when you need to revisit, A/B with a pinned baseline, or do drift calibration. The fal endpoint honors the seed only at `num_images: 1` (verified empirically — see [CLAUDE.md § A2](CLAUDE.md)).
4. **Generate seed(s)** — fast mode: one seed via `SEED=$(python -c "import secrets; print(secrets.randbelow(2**31))")`. Reproducible mode: four seeds (e.g. `S, S+1, S+2, S+3`).
5. **POST** — fast mode: one payload with `num_images: 4`. Reproducible mode: four parallel payloads with `num_images: 1` each. Endpoint: `https://queue.fal.run/fal-ai/nano-banana-pro/edit`.
6. **Sidecar(s)** — write `out/v<N>/L<n>/archer_L<n>_seed<S>.json` immediately on each submission (one sidecar per call) with seed, request_id, prompt_file, prompt_sha256, image_urls, input_files, payload params, output filenames. In fast mode the seed is audit-only; in reproducible mode the seed re-creates that variant byte-identical. See [CLAUDE.md § A2](CLAUDE.md).
7. **Poll** — every 15s until status `COMPLETED` (typically 30–90s).
8. **Download** — pull the image URL(s) from each result and save to `out/v<N>/L<n>/archer_L<n>_v<1..4>.png` (fast mode: 4 from one batch; reproducible mode: 1 per call × 4 calls).
9. **Measure framing** — verify the 4 outputs match L1_Base's 1024×1024 / 74.7% v.fill / 13.5% top / 11.8% bot / 56.8% h.fill. (fill≈99.9% / top≈0% is the checkerboard-BG bug, not a framing fail — re-roll.)
10. **Review** — present all 4 variants to the team for keeper selection. **No auto-picks.**
11. **Clean up the RAW keeper FIRST** (CLAUDE.md § G2, § K — must run BEFORE the composite, never after) — upload the raw 1024×1024 keeper to FAL, then:
    - **Default**: POST to `https://queue.fal.run/fal-ai/esrgan` with `{"image_url": "...", "scale": 2}`, fetch the 2048×2048 result, and save it **as-is** to `out/v<N>/L<n>/composite/archer_L<n>_v<i>_denoise.png` — no downscale (LOCKED 2026-05-13; the chain runs at 2K, deliverables are 2K). Faster + cheaper than NAFNet.
    - **Fallback** (when the user reports issues with the ESRGAN-cleaned composite — over-sharpening, halo, washed brushwork, color drift): first ESRGAN-upscale the raw to 2K (same call as above), then POST to `https://queue.fal.run/fal-ai/nafnet/deblur` with `{"image_url": "<raw_2k_url>"}` and save the 2048×2048 result to the same `_denoise.png` path. NAFNet preserves dim — running it on the 1024 raw would lock a 1024 keeper into a 2K chain.
    - Skip only when the raw keeper is visibly clean — but even then, ESRGAN-upscale the raw to 2K so the chain dims match.
12. **Composite the DENOISED raw** (mandatory drift-mitigation — CLAUDE.md § L) — run the [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md) against the previous level's composited keeper:
    ```bash
    python .claude/skills/composite-keeper/scripts/composite_keeper.py \
      --raw    out/v<N>/L<n>/composite/archer_L<n>_v<i>_denoise.png \
      --input  out/v<N>/L<n-1>/composite/archer_L<n-1>_v<j>_composited.png \
      --low 10 --high 25 \
      --output out/v<N>/L<n>/composite/archer_L<n>_v<i>_composited.png \
      --qc-image out/v<N>/L<n>/composite/archer_L<n>_v<i>_qc.png \
      --qc-json  out/v<N>/L<n>/composite/archer_L<n>_v<i>_qc.json
    ```
    v2-locked thresholds `--low 10 --high 25` (intensity-based, dim-invariant) preserve face/hood/cape better than the original 5/15. Spatial knobs default to `--pool 16 --mask-blur 6 --dilate 20` at 2K (doubled 2026-05-13 from the 1K `8 / 3 / 10` — geometric scaling, not yet empirically recalibrated). For tier breaks (L1→L4, L1→L7, L9→L9.5) bump `--dilate 30` (was 15 at 1K) or `40` for very large edit areas.
13. **Inspect QC** — open the QC image and resolve any printed warnings before chaining. Metrics reference in CLAUDE.md § L.1.
14. **Chain forward** — the composited keeper becomes the SINGLE `image_urls` entry in the next-level prompt (single-input chained, locked 2026-05-07). **Do NOT also send L1_Base as a second image.** **Never chain off the raw keeper.** **Never run the cleanup pass (ESRGAN or NAFNet) on the composite** — cleanup drift on the preserved regions defeats the composite's purpose.
15. **Final delivery** (only after the full L1–L10 chain is locked) — assemble `out/v<N>/Final/` per CLAUDE.md § Part 4 "Final delivery": copy each locked composite into `Final/L<n>.png` (level-label only), then build `progression_compilation.png` (11264×1024 horizontal stack) + `progression_compilation_thumb.png` (2816×256 review). This is the deliverable hand-off.

### Continuity anchors (held across all 10 levels)
- **Pose**: bow arm down at hip with bow vertical; draw arm bent ~90° with forearm horizontal across chest, closed fist at chest center, knuckles outward. Calm hero stance, never an active draw.
- **Face / proportions**: ~2.5–3 head chibi, peachy-tan skin, dark-brown short hair under hood, warm-brown eyes, closed-mouth half-smirk, asymmetric brow with anatomical-LEFT brow higher, **clean-shaven** smooth jawline (face anchor revised 2026-05-05 — stubble shadow removed because the model over-rendered it as a five o'clock shadow at L8). Eyes/brow visible L1–L7; covered L8 (half-visor); fully concealed L9–L10 (closed visor).
- **Hand convention**: bow in **anatomical-LEFT** hand (viewer-RIGHT side of frame); draw hand is **anatomical-RIGHT** (viewer-LEFT side).
- **Cape**: crimson red, knee-length, plain hem — present at every level.
- **Trousers**: olive / forest green, knee-length — every level (partially covered by greaves from L3+).
- **Boots**: warm-brown leather with darker folded ankle cuff — every level.
- **Quiver**: brown leather back-quiver over the anatomical-LEFT shoulder, white-feather red-tip arrows — every level.
- **Livery (red + mustard yellow)**: must remain visible somewhere on the chest at L1–L7, then migrates to alternating tassets at L8–L10. **Core EMTD identity** — the way you read the unit at thumbnail scale. See [CLAUDE.md § Visual Anchors](CLAUDE.md) for details.
- **Style**: Supercell / Kingshot stylized mobile game art, hand-painted digital illustration, soft painted shading, warm subsurface skin, saturated rich colors, warm shadow tones. Clean thin black silhouette outline in deep warm brown-black.
- **Framing**: 1024×1024 canvas, character ~75% vertical fill, ~13.5% top margin, ~12% bottom margin, ~57% horizontal width, vertically centered.

## Directory structure

```
UnitProgression/Archer/
├── README.md                          # This file — project overview
├── CLAUDE.md                          # Pipeline + visual-style learnings (read this first when working in this dir)
├── Archer.md                          # L1 base character spec — pose, face, color breakdown, prompt fragment
├── Archer_Lvl10.md                    # L10 ground-truth detailed spec
├── Archer_Progression_Plan.md         # Full 10-level ramp plan with tier structure, beat tables, color migration, open questions
├── Prompts/                           # Per-level image-edit prompt JSONs (ready to fire against fal-ai/nano-banana-pro/edit)
│   ├── archer_edit_L1_to_L2.json      # Tier 1: L1 → L2 (Leather Kit Complete)
│   ├── archer_edit_L2_to_L3.json      # Tier 1: L2 → L3 (Full Leather Scout)
│   ├── archer_edit_L1_to_L4.json      # Tier 2 BREAK (anchored): L1_Base → L4 (Basic Scale Mail)
│   ├── archer_edit_L3_to_L4.json      # Tier 2 BREAK (chained alternative, 2026-05-05): L3 keeper denoised → L4
│   ├── archer_edit_L4_to_L5.json      # Tier 2: L4 → L5 (Mid Scale Mail) — within-tier chain
│   ├── archer_edit_L5_to_L6.json      # Tier 2: L5 → L6 (Heavy Mail + Over-Jerkin + First Gold)
│   ├── archer_edit_L1_to_L7.json      # Tier 3 BREAK (anchored): L1_Base → L7 (Basic Plate)
│   ├── archer_edit_L7_to_L8.json      # Tier 3: L7 → L8 (Mid Plate)
│   ├── archer_edit_L8_to_L9.json      # Tier 3: L8 → L9 (Heavy Plate)
│   ├── archer_edit_L9_to_L9_5.json    # Tier 3: L9 → L9.5 (Royal-Grade Plate Graduation, bridge level)
│   ├── archer_edit_L9_5_to_L10.json   # L9.5 → L10 (Royal Elite)
│   └── legacy/                        # Deprecated / superseded prompts (anchored L2-L6 set, early L5/L6 variants, etc.)
├── Refs/
│   ├── L1_Base.png                    # CANONICAL L1 input + scale anchor (1024x1024, 74.7% v.fill)
│   ├── L10_Base.png                   # Top-tier ground truth
│   └── README.md                      # Notes on what reference images are kept here
├── out/                               # Generation outputs — 4 variants per level
│   ├── v0/                            # Pre-cleanup generations (archived) — L2…L10 + L9.5 keepers
│   ├── v1/                            # First composited+cleanup chain (legacy flat layout per level dir; cleanup model was NAFNet deblur — historical default before the 2026-05-13 ESRGAN switch)
│   └── v2/                            # Fully-chained run (no L1-anchored tier breaks); per-level subdir layout (locked 2026-05-05)
│       ├── L<n>/
│       │   ├── variants/              # archer_L<n>_v<1..4>.png — the 4 raw variants downloaded from fal
│       │   ├── sidecars/              # archer_L<n>_seed<S>.json — one sidecar per call (reproducible mode = 4 sidecars per level)
│       │   └── composite/             # archer_L<n>_v<keeper>_composited.png + _qc.png + _qc.json + optional _composited_denoise.png
│       └── Final/                     # Final delivery hand-off after the full chain is locked
│           ├── L1.png … L10.png + L9_5.png   # locked composite per level, named by level label only
│           ├── progression_compilation.png       # 11264x1024 horizontal compilation (11 tiles)
│           └── progression_compilation_thumb.png # 2816x256 thumbnail review
├── experiments/                        # Off-pipeline R&D — drift calibration, composite parameter sweeps
│   └── seed_calibration/               # Decision rationale for the composite defaults (CLAUDE.md § L)
└── Variants/                           # Older per-level variant docs (mostly superseded by the Progression Plan)
```

## Status (as of 2026-05-04)

| Level | Tier | Status | Locked keeper |
|-------|------|--------|----------------|
| L1 | Leather base | ✅ Ground truth (`Refs/L1_Base.png`) | — |
| L2 | Leather mid | ✅ Generated, locked | `out/L2/archer_L2_v3.png` |
| L3 | Leather top | ✅ Generated, locked (re-run after arm regression fix) | `out/L3/archer_L3_v4.png` |
| L4 | Scale-mail base (Tier 2 break) | ✅ Generated, locked | `out/L4/archer_L4_v3.png` |
| L5 | Scale-mail mid | ✅ Generated, locked | `out/L5/archer_L5_v3.png` |
| L6 | Scale-mail top | ✅ Generated, locked (Tier 2 complete) | `out/L6/archer_L6_v4.png` |
| L7 | Plate base (Tier 3 break) | ✅ Generated, locked | `out/L7/archer_L7_v1.png` |
| L8 | Plate mid | ✅ Generated, locked | `out/L8/archer_L8_v4.png` |
| L9 | Plate top | ✅ Generated, locked | `out/L9/archer_L9_v3.png` |
| L9.5 | Royal-grade plate graduation (intermediate) | ✅ Generated, locked | `out/L9_5/archer_L9_5_v1.png` |
| L10 | Royal Elite (ground truth) | ✅ Ground truth (`Refs/L10_Base.png`) | — |

## Reading order for someone picking up this project

1. **This file** — overview and current status.
2. **[CLAUDE.md](CLAUDE.md)** — operational learnings (input strategy, vocabulary risks, drift patterns, prompt structure conventions). Read before authoring or editing prompts.
3. **[Archer_Progression_Plan.md](Archer_Progression_Plan.md)** — the full 10-level ramp with tier structure, per-level beats, summary table, and color-migration table. The single source of truth for what each level should look like.
4. **[Archer.md](Archer.md)** — L1 base character spec (canonical pose, face, color breakdown, prompt fragment).
5. **[Archer_Lvl10.md](Archer_Lvl10.md)** — L10 top-tier spec.
6. The two ground-truth images in `Refs/L1_Base.png` and `../Source/Ref/Archer/level10archer.png`.
7. Pick the next level, open the matching prompt JSON in `Prompts/`, and follow the per-level workflow in this file's "How we are doing it" section.
8. **Always run the [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md) on every locked keeper before chaining forward** — see CLAUDE.md § L. Skipping this step compounds drift across the chain.
