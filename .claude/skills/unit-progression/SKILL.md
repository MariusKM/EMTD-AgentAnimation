---
name: unit-progression
description: Run the EMTD unit rank-progression pipeline (L1 → L10 PNG renders showing armor/kit upgrades). Use when starting or continuing a unit progression for any EMTD military unit (Archer is the pilot; same pipeline applies to future units). Walks through chained image-edit generation via fal-ai/nano-banana-pro/edit, NAFNet deblur, diff-mask compositing, and final delivery assembly.
argument-hint: <UnitName> [--level <L2..L10>]
---

# Unit Progression Pipeline

Produce 10 PNG renders (`L1.png` → `L10.png` plus `L9_5.png`) showing a single EMTD unit's rank progression — same character, same pose, same scale, progressively richer armor/kit. The pipeline chains per-level deltas through `fal-ai/nano-banana-pro/edit`, with each locked keeper denoised + composited against the prior level to bound drift across the chain.

The Archer unit is the pilot implementation; the pipeline structure (input strategy, denoise-then-composite order, sidecars, final delivery) is generic. For new units, mirror the Archer's directory and prompt-file shape.

## Setup

Read these files before starting:

- `UnitProgression/<UnitName>/README.md` — project overview + per-level workflow + status table
- `UnitProgression/<UnitName>/CLAUDE.md` — pipeline + visual-style learnings (READ THIS FIRST when working in the unit dir). Particularly:
  - **§ Part 0** — output directory layout (`variants/`, `sidecars/`, `composite/`, `Final/`)
  - **§ Part 1 § A2** — seed reproducibility (only honored at `num_images: 1` — reproducible mode = 4 parallel `num_images: 1` calls with distinct seeds)
  - **§ Part 1 § B** — input strategy: SINGLE-INPUT CHAINED ONLY (LOCKED 2026-05-07). Every chained level uses ONE input = the previous level's composited keeper. Do NOT also send `Refs/L1_Base.png` as a second image. Anchored tier-break prompts are deprecated.
  - **§ Part 1 § G2 + § K** — NAFNet deblur the **RAW keeper FIRST**, then composite (never NAFNet the composite)
  - **§ Part 1 § L** — diff-mask composite (mandatory drift mitigation between every level lock and the next chain step)
  - **§ Part 2** — visual anchors (livery rule, pose canonical, framing canonical, hand convention, vocabulary risks). **§ Part 2 §L item 8** — accessory progressions (boots, belts, bracers, sheaths) accumulate via **plate/armor beats**, NEVER via eyelets, lacing, stitching rows, rivet runs, or trim bands as the standalone beat. Each new accessory beat must add a piece of armor (steel toe cap, heel cap, ankle band, vambrace plate, knuckle plate, etc.), apply a volume bump on an existing plate, or change the material of an existing plate. (LOCKED 2026-05-08 per AD feedback after a brass-eyelet boot draft was rejected.)
  - **§ Part 1 § C** — `_meta.adds[]` rule: ALWAYS populate the structured `_meta.adds[]` form when adding or editing prompt beats. Validate `len(_meta.adds[]) == declared adds count` after every edit. (LOCKED 2026-05-08.)
  - **§ Part 1 § D** — JSON / Unicode hygiene: when scripting JSON writes from Python use `json.dump(d, f, indent=2, ensure_ascii=False)` and `open(path, 'w', encoding='utf-8')`. Default `ensure_ascii=True` mangles em-dashes into 3-codepoint mojibake `â€"` that silently breaks downstream parsers. (LOCKED 2026-05-08 after a real bug.)
  - **§ Part 3** — locked decisions
  - **§ Part 4** — quick reference recipes (run a generation, lock a keeper and chain forward, final delivery)
- `UnitProgression/<UnitName>/<UnitName>.md` — base character spec (face, pose, color breakdown)
- `UnitProgression/<UnitName>/<UnitName>_Progression_Plan.md` — full 10-level ramp with tier structure + per-level beat list (single source of truth for what each level should look like)
- `UnitProgression/<UnitName>/Refs/L1_Base.png` — canonical L1 input (must be **1024×1024 native**); used as the L2 chain origin and as the framing-measurement reference. **NOT sent as a second image on chained levels** (single-input chained rule, locked 2026-05-07).

