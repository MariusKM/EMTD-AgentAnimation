# Archer Progression Plan (Lvl 1 → Lvl 10)

> Anchors: `Source/Ref/Archer/archer1.png` (Lvl 1) and `Source/Ref/Archer/level10archer.png` (Lvl 10)
> Style ref for *progression feel*: `Source/Ref/Archer/Progression_KS/archer1.png` … `archer10.png` (Kingshot)
> Style ref **NOT** to follow visually: `Source/Ref/Archer/Progression_old/` — flagged by the team as too simple early and "too weird at the end"
> **Use case**: Image generation only.
> **Status**: Plan / brainstorm — confirm the ramp here before per-level docs are written.

## What We Want From the Kingshot Progression (the "feel")

After examining all 10 KS reference images, the Kingshot archer line works because of these specific moves — none of which are about pure "more armor each step":

1. **Distinct tier groupings, not ten flat steps.** KS reads as five clear two-level chapters — peasant scout (1–3), leather ranger (4–5), mailed soldier (5–7), plate veteran (7–9), royal elite (10). Inside each chapter the silhouette stays close, between chapters it changes meaningfully. We should do the same.
2. **One signature accent introduced per level**, not many small simultaneous adds. KS gives the archer a feather at L2, a leather chest harness at L3, a leather hood at L4, a steel skullcap at L5, etc. Each new level has one *new readable beat* you can name in three words.
3. **Color-anchor migration tells the rank story.** KS starts blue (peasant), shifts to green/brown (ranger), goes silver-dominant (soldier), and **brings the blue back as the noble color** in the high tiers. The blue isn't the same blue at L10 as L1 — it's been re-cast as a noble/cape color. Our equivalent: red hood (L1) → red migrates to scarf/coif/under-helm cloth in mid tiers → red returns triumphantly as cape + tassets red strips at L10. Mustard-yellow does the same migration: tunic base (L1) → reinforced tunic / leather-tinted (mid) → tassets yellow strips + helmet gold (L10).
4. **Gold appears late and lands hard.** KS shows zero gold through L5, hints of gold trim L6–L7, and only at L9–L10 does gold become a defining color. The gold finial + golden bow at our L10 should likewise feel *earned*. No gold before L7.
5. **Head silhouette is the dominant rank signal.** Every KS level reads at thumbnail scale because the head changes shape at almost every step (hood → hood + feather → reinforced hood → leather cap → skullcap → open helm → tall helm → spike helm → spike + finial → ornate spike + finial). Our progression must do the same — the helmet/hood is always the most-changed element between consecutive levels.
6. **Chunky silhouette weight scales with rank.** The KS L10 reads visibly heavier and stockier than L1 even though the chibi rig is identical. Same goal for ours.
7. **Continuity anchors persist.** KS keeps the brown boots and the back-quiver and the bow-arm pose across all 10 levels — so do we. We additionally keep the red cape and olive trousers across all 10 (see "Continuity Anchors" below).
8. **The character stays the same character.** KS L10 is recognizably the same archer as L1 because the proportions, the bow-hand convention, the quiver-over-shoulder, and the eyes/expression don't drift. We hold the same line.

## What We Want To Avoid (the `Progression_old` failure mode)

- L1–L3 visually almost-identical (only belt and bracer changes) — too quiet, no readable beat per level.
- L8–L10 drifting into "generic medieval knight" silhouettes that lose the distinct archer-line readability.
- The original tunic palette (red + mustard-yellow) being dropped entirely once metal armor takes over — the L10 tassets are how that palette re-enters the silhouette.

## Continuity Anchors (Hold Across All 10 Levels)

These are the non-negotiable elements that carry the unit identity from L1 to L10:

### CRITICAL — LIVERY VISIBILITY RULE (locked 2026-05-04)
**The red + mustard-yellow livery (tunic with red center panel + red side panels on a mustard-yellow base) is a CORE EMTD visual identity element and MUST remain visibly DOMINANT on the chest at every level from L1 through L7.** The mustard tunic with the quilted red panels is the unit's heraldic colors — the way you can read at thumbnail scale that this is "the EMTD archer" regardless of armor tier. The livery only retires from the chest at L7-L8 when it migrates to the tassets (where red+yellow strips alternate at the hip from L8 onward).

**Specific application at each tier:**
- **L1–L3 (Leather Scout)**: tunic is the dominant body garment, fully visible on the chest.
- **L4 (Basic Scale Mail)**: tunic STAYS dominant on the chest. Scale mail is added at the SLEEVES (covering the bare biceps) and as a SHORT HEM BAND below the tunic hem. The tunic with red+yellow panels remains the dominant chest garment — NOT covered by scale mail.
- **L5 (Mid Scale Mail)**: tunic STAYS dominant on the chest with the red+yellow panels clearly visible. Scale-mail coverage EXPANDS BELOW the tunic hem — the hem band from L4 grows into a longer scale-mail extension wrapping from the tunic hem down to mid-thigh. Scale-mail coif at the neck is added (above the tunic, framing the throat). The tunic is NOT covered or replaced — it stays as the dominant chest piece.
- **L6 (Heavy Scale Mail + Over-Jerkin + First Gold)**: brown leather over-jerkin is added OVER THE TUNIC (not over the scale mail), but the over-jerkin is a SHORT vest stopping at mid-torso so the tunic's red+yellow panels are still PROMINENTLY VISIBLE both ABOVE the over-jerkin (at the shoulders / neckline) AND BELOW the over-jerkin (between the over-jerkin's bottom edge and the wider belt). The over-jerkin must NOT cover the entire tunic — at least 40-50% of the tunic's red+yellow surface must remain visible.
- **L7 (Basic Plate)**: steel breastplate covers the upper chest. The tunic with red+yellow MUST remain visible as a CLEAR BAND between the breastplate's lower edge and the wider belt — NOT a tiny wedge. The breastplate stops at mid-torso and the tunic shows for 4-6 inches below.
- **L8–L10**: tassets at the hip carry the red+yellow alternating strips from L8 onward; the tunic chest visibility transitions to the tassets-as-livery interpretation. The tassets must be CLEARLY ALTERNATING red and mustard strips — the livery colors are now at the hip silhouette.

**Authoring rule**: every Tier 2 + Tier 3 prompt must include explicit language preserving the livery visibility, with both positive ("the mustard-yellow tunic with red center panel and red side panels remains dominant on the chest, fully visible, NOT covered by scale mail") and negative ("DO NOT cover the tunic chest panel with scale mail; DO NOT replace the tunic with a scale-mail body coat; DO NOT shrink the tunic to a thin strip") clauses. This is the strongest preservation requirement after pose and framing.

