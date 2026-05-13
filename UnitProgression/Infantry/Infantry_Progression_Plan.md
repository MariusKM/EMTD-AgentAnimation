# Infantry — Rank Progression Plan (L1 → L10)

> 10 levels of rank progression for the EMTD Infantry unit. Same character, same pose, same framing, progressively richer kit + visibly mightier silhouette in the plate tiers.
>
> Companion to [Infantry.md](Infantry.md) (L1 base spec) and [CLAUDE.md](CLAUDE.md) (pipeline + visual learnings).

---

## Locked design rules

- **Weapon archetype = spiked mace.** Never swapped. Evolves: wooden spiked (L1-L3) → wood + iron banding (L4-L6) → flanged steel (L7-L9) → gilt-flanged ornate (L10). Mightier and more intricate at higher tiers.
- **Shield = round.** Never heater / kite / tower. Material evolves: plain wood (L1-L3) → iron-rimmed wood (L4) → steel-faced (L5-L7) → ornate steel embossed boss (L8-L9) → gold-rimmed cross-emblem steel (L10).
- **Livery rule.** Mustard+red split tunic dominant L1-L4 → chest band only L5-L7 → skirt-only narrow band L8-L9 → gone L10.
- **Silhouette mightiness rule (LOCKED).** Each level in the plate tier (L7-L10) must visibly **increase the unit's silhouette mass and stature** vs the prior level — bulkier pauldrons, taller helm, broader cuirass volume, tassets that flare outward, larger shield. Don't just swap surface ornaments; bump volumes. The L10 silhouette should clearly read as "bigger and mightier" than the L7 silhouette at thumbnail scale, even before color is registered.
- **Detail Economy rule (LOCKED 2026-05-07 per AD FeedbackV0).** Higher levels gain richness via VOLUME and SILHOUETTE SHAPE, not via stacked surface ornament. Rely on shapes and silhouettes to make units feel richer and more elaborate, NOT on sculpted micro-details / engraving / filigree. Cut: engraved cuirass medial scrollwork, pauldron+tasset filigree etching, lion's-head emboss, micro-rivet runs. Keep: volume bumps (taller helm, wider pauldrons, fewer-but-wider tassets, longer/flaring skirt edges), material changes (wood → iron → steel → gold).
- **Belt-kit minimalism (LOCKED 2026-05-07 per AD FeedbackV0).** Hip pouch at L2 is the ONLY belt accessory carried through the chain. **Dagger / knife sheath REMOVED entirely** (was at L3 — dropped per AD "remove the dagger entirely and keep the pouch"). No additional pouches, no tool-loops, no tags.
- **Helm earlier (LOCKED 2026-05-07 per AD FeedbackV0).** First metal headpiece arrives at **L3 (steel skullcap under the mail coif)** — not L7. AD: "I'm slightly bothered by the fact that the helmet only appears around level 7. I would introduce the helmet much earlier, maybe starting around level 3." The L7 sallet then becomes a *bigger* helm rather than the *first* helm — fits the silhouette-mightiness ramp better.
- **Boot armor split (LOCKED 2026-05-07 per AD FeedbackV0).** AD: "The armored pieces on the boots could also be split into smaller upgrades and distributed earlier." Split: iron toe-cap strip at **L4** → ankle plates at **L6** → full sabatons at **L8**. Three smaller adds instead of one big L6 sabaton step.
- **Full-arm scale-mail at later levels (LOCKED 2026-05-07 per AD FeedbackV0).** AD: "The chainmail being sleeveless feels odd. For the later levels, I would extend it to fully cover the arms." Scale-mail sleeves grow from short (mid-bicep, L4) → full bicep-to-wrist (L5+); from L5 onward the vambraces sit ON TOP of the scale-mail, no exposed bicep gap.
- **Pose locked.** L1 stance held verbatim L1-L10 (mace forward+down, shield up at chest, three-quarter view). Framing locked except possibly L10 if a horned/crested helm needs more headroom (decide at plan-test time).
- **Chained composite-only pipeline.** Every level uses Rule-2 chained input (prior composited keeper + L1_Base scale anchor). No Rule-1 anchored fallback prompts at tier breaks. **Composite + denoise is the mandatory drift-mitigation step between every level lock and the next chain step** — see CLAUDE.md § Pipeline. (Decision: tier-break drift mitigation is delegated to the composite step at locked low/high `--dilate 15-20`, not to a fresh-from-L1 anchored prompt. Simpler chain shape; one prompt file per level.)