**Mandatory pre-flight check on `Refs/L1_Base.png` before authoring any prompts:**
1. Verify dimensions are **exactly 1024×1024**. If the source is larger (e.g. 2048×2048 — Infantry case), downscale via `Image.resize((1024, 1024), Image.LANCZOS)` and back up the original as `Refs/L1_Base_<orig-size>.png` (e.g. `L1_Base_2K.png`). Without this, every framing measurement and the prompt's "1024×1024 canvas" language will be off-by-2x and downstream framing locks will silently drift.
2. Run the framing measurement script (CLAUDE.md § Part 1 § I) on the 1024 version. Record the exact `vfill` / `top` / `bot` / `hfill` / `left` / `right` numbers and write them into `<UnitName>.md` § Framing AND `<UnitName>/CLAUDE.md` § Part 2 § C BEFORE authoring the L2 prompt — these become the per-unit canonical envelope.
3. **Per-unit framing envelopes are canonical — do NOT renormalize across units.** Different units have different vfill (Archer 74.7%, Infantry 66.8% — natural variation in source crops). The temptation when scaffolding a new unit is to "fix" the framing to match Archer's. Don't — the L1_Base envelope IS that unit's canonical envelope. With the single-input chained rule (locked 2026-05-07), the framing is held by (a) the prompt body's FRAMING block describing the canonical envelope numbers exactly, and (b) the diff-mask composite-keeper step preserving prior-level pixels byte-for-byte in unchanged regions. The L1_Base image itself is NOT used as a second-image anchor on chained calls.

Determine the unit from `$ARGUMENTS`. If none specified, ask which unit to work on. The pilot is `Archer`.

If `--level` is provided, resume from that level (assumes earlier levels are locked + composited — verify before continuing). Otherwise start from `L2` (L1 = ground truth, no generation).

## Required tools / external skills

- **`fal-api-skills`** — used for uploading inputs to FAL CDN: `bash .claude/skills/fal-api-skills/skills/fal-generate/scripts/upload.sh --file <path>`. Returns a `https://v3b.fal.media/...` URL. Used for L2's L1_Base content reference (chain origin, single-input), per-level keeper composites (single-input chained), and NAFNet deblur inputs.
- **`fal-ai/nano-banana-pro/edit`** — image-to-image edit endpoint at `https://queue.fal.run/fal-ai/nano-banana-pro/edit`. The pipeline bypasses the `fal-generate` script's payload builder (which doesn't support `/edit`) and submits via direct `curl` POST — see CLAUDE.md § Part 1 § A for the pattern.
- **`fal-ai/nafnet/deblur`** — endpoint at `https://queue.fal.run/fal-ai/nafnet/deblur`. Single-input `{"image_url": "..."}`. The locked default cleanup pass for the chain (counter-intuitive winner over `nafnet/denoise`).
- **`composite-keeper` skill** (`.claude/skills/composite-keeper/scripts/composite_keeper.py`) — diff-mask composite tool. Locked v2 thresholds: `--low 10 --high 25`. For tier breaks bump `--dilate 15` (or 20 for very large edit areas). See CLAUDE.md § Part 1 § L and `.claude/skills/composite-keeper/SKILL.md`.
- **`.env`** at the project root must contain `FAL_KEY=...`. Source it before any curl.

## The chain — per-level loop

