# Cavalry Unit — Pipeline & Visual-Style Notes

> Read this before authoring, editing, or running any prompt in this directory.
> Companion to [README.md](README.md), [Cavalry.md](Cavalry.md) (L1 base spec), and [Cavalry_Progression_Plan.md](Cavalry_Progression_Plan.md) (10-level ramp).
>
> **Pipeline rules and shared learnings live in `../Archer/CLAUDE.md`** — read that file in full before working in this directory. This file ONLY contains Cavalry-specific deltas and unit-specific lessons. If a topic isn't covered here, the Archer doc is authoritative. Infantry's CLAUDE.md is also a strong sibling reference (Infantry locked the chained-composite-only pipeline that Cavalry mirrors).

> **Skill-driven pipeline.** Run via `/unit-progression Cavalry`. Use the Cavalry-specific composite-keeper thresholds `--low 15 --high 35 --pool 12` (per-unit override of the locked v2 defaults).

---

## Part 0 — Output directory layout

Same as Archer/Infantry. Every level under `out/v<N>/L<n>/` has three child dirs:

```
out/v<N>/L<n>/
├── variants/   # raw fal outputs (4 PNGs)
├── sidecars/   # one sidecar per call (reproducible mode = 4 sidecars per level)
└── composite/  # _composited.png + _qc.png + _qc.json + _denoise.png
```

Final delivery: `out/v<N>/Final/` with L1.png … L10.png + L9_5.png + `progression_compilation.png`.

---

## Part 1 — Pipeline (Cavalry-specific notes)

### A. Endpoint, payload, sidecars, polling
Identical to Archer. See `../Archer/CLAUDE.md` § Part 1 § A, § A2, § H.

### B. Input strategy — chained composite-only (LOCKED, mirrors Infantry)

**Cavalry uses Rule 2 (within-tier chained composite) for EVERY level, including tier breaks.** No Rule-1 anchored fallback prompts at L4 / L7. Same rationale as Infantry — composite + denoise is a strong-enough drift mitigation that the chain doesn't need a hard reset at tier breaks. Tier-break dilation (`--dilate 15-20`) handles the larger edit area cleanly.

Prompt set: `cavalry_edit_L1_to_L2.json`, `cavalry_edit_L2_to_L3.json`, … `cavalry_edit_L9_to_L9_5.json`, `cavalry_edit_L9_5_to_L10.json`. Eleven files total. Each consumes two inputs (prior composite + L1_Base scale anchor) except L10 which drops the L1_Base anchor for gold-crest-spike vertical extent.

If the chain ever produces visible drift at a tier break that the composite can't fix (face/helm distortion, livery loss, horse pose break), the escape hatch is to author an anchored `cavalry_edit_L1_to_L<n>.json` for that level only — but treat as a fallback.

### B2. Composite + denoise is the mandatory drift-mitigation step between EVERY level
Same as Infantry. Workflow per level: generate 4 → user picks keeper → NAFNet deblur the RAW keeper → composite the DENOISED RAW against prior composite → inspect QC → chain forward. Never skip steps. Never denoise the composite. Never chain off the raw keeper. Full reasoning: `../Archer/CLAUDE.md` § Part 1 § G2 + § L.

### C. Prompt structure
Same skeleton as Archer/Infantry (see `../Archer/CLAUDE.md` § Part 1 § C). Replace unit-specific anchor language (bow/hood/cape OR mace/coif/round-shield) with **Cavalry anchors** (kettle-helm, mustache-no-beard, yellow+red split surcoat over brown leather long-sleeve under-jacket, vertical wooden spear with iron leaf-tip, brown leather reins, mounted on solid-chestnut horse (NO white markings) with red+blue checkered caparison).

### D-M. Multi-image input, drift patterns, denoise/composite recipe, framing measurement, polling
All shared with Archer. See `../Archer/CLAUDE.md`.

---

## Part 2 — Visual Style Anchors (Cavalry-specific)

### A. The Livery Rule (LOCKED — revised 2026-05-07: chest band above breastplate REMOVED)

Yellow+red split surcoat is the strongest faction-identity anchor on the rider. Same rule shape as Archer/Infantry but worn over a brown leather long-sleeve under-jacket (not bare biceps):

- **L1-L4 (Lancer → Hussar Conscript)**: surcoat dominant on the chest. Even at L4 (scale-mail sleeves) the surcoat chest is fully visible.
- **L5 (Hussar)**: partial breastplate covers upper chest only; surcoat livery visible BELOW the partial breastplate as a SKIRT BAND down to the waist belt (covering the still-uncovered abdomen).
- **L6-L7 (Veteran Hussar → Knight Sergeant)**: full breastplate covers from bevor's lower edge down to the belt. The breastplate sits FLUSH against the bevor — **NO cloth visible above the breastplate**. Livery visible only as a SKIRT BAND between the breastplate's bottom edge and the tassets' top edge (~3" tall).
- **L8-L9 (Knight → Knight Champion)**: skirt band narrows to ~2" tall as tassets extend longer.
- **L10 (Royal Champion)**: livery GONE on the rider. Full plate + tassets + gold; no cloth visible at the torso. The L10 caparison takes over as the heraldic anchor (red+yellow + gold cross).