### Proportions & Build (identical at every level)
| Anchor | Spec |
|--------|------|
| **Chibi rig** | ~2.5–3 heads tall — same skeleton at L1 and L10 |
| **Head size** | Oversized, ~30–35% of total figure height |
| **Body type** | Slim athletic — narrow waist, modest shoulder width, slim arms with a soft hint of tone (a hunter, not a warrior). The L10 silhouette reads visibly *stockier* than L1 only because of the layered armor mass at chest/shoulders/hips, not because the underlying body changed. |
| **Hands** | Slightly enlarged for chibi gestural readability; **always bare** (no gloves, no gauntlets, even at L10) |
| **Legs** | Short and slightly bowed in the standard chibi way |
| **Feet** | Chunky, wide, planted — standard EMTD grounded silhouette |
| **Arm convention** | Bow in **anatomical-LEFT hand** (viewer-right), draw hand is **anatomical-RIGHT** (viewer-left). Bow-arm always vertical at hip; draw hand always forward across the body at chest height with fingers loosely curled. |

### Face (visible L1–L8, concealed L9–L10)
| Anchor | Spec |
|--------|------|
| **Visibility schedule** | L1–L6 face fully visible under the cloth hood; L7–L8 face fully visible under the open-face steel helm (no visor); **L9–L10 face fully concealed by closed visor** — no skin / no hair / no eyes / no expression visible above the breastplate. |
| **Skin** | Warm peachy-tan with soft orange/pink undertones; rosy cheek + nose-tip blush; warm-shadow ambient occlusion under the hood/helm rim and along the jaw |
| **Hair** | Dark brown / near-black, short, slightly tousled — mostly hidden under the hood/helm with a few short strands at the temples and a small fringe at the forehead. (No visible long hair, no ponytail, no braid.) |
| **Eyebrows** | Thick, dark brown, prominent. Slightly angled — inner ends pulled down a touch, **anatomical-left brow (viewer-right) arched a little higher** for the confident roguish read. |
| **Eyes** | Large and expressive in the chibi way; **warm brown irises** with a single clean catchlight in each. Eye shape moderately narrowed and angled — alert and focused, not wide and innocent. Whites of the eyes visible. |
| **Nose** | Small to medium, slightly upturned, soft painted shadow on the underside, faint rosy tint on the tip |
| **Mouth** | **Closed confident half-smirk** — viewer-left corner pulled higher, lips simple and clean, no teeth visible |
| **Jaw / chin** | Soft rounded chin; faint cool-warm shadow along the jawline reading as a hint of stubble shadow without explicit linework — subtle, not a beard |
| **Ears** | Hidden by the hood/helm at every level |
| **Facial hair** | None — no beard, no mustache, no goatee at any level |
| **Expression read** | Cocky, focused, mildly mischievous — a young hunter who clearly enjoys his job. Identical L1 through L7. |

### Apparel & Equipment Anchors
| Anchor | Notes |
|--------|-------|
| **Crimson-red cape, knee-length, plain hem** | Always present at all 10 levels. Plain rolled hem, no gold trim ever. |
| **Red somewhere at the head/neck** | Cloth hood pulled up (L1–L6), red coif/scarf hanging at the back of the neck under the helm (L7–L10). Red is never absent at the head/neck region. |
| **Mustard-yellow somewhere on the torso/hip** | Tunic base (L1–L3), tunic over scale mail (L4), short surcoat panel over scale mail (L5), tunic peeking from under leather over-jerkin (L6), small wedge between breastplate and scale-mail hem (L7), tassets yellow strips (L8–L10). |
| **Olive / muted forest-green trousers, knee-length** | Identical at every level. Partially covered by leather greaves from L3 onward. |
| **Chunky warm-brown leather boots with darker folded ankle cuff** | Identical at every level — no metal sabatons ever. |
| **Brown leather back-quiver over anatomical-left shoulder** | Three to four arrows visible, white feather fletching, red bindings/red tips, pale wood-tan shafts. Identical at every level. |
| **Bow vertical at hip in the anatomical-LEFT hand, draw hand forward at chest** | Pose convention identical at every level. |
| **Forearm coverage (asymmetric L1, symmetric L2+)** | L1 has a leather wrist bracer on the bow arm + linen bandage on the draw arm/hand. L2 swaps the bandage for a matching leather bracer (symmetric). L3 carries leather. L4–L6 add scale-mail sleeves under the leather. L7+ steel vambraces replace the leather. **The forearms are never fully bare past L1.** |
| **Three-quarter view, full body, clean white background, thin black silhouette outline** | Style anchors hold across the line. |

### Why the face becomes hidden at L9 (worth flagging now)
Once the closed visor arrives at L9, the personality face that anchors L1–L8 is no longer available — the silhouette has to do all the character work. This is why the L9–L10 ramp leans hard on **silhouette beats** (visor shape, gold finial growth, tassets motif, gold bow) rather than face beats. If the team later decides L10 should keep the face visible, the L10 ground-truth image would need to change (open or partial visor) and the visor-closing moment would need to be dropped entirely. Worth confirming L10's closed visor is locked.

## AD Feedback — Detail Economy / Silhouette-First Rule (LOCKED 2026-05-07)

Silviu's FeedbackV0 (saved at `UnitProgression/docs/Feedback/FeedbackV0`) flagged that the late-tier Archer levels carry too much surface detail — too many rivets/nits, too much gold filigree, and the skirt armor broken into too many tiny sections. Locked principle:

**Higher levels gain richness via VOLUME and SILHOUETTE SHAPE, not via stacked surface ornament.** Each new level should add at most one or two "decoration" beats; everything else should be a coverage extension, a volume bump, or a material change. When in doubt, drop a rivet/filigree pass and add a coverage extension instead. Filigree, fine engraving, per-edge gold piping, and tiny rivet rings are the first to cut. Wider plates, taller helms, broader pauldrons, fuller arm coverage are what the eye reads at thumbnail scale.

This rule is the resolution of the AD feedback; specific applications in the per-level beat list below.

## Three-Tier Armor Structure

After the user direction on 2026-05-04 (move away from per-level micro-beats toward visible armor-tier escalation), the progression is structured as **three armor tiers of three levels each, plus the L10 royal elite topper**. Inside each tier, the unit goes from a basic version of that armor type to a fully kitted version. Between tiers, the silhouette and material change visibly. Every level delivers a **clearly visible** upgrade — added pieces (sleeves, bracers, pauldrons, pouches, greaves, tassets), expanded coverage, more straps/belts, or a full material change — never a one-detail micro-tweak.

