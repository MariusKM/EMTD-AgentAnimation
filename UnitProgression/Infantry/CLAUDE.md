# Infantry Unit — Pipeline & Visual-Style Notes

> Read this before authoring, editing, or running any prompt in this directory.
> Companion to [README.md](README.md), [Infantry.md](Infantry.md) (L1 base spec), and [Infantry_Progression_Plan.md](Infantry_Progression_Plan.md) (10-level ramp).
>
> **Pipeline rules and shared learnings live in `../Archer/CLAUDE.md`** — read that file in full before working in this directory. This file ONLY contains Infantry-specific deltas and unit-specific lessons. If a topic isn't covered here, the Archer doc is authoritative.

> **Skill-driven pipeline.** Run via `/unit-progression Infantry`. Generation, cleanup pass (default ESRGAN 2× saved at 2K; NAFNet deblur on the ESRGAN-upscaled raw as fallback — chain runs at 2K throughout), composite-keeper, QC, and Drive upload all run from the shell — see Archer/CLAUDE.md § Part 4 recipes.

---

## Part 0 — Output directory layout

Same as Archer (`../Archer/CLAUDE.md` § Part 0). Every level under `out/v<N>/L<n>/` has three child dirs:

```
out/v<N>/L<n>/
├── variants/   # raw fal outputs (4 PNGs)
├── sidecars/   # one sidecar per call (reproducible mode = 4 sidecars per level)
└── composite/  # _composited.png + _qc.png + _qc.json + _denoise.png
```

Final delivery: `out/v<N>/Final/` with L1.png … L10.png + L9_5.png + `progression_compilation.png`.

---

## Part 1 — Pipeline (Infantry-specific notes)

### A. Endpoint, payload, sidecars, polling
Identical to Archer. See `../Archer/CLAUDE.md` § Part 1 § A, § A2, § H.

### B. Input strategy — chained composite-only (LOCKED, deviates from Archer)

**Infantry uses Rule 2 (within-tier chained composite) for EVERY level, including tier breaks.** No Rule-1 anchored fallback prompts at L4 / L7. No `archer_edit_L1_to_L4.json`-style anchored variants.

Rationale (locked at scaffold time per user direction):
- Composite + denoise is a strong-enough drift mitigation that the chain doesn't need a hard reset at tier breaks.
- One prompt file per level is simpler and avoids the A/B keeper-selection overhead the Archer pipeline carries at L4/L7.
- The composite step's `dilate_edit_px` parameter (bumped to 15-20 at tier breaks) handles the larger edit area cleanly.

So the prompt set is exactly: `infantry_edit_L1_to_L2.json`, `infantry_edit_L2_to_L3.json`, … `infantry_edit_L9_to_L9_5.json`, `infantry_edit_L9_5_to_L10.json`. Eleven files total. Each consumes two inputs: prior composite + L1_Base scale anchor (except L10 which drops the L1_Base anchor — see Progression Plan).

If the chain ever produces visible drift at a tier break that the composite can't fix (face/coif distortion, livery loss), the escape hatch is to author an anchored `infantry_edit_L1_to_L<n>.json` for that level only — but treat as a fallback, not the default.

### B2. Composite + denoise is the mandatory drift-mitigation step between EVERY level (LOCKED)

Re-stated explicitly because Infantry pipeline relies on it more heavily than Archer's hybrid approach:

For every level transition (L1→L2, L2→L3, …, L9.5→L10) the per-step workflow is:

1. Generate 4 variants from the chained composite + L1_Base anchor.
2. User picks keeper.
3. **Clean up the RAW keeper** → `composite/<unit>_L<n>_v<i>_denoise.png` (2048×2048). **Default**: ESRGAN 2× at `fal-ai/esrgan` (`{"scale": 2}`), save the 2K result as-is — no downscale (LOCKED 2026-05-13 — chain runs at 2K; faster + cheaper than NAFNet). **Fallback**: ESRGAN-upscale the raw to 2K, then NAFNet deblur the 2K image at `fal-ai/nafnet/deblur` (NAFNet preserves dim; running it on the 1024 raw would lock a 1024 keeper into the 2K chain). Skip ONLY if the raw keeper is visibly clean (rare — cleanup is recommended for every level on Infantry given the chain depth) AND remember to ESRGAN-upscale the raw to 2K so the chain dims match.
4. **Composite the DENOISED RAW** against the prior composited keeper → `composite/<unit>_L<n>_v<i>_composited.png`. Use the [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md) (`.claude/skills/composite-keeper/scripts/composite_keeper.py`) with locked thresholds `--low 10 --high 25` (intensity-based, dim-invariant) and 2K-era spatial defaults `--pool 16 --mask-blur 6 --dilate 20` (doubled 2026-05-13 from 1K `8 / 3 / 10`). Tier-break bump `--dilate 30` (L4) or `--dilate 40` (L7). ⚠ Spatial doubling is a geometric scaling — not yet empirically recalibrated at 2K. Retune manually if QC metrics drift.
5. **Inspect QC.** Resolve every warning before chaining forward.
6. The composite becomes `image_urls[0]` for the next level.

