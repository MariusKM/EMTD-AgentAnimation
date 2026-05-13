# Cavalry — Rank Progression Pipeline

10-level PNG progression for the EMTD Cavalry unit (L1 → L10 + L9.5 bridge), produced by chaining per-level deltas through `fal-ai/nano-banana-pro/edit` with denoise + diff-mask composite between every step.

> **Read [CLAUDE.md](CLAUDE.md) before doing anything in this directory.** It points to `../Archer/CLAUDE.md` for the shared pipeline rules and contains Cavalry-specific deltas (locked composite-only chain, mounted spearman + real chestnut horse archetype, mustache-only face, horse-pose preservation rule, silhouette mightiness rule).

> **Skill-driven pipeline.** Run via `/unit-progression Cavalry`. Generation, cleanup pass (default ESRGAN 2× saved at 2K; NAFNet deblur on the ESRGAN-upscaled raw as fallback — chain runs at 2K throughout), composite-keeper, QC, and Drive upload all run from the shell — see CLAUDE.md § Part 4 recipes.

---

## Files

| Path | Purpose |
|------|---------|
| [Cavalry.md](Cavalry.md) | L1 base character spec — face, pose, surcoat livery, spear, horse + caparison. The canonical "what L1 looks like" reference, updated only if `Refs/L1_Base.png` is replaced. |
| [Cavalry_Progression_Plan.md](Cavalry_Progression_Plan.md) | 10-level ramp + tier structure + per-level beat list. Single source of truth for what each level should look like. |
| [CLAUDE.md](CLAUDE.md) | Pipeline + visual learnings (Cavalry-specific). Read alongside `../Archer/CLAUDE.md` for shared rules. |
| [Refs/L1_Base.png](Refs/L1_Base.png) | Ground-truth L1 source (1024×1024 native, downscaled from 2K). Scale + framing anchor for the entire chain. |
| [Refs/L1_Base_2K.png](Refs/L1_Base_2K.png) | Original 2048×2048 source (backup). |
| [Prompts/](Prompts/) | Per-level prompt JSONs (authored just-in-time at the start of each level, NOT all at scaffold time). |
| [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md) | Diff-mask composite tool. Cavalry-locked thresholds `--low 15 --high 35` (intensity, dim-invariant) + 2K-era spatial knobs `--pool 24 --mask-blur 6 --dilate 20` (Cavalry's `--pool 12` from 1K was doubled to `24` on 2026-05-13 alongside the chain bump to 2K; `mask-blur` and `dilate` follow the project-wide 2K defaults). Centralized at `.claude/skills/composite-keeper/scripts/composite_keeper.py`. |
| [out/](out/) | Per-version run outputs (`out/v<N>/L<n>/...`). Final deliverable in `out/v<N>/Final/`. |

## Per-level workflow (loop for every level L2 → L10)

For each level, follow the same loop. Only differences level-to-level: (a) which prompt JSON drives it; (b) which prior composite is the chain input; (c) tier-break vs within-tier (affects `--dilate` for the composite step).

1. **Read the prompt** in `Prompts/cavalry_edit_L<n-1>_to_L<n>.json` (or author it from the Plan beat list if not yet authored).
2. **Set up output dirs**: `out/v<N>/L<n>/{variants,sidecars,composite}/`.
3. **Upload inputs** to FAL CDN — prior composite (`image_urls[0]`) + `Refs/L1_Base.png` scale anchor (`image_urls[1]`). L1_Base uploads once per chain run, reuse the URL.
4. **Generate 4 seeds** (S, S+1, S+2, S+3). Build 4 payloads with `num_images: 1`. Write a sidecar JSON per call immediately on POST.
5. **POST 4 calls in parallel** to `https://queue.fal.run/fal-ai/nano-banana-pro/edit`. Capture `request_id` in each sidecar.
6. **Poll** every 15s per request until COMPLETED.
7. **Download** the 4 outputs to `variants/cavalry_L<n>_v<1..4>.png`.
8. **Measure framing** on all 4 (Archer CLAUDE.md § Part 1 § I). Flag any drift > ±5% from the locked envelope (vfill 77.6% / hfill 60.6% / top 11.4% / bot 10.9%).
9. **Present 4 variants** to the user with per-variant micro-review + Adds/Removes checklist. **No auto-picks.**
10. **On lock**: clean up the RAW keeper FIRST (default = ESRGAN 2× supersample at `https://queue.fal.run/fal-ai/esrgan` with `{"scale": 2}`, output saved at 2048×2048 as-is; fallback = ESRGAN-upscale the raw to 2K then NAFNet deblur at `https://queue.fal.run/fal-ai/nafnet/deblur` when the user reports ESRGAN issues) → `composite/cavalry_L<n>_v<i>_denoise.png` (2048×2048).
11. **Composite** the denoised raw against the prior level's composite using the [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md): `python .claude/skills/composite-keeper/scripts/composite_keeper.py --low 15 --high 35 --pool 24 --mask-blur 6 --dilate 20 ...` (override `--dilate 30` for L4, `--dilate 40` for L7 and L10). Cavalry-locked thresholds (15/35 pool=24 at 2K; was pool=12 at 1K) deviate from Archer/Infantry's 10/25 pool=16 — see CLAUDE.md § Part 3 § 15. Spatial knobs (`pool`, `mask-blur`, `dilate`) were doubled 2026-05-13 alongside the chain bump to 2K; not yet empirically recalibrated, retune if QC drifts.
12. **Inspect QC** (`_qc.png` + `_qc.json`). Resolve every warning before chaining forward.
13. **Chain forward**: the new `_composited.png` becomes `image_urls[0]` for the next level.

## Status table

| Level | Tier | Prompt authored? | Generated? | Locked? | Composited? |
|-------|------|------------------|-------------|---------|-------------|
| L1 | Light Lancer (base) | — | — | YES (ground truth, `Refs/L1_Base.png`) | — |
| L2 | Light Lancer | YES (2026-05-06) | — | — | — |
| L3 | Light Lancer | — | — | — | — |
| L4 | Hussar (tier-break) | — | — | — | — |
| L5 | Hussar | — | — | — | — |
| L6 | Hussar | — | — | — | — |
| L7 | Knight (tier-break) | — | — | — | — |
| L8 | Knight | — | — | — | — |
| L9 | Knight | — | — | — | — |
| L9.5 | Royal bridge | — | — | — | — |
| L10 | Royal Champion | — | — | — | — |

Update this table as each level locks.

## Pre-flight (completed 2026-05-06)

- [x] L1_Base downscaled 2048→1024 via LANCZOS; 2K source backed up at `Refs/L1_Base_2K.png`.
- [x] Framing measured + locked: vfill **77.64%**, hfill **60.64%**, top **11.43%**, bot **10.94%**, left **21.58%**, right **17.77%**. Numbers written into [Cavalry.md](Cavalry.md) § Framing and [CLAUDE.md](CLAUDE.md) § Part 2 § C.
- [x] Archetype call resolved (option A): faithful to L1_Base — spearman on real chestnut horse with red+blue checkered caparison; Kingshot refs treated as style-intensity inspiration only (not literal kit/mount references).
- [x] Composite tool: now centralized as the [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md) (`.claude/skills/composite-keeper/scripts/composite_keeper.py`) — no per-unit copy needed.
- [x] Plan authored: [Cavalry_Progression_Plan.md](Cavalry_Progression_Plan.md) — 11 levels (L1-L10 + L9.5), three armor tiers + royal topper.
- [x] L2 prompt authored: [Prompts/cavalry_edit_L1_to_L2.json](Prompts/cavalry_edit_L1_to_L2.json) — 4 visible adds, single-input from L1_Base, `num_images: 1` reproducible mode.

## Open todos before firing the L2 chain

- [ ] User sign-off on Plan + L2 prompt (this README presentation).
- [ ] Decide v-number for the first run (`out/v1/`) and fire the L2 chain (4 seeds in parallel).