**Why the chest band above the breastplate was removed (2026-05-07)**: a strip of cloth between the bevor and the breastplate's upper edge looks impractical (cloth in a region that needs armor) and reads weird. Livery presence on the rider is preserved via the SKIRT BAND (tabard-style skirt over the hips/waist, practical look) + the strong heraldic carry on the horse caparison.

Authoring rule for every L2-L9 prompt: explicit positive language for whatever band is currently visible, plus an explicit negative locking out the chest-band-above-breastplate ("DO NOT add a chest band of cloth, livery, surcoat, or any fabric between the bevor's lower edge and the breastplate's upper edge — the breastplate sits flush against the bevor").

### B. Pose canonical description

> Three-quarter view, the rider's body angled approximately 15-25 degrees toward the viewer's left so the rider's anatomical-right side faces camera. The HORSE faces toward the viewer's RIGHT — head and muzzle on the viewer-RIGHT side of the frame, rump and tail on the viewer-LEFT side. Rider sits upright in the saddle with both feet in stirrups, slight forward lean.
>
> THE SPEAR ARM (anatomical-RIGHT, viewer-LEFT) is bent at the elbow with the upper arm vertical and the forearm angled slightly forward. The hand grips the wooden spear haft just above shoulder height; the spear stands roughly VERTICAL with the iron leaf-tip pointing UP toward the top of the canvas. Knuckles of the gripping hand visible to camera.
>
> THE REIN ARM (anatomical-LEFT, viewer-RIGHT) is extended forward and slightly down, elbow bent at roughly 110 degrees. The hand grips the brown leather reins at the level of the horse's withers / shoulder. The rein hand is visible to camera holding the reins in a relaxed grip.
>
> Calm mounted patrol stance — spear shouldered upright but not couched, reins held but not pulled. NOT a charge, NOT a couched-lance attack, NOT a rear, NOT a pivot.

### C. Framing canonical description (LOCKED 2026-05-06)

> 1024×1024 square canvas. Rider+horse silhouette occupies approximately **77.6% of canvas vertical height** (~795px tall). Horizontal envelope from horse rump on viewer-LEFT to horse muzzle on viewer-RIGHT is approximately **60.6% of canvas width** (~621px wide). TOP of rider's helm at ~11.4% from top of canvas (~117px headroom — the wooden spear haft extends UP past the helm with the iron leaf-tip near or at the canvas top edge). BOTTOM of horse's hooves at ~10.9% from bottom of canvas (~112px below). Rider+horse vertically centered. ~21.6% empty margin viewer-LEFT, ~17.8% empty margin viewer-RIGHT. DO NOT zoom in, DO NOT shrink, DO NOT add wider borders, DO NOT crop the helm or hooves, DO NOT shift to bottom edge.

`Refs/L1_Base.png` is the 1024×1024 canonical anchor (downscaled from a 2048×2048 source backed up at `Refs/L1_Base_2K.png`).

### D. Hand convention + directional language (LOCKED 2026-05-06 after L3 pauldron mispositioning)