**Never** skip steps 3-5 between levels. **Never** run the cleanup pass (ESRGAN or NAFNet) on the composite. **Never** chain off the raw keeper. Full reasoning: `../Archer/CLAUDE.md` § Part 1 § G2 + § L.

### C. Prompt structure
Same skeleton as Archer (see `../Archer/CLAUDE.md` § Part 1 § C). Replace archer-specific anchor language (bow, hood, cape, olive trousers) with Infantry anchors (mail coif, mace, round shield, blue trousers, beard).

### D. JSON gotchas, vocabulary risks
See Archer doc + Infantry-specific risks below in § Part 2 § I.

### E-M. Multi-image input, drift patterns, denoise/composite recipe, framing measurement, polling
All shared with Archer. See `../Archer/CLAUDE.md`.

---

## Part 2 — Visual Style Anchors (Infantry-specific)

### A. The Livery Rule (LOCKED)

Mustard-yellow + crimson-red split tunic is the strongest faction-identity anchor. Same rule shape as Archer but different transition curve:

- **L1-L4 (Levy → Conscript Sergeant)**: tunic dominant on the chest. Even at L4 (scale-mail sleeves) the tunic chest is fully visible.
- **L5-L7 (Sergeant → Footman Sergeant)**: tunic visible as a CHEST BAND between the breastplate (above) and the wider belt or tassets (below). Narrow strip, ~3" tall.
- **L8-L9 (Footman → Knight-Sergeant)**: livery reduced to a SKIRT BAND visible only between the breastplate's bottom edge and the tassets' top edge. ~2" tall.
- **L10 (Royal Champion)**: livery GONE. Full plate + tassets + gold; no cloth visible at the torso.

Authoring rule for every L2-L9 prompt: explicit positive language ("the mustard-yellow tunic with red center panel and red anatomical-LEFT-side panel remains visibly dominant on the chest") + explicit negative ("DO NOT cover the tunic chest panel; DO NOT shrink the tunic into a thin strip; DO NOT replace the tunic with a body coat").

### B. Pose canonical description

> Three-quarter view, body angled approximately 15-25 degrees to the viewer's left so the character's anatomical right side faces camera. Weight planted evenly on both feet, slight forward lean.
>
> THE MACE ARM (anatomical-RIGHT, viewer-LEFT) is extended forward and slightly DOWNWARD, elbow bent at roughly 120 degrees. The hand grips the upper haft of the spiked mace just below the mace head; the mace head hangs at hip height angled down toward the viewer-left, knuckles of the gripping hand visible to camera.
>
> THE SHIELD ARM (anatomical-LEFT, viewer-RIGHT) is bent at the elbow, with the forearm angled across the body bringing the round shield up to upper-chest / shoulder height. The shield's flat face presents toward the viewer at a slight three-quarter angle (NOT perfectly flat to camera, NOT edge-on). The hand and forearm are concealed BEHIND the shield.
>
> Calm guard stance — mace ready but not raised, shield up but not braced for impact. NOT a swing, NOT a charge, NOT a block in motion.

### C. Framing canonical description (LOCKED 2026-05-06)

> 1024×1024 square canvas. Character occupies approximately **66.8% of canvas vertical height** (~684px tall). Character horizontal envelope including mace + shield is approximately **60.8% of canvas width** (~623px wide). TOP of mail coif at ~16.6% from top of canvas (~170px headroom). BOTTOM of boots at ~16.6% from bottom of canvas (~170px below). Character vertically centered. ~18.3% empty margin viewer-LEFT, ~20.9% empty margin viewer-RIGHT. DO NOT zoom in, DO NOT shrink, DO NOT add wider borders, DO NOT crop the head or feet, DO NOT shift to bottom edge.

`Refs/L1_Base.png` is the 1024×1024 canonical anchor (downscaled from a 2048×2048 source backed up at `Refs/L1_Base_2K.png`).

### D. Hand convention

Same anatomical convention as Archer. Mace = anatomical-RIGHT (viewer-LEFT). Shield = anatomical-LEFT (viewer-RIGHT).

