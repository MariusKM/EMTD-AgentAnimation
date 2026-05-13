# Archer Unit — Pipeline & Visual-Style Learnings

> Read this before authoring, editing, or running any prompt in this directory.
> Companion to [README.md](README.md) (project overview) and [Archer_Progression_Plan.md](Archer_Progression_Plan.md) (the ramp itself).
> All learnings dated 2026-05-04 unless noted otherwise.

> **Skill-driven pipeline.** Run via `/unit-progression Archer`. The agent uploads inputs, builds payloads, POSTs to the FAL queue directly (`curl`/`python` per § Part 1 § A), writes sidecars, polls, downloads, runs the cleanup pass (default ESRGAN 2× → 1024 downscale; NAFNet deblur as fallback) + composite-keeper from the shell (§ Part 4 recipes).

---

## Part 0 — Output directory layout (LOCKED 2026-05-05, applies from v2 onward)

Every level under a versioned run dir gets its own subdirectory with three child dirs:

```
out/v<N>/L<n>/
├── variants/                          # archer_L<n>_v<1..4>.png — raw fal outputs
├── sidecars/                          # archer_L<n>_seed<S>.json — one per call (reproducible mode = 4 per level)
└── composite/                         # archer_L<n>_v<keeper>_composited.png + _qc.png + _qc.json + optional _composited_denoise.png
```

Conventions:
- The `variants/` dir holds ONLY the four raw downloads — never the composite, never the denoise. Keeps "the four candidates the user picks from" unambiguous.
- The `sidecars/` dir holds the audit JSONs. In reproducible mode (`num_images: 1` × 4 parallel calls) there are four sidecars, one per seed. In fast mode (`num_images: 4` × 1 call) there's a single sidecar covering all four outputs.
- The `composite/` dir is created only after a keeper is locked. It holds the composited keeper (chain input for the next level), the QC review image, the QC metrics JSON, and the cleaned-up raw keeper (`_denoise.png` — produced by ESRGAN 2× at 2048×2048 by default, or NAFNet deblur as fallback applied to the ESRGAN-upscaled raw so it stays at 2K). The whole chain runs at 2K throughout (LOCKED 2026-05-13).
- Tier-break A/B comparisons (anchored vs chained) use parallel sibling dirs: `out/v<N>/L<n>/` vs `out/v<N>/L<n>_chained/`, each with the same three-child layout.
- v0 and v1 used a flat layout (PNGs and sidecars side-by-side in the level dir). Don't reorganize them retroactively — the layout convention applies to v2 and forward.

After the full L1–L10 chain is locked, a **`Final/`** sibling dir is added under `out/v<N>/`:

```
out/v<N>/Final/
├── L1.png … L10.png + L9_5.png    # locked composited keeper for each level (L1 = the ground-truth Refs/L1_Base.png)
├── progression_compilation.png    # 11×1024 = 11264×1024 horizontal compilation (full-res delivery)
└── progression_compilation_thumb.png  # 2816×256 thumbnail for quick review
```

The Final/ dir is the deliverable hand-off — each level's PNG is named by its level label (no per-variant suffixes, no `_composited` qualifier) so the 10-step rank progression is browsable at a glance.

---

## Part 1 — Pipeline & Prompting (nano-banana-pro/edit)

### A. Endpoint and payload

- Endpoint: `https://queue.fal.run/fal-ai/nano-banana-pro/edit` (image-to-image edit).
- Auth: `FAL_KEY` from project root `.env`.
- Required payload fields: `prompt` (string), `image_urls` (array — accepts 1 or more).
- Recommended additional fields for our use:
  - `aspect_ratio: "1:1"`
  - `output_format: "png"`
  - `resolution: "1K"` (chain generation — native model output, ESRGAN 2× then brings to chain dim) / `"2K"` / `"4K"`. ⚠ **STRING ENUM — exactly one of `"1K"`, `"2K"`, `"4K"`.** Numeric pixel counts (`"1024"`, `1024`, `"2048"`) return HTTP 422 (`literal_error … Input should be '1K', '2K' or '4K'`). The failure is sneaky: the status endpoint reports `COMPLETED` with `inference_time` ~0.06s (validation-failed shortcut) and only the result endpoint surfaces the 422 with the `detail[].msg`. If a request completes implausibly fast and the result fetch 422s, check `resolution` (and any other enum field — `aspect_ratio`, `output_format`, `safety_tolerance`) before anything else. Locked default `"1K"` per § Part 3 #32.
  - `num_images: 4` (always 4 variants per call so we can pick a keeper)
  - `safety_tolerance: "5"` (loosened one notch from default 4 — preempts medieval-weapon false flags)
  - `seed: <integer>` — pass an explicit seed generated client-side at submission time. The fal nano-banana-pro/edit endpoint does NOT return the seed it used in its response. **Caveat (verified 2026-05-05)**: passing the same seed across two submissions does NOT yield reproducible outputs — see § A2 for the empirical test. We still log the seed in the sidecar JSON as part of the audit trail, but treat it as non-reproductive in this pipeline.
- The `fal-generate` skill's built-in script `generate.sh` does NOT support the `/edit` endpoint payload shape (it builds `image_size`/`num_images` instead of `aspect_ratio`/`image_urls`). We bypass the script and build the payload directly via `python` + `curl`. Pattern:

```bash
cd "/d/2025/Stillfront/Empire Titans" && source .env && \
  L_URL="<fal_uploaded_url>" && \
  SEED=$(python -c "import secrets; print(secrets.randbelow(2**31))") && \
  PROMPT_FILE="UnitProgression/Archer/Prompts/<prompt>.json" && \
  python -c "
import json
d = json.load(open('$PROMPT_FILE'))
payload = {'prompt': d['prompt'], 'image_urls': ['$L_URL'], 'aspect_ratio': d['aspect_ratio'], 'output_format': d['output_format'], 'resolution': d['resolution'], 'num_images': d['num_images'], 'safety_tolerance': d['safety_tolerance'], 'seed': $SEED}
json.dump(payload, open('.tmp/payload.json','w'))
print('seed:', $SEED)
" && curl -s -X POST "https://queue.fal.run/fal-ai/nano-banana-pro/edit" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @.tmp/payload.json
```

Capture `$SEED` and `request_id` immediately for the audit sidecar (see § A2). The seed is recorded but not reproductive; the request_id is queryable in the fal dashboard for hours-to-days.

- Upload local files via `bash .claude/skills/fal-api-skills/skills/fal-generate/scripts/upload.sh --file <path>` — returns a `https://v3b.fal.media/files/...` URL (TTL: hours-to-days, re-upload if stale).
- Polling cadence: status check every 15s. Typical completion 30–90s for this model + our prompt sizes.

### A2. Seed reproducibility — only honored with `num_images: 1` (LOCKED 2026-05-05)

**Empirical finding**:
- **`num_images: 1` + explicit seed → byte-identical reproduction.** Verified earlier (see `experiments/seed_calibration/tests/REPORT.md`): re-submitting an identical payload produces the same PNG bytes (rounding-only diffs). The seed is honored cleanly.
- **`num_images: 4` + explicit seed → NOT reproducible.** Verified 2026-05-05 by hash-comparing two consecutive submissions of the L4 anchored payload (all 4 SHA-256 hashes differed across the two runs). The batching path appears to introduce per-variant non-determinism that swamps the outer seed.

**Conclusion**: the seed *parameter* works fine — it's the `num_images > 1` *batch sampling* that's non-deterministic. To get reproducible outputs in this pipeline, generate variants as **four parallel `num_images=1` calls with distinct seeds** rather than a single `num_images=4` batch.

**Two operating modes** (pick per situation):

1. **Fast review mode (current default)** — single `num_images=4` call per level. ~30-90s total, one network round-trip. **NOT reproducible.** Use for routine keeper-selection iteration where you only care about the keeper picked from this batch and won't need to revisit it.
2. **Reproducible mode** — four parallel `num_images=1` calls with seeds `S, S+1, S+2, S+3` (or any four distinct seeds) submitted concurrently. Same wall-clock as fast mode if submitted in parallel. **Each variant is byte-reproducible** from its own seed. Use when you need:
   - A/B prompt iteration with a pinned baseline (re-run one variant after editing the prompt; compare pixel-diff cleanly)
   - Audit-grade provenance where "I can recreate the exact PNG from the sidecar" matters
   - Drift calibration / no-op subtraction experiments (where any sampling noise destroys the signal)

The sidecar JSON convention applies to both modes. In reproducible mode, write **one sidecar per call** (so 4 sidecars per level, one per variant), each with its own seed.

**What this means for our pipeline**:
- ❌ Today's `num_images: 4` batches in `out/v1/` cannot be reproduced — accept that and move on.
- ✅ Going forward, switch tier-break and chain-step generations to reproducible mode whenever we expect to revisit them. Routine keeper-selection passes can stay in fast mode.
- ✅ A/B comparison between two prompts (anchored vs chained tier-break) needs to be done with reproducible mode if you want the comparison to survive a prompt edit. Same-window submissions work for one-shot reads.

**We still pass an explicit seed in fast mode and write the sidecar** because: (a) it costs nothing; (b) the prompt_sha256 + image_urls + input_files + request_id + timestamp remain useful as an audit trail even when the seed itself isn't reproductive in that mode; (c) the sidecar lets you re-submit the same payload at `num_images=1` later if you need to recover a roughly-similar variant.

Sidecar filename: `archer_L<n>_seed<S>.json` (or `archer_L<n>_seed<S>_chained.json` for the chained variant of a tier-break level). One sidecar per call covering all 4 variants from that `num_images=4` batch.

Sidecar schema:

```json
{
  "level": "L4",
  "variant_set": "anchored",
  "seed": 1234567890,
  "request_id": "019df7be-c29d-71a2-8b8a-bed9a099b9b1",
  "submitted_at": "2026-05-05T14:32:11Z",
  "prompt_file": "UnitProgression/Archer/Prompts/archer_edit_L1_to_L4.json",
  "prompt_sha256": "<sha256 of the prompt body string>",
  "image_urls": [
    "https://v3b.fal.media/files/b/.../L1_Base.png"
  ],
  "input_files": [
    "UnitProgression/Archer/Refs/L1_Base.png"
  ],
  "aspect_ratio": "1:1",
  "resolution": "1K",
  "num_images": 4,
  "safety_tolerance": "5",
  "outputs": [
    "archer_L4_v1.png",
    "archer_L4_v2.png",
    "archer_L4_v3.png",
    "archer_L4_v4.png"
  ]
}
```

Notes on each field:
- **`seed`**: the exact integer passed in the payload. Reproductive when `num_images: 1`; not reproductive when `num_images: 4` (see the finding above). In fast mode (num_images=4) treat as audit-only; in reproducible mode (num_images=1, four parallel calls) it does the work.
- **`prompt_sha256`**: SHA-256 of the `prompt` STRING (not the whole JSON file). If the prompt is later edited, the sidecar's hash will not match the current file — useful for spotting prompt drift between today's outputs and an older audit entry. Compute with `python -c "import hashlib,json; print(hashlib.sha256(json.load(open(F))['prompt'].encode()).hexdigest())"`.
- **`request_id`**: the fal queue ID. Useful for debugging in the fal dashboard but the request retention is short (hours-days), so don't depend on it after the fact.
- **`image_urls`**: the FAL CDN URLs that were actually submitted. URLs expire (hours-to-days).
- **`input_files`**: local repo paths for the input images. The durable record of what was fed in (the CDN URLs above will rot).
- **`variant_set`**: `"anchored"` | `"chained"` | `"within_tier"` | `"experimental"` — disambiguates parallel batches (e.g. anchored vs chained tier-break).

Write the sidecar IMMEDIATELY after the POST returns the `request_id` (do not wait for completion). If the run fails partway, the sidecar still records what was attempted.

**Iterating on a prompt with seed-pinned reproducibility**: switch to reproducible mode for the iteration. Submit four parallel `num_images=1` calls with seeds `S, S+1, S+2, S+3`; record sidecars. To isolate a prompt change later: re-submit the same four seeds against the edited prompt — pixel-diff each variant pair to see only prompt-driven changes. Cost: 4 calls instead of 1, same wall-clock if submitted concurrently.

**Iterating in fast mode (without seed reproducibility)**: if you stayed in `num_images=4` fast mode, you cannot pin a baseline. Instead:
- Submit the same prompt at `num_images=4` two or three times to see the variance envelope — anything consistent across submissions is prompt-driven.
- For A/B between two prompts, submit both **in the same session window** with `num_images=4` each, then judge by majority signal across 4 variants per side. Don't read into a single-variant difference.

### B. Input strategy (THE most important pipeline decision) — REVISED 2026-05-07: SINGLE-INPUT CHAINED ONLY

**LOCKED 2026-05-07**: every chained generation uses **a SINGLE input** = the previous level's composited keeper. **Do NOT also send `Refs/L1_Base.png` as a second image.**

**Why the change** — the previous rule (Rule 2 in the v2 chain) added `Refs/L1_Base.png` as `image_urls[1]` "scale/framing anchor" on every within-tier and chained-tier-break call. In practice this caused **content-drift on every chained level**: the model saw two reference images and pulled features from both, regressing accumulated kit (dagger sheath disappearing at L4, scale-mail shape drifting, gold accents soft-failing) toward whatever was visible in L1_Base. The framing-anchor benefit was mostly illusory: the per-level prompt's FRAMING block already describes the exact canonical envelope (1024×1024 / 74.7% v.fill / 13.5% top / 11.8% bot), and the chained composite carries the framing forward pixel-locked through the diff-mask composite step (CLAUDE.md § L) regardless of whether L1_Base is in the input. **The cost (drift) was higher than the benefit (perceived framing lock).**

**Locked rule (LOCKED 2026-05-07)**:

- **L2 (chain origin)**: single input = `Refs/L1_Base.png` (this is L2's content reference, not an anchor).
- **L3 onward (every chained level — within-tier AND chained tier-break)**: single input = previous level's composited keeper.
- **Tier-break anchored prompts (L1→L4, L1→L7) are deprecated** and not used in the v3+ chain. The chained variants `archer_edit_L3_to_L4.json` and `archer_edit_L6_to_L7.json` are the only L4 / L7 prompts in use.
- **L10**: single input = L9.5 composited keeper (already single-input in the v2 chain — no change).

**Authoring rule for prompts**:
- `image_urls` array contains exactly ONE entry: the previous keeper composite path.
- Prompt body must NOT reference "the SECOND input image", "scale anchor", "scale/framing reference" — there is no second input. Strip any "second input" language from prompt body, PRESERVE block, FRAMING block, and NEGATIVE block.
- FRAMING block still describes the canonical envelope numbers (1024×1024 / 74.7% v.fill / 13.5% top / 11.8% bot for Archer; per-unit envelopes documented in `<UnitName>.md`) — but no longer says "match the second image's character-to-canvas proportions". Just "match these numbers exactly".

**What this replaces** (deprecated rules):
- ~~**Rule 1** — Tier-break: anchored from L1_Base only~~ (anchored tier-break prompts are deprecated; use chained tier-break instead).
- ~~**Rule 2** — Within-tier: previous keeper + L1_Base as scale anchor (two inputs)~~ → **single-input chained only**.
- ~~**Rule 3** — Tier-break alternative: previous keeper + L1_Base as scale anchor (two inputs)~~ → **single-input chained only**.

**A/B comparison between two prompts**: still works — submit both prompts at `num_images=1 × 4` parallel calls with the same 4 seeds. The reproducibility (Part 1 § A2) is unchanged.

### C. Prompt structure (use this exact template)

Every per-level prompt JSON has the same skeleton:

```
EDIT GOAL — <one paragraph: the new adds for this level>
===== L<n-1> ACCUMULATED ADDS (must appear) =====
(L<n-1>-1) <add 1>...
(L<n-1>-2) <add 2>...
... (only present in tier-break prompts where input is L1_Base)
===== L<n> NEW ADDS =====
(L<n>-1) <new add 1 with explicit material / position / size>
(L<n>-2) <new add 2>
...
===== PRESERVE FROM <input> EXACTLY =====
<exhaustive list of every L1 feature: face, hair, hood, cape, tunic, bracers, hands, bow, quiver, trousers, boots>
===== POSE (must match L1_Base / previous input exactly) =====
<full pose description — see Visual Anchors below for canonical wording>
===== FRAMING / SCALE (must match L1_Base exactly) =====
<canvas / vertical fill / margins>
===== STYLE / OUTLINE =====
<Supercell / Kingshot wording + thin black outline rules>
===== NEGATIVE — DO NOT =====
<long list, including negative-listing every later-tier element so the model can't drift forward>
```

The prompt body lives inside a single JSON string field. The JSON file also has a `_meta` block at the top with `purpose`, `endpoint`, `input_image`, `output_target`, `tier`, `history` (a running log of prompt revisions), and the API payload fields (`image_urls`, `aspect_ratio`, etc.) at the top level so the file is one `python -c "import json; …"` away from a queue submission.

**ALWAYS POPULATE `_meta.adds[]` STRUCTURED FORM (LOCKED 2026-05-08).** The structured `_meta.adds[]` field is the canonical source for downstream tooling (variant-review checklists, feedback exports). Body-only parsing fails on beats with titles containing **parentheses, tildes, percent signs, or colons** — so beats like `(LIVERY PRESERVATION RULE)`, `(NO BICEP GAP)`, or `OUTER ~15% OF EACH LIMB` won't be discoverable from body text alone. Authoring rule: every time you add or edit a beat in a prompt body, ALSO add or edit the corresponding entry in `_meta.adds[]` with `id` (`L<n>-<index>`), `title` (uppercase), `summary` (one-sentence plain-language), `replaces` (string array — items this add replaces, populated when the body uses REPLACES/REPLACING phrasing), and `category` (one of `armor` / `weapon` / `helm` / `livery` / `horse-tack` / `accessory` / `other`). After every batch edit, validate with `len(_meta.adds) == _meta.visible_adds_count == _meta.delta_adds_count` (whichever is set). Don't rely on body-only parsing — the silent-fail mode is hard to detect.

### D. JSON-formatting gotcha

**Never use unescaped double quotes inside the prompt string.** JSON strings require `\"` to embed quotes. Examples that broke us:
- `scale-mail "skirt"` — replace with `scale-mail skirt` (no quotes), or `scale-mail \"skirt\"` (escaped).
- Same for any other emphasis quotes — use ALL CAPS for emphasis instead, or italicize via Markdown elsewhere.

When a JSON parse fails, the error gives a `pos` byte offset; `python -c "import json; print(repr(open(file).read()[pos-50:pos+50]))"` finds the offender quickly.

**Unicode hygiene (LOCKED 2026-05-08 after a real bug).** When writing prompt JSONs from Python, ALWAYS use `json.dump(d, f, indent=2, ensure_ascii=False)` and `open(path, 'w', encoding='utf-8')`. The default `ensure_ascii=True` mangles em-dashes (U+2014 `—`) into the 3-codepoint mojibake sequence `â€”` (visible as `â€"`). Downstream parsers expect literal U+2014; mojibake'd em-dashes silently break body parsing. This applies to any file containing em-dashes / curly quotes / section symbols / arrows / smart punctuation (i.e. all the prompt JSONs and most of CLAUDE.md). If you see `â€"` in a JSON file, run a `replace('â€"', '—')` cleanup pass and re-write with `ensure_ascii=False`. Same pattern for `Â§` → `§`, `â†'` → `→`, etc.

### E. Multi-image input behavior (DEPRECATED 2026-05-07)

`nano-banana-pro/edit`'s `image_urls` accepts an array of any length. We previously passed two (content + scale anchor) per Rule 2/3 above, which is now retired. Every chained level uses a **single-input** array per the revised § B. Leaving this section here as a record of the deprecated approach.

Historical note: the multi-image setup did pixel-lock the framing (74.7% / 13.5% / 11.8% / 56.8%) but at the cost of content drift on the chained features (the model pulled L1_Base details into the latent on every step). The single-input rule trades the perceived framing lock for a much cleaner kit chain — framing is held by prompt-body description + composite-keeper preservation rather than by a second-image reference.

### F. Drift patterns we've hit (and how to fix)

| Drift | First seen | Fix |
|-------|-----------|-----|
| **Character size shrinks**, headroom collapses (90% v.fill vs L1's 74%) | First L2 + L3 runs | Add explicit FRAMING/SCALE block citing exact pixel measurements; switch to `Refs/L1_Base.png` (1024×1024 native, 74.7% fill) as the canonical input/anchor. |
| **Pose drifts** (forearm angle changes, fist becomes open hand or grips bow string) | First L2 generation | Replace vague "fingers loosely curled" with explicit "tight closed FIST, knuckles facing OUTWARD, forearm HORIZONTAL ACROSS THE CHEST at 90° elbow bend, fist hovers at chest center, does NOT touch the bow / bowstring / chest". |
| **Bandage stays after spec'd to be replaced** | L2 v2 (deprecated, single bow-arm bracer beat) | Lead with REPLACE language ("the white linen bandage is REPLACED by a brown leather bracer") and add to negative ("DO NOT keep any white linen bandage"). |
| **Bandage REGRESSION on a chained level** (L2 keeper had bracer; L3 chained off it brought the bandage back) | L3 v1–v3 (locked then flagged) | Lead the L3 prompt with a CRITICAL ARM PRESERVATION block (BEFORE the EDIT GOAL) that explicitly verifies the L2 input state of both bracers (one cross-strap on bow arm, two on draw arm, no bandage anywhere) and tells the model to preserve them. Add explicit negative items: "DO NOT restore the white linen bandage on any arm"; "DO NOT render either bracer as a plain leather sleeve without visible cross-strap bindings". This pattern (named-element regression on chained generations) likely applies to any L<n+1> chain where L<n> introduced a swap — the model can revert to the L<n-1> version. Authoring rule: when chaining off a level that REPLACED something (bandage→bracer, leather caps→studded, etc.), explicitly verify the swap in the next prompt's lead block, NOT just the preserve section. |
| **Bow-arm bracer loses its cross-strap binding** when chained (becomes a plain leather sleeve) | L3 v1 (chained from L2 v3) | Same fix as above — explicitly call out "ONE visible cross-strap binding wrapping the bracer" in the CRITICAL ARM PRESERVATION block; negative-list "DO NOT render either bracer as a plain leather sleeve without visible cross-strap bindings". |
| **Wrong feature gets a feature from later tier** (pauldron studs, helm, gold) | L4 (pauldrons came back studded — that was supposed to be L5) | Explicit per-feature "X arrives at L<n>, NOT at L<this>" in negative list. |
| **Body scale-mail renders as quilted/diamond** instead of chunky overlapping scales | L5 v1 + v2 | Tighten language — describe scale shape per-scale ("rounded shield-shape, semi-circular at top, slightly tapered at bottom, arranged in horizontal rows with each row overlapping the row below by half a scale"); explicitly negative-list "fine ring mesh, fish-scale fine texture, scale that reads as small dots". Reference image: gray-coif bearded character (saved 2026-05-04). |
| **Bandolier strap rendered but didn't read distinctly** | L5 v1 | Removed bandolier from L5/L6 entirely (deprecated 2026-05-04). |
| **Livery (red+yellow tunic) covered by full scale-mail coat** | L5 v3 | Add LIVERY PRESERVATION rule (see Part 2 § Visual Anchors). Scale mail extends BELOW the tunic hem only; tunic stays as dominant chest garment L1–L7. |
| **Two pouches on the same hip** (L2 generations) | L2 v6 | Negative-list "DO NOT add a hip pouch on the LEFT side — exactly ONE pouch at the anatomical-RIGHT hip" for L2 (the second pouch arrives at L3). |
| **Background goes transparent** instead of clean white | L3 v3 (one of four) | Model cannot emit alpha — what looks like 'transparent' is a baked-in checkerboard pattern in the RGB pixels. Treat as a render fail and re-roll. Symptom in the framing-measurement script: fill=99.9% / top≈0% / bot≈0.1% (the bbox spans the whole canvas because the checkerboard counts as content). |
| **Job takes 60–90s instead of 30s** | L2 v6 (12K char prompt) | Longer prompts queue longer. No fix needed; just expect it and poll patiently. |
| **Gold trim band on a polished steel helm never lands** | L8 (both original run + L8-from-denoise re-run) | Both 8-variant runs failed to render the gold helm trim band despite explicit prompt language. Polished-steel-on-polished-steel low contrast + small accent = high-miss. Mitigation: lead the prompt with the gold trim as the FIRST add, increase the band's described size (e.g. "1 inch tall, wraps fully around helm circumference, clearly visible from front"), and describe the contrast explicitly ("buttery-gold band against cool silver-gray steel body"). Or accept the miss and let the gold helm trim land at the next level alongside other gold accents. |
| **Subtle cloth peeking BETWEEN solid steel plates does not render** | L10 livery-add experiment | Tried to add mustard-yellow cloth strips peeking between vertical steel fauld plates; model rendered the faulds as solid steel with no cloth visible. The model treats adjacent plates as a continuous solid surface and ignores narrow "peek" cloth instructions. Mitigation: either widen the plate gaps explicitly (separate plates with visible 0.5-inch gaps and describe the cloth filling those gaps), OR re-frame the cloth as a continuous arming-skirt LAYER that the steel plates sit ON TOP OF (cloth visible at the top edge above the plates and the bottom edge below the plates, not between them). Same pattern likely applies to any "cloth between/behind solid plates" attempt. |
| **First gold accent at a level lands as warm-tinted highlight, not distinct gold** | Infantry L8 (gold pauldron seam rivets — barely readable across all 4 variants at thumbnail scale) | Lead with explicit "polished metal" language: "BUTTERY POLISHED YELLOW GOLD METAL, saturated warm-yellow hue contrasting strongly against the cool silver-gray steel, distinctly more yellow than the surrounding steel — NOT brass, NOT bronze, NOT yellow paint, NOT mustard tint, NOT a warm-tinted highlight on steel." Add explicit rendering hints: "(i) saturated buttery-yellow base, (ii) soft top-down highlight that reads almost white-yellow, (iii) deeper warm shadow on the underside that reads honey-orange." Each gold element must be IMMEDIATELY READABLE as gold at thumbnail scale. Soft fail at L8 → re-emphasized at L9 with this language → landed cleanly. Apply this language any time gold appears in a prompt. |
| **Soft-fail features land subtly and need re-emphasis at the next level** | Infantry L4 (only 2 of 3 iron mace banding rings visible) → carried forward to L5; Infantry L8 (gold rivets faint) → carried forward to L9 | When a level's keeper landed a feature subtly (or failed it on 1-2 of the 4 variants), re-assert the underdelivered feature in the NEXT level's PRESERVE block AND its CRITICAL PRESERVATION VERIFICATION lead. Authoring rule: when locking a keeper with a soft-fail, log it in the next prompt's `_meta.history` as an audit note, and write the feature back into the prompt body explicitly ("the iron banding rings on the mace head — these RINGS REMAIN PRESENT, do not remove them"). The composite preserves bytes-exact, so what's there stays there — but the next prompt should still re-state it so subsequent edits don't accidentally erase it. |

### G2. Clean up the RAW keeper before compositing (LOCKED 2026-05-05, ORDER REVISED; cleanup model revised 2026-05-13)

Re-running L7→L8 with a *cleaned-up* L7 keeper (vs the raw model output) produced visibly **cleaner output** across all 4 variants — outlines crisper, helm surface smoother, less painted-over noise. Same prompt, same scale anchor, only the content reference changed.

**CRITICAL ORDER (revised 2026-05-05)**: the cleanup pass runs on the **RAW keeper BEFORE the composite step**, not after. Reason: any cleanup model (ESRGAN, NAFNet) introduces its own drift on every pixel it touches. If you clean up the *composite*, that drift hits the L_input-preserved regions (face/hood/cape carried over byte-perfect from the prior composite), defeating the whole point of the composite. By cleaning the raw keeper FIRST and then compositing, the composite locks L_input bytes-exact in unchanged regions and cleanup drift is confined to the edit-zone pixels — where we wanted change anyway.

**Cleanup model selection (LOCKED 2026-05-13)**:
- **Default = ESRGAN 2× supersample, saved at 2K.** Faster + much cheaper than NAFNet on the fal queue. Works well on the painted nano-banana-pro/edit artefact pattern for the vast majority of keepers. Endpoint: `https://queue.fal.run/fal-ai/esrgan`, payload `{"image_url": "...", "scale": 2}`. Output is 2048×2048 — save as `_denoise.png` **as-is** (no downscale). The chain now runs at 2K throughout, so this cleanup pass doubles as the dim-normalization step that brings the 1024×1024 nano-banana-pro/edit raw output up to the chain dim. Final deliverables are 2K, so we avoid the legacy downscale-now / upscale-for-delivery round-trip.
- **Fallback = NAFNet deblur** (`fal-ai/nafnet/deblur`, `{"image_url": "..."}`, preserves input dim — at 2K it's 2048 in → 2048 out). Slower and more expensive, but preserves painted brushwork on stubborn artefacts where ESRGAN over-sharpens, halos, washes brushwork, or visibly shifts color. Switch to NAFNet for that keeper only when the user reports an issue with the ESRGAN-cleaned composite. **Important**: since the raw nano-banana-pro/edit keeper is 1024 and NAFNet preserves dim, the fallback path is **ESRGAN-upscale the raw to 2K first, then NAFNet-deblur the 2K image** — otherwise you'd lock a 1024 keeper into a 2K chain and the composite step would dim-mismatch.
- Earlier docs (2026-05-04 / 05) framed NAFNet deblur as the locked default at 1024 throughout. That was superseded 2026-05-13 — the artefact pattern is benign enough for ESRGAN's much faster path to win on cost / time, with NAFNet retained as the escape hatch for the cases where it doesn't. The same 2026-05-13 update bumped the chain dim from 1024 to 2048 (eliminating the redundant downscale-then-upscale) — every level's _denoise.png and _composited.png are now 2048×2048.

**Recipe**:
1. User picks raw keeper from `variants/archer_L<n>_v<i>.png`.
2. Clean up the raw keeper (default ESRGAN 2× → 1024 downscale; NAFNet deblur fallback) → `composite/archer_L<n>_v<i>_denoise.png` (name unchanged regardless of which model produced it — downstream code is agnostic).
3. Composite the *cleaned raw* against the previous level's composited keeper → `composite/archer_L<n>_v<i>_composited.png`.
4. Use `composite/archer_L<n>_v<i>_composited.png` as `image_urls[0]` in the next level. **No further cleanup pass on the composite.**

**Wrong order (deprecated 2026-05-05)**: composite the raw keeper, THEN run cleanup on the composite, THEN chain. Caused face/hood/cape to drift across every chain step despite the composite's preservation guarantee.

**What it doesn't fix**: prompt-side misses (e.g. the missing gold helm trim band — see drift table). The cleanup pass improves fidelity of carried-over content; it doesn't change what the model decides to render from the prompt.

### G. Auto-pick discipline

**Never auto-pick a keeper.** Always present all 4 variants and let the user choose. Reasons:
- The model's variations are subtle but meaningful (face matches, kit definition, scale-mail texture quality).
- A wrong auto-pick at L<n> propagates forward through every chained generation.
- The user has visual judgment we don't (style intent, brand intent, consistency with their other chosen keepers).

When presenting variants, give a per-variant micro-review (kit hits, framing numbers, drift to flag) but explicitly say "no auto-pick — your call".

### H. Polling pattern that works

```bash
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  STATUS=$(curl -s -H "Authorization: Key $FAL_KEY" \
    "https://queue.fal.run/fal-ai/nano-banana-pro/requests/$REQ/status" \
    | python -c "import sys,json; print(json.load(sys.stdin).get('status','?'))")
  echo "[+${i}5s] $STATUS"
  if [ "$STATUS" = "COMPLETED" ] || [ "$STATUS" = "FAILED" ]; then break; fi
  sleep 15
done
```

Then GET `https://queue.fal.run/fal-ai/nano-banana-pro/requests/$REQ` to fetch the result JSON; `result.images[i].url` is the image URL — `urllib.request.urlretrieve` it to `out/L<n>/archer_L<n>_v<i>.png`.

### I. Framing measurement (verify after every gen)

```python
from PIL import Image
img = Image.open('<file>').convert('RGBA')
w, h = img.size
px = img.load()
top, bottom = h, 0
for y in range(h):
    for x in range(0, w, 2):
        r, g, b, a = px[x, y]
        if a > 30 and not (r > 240 and g > 240 and b > 240):
            if y < top: top = y
            if y > bottom: bottom = y
            break
print(f'fill={(bottom-top)/h*100:.1f}%  top={top/h*100:.1f}%  bot={(h-bottom)/h*100:.1f}%')
```

Targets (must match L1_Base):
- Canvas: 1024×1024
- Vertical fill: 74.7%
- Top margin: 13.5%
- Bottom margin: 11.8%
- Horizontal width: 56.8%

**Note: fill≈99.9% / top≈0% / bot≈0.1% is the signature of a checkerboard-background render (the bug we get when the prompt mentions 'transparent'), NOT a true character-scale drift. Inspect the variant before re-running with stronger framing language.**

If a variant drifts more than ±5% on vertical fill or top margin, flag it as a framing fail and consider re-running with stronger framing language.

### J. Multi-panel grid experiment (failed approach, 2026-05-04)

**Hypothesis**: nano-banana works well for character turnaround sheets (a single latent forces consistency across multiple views — see [docs/NanoBananaPrompt/grid_prompt.txt](../docs/NanoBananaPrompt/grid_prompt.txt)). If the same trick works for a rank progression, we could generate an entire tier (3–4 levels) in one shot instead of chaining level-by-level — face/proportions/pose would lock by construction, not by careful prompting.

**Setup**:
- Prompts: [Prompts/grid_leather_tier.txt](Prompts/grid_leather_tier.txt) (Tier 1 — L1, L2, L3, L3-repeat), [Prompts/grid_scalemail_tier.txt](Prompts/grid_scalemail_tier.txt) (anchor L1 + L4, L5, L6).
- Single input image: `Refs/L1_Base.png`.
- `num_images: 4`, 4 grid variants per call.
- Tried two layouts:
  - **1×4 single row at `21:9` / 4K** → 4096×1755, ~1024×1755 per panel (panels squashed taller-than-wide).
  - **2×2 grid at `1:1` / 4K** → 4096×4096, ~2048×2048 per panel (native square panels, double the per-panel resolution).
- Outputs in [out_grid/](out_grid/): `leather/`, `scalemail/`, `leather_2x2/`, `scalemail_2x2/`.

**Aspect-ratio constraint**: `nano-banana-pro/edit` accepts only this enum for `aspect_ratio`: `auto`, `21:9`, `16:9`, `3:2`, `4:3`, `5:4`, `1:1`, `4:5`, `3:4`, `2:3`, `9:16`. **No `4:1`, no `3:1`, no custom WxH.** Verified by probe — `4:1` returns `literal_error` on `aspect_ratio`. So a true 4-square row at native 1:1 panel proportions is not achievable in one image; the closest single-row option is 21:9 (panels become portrait-shaped), and the only way to get square panels for 4 tiles is a 2×2 grid.

**Failure mode (the reason this approach was abandoned)**: across both layouts and all 8 variants (4 leather + 4 scalemail, both 21:9 and 2×2), **the last two panels of the grid were always near-identical to each other.** The model commits to a "final" state by panel 3 and then duplicates it (with minor noise) into panel 4 instead of treating panel 4 as an additional progression step. Specifically:
- Leather: panels 3 (L3) and 4 (L3-repeat, intended as a stability check) collapsed into the same image — but the same collapse also happened on the scalemail grid where panels 3 (L5) and 4 (L6) were *supposed to be distinct progression steps* and came out functionally identical.
- Phrasing tweaks ("repeat panel 3 unchanged" vs. "panel 4 has these new additions on top of panel 3") did not change the behavior across the variants we got.

**Why it likely fails**: turnaround grids work because the *content* is identical and only the camera rotates — the model has a strong prior for "same character, different angle." Progression grids ask the model to do the opposite: lock identity AND introduce small additive deltas, panel-by-panel, in a single latent. The model appears to interpret late panels as "more of the same final state" rather than as discrete additive steps. Closely-related panels (panels 3 & 4) collapse first because the visual delta between them is the smallest in the grid.

**Decision**: do not use grid generation for rank progression. Stay on the per-level chained pipeline (Part 1 § B). Keep the experiment outputs in `out_grid/` for reference. Keep the grid prompt files in `Prompts/` as historical record — do not delete.

**Open avenues if revisited later**:
- Force more visible delta between adjacent panels (e.g. add an extra discriminating element in the last panel that's not in the second-to-last).
- 1×3 grids at `3:2` aspect (panels ≈ 1365×2048) — fewer panels means each delta is larger relative to the full latent, may avoid the late-panel collapse.
- Different model — some image models handle multi-panel comic-style grids better than nano-banana.

### K. Post-process denoising / cleanup (LOCKED 2026-05-04 / 05; default cleanup model revised 2026-05-13)

**Problem**: chained edits through nano-banana-pro/edit accumulate re-encoding noise in the latent. By the late-tier levels (L8–L10) the keepers show visible color drift, micro-artefacts, and grain even when the kit is correct. Anchoring all generations to L1_Base (Part 1 § B Rule 1 applied universally) bounds the noise per-level, but a final cleanup pass still helps.

**Test bed**: [out/L9_5/archer_L9_5_v1.png](out/L9_5/archer_L9_5_v1.png) — the most accumulated-noise frame in the project (L9.5 plate-with-gold step). All cleanup candidates were run on this same source for direct visual comparison; outputs saved alongside as `archer_L9_5_v1_denoise_<tool>.png`.

**Models tested on fal**:
| Tool | Endpoint | Result on stylized art |
|------|----------|------------------------|
| **ESRGAN 2× → LANCZOS 1024 downscale** | `fal-ai/esrgan` (scale=2) | **WINNER (LOCKED 2026-05-13 — current default).** Significantly faster + cheaper than NAFNet on the fal queue, with output that holds up on the painted artefact pattern for the vast majority of keepers. The 2× supersample acts as both a sharpening and a denoise pass; the LANCZOS resize back to 1024 keeps the chain dims locked. Failure modes (rare): over-sharpening, halo at edge contrast, brushwork wash, subtle color drift — fall back to NAFNet for that specific keeper when the user flags it. |
| **NAFNet deblur** | `fal-ai/nafnet/deblur` | **Fallback (locked).** Cleanest result on the cases ESRGAN can't handle — preserves the painted brushwork, doesn't flatten outlines or wash colors. Counter-intuitive: the deblur model — not the denoise model — was the better cleanup pass for our painted style (the artefacts read more like soft blur than like granular noise). Was the locked default 2026-05-04 / 05 → 2026-05-13. Slower and more expensive on the fal queue than ESRGAN, which is why it lost the default slot. |
| **NAFNet denoise → NAFNet deblur** (chained) | `fal-ai/nafnet/denoise` then `fal-ai/nafnet/deblur` | Backup-of-the-fallback. Slightly more aggressive cleanup than NAFNet deblur alone; loses a hair of brushwork detail. Only reach for this if a single NAFNet deblur pass leaves visible color drift. |
| NAFNet denoise (single pass) | `fal-ai/nafnet/denoise` | Decent. Less effective than NAFNet deblur alone for our specific artefact pattern. |
| clarity-upscaler (`creativity` 0.20 / 0.35 / 0.50) | `fal-ai/clarity-upscaler` | Bumps resolution but reinterprets details (kit specifics drift even at low creativity). Not a clean denoise. |
| aura-sr | `fal-ai/aura-sr` | Pure 4× upscale; smooths high-freq noise as a side effect but doesn't address drift. |
| SUPIR | `fal-ai/supir` | Slow to schedule (workers cold-start, often 5–7+ min in queue). When it does run, output is over-restored and shifts the painted look. Worse than NAFNet deblur for our use case. |

**Models NOT available on fal** (do not waste probes): SCUNet, Restormer, SwinIR, Uformer, MAXIM, FBCNN, PromptIR, DRCT.

**Default cleanup pass for any keeper going forward (LOCKED 2026-05-13)**:
```bash
# Upload the 1024×1024 raw keeper, then ESRGAN 2× supersample:
RESP=$(curl -s -X POST "https://queue.fal.run/fal-ai/esrgan" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"image_url\":\"<uploaded_url>\",\"scale\":2}")
# poll status, then fetch result.image.url. Output is 2048×2048.
# Save it as <keeper>_denoise.png AS-IS — the chain dim is 2K, no downscale.
```

ESRGAN accepts `scale` (2 or 4) and an optional `model` / `face_enhance` / `tile` knob; we use only `scale: 2`. Typical wall-clock ~10–30s per pass (vs ~30–60s for NAFNet).

**Pre-flight: ensure `Refs/L1_Base.png` is 2K** before chain start. If a unit's L1 reference is 1024 (legacy Archer-era), run the same ESRGAN 2× call against it once and overwrite `Refs/L1_Base.png` with the 2K result (back up the 1024 original as `Refs/L1_Base_1K.png`). This brings the chain origin up to the 2K chain dim so L2 composites cleanly.

**Fallback — NAFNet deblur** when the user reports issues with an ESRGAN-cleaned composite (over-sharpening, halo, washed brushwork, color drift on a specific keeper). NAFNet preserves input dim, so first ESRGAN-upscale the raw 1024 keeper to 2K, then NAFNet-deblur the 2K image:
```bash
# Step 1: ESRGAN 2× the raw keeper to 2K (same call as above), re-upload result as $RAW_2K_URL.
# Step 2: NAFNet on the 2K image:
curl -s -X POST "https://queue.fal.run/fal-ai/nafnet/deblur" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"image_url\":\"$RAW_2K_URL\"}"
```
NAFNet takes only `image_url`. ~30–60s wall-clock per pass. Output preserves source resolution (2048 in → 2048 out at the current chain dim). Save to the same `<keeper>_denoise.png` path; downstream is model-agnostic.

**When to escalate further (NAFNet denoise → NAFNet deblur chained)**: only if a single NAFNet deblur pass also leaves visible color drift. Upload the deblur output as the input to a second NAFNet pass.

### L. Drift mitigation via diff-mask composite (LOCKED 2026-05-05)

**The mandatory step between locking a keeper and chaining forward to the next level.** The composite preserves the previous chain input's pixels in unchanged regions byte-perfect, and uses the new keeper's pixels only where the model actually edited. Drift in unchanged regions is reduced from ~0.7-1.0 mean abs (raw) to ~0.05 (composite — effectively pixel-perfect). Replaces both the no-op calibration step and any subtraction-based correction.

**Tool**: the [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md) — script at `.claude/skills/composite-keeper/scripts/composite_keeper.py`. CLI:
```bash
python .claude/skills/composite-keeper/scripts/composite_keeper.py \
  --raw    out/L<n>/archer_L<n>_v<i>.png \
  --input  out/L<n-1>/archer_L<n-1>_v<j>_composited.png \
  --output out/L<n>/archer_L<n>_v<i>_composited.png \
  --qc-image out/L<n>/archer_L<n>_v<i>_qc.png \
  --qc-json  out/L<n>/archer_L<n>_v<i>_qc.json
```

**Defaults (locked 2026-05-05; spatial knobs doubled 2026-05-13 for 2K chain)**: `low=5, high=15, diff_pool_sigma=16, mask_blur_sigma=6, dilate_edit_px=20`. Thresholds (low / high) are intensity-based and stay at the 2026-05-05 values; pool / mask_blur / dilate are pixel-space sigma/radius and doubled with the chain dim from 1024 → 2048. ⚠ The doubling is a geometric scaling — the 1K-era seed_calibration sweep has NOT been rerun at 2K. Treat the doubled values as a first cut and retune manually if QC metrics drift on early 2K keepers.

**How it works**:
```
mask     = soft_threshold(|L_raw − L_input|, low, high, pool=8)   in [0, 1]
mask     = dilate(edit_region, 10px) — captures sharp edit boundaries
composite = L_input × mask + L_raw × (1 − mask)
```
- mask = 1 → use L_input pixel (unchanged region, byte-perfect preserve)
- mask = 0 → use L_raw pixel (model edit, untouched)
- 0 < mask < 1 → soft alpha blend at boundary

**Why these defaults** (full sweep at [experiments/seed_calibration/composite_boundary_test/](experiments/seed_calibration/composite_boundary_test/) — sweep was at 1K; spatial knobs below quote both the 1K rationale and the 2K-era doubled value):
- `low=5, high=15` (unchanged at 2K — intensity-based): sensitive enough to catch all real edits; loose enough to ignore brushwork-noise drift.
- `diff_pool_sigma=8 → 16` (doubled 2026-05-13): prevents leopard-spotted masks in textured regions (leather wraps, X-strap, gambeson). Without pooling, individual pixels in textured areas exceed threshold even when content matches — falsely flagged as edits. The 1K sweep landed on pool=8 (averaging each pixel's diff with an 8-sigma neighborhood); at 2K the equivalent physical neighborhood is 16. Same physical smoothing radius, double the pixels.
- `dilate_edit_px=10 → 20` (doubled 2026-05-13): expands the edit region by 10 (now 20) pixels. Fixes boundary artefacts at sharp edit edges (e.g. the top of the L3 leather greaves) where the diff at the exact edge is tiny but the boundary needs to be fully L_raw. Same physical edge-zone width at 2K.
- `mask_blur_sigma=3 → 6` (doubled 2026-05-13): soft-feathered mask boundary; same physical feather width at 2K.

⚠ **The 2026-05-13 spatial doubling has not been empirically recalibrated at 2K.** It is a geometric scaling that preserves the same physical (rather than pixel-count) behavior. If QC metrics on early 2K keepers drift (large `transition_pct`, raised `mask_islands`, drift in `preserved_drift_mean_abs`), retune `pool / mask_blur / dilate` manually rather than treating these values as locked. The locked 2026-05-05 values for the threshold knobs (`low` / `high`) are dim-invariant and remain authoritative.

**Tier-break tuning (2K-era)**: for very large edit areas (L1→L4 sleeves, L1→L7 plate, L9→L9.5 fauld skirt swap) bump `dilate_edit_px` to 30-40 (was 15-20 at 1K). For tiny add-ons (single-feature levels) drop to 0-10.

**Per-step workflow** (replaces step 8 onward in the per-level workflow in [README.md](README.md)):
1. Generate 4 variants → review → user picks keeper.
2. **Clean up the RAW keeper** (§ K, § G2 — default ESRGAN 2× saved at 2K; NAFNet deblur as fallback applied to the ESRGAN-upscaled raw so it stays at 2K) → `composite/archer_L<n>_v<i>_denoise.png` (2048×2048). Skip only when the raw keeper is visibly clean (early levels, simple adds) — but even then, ESRGAN-upscale the raw to 2K so the dims match the chain.
3. **Composite the DENOISED raw** against the previous chain input (also composited):
   `python .claude/skills/composite-keeper/scripts/composite_keeper.py --raw <denoised_raw> --input <prev_composited> --output <keeper>_composited.png --qc-image <keeper>_qc.png --qc-json <keeper>_qc.json`
4. **Inspect QC output** (see § L.1 below). Resolve any warnings before chaining forward.
5. Use `<keeper>_composited.png` as the chain input for the next level (NOT the raw keeper, NOT the cleaned raw, NOT a cleaned-after-composite). **Never run the cleanup pass on the composite** (applies to both ESRGAN and NAFNet) — that drifts the preserved regions.

**Why composite, not subtraction**: we tested no-op-calibration drift subtraction first (see [experiments/seed_calibration/run_0/](experiments/seed_calibration/run_0/), [run_1_aggressive/](experiments/seed_calibration/run_1_aggressive/), [run_1_moderate/](experiments/seed_calibration/run_1_moderate/)). Subtraction reduces drift by ~70-85% in unchanged regions but has prompt-conditioned residual that can't be eliminated, AND costs +1 API call per chain step. Composite gives 100% preservation in unchanged regions, costs 0 extra API calls. Strictly better for our use case (additive kit prompts where unchanged regions truly should remain unchanged).

#### L.1 Quality check after every composite

The `composite-keeper` skill automatically computes QC metrics and emits a 5-tile review image (`L_input | L_raw | composite | mask | residual`). Always inspect it.

| Metric | Healthy range | Meaning if out of range |
|--------|---------------|-------------------------|
| `mask_avg_pct` | 70-95% | <30% = barely any preservation; >99% = no edit captured (thresholds too loose) |
| `transition_pct` | <10% | >15% = soft boundary too wide; consider tighter `mask_blur_sigma` |
| `preserved_drift_mean_abs` | <0.5 | unchanged regions still drifting; check L_input matches expected; verify mask coverage |
| `edit_signal_mean_abs` | >5 | no edit signal; prompt may have failed or thresholds too tight |
| `edit_fidelity_mean_abs` | <0.5 | composite differs from L_raw inside the edit zone; soft mask is bleeding L_input where it shouldn't |
| `mask_islands` | <30 | leopard-spotted mask; bump `diff_pool_sigma` to 12-15 |

The tool will print warnings to stdout if any metric falls out of range. **Never lock a chain input without resolving QC warnings** — they propagate forward through every subsequent generation.

**Reading the residual tile**: the rightmost tile of the QC image shows `|composite − L_input|`. It should be bright ONLY in the actual edit regions (the kit pieces added at this level) and near-black everywhere else. Any unexpected brightness in unchanged regions = drift survived = adjust thresholds, dilation, or pool sigma.

### M. SCUNet alternative (out-of-scope but noted)

If SCUNet is ever needed, it is open-source PyTorch (github.com/cszn/SCUNet) and would have to be run locally — fal does not host it. Out of scope for this pipeline.

---

## Part 2 — Visual Style Anchors

### A. The Livery Rule (LOCKED 2026-05-04)

**The red + mustard-yellow livery (tunic with red center panel + red side panels on a mustard-yellow base) is a CORE EMTD visual identity element and MUST remain visibly DOMINANT on the chest at every level from L1 through L7.**

Why: the mustard tunic with the quilted red panels is the unit's heraldic colors — the way you can read at thumbnail scale that this is "the EMTD archer" regardless of armor tier. Lose the livery, lose the brand identity.

Per-level application:
- **L1–L3 (Leather Scout)**: tunic dominant, fully visible.
- **L4 (Basic Scale Mail)**: tunic STAYS dominant. Scale mail at SLEEVES + short hem band only — does NOT cover the tunic chest.
- **L5 (Mid Scale Mail)**: tunic STAYS dominant. Scale-mail expands DOWNWARD into a longer skirt below the tunic hem, NOT upward over the tunic.
- **L6 (Heavy Scale Mail + Over-Jerkin)**: short brown leather over-jerkin sits OVER the tunic but is intentionally short/partial — at least 40-50% of the tunic's red+yellow surface stays visible above and below the over-jerkin.
- **L7 (Basic Plate)**: steel breastplate covers upper chest only. Tunic with red+yellow remains as a clear band (4–6 inches) between the breastplate's lower edge and the wider belt.
- **L8–L10**: tassets at the hip carry the red+yellow alternating strips. Livery migrates from chest to hip silhouette but still PROMINENTLY VISIBLE.

**Authoring rule for every Tier 2 + Tier 3 prompt**: include explicit positive language ("the mustard-yellow tunic with red center panel and red side panels remains dominant on the chest, fully visible") AND negative language ("DO NOT cover the tunic chest panel with scale mail; DO NOT replace the tunic with a body coat; DO NOT shrink the tunic into a thin strip"). Strongest preservation requirement after pose and framing.

Worked example: L5 v3 (deprecated) lost the livery — full scale-mail coat replaced the tunic. L5 v4 (locked) fixed it by extending scale mail BELOW the tunic hem only.

### B. Pose canonical description

**Use this exact wording in every prompt's POSE block:**

> Three-quarter view, body angled approximately 15-25 degrees to the viewer's left so the character's anatomical right side faces camera, weight planted evenly on both feet with a very slight forward lean.
>
> THE BOW ARM (anatomical-LEFT, viewer-RIGHT) hangs DOWN at his side with the elbow only slightly bent, the bow held VERTICALLY at HIP height directly in front of the hip with the hand gripping the bow's central leather grip wrap.
>
> THE DRAW ARM (anatomical-RIGHT, viewer-LEFT) is bent sharply at the elbow at roughly 90 degrees, with the FOREARM HELD HORIZONTALLY ACROSS THE CHEST at upper-chest / sternum level (parallel to the ground). The bracered hand sits at the CENTER OF THE CHEST area, slightly toward the bow side, in a TIGHT CLOSED FIST shape with the KNUCKLES facing OUTWARD toward the viewer. The fist does NOT touch the bow, the bowstring, or the chest.
>
> Calm balanced HERO STANCE; NOT an active draw, NOT a nocking motion, NOT a reach.

### C. Framing canonical description

**Use this exact wording in every prompt's FRAMING block:**

> 1024x1024 square canvas. Character occupies approximately 75% of canvas vertical height (~765px tall) and approximately 57% of canvas horizontal width (~580px wide). TOP of hood at ~13.5% from top of canvas (~138px headroom). BOTTOM of boots at ~12% from bottom of canvas (~120px below). Character roughly vertically centered, NOT bottom-anchored. DO NOT zoom in, DO NOT shrink, DO NOT add wider borders, DO NOT crop, DO NOT shift to bottom edge.

**Per-unit framing envelopes are canonical — do NOT renormalize across units.** The numbers above are the Archer's canonical envelope. Other units have different envelopes — Infantry: 66.8% v.fill / 16.6% top / 16.6% bot / 60.84% h.fill (natural variation in source crops). When scaffolding a new unit, MEASURE the unit's `Refs/L1_Base.png` and use those numbers verbatim in the unit's prompts; do not "fix" the framing to match Archer's. The per-unit envelope is what every chained generation locks against.

**Vertical growth at silhouette-mightiness levels is expected, NOT a framing fail.** When a level introduces a tall new feature (helm at L7, horns at L9, central crest at L10), vfill grows and top-margin tightens — the composite preserves L_input bytes-exact in unchanged regions, so growth confined to the new edit zone is correct. Examples observed: Infantry L7 (helm) 66.8 → 69.7%; L9 (horns) → 75%; L10 (crest) → 79%. Flag the growth in the keeper presentation but don't require a re-roll on framing alone if the growth is concentrated at the new feature.

### D. Hand convention (MUST be anatomical, not viewer-side)

The prompt always uses **anatomical** hand references (the character's own left and right), not viewer-side. The convention is:
- **Bow arm = anatomical-LEFT** = viewer-RIGHT side of the frame.
- **Draw arm = anatomical-RIGHT** = viewer-LEFT side of the frame.

When in doubt, also include the viewer-side disambiguation in parentheses, as the canonical pose block above does. Same convention used in the HeroAnimation pipeline (see [HeroAnimation/CLAUDE.md](../../HeroAnimation/CLAUDE.md) "Hand convention" learning).

### E. Style / Outline canonical description

**Use this exact wording in every prompt's STYLE / OUTLINE block:**

> Supercell / Kingshot stylized mobile game art, hand-painted digital illustration with soft painted shading and visible brushwork, warm subsurface skin, saturated rich colors, warm shadow tones never gray, soft painted highlights on metal and leather. Clean thin black silhouette outline around the entire character in deep warm brown-black with even weight, slight thickening in shadowed recesses, slight thinning where forms catch the key light. Interior linework remains soft and value-driven, never hard black. Clean white background with no environmental context, no ground plane, no scenery, minimal contact shadow.

### F. Scale-mail visual spec

**Scale mail in this style** = chunky overlapping rounded scale-shaped plates, painted in cool silver-gray steel with a soft top-down highlight on each scale and warm-brown shadow under the lower edge of each scale. Each scale is a small rounded shield-shape (semi-circular at the top, slightly tapered at the bottom), arranged in horizontal rows where each row overlaps the row below by about half a scale. The texture reads as **chunky, hand-painted, clearly individual scales** at character-card scale.

Reference: gray scale-mail coif on a bearded character, supplied by user 2026-05-04. The coif is the EMTD-style reference.

**NOT** chainmail rings, NOT fine ring mesh, NOT fish-scale fine texture, NOT scale that reads as small dots, NOT a flat texture, NOT a quilted diamond pattern.

### G. Bow material progression *(revised 2026-05-07 per AD feedback — short-bow → longbow shape evolution replaces earlier brass-detail accumulation)*

- **L1–L3 (Leather)**: short recurve, warm wood-brown limbs + dark-brown leather grip wrap. Plain hunter's bow.
- **L4 (Scale-mail base)**: + brass binding rings at each end of the leather grip (where leather meets wood, both upper and lower side of grip).
- **L5 (Scale-mail mid)**: + brass tip caps wrapping the outermost ½" of each limb tip.
- **L6 (Scale-mail top)**: **limbs lengthen ~20% toward longbow proportions** *(NEW — per AD "short bow should evolve into a longbow")*; thin gold trim at bracer wrist edges remains as the unit's first gold marker (first gold on the bow itself is dropped — per Detail Economy rule, the bow's silhouette change is the L6 bow beat). Brass grip-end bindings + brass tip caps carry over.
- **L7–L8 (Plate)**: bow at full longbow proportions, wood-brown.
- **L9 (Plate top)**: gilt limb tips appear (outer ~15% of each limb painted buttery gold).
- **L9.5 (Royal-grade)**: gilt extends to outer ~50% of each limb.
- **L10 (Royal)**: fully buttery-gold longbow (only the dark-brown leather grip wrap remains non-gold).

**Detail-economy note (2026-05-07):** the previous "thin gold inlay line along the inner curve at L6" beat is REMOVED in favor of the longbow shape change — adds a thumbnail-readable silhouette evolution rather than a fine surface detail. Per-edge plate gold piping at L9.5 (breastplate edges, vambrace cuffs, pauldron edges) is also REMOVED — gold accents at L9.5 = helm trim + belt buckle + outer-50% gilt bow only.

### H. Continuity anchors held across all 10 levels *(revised 2026-05-07 per AD feedback — head-armor schedule moved earlier; hood retires at L5 instead of L7 to avoid hood-vs-coif clipping)*

- Crimson-red cape, knee-length, plain hem (NEVER gold trim).
- Red somewhere at head/neck: **cloth hood up L1–L4, hood retires at L5 (drops to shoulders as a red mantle), red mantle at back of neck/shoulders L5–L10**.
- Mustard yellow somewhere on torso/hip (tunic L1–L7, tassets yellow strips L8–L9, gone at L9.5+).
- Olive / muted forest-green knee-length trousers.
- Chunky warm-brown leather boots with darker folded ankle cuff (NO full metal sabatons ever — boot progression is small plate accents only, see below). **Boot progression** (added 2026-05-08 per AD feedback; revised 2026-05-08 to plate-only approach): L1–L5 plain leather + folded cuff; **L6** add a small POLISHED STEEL TOE CAP on each boot (first plate on the boot, ~1 inch deep at the toe — plate, NOT brass eyelets / lacing / surface trim); L6–L8 carry the L6 toe cap; **L7–L8** the toe cap continues unchanged (no new boot plate at the body's first-plate transition — boot accumulates separately); **L9** add a STEEL HEEL CAP + STEEL ANKLE GUARD BAND on each boot (heel cap matches the toe cap; ankle guard is a thin curved steel band wrapping each boot at the ankle just above the leather cuff — three steel plates total now: toe / heel / ankle band); L9.5 carry through unchanged; **L10** add THIN BUTTERY-GOLD EDGE LINES tracing the boundaries of EACH of the three steel boot plates (toe cap, heel cap, ankle guard band) — royal payoff via gold material on existing plates; no new plate added at L10. Boot leather body and folded ankle cuff stay through every level — every beat is plate accumulation or plate material change, never surface trim / eyelets / lacing / stitching.
- Brown leather back-quiver over anatomical-LEFT shoulder, white-feather red-tip arrows.
- Bow vertical at hip in anatomical-LEFT hand, draw hand forward at chest. Bow evolves: short recurve L1–L5 → limbs lengthen at L6 → longbow proportions L7–L10.
- **Belt accessories minimized (LOCKED 2026-05-07; revised 2026-05-08 per AD feedback):** the dagger sheath introduced at L3 is the ONLY belt accessory carried through. NO hip pouches, NO leather tool-loop ring, NO third-pouch accumulation at L6. **Dagger sheath carries through L3–L10** (was originally retired at L8 in the 2026-05-07 lock; AD reversed that on 2026-05-08 — the dagger now hangs from the L8+ wider belt above/in-front-of the tassets).
- Forearms never bare past L1: L1 bow-arm bracer + draw-arm linen bandage; L2+ both bracered; L4+ scale-mail sleeves under the bracers; **L7+ steel vambraces replace leather bracers, AND scale-mail sleeves cover the FULL bicep-to-wrist with the vambrace sitting on top — no exposed bicep gap (revised 2026-05-07 per AD "chainmail could cover the arm for later levels")**.
- **First metal headpiece at L4 (steel skullcap under the hood)** — per AD "helmet introduced too late." Hood retires at L5; scale-mail coif takes over at the back of the head. L7 transitions to open-face conical helm cleanly (no hood-vs-coif clipping because the hood is already gone two levels earlier).
- Three-quarter view, full body, clean white background, thin black silhouette outline.

### I. Vocabulary risks (image-gen models over-read these terms)

| Term | Risk | Use instead |
|------|------|-------------|
| `chainmail` / `mail` (alone) | Renders as fine interlocking ring mesh | Always say `scale mail` or `scale-mail`, plus the full chunky-scale descriptive phrase on first mention; negative-list `chainmail rings, fine ring mesh, interlocking metal rings` |
| `skullcap` | Can over-read as skull-themed helmet (bone, eye sockets) | Was used in v1 of the plan, removed in v2 tier-based rewrite; if needed later, prefer `simple rounded steel bowl helm`, `low domed steel cap`, `steel half-helm`; negative-list `skull motif, no bone, no eye sockets` |
| `mantle` | Renders as full draped cape | Use `scarf`, `stole`, `fur collar` (this is a HeroAnimation-side learning that hasn't been triggered here yet) |
| `cloak` for a cowl | Over-reads to floor-length flowing cloak | Use specific shape descriptor + length |
| `bandolier` / `arrow bandolier` | Rendered but didn't read distinctly against the X-strap silhouette | Removed from L5/L6 entirely 2026-05-04 |
| `feather plume on hood` | Too close to Kingshot's L2; also adds noise | Removed L2 beat, replaced with armor upgrade |
| `transparent` / `transparent background` | Model cannot emit alpha; renders a baked-in checkerboard pattern instead — unusable. | describe the background as 'clean white background' only; never use the word 'transparent' |
| `gold` (alone, or `gold trim` / `gold accents` without rendering language) | Renders as warm-tinted highlight on steel rather than distinct buttery gold metal — fails to read as gold at thumbnail scale (Infantry L8 first-gold soft fail) | When introducing gold at any level, use the full polished-metal block: `BUTTERY POLISHED YELLOW GOLD METAL, saturated warm-yellow hue contrasting strongly against cool silver-gray steel — NOT brass, NOT bronze, NOT yellow paint, NOT mustard tint, NOT a warm-tinted highlight on steel. Render with: (i) saturated buttery-yellow base; (ii) soft top-down highlight that reads almost white-yellow; (iii) deeper warm shadow on the underside that reads honey-orange. Each gold element must be IMMEDIATELY READABLE as gold at thumbnail scale.` Apply this language to every gold accent — band, rivet, filigree, finial, knuckle-plate. |

### J. Face visibility schedule *(revised 2026-05-07 — head-armor schedule pulled earlier; face still visible L1–L8)*

- **L1–L4**: face fully visible under the cloth hood. (L4 adds a steel skullcap under the hood — face still framed by the red hood.)
- **L5–L6**: face fully visible. Hood is now down at the shoulders (red mantle); steel skullcap visible at the top of the head; scale-mail coif frames the back/sides.
- **L7–L8**: face fully visible under the open-face conical steel helm (no visor yet). Red mantle continues at the back of neck / shoulders.
- **L9–L10**: face fully concealed by closed visor — no skin / no hair / no eyes / no expression visible above the breastplate.

When the visor closes at L9, the personality face that anchored L1–L8 is no longer available; the silhouette has to do all the character work. L9–L10 lean on silhouette beats (visor shape, gold finial growth, tassets motif, golden bow) instead of face beats.

### K. Color migration (per element, across levels)

| Anchor | L1 | L4 | L7 | L10 |
|--------|----|----|----|-----|
| **Red** | hood + tunic panels + cape | hood + tunic panels + cape (steel skullcap appears under hood per AD 2026-05-07) | red mantle at back-of-neck + cape + red gambeson wedge at throat (hood retired at L5 per AD) | red mantle at back-of-neck + cape + red wedge at throat (tassets gone, replaced by steel fauld) |
| **Mustard yellow** | tunic base | tunic base (over scale mail) | small wedge between breastplate and scale-mail hem | (gone — tassets retired at L9.5) |
| **Olive green** | trousers | trousers + greaves (L3+) | trousers + greaves | trousers + greaves |
| **Brown leather** | bow-arm bracer + belt + boots + quiver + bow grip | + draw-arm bracer + X-strap + pauldron caps + greaves + dagger sheath (no pouches per AD 2026-05-07) | belt + boots + quiver + bow grip + greaves + dagger (most leather kit retired with breastplate) | belt (gold buckle) + boots + quiver + bow grip + greaves + dagger (carries through per AD 2026-05-08) |
| **Silver steel** | — | steel skullcap (under hood) + scale-mail sleeves + scale mail at tunic hem | open-face conical helm + breastplate + vambraces + pauldron caps + full-arm scale-mail (no bicep gap per AD) + steel boot toe cap (L6 onward per AD 2026-05-08, plate-only) | taller closed-visor helm + breastplate + vambraces + pauldrons (no rivets) + wider-lame steel fauld skirt + boot toe cap (L6) + boot heel cap + boot ankle guard band (L9 onward, plate-only) |
| **Brass** | — | brass grip-end bindings on bow + brass buckle | brass grip-end bindings + brass tip caps on bow (L6); brass belt buckle replaced by gold at L9 | — (replaced by gold) |
| **Gold** | — | — | — | helm trim band + diamond finial cap + belt buckle + fully gold longbow + gold edge lines tracing each steel boot plate (toe cap, heel cap, ankle guard band) |

### L. Detail Economy / Silhouette-First Rule (LOCKED 2026-05-07 per AD feedback)

Silviu's FeedbackV0 (`UnitProgression/docs/Feedback/FeedbackV0`, 2026-05-07) flagged the late-tier Archer as "too much detail, especially in the later levels: too many nits, golden filigree, and armor pieces broken into tiny sections, like the skirt armor in the higher levels."

**Locked principle**: higher levels gain richness via **VOLUME and SILHOUETTE SHAPE**, not via stacked surface ornament. Each new level should add at most one or two "decoration" beats; everything else should be a coverage extension, a volume bump, or a material change.

**Authoring checklist for any new prompt** *(use this when revising a prompt or scaffolding a new unit)*:

1. **Cut filigree first.** Filigree, fine engraving, per-edge gold piping, tiny rivet rings, pauldron-seam-rivet runs are the FIRST things to drop when a level feels too detailed. They don't read at thumbnail scale.
2. **Prefer volume bumps over surface decoration.** "The pauldron grows a thicker upper cap and the lower lame extends ~1 inch further down the deltoid" beats "rivets appear along the seam" — both are "the pauldron got an upgrade," but only the first reads at thumbnail scale.
3. **Wider plates, fewer of them.** When a steel skirt / fauld / tasset is broken into many small lames it reads as fragmented kit. Prefer 5–6 wider plates over 10+ narrow strips. Same applies to articulated horizontal cuirass banding — fewer, wider lames.
4. **Strip belt-kit minimalism.** Hip pouches, tool-loop rings, leather tags, multi-pouch accumulations don't survive the AD cut. Per Archer-specific decision: dagger only; no pouches, no tool loops, no tags.
5. **Bow / weapon evolution = silhouette change, not just surface ornament.** Short bow → longbow is a thumbnail-readable change. Brass binding rings + tip caps + thin gold inlay are ornaments and should be the SECOND-tier beats (not the only beats).
6. **Spread head-armor across more levels.** First metal headpiece earlier (Archer: skullcap at L4); avoid back-loading helm progression onto a single tier transition (the L7 hood-vs-coif clipping was the symptom of pushing too much head-armor change into one level).
7. **Test the prompt cut by reading the keeper-presentation Adds/Removes list out loud.** If any add reads as "fine X" / "tiny Y" / "small painted Z dots," consider whether dropping it would make the level read better at thumbnail scale. A level with 3 strong beats beats a level with 5 beats where 2 are filigree.
8. **Accessories accumulate via plate/armor, not surface trim (LOCKED 2026-05-08 per AD feedback).** When designing progression beats for boots, belts, bracers, sheaths, bow grip, etc., the new beats should add a **piece of armor** to the silhouette — a steel toe cap, a steel heel cap, an ankle guard band, a vambrace plate, a gauntlet knuckle plate, etc. **Forbidden as standalone accessory beats** (these are the same family of "tiny surface details" the detail-economy rule cuts elsewhere): brass / iron / gold **eyelets** along boot fronts; visible **shoelace / lacing strings**; **stitching rows** along seams; **rivet runs** along edges; per-edge **piping** or **trim bands** as the SOLE accessory beat at a level. **Allowed**: adding a steel/brass/gold plate that wasn't there before; volume bump on an existing plate; material change on an existing plate (steel → gold); a thin gold edge line tracing an existing steel plate's boundary at L10 royal payoff (because it's material accent on established plate, not standalone surface ornament).
9. **No cloth-above-armor on the rider torso (LOCKED 2026-05-07 per Cavalry user feedback).** Once the breastplate appears (typically L5+), the breastplate's UPPER edge must sit FLUSH against the bevor's lower edge — NEVER specify a "chest band" of livery / surcoat / tabard cloth between the bevor and the breastplate's upper edge. Cloth in a region that needs armor looks impractical, reads weird at thumbnail, and is a recurring drift target where the model thickens the cloth strip into a visible tabard panel. Livery presence on the rider is preserved via the **SKIRT BAND below the breastplate** (between breastplate bottom and tassets/belt — practical tabard-skirt look), and for mounted units via the horse caparison. Bake an explicit positive ("breastplate flush against bevor, no cloth above breastplate") + an explicit negative ("DO NOT add a chest band of cloth between bevor and breastplate upper edge") into every L5+ prompt body. Applies to all units.
10. **New metal must explicitly match the rendered L1 baseline tone (LOCKED 2026-05-07 per Cavalry generation review).** Do NOT default to "cool silver-gray steel" / "cool dark-gray iron" boilerplate when the rendered L1 baseline shows a WARM gray. The Cavalry kettle-helm + spear leaf-tip render with a warm gray + brown-tinted shadows; the original spec said "cool silver-gray" and the chain inherited that, producing every new metal piece in cool/blueish steel that grows distractingly bluer than the L1 baseline as more metal is added at L5-L10. Audit the **rendered L1 baseline image** (not the spec text) before authoring any metal-color language. Use phrasing like *"neutral silver-gray steel matching the L1 [helmet/spear-tip/coif/etc.] tone (balanced gray, neither blue-shadowed nor brown-shadowed)"* and pair with a negative: *"DO NOT render any new metal in cool blue-gray steel, bluish steel, icy silver, chrome, or any cool-toned palette — every new metal addition must match the NEUTRAL gray tone of the L1 baseline (balanced gray, NEITHER blue-shadowed NOR brown-shadowed; clean-white highlights, neither cool nor warm)."* Tone mismatch compounds across the chain — each level adds one more piece of cool steel against the warm baseline, so by L7-L10 the rider reads as wearing two different metals. Same audit applies when establishing or revising any unit's L1 baseline color spec.

11. **Heraldic-shape vocabulary creates stubborn bias (LOCKED 2026-05-07 per Cavalry L10 fleur-de-lis bleed).** Words like *fleur-de-lis*, *lily*, *trefoil*, *cross*, *lion*, *eagle*, *scroll*, *filigree*, *crest*, *rosette* are high-bias tokens — once they appear *anywhere* in the prompt body (including inside `NOT a fleur-de-lis` constructions), the model latches on and renders them. We removed `fleur-de-lis flared tip` from the L10 spike description and the model still rendered fleur-de-lis tips until we triple-locked. **Authoring rule**: avoid heraldic vocabulary in positive clauses unless the design literally requires it. When you must say *"NOT X"* for a heraldic shape, use **three-layer locks**: (a) positive description with explicit `NOT X` qualifier ("a clean smooth conical taper, NOT a fleur-de-lis"), (b) at least one **dedicated negative clause** in the NEGATIVE block enumerating the failure modes (`DO NOT shape ... as a fleur-de-lis, lily, trefoil, 3-prong fork ...`), (c) `_meta.adds[].summary` echoing the same negative. Negative-only is not enough.

12. **Layered/stacked plate construction invites sculpted-detail bleed (LOCKED 2026-05-07 per Cavalry pauldron progression).** When a level adds armor *volume*, describe it as **single-piece growth** (*"the existing pauldron grows ~25% taller and ~15% wider"*), NOT as **stacked construction** (*"a second smaller disc layered on top, two stacked discs joined by visible rivets"*). The stacked-construction language reads as a decoration cue and pulls in extra ornament — riveted seams, embossed motifs, edge-piping. Same applies to tassets (volume + flare, not third lame), cuirass (volume + single seam, not articulated banding), helms (taller dome, not separate cap). The Cavalry pauldron ramp is now locked across L4-L10 as single-piece progression: single disc → thicker dome → dome + bicep coverage extension → further volume growth.

13. **Reduce-then-remove for problematic beats (LOCKED 2026-05-07 per Infantry rivet bleed iteration).** When an element causes drift, misreading, or bleed, **reduce first** (count, size, prominence), then if bleed continues past the next generation, **remove and replace** — don't taper halfway. Half-strength signal is often enough to keep the model's bias active. The Infantry shield rim rivets went 8 → 4 → entirely removed; Cavalry L9.5 fin gold spike caps were tested at 1.5" cones, model misread, removed and replaced with caparison gold-trim band. **Authoring rule**: budget two iterations for "reduce then re-test"; if the third generation still shows the failure mode, drop the beat entirely and design a different upgrade.

14. **Visual motifs propagate across unrelated surfaces (LOCKED 2026-05-07 per rivet bleed-through observed at Cavalry L3 + Infantry helmet).** When a small visually distinctive motif (rivets, studs, dot patterns, sphere ornaments, eyelets) is introduced at any level, it tends to **appear on other surfaces in subsequent generations** — even when the original positive describes only one feature. Infantry L2 shield rim rivets bled to the helmet brow band and onto the L7 shield as a 16-stud rim band; Cavalry L3 pauldron seam rivets bled across the chain. **Authoring rule**: when introducing any small-motif beat, (a) prefer to avoid it entirely (use plate addition / coverage extension / material change instead — § L item 8), (b) if you must introduce one, **pre-emptively negate it on every other surface** in the same prompt body's NEGATIVE block ("DO NOT add iron rivets, studs, embossed dots, or any small metal punctuation along the leather waist belt, the leather under-jacket sleeves, the surcoat hem, the saddle leather, the bridle straps, the caparison panels, the rider's hands, or any surface beyond what the input image already shows"), (c) carry the negative through every downstream prompt in the chain — bleed compounds. Treat every small-motif positive as a chain-wide commitment, not a one-level beat.

This rule supersedes any earlier per-level prompt that calls for filigree / per-edge gold piping / multi-pouch belts / pauldron-rivet runs / boot eyelet runs / lacing detail / cloth chest bands above breastplate / cool-blue steel descriptions on warm-baseline units / heraldic vocabulary as decoration / stacked-disc pauldron construction. When updating an existing prompt, strip those passes and rely on coverage extension, plate addition, material change, single-piece volume bumps, or warm-tone-matched metal language to carry the upgrade.

**APPLY THE RULE BEAT-BY-BEAT, NOT BY CATEGORY (LOCKED 2026-05-08, after a real over-application).** When applying detail-economy to an existing prompt, evaluate each candidate beat individually against the rule's INTENT — do NOT bulk-drop a level's beats by category. The rule's target is **fine surface ornament that doesn't read at thumbnail**: filigree, per-edge piping, fine engraving, tiny rivet rows, etched scrollwork, ornamental motifs. The rule's allowed substitutes are **volume + silhouette + material** beats: cabasset brim, gold diamond finial cap, taller pauldron, steel toe cap, full-arm scale-mail extension, fully gold limb. **These read at thumbnail and ARE the rule's positive endorsement** — do not drop them along with the filigree.

Worked example (the over-application that triggered this guardrail): the L10 v4_detail_economy rewrite (2026-05-07) dropped 9 of 11 v2_royal beats including the cabasset brim, gold diamond finial cap, three crown spikelets, vertical visor T-bar, and bulkier pauldrons. Of those, only the breastplate filigree scrollwork, vambrace cuff scrollwork, decorative bow limb-tip scrollwork, cartouche-shaped buckle (etching), and gold cape clasps were valid drops (true surface ornament). The cabasset brim (volume change) + diamond finial cap (material change at apex) + bulkier pauldrons (volume bump) were silhouette/volume/material beats — exactly what AD's "volume + material, not surface decoration" framing endorses. User caught the over-application on 2026-05-08 and asked for the helm beats back; v5_helm_partial_restore + v6_pauldron_volume_bump fixed it.

**Authoring procedure when applying detail-economy** to an existing prompt:
1. List every beat at the level.
2. For each beat, classify: is it FINE SURFACE ORNAMENT (filigree, etched line, rivet row, per-edge piping, tiny dot pattern) or VOLUME / SILHOUETTE / MATERIAL (added plate, plate growth, plate replacement, material change like steel→gold)?
3. Drop ONLY the fine-surface-ornament beats. Keep the volume/silhouette/material beats.
4. If a beat is borderline (e.g. a 0.5-inch trim band), ask: "would this read at thumbnail?" If yes → keep. If no → drop. The "reads at thumbnail" test is the deciding criterion.
5. Document each drop in the history with one-line rationale (e.g. "DROPPED breastplate filigree — fine surface ornament per detail-economy"). Document KEEP decisions too if a beat would otherwise look like an oversight ("KEPT cabasset brim — silhouette change, not filigree, per detail-economy beat-by-beat rule").

---

## Part 3 — Glossary of locked decisions

Decisions that are no longer up for debate (each made by the user during the 2026-05-04 working session, with later reversals annotated in-place — see audit-trail convention below).

**Reversal audit-trail convention (LOCKED 2026-05-08).** When a locked decision in this list is reversed or revised by AD, **edit the existing entry in-place with a `(revised YYYY-MM-DD: <reason>)` or `(reversed YYYY-MM-DD: <reason>)` suffix — do NOT delete and re-add.** This preserves the why-was-it-changed audit trail across multiple revisions and keeps the decision number stable so cross-references in prompt JSONs / history entries / other docs don't break. Worked example: locked decision #6 (input strategy) and decision #20 (tier-break alternatives) were both revised on 2026-05-07 with the single-input-chained rule — the original wording stays as a struck-through or annotated record; locked decision #23 (boot-related bullet on belt-kit minimization in §H) was revised on 2026-05-08 to un-retire the dagger. Same pattern applies in `<UnitName>.md` per-unit specs and in any `_meta.history` entry that names a prior locked decision: cite the decision number + the revision date so the reader can scan back to the original.

The numbered list below:

1. **Two ground-truth anchors**: `Refs/L1_Base.png` (1024×1024, rescaled by user) and `../Source/Ref/Archer/level10archer.png`.
2. **Three armor tiers** (Leather L1-L3, Scale Mail L4-L6, Plate L7-L9) + Royal L10 topper.
3. **Tier 2 = Scale Mail, NOT chainmail** (per gray-coif bearded reference image).
4. **Each level needs a clearly visible armor / outfit upgrade** — no "polish pass" levels with only minor tweaks.
5. **Livery (red+yellow tunic)** must remain visibly dominant on chest L1–L7, then migrates to alternating tassets L8–L10. Strongest preservation requirement after pose and framing.
6. **Input strategy** (REVISED 2026-05-07): single-input chained only. Every level past L2 (chain origin) takes a SINGLE input = the previous level's composited keeper. **Do NOT also send L1_Base as a second image.** Reverses the v2-era Rule 2 / Rule 3 multi-input approach which caused chronic content drift (dagger sheath regression, kit feature drift, gold soft-fails) because the model pulled features from both inputs. See § Part 1 § B.
7. **No auto-picks** — always present all 4 variants for keeper selection.
8. **Bow tier progression**: leather (L1-L3, plain wood) → brass (L4-L5, grip-end bindings + tip caps) → first gold (L6, inner-curve inlay) → gilt tips expand (L9) → fully gold (L10).
9. **Bandolier deprecated** — removed from L5 onward (rendered but didn't read distinctly).
10. **Pose precision**: forearm horizontal across chest at exactly 90°, tight closed fist with knuckles outward, fist hovers at chest center and does not touch the bow / bowstring / chest.
11. **Framing pixel-locked to L1_Base**: 1024×1024 / 74.7% v.fill / 13.5% top / 11.8% bot / 56.8% h.fill.
12. **Hand convention is anatomical**: bow in anatomical-LEFT (viewer-RIGHT), draw in anatomical-RIGHT (viewer-LEFT).
13. **Locked keepers (as of 2026-05-04)**: L2 v3, L3 v1, L4 v3. L5 keeper pending user selection.
14. **No multi-panel grid generation for progression** (2026-05-04) — tested 1×4 (21:9) and 2×2 (1:1) grids per tier; last two panels always collapsed into near-identical images. See Part 1 § J. Stay on per-level chained pipeline.
15. **L1-anchored prompt set is the production strategy** (2026-05-04) — full set in `Prompts/archer_anchored_L<2..6>.json`. Every level generates from `Refs/L1_Base.png` in a single pass; never chain from a previous keeper. Bounds noise/drift to one re-encoding per level instead of compounding across the chain. See Part 1 § B Rule 1.
16. **ESRGAN 2× is the default cleanup pass; NAFNet deblur is the fallback; the chain runs at 2K** (LOCKED 2026-05-13; supersedes the 2026-05-04 / 05 NAFNet-default at 1024) — `fal-ai/esrgan` with `scale: 2`, output saved at 2048×2048 as-is (no downscale). Significantly faster + cheaper than NAFNet on the fal queue. Works well on the painted artefact pattern for the vast majority of keepers. Switch to `fal-ai/nafnet/deblur` for a specific keeper only when the user flags the ESRGAN-cleaned composite as worse than raw (over-sharpening, halo, washed brushwork, color drift); NAFNet preserves dim, so apply it to the ESRGAN-upscaled-to-2K raw rather than the 1024 raw. Backup-of-the-fallback: chain NAFNet denoise → NAFNet deblur if a single NAFNet pass isn't enough. SUPIR / clarity-upscaler / aura-sr tested and rejected for this style. ESRGAN also does the chain-start pre-flight upscale on any non-2K `Refs/L1_Base.png`. See Part 1 § K.
15. **Sanity-check the FINAL chained step against the actual ground truth before locking the plan** (2026-05-04) — discovered mid-pipeline that the locked L9 → L10_Base.png jump was too large (cloth tassets vs steel faulds, plain plate vs gold-trimmed plate, conical helm vs taller pointed helm). Resolution: inserted L9.5 "Royal-Grade Plate Graduation" as an intermediate bridge level, cleanly absorbed by chaining from L9 v3 keeper. Authoring rule: at plan time, render-test the last 1-2 levels against the ground truth ref before committing to the per-level beat list — if the jump is too big to plausibly land in one chained step, insert an X.5 intermediate.
16. **Livery migration ends at L9, not L10** (2026-05-04, revising the original locked rule) — the L10 ground truth shows NO mustard yellow in the silhouette and the only red is the cape + throat wedge. Revised migration: cloth tassets at L8 + L9 (red+yellow alternating), steel fauld plate skirt at L9.5 + L10 (no cloth at hip, gold edge trim instead). Mustard yellow effectively migrates into the gold accents from L9.5 onward. The original "tassets carry livery L8-L10" rule was based on an early read of the ground truth and doesn't survive contact with L10_Base.png.
17. **Don't retire scout-kit accessories cleanly between tiers without flagging the visual loss** (2026-05-04) — the L8 plan retired hip pouches + knife from L7 to "let the wider belt and tassets fill the silhouette." User flagged this as a real visual downgrade ("L7 still has all of these accessories on his belt which are now gone"). Authoring rule: when the plan retires named accessories at a tier transition, surface this as a deliberate decision in the keeper-review presentation (not a quiet plan-text consequence) so the user can override.
18. **Chained pipeline cannot match a standalone-painted ground-truth pose** (2026-05-04, L9.5→L10 experiment) — generating L10 via the chain from L9.5 produced a clean match on every kit / material element (gold spike finial, fully gold bow, steel faulds, all gold trim) but the POSE was locked to L1's closed-fist-forearm-across-chest convention, which differs from L10_Base's lower bow grip. The pose lock is by design (unit consistency across all 10 levels). If the goal is ever to reproduce a specific ground-truth pose, that requires a separate free-pose prompt that breaks the L1 framing/pose anchor.
19. **Background is described as clean white only, never transparent (LOCKED 2026-05-05)** — nano-banana-pro/edit cannot emit alpha; the word "transparent" in the prompt produces a baked checkerboard pattern. All prompts and style anchors now say "clean white background" only.
20. **Tier-break levels have a chained alternative prompt (2026-05-05; updated 2026-05-07)** — for L4 and L7, the canonical prompt is the chained variant (`archer_edit_L<n-1>_to_L<n>.json`) with the SINGLE-INPUT chained rule (locked decision #6 revised 2026-05-07). The anchored alternates (`archer_edit_L1_to_L<n>.json`) are DEPRECATED in v3+ and not used. Outputs go to `out/v<N>/L<n>/` (no `_chained` suffix needed since chained is the only path).
21. **Seed reproducibility is `num_images`-conditional (LOCKED 2026-05-05, REVISED same day)** — the fal `nano-banana-pro/edit` endpoint honors the seed parameter only when `num_images: 1`; with `num_images: 4` it produces non-deterministic batches (verified: two consecutive submissions of an identical seed=42 + num_images=4 payload yielded 4 different SHA-256 hashes per variant). Two operating modes: **fast mode** (one num_images=4 call per level — fast, NOT reproducible — current default for routine iteration) and **reproducible mode** (four parallel num_images=1 calls with seeds `S, S+1, S+2, S+3` — same wall-clock when parallelized, byte-reproducible per variant — use for prompt-edit iteration with pinned baseline, audit-grade provenance, drift calibration). The sidecar JSON writes in both modes; in fast mode the seed is audit-only, in reproducible mode it does the work. See Part 1 § A2.
22. **Diff-mask composite is the mandatory drift-mitigation step between every level lock and the next chained generation (LOCKED 2026-05-05; spatial knobs doubled 2026-05-13 for the 2K chain)** — preserves L_input pixels in unchanged regions byte-perfect (preserved_drift mean abs ~0.05 at 1K) while keeping L_raw pixels in edit regions. Replaces no-op-calibration drift subtraction (which had prompt-conditioned residual that couldn't be eliminated AND cost +1 API call per chain step). Defaults: `low=5, high=15` (intensity-based, unchanged), `diff_pool_sigma=16, mask_blur_sigma=6, dilate_edit_px=20` (pixel-space, doubled 2026-05-13 from the 1K-era `8 / 3 / 10`). For tier breaks bump dilate to 30-40 (was 15-20 at 1K); for tiny adds drop to 0-10. Tool: the [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md) (script: `.claude/skills/composite-keeper/scripts/composite_keeper.py`). Always inspect the QC image and resolve any warnings before chaining forward — they propagate. ⚠ The 2026-05-13 doubling is a geometric scaling — the seed_calibration sweep has not been rerun at 2K. Retune `pool / mask_blur / dilate` manually if QC metrics drift on early 2K keepers. See Part 1 § L. Full sweep + decision rationale in `experiments/seed_calibration/composite_boundary_test/`.

23. **Detail Economy / Silhouette-First Rule (LOCKED 2026-05-07 per AD FeedbackV0)** — late-tier richness comes from VOLUME and SILHOUETTE SHAPE, not from stacked surface ornament. Specific Archer applications:
    - **Belt kit minimized**: dagger sheath at L3 is the ONLY belt accessory through the chain. NO hip pouches at any level. NO tool-loop ring at L6. NO leather tags. **Dagger sheath carries through L3–L10** (the original 2026-05-07 lock retired it at L8; AD reversed that on 2026-05-08 — the dagger remains visible at the anatomical-RIGHT hip on every level, hanging from the L8+ wider belt above/in-front-of the tassets). (Reverses earlier plan that accumulated 1-2-3 hip pouches across L2/L3/L6.)
    - **First metal headpiece at L4 (steel skullcap under hood)**, hood retires at L5 (drops to shoulders as red mantle). L7 transitions cleanly to open-face conical helm — no hood-vs-coif clipping because the hood is already gone two levels earlier. (Reverses earlier "L7 first helm + hood retires" plan that produced the clipping.)
    - **Bow shape evolution**: short recurve L1–L5 → limbs lengthen ~20% at L6 → longbow proportions L7+ → fully gold longbow L10. Replaces the earlier brass-detail-then-gold-inlay accumulation at L4–L6.
    - **Full-arm scale-mail at L7+**: scale-mail sleeves cover full bicep-to-wrist with vambrace sitting on top — no exposed bicep gap. (Reverses the earlier "scale mail visible at the bicep gap" detail.)
    - **L9 surface-rivet pass dropped**: pauldrons grow taller (volume bump) instead. No pauldron-seam rivet dots.
    - **L9.5 per-edge gold piping dropped**: no breastplate edge trim, no vambrace cuff trim, no per-pauldron-lame edge trim. Gold accents at L9.5 = helm trim band (carried from L8) + belt buckle (carried from L9) + outer-50% gilt bow (new) only.
    - **L9.5 fauld skirt simplified**: 5–6 wider lames instead of 10+ narrow plates. Reduces fragmentation.
    - **L10 surface ornaments simplified**: no filigree, no per-edge piping. The two L10 beats are full gold spike finial + fully gold longbow (volume + material, not surface decoration).
    - **Existing `level10archer.png` ground-truth ref will be re-rendered** to match the simplified plan once a v3 chain produces a clean L10 keeper. Until then, the existing ref is "old plan" and the v3+ generations should follow the simplified spec, NOT verbatim reproduction.

24. **"Chainmail" terminology in feedback = scale mail (LOCKED 2026-05-07)** — when AD or any reviewer says "chainmail," they mean our locked scale-mail spec (chunky overlapping rounded scale plates per the gray-coif bearded-character reference). The model's "fine ring mesh" rendering is still the wrong default and the negative-list still applies (`chainmail rings, fine ring mesh, interlocking metal rings`). This is a terminology bridge — not a switch back to ring mesh.

25. **No cloth-above-armor on the rider torso (LOCKED 2026-05-07 per Cavalry user feedback)** — once the breastplate appears (typically at L5+), the breastplate's UPPER edge sits FLUSH against the bevor's lower edge with NO cloth visible between them. Never specify a "chest band" of livery / surcoat / tabard cloth between bevor and breastplate's upper edge — looks impractical (cloth in a region that needs armor), reads weird at thumbnail, and is a recurring drift target where the model thickens the strip into a visible tabard panel. Livery presence on the rider is preserved via the SKIRT BAND below the breastplate (between breastplate bottom and tassets/belt), and for mounted units via the horse caparison. Authoring rule: every L5+ prompt body needs an explicit positive ("breastplate flush against bevor, no cloth above") + an explicit negative ("DO NOT add a chest band of cloth between bevor and breastplate upper edge"). Applies to all units.

26. **New metal must explicitly match the rendered baseline tone (LOCKED 2026-05-07 per Cavalry generation review)** — boilerplate "cool silver-gray steel" descriptions inherited across the prompt chain produce cool/blueish new metal that diverges from rendered baselines that read neutral with brown-tinted shadows. Tone mismatch compounds level by level. Audit the rendered baseline IMAGE (not the spec text) before authoring any metal-color language; use *"neutral silver-gray steel matching the kettle-helm tone shown in the input image (balanced gray, neither blue-shadowed nor brown-shadowed)"* + an explicit negative *"DO NOT render any new metal in cool blue-gray steel, bluish steel, icy silver, chrome, or any cool-toned palette."* Same audit applies when establishing/revising any unit's baseline color spec.

27. **Prompt body must reference what the model can SEE, never our internal context (LOCKED 2026-05-07 — CRITICAL).** The nano-banana-pro/edit (Gemini-family) model is **stateless** between calls. It receives ONLY (a) the single input image, and (b) the prompt body. It has **NO awareness** of: prior levels in the chain (`L1`, `L4`, `L9.5`, etc.), our level naming convention, version history (`v3`, `v6`), authoring decision history (`per AD FeedbackV0`, `LOCKED 2026-05-07`, `REVISED per detail-economy`), the progression plan, the unit's CLAUDE.md, or anything outside this single API call. When the prompt body says *"preserve the L4 scale-mail"* or *"matching the L1 kettle-helm tone"*, the model sees an opaque token (`L4`, `L1`) it cannot resolve — best case it ignores the token, worst case it hallucinates a referent.
    - **Always describe features as observed in the input image**: *"the kettle-helm shown in the input image"*, *"the existing scale-mail short sleeves visible on both upper arms"*, *"the leather grip cord wrapping the upper third of the spear haft visible in the input image"*, *"the brass buckle centered at the front of the leather waist belt"*.
    - **Drop our internal level tags** (`L1`, `L2`, …, `L9.5`, `L10`) from the prompt body. They belong in `_meta.history`, `_meta.purpose`, the progression plan, and CLAUDE.md — never in the model-facing prompt string.
    - **Drop our internal authoring history** from the prompt body (`per AD FeedbackV0`, `LOCKED YYYY-MM-DD`, `REVISED per detail-economy`, `v6`, etc.). The model cannot resolve these references and they consume tokens. Move all such commentary to `_meta.history` so future authors see it without polluting the model's input.
    - **Cross-prompt references must be rewritten as observation**. *"as introduced at L7"* → drop entirely. *"the L8 third pauldron lame"* → *"the third pauldron lame visible in the input image"*. *"the L4+L6+L8 layered pauldron stack"* → *"the layered pauldron stack visible on each shoulder in the input image"*.
    - **Keep intra-prompt numbered add markers** `(1) TITLE — body`, `(2) TITLE — body`, and intra-prompt cross-refs like "per Edit Goal item (2)" — these are visible to the model in the same prompt string.
    - **Test by re-reading the prompt body alone, with no other context**. If a sentence references something the model cannot see in the input image or earlier in the same prompt body, rewrite it.

28. **Heraldic-shape vocabulary creates stubborn bias (LOCKED 2026-05-07 per Cavalry L10 fleur-de-lis bleed)** — words like *fleur-de-lis*, *lily*, *trefoil*, *cross*, *lion*, *eagle*, *scroll*, *filigree*, *crest*, *rosette* are high-bias tokens that the model latches onto even when wrapped in `NOT X` constructions. Negative-only is not enough. When the design must reference such a shape (in positive or negative), use **three-layer locks**: (a) positive description with explicit `NOT X` qualifier, (b) at least one dedicated negative clause in the NEGATIVE block enumerating failure modes, (c) `_meta.adds[].summary` echoing the same negative. Better still: avoid heraldic vocabulary entirely if the design doesn't require it. See § Part 2 § L item 11.

29. **Layered/stacked plate construction invites sculpted-detail bleed (LOCKED 2026-05-07 per Cavalry pauldron progression)** — describe armor *volume* additions as **single-piece growth** (*"the existing pauldron grows ~25% taller and ~15% wider"*), NOT as **stacked construction** (*"a second smaller disc layered on top"*). Stacked-construction language reads as a decoration cue and pulls in extra ornament (riveted seams, embossed motifs, edge-piping). Same for tassets, cuirass, helms. The Cavalry pauldron ramp is locked across L4-L10 as single-piece progression: single disc → thicker dome → dome + bicep coverage extension → further volume growth (no third lame, no fourth uppermost cap, no stacked rivets). See § Part 2 § L item 12.

30. **Reduce-then-remove for problematic beats (LOCKED 2026-05-07 per Infantry rivet bleed iteration)** — when an element causes drift, misreading, or bleed, **reduce first** (count, size, prominence). If bleed continues past the next generation, **remove and replace** — don't taper halfway. Half-strength signal often keeps the bias active. Infantry shield rim rivets went 8 → 4 → entirely removed; Cavalry L9.5 fin gold spike caps were tested at 1.5" cones, model misread, removed and replaced with a caparison gold-trim band. Budget two iterations for "reduce then re-test"; if the third generation still shows the failure mode, drop the beat entirely. See § Part 2 § L item 13.

31. **Visual motifs propagate across unrelated surfaces (LOCKED 2026-05-07 per rivet bleed observed at Cavalry L3 + Infantry helmet)** — small visually distinctive motifs (rivets, studs, dot patterns, sphere ornaments, eyelets) introduced at any level tend to **appear on other surfaces in subsequent generations**, even when the original positive describes only one feature. Infantry L2 shield rim rivets bled to the helmet brow band and onto the L7 shield as a 16-stud rim band. **Authoring rule**: prefer to avoid small-motif beats entirely (use plate addition / coverage extension / material change instead — § Part 2 § L item 8). If you must introduce one, **pre-emptively negate it on every other surface** in the same prompt body's NEGATIVE block, and **carry the negative through every downstream prompt** in the chain. Treat every small-motif positive as a chain-wide commitment, not a one-level beat. See § Part 2 § L item 14.

32. **`fal-ai/nano-banana-pro/edit` `resolution` is a STRING ENUM, not a pixel count (LOCKED 2026-05-13 per Infantry smoke-test 422)** — valid values are exactly `"1K"`, `"2K"`, `"4K"`. Submitting `"1024"` / `1024` / `"2048"` / any numeric pixel count returns HTTP 422 with `{"detail":[{"type":"literal_error","loc":["body","resolution"],"msg":"Input should be '1K', '2K' or '4K'", …}]}`. **The failure is sneaky**: the status endpoint reports the request as `COMPLETED` with `inference_time` ~0.06s (a validation-failed shortcut path that mimics completion), and the 422 only surfaces when the result endpoint is GET'd. Hit during the 2026-05-13 Infantry end-to-end smoke test — a Python orchestrator with `"resolution": "1024"` produced "fast completion" then 422 on result fetch. Diagnostic heuristic: **if a request "completes" implausibly fast (inference_time well below 1s) and the result fetch 422s, check enum-valued payload fields first** (`resolution`, `aspect_ratio`, `output_format`, `safety_tolerance`) before assuming a model or content issue. Locked default for the chain: `"1K"` (native model output 1024×1024, then ESRGAN 2× brings to 2K chain dim — see § Part 1 § K). All authored prompt JSONs in `UnitProgression/<Unit>/Prompts/` already carry `"1K"` and should not be edited to numeric forms.

---

## Part 4 — Quick reference — common operations

**Author a new prompt (within-tier delta):**
1. Copy the most recent within-tier prompt (e.g. `archer_edit_L4_to_L5.json`) as a template.
2. Update `_meta.purpose`, `_meta.input_image_content`, `_meta.output_target`, `_meta.tier`, `_meta.history`.
3. Update the `image_urls` placeholders to point at the new previous-keeper PNG.
4. Replace the EDIT GOAL paragraph and the `===== L<n> NEW ADDS =====` block.
5. Update the `===== PRESERVE FROM <input> EXACTLY =====` block to mention the carried adds visually.
6. Keep POSE / FRAMING / STYLE blocks verbatim from the previous prompt.
7. Update the NEGATIVE block to negative-list every later-tier element ("DO NOT add closed visor — that arrives at L9").
8. Verify JSON parses: `python -c "import json; d=json.load(open('<file>')); print(len(d['prompt']))"`.

**Run a generation:**
1. Upload input image(s): `bash .claude/skills/fal-api-skills/skills/fal-generate/scripts/upload.sh --file <path>`.
2. Generate a fresh seed: `SEED=$(python -c "import secrets; print(secrets.randbelow(2**31))")` (or pin a specific seed for an A/B run).
3. Build payload including the seed: see Part 1 § A above.
4. POST to `https://queue.fal.run/fal-ai/nano-banana-pro/edit`; capture `request_id` AND `$SEED`.
5. Write the sidecar `out/v<N>/L<n>/archer_L<n>_seed<S>.json` immediately (Part 1 § A2 schema) with seed, request_id, prompt_file, prompt_sha256, image_urls, input_files, payload params.
6. Poll status (15s cadence) until `COMPLETED`.
7. GET the result endpoint; download all 4 image URLs to `out/v<N>/L<n>/archer_L<n>_v<1..4>.png`.
8. Measure framing on all 4.
9. Present to user (no auto-pick).

**Lock a keeper and chain forward:**
1. User picks the keeper (e.g. v3).
2. **Clean up the RAW keeper FIRST** (§ G2, § K — runs BEFORE the composite, never after):
   - Upload `out/v<N>/L<n>/variants/archer_L<n>_v<i>.png` (1024×1024 from nano-banana-pro/edit) to FAL CDN.
   - **Default = ESRGAN 2× supersample** — POST to `https://queue.fal.run/fal-ai/esrgan` with `{"image_url":"<uploaded>","scale":2}`. Poll, fetch `result.image.url`, download the 2048×2048 result and save it as-is to `out/v<N>/L<n>/composite/archer_L<n>_v<i>_denoise.png` (no downscale — the chain runs at 2K).
   - **Fallback = NAFNet deblur** when the user reports issues with the ESRGAN-cleaned composite. NAFNet preserves dim, so first ESRGAN-upscale the raw to 2K (same call as above), re-upload the 2K result, then POST to `https://queue.fal.run/fal-ai/nafnet/deblur` with `{"image_url":"<raw_2k_url>"}` and save the 2048×2048 result to the same `_denoise.png` path.
   - Skip step 2 only when the raw keeper is visibly clean (early levels, simple adds) — but even then, ESRGAN-upscale the raw 1024 keeper to 2K so it composites cleanly against the 2K chain.
3. **Apply diff-mask composite** on the DENOISED RAW (mandatory — see Part 1 § L):
   ```bash
   python .claude/skills/composite-keeper/scripts/composite_keeper.py \
     --raw    out/v<N>/L<n>/composite/archer_L<n>_v<i>_denoise.png \
     --input  out/v<N>/L<n-1>/composite/archer_L<n-1>_v<j>_composited.png \
     --low 10 --high 25 \
     --output out/v<N>/L<n>/composite/archer_L<n>_v<i>_composited.png \
     --qc-image out/v<N>/L<n>/composite/archer_L<n>_v<i>_qc.png \
     --qc-json  out/v<N>/L<n>/composite/archer_L<n>_v<i>_qc.json
   ```
   Tighter thresholds `--low 10 --high 25` (locked v2 default; intensity-based, dim-invariant) preserve more of the prior composite's face/hood/cape; the original 5/15 leaks faint face touch-ups into the edit zone. Spatial knobs default to `--pool 16 --mask-blur 6 --dilate 20` at 2K (doubled 2026-05-13 from the 1K `8 / 3 / 10`). For tier breaks override `--dilate 30` (was 15 at 1K); for very large edit areas (L10) use `--dilate 40` (was 20 at 1K).
4. **Inspect the QC image and JSON.** Resolve any printed warnings before chaining (Part 1 § L.1 has the metric reference). Common fixes: `mask_islands` too high → bump `--pool` to 12-15; boundary artefacts at edit edges → bump `--dilate` to 15-20.
5. Update `_meta.input_image` in the next-level prompt JSON to reference the composited keeper.
6. Upload that file to FAL CDN (returns a fresh URL).
7. Run the next-level generation with the composited keeper URL as the SINGLE entry in `image_urls` (single-input chained — locked 2026-05-07; do NOT also send L1_Base as a second image). Pass an explicit seed and write the sidecar (see "Run a generation" above). **Do NOT run any cleanup pass (ESRGAN or NAFNet) on the composite before chaining** — cleanup drift on the preserved regions defeats the composite's purpose.

**Reproduce a batch from its sidecar (only works for batches generated in reproducible mode, num_images=1):**
1. Confirm the sidecar's `num_images: 1`. If it says 4, the original batch is not reproducible — see "audit-only" path below.
2. Verify `prompt_sha256` matches the current prompt body (`python -c "import hashlib,json; print(hashlib.sha256(json.load(open(F))['prompt'].encode()).hexdigest())"`). If not, the prompt has drifted; outputs will differ.
3. Re-upload `input_files` to refresh the FAL CDN URLs.
4. Build the payload with the recorded `seed`, `num_images: 1`, and the refreshed image URLs.
5. POST. Output should be byte-identical to the original.

**Audit a past run from a `num_images=4` (fast-mode) sidecar:**
1. Open the sidecar JSON next to the batch.
2. Compare `prompt_sha256` against the current prompt body. Match → prompt hasn't drifted; mismatch → it has.
3. Use the `input_files`, `submitted_at`, and `request_id` to reconstruct what was attempted (request_id queryable in the fal dashboard for hours-to-days).
4. **Do NOT expect re-submitting the recorded payload to recreate the original PNGs** — the num_images=4 batching path is non-deterministic. If you need a similar batch, submit fresh.

**A/B compare two prompts with seed-pinned baseline (reproducible mode):**
1. Pick four seeds (e.g. `S, S+1, S+2, S+3`). Submit prompt A at `num_images: 1` four times in parallel, one per seed.
2. Submit prompt B at `num_images: 1` four times in parallel with the same four seeds.
3. Save outputs to parallel dirs (e.g. `out/v<N>/L<n>/` and `out/v<N>/L<n>_chained/`), one sidecar per call.
4. Pixel-diff `A_seed<S>` vs `B_seed<S>` per pair → only prompt-driven differences (no sampling noise).
5. After editing either prompt, re-submit just that prompt's four seeds — the other side stays as the original baseline.

**A/B compare two prompts in fast mode (no seed pinning):**
1. Submit both payloads at `num_images: 4` in the same session window.
2. Save outputs to parallel dirs.
3. Judge by majority signal across 4 variants per side. Don't read into single-variant differences.
4. If you re-author either prompt, re-submit BOTH sides — fast-mode batches don't survive prompt edits.

**Final delivery (after the full L1–L10 chain is locked):**
1. Create `out/v<N>/Final/` (sibling to the per-level dirs).
2. Copy each locked composite keeper into `Final/` named by level label only — `L1.png`, `L2.png`, … `L9.png`, `L9_5.png`, `L10.png`. L1.png is `Refs/L1_Base.png` (the ground-truth source). All other level PNGs come from `out/v<N>/L<n>/composite/archer_L<n>_v<keeper>_composited.png`.
3. Build the horizontal progression compilation:
   ```python
   from PIL import Image
   TILE = 1024
   labels = ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L9_5','L10']
   imgs = [Image.open(f'Final/{l}.png').convert('RGB') for l in labels]
   imgs = [(im if im.size == (TILE, TILE) else im.resize((TILE, TILE), Image.LANCZOS)) for im in imgs]
   canvas = Image.new('RGB', (TILE * len(imgs), TILE), (255, 255, 255))
   for i, im in enumerate(imgs): canvas.paste(im, (i * TILE, 0))
   canvas.save('Final/progression_compilation.png')                                # 11264x1024 full-res
   canvas.resize((256 * len(imgs), 256), Image.LANCZOS).save('Final/progression_compilation_thumb.png')  # 2816x256
   ```
4. The `Final/` dir is the deliverable hand-off. Per-variant suffixes and `_composited` qualifiers are dropped so the rank progression is browsable at a glance.
5. **Upload to the team Drive folder** via the `gdrive-upload` skill. Standard pattern (mirror `Archer Progression` and `Infantry Progression` already in the team folder):
   ```bash
   # Dry-run first
   python .claude/skills/gdrive-upload/scripts/gdrive.py upload \
     UnitProgression/<UnitName>/out/v<N>/Final hero-animation \
     --subfolder "<UnitName> Progression" --dry-run

   # Real run after user confirms
   python .claude/skills/gdrive-upload/scripts/gdrive.py upload \
     UnitProgression/<UnitName>/out/v<N>/Final hero-animation \
     --subfolder "<UnitName> Progression"
   ```
   `hero-animation` is the saved folder mapping for the EMTD team folder. The script creates the subfolder if missing, warns on same-name file collisions, and prints the destination folder URL on success. If the user wants a subset of levels delivered (e.g. omit L9.5 to ship a clean 10-frame progression), drop the omitted level from the `levels` list in step 2 BEFORE the compilation — confirm with the user before omitting.