---

## Tier structure

| Tier | Levels | Theme | Silhouette read |
|------|--------|-------|-----------------|
| **Tier 1 — Levy** | L1 — L3 | Cloth + leather + mail coif. Wooden weapons. | Beefy footman, mail-hooded. Same envelope as L1. |
| **Tier 2 — Footman** | L4 — L6 | Iron-banded + scale shirt + reinforced shield. | Slightly bulkier — armored sleeves, iron banding adds visual weight. |
| **Tier 3 — Sergeant** | L7 — L9 | Plate cuirass + closed helm + steel pauldrons. | Visibly larger — broad pauldrons, taller helm, plate volume. |
| **Royal — Champion** | L9.5 — L10 | Gold-trimmed plate + crested/horned helm + ornate gilt mace. | Mightiest — flaring tassets, crested helm extends silhouette upward. |

L4 and L7 are **tier-break levels** — large delta. Composite step uses `--dilate 15` (or 20 for L7's plate cuirass swap).

---

## Per-level beat list

### L1 — Conscript Levy (BASE — no generation)
Source of truth: `Refs/L1_Base.png`. Mail coif, sleeveless mustard+red livery tunic, leather bracers, blue trousers, brown boots, wooden spiked mace, plain round wooden shield with central steel boss. See [Infantry.md](Infantry.md) for full spec.

---

### L2 — Outfitted Levy (within-tier delta from L1 — revised 2026-05-07 per AD detail-economy + observed rivet bleed-through)
**Visible adds (3):**
1. **Quilted brown leather under-tunic** showing as short sleeves emerging from under the livery tunic — covers the bare biceps from shoulder to mid-bicep. Matte warm-brown leather, soft quilted cross-stitching pattern, NOT studded, NOT armored.
2. ~~**Iron rivets along the rim of the round wooden shield**~~ — *(REMOVED 2026-05-07 per AD detail-economy + observed bleed-through. Was originally 8 round-head rivets; revised to 4 cardinal-point rivets; then dropped entirely after generation testing showed the rivet pattern was bleeding through to other surfaces — appearing as decorative rivets on the helmet brow band and elsewhere. L2 now has 3 visible adds; the L4 continuous iron rim band cleanly introduces iron-on-shield from a rivetless starting point.)*
3. **Wider brown leather waist belt** *replacing* the rope cord — single thick warm-brown leather belt with a square iron buckle centered at the front. The rope cord is fully removed.
4. **Hip pouch** — small rectangular brown leather pouch with flap closure on the anatomical-RIGHT hip (viewer-LEFT side), three inches tall, secured by a small brass stud.

**Preserve emphatically**: mail coif, full beard, livery tunic split panels, mace + shield position, bracers (now sit OVER the new leather under-tunic sleeves).

**Negative emphasis**: do NOT remove or shrink the livery; do NOT reshape the wooden mace into iron-banded (that arrives at L4); do NOT add scale-mail body coverage (Tier 2).

---

### L3 — Veteran Levy (within-tier — revised 2026-05-07 per AD FeedbackV0)
**Visible adds (4):**
1. **Steel skullcap under the mail coif** *(LOCKED 2026-05-07 per AD "introduce the helmet much earlier, maybe starting around level 3")* — a low-domed cool silver-gray steel cap covers the top of the head, sitting UNDER the existing mail coif drape. The mail coif still wraps the head/scalp; the steel skullcap is visible as a small cool-gray dome at the very top where the coif's mesh thins out, plus a thin steel rim band visible at the brow line above the eyebrows. First metal headpiece on the unit. Two small iron rivets at the temples. Not a full helm yet — the L7 sallet is the first full helm and reads visibly larger.
2. **Single steel pauldron cap on the anatomical-RIGHT shoulder** (mace-arm) — small rounded steel cap (~4" diameter), cool silver-gray, riveted at the seam to a leather strap that runs across the chest under the livery. Mace-arm only — shield-arm shoulder remains uncovered.
3. **Mace haft wrapped with leather grip cord** — diagonal warm-brown leather cord wrapping the upper third of the mace haft where the hand grips, secured with a small iron pin at each end.
4. **Reinforced shield** — the wooden shield gains four short iron strap-bands radiating from the central boss outward to the rim (cross-pattern, four arms of the cross). Iron is dark cool gray, strap width ~1 inch.

**REMOVED per AD feedback 2026-05-07**: the knife sheath at the anatomical-LEFT hip. AD: "I would remove the dagger entirely and keep the pouch." The L2 hip pouch on the anatomical-RIGHT remains as the only belt accessory through the chain.

**Preserve emphatically**: livery dominance, beard shape (the model loves to over-render beards into wild bushy beards — keep trimmed-short language explicit), pose, L2 hip pouch on the anatomical-RIGHT.

---

### L4 — Conscript Sergeant (TIER BREAK — Tier 2 entry; chained composite from L3 — revised 2026-05-07)
**Visible adds (5):**
1. **Iron banding on the mace head** — three iron rings circle the wooden mace head between the spike rows. The wooden mace head itself stays warm-brown wood; the spikes stay steel; the new iron rings are dark cool-gray steel banding.
2. **Scale-mail short sleeves** (chunky overlapping rounded scales — cool silver-gray steel, painted to match the mail coif spec) covering both upper arms from the shoulder down to mid-bicep, sitting OVER the L2 quilted leather under-tunic. The leather bracers stay — scale sleeves end at mid-bicep, leather under-tunic shows briefly between scale sleeve and bracer (~1" gap), then bracers wrap forearm to mid-forearm. **(Note: per AD feedback the sleeves grow to FULL bicep-to-wrist coverage at L5 — L4 is the short-sleeve introductory step only.)**
3. **Iron-rimmed shield** — replace the L2 iron rivets with a continuous **iron rim band** around the entire shield perimeter (~½" wide), giving the shield a clearly metalled silhouette. The L3 cross-strap iron bands remain. Wooden face still visible between the rim and the cross.
4. **Steel pauldron on the shield-arm side** matching the L3 mace-arm pauldron — both shoulders now have steel caps. Pauldrons are slightly larger than L3's (~5" diameter, riveted at the lower edge).
5. **Iron toe-cap strip on each boot** *(LOCKED 2026-05-07 per AD "boot armor split into smaller upgrades, distributed earlier")* — a single dark cool-gray iron strip wraps the FRONT of each boot toe (~1" tall × 2" wide), riveted at the seam. The brown leather body of the boot is otherwise unchanged. First boot armor; precedes the L6 ankle plates and L8 full sabatons.

**REMOVED 2026-05-07**: the L4 "steel chest-strap rivet plate" — surface ornament with low thumbnail readability per Detail Economy rule. The chest-strap-and-rivet read at L4 was already noisy alongside the existing pauldron rivets and iron banding.

**Tier-break composite**: use `--dilate 15` and watch QC for face/coif drift.

**Preserve emphatically**: livery still fully dominant on the chest (do NOT cover with scale mail — scales are at the SLEEVES only at L4). Wooden mace HEAD shape unchanged. Round shield shape unchanged. L3 steel skullcap visible at the top of the head under the coif.

---

### L5 — Sergeant (within-tier — revised 2026-05-07)
**Visible adds (5):**
1. **Scale-mail sleeves extend to FULL bicep-to-wrist coverage** *(LOCKED 2026-05-07 per AD "the chainmail being sleeveless feels odd. For the later levels, I would extend it to fully cover the arms")* — the L4 short scale-mail sleeves (mid-bicep) now extend down past the elbow to the wrist, fully covering the arms in scale mail (chunky overlapping rounded scales per the scale-mail visual spec, cool silver-gray steel). The L2 quilted leather under-tunic is now hidden under the scale mail at the upper arm; only a thin band of leather shows briefly at the inner armpit. New steel vambraces (see #2) sit ON TOP of the scale mail at the forearm. No exposed bicep gap from L5 onward.
2. **Steel vambraces** *replacing* the leather bracers on both forearms — cool silver-gray steel cuffs wrapping wrist to mid-forearm, two visible rivets per cuff at the seam edge. The leather bracers are fully gone. Vambraces sit ON TOP of the new full-arm scale-mail sleeves.
3. **Steel-faced shield** — the wooden shield face is now covered by a thin steel skin (cool silver-gray, with the wooden grain replaced by a smooth painted-metal surface and faint vertical brushed-steel highlights). The L4 iron rim and L3 cross-strap remain as raised features. Central boss is now a domed steel boss (slightly larger than L1).
4. **Steel breastplate (partial — upper chest only)** — covers the upper chest from collarbone down to roughly the bottom of the sternum. Smooth cool silver-gray steel, slight medial ridge down the center. **The livery tunic remains visible BELOW the breastplate, fully covering the abdomen and waist** — livery now reads as a chest BAND between the breastplate (above) and the wide belt (below).
5. **Bevor / collar (small)** — a short cool silver-gray steel half-collar plate covering the front of the throat from collarbone up to the lower jaw line, sitting over the mail coif's front. Curves with the neck. Adds visible volume to the chest silhouette (silhouette mightiness rule).

**REMOVED 2026-05-07**: the L5 "mace head reinforcement plate" (a single steel band between spike rows) — surface ornament with low thumbnail read. The L4 iron banding rings already give the mace its banded read.

**Preserve**: mail coif still wraps the head/scalp; L3 steel skullcap visible at the top under the coif. Beard still visible below the bevor's lower edge.

---

### L6 — Veteran Sergeant (within-tier — revised 2026-05-07)
**Visible adds (5):**
1. **Full breastplate extension** — the L5 partial breastplate extends downward to cover the entire abdomen, ending at the waist where it meets the belt. Single piece, smooth steel, central medial ridge. Livery now reduced to a CHEST BAND visible only between the breastplate's upper edge and the bevor — narrow strip ~3" tall showing the red+mustard split.
2. **Tassets (steel hip plates) — short**: **2 wider rectangular steel plates** hanging from the waist belt at each hip *(REVISED 2026-05-07 per AD detail-economy — wider plates, fewer of them, NOT broken into many narrow lames)*, ~6" tall, ~6" wide, slight outward flare. Cover the upper thigh under the livery tunic hem. The livery tunic hem is now visible BETWEEN the breastplate's bottom edge and the tassets (red+mustard skirt band ~3" tall).
3. **Layered pauldrons** — the L4 single-disc pauldrons gain a second smaller disc layered ON TOP, riveted to the original. Each pauldron now reads as 2 stacked discs (silhouette mightiness rule — bumps shoulder volume).
4. **Steel ankle plates on the boots** *(REVISED 2026-05-07 per AD "boot armor split into smaller upgrades, distributed earlier" — full sabatons moved to L8; L6 gets ankle plates only)* — cool silver-gray steel ankle band wraps each boot at the ankle (~2" tall), articulated where the boot bends, riveted to the leather. The L4 iron toe-cap strip remains. Brown leather body of the boot still visible at the calf and across the foot. Full sabatons (toe + foot + ankle continuous steel) arrive at L8.
5. **Mace haft iron reinforcement strip** — a single thin iron strap runs along the length of the mace haft from the head down to the leather grip wrap, riveted at three points. Wooden haft underneath still warm-brown.

**Silhouette check**: L6 should clearly read as bulkier than L5 at thumbnail (taller pauldrons, longer body coverage from breastplate + tassets).

---

### L7 — Footman Sergeant (TIER BREAK — Tier 3 entry — revised 2026-05-07)
**Visible adds (5):**
1. **Open-face steel sallet helm** *replacing* the L3 steel skullcap (now the "first full helm" rather than the "first metal headpiece" — L3 already introduced the skullcap per AD feedback). Cool silver-gray steel domed helm with a forward-projecting brim, riveted at the lower seam. Reads visibly LARGER than the L3-L6 skullcap (silhouette mightiness — the upgrade is volume, not just material). The mail coif drape is still visible at the back of the neck and shoulders, framing the rear of the helm. Face fully visible (no visor yet) — eyes, nose, mustache, beard all clearly visible under the brim.
2. **Reinforced cuirass** — the L6 breastplate gains a layered ridge at the medial line and a single subtle horizontal seam across the abdomen *(REVISED 2026-05-07 per AD detail-economy — reduced from 3 horizontal articulated lames to 1 simple seam; the "articulated banding" pass was reading as fragmented surface detail)*. Adds modest depth and weight to the chest silhouette without breaking the cuirass into many small plates.
3. **Steel gauntlets** *replacing* the bare hands — articulated steel finger-plates, knuckle-rivets, cool silver-gray. The L5 vambraces extend INTO the gauntlets at the wrist (continuous metal forearm-to-fingertip).
4. **Flanged steel mace head** *replacing* the wooden head — the mace head is now solid steel with 6 vertical flanges (raised steel ribs) instead of the wooden bulb + spike configuration. Cool silver-gray steel, ~slightly larger than the wooden head was (silhouette mightiness rule). The wooden haft remains, leather grip wrap remains, but the head is now metal.
5. **Larger round shield with embossed boss** — the round shield grows by ~10% in diameter (silhouette mightiness rule), the steel face gains an embossed center boss with a sun-burst pattern radiating from the central dome. *(REVISED 2026-05-07 per AD detail-economy + rivet bleed-through fix: the "iron rim band gains visible studs" beat REMOVED — surface-stud accumulation directly conflicts with "embossed studs ... use clean wider band instead" and was amplifying the rivet bleed pattern through the chain. The shield growth + embossed sun-burst boss carry the L7 upgrade as silhouette + material change.)*

**Tier-break composite**: use `--dilate 20`. Watch QC for face / coif drift — the helm-on-coif overlap is less delicate now that the L3 skullcap already established the head-armor schedule (the model has a primed expectation of "metal on top of head"), but still bump the dilate to handle the silhouette change from skullcap to full sallet.

**Preserve**: full beard, blue trousers (under the now-fuller plate covering most of the upper body), the round shield shape, full-arm scale-mail under the vambraces (no bicep gap from L5+).

---

### L8 — Footman (within-tier — revised 2026-05-07)
**Visible adds (5):**
1. **Half-visor on the helm** — a steel half-visor extends from the brim of the L7 sallet downward to cover the upper half of the face from forehead to nose-bridge, leaving eyes visible through a horizontal slit. Same cool silver-gray steel.
2. **First gold accent — gold trim band around the helm circumference** *(MOVED from L9 to L8 per AD detail-economy — gold rivets at L8 didn't read at thumbnail; a clear gold band on the helm body lands the first gold cleanly)*. Buttery warm gold band wrapping the helm at the brim line, ~1" tall, distinct from the steel body of the helm. First gold on the unit. (Reverses the deprecated "gold rivets at the pauldron seam" L8 add — that beat had a soft fail per Archer CLAUDE.md § F drift table; switched to a more prominent gold beat.)
3. **Larger pauldrons (3-lame)** — the L6 2-disc pauldrons add a third lower lame extending down the upper arm to cover the bicep. Pauldrons now read as 3 stacked plates and visibly extend the shoulder silhouette wider (silhouette mightiness rule).
4. **Tassets extend longer — wider plates, fewer lames** *(REVISED 2026-05-07 per AD detail-economy — was 3 lames per tasset; now 2 wider lames per tasset)* — the L6 short hip tassets grow downward to cover mid-thigh, with **2 vertical wider lames per tasset** (NOT 3 narrow lames), slight outward flare at the lower edge. Skirt band of livery is still visible between cuirass and tassets but narrows to ~2" tall.
5. **Full steel sabatons on the boots** *(LOCKED 2026-05-07 per AD "boot armor split into smaller upgrades" — final boot-armor stage)* — the L4 iron toe-cap and L6 ankle plates are now joined by continuous cool silver-gray steel covering the front of the foot (toe + foot top + ankle continuous metal plate). Brown leather body of the boot still visible at the calf above the sabaton and at the heel. Full sabaton silhouette achieved across L4-L6-L8 in three smaller adds rather than one big L6 step.

**REMOVED 2026-05-07 per AD detail-economy**: the "engraved cuirass medial ridge" (fine-line scrollwork engraving). Surface ornament with low thumbnail readability. The cuirass already gains volume at L7 (medial ridge + horizontal seam) — adding scrollwork on top was decoration accumulation.

---

### L9 — Knight-Sergeant (within-tier — revised 2026-05-07)
**Visible adds (4):**
1. **Closed visor on the helm** — the L8 half-visor extends downward to fully close the face. Visor has a horizontal eye slit and small breathing perforations. Face is now CONCEALED (no skin / hair / eyes / beard visible above the bevor).
2. **Modest horns on the helm** — pair of small upward-curving steel horns rising from the temples of the helm, ~6" tall, swept slightly outward and back. Cool silver-gray steel matching the helm. Adds vertical silhouette extent.
3. **Gold-trimmed shield rim** — the L7 iron rim is replaced by a warm gold rim band (~½" wide) all around the shield. The L8 embossed boss gains a small gold ring around the central dome.
4. **Tassets flare wider at the bottom edge** *(VOLUME bump per Detail Economy / silhouette-mightiness rule, replaces deprecated filigree pass)* — the L8 tassets gain a more pronounced outward flare at the lower edge (each lame's bottom edge angles ~10° outward), broadening the hip silhouette. The lames themselves remain 2-per-tasset wider plates (no return to thin multi-lame fragmentation).

**REMOVED 2026-05-07 per AD detail-economy feedback**: the "Filigree on the pauldrons + tassets" pass (fine-line gold scrollwork etched on each pauldron and centered on each tasset). Surface ornament that does not read at thumbnail scale per AD's note: "rely more on shapes and silhouettes to make the units feel richer and more elaborate, rather than sculpted details and filigree."

**Note on gold helm trim**: moved to L8 (see L8 revision). At L9 the gold accents are = helm trim band (carried from L8) + shield rim + boss ring (new). No additional pauldron/tasset filigree.

**Face concealed at L9 — silhouette has to do all the character work from here on.** Lean into mightiness via horns + tasset flare + shield size — NOT via surface ornament.

---

### L9.5 — Royal-Grade Bridge (between L9 and L10 — revised 2026-05-07)
**Visible adds (3):**
1. **Gold-spiked horn caps** — the L9 modest horns gain pointed gold spike tips at each horn's apex (~1.5" gold cones).
2. **Gold cross emblem on the shield face** — a four-armed cross centered over the L9 boss, painted in warm gold inlay against the steel face.
3. **Horns grow taller and more sharply curved** *(VOLUME bump replaces the deprecated knuckle-plate + cuirass edge piping passes per AD detail-economy)* — the L9 ~6" modest horns extend to ~8-9" with a more pronounced outward+back sweep. Reads as a clearly "rising rank" silhouette beat preparing for the L10 crested helm.

**REMOVED 2026-05-07 per AD detail-economy feedback**:
- "Gold gauntlet knuckle-plates" (raised gold knuckle plates, one per knuckle): surface ornament with low thumbnail read at gauntlet scale.
- "Gilt edge trim on the cuirass + tassets" (fine gold edge line all the way around perimeter of the cuirass + tassets): per-edge gold piping is the canonical detail-economy "first cut" item per the AD feedback.

Gold accents at L9.5 = helm trim band (L8) + horns gilt tips (new) + shield rim + boss ring (L9) + shield gold cross (new). Cleaner gold map; volumes carry the upgrade.

---

### L10 — Royal Champion (chained from L9.5; single-image input — L1_Base anchor dropped to allow horn / crest extent — revised 2026-05-07)
**Visible adds (5):**
1. **Tall crested helm** — the L9.5 horned helm grows a central upward crest between the horns (a vertical fluted gold spike, ~8" tall, rising from the helm apex). Horns themselves are already taller from L9.5; at L10 they reach final height. Helm reads visibly TALLER than L9.
2. **Gilt-flanged steel mace head** *(SIMPLIFIED 2026-05-07 — chased filigree along flanges removed per AD detail-economy)* — the L7 flanged steel mace head converts to buttery-warm gold along each flange's leading edge with the recessed flange-channel staying cool steel. Reads as "gold-flanged" at thumbnail without surface filigree. Wooden haft remains brown but gains a single gold end cap at the top of the haft (just below the head). Per-flange-tip spiked finials are dropped; the ornate read comes from the gold material change, not from added micro-spikes.
3. **Heavy pauldrons (4-lame)** *(SIMPLIFIED 2026-05-07 — lion's-head emboss removed per AD detail-economy)* — the L8 3-lame pauldrons grow a fourth uppermost layer (smaller cap on top of the existing stack). Pauldrons visibly broader than L9 (silhouette mightiness rule — peak shoulder width). The volume bump IS the upgrade; no sculpted lion's-head motif, no figural emboss. Plain steel with no surface ornament beyond the simple lame-stack reads.
4. **Tassets flare wider and longer** *(SIMPLIFIED 2026-05-07 — per-lame gold piping removed per AD detail-economy)* — the L8 tassets extend further down (mid-thigh → just-above-knee) and flare further outward at the bottom edge, with the L9 outward-angled flare exaggerated. Lames remain 2-per-tasset wider plates (no return to thin fragmentation). Livery gone — tassets are now plate only. NO per-lame gold edge piping; the volume + flare carry the upgrade.
5. **Royal shield embellishment** — the L9.5 cross emblem is now raised and gilded fully (gold cross stands proud of the shield face), the central boss is a full gold dome with a small ruby (red gem) at center, the rim is a thick gold band (no embossed gold studs — clean wide band).

**Detail-economy lock**: L10 is the maximum-richness level and therefore the highest risk for AD's "too much detail" feedback. Per the new rule, ornate read comes from MATERIAL (gold replaces steel on the mace head, shield boss, helm crest) and VOLUME (taller helm, broader pauldrons, longer tassets, larger shield) — NOT from sculpted motifs (lion's-head, chased filigree) or per-edge piping. When a future iteration adds back any of these decorations, log it as a deliberate exception in `_meta.history`.

**Framing**: drop the L1_Base scale anchor for L10 generation — single-image input only — to let the model render the new vertical extent (gold crest + taller horns) without compressing it back into the L1 framing envelope.

---

## Continuity anchors held across all 10 levels

- **Beard** — full dark-brown beard present L1-L8 (visible under open helm). Concealed L9-L10 by closed visor. Never trimmed away to clean-shaven; never grown to wild bushy beard.
- **Pose** — mace forward+down on viewer-left, shield up at chest on viewer-right, three-quarter view, slight forward lean. Locked verbatim L1-L10.
- **Round shield** — L1-L10. Never heater / kite / tower.
- **Spiked / flanged mace** — L1-L10. Never sword / hammer / axe.
- **Blue trousers** — L1-L10 (visible at the calf even when tassets cover the thigh).
- **Brown boots base** — L1-L10. Steel sabatons added L6+ but the brown leather body remains visible.
- **Mail coif** — L1-L6 (back-of-neck drape stays visible L7+ even after the helm is added on top).

## Vocabulary risks (Infantry-specific)

- **Mace head** — say "wooden bulbous head with iron spikes" (L1) / "wooden head with iron banding" (L4) / "flanged steel mace head" (L7+) / "gilt-flanged ornate mace head" (L10). Never just "mace" — model defaults to a generic morningstar shape.
- **Round shield** — always "round wooden shield" or "round steel-faced shield with central boss" — never just "shield" (model leans heater).
- **Beard** — say "full short-trimmed dark-brown beard" — never just "beard" (model grows it bushy).
- **Sallet** vs **kettle helm** — at L7 the L7 helm is "open-face steel sallet helm with a forward-projecting brim" (NOT kettle helm — kettle's brim is wider all-around and reads more peasant-conscript than sergeant).