For each level `L<n>` from L2 through L10 (and L9.5 between L9 and L10), execute the same loop. The **only differences between levels** are: (a) which prompt JSON drives it; (b) which prior composite is the chain input. **Every chained level uses a single input** (the previous level's composited keeper) per the locked single-input rule (2026-05-07) — there is no anchored / multi-input variant.

### Step 1 — Read the prompt
Read `UnitProgression/<UnitName>/Prompts/archer_edit_L<n-1>_to_L<n>.json` (within-tier) or `archer_edit_L<n-1>_to_L<n>.json` chained tier-break variant. The prompt's `_meta.history` shows revisions; check it for any pending audit notes (e.g. "needs short-sleeve update" or stubble cleanup).

**For Archer specifically** — the chain uses these prompts:
- L2: `archer_edit_L1_to_L2.json` (single input = `Refs/L1_Base.png`, the chain origin)
- L3: `archer_edit_L2_to_L3.json` (single input = L2 composite)
- L4: `archer_edit_L3_to_L4.json` (single input = L3 composite — chained tier-break)
- L5: `archer_edit_L4_to_L5.json` (single input = L4 composite)
- L6: `archer_edit_L5_to_L6.json` (single input = L5 composite)
- L7: `archer_edit_L6_to_L7.json` (single input = L6 composite — chained tier-break)
- L8: `archer_edit_L7_to_L8.json` (single input = L7 composite)
- L9: `archer_edit_L8_to_L9.json` (single input = L8 composite)
- L9.5: `archer_edit_L9_to_L9_5.json` (single input = L9 composite)
- L10: `archer_edit_L9_5_to_L10.json` (single input = L9.5 composite)

For new units, the same pattern: L1 = ground truth, L2 chains from L1, then each level chains from the previous composite — always single-input. Anchored tier-break prompts (`archer_edit_L1_to_L<n>.json`) are deprecated and should not be authored for new units.

### Step 2 — Set up output dirs
```
out/v<N>/L<n>/
├── variants/   # the 4 raw downloads
├── sidecars/   # 4 sidecar JSONs (one per seed)
└── composite/  # populated after the keeper is locked
```

### Step 3 — Upload input to FAL
- For L2 (chain origin): upload `Refs/L1_Base.png` once.
- For L3 onward (every chained level): upload the prior level's `composite/archer_L<n-1>_v<keeper>_composited.png` fresh each time (FAL CDN URLs expire in hours-to-days).
- **Single input only** — do NOT also upload `Refs/L1_Base.png` as a second image for chained levels (single-input chained rule, locked 2026-05-07; see CLAUDE.md § Part 1 § B).

### Step 4 — Build payloads + sidecars (reproducible mode)
Generate 4 distinct seeds (`S, S+1, S+2, S+3`). Build 4 payloads with `num_images: 1` and one seed each. Write the sidecar JSON immediately for each call (one sidecar per seed, naming `archer_L<n>_seed<S>.json`) — see CLAUDE.md § Part 1 § A2 for the schema. **Do not use `num_images: 4`** in v2-style runs; the batched path is non-deterministic and can't be reproduced from the seed.

### Step 5 — POST 4 calls in parallel + record `request_id`
Submit each payload via `curl -s -X POST https://queue.fal.run/fal-ai/nano-banana-pro/edit ...`. Capture the returned `request_id` and write it back into the sidecar.

### Step 6 — Poll until COMPLETED
Poll status every 10–15s per request via `https://queue.fal.run/fal-ai/nano-banana-pro/requests/<id>/status`. Typical completion 30–90s.

### Step 7 — Download the 4 variants
Fetch `result.images[0].url` from each completed request and save to `variants/archer_L<n>_v<i>.png`.

### Step 8 — Measure framing
Verify the 4 outputs match the **per-unit canonical envelope** recorded in `<UnitName>.md` § Framing (Archer: 74.7% v.fill / 13.5% top; Infantry: 66.8% v.fill / 16.6% top — different units, different envelopes; don't cross-check against the wrong one). Use the Python snippet in CLAUDE.md § Part 1 § I. fill≈99.9% / top≈0% is the **checkerboard-background bug** (model can't emit alpha) — re-roll. ±5% drift on v.fill is a soft fail; flag and offer to re-roll.

**Vertical growth at silhouette-mightiness levels is expected, NOT a fail.** When a level introduces a tall new feature (helm at L7, horns at L9, central crest at L10 — anywhere the silhouette mightiness rule extends the head silhouette upward), vfill grows and top-margin tightens. The composite preserves L_input bytes-exact in unchanged regions, so growth confined to the new edit zone is correct. Examples from the chain so far: Infantry L7 (helm) → vfill 66.8 → 69.7%; L9 (horns) → 70 → 75%; L10 (crest) → 79%. Flag the growth in the keeper presentation but don't require a re-roll on framing alone if the growth is concentrated at the new feature.

### Step 9 — Present 4 variants for keeper selection

Show all 4 variants to the user. Provide a per-variant micro-review (kit hits, drift to flag, framing numbers). **No auto-picks — user picks the keeper.** When kit beats fail repeatedly across all 4 variants (e.g. livery regression, full-sleeve drift, missing rivets), surface the failure pattern and propose a prompt fix BEFORE re-rolling — don't just re-roll blindly.

**ALSO — at every keeper-presentation step, list the level's adds and removes up front (LOCKED 2026-05-06 per user request).** Before the per-variant micro-review, write a short bullet list of:

- **Adds** at this level — every visible kit addition (each `(L<n>-i) ...` item from the prompt's NEW ADDS block, summarized in plain language, one line each).
- **Removes / replaces** at this level — anything the prompt explicitly REMOVES or REPLACES (e.g. "rope cord belt → wider leather belt", "white linen bandage → leather bracer", "wooden mace head → flanged steel mace head"). If nothing is removed, say "Removes: none — all changes are additive."

The user uses this list as a checklist to spot-check each variant against. Format suggestion (mirror this in every level's keeper presentation):

```
**L<n> — <tier name>**

Adds:
- (1) <add 1, 1-line summary>
- (2) <add 2>
- (3) ...

Removes / replaces:
- <removed item 1>  (or: "none — additive only")
```

Keep both lists tight — one line per item. The full descriptions live in the prompt JSON; this is just a quick-reference checklist for variant review.

If the user rejects all 4 and asks for a fresh batch, archive the current set as `variants_round<N>/` + `sidecars_round<N>/` (or `variants_<descriptor>/` like `variants_livery_fail`) so the rejected batch is preserved as audit. Then fire 4 fresh seeds.

### Step 10 — On lock: NAFNet deblur the RAW keeper FIRST
**CRITICAL ORDER (CLAUDE.md § Part 1 § G2):** denoise the raw keeper BEFORE the composite — never after. NAFNet drift on the composite would defeat the composite's pixel-perfect preservation of the prior chain input.

```bash
RAW_URL=$(bash .claude/skills/fal-api-skills/skills/fal-generate/scripts/upload.sh --file out/v<N>/L<n>/variants/archer_L<n>_v<keeper>.png 2>&1 | grep -E "^URL:" | sed 's/^URL: //')
RESP=$(curl -s -X POST "https://queue.fal.run/fal-ai/nafnet/deblur" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"image_url\":\"$RAW_URL\"}")
# poll until COMPLETED, then download to:
# out/v<N>/L<n>/composite/archer_L<n>_v<keeper>_denoise.png
```

### Step 11 — Composite the DENOISED raw against the prior composite
```bash
python .claude/skills/composite-keeper/scripts/composite_keeper.py \
  --raw    out/v<N>/L<n>/composite/archer_L<n>_v<keeper>_denoise.png \
  --input  out/v<N>/L<n-1>/composite/archer_L<n-1>_v<j>_composited.png \
  --low 10 --high 25 \
  --output out/v<N>/L<n>/composite/archer_L<n>_v<keeper>_composited.png \
  --qc-image out/v<N>/L<n>/composite/archer_L<n>_v<keeper>_qc.png \
  --qc-json  out/v<N>/L<n>/composite/archer_L<n>_v<keeper>_qc.json
```

For tier-break levels (L4, L7) add `--dilate 15`. For very large edit areas (e.g. helm reshape + finial replacement at L10) consider `--dilate 20`.

For L1→L2 the composite input is `Refs/L1_Base.png` (no prior composite exists yet — L1_Base is the chain origin).

(Historical note: prior to 2026-05-07 the chain sent L1_Base as a second-image scale anchor on most chained levels but dropped it at L10. Under the locked single-input rule, every chained level uses one input only; L10 is no longer a special case.)

### Step 12 — Inspect QC
Open `_qc.png` (5-tile review: `L_input | L_raw | composite | mask | residual`) and `_qc.json` (metrics). Resolve any printed warnings before chaining forward — they propagate. Healthy ranges:
- `mask_avg_pct`: 70–95%
- `transition_pct`: <10%
- `preserved_drift_mean_abs`: <0.5
- `edit_signal_mean_abs`: >5
- `edit_fidelity_mean_abs`: <0.5
- `mask_islands`: <30

The residual tile should be bright ONLY in the actual edit zones (the kit pieces added at this level) and near-black in unchanged regions (face, cape, legs). Unexpected brightness in unchanged regions = drift survived; bump thresholds, dilation, or pool sigma.

### Step 13 — Chain forward
The `composite/archer_L<n>_v<keeper>_composited.png` becomes the SINGLE entry in `image_urls` in the next level's prompt (single-input chained, locked 2026-05-07). **Do NOT also send L1_Base as a second image. Never chain off the raw keeper. Never NAFNet the composite.**

Repeat the loop for the next level.

## Final delivery

After the full L1–L10 (+ L9.5) chain is locked, assemble the deliverable hand-off:

```python
import os, shutil
from PIL import Image

base = 'UnitProgression/<UnitName>'
final = f'{base}/out/v<N>/Final'
os.makedirs(final, exist_ok=True)

levels = [
    ('L1',   f'{base}/Refs/L1_Base.png'),
    ('L2',   f'{base}/out/v<N>/L2/composite/archer_L2_v<keeper>_composited.png'),
    # ... L3 through L9 ...
    ('L9_5', f'{base}/out/v<N>/L9_5/composite/archer_L9_5_v<keeper>_composited.png'),
    ('L10',  f'{base}/out/v<N>/L10/composite/archer_L10_v<keeper>_composited.png'),
]
for label, src in levels:
    shutil.copy2(src, f'{final}/{label}.png')

TILE = 1024
imgs = [Image.open(f'{final}/{label}.png').convert('RGB') for label, _ in levels]
imgs = [(im if im.size == (TILE, TILE) else im.resize((TILE, TILE), Image.LANCZOS)) for im in imgs]
canvas = Image.new('RGB', (TILE * len(imgs), TILE), (255, 255, 255))
for i, im in enumerate(imgs): canvas.paste(im, (i * TILE, 0))
canvas.save(f'{final}/progression_compilation.png')                                       # 11264x1024
canvas.resize((256 * len(imgs), 256), Image.LANCZOS).save(f'{final}/progression_compilation_thumb.png')  # 2816x256
```

The `Final/` dir is the deliverable hand-off. Per-variant suffixes and `_composited` qualifiers are dropped so the rank progression is browsable at a glance. See CLAUDE.md § Part 4 "Final delivery" for the canonical recipe.

**Confirm before omitting a level from delivery.** The chain produces all locked levels (L1–L10 + L9.5). If the user wants a subset (e.g. drop L9.5 to deliver a clean 10-frame progression), confirm before omitting — the bridge level still chains the L9 → L10 transition; it just doesn't appear in the deliverable.

## Final delivery — upload to Drive

After the `Final/` dir is assembled, push it to the team Drive folder using the `gdrive-upload` skill (`.claude/skills/gdrive-upload/scripts/gdrive.py`).

**Standard upload pattern for unit progressions:**

```bash
# Dry-run first to confirm the file list + destination
python .claude/skills/gdrive-upload/scripts/gdrive.py upload \
  UnitProgression/<UnitName>/out/v<N>/Final \
  hero-animation \
  --subfolder "<UnitName> Progression" \
  --dry-run

# Real run after the user confirms the dry-run plan
python .claude/skills/gdrive-upload/scripts/gdrive.py upload \
  UnitProgression/<UnitName>/out/v<N>/Final \
  hero-animation \
  --subfolder "<UnitName> Progression"
```

Conventions:
- **Always dry-run first** for a new subfolder. Show the user the file list + destination + folder ID before uploading for real.
- **Subfolder naming**: `<UnitName> Progression` (Title Case + space + "Progression"). Mirrors the existing `Archer Progression` and `Infantry Progression` subfolders in the team folder.
- **Target folder**: `hero-animation` is the saved mapping for the EMTD team folder (parent of all per-unit progression subfolders). If the mapping is missing, run `add-folder hero-animation <url>` first.
- **Surface the folder URL** at the end of the upload so the user can click through to verify.
- **Don't re-upload duplicates** — Drive creates duplicates rather than overwriting. The script warns on same-name file collisions; if files already exist in the target subfolder, ask the user whether to use a fresh subfolder name (e.g. `<UnitName> Progression v2`) or skip the re-upload.

If the team Drive folder mapping is not yet saved, the agent should also offer to save it. See `.claude/skills/gdrive-upload/SKILL.md` for full skill docs (auth setup, folder-link mapping, troubleshooting).

## Addressing user feedback (per-level)

After variant review, the user writes a structured feedback digest at:

```
UnitProgression/<UnitName>/out/<vN>/<L>/feedback.md
```

containing per-variant ratings, verdicts (pass/flag/reject), per-add checklists (landed/partial/missed), and free-text notes. The file's `## Implementation` header points at the prompt JSON to revise; a `## Cross-variant pattern` section flags adds that ≥2 variants missed/partialled.

When the user says **"implement feedback for L<n>"**, **"address feedback on Cavalry L4"**, **"rewrite the prompt per the feedback I saved"** or anything similar:

1. **Find the file.** Look for the latest version's feedback for that level — typically `UnitProgression/<UnitName>/out/<latest-vN>/L<n>/feedback.md`. If multiple versions exist, prefer the most recent unless the user specifies. If `--level` was passed without an explicit version, scan `out/v*/L<n>/feedback.md` and pick the newest by mtime.
2. **Read it.** Check the `## Implementation` header for the target prompt JSON path (typically `UnitProgression/<UnitName>/Prompts/<unit>_edit_L<from>_to_L<n>.json` or its anchored variant) and the `## Cross-variant pattern` section for prompt-issue patterns.
3. **Diagnose, don't just patch.** A single variant missing an add = sampling miss (re-roll fixes it). 2-of-4 or worse missing the same add = prompt issue (rewrite). Use the cross-variant pattern section to separate the two. Free-text variant notes capture context the structured fields can't (model behavior nuances, art-direction calls).
4. **Rewrite the relevant prompt sections.** Common fix locations in the prompt body:
   - `EDIT GOAL` paragraph — for misframed scope or count mismatch
   - `===== L<n> NEW ADDS =====` block — when an add was misinterpreted (e.g. "spiked mace" rendered as morningstar; needs more material/shape language)
   - `===== PRESERVE FROM ... EXACTLY =====` block — when a prior-level kit element regressed (face touch-up, livery erasure, sleeve drift)
   - `===== NEGATIVE — DO NOT =====` block — when a forward-leaking later-tier element appeared (steel rivets at a leather tier, gold trim too early)
   - `_meta.history` — bump with a one-line entry citing the feedback file path
5. **Surface the diff before saving.** Show the user what you propose to change and why, citing specific feedback bullets. Don't just write the file silently.
6. **Re-fire generation.** Run the chain manually per § Step 5 below. Use a fresh `vN+1` if the user wants the prior batch preserved as audit (Archer/Infantry default); same `vN` if they're iterating in place.

The feedback file is the canonical handoff between variant review and prompt rewrites. Treat it as a structured task, not a freeform message: every flagged add maps to a specific prompt section.

## Lessons learned (highlights — full list in CLAUDE.md § Part 1 § F drift table)

> **🚨 READ THIS FIRST when authoring or editing any prompt body 🚨**
>
> **The nano-banana-pro/edit model is STATELESS — it sees ONLY (1) the single input image and (2) the prompt body string.** It has **NO awareness** of:
> - Prior levels in the chain (`L1`, `L4`, `L9.5`, etc.)
> - Our level naming convention
> - Version history (`v3`, `v6`)
> - Authoring history (`per AD FeedbackV0`, `LOCKED 2026-05-07`, `REVISED per detail-economy`)
> - The progression plan
> - The unit's CLAUDE.md
> - Anything outside this single API call
>
> When the prompt body says *"preserve the L4 scale-mail"* or *"matching the L1 kettle-helm tone"*, the model sees an opaque token (`L4`, `L1`) it cannot resolve — best case it ignores the token, worst case it hallucinates a referent.
>
> **Authoring rule**: every reference in the prompt body must point to something the model can SEE — either in the input image or earlier in the same prompt body string. Examples of correct phrasing:
>
> - ❌ *"matching the L1 kettle-helm tone"*  →  ✅ *"matching the kettle-helm tone shown in the input image"*
> - ❌ *"the L4 scale-mail short sleeves"*  →  ✅ *"the existing scale-mail short sleeves visible on both upper arms"*
> - ❌ *"the L8 third pauldron lame"*  →  ✅ *"the third pauldron lame visible on each shoulder in the input image"*
> - ❌ *"REVISED 2026-05-07 per AD detail-economy"*  →  drop entirely (move to `_meta.history`)
> - ❌ *"as introduced at L7"*  →  drop entirely
> - ✅ Keep: numbered add markers `(1) TITLE — body`, intra-prompt refs like `per Edit Goal item (2)` — both halves visible in the same prompt
>
> **Test by re-reading the prompt body alone with no other context**. If a sentence references something the model cannot see, rewrite it. Internal level tags + authoring decision history belong in `_meta.history` / `_meta.purpose` / the progression plan / CLAUDE.md — NEVER in the model-facing prompt string. See Archer/CLAUDE.md § Part 3 locked decision #27 for the canonical rule.

These have already cost us a re-roll; surface them when authoring/editing prompts:

- **Livery preservation is the strongest preserve rule** after pose and framing. The mustard tunic + red panels MUST stay visibly dominant on the chest L1–L7 (then migrates to chest band L7, then disappears L8–L10 once steel covers the chest). When mid-tier scale-mail levels expand the metal upward, the model deletes the tunic — fix is a `CRITICAL TWO HARD RULES` lead block at the prompt opening (mirror the L4→L5 v6 rewrite pattern).
- **Denoise the raw keeper, not the composite.** Locked 2026-05-05. The order matters because NAFNet drifts every pixel it touches; if you NAFNet the composite, you drift the bytes-locked face/hood/cape from upstream.
- **Composite thresholds locked at `--low 10 --high 25`** for v2 onward. The original `5/15` defaults leak faint face touch-ups (model lightly retouches the face on every edit) into the composite's edit zone, producing a residual blob over the brow/eyes. 10/25 keeps the face byte-locked.
- **Stubble shadow removed from face anchor** (revised 2026-05-05). The chained prompts had `faint stubble shadow along the jaw` in every face description, which the model amplified into a five o'clock shadow at L8 once the half-visor framed the lower face. Canonical face is now clean-shaven; do NOT describe stubble in any new prompt body. The anchored prompts (`archer_edit_L1_to_L4.json`, `archer_edit_L1_to_L7.json`) still contain stubble references and are flagged with audit notes — strip them before reuse.
- **Half-visor at L8** bridges open-face (L7) → closed visor (L9). Without it the L8 / L9 silhouette delta is too thin (helm looks identical) and the L8→L9 jump feels harsh.
- **Layered pauldrons + brass rivets pulled forward to L8** alongside the half-visor (originally planned for L9). L9 now extends the half-visor downward into a full closed visor as its main beat.
- **L10 royal payoff = 11 deltas, single-image input.** Cabasset brim added, tall pointed apex preserved, gold diamond CAPS the tip (does not replace it), bulkier 3-lame pauldrons, gauntlets, plus fine ornament (filigree, T-bar, scrollwork — these land soft, expected). L10's framing lock is dropped because the gold diamond cap adds vertical extent.
- **No multi-panel grid generation.** Tested at v0; late panels collapse into duplicates. Stay on per-level chained.
- **Vocab risks**: never use `chainmail` (model renders fine ring mesh — use `scale mail` or `scale-mail`); never use `transparent` (model emits a checkerboard pattern in RGB — use `clean white background`); avoid `mantle`/`cloak`/`robe` for small neck pieces (use `scarf`/`stole`/`fur collar`).
- **Always check the prompt for previous-tier assumptions when chaining** (e.g. L4→L5 still describing "scale-mail SLEEVES" after we shortened them to deltoid+upper-bicep at L4 broke L5; L8→L9 still describing "open-face helm" after we added the L8 half-visor broke L9). Audit the PRESERVE block on every level transition.
- **No cloth-above-armor anywhere on the rider torso (LOCKED 2026-05-07 per Cavalry user feedback).** Once the breastplate appears at L5+, the breastplate's UPPER edge sits flush against the bevor's lower edge — NEVER specify a "chest band" of livery/surcoat/tabard cloth between the bevor and the breastplate's upper edge. Cloth in a region that needs armor looks impractical, reads weird at thumbnail, and is a recurring drift target where the model thickens the cloth strip into a visible tabard panel. Livery presence on the rider is preserved via (a) a SKIRT BAND below the breastplate (between breastplate bottom and tassets/belt — practical tabard-skirt look), and (b) the horse caparison for mounted units. Bake an explicit positive ("breastplate flush against bevor, no cloth visible above") + an explicit negative ("DO NOT add a chest band of cloth between bevor and breastplate upper edge") into every L5+ prompt body. Applies to all units; same logic should govern Infantry/Archer when revising those plans.
- **New metal must explicitly match the rendered L1 baseline tone (LOCKED 2026-05-07 per Cavalry generation review).** Do NOT default to "cool silver-gray steel" / "cool dark-gray iron" boilerplate when the rendered L1 baseline shows a WARM gray (the Cavalry kettle-helm + spear leaf-tip render warm-gray with brown-tinted shadows; the spec said "cool silver-gray" and the chain inherited that, producing every new metal piece in cool/blueish steel that grows distractingly bluer than the L1 baseline at higher levels). Use phrasing like *"neutral silver-gray steel matching the L1 [helmet/spear-tip] tone (balanced gray, neither blue-shadowed nor brown-shadowed)"* and pair with a negative: *"DO NOT render any new metal in cool blue-gray steel, bluish steel, icy silver, chrome, or any cool-toned palette — every new metal addition must match the NEUTRAL gray tone of the L1 baseline (soft warm gray with brown-tinted shadows, NOT blue-tinted shadows; warm-white highlights, NOT cool-white)."* Tone mismatch compounds across the chain — each level adds one more piece of cool steel against the warm baseline, so by L7-L10 the rider reads as wearing two different metals. Audit the rendered L1 baseline (not just the spec text) before authoring any metal-color language.
- **Heraldic-shape vocabulary creates stubborn bias (LOCKED 2026-05-07 per Cavalry L10 fleur-de-lis bleed).** Words like *fleur-de-lis*, *lily*, *trefoil*, *cross*, *lion*, *eagle*, *scroll*, *filigree*, *crest*, *rosette* are high-bias tokens — once they appear *anywhere* in the prompt body (including inside `NOT a fleur-de-lis` constructions), the model latches on and renders them. We removed `fleur-de-lis flared tip` from the L10 spike description and the model still rendered fleur-de-lis tips until we triple-locked. **Authoring rule**: avoid heraldic vocabulary in positive clauses unless the design literally requires it. When you must say *"NOT X"* for a heraldic shape, use **three-layer locks**: (a) positive description with explicit `NOT X` qualifier ("a clean smooth conical taper, NOT a fleur-de-lis"), (b) at least one **dedicated negative clause** in the NEGATIVE block enumerating the failure modes (`DO NOT shape ... as a fleur-de-lis, lily, trefoil, 3-prong fork ...`), (c) `_meta.adds[].summary` echoing the same negative. Negative-only is not enough. See Archer/CLAUDE.md § Part 3 #28.
- **Layered/stacked plate construction invites sculpted-detail bleed (LOCKED 2026-05-07 per Cavalry pauldron progression).** When a level adds armor *volume*, describe it as **single-piece growth** (*"the existing pauldron grows ~25% taller and ~15% wider"*), NOT as **stacked construction** (*"a second smaller disc layered on top, two stacked discs joined by visible rivets"*). The stacked-construction language reads as a decoration cue and pulls in extra ornament — riveted seams, embossed motifs, edge-piping. Same applies to tassets (volume + flare, not third lame), cuirass (volume + single seam, not articulated banding), helms (taller dome, not separate cap). The Cavalry pauldron ramp is now locked across L4-L10 as single-piece progression: single disc → thicker dome → dome + bicep coverage extension → further volume growth. See Archer/CLAUDE.md § Part 3 #29.
- **Reduce-then-remove for problematic beats (LOCKED 2026-05-07 per Infantry rivet bleed iteration).** When an element causes drift, misreading, or bleed, **reduce first** (count, size, prominence). If bleed continues past the next generation, **remove and replace** — don't taper halfway. Half-strength signal often keeps the model's bias active. Infantry shield rim rivets went 8 → 4 → entirely removed; Cavalry L9.5 fin gold spike caps were tested at 1.5" cones, model misread, removed and replaced with caparison gold-trim band. Budget two iterations for "reduce then re-test"; if the third generation still shows the failure mode, drop the beat entirely and design a different upgrade. See Archer/CLAUDE.md § Part 3 #30.
- **Visual motifs propagate across unrelated surfaces (LOCKED 2026-05-07 per rivet bleed observed at Cavalry L3 + Infantry helmet).** When a small visually distinctive motif (rivets, studs, dot patterns, sphere ornaments, eyelets) is introduced at any level, it tends to **appear on other surfaces in subsequent generations** — even when the original positive describes only one feature. Infantry L2 shield rim rivets bled to the helmet brow band and onto the L7 shield as a 16-stud rim band; Cavalry L3 pauldron seam rivets bled across the chain. **Authoring rule**: prefer to avoid small-motif beats entirely (use plate addition / coverage extension / material change instead). If you must introduce one, **pre-emptively negate it on every other surface** in the same prompt body's NEGATIVE block, and **carry the negative through every downstream prompt** in the chain — bleed compounds. Treat every small-motif positive as a chain-wide commitment, not a one-level beat. See Archer/CLAUDE.md § Part 3 #31.

## Key Rules

- **Always denoise raw, then composite.** Never denoise the composite.
- **Always present all 4 variants** for keeper selection. **No auto-picks.**
- **Always check QC warnings** before chaining. Resolve them before locking.
- **Always preserve the livery band** (when the level still includes it). It's the strongest visual anchor for "this is the EMTD <unit>" at thumbnail scale.
- **Always audit upstream prompt assumptions** when editing a level (PRESERVE block must match what the prior level actually delivered, not the original spec).
- **Stay reproducible**: `num_images: 1` × 4 parallel calls with distinct seeds. Write a sidecar per call, immediately on POST.
- **Never chain off the raw keeper.** Always chain off the composite.
- **When something fails repeatedly across all 4 variants**, surface the pattern and propose a prompt fix before re-rolling — don't waste API calls on the same prompt.
- **When you re-edit a prompt mid-chain**, archive the failed batch as `variants_<descriptor>/` so the audit trail survives.
