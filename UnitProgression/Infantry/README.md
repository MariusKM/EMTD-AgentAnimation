# Infantry — Rank Progression Pipeline

10-level PNG progression for the EMTD Infantry unit (L1 → L10 + L9.5 bridge), produced by chaining per-level deltas through `fal-ai/nano-banana-pro/edit` with denoise + diff-mask composite between every step.

> **Read [CLAUDE.md](CLAUDE.md) before doing anything in this directory.** It points to `../Archer/CLAUDE.md` for the shared pipeline rules and contains Infantry-specific deltas (locked composite-only chain, mace+round-shield archetype, silhouette mightiness rule).

> **Skill-driven pipeline.** Run via `/unit-progression Infantry`. Generation, NAFNet deblur, composite-keeper, QC, and Drive upload all run from the shell — see ../Archer/CLAUDE.md § Part 4 recipes.

---

## Files

| Path | Purpose |
|------|---------|
| [Infantry.md](Infantry.md) | L1 base character spec — face, pose, livery, weapon, shield. The canonical "what L1 looks like" reference, updated only if `Refs/L1_Base.png` is replaced. |
| [Infantry_Progression_Plan.md](Infantry_Progression_Plan.md) | 10-level ramp + tier structure + per-level beat list. Single source of truth for what each level should look like. |
| [CLAUDE.md](CLAUDE.md) | Pipeline + visual learnings (Infantry-specific). Read alongside `../Archer/CLAUDE.md` for shared rules. |
| [Refs/L1_Base.png](Refs/L1_Base.png) | Ground-truth L1 source. Scale + framing anchor for the entire chain. |
| [Prompts/](Prompts/) | Per-level prompt JSONs (authored just-in-time at the start of each level, NOT all at scaffold time). |
| [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md) | Diff-mask composite tool (locked thresholds `--low 10 --high 25`). Centralized at `.claude/skills/composite-keeper/scripts/composite_keeper.py`. |
| [out/](out/) | Per-version run outputs (`out/v<N>/L<n>/...`). Final deliverable in `out/v<N>/Final/`. |

## Per-level workflow (loop for every level L2 → L10)

For each level, follow the same loop. The only differences level-to-level are: (a) which prompt JSON drives it; (b) which prior composite is the chain input; (c) tier-break vs within-tier (affects `--dilate` for the composite step).

1. **Read the prompt** in `Prompts/infantry_edit_L<n-1>_to_L<n>.json` (or author it from the Plan beat list if not yet authored).
2. **Set up output dirs**: `out/v<N>/L<n>/{variants,sidecars,composite}/`.
3. **Upload inputs** to FAL CDN — prior composite (`image_urls[0]`) + `Refs/L1_Base.png` scale anchor (`image_urls[1]`). L1_Base uploads once per chain run, reuse the URL.
4. **Generate 4 seeds** (S, S+1, S+2, S+3). Build 4 payloads with `num_images: 1`. Write a sidecar JSON per call immediately on POST.
5. **POST 4 calls in parallel** to `https://queue.fal.run/fal-ai/nano-banana-pro/edit`. Capture `request_id` in each sidecar.
6. **Poll** every 15s per request until COMPLETED.
7. **Download** the 4 outputs to `variants/infantry_L<n>_v<1..4>.png`.
8. **Measure framing** on all 4 (Archer CLAUDE.md § Part 1 § I). Flag any drift > ±5%.
9. **Present 4 variants** to the user with per-variant micro-review. **No auto-picks.**
10. **On lock**: NAFNet deblur the RAW keeper FIRST → `composite/infantry_L<n>_v<i>_denoise.png`.
11. **Composite** the denoised raw against the prior level's composite using the [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md): `python .claude/skills/composite-keeper/scripts/composite_keeper.py --low 10 --high 25 ...` (add `--dilate 15` for L4, `--dilate 20` for L7).
12. **Inspect QC** (`_qc.png` + `_qc.json`). Resolve every warning before chaining forward.
13. **Chain forward**: the new `_composited.png` becomes `image_urls[0]` for the next level.

## Status table

| Level | Tier | Prompt authored? | Generated? | Locked? | Composited? |
|-------|------|------------------|-------------|---------|-------------|
| L1 | Levy (base) | — | — | YES (ground truth, `Refs/L1_Base.png`) | — |
| L2 | Levy | YES | YES (v1-v4) | **v4** (seed 1806049680) | YES |
| L3 | Levy | YES | YES (v1-v4) | **v1** (seed 1232142717) | YES |
| L4 | Footman (tier-break) | YES | YES (v1-v4) | **v1** (seed 2037069012) | YES (`--dilate 15`) |
| L5 | Footman | YES | YES (v1-v4) | **v4** (seed 1693598166) | YES |
| L6 | Footman | YES | YES (v1-v4) | **v2** (seed 838173245) | YES |
| L7 | Sergeant (tier-break) | YES | YES (v1-v4) | **v1** (seed 951968121) | YES (`--dilate 20`) |
| L8 | Sergeant | YES | YES (v1-v4) | **v2** (seed 1350559807) | YES |
| L9 | Sergeant | YES | YES (v1-v4) | **v3** (seed 1246567374) | YES |
| L9.5 | Royal bridge | YES | YES (v1-v4) | **v2** (seed 355278309) | YES *(omitted from Final delivery per user 2026-05-06)* |
| L10 | Royal Champion | YES | YES (v1-v4) | **v4** (seed 35681334) | YES (`--dilate 20`) |

**Final delivery (`out/v1/Final/`)** — 10 levels (L9.5 omitted): L1.png, L2.png, L3.png, L4.png, L5.png, L6.png, L7.png, L8.png, L9.png, L10.png + `progression_compilation.png` (10240×1024) + `progression_compilation_thumb.png` (2560×256). All 10 keepers locked via the chained composite-only pipeline (Rule 2). Tier-break composite uses `--dilate 15` at L4, `--dilate 20` at L7 and L10. Final delivery completed 2026-05-06.

**Uploaded to team Drive** (2026-05-06) via `gdrive-upload` skill — `hero-animation/Infantry Progression/` at https://drive.google.com/drive/folders/1VdpkWHS6WzOiYR5iivlSpgn08-nARHLh.

Update this table as each level locks.

## Open todos before firing the L2 chain

- [x] ~~Run the framing-measurement script on `Refs/L1_Base.png` and write the exact numbers into [Infantry.md](Infantry.md) § Framing and [CLAUDE.md](CLAUDE.md) § Part 2 § C.~~ Done 2026-05-06 — L1_Base downscaled to 1024×1024 (2K source backed up at [Refs/L1_Base_2K.png](Refs/L1_Base_2K.png)); locked numbers: vfill 66.80%, top 16.60%, bot 16.60%, hfill 60.84%, left 18.26%, right 20.90%.
- [x] ~~Author `Prompts/infantry_edit_L1_to_L2.json`.~~ Done 2026-05-06 — 12,138-char prompt, 4 visible adds, single-input from L1_Base, `num_images: 1` reproducible mode.
- [ ] Decide v-number for the first run (`out/v1/`) and fire the L2 chain (4 seeds in parallel).