### E. Style / Outline canonical description

Identical to Archer. See `../Archer/CLAUDE.md` § Part 2 § E.

### F. Scale-mail visual spec

Identical to Archer (chunky overlapping rounded scale-shaped plates, NOT chainmail rings). See `../Archer/CLAUDE.md` § Part 2 § F. Used for the L1 mail coif and the L4+ scale-mail body adds.

### G. Mace + shield material progression *(revised 2026-05-07 per AD detail-economy)*

**Mace head:**
- L1-L3: warm-brown wooden bulb + 6 cool-gray steel spikes radial.
- L4-L6: same wooden bulb + spikes + iron banding rings + iron haft strip (L6). (L5 reinforcement plate removed per AD detail-economy.)
- L7-L9: solid cool-gray steel flanged head (6 vertical flanges replace bulb+spike).
- L10: buttery-gold along each flange's leading edge (gold-flanged at thumbnail) with the flange channel staying cool steel + a single gold end cap on the haft top. **NO chased filigree, NO per-flange-tip spiked finials** (removed 2026-05-07 per AD).

**Shield:**
- L1: plain warm-brown wooden planks + small steel central boss.
- L2-L3: + iron rim rivets (L2) + iron cross-strap bands radiating from boss (L3).
- L4: continuous iron rim band added.
- L5-L7: steel-faced (L5) → embossed sun-burst boss (L7) + ~10% larger diameter.
- L8: helm gold trim band introduced (was L9 — moved up per AD detail-economy after the L8 gold-rivet pass soft-failed). Shield itself: no engraving, no filigree (removed 2026-05-07 per AD).
- L9: gold rim band + gold ring around boss.
- L9.5: gold cross emblem on shield face.
- L10: raised-gold cross + gold dome boss + ruby gem at boss center + thick gold rim (NO embossed gold studs — clean wide band per AD detail-economy).

### H. Continuity anchors held across all 10 levels *(revised 2026-05-07 per AD FeedbackV0)*

- Mail coif (L1-L6 visible on scalp; **L3+ steel skullcap visible at the top under the coif per AD "helmet much earlier"**; L7-L10 back-of-neck drape under the larger sallet helm).
- Full short-trimmed dark-brown beard (L1-L8 visible; L9-L10 concealed by closed visor).
- Round shield (NEVER heater / kite / tower).
- Spiked / flanged mace (NEVER sword / hammer / axe).
- Mustard+crimson livery dominant on chest L1-L4, then migrating per § A.
- Dark blue trousers — visible at the calf at every level.
- Brown leather boots base — visible at calf and heel even after L8 full sabatons. **Boot armor split L4 (iron toe-cap) → L6 (ankle plates) → L8 (full sabatons) per AD "split into smaller upgrades, distributed earlier"**.
- **Belt accessories minimized**: hip pouch at L2 (anatomical-RIGHT) is the ONLY belt accessory. Dagger / knife sheath REMOVED entirely (was L3 — dropped 2026-05-07 per AD "remove the dagger entirely and keep the pouch").
- **Full-arm scale-mail from L5 onward**: scale-mail sleeves cover bicep-to-wrist (no exposed bicep gap) per AD "the chainmail being sleeveless feels odd. For the later levels, I would extend it to fully cover the arms." Vambraces (L5+) sit ON TOP of the scale-mail sleeves.
- Three-quarter view, full body, clean white background, thin black silhouette outline.
- 1024×1024 square canvas, framing locked to L1_Base except possibly L10 (drops L1_Base anchor for the new helm crest extent).

### I. Vocabulary risks (Infantry-specific — adds to Archer's list)

| Term | Risk | Use instead |
|------|------|-------------|
| `mace` (alone) | Renders as generic morningstar (long-haft spike-ball with a chain) | "wooden bulbous mace head with iron spikes" (L1-L3) / "flanged steel mace head" (L7+) — always describe head shape + material |
| `shield` (alone) | Leans heater / kite | always "round wooden shield" or "round steel-faced shield with central boss" |
| `beard` (alone) | Grows bushy / wild | "full short-trimmed dark-brown beard" or "neat dark-brown beard, trimmed short on the cheeks" |
| `sallet helm` | Sometimes renders as full-face closed helm | "open-face steel sallet helm with a forward-projecting brim, face fully visible" (L7); add "no visor at this level" negative |
| `kettle helm` | Reads peasant / conscript / wide-brim brim too dominant | Avoided in this plan — use sallet (L7) |
| `chainmail` | Fine ring mesh | always "scale mail" + chunky overlapping scale descriptive (same as Archer) |
| `transparent` background | Baked checkerboard pattern | "clean white background" only |