| Tier | Levels | Material read | Silhouette arc |
|------|--------|---------------|----------------|
| **Tier 1 — Leather Scout** | L1–L3 | Cloth + leather, no metal armor | Bare-armed conscript → leather kit complete → full leather scout (caps, gambeson, greaves, multi-pouch belt, knife) |
| **Tier 2 — Scale Mail** | L4–L6 | Scale mail (chunky overlapping rounded scales) + leather over-pieces | Basic scale mail (sleeves arrive, scale-mail at hem) → mid scale mail (full coat, scale-mail coif at neck, studded pauldrons, arrow bandolier) → heavy scale mail with leather over-jerkin + first thin gold trim |
| **Tier 3 — Plate** | L7–L9 | Steel plate over mail | Basic plate (open helm, breastplate, vambraces) → mid plate (gold trim band on helm, layered pauldrons, tassets first appear) → heavy plate (closed visor, gold finial stub, pauldron rivets, gold buckle, gilt bow tips) |
| **L10 — Royal Elite** *(ground truth)* | L10 | Plate + full gold accents + golden bow | Full gold spike finial + fully gold recurve bow |

### Within-tier escalation rule
Inside each tier the unit goes **base → mid → top** with three distinct visible additions per step. Each step adds something the eye notices instantly: a new piece (pauldrons, greaves, vambraces, pouch, knife, bandolier), a coverage expansion (bare arms → sleeves, short tunic → long scale-mail coat, partial chest → full breastplate), or a material change (cloth → quilted gambeson, leather → scale mail, scale mail → plate). No level is a "polish pass."

### Between-tier break rule
At each tier break (L3→L4 leather→scale mail, L6→L7 scale mail→plate, L9→L10 plate→royal) the silhouette must change in a way readable at thumbnail scale — typically a major material swap on the head, the arms, or the torso. Tier breaks are the moments the unit "graduates" visually.

### Input strategy (locked 2026-05-04, refined after L5 v1)
Two rules govern which image(s) feed each generation:

**Rule 1 — At each tier break (the FIRST level of a new armor tier), start fresh from L1_Base.**
- **L4** (start of Tier 2 — Scale Mail): single input = `UnitProgression/Archer/Refs/L1_Base.png`. Prompt describes ALL accumulated kit from L2 + L3 + the new L4 adds, because none of it is in the input image.
- **L7** (start of Tier 3 — Plate): single input = L1_Base. Prompt describes everything from L2 through L7.
- Reason: starting fresh from L1_Base at tier breaks resets the pose/face/proportions to the canonical anchor and prevents tier-vs-tier silhouette confusion (e.g. leather kit pieces persisting visually under steel armor where they no longer should).

**Rule 2 — Within a tier (subsequent levels of the same tier), chain from the previous keeper + L1_Base as scale anchor.**
- **L5** (Tier 2 mid): inputs = `[L4 keeper, L1_Base]`. Prompt describes ONLY the L4→L5 delta (the new mid-tier adds). The L4 keeper carries everything that was already there visually.
- **L6** (Tier 2 top): inputs = `[L5 keeper, L1_Base]`. Prompt describes ONLY the L5→L6 delta.
- **L8** (Tier 3 mid): inputs = `[L7 keeper, L1_Base]`. Delta only.
- **L9** (Tier 3 top): inputs = `[L8 keeper, L1_Base]`. Delta only.
- **L10** (Royal): inputs = `[L9 keeper, L1_Base]`. Delta only.
- Reason: within-tier escalations are small additive changes; the visual reference for everything carried over IS the previous keeper (much higher fidelity than re-describing in prose). L1_Base remains the second image solely for scale/framing/pose anchoring.

**Trade-off**: tier-break prompts are very long (~13-17K chars) because they re-describe everything. Within-tier delta prompts are short (~6-9K chars) and let the model see what to keep in image 1.

### Scale-mail visual spec (applies to all Tier 2 scale-mail elements)
**Scale mail in this style** = chunky overlapping rounded scale-shaped plates, painted in cool silver-gray steel with a soft top-down highlight on each scale and warm-brown shadow under the lower edge of each scale. Each scale is a small rounded shield-shape (semi-circular at the top, slightly tapered at the bottom), arranged in horizontal rows where each row overlaps the row below by about half a scale. The texture reads as **chunky, hand-painted, clearly individual scales** at character-card scale — NOT as fine chainmail rings, NOT as small dots, NOT as a flat texture. Reference: the gray scale-mail coif on the bearded character supplied by the user (image circulated 2026-05-04). Scale color is consistent cool silver-gray throughout; the rounded scale-edge highlight gives the surface its readability.

## Per-Level Beats (Tier-Based)

Each level delivers one **clearly visible** upgrade — added pieces, expanded coverage, or a material change. The "what's new" lines are the things a player can see at thumbnail scale.

---

### Tier 1 — Leather Scout (L1–L3)

#### L1 — **Baseline Conscript** *(ground truth: archer1.png)*
Red hood up, sleeveless mustard-yellow tunic with vertical red center + side panels, bare biceps. **Brown leather wrist bracer on the bow arm** (anatomical-LEFT forearm, viewer-RIGHT — single cross-strap binding, matte warm leather). White linen bandage wrapping the draw arm and hand from knuckles to mid-forearm (anatomical-RIGHT, viewer-LEFT). Two-strand warm-brown belt with small brass rectangular buckle. Olive trousers, brown boots, crimson-red cape to knee. Brown back-quiver with white-feather red-tip arrows. Wood-brown recurve short bow with dark-brown leather grip wrap.

#### L2 — **Leather Kit Complete** *(Tier 1 mid)*
What's new (3 visible adds — pouch removed per AD feedback 2026-05-07):
- **Matching leather wrist bracer on the DRAW arm** — replaces the white linen bandage. Same warm-brown leather as the bow-arm bracer but slightly more developed: two visible cross-strap bindings instead of one. Both forearms now symmetrically bracered, hands still bare.
- **Brown leather X-strap chest harness** — runs diagonally across the front of the chest from the anatomical-LEFT shoulder down to the anatomical-RIGHT hip (in front of the body, separate from the quiver strap that runs behind), with a small painted brass ring at the crossing.
- **Wider belt** — the L1 two-strand belt is consolidated into a single wider warm-brown leather belt at the natural waist, with the same brass rectangular buckle but a slightly thicker silhouette and visible edge stitching.

Hood, tunic, cape, trousers, boots, quiver, bow, and pose all unchanged. **Hip pouches REMOVED from the plan entirely (AD feedback 2026-05-07)** — the dagger introduced at L3 is the only belt accessory.