Spear hand = **viewer-LEFT side of frame** (this is the rider's anatomical-right, but DO NOT lead with anatomical language in prompts). Rein hand = **viewer-RIGHT side of frame**.

**Critical authoring rule (LOCKED after the L3 round-2 pauldron landed on the wrong shoulder)**: NanoBanana / nano-banana-pro/edit interprets `RIGHT` and `LEFT` as **viewer-relative / image-space**, not anatomical-relative — even when explicitly prefixed with "anatomical-RIGHT" / "anatomical-LEFT" + parenthetical "(viewer-LEFT side of the frame)". The L3 round-2 prompt described the L3 pauldron as "single steel pauldron cap on the ANATOMICAL-RIGHT shoulder (SPEAR-ARM SIDE, ON THE VIEWER-LEFT SIDE OF THE FRAME)" — all 4 variants landed the pauldron on the viewer-RIGHT shoulder (the rein-arm side, the WRONG side). This was Seedance-vs-NanoBanana convention drift: Seedance accepts anatomical language + parenthetical viewer cue; NanoBanana flips on the bare "RIGHT" token regardless of qualifier.

**Therefore: every Cavalry prompt uses viewer-relative directional language as primary, with the anatomical convention dropped entirely.** Use "the VIEWER-LEFT shoulder (the spear-arm side)" / "the VIEWER-RIGHT shoulder (the rein-arm side)" / "the VIEWER-LEFT hip (the spear-arm side)" / "the VIEWER-RIGHT hip (the rein-arm side)". Do NOT use "anatomical-RIGHT" or "anatomical-LEFT" anywhere in any prompt body. Functional-side anchors ("the spear-arm side", "the rein-arm side") supplement viewer-side anchors but never replace them.

This applies to all of L1→L2 and beyond. The L2 prompt (which placed the pouch correctly on viewer-LEFT) was a happy accident of the model preferring the VIEWER-LEFT cue when both were given for a hip-level edit; it is NOT a reliable pattern.

This learning is Cavalry-specific in its discovery context but probably generalizes — flag for Archer / Infantry chains too if a future re-author touches anatomical language.

**Round-3 follow-up (LOCKED 2026-05-06): viewer-relative language alone IS NOT ENOUGH.** Even after rewriting the L3 prompt to drop "anatomical-RIGHT/LEFT" and use "VIEWER-LEFT (spear-arm side)" / "VIEWER-RIGHT (rein-arm side)" everywhere, the round-3 batch STILL placed the L3 pauldron on the rein-arm shoulder (wrong side, same as round-2). The model appears to have an entrenched bias for placing single-shoulder armor on the rein-arm shoulder in the mounted-3/4-view composition — possibly because the rein-arm shoulder is the visually-forward, more-prominent shoulder when the body is rotated toward viewer-LEFT. Word-level RIGHT/LEFT and VIEWER-LEFT/RIGHT language is unreliable for this composition.

**Therefore: for asymmetric edits in Cavalry prompts, drop ALL directional words entirely and use SPATIAL-GEOMETRY anchors only.** Replacement vocabulary:
- `SPEAR-SIDE` = the side of the rider's body / canvas where the upright wooden spear haft is visible. Defined functionally (relative to a feature in the input image), not directionally.
- `REIN-SIDE` = the OPPOSITE side from the spear-side. The side where the rein hand grips the reins, the side closest to the horse's head and mane.
- For placement geometry, anchor to features in the input image: "in the SAME VERTICAL COLUMN of the canvas as the spear haft", "directly above where the rider's hand grips the spear", "the SAME SIDE of the rider's body as the horse's TAIL (NOT the horse's head)".
- When two new edits go on opposite sides of the body (e.g., L3 has both a spear-side pauldron and a rein-side knife sheath), explicitly state they are on OPPOSITE SIDES rather than naming each side directionally.

The round-3 → round-4 prompt rewrite for L3 demonstrates this pattern. Apply the same convention prospectively to every L4-L10 prompt with asymmetric kit additions (single-shoulder pauldron, hip-side weapon swap, off-side equipment).

### E. Style / Outline canonical description

Identical to Archer. See `../Archer/CLAUDE.md` § Part 2 § E.

### F. Scale-mail visual spec

Identical to Archer / Infantry (chunky overlapping rounded scale-shaped plates, NOT chainmail rings). See `../Archer/CLAUDE.md` § Part 2 § F. Used for the L4+ scale-mail sleeve adds.

### G. Spear/lance + horse-tack material progression *(revised 2026-05-07 per AD detail-economy)*

**Spear/lance head:**
- L1-L3: neutral gray (matching the L1 kettle-helm tone, balanced gray) iron leaf-shaped tip on warm-brown wooden haft.
- L4-L6: same iron leaf-tip + iron banding rings + reinforced socket. (L5 "steel reinforcement plate" surface item REMOVED per AD detail-economy.)
- L7-L9: full steel leaf-tip lance head + red+yellow heraldic pennon (L9 + gold trim on pennon + gold ring at socket).
- L10: buttery-gold full gilt finish on the steel lance head (NO chased filigree, NO per-edge engraving — the gold material change carries the upgrade) + gold haft end-caps + red+yellow+gold pennon.

**Horse tack/barding:**
- L1: plain leather bridle, plain leather saddle, red+blue checkered caparison.
- L2: iron buckles on bridle + iron browband.
- L3: iron banding on saddle pommel + cantle.
- L4: studded leather peytral on chest under caparison.
- L5: small steel chamfron (forehead plate).
- L6: iron peytral plate replacing studded leather.
- L7: full steel chamfron (entire face, with small forehead spike).
- L8: (no horse-barding add at L8; L8 focuses on rider — gold helm trim band + 3-lame pauldrons + 2-wider-lame longer tassets + full sabatons).
- L9: steel crinet (neck plates) + steel flanchards (flank plates, plain — NO heraldic-stamp surface ornament per AD).
- L9.5: (no horse-barding add at L9.5 — gilt edge trim on chamfron REMOVED per AD detail-economy; rider gets gold cross + taller fins + gold fin spike caps).
- L10: gold-rosette chamfron boss + flanchards bear a raised gold cross emblem (single emblem per flanchard, NOT per-edge piping) + recolored red+yellow heraldic caparison with central gold cross emblem + single gold-trim band along the caparison's lower edge. Crinet stays plain steel (NO gold-trim at every lame edge).

### H. Continuity anchors held across all 10 levels

- Kettle-helm (L1-L6) → sallet helm (L7-L9) → gold-crested helm with central spike (L10). Always silver-gray steel base.
- Thick dark-brown handlebar mustache (L1-L8 visible; L9-L10 concealed by closed visor). NEVER grown into a beard.
- Wooden spear with iron leaf-tip → steel lance with pennon → gilt lance.
- Real chestnut-brown chibi horse — SOLID brown coat with NO white markings (no blaze, no star, no socks, no speckling), dark brown mane, dark brown tail, viewer-RIGHT-facing pose. NEVER hobby-horse / pony / dire-mount.
- Yellow+red split surcoat dominant L1-L4, then migrating per § A.
- Dark blue trousers — visible at the calf at every level.
- Brown leather riding boots base — visible at calf and heel. **Boot armor split L4 (iron toe-cap) → L6 (ankle plates) → L8 (full sabatons) per AD FeedbackV0 "split into smaller upgrades, distributed earlier"**.
- **Full-arm scale-mail from L5 onward**: scale-mail sleeves cover bicep-to-wrist (no exposed leather-jacket gap) per AD "the chainmail being sleeveless feels odd. For the later levels, I would extend it to fully cover the arms." Vambraces (L5+) sit ON TOP of the scale-mail sleeves.
- **Belt accessories minimized**: hip pouch at L2 (spear-side hip) is the ONLY belt accessory. Knife / dagger sheath REMOVED entirely (was L3 — dropped 2026-05-07 per AD "remove the dagger entirely and keep the pouch"). **Iron belt studs REMOVED entirely** (was 8 round-head studs at L2 — dropped 2026-05-07 per AD detail-economy "embossed studs ... use clean wider band instead"). Belt is plain warm-brown leather with the existing brass buckle only.
- Brown leather reins gripped at horse withers — held all 10 levels.
- Three-quarter view, full body, mounted, clean white background, thin black silhouette outline.
- 1024×1024 square canvas, framing locked to L1_Base except possibly L10 (drops L1_Base anchor for gold-crest-spike vertical extent).

### I. Vocabulary risks (Cavalry-specific — adds to Archer/Infantry list)

| Term | Risk | Use instead |
|------|------|-------------|
| `spear` (alone) | Renders as generic short javelin | "long wooden spear with iron leaf-tip" (L1-L3) / "iron-banded wooden spear with reinforced socket" (L4-L6) — always describe head shape + material |
| `lance` (alone) | Leans tournament-only / over-long / horizontal couched | "vertical steel lance with red+yellow heraldic pennon" (L7+) — always specify orientation (vertical) + pennon presence |
| `mounted` | Sometimes shrinks the horse / swaps to a pony | "mounted on a chibi solid-chestnut-brown horse with NO white markings, the horse facing the viewer's right" |
| `white blaze` / `white markings` | Model amplifies any small white area on the muzzle into broader white markings (white star, white socks, expanded blaze) — locked 2026-05-06 after L5 keeper-pick | NEVER describe white anywhere on the horse; always say "solid chestnut brown" + explicit negative "DO NOT add white blaze, white star, white socks, white speckling, or any white markings on the horse" |
| `caparison` | Misreads as generic "blanket" or "drape" | always describe the pattern: "red+blue checkered caparison with blue trim band" (L1-L6) / "red+yellow heraldic caparison with central gold cross emblem" (L10) |
| `mustache` (alone) | Grows into a beard at higher armor tiers | "thick dark-brown handlebar mustache, NO beard, clean-shaven cheeks and chin" — always pair with explicit no-beard negative |
| `kettle helm` | At L1 reads correct; at L7 the model sometimes reverts to it | At L7 say "open-face steel sallet helm with a forward-projecting brim and a short backswept tail" + "DO NOT keep the kettle helm — replaced at L7" |
| `closed helm` | Risk of full-face plate at L9 looking generic | "closed visor extending downward from the L8 half-visor with horizontal eye slit and breathing perforations" |
| `chainmail` | Fine ring mesh | always "scale mail" + chunky overlapping scale descriptive |
| `pennon` | Sometimes renders as a long banner pole | "small heraldic pennon flag tied just below the lance leaf-tip, ~6 inches long" |
| `transparent` background | Baked checkerboard pattern | "clean white background" only |
| `hobby-horse` / `wooden cutout horse` | The Kingshot reference's hobby-horse stylization is NOT used in EMTD Cavalry | always "real chibi chestnut-brown horse with proper anatomy (head, ears, eye, mane, neck, body, four legs, hooves, tail)" |

### J. Face visibility schedule

- L1-L8: face fully visible (open kettle/sallet, half-visor at L8 still leaves eyes visible through slit).
- L9-L10: face fully concealed by closed visor — no skin / hair / eyes / mustache / expression visible above the bevor.

When the visor closes at L9, **silhouette has to do all the character work**. Lean into mightiness via fins/wings + flaring tassets + horse barding (crinet, flanchards, chamfron spike).

### K0. ADDITIVE TIER-BREAK PRINCIPLE (LOCKED 2026-05-06 — CRITICAL — do not author replacements)

**Tier breaks (L4, L7) and any other level transition specify a PROGRESSION/ADDITION to the kit, NOT a wholesale replacement of equipment.** The chain must FEEL like an additive progression — every L1-L(n-1) detail must remain visible and recognizable at L(n) unless its conceptual replacement is structurally unavoidable (helm-shape evolution, weapon-tier upgrade, peytral material swap). Even those "structural" replacements must preserve the silhouette, palette, and detail language of the prior level so the chain reads as the SAME unit growing rather than a different unit appearing.

**Specifically — what NOT to do:**
- DO NOT replace the wooden spear haft with a smooth steel haft at L7. The wooden haft is part of the unit's identity; the L7 "lance" upgrade is ADDITIVE — keep the wooden haft warm-brown wood with all its existing kit (L2 iron pommel cap, L3 leather grip cord, L4 iron banding rings + reinforced socket, L5 reinforcement plate). The L7 weapon upgrade ADDS: a larger steel leaf-tip head AND a red+yellow heraldic pennon flag tied just below the new larger leaf-tip. Those two additions register the "lance" tier upgrade without erasing anything.
- DO NOT replace the kettle helm with a sallet at L7. The kettle helm is the unit's signature head silhouette; the L7 helm upgrade is ADDITIVE — keep the kettle helm shape (domed crown + forward-projecting riveted brim), and ADD: a short backswept neck-guard skirt extending downward from the rear of the brim over the back of the neck (~3 inches), and a forehead reinforcement strip / extra rivets along the brim seam. The kettle silhouette stays recognizable; the additions register the "knight" tier without changing the basic helm type.
- DO NOT replace bare hands with steel gauntlets at L7 in a way that erases the hands' anatomy and the existing leather grip cord on the spear haft. Gauntlets are added by layering articulated steel finger plates and a steel knuckle disc + cuff OVER the existing hand, leaving the existing hand silhouette and the L3 leather grip cord visible (the leather grip cord must still be visible WHERE IT MEETS THE GAUNTLETED HAND).
- DO NOT erase L4 scale-mail short sleeves on the upper arms at L7 or beyond. Scale-mail short sleeves are visible from L4 onward and remain visible THROUGH every subsequent level — even when more plate is added on top, the scale-mail texture must still be readable at the upper-arm portion of the silhouette.
- DO NOT erase the L5 spear-haft reinforcement plate, the L4 iron banding rings, the L3 leather grip cord, or the L2 iron pommel cap at any subsequent level — these accumulate.
- DO NOT replace cuirass detail (medial ridge, abdominal lames, edge rivets) — those accumulate as additive enhancements to the L5 partial breastplate / L6 full breastplate.

**Specifically — what tier-break adds SHOULD look like:**
- L7 (Knight Sergeant) adds: (a) reinforced cuirass — keep the L6 full breastplate, ADD a more pronounced medial ridge AND 3 horizontal abdominal lames stacked between navel and belt; (b) steel knuckle-plate gauntlets — keep the existing hand silhouette + L3 leather grip cord, ADD articulated steel finger-plates and knuckle discs LAYERED ON TOP of the existing hands, with the wrist cuff connecting continuously to the L5 vambrace; (c) steel lance head + pennon — keep the L1-L6 wooden spear haft with all its accumulated kit, REPLACE only the iron leaf-tip with a larger steel leaf-tip, ADD a small red+yellow heraldic pennon flag tied just below the new leaf-tip; (d) full chamfron — extend the L5 small forehead chamfron downward and outward to cover more of the horse's face including cheek plates and a forehead spike, but the L5 chamfron is the BASE that grows; (e) helm augmentation — keep the kettle helm shape, ADD a backswept neck-guard skirt extending from the rear brim and additional rivets/reinforcement along the brim seam.
- L8 (Knight) adds: gold rivets on pauldrons, layered 3rd disc on each pauldron, longer tassets, fine-line engraving — all pure additions. The half-visor at L8 extends DOWNWARD from the kettle's brim to cover the upper face — the kettle base is preserved, the visor adds.
- L9 (Knight Champion) adds: full closed visor (extending the L8 half-visor downward to cover the lower face fully), backswept fins/wings on the helm sides, gold band at the helm's brim seam. The kettle base is still preserved underneath; the visor + fins are additions.
- L10 (Royal Champion) adds: tall gold-fluted crest spike rising between the L9 fins (NO plume), single-piece pauldron volume growth, gilt lance head, royal horse barding — the L9 closed-helm form is the base; the crest and gold ornament are pure additions.

**Authoring rule for every tier-break prompt going forward:** the EDIT GOAL paragraph must explicitly enumerate what is PRESERVED from the prior composite (with all its accumulated L1-L(n-1) kit) before describing the new adds. The new adds must use language like "ADD ... layered on top of the existing ...", "extend the existing L(n-1) ... downward to ...", "the existing L(k) ... remains visible underneath the new ..." — and never use language like "replace ... with ...", "the L(n-1) ... is gone", or "fully replace ... with a new ...".

**Composite-step compensation**: when the model still produces a wholesale-replacement raw despite additive prompt language, the diff-mask composite ([composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md): `--low 15 --high 35 --pool 12 --dilate 15-20`) preserves the L(n-1) bytes-exact in the unchanged regions, which means even a slightly-too-aggressive raw can be partially salvaged at the composite step. But the composite alone cannot rebuild detail the model erased — so the prompt MUST be additive first.

---

### K. Silhouette mightiness rule (LOCKED — extended 2026-05-07 per AD detail-economy)

Per user direction at scaffold time: each level in the plate tier (L7-L10) must visibly **increase the rider+horse silhouette mass and stature** vs the prior level. **And per AD FeedbackV0 (2026-05-07), late-tier richness comes EXCLUSIVELY from volume + silhouette + material change — NOT from sculpted micro-details, filigree, engraving, lion's-head emboss, per-edge gold piping, gauntlet knuckle-plates, gold rivets, or heraldic stamps.**

Revised plate-tier volume schedule (post-AD feedback):

- L7: kettle helm gains backswept neck-guard skirt + brim reinforcement (rear-view + brim volume); cuirass medial ridge + 1 simple horizontal seam (NOT 3-lame articulated banding — reduced per AD); steel knuckle-plate gauntlets (clean knuckle disc, NO per-knuckle rivets — reduced per AD); larger steel leaf-tip + pennon on the wooden lance haft; full steel chamfron with small forehead spike on the horse.
- L8: pauldrons gain **single-piece bicep coverage extension** (the L6 thicker dome extends downward as one continuous piece of shaped steel covering shoulder + upper bicep — NOT a 3-lame stacked construction; reframed 2026-05-07 to match L6 single-piece dome reframe + observed sculpted-detail bleed); tassets extend longer with **2 wider lames per tasset** (NOT 3 narrow lames — reduced per AD); first gold = helm trim gold band (replaces the deprecated L8 gold-rivets pass which soft-failed at thumbnail per Infantry's lesson); full sabatons on the boots (final boot-armor stage in the L4→L6→L8 split). NO horse-barding add at L8.
- L9: helm gains closed visor + backswept fins (vertical extent); steel crinet (moved from L8) + steel flanchards (plain — NO heraldic-stamp surface ornament per AD); pennon gold trim + gold ring at lance socket.
- L9.5: fins grow taller + gold spike caps (volume bump replaces deprecated knuckle-plate + gilt-edge piping passes — both REMOVED per AD); cuirass gold cross emblem.
- L10: helm gains tall central gold crest spike (peak vertical extent, NO plume); pauldrons grow further in **single-piece volume** (the L8 dome+bicep-extension gets ~25% taller, ~20% wider as one continuous piece — NOT a 4th uppermost lame stacked on top, NOT lion's-head emboss; reframed 2026-05-07); tassets flare further (NO per-lame gold edge piping — REMOVED per AD); full gilt lance head (NO chased filigree — REMOVED per AD); royal horse barding via single-emblem flanchard cross + chamfron gold-rosette + recolored heraldic caparison (NO per-lame crinet gold piping — REMOVED per AD).

**Authoring rule for every L7-L10 prompt**: every EDIT GOAL paragraph must include explicit silhouette-volume language ("the pauldrons visibly broader than the prior level", "the helm visibly taller than the prior level"). Don't let surface-ornament additions (filigree, etching, gold lines, knuckle-plates, heraldic stamps, embossed studs) substitute for volume bumps.

**Detail-economy "first cut" list** (drop these before considering keeping them):
- Filigree (any kind: gold scrollwork, fine engraving, etched motifs, chased lance-edge filigree).
- Per-edge gold piping on plates / lames / cuirass perimeter / tasset perimeters / chamfron perimeter / crinet perimeters.
- Pauldron-seam rivet runs / tiny rivet ring decorations / gold rivets at pauldron seams.
- Sculpted figural emboss (lion's-head, beast motifs, heraldic crests on plate surfaces).
- Heraldic shapes stamped on flanchard corners / saddle / belt.
- Articulated horizontal lame fragmentation (3+ lames where 2 wider plates would carry the same upgrade).
- Surface engraving / scrollwork on the cuirass medial ridge.
- Per-knuckle gold plates or gold knuckle-discs on gauntlets.
- Embossed studs on shield rim / saddle / chamfron (use a clean wider band instead).
- Chased filigree on the lance head / per-flange-tip spiked finials.
- Gold-rosette piping at every crinet lame edge (use a single emblem instead).

If a prompt currently calls for any of the above, strip it on revision and lean on volume + material change for the upgrade.

### L. Horse-pose preservation rule (Cavalry-specific — LOCKED)

The horse is part of the canonical silhouette and must be preserved verbatim through every level transition. Specific pose preservation language to include in every prompt's PRESERVE block:

> The solid chestnut-brown chibi horse (NO white markings of any kind — no blaze, no star, no socks, no speckling) facing the viewer's right with head and muzzle on the viewer-RIGHT side of the frame and rump and tail on the viewer-LEFT side, standing four-square with all four hooves visible at the bottom of the frame, neck arched, ears forward, dark eye visible on the viewer-RIGHT side of the head with a single bright catchlight, the muzzle and forehead the same warm chestnut brown as the rest of the horse, dark brown mane along the top of the neck falling toward the viewer side at the withers, dark brown tail extending behind the rump and falling to about hock height — the horse pose, anatomy, solid-brown color, mane, and tail all remain identical in shape, color, and position to the input image.

Additional preserve emphasis (always include): "DO NOT change the horse to a pony, hobby-horse, wooden cutout, donkey, or any other species; DO NOT change the horse coat color from solid chestnut brown; DO NOT add a white blaze, white star, white socks, white speckling, or any white markings on the horse — the horse is solid chestnut brown across the entire body; DO NOT change the horse pose (calm four-square standing); DO NOT make the horse rear, walk, gallop, or move".

---

## Part 3 — Locked decisions

1. **Single ground-truth anchor**: `Refs/L1_Base.png` (locked 2026-05-06, 1024×1024 native, downscaled from 2K source backed up at `Refs/L1_Base_2K.png`).
2. **Three armor tiers (Light Lancer L1-L3, Hussar L4-L6, Knight L7-L9) + Royal L10 topper**.
3. **Tier 2 = Scale Mail at the SLEEVES + iron banding** (not full body coat) — preserves livery dominance. Same as Infantry.
4. **Each level needs a clearly visible armor / outfit upgrade** — no polish-only levels.
5. **Livery rule** per § Part 2 § A.
6. **Input strategy**: chained composite-only for every level. No anchored Rule-1 fallbacks at tier breaks unless escape-hatch needed. Mirrors Infantry.
7. **No auto-picks** — always present all 4 variants for keeper selection.
8. **Spear/lance progression**: wooden + iron leaf-tip (L1-L3) → iron-banded haft (L4-L6) → steel lance with pennon (L7-L9) → gilt-flanged ornate lance with heraldic pennon (L10). Mightier and more intricate at higher tiers. NEVER swapped to a different weapon.
9. **Real solid-chestnut-brown chibi horse** at every level — NO white markings (no blaze, no star, no socks, no speckling). NEVER hobby-horse / pony / dire-mount. Horse pose, anatomy, solid-brown color, mane, tail locked verbatim L1-L10.
10. **Pose locked verbatim L1-L10**: spear vertical anatomical-RIGHT, reins anatomical-LEFT at horse withers, three-quarter view, horse facing viewer-RIGHT.
11. **Framing pixel-locked to L1_Base** for L1-L9.5; L10 drops the L1_Base scale anchor to allow new helm crest spike vertical extent.
12. **Hand convention**: anatomical (spear = anatomical-RIGHT = viewer-LEFT; reins = anatomical-LEFT = viewer-RIGHT).
13. **L9.5 bridge level included** — between L9 and L10 to absorb the royal-grade jump (gold cross, gold cuirass piping, gold gauntlets, gilt edge trim).
14. **NAFNet deblur is the default denoise pass** (same as Archer / Infantry).
15. **Diff-mask composite is mandatory between every level lock and the next chain step**. **Cavalry-locked thresholds: `--low 15 --high 35 --pool 12`** (deviates from Archer/Infantry default 10/25 pool=8). Locked at L2 (2026-05-06) after the 10/25 default produced visible face/helm soft-retouch leakage on the rider's portrait — the model's subtle face refresh on every edit pushes 5-15-unit pixel diffs through the 10/25 mask. Bumping low 10→15 puts that drift below the preserve floor and bumping pool 8→12 smooths small isolated diff regions. The new defaults reduced `transition_pct` from 14.88% → 2.95%, `preserved_drift` from 0.105 → 0.056, and `mask_islands` from 11 → 5 with `edit_fidelity` only marginally affected (0.266 → 0.345, well within target). Tier-break dilate bump 15-20 still applies.
16. **Silhouette mightiness rule** for the plate tier (L7-L10) — each level must visibly increase mass / stature, not just surface ornament. See § Part 2 § K.
17. **Mustache only — no beard ever**. Cavalry is the mustache-only unit (Archer = clean-shaven, Infantry = full beard, Cavalry = mustache-only). Locked for unit identity.
18. **Horse caparison color recolor at L10** — red+blue checkered (L1-L9.5) → red+yellow heraldic with central gold cross emblem (L10). The recolor unifies the L10 royal silhouette with the rider's gold-trimmed plate.
19. **Detail Economy / Silhouette-First Rule (LOCKED 2026-05-07 per AD FeedbackV0)** — late-tier richness comes from VOLUME, SILHOUETTE SHAPE, and MATERIAL CHANGE — NEVER from stacked surface ornament. See § Part 2 § K for the locked "first cut" list. Specific Cavalry applications:
    - **Belt minimalism**: L2 hip pouch (spear-side hip) only. L3 knife sheath REMOVED entirely. L2 iron belt studs REMOVED entirely (8 round-head studs would have persisted through every later level — direct conflict with "embossed studs ... use clean wider band instead"). Belt = plain warm-brown leather + existing brass buckle only. No additional pouches, no tags, no tool-loops.
    - **Anti-rivet/stud surface guardrail (LOCKED 2026-05-07 per observed rivet bleed-through at Cavalry L3 generation)**: every Cavalry prompt L1→L2 through L9.5→L10 now carries an explicit negative — "DO NOT add iron rivets, studs, embossed dots, or any small metal punctuation along the leather waist belt, leather under-jacket sleeves, surcoat hem, saddle leather, bridle straps, caparison panels, rider's hands, or any surface beyond what the input image already shows." Triggered by explicit L3 pauldron-seam rivets, L3 saddle-banding rivets, and the L4 ~32-stud peytral grid amplifying rivet decoration through the chain. Specific source-fixes applied at the same time:
        - L3 single steel pauldron: "two visible round dark-iron rivets at the lower seam" REMOVED — clean steel-on-leather joint instead.
        - L3 iron-banded saddle pommel/cantle: "single visible row of small rivets along its lower edge" REMOVED — clean iron band only.
        - L4 studded leather peytral: dense 8×4 stud grid REPLACED with "small number of iron rivets at the seam edges only". The peytral is "studded leather" by construction type, not by visible stud count.
        - The L1 kettle-helm's existing brim-seam rivets (functional construction rivets baked into the L1 baseline) are exempt — they stay unchanged.
    - **Boot armor split**: iron toe-cap strip at L4 → ankle plates at L6 → full sabatons at L8. Three smaller adds, not one big L6 step.
    - **Full-arm scale-mail from L5 onward**: scale-mail sleeves cover bicep-to-wrist (no exposed leather-jacket gap on the upper arm); vambraces (L5+) sit on top.
    - **Tasset lame reduction**: 2 wider lames per tasset (NOT 3 narrow lames) at L6+; flare/length growth carries the L8/L9/L10 upgrades.
    - **L7 cuirass**: medial ridge + 1 simple horizontal seam (NOT 3 stacked abdominal lames).
    - **L7 gauntlets**: clean knuckle disc (NOT per-knuckle rivet detail).
    - **L8 first gold** = helm trim band (replaces the deprecated L8 gold-rivets pass that soft-failed per Infantry's lesson).
    - **L8 horse barding moves**: steel crinet bumped from L8 to L9 to make room for the boot-sabaton capstone at L8 and pace the horse-barding ramp.
    - **L9 flanchards**: plain steel (NO heraldic-stamp surface ornament).
    - **L9.5 simplifications**: gold gauntlet knuckle-plates REMOVED, gilt edge trim on cuirass+tassets+chamfron REMOVED, replaced by fin volume bump + cuirass gold cross + fin gold spike caps.
    - **L10 simplifications**: chased filigree on lance head REMOVED (gold material change carries it), lion's-head pauldron emboss REMOVED (4th lame volume carries it), per-lame gold edge piping on tassets REMOVED, per-lame gold piping on crinet REMOVED (single-emblem flanchard cross + chamfron rosette carry the gold map), embossed studs on shield rim REMOVED if applicable.

20. **"Chainmail" terminology in feedback = scale mail (LOCKED 2026-05-07)** — when AD or any reviewer says "chainmail," they mean our locked scale-mail spec (chunky overlapping rounded scale plates per the gray-coif bearded-character reference). The model's "fine ring mesh" rendering is still the wrong default and the negative-list still applies. Terminology bridge — not a switch back to ring mesh.

---

## Part 4 — Quick reference

For the canonical "run a generation" / "lock a keeper" / "final delivery" recipes, see `../Archer/CLAUDE.md` § Part 4 verbatim — substitute `archer` → `cavalry` and the unit-specific paths.

**Cavalry-specific deviations**:
- Two-input chain: prior composite (`image_urls[0]`) + L1_Base scale anchor (`image_urls[1]`) for L2-L9.5.
- Single-input chain at L10: prior composite only, L1_Base anchor dropped for gold-crest-spike extent.
- The [composite-keeper skill](../../.claude/skills/composite-keeper/SKILL.md) (`.claude/skills/composite-keeper/scripts/composite_keeper.py`) invocation uses **`--low 15 --high 35 --pool 12`** as the Cavalry-locked default (locked 2026-05-06; see § Part 3 § 15 for rationale and metric comparison). Deviates from Archer/Infantry's 10/25 pool=8 default to suppress the model's subtle face/helm soft-retouch drift on the mounted-portrait composition. For tier breaks (L4 / L7 / L10) bump `--dilate 15` (L4) or `--dilate 20` (L7 + L10).