### J. Face visibility schedule

- L1-L8: face fully visible (open helm, half-visor at L8 still leaves eyes visible through slit).
- L9-L10: face fully concealed by closed visor — no skin / hair / eyes / beard / expression visible above the bevor.

When the visor closes at L9, **silhouette has to do all the character work**. Lean into mightiness via horns, broader pauldrons, flaring tassets, larger shield. See Progression Plan § L9-L10.

### K. Silhouette mightiness rule (LOCKED — Infantry-specific deviation from Archer; extended 2026-05-07 per AD detail-economy)

Per user direction at scaffold time: each level in the plate tier (L7-L10) must visibly **increase the unit's silhouette mass and stature** vs the prior level. Don't just swap surface ornaments; bump volumes. **And per AD FeedbackV0 (2026-05-07), late-tier richness comes EXCLUSIVELY from volume + silhouette + material change — NOT from sculpted micro-details, filigree, engraving, lion's-head emboss, per-edge gold piping, or knuckle-plates.**

Revised plate-tier volume schedule (post-AD feedback):

- L7: pauldrons 2-disc → still 2-disc but thicker; shield ~10% larger; helm sallet replaces L3 skullcap (volume bump from skullcap to full sallet); cuirass medial ridge + single horizontal seam (NOT 3-lame articulated banding — reduced per AD).
- L8: pauldrons → 3-lame (third lame extends down the bicep, broadening the shoulder line); tassets extend longer with **2 wider lames per tasset** (NOT 3 narrow lames — reduced per AD); first gold = helm trim band.
- L9: helm gains horns (vertical extent); tassets gain outward flare at lower edge (volume); gold = shield rim + boss ring. **NO pauldron/tasset filigree** (removed per AD).
- L9.5: horns grow taller + gold spike caps; gold cross on shield face. **NO gauntlet knuckle-plates, NO cuirass/tassets per-edge gold piping** (removed per AD).
- L10: helm gains tall central gold crest (peak vertical extent); pauldrons add 4th uppermost lame as plain steel (NOT lion's-head emboss); tassets flare further wider+longer; shield boss + cross + rim all gold. **NO chased filigree on mace, NO embossed gold studs on shield rim** (removed per AD).

**Authoring rule for every L7-L10 prompt**: every EDIT GOAL paragraph must include explicit silhouette-volume language ("the pauldrons visibly broader than the prior level", "the helm visibly taller than the prior level"). Don't let surface-ornament additions (filigree, etching, gold lines, knuckle-plates) substitute for volume bumps.

**Detail-economy "first cut" list** (drop these before considering keeping them):
- Filigree (any kind: gold scrollwork, fine engraving, etched motifs).
- Per-edge gold piping on plates / lames / cuirass perimeter.
- Pauldron-seam rivet runs / tiny rivet ring decorations.
- Sculpted figural emboss (lion's-head, beast motifs, heraldic crests on plate surfaces).
- Articulated horizontal lame fragmentation (3+ lames where 2 wider plates would carry the same upgrade).
- Surface engraving / scrollwork on the cuirass medial ridge.
- Per-knuckle gold plates on gauntlets.
- Embossed studs on shield rim (use a clean wider band instead).
- Chased filigree on weapon flanges / spikes / banding rings.

If a prompt currently calls for any of the above, strip it on revision and lean on volume + material change for the upgrade.

---

## Part 3 — Locked decisions

1. **Two ground-truth anchors (planned)**: `Refs/L1_Base.png` (locked) + `Refs/L10_Base.png` (TODO — render-test against the L9.5→L10 chain output before locking the plan; insert L9.5 if needed to bridge — already in plan).
2. **Three armor tiers (Levy L1-L3, Footman L4-L6, Sergeant L7-L9) + Royal L10 topper**.
3. **Tier 2 = Scale Mail at the SLEEVES + iron banding** (not full body coat) — preserves livery dominance.
4. **Each level needs a clearly visible armor / outfit upgrade** — no polish-only levels.
5. **Livery rule** per § Part 2 § A.
6. **Input strategy**: chained composite-only for every level. No anchored Rule-1 fallbacks at tier breaks unless escape-hatch needed. (Deviates from Archer.)
7. **No auto-picks** — always present all 4 variants for keeper selection.
8. **Mace tier progression**: wooden spiked (L1-L3) → wood + iron banding (L4-L6) → flanged steel (L7-L9) → gilt-flanged ornate (L10). Mightier and more intricate at higher tiers.
9. **Round shield throughout**: plain wood (L1) → iron-rivets/rim-cross (L2-L4) → steel-faced (L5-L8) → gold-trimmed cross-emblem (L9-L10).
10. **Pose locked verbatim L1-L10**: mace forward+down anatomical-RIGHT, round shield up at chest anatomical-LEFT, three-quarter view.
11. **Framing pixel-locked to L1_Base** for L1-L9.5; L10 drops the L1_Base scale anchor to allow new helm crest vertical extent.
12. **Hand convention**: anatomical (mace = anatomical-RIGHT = viewer-LEFT; shield = anatomical-LEFT = viewer-RIGHT).
13. **L9.5 bridge level included** — between L9 and L10 to absorb the royal-grade jump (gold cross, gold cuirass piping, gold gauntlets).
14. **ESRGAN 2× is the default cleanup pass; NAFNet deblur is the fallback; chain runs at 2K throughout** (LOCKED 2026-05-13 — same as Archer / Cavalry; supersedes the earlier NAFNet-default at 1024). ESRGAN at `fal-ai/esrgan` with `scale: 2`, output saved at 2048×2048 as-is (no downscale). Switch to NAFNet deblur for a specific keeper only when the user flags the ESRGAN-cleaned composite as worse than raw; apply NAFNet to the ESRGAN-upscaled-to-2K raw, not the 1024 raw. `Refs/L1_Base.png` must be 2K — ESRGAN-upscale once at chain start if the source is smaller.
15. **Diff-mask composite is mandatory between every level lock and the next chain step** (same as Archer; reinforced for Infantry's all-chained pipeline). Tighter thresholds `--low 10 --high 25` locked default (intensity-based, dim-invariant). 2K-era spatial defaults `--pool 16 --mask-blur 6 --dilate 20` (doubled 2026-05-13 from 1K `8 / 3 / 10` — not yet empirically recalibrated, retune if early-2K QC drifts). Tier-break dilate bump 30-40.
16. **Silhouette mightiness rule** for the plate tier (L7-L10) — each level must visibly increase mass / stature, not just surface ornament. See § Part 2 § K.
17. **Detail Economy / Silhouette-First Rule (LOCKED 2026-05-07 per AD FeedbackV0)** — late-tier richness comes from VOLUME, SILHOUETTE SHAPE, and MATERIAL CHANGE — NEVER from stacked surface ornament. See § Part 2 § K for the locked "first cut" list. Specific Infantry applications:
    - **Helm earlier**: first metal headpiece at L3 (steel skullcap under mail coif), not L7. L7 sallet becomes the FIRST FULL HELM (volume upgrade vs the L3 skullcap), no longer the first metal headpiece.
    - **Boot armor split**: iron toe-cap strip at L4 → ankle plates at L6 → full sabatons at L8. Three smaller adds, not one big L6 step.
    - **Belt minimalism**: L2 hip pouch only. L3 knife sheath REMOVED entirely. No additional pouches, no tags, no tool-loops.
    - **Full-arm scale-mail from L5 onward**: scale-mail sleeves cover bicep-to-wrist (no exposed bicep gap); vambraces (L5+) sit on top.
    - **Tasset lame reduction**: 2 wider lames per tasset (NOT 3 narrow lames) at L6+; flare/length growth carries the L8/L9/L10 upgrades.
    - **L8 first gold** = helm trim band (moved up from L9). Replaces the deprecated L8 gold-rivet pass that soft-failed.
    - **Filigree / engraving / knuckle-plates / embossed studs / lion's-head emboss / per-edge piping / per-flange-tip finials** all REMOVED across L8-L10 per AD detail-economy.

18. **"Chainmail" terminology in feedback = scale mail (LOCKED 2026-05-07)** — when AD or any reviewer says "chainmail," they mean our locked scale-mail spec (chunky overlapping rounded scale plates per the gray-coif bearded-character reference). The model's "fine ring mesh" rendering is still the wrong default and the negative-list still applies. Terminology bridge — not a switch back to ring mesh.

---

## Part 4 — Quick reference

For the canonical "run a generation" / "lock a keeper" / "final delivery" recipes, see `../Archer/CLAUDE.md` § Part 4 verbatim — substitute `archer` → `infantry` and the unit-specific paths.

**One Infantry-specific deviation**: the `composite-keeper` skill invocation uses `--low 10 --high 25` as the locked default (same as Archer v2). For tier breaks (L4 / L7) bump `--dilate 15` (L4) or `--dilate 20` (L7).