#### L3 — **Full Leather Scout** *(Tier 1 top)*
What's new (4 visible adds — second pouch removed per AD feedback 2026-05-07):
- **Brown leather pauldron caps on both shoulders** — small soft-leather rounded caps over each deltoid, slightly darker brown than the bracers, with a single painted seam running over the cap. Biceps still bare below the caps.
- **Quilted gambeson tunic texture** — the L1/L2 sleeveless tunic gains visible quilted vertical fold lines down each color panel (red side panels and red center panel get the quilting; mustard base stays smooth). Reads as reinforced fabric rather than thin cloth.
- **Brown leather greaves on the lower legs** — wrap from the boot cuff up to just below the knee, over the olive trousers. Single cross-strap binding on each greave, matching the bracer style.
- **Small dark-wood dagger in a brown leather sheath** — sits at the belt on the anatomical-RIGHT hip. Dark wood handle protrudes upward from the sheath. **This is the ONLY belt accessory carried through the rest of the progression** (per AD feedback 2026-05-07 — pouches and tool-loop ring removed entirely).

Hood, cape, trousers (now partially covered by greaves), boots, quiver, bow, and pose unchanged. Bracers and X-strap unchanged from L2.

---

### Tier 2 — Scale Mail (L4–L6)
**Tier break L3 → L4: first metal arrives. The arms get sleeves for the first time — the largest silhouette change in the entire ramp.**

#### L4 — **Basic Scale Mail** *(Tier 2 base)*
What's new (4 visible adds):
- **Scale-mail SLEEVES on both arms** — chunky overlapping cool silver-gray scale plates cover the biceps and forearms from shoulder to wrist (per the scale-mail visual spec above — rounded shield-shape scales arranged in overlapping horizontal rows, each scale clearly individuated and painted with its own soft highlight). The leather wrist bracers from L2/L3 sit ON TOP of the scale mail at the forearms; the leather pauldron caps from L3 sit ON TOP of the scale mail at the shoulders. The arms are no longer bare — this is the dominant silhouette change.
- **Scale-mail shirt visible at the tunic hem** — a band of silver-gray scale plates, three to four inches tall, peeks below the lower edge of the gambeson tunic, sitting over the trousers and above the greaves. Reads as a scale-mail coat worn under the tunic.
- **Low steel skullcap under the cloth hood** *(introduced earlier per AD feedback 2026-05-07 — first metal headpiece arrives at L4 instead of L7 to spread the helm progression and avoid the L7 hood-vs-coif clipping)* — a simple low-domed cool silver-gray steel cap covers the top of the head, visible at the brow line and at the temples. The red cloth hood is still pulled up over the skullcap; the front edge of the steel cap shows as a thin silver band at the brow under the hood opening. Two small painted iron rivets at the temples. Hood color stays red cloth.
- **Belt re-strapped over the scale-mail hem** — the L2/L3 wide leather belt is now visible cinched over the scale-mail-hem peek, with the X-strap and dagger sheath carried over and re-arranged to sit cleanly over the new scale-mail layer.
- **BOW UPGRADE — brass grip-end binding rings** — two small polished brass bands appear at each END of the leather grip wrap (where the dark-brown leather meets the wood-brown limb on both the upper and lower sides of the grip). Each band is a thin metallic ring wrapping the bow's central handle perpendicular to the limb axis, with a soft buttery brass highlight catching the upper edge. Functional reinforcement at the grip transitions. Bow limb material remains warm wood-brown.

Cape, trousers (where visible), greaves, boots, quiver, and pose unchanged. Tunic color blocking (red+mustard panels) unchanged but now over a scale-mail base.

#### L5 — **Mid Scale Mail** *(Tier 2 mid)*
What's new (4 visible adds):
- **Scale-mail extension below the tunic hem (livery preserved)** — the L4 short scale-mail hem band (3-4 inches tall) EXTENDS DOWNWARD into a longer scale-mail "skirt" wrapping from the tunic hem to mid-thigh, sitting over the trousers and above the leather greaves. The tunic itself is **NOT replaced** — the mustard-yellow body with the quilted red center panel and red side panels remains the dominant chest garment, fully visible from collar to hip. Scale mail coverage now consists of: (a) the sleeves on both arms (carried from L4), (b) the new longer scale-mail "skirt" wrapping the hips and upper thighs below the tunic hem.
- **Scale-mail coif at the neck and back of the head, hood retires** *(revised 2026-05-07 per AD feedback — earlier head-armor escalation; hood retires at L5 instead of L6/L7 to avoid the L7 hood-vs-coif clipping)* — a scale-mail collar/cowl wraps around the neck and continues UP behind the head as a partial scale-mail head covering, visible at the back-of-neck and rising to ear level. The cloth hood is now PULLED DOWN onto the shoulders/upper back and reads as a soft red mantle/collar at the back rather than as a head covering. The L4 steel skullcap remains visible at the top of the head and is now exposed (hood no longer covers it). Result: the head silhouette reads as steel skullcap on top + scale-mail coif framing the back/sides + neat fringe at the brow visible. Red cloth migrates from "hood up" to "mantle / cape attachment at the shoulders."
- **Studded leather pauldrons** — the L3 plain leather pauldron caps are upgraded to studded leather pauldrons with three or four visible painted brass studs across each cap, slightly larger and more substantial than the L3/L4 caps.
- ~~Crossbody arrow bandolier~~ **(deprecated 2026-05-04 after first L5 generation)** — the bandolier rendered but didn't read distinctively against the X-strap silhouette. Removed from L5 onward; the back-quiver remains the only arrow-carrying element.
- **BOW UPGRADE — brass tip caps at both limb tips** — small polished brass sleeves wrap the outermost ~half-inch of each bow limb tip (both the upper limb tip and the lower limb tip). Each cap is a small metallic cone-shape sitting flush at the tip end, with a clean buttery-brass highlight on the upper edge. The brass binding rings at the grip ends from L4 carry over. Bow limb material remains warm wood-brown between the grip-end binds and the new tip caps.

Hood, cape, trousers (mostly hidden now), greaves, boots, back-quiver, knife, hip pouches, belt, and pose unchanged. Bracers carry over (sit over the scale-mail sleeves).

#### L6 — **Heavy Scale Mail + Leather Over-Jerkin + First Gold** *(Tier 2 top)*
What's new (4 visible adds):
- **Brown leather sleeveless over-jerkin (livery preserved)** — a fitted SHORT leather vest worn OVER THE TUNIC, covering only the upper-mid chest area with a clear leather chest piece and a single buckled clasp at the front. The over-jerkin is INTENTIONALLY SHORT (covers only the upper-mid chest, stopping at the bottom of the breastbone) and PARTIAL (does not wrap the whole torso) so the mustard tunic with red center panel and red side panels remains PROMINENTLY VISIBLE both ABOVE the over-jerkin (at the shoulders / collar / neckline) AND BELOW the over-jerkin (a clear band of red+yellow visible between the over-jerkin's bottom edge and the wider leather belt). At least 40-50% of the tunic's red+yellow surface stays visible. The over-jerkin functions as additional chest reinforcement, NOT as a covering tabard.
- **First gold trim — thin gold band at the wrist edge of each leather bracer** — a thin buttery-gold line runs around the top rim of each forearm bracer where the leather meets the scale-mail sleeve. First appearance of gold on the character; deliberately small and easy to miss at thumbnail scale.
- **BOW UPGRADE — limbs lengthen toward longbow proportions** *(revised 2026-05-07 per AD "short bow should evolve into a longbow")* — the L1-L5 short recurve limbs grow ~20% longer at L6, both upper and lower, transitioning the bow from a "short hunter's recurve" silhouette toward a "medium-longbow" silhouette. Limb curvature softens slightly. The brass grip-end bindings (L4) and brass tip caps (L5) carry over to the new limb tips. Bow limb material remains warm wood-brown.

(Removed per AD feedback 2026-05-07: third hip pouch + tool-loop ring + leather throat collar. The over-jerkin + first gold trim + bow longbow growth are the L6 silhouette beats; the small leather kit accumulation has been cut to keep late-tier visual noise down. Per the Detail Economy rule, surface accessories that don't read at thumbnail scale are dropped in favor of bow-shape change and tunic/coverage beats.)

Steel skullcap (L4), scale-mail coif (L5), red mantle at the shoulders (former hood now down at L5), cape, trousers (where visible), greaves, boots, back-quiver, scale-mail sleeves, studded pauldrons, dagger, and pose unchanged. (Bandolier deprecated 2026-05-04. Hip pouches deprecated 2026-05-07.)

---

### Tier 3 — Plate (L7–L9)
**Tier break L6 → L7: the cloth hood retires for the first time, replaced by an open-face steel helm. Plate replaces the leather over-jerkin and the leather/scale-mail forearms.**

#### L7 — **Basic Plate** *(Tier 3 base)*
What's new (5 visible adds):
- **Open-face conical steel helm** — replaces the L4 steel skullcap. Polished cool silver steel, slightly tapered to a low rounded apex (no finial yet, no gold yet, no visor). Cheek shadow painted in but the face is fully visible. The red mantle (former hood, retired at L5) still hangs as a soft red drape at the back of the neck and over the upper back — preserving the red-at-head anchor. The L5 scale-mail coif tucks under the helm and is still visible at the back of the neck framing the rear of the helm. **No hood-vs-coif clipping at this transition** because the hood retired two levels earlier (L5) per AD feedback 2026-05-07.
- **Steel breastplate** — a polished cool silver-steel breastplate covers the chest from collarbones to mid-torso, replacing the leather over-jerkin and the visible mustard surcoat panel above it. Plain polished plate with a soft top-down gradient and a clean central highlight; no engraving.
- **Steel vambraces** — replace the L2-L6 leather wrist bracers. Tapered silver-steel tubes from wrist to just below the elbow with a longitudinal seam visible. **Scale-mail sleeves now cover the FULL bicep down to the wrist** *(revised 2026-05-07 per AD feedback — no bare bicep gap above the vambrace; chainmail/scale-mail covers the full arm at later levels)*: the scale mail extends continuously from shoulder to wrist and the steel vambrace sits ON TOP of the scale-mail at the forearm. No exposed scale-mail patch between pauldron and vambrace; the arm reads as fully armored.
- **Single-piece steel pauldron caps** — replace the studded leather pauldrons. Smooth dome shape, single plate (no layered lames yet, no rivets), polished cool silver steel with a bright leading-edge highlight.
- **Scale mail still visible at the hem** below the breastplate (the scale-mail coat from L5 carries through), and the mustard tunic / red panels are now confined to a small visible wedge between the breastplate's lower edge and the scale-mail hem.

Cape, trousers (where visible), greaves, boots, back-quiver, bow (still wood-brown, longbow proportions from L6), dagger, belt, and pose unchanged. The leather X-strap is retired (the breastplate occupies that space). The thin gold wrist trim from L6 disappears with the L6 leather bracers — gold returns at L8 on the helm.

#### L8 — **Mid Plate + First Tassets + Gold Helm Trim** *(Tier 3 mid)*
What's new (4 visible adds):
- **Thin horizontal buttery-gold trim band on the helm** — wraps the conical steel helm roughly two-thirds of the way up from the brow, separating the lower body of the helm from the upper cone. Plain band, no engraving. First gold on the character at the head; reads as a rank-marker.
- **Tassets / arming-skirt strips at the hip** — a row of vertical cloth strips hangs from the waistline down to mid-thigh, **alternating crimson-red and mustard-yellow** around the hip silhouette. Replaces the visible scale-mail-hem peek from L7. This is the first appearance of the red+yellow alternating motif that defines the L10 silhouette. Stiffened cloth with subtle vertical fold lines.
- **Layered two-plate pauldrons** — the L7 single-piece pauldron caps grow a second lower lame, with a visible seam between the upper cap and the lower lame. Still no rivets. Same cool silver steel.
- **Wide leather waist belt with a brass rectangular buckle** — the L2-L6 wide belt is upgraded to a wider, more substantial warm-brown leather waist belt sitting just below the breastplate's lower edge and anchoring the tassets. Brass rectangular buckle (gold buckle arrives at L9).

Open-face helm shape, breastplate, vambraces, cape, trousers, greaves, boots, back-quiver, bow, and pose unchanged. The dagger is retired at L8 (the wider belt and tassets occupy that space). **Scale-mail sleeves cover the FULL arm** (shoulder to wrist) under the vambraces and pauldrons (per L7 revision — no exposed bicep gap).

#### L9 — **Heavy Plate + Closed Visor + First Gold Accents** *(Tier 3 top — revised 2026-05-04, simplified 2026-05-07)*
What's new (4 visible adds — pauldron rivets removed per AD feedback 2026-05-07; volume bump replaces surface ornament):
- **Closed full-face visor** — replaces the open-face helm front. A fixed steel visor covers the face from forehead to chin with a single horizontal recessed eye slit at eye level. The face is now fully concealed; the visor flares slightly at the cheekbones and tucks back in at the jaw. Helm body shape unchanged from L8 (open-face conical body now has the visor closed across the face).
- **Layered two-plate pauldrons grow taller** *(volume bump replaces L8→L9 surface-rivet pass per AD detail-economy feedback 2026-05-07)* — the L8 two-plate pauldrons gain a thicker upper cap and the lower lame extends ~1 inch further down the deltoid, broadening the shoulder silhouette. Reads as bulkier pauldrons at thumbnail; **NO rivet dots** (removed — the volume bump is the upgrade, not the surface decoration).
- **Red gambeson V-wedge at the throat (center-front)** — a clear crimson-red triangular cloth wedge becomes visible at the throat between the scale-mail coif and the upper edge of the steel breastplate, point downward, sitting CENTER-FRONT (not inner shoulder). Reads as the gambeson tunic peeking through above the breastplate. Bridges directly into L10's center-front red wedge.
- **Buttery-gold rectangular belt buckle** — the L8 brass buckle is replaced by a slightly larger buttery-gold rectangular buckle. Second gold accent on the character (after the L8 helm trim band).
- **Gilt bow limb tips** — the outermost ~15% of each bow limb is painted in buttery gold, blending into the warm wood-brown along the inner curve. The dark-brown leather grip at the central handle remains unchanged. Third gold accent; bridges into the L10 fully-gold bow.

Cloth tassets (alternating red+yellow), wide leather belt, breastplate, vambraces, scale-mail full-arm sleeves, scale-mail coif, cape, trousers, greaves, boots, back-quiver, and pose unchanged.

#### L9.5 — **Royal-Grade Plate Graduation** *(intermediate, added 2026-05-04 to bridge L9→L10)*
**Why this level exists**: between L9 (closed-visor + first gold accents but cloth tassets, plain plate, conical helm) and L10 (Royal Elite ground truth with steel fauld skirt, full gold trim, tall pointed helm, full gold spike, fully gold bow) there is a major silhouette/material jump. L9.5 absorbs the cloth-to-steel skirt conversion + gold trim spread + helm reshape so L10 can land cleanly with just two final adds (full gold spike + fully gold bow).

What's new (3 visible adds — gold trim spread reduced per AD detail-economy feedback 2026-05-07):
- **Steel fauld/cuisse skirt REPLACES the cloth tassets — wider plates, fewer of them** *(revised 2026-05-07 per AD feedback — the skirt was previously broken into too many tiny plate sections)* — the L8/L9 alternating red+yellow cloth tassets at the hip are GONE. In their place sits a steel plate fauld skirt: **5 to 6 vertical polished cool silver-gray steel plates** hanging from the wider leather belt down to mid-thigh, each plate roughly 3 to 4 inches wide (NOT 1.5-2 inches — wider lames, fewer of them, so the eye reads "armor skirt" not "fragmented strips"). Plates are butt-jointed or slightly overlapping with a single visible vertical seam between them. (This retires the heraldic livery from the silhouette — at L9.5 and L10 the only red survival is the cape, the throat wedge, and the back-of-neck mantle. The mustard yellow effectively migrates into the gold accents.)
- **Helm reshapes taller and more pointed** — the L7-L9 open-face conical body of the helm grows TALLER and more sharply pointed at the apex (about 1.5x the previous height), preparing the silhouette for the full gold spike finial that arrives at L10. The closed visor (from L9) and the gold trim band (from L8) carry through at their proportional positions on the new taller helm. NO finial yet at L9.5 — the apex remains a sharp steel point; the gold spike is reserved for L10.
- **BOW UPGRADE — gilt extends along outer half of each limb** — the L9 gilt tips (outer ~15%) extend further down each limb to cover roughly the outer ~50% of each limb in buttery gold, with a softer transition from gold (outer) to wood-brown (inner). The dark-brown leather grip at the central handle remains unchanged.

(Removed per AD feedback 2026-05-07: "gold trim spreads across the plate" — breastplate edge piping, vambrace cuff trim, and per-pauldron-lame edge trim. The taller helm + the steel fauld skirt + the gilt bow extension are the L9.5 silhouette beats; per-edge gold piping was contributing too much surface noise without reading at thumbnail scale. Gold accents at L9.5 = helm gold trim band [from L8] + gold belt buckle [from L9] + outer-50% gilt bow [new] only.)

Closed visor, full-arm scale-mail sleeves, scale-mail coif, red throat wedge, gold belt buckle, wider leather belt, cape, trousers, greaves, boots, back-quiver, and pose unchanged from L9.

---

### L10 — **Royal Elite (Ground Truth)** *(level10archer.png — revised 2026-05-04, simplified 2026-05-07)*
What's new from L9.5 (2 visible adds):
- **Full buttery-gold spike finial at the helm apex** — the L9.5 sharp steel point at the apex grows a tall tapered buttery-gold spike finial. Clean point with a soft white-gold highlight. Final head silhouette is locked.
- **Fully buttery-gold longbow** — the L9.5 outer-50%-gilt bow finishes its conversion: the entire bow limb is now polished buttery-gold metallic, with a darker gold inner-curve shadow. Only the dark-brown leather grip wrap at the central handle remains non-gold. No engraving, no gemstone, no glow — the gold material itself is the rank statement. Bow silhouette is at longbow proportions (longer limbs from L6 grew through L7+).

All other L9.5 elements carry through: tall closed-visor steel helm with gold trim band, **simplified two-plate steel pauldrons (no rivets, no per-edge gold piping)**, plain steel breastplate (no edge trim), steel vambraces (no cuff trim), **wider-lame steel fauld plate skirt at the hip (5-6 lames, not 10+)**, wide leather waist belt with buttery-gold rectangular buckle, red gambeson V-wedge at the throat, crimson-red cape, olive trousers, brown leather greaves and boots, brown back-quiver with white-feather red-tip arrows.

> **Note (2026-05-07):** the existing `level10archer.png` ground-truth ref shows the older "filigree-rich" L10 spec (per-edge gold piping, narrow fauld lames, pauldron rivets). After AD feedback, the plan is simplified — surface-ornament passes are removed in favor of volume-driven silhouette beats. When re-running the chain in v3+, the L10 generation should follow the simplified plan above, NOT verbatim re-painting of the existing ground truth. The ground-truth ref image will be re-rendered to match once the v3 chain produces a clean L10 keeper.

## Per-Level Beat Summary Table

| Lvl | Tier | Beat name | Head | Arms | Torso | Hips/Legs | Bow | Gold |
|-----|------|-----------|------|------|-------|-----------|-----|------|
| 1 | Leather base | Baseline Conscript | red hood | bare biceps; bow-arm leather bracer; draw-arm linen bandage | sleeveless mustard tunic w/ red panels | two-strand belt + brass buckle; olive trousers; brown boots | short recurve, wood-brown | — |
| 2 | Leather mid | Leather Kit Complete | red hood | bare biceps; **both forearms now leather bracered** (bandage replaced) | tunic + **leather X-strap** chest harness | **wider belt** (no pouches per AD feedback) | short recurve, wood-brown | — |
| 3 | Leather top | Full Leather Scout | red hood | bare biceps; both bracered; **leather pauldron caps** | **quilted gambeson** tunic | belt + **dagger sheath (only belt accessory)**; **leather greaves** lower legs | short recurve, wood-brown | — |
| 4 | Scale-mail base | Basic Scale Mail | red hood + **steel skullcap under hood** *(helm earlier per AD)* | **scale-mail sleeves** (bracers + pauldron caps over scale mail) | tunic + **scale-mail visible at hem** | belt over the new scale-mail-hem layer | short recurve + **brass grip-end bindings** | — |
| 5 | Scale-mail mid | Mid Scale Mail | **hood retires (down as red mantle)**; steel skullcap + **scale-mail coif** at neck/back-of-head | scale-mail sleeves; **studded leather pauldrons** | **full scale-mail coat neck-to-mid-thigh**, tunic now reads as short surcoat panel | (no new hip/leg adds — bandolier deprecated 2026-05-04) | short recurve + brass grip-ends + **brass tip caps** | — |
| 6 | Scale-mail top | Heavy Scale Mail + Over-Jerkin + First Gold | skullcap + scale-mail coif + red mantle at shoulders | scale-mail sleeves; studded pauldrons; **thin gold trim at bracer wrist edges** | **brown leather over-jerkin** over scale mail | belt (no extra pouches per AD feedback) | **limbs lengthen ~20%** toward longbow + brass grip-ends + brass tip caps | thin gold band at bracer wrists |
| 7 | Plate base | Basic Plate | **open-face conical steel helm** (replaces L4 skullcap); red mantle at back of neck; scale-mail coif tucks under | **steel vambraces** replace leather bracers; **steel pauldron caps; full-arm scale-mail under vambrace (no bicep gap per AD)** | **steel breastplate**; scale mail visible at hem | belt + dagger retained | longbow proportions, wood-brown | none (L6 thin trim retired with the leather bracers) |
| 8 | Plate mid | Mid Plate + First Tassets | open-face helm + **gold trim band** | vambraces; **two-plate pauldrons (no rivets)**; full-arm scale-mail | breastplate; tunic mostly gone | **wide leather waist belt with brass buckle**; **alternating red+yellow tassets** at hip; dagger retired | longbow, wood-brown | gold trim band on helm |
| 9 | Plate top | Heavy Plate + Closed Visor + First Gold Accents | **closed-visor helm** + gold trim band (no finial yet) | vambraces; **pauldrons grow taller (volume bump, no rivets per AD)** | breastplate + **red gambeson V at throat (center-front)** | wide belt + **buttery-gold buckle**; cloth tassets unchanged | longbow + **gilt limb tips** (outer 15% gold) | helm trim + belt buckle + bow tips |
| 9.5 | Royal-grade plate graduation | Royal-Grade Plate | **taller more-pointed conical helm** + gold trim band + closed visor (no finial yet) | vambraces; pauldrons (no rivets, no per-edge piping per AD) | breastplate (no edge trim per AD) + red throat wedge | wide belt + gold buckle + **STEEL FAULD SKIRT, 5-6 wider lames (not 10+ thin strips per AD)** | gilt extends to outer 50% of limbs | helm trim + belt buckle + bow gilt 50% |
| 10 | Royal | Royal Elite | tall helm + gold trim + closed visor + **full gold spike finial** | unchanged from L9.5 | unchanged from L9.5 | unchanged from L9.5 (wider-lame fauld) | **fully gold longbow** (only leather grip wrap non-gold) | helm trim + finial + belt buckle + fully gold bow |

## Color-Anchor Migration Summary

| Anchor | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|--------|----|----|----|----|----|----|----|----|----|-----|
| **Red** | hood + tunic panels + cape | same as L1 | same as L1 | hood + tunic panels + cape | **hood RETIRES (down as red mantle at shoulders per AD 2026-05-07)** + tunic panels + cape | red mantle at shoulders + cape (jerkin covers some panels) | red mantle at back of neck + cape (helm replaces skullcap) | red mantle + cape + **tassets red strips** | red mantle + cape + tassets red strips + **red gambeson wedge at throat center** | red mantle + cape + red throat wedge (tassets gone — replaced by steel fauld) |
| **Mustard yellow** | tunic base | tunic base | tunic base (quilted) | tunic base (over scale mail) | tunic now short surcoat panel over scale mail | tunic peeking from under leather over-jerkin | small wedge between breastplate and scale-mail hem | **tassets yellow strips** (tunic gone) | tassets yellow strips | tassets yellow strips |
| **Olive green** | trousers | trousers | trousers (now with greaves over) | trousers (greaves) | trousers (greaves) | trousers (greaves) | trousers (greaves) | trousers (greaves) | trousers (greaves) | trousers (greaves) |
| **Brown leather** | bow-arm bracer + belt + boots + quiver + bow grip | + draw-arm bracer + X-strap + wider belt (no pouch per AD) | + leather pauldron caps + greaves + dagger sheath (only belt accessory per AD) | (no new leather adds at L4 — steel skullcap appears under hood instead of leather forehead band per AD) | + studded pauldrons (mail under the leather over-pieces) | + leather over-jerkin (no extra pouches/collar/tool-loop per AD detail-economy) | belt + boots + quiver + bow grip + greaves + dagger (most leather kit retired with the breastplate switch) | belt (now wide) + boots + quiver + bow grip + greaves (dagger retired at L8) | belt (gold buckle) + boots + quiver + bow grip + greaves | belt (gold buckle) + boots + quiver + bow grip + greaves |
| **Silver steel** | — | — | — | **steel skullcap (under hood) + scale-mail sleeves + scale mail at tunic hem** *(skullcap is L4 first metal headpiece per AD)* | steel skullcap + scale-mail coif (back of head/neck) + scale-mail sleeves + full scale-mail coat | steel skullcap + scale-mail coif + scale-mail sleeves + full scale-mail coat (under leather over-jerkin) | **open-face conical steel helm + breastplate + vambraces + pauldron caps** + full-arm scale-mail under vambrace + scale mail at hem | open-face helm + breastplate + vambraces + **taller two-plate pauldrons** | **closed-visor helm** + breastplate + vambraces + **taller pauldrons (no rivets per AD)** | taller closed-visor helm + breastplate + vambraces + pauldrons + **wider-lame steel fauld skirt** |
| **Gold** | — | — | — | — | — | **thin gold band at bracer wrist edges** (small first appearance) | — (retired with the L6 leather bracers) | **gold trim band on helm** (returns) | helm trim + **gold belt buckle** + **gilt bow limb tips outer 15%** (no pauldron rivets per AD; L9.5 expands gilt to outer 50% — no per-edge plate piping per AD) | helm trim + **full gold spike finial** + belt buckle + **fully gold longbow** |

### Color-anchor narrative
- **Red** is the strongest continuity anchor — it lives somewhere on the head/neck region at every level (hood L1–L6, back-of-neck coif L7+) and in the cape at every level. Tunic-panel red retires once the breastplate covers the chest at L7, but red returns at the hip via the tassets at L8.
- **Mustard yellow** is the second continuity anchor — it lives in the tunic at L1–L7 (gradually shrinking as armor covers more of the torso) and migrates fully to the tassets at L8.
- **Olive green** trousers are unchanged at every level; the only change is that they get partially covered by the leather greaves added at L3.
- **Brown leather** is everywhere from L1 (bow-arm bracer + belt + boots + quiver + bow grip) and accumulates kit pieces through L6 (X-strap, pouches, pauldron caps, greaves, over-jerkin, etc). Most of the visible leather kit retires at L7 when the breastplate, vambraces, and steel pauldron caps replace the leather equivalents — only the boots, belt, quiver, bow grip, and greaves carry through.
- **Silver steel** arrives at L4 in the form of **scale mail** (chunky overlapping rounded scale plates per the scale-mail visual spec — NOT chainmail, NOT fine ring mesh, NOT scale that reads as fish-fine), expands through L6, and converts to plate at L7. By L9 the steel is the dominant material.
- **Gold** arrives once briefly at L6 (thin gold trim at the leather bracer wrists, retires at L7), returns at L8 (helm trim band), and accumulates through L9 (finial stub, buckle, gilt bow tips) before the L10 ground-truth full set.

## Notes for Per-Level Doc Authoring (next step, after this plan is approved)

When the per-level docs get written, each one should follow the structure already used in `Archer.md` and `Archer_Lvl10.md`:

1. Header + ref image path + base-doc cross-link.
2. **Tier Summary** (one paragraph naming the chapter and the three-word beat).
3. **Delta from previous level** (only the beats that change — keeps the docs short and the diff readable).
4. **Full Apparel** (every element described, even unchanged ones — so the doc stands alone for an image-gen prompt).
5. **Color additions / changes vs previous level** (small table).
6. **Prompt Fragment** (full standalone image-gen prompt for that level, including the style anchor + thin-black-outline language).
7. **Anti-Tokens** (especially "do not include features from later levels" — e.g. "no closed visor at L7", "no gold bow before L10").

## Known Vocabulary Risks (Watch on First Generation Pass)

- **"skullcap" (deprecated in v2 plan)** — was originally used at L5/L6 in the previous ramp, removed in the tier-based rewrite (L5 and L6 are now scale-mail tiers, no skullcap appears). Note retained for historical context: the word can over-read as a *skull-themed helmet* in image-gen models (bone shape, eye sockets, gothic skull motif). If a similar simple bowl helm is ever needed in a later spec, prefer `simple rounded steel bowl helm`, `low domed steel cap`, `steel half-helm`, or `steel coif cap` and negative-list `skull motif`.
- **"scale mail" / "chainmail" / "mail" — must be SCALE not CHAIN** (locked 2026-05-04 by user reference image — gray scale-mail coif on the bearded character). Image-gen models default `mail` and `chainmail` to fine interlocking ring mesh. Our style requires **chunky overlapping rounded scale-shaped plates**, hand-painted with each scale clearly individuated, semi-circular at the top and slightly tapered at the bottom, arranged in horizontal rows where each row overlaps the row below by about half a scale. **Authoring rule for L4–L7 prompts**: use `scale mail` or `scale-mail` (not `chainmail`, not `mail` alone), and include the full descriptive phrase the first time it appears in any prompt — `chunky overlapping rounded scale plates in cool silver-gray steel, each scale a small rounded shield-shape with a soft top-down highlight, arranged in horizontal rows where each row overlaps the one below by about half a scale, hand-painted style with each scale clearly individuated`. Negative-list: `chainmail rings, fine ring mesh, interlocking metal rings, fish-scale fine texture, scale that reads as small dots`. Reference image: gray-coif bearded character (saved 2026-05-04).

## Open Questions Before Writing Per-Level Docs (v2 — Tier-Based)

The previous open-questions set was tied to the per-level micro-beat structure. Most are resolved by the new tier structure. Remaining decisions:

1. **Hood retirement at L7** — the cloth hood now survives all of Tier 1 + Tier 2 (L1–L6) and only retires at the L6→L7 tier break (Tier 2 → Tier 3 plate transition). The red cloth migrates to a back-of-neck coif/scarf from L7 onward. Comfortable with L7 retirement, or should the hood survive through L7 alongside the open-face helm and only retire at L8 with the closed visor?
2. **Scale-mail SLEEVES at L4** — this is the single biggest silhouette change in the entire ramp (bare biceps L1–L3 → fully covered arms L4+). Confirm you want the arms to go fully scale-mail-sleeved at L4, or would you prefer a quieter intermediate step (e.g. L4 only scale-mail sleeves on the bow arm, both at L5)?
3. **First gold at L6 (briefly) then again at L8** — the new ramp introduces a small gold accent at L6 (thin band at the bracer wrist edges), retires it at L7 with the leather bracers, and brings gold back at L8 on the helm. Two-step gold introduction. Alternative: hold gold off entirely until L8 for a cleaner "gold = veteran tier" read. Your call.
4. **Closed visor at L9** — moved from L8 to L9 in the new ramp. L8 is the "mid plate" tier with the open-face helm + gold trim band + tassets first appearance; L9 is the "heavy plate" tier where the visor closes. This gives only ONE level of closed-visor before L10 (just L9, then L10). Comfortable with that, or do you want the visor to close earlier at L8 to give two levels of closed visor (L8 + L9 + L10)?
5. **Tassets first appear at L8** — bringing the red+yellow alternating motif in early enough that L8, L9, and L10 all share that hip silhouette. Confirm L8.
6. **Greaves from L3 onward** — new addition (lower-leg leather wrapping over the trousers). Keeps the leg silhouette from going visually static for the whole ramp. Confirm to add at L3 and carry through L10, or skip greaves entirely?
7. **Arrow bandolier at L5 onward** — the secondary crossbody strap with arrow-clip loops. Adds visible kit but might compete with the X-strap from L2/L3 and the back-quiver. Keep at L5 onward or drop?
8. **Knife at the belt from L3 onward** — same question as before. Keep through L8 (when the wider belt + tassets cover the hip), or drop earlier?
9. **Hip pouches** — L2 adds one, L3 adds a second, L6 adds a third. They retire at L7 when the breastplate forces a different belt arrangement. Confirm the pouch ramp, or simplify to just one pouch that grows in detail?

Once you've answered/adjusted these, I'll write the per-level docs (or, if you want to go straight to the next L2 generation prompt without writing all the per-level docs first, I can draft just the L2 prompt against the new "Leather Kit Complete" beat).
