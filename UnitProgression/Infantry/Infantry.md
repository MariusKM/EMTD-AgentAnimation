# Infantry — Base Character Spec (L1)

> Canonical L1 source: [Refs/L1_Base.png](Refs/L1_Base.png) — 1024×1024 native.
> All chained generations must preserve the elements below verbatim until a level explicitly upgrades them.

---

## Archetype

EMTD heavy footman in the same red+mustard livery as the Archer (shared faction palette). Beefier silhouette than the Archer — broader shoulders, thicker neck, heavier-set torso. Bearded. The signature visual differentiators from the Archer are: **mail coif at L1**, **spiked mace as primary weapon**, **round wooden shield as primary defense**.

## Pose (canonical L1 stance — to be matched at every level)

Three-quarter view, body angled approximately 15-25 degrees to the viewer's left so the character's anatomical right side faces camera. Weight planted evenly on both feet, slight forward lean.

- **Mace arm (anatomical-RIGHT, viewer-LEFT)**: extended forward and slightly DOWN, elbow bent ~120 degrees, hand gripping the haft of a wooden spiked mace just above the head, mace head hanging at roughly hip height angled down-left, knuckles visible to camera.
- **Shield arm (anatomical-LEFT, viewer-RIGHT)**: bent at the elbow, forearm angled across the body bringing the round wooden shield up to upper-chest / shoulder height. The shield's flat face presents toward the viewer at a slight three-quarter angle (not perfectly flat, not edge-on). Hand and forearm are concealed BEHIND the shield.

The pose reads as a calm guard stance — mace ready but not raised, shield up but not braced for impact.

## Face

- Chiseled chibi jawline, prominent slightly hooked nose, thick dark-brown eyebrows with a stern furrow.
- Dark brown beard — thick, full, covering the chin and lower cheeks; reaches the upper neck. Trimmed short on the cheeks (not bushy or wild).
- Dark mustache continuous with the beard, covering the upper lip but not extending past the corners of the mouth.
- Mouth set in a flat closed-mouth stern expression (no smile, no snarl).
- Large warm-blue eyes (steel blue, slightly cool) with single bright catchlight in each iris and visible whites.
- Warm peachy-tan skin tone, soft rosy blush on the cheeks above the beard line.
- Dark brown short hair — visible only as a thin fringe at the forehead under the front edge of the mail coif.

## Hood / head covering

**Mail coif (already present at L1)** — chunky overlapping rounded scale-shaped plates in cool silver-gray steel covering the entire scalp, ears, and neck down to the collarbone. The coif drapes around the shoulders forming a broad cowl-like collar. Frames the face in an open oval — forehead fringe visible, full beard visible, ears concealed.

The L1 mail coif is **scale-mail** (chunky overlapping scales — Archer scale-mail spec § Visual Anchors F applies), NOT chainmail rings. NEVER describe as chainmail / fine ring mesh / interlocking metal rings.

## Torso garment (LIVERY — strongest preserve element)

**Sleeveless mustard-yellow tunic** with a **vertical crimson-red center panel** running collar to hem AND the **anatomical-right side of the tunic painted solid red** (split livery: viewer-LEFT half of the tunic chest is solid red, viewer-RIGHT half is mustard yellow with the red center stripe — the read at thumbnail scale is the red+mustard split livery).

- Simple round neckline.
- Hem reaches mid-thigh.
- Bare athletic biceps exposed from the shoulder down.
- Rope/cord belt at the waist (light brown twisted rope, simple knot at front).

**Livery rule** (parallels Archer § Visual Anchors A): the red+mustard split tunic is the strongest faction-identity anchor. Must remain visibly dominant on the chest L1–L4. Migrates to chest band L5–L7. Reduces to skirt-only band L8–L9. Disappears under full plate at L10.

## Arms

- **Bare biceps** at L1 (no sleeves).
- **Brown leather bracers** wrapping both forearms wrist to mid-forearm. Matte warm-brown leather, single visible cross-strap binding per bracer, identical on both arms.
- Both hands bare warm peachy-tan skin.

## Legs

- **Dark blue / muted steel-blue trousers**, knee-length, slightly loose at the cuff.
- **Chunky warm-brown leather boots**, mid-calf height, darker folded ankle cuff at the top, wide flat soles.

## Weapon — spiked wooden mace (anatomical-RIGHT hand)

- Heavy wooden haft, warm-brown finish, ~hand-and-a-half length.
- Bulbous wooden mace head at the striking end, painted slightly darker brown than the haft.
- **Six visible iron spikes** protruding from the head — pyramidal/conical steel spikes, cool gray steel, arranged radially around the head with a single spike on the top apex.
- Held with the haft in the hand at the level of the head/upper coif and the mace head dangling at hip height (see Pose).
- Weapon evolution rule (LOCKED): the mace is the unit's signature weapon and is **never replaced**. It evolves with armor: wooden spiked (L1-L3) → reinforced wood + iron banding (L4-L6) → flanged steel head (L7-L9) → ornate gilt-flanged steel with chased detail (L10). See Progression Plan.

## Shield — round wooden buckler-style (anatomical-LEFT hand)

- Round wooden shield, ~24" diameter, warm-brown wooden planks visible as faint vertical grain.
- **Central steel boss** — small round dome of cool gray steel at the center, ~3" diameter.
- Plain rim, no metal banding at L1, no painted heraldry.
- Held at chest/shoulder height with the face presented to the viewer at three-quarter angle (see Pose).
- Shield evolution rule (LOCKED): round shape preserved L1–L10 (NEVER swap to heater / kite / tower). Material/ornament evolves: plain wood (L1-L3) → iron-rimmed wood (L4) → steel-faced (L5-L7) → ornate steel with embossed boss (L8-L9) → gold-trimmed steel with cross emblem (L10).

## Framing / scale (canonical numbers — LOCKED, measured 2026-05-06)

`Refs/L1_Base.png` is **1024×1024 native** (downscaled from a 2048×2048 source — backup at `Refs/L1_Base_2K.png`). Measured framing numbers (alpha-aware bbox over the character):

- Canvas: 1024×1024
- **Vertical fill: 66.80%** (~684px tall)
- **Top margin: 16.60%** (~170px)
- **Bottom margin: 16.60%** (~170px) — character is vertically centered
- **Horizontal fill: 60.84%** (~623px wide — mace + shield extend the envelope wider than the bare-figure silhouette)
- **Left margin: 18.26%** (~187px)
- **Right margin: 20.90%** (~214px)

These numbers must be reproduced pixel-for-pixel by every chained generation. ±5% drift on vertical fill or top margin is a soft fail; flag and consider re-rolling.

Note: the Infantry's vertical fill (66.8%) is lower than the Archer's (74.7%) because the Infantry's source crop has more headroom and footroom. Don't try to bump it to match Archer — the L1_Base framing IS the canonical envelope for this unit.

## Style / outline

Supercell / Kingshot stylized mobile game art, hand-painted digital illustration with soft painted shading and visible brushwork, warm subsurface skin, saturated rich colors, warm shadow tones never gray, soft painted highlights on metal and leather. Clean thin black silhouette outline around the entire character in deep warm brown-black. Clean white background — never describe as transparent.

## Color anchors (held across all 10 levels)

- **Mustard yellow** somewhere on torso/hip (tunic L1-L4, chest band L5-L7, skirt band L8-L9, gone L10).
- **Crimson red** somewhere on torso/hip — same migration curve as mustard.
- **Cool silver-gray steel** — mail coif (L1+), expanding to scale shirt → breastplate → ornate cuirass.
- **Warm-brown leather** — bracers, belt, boots, mace haft (most leather kit is replaced by metal in plate tier).
- **Brown wood** — mace head + shield (mace head retained as wood through L6, gilded steel L10; shield wooden L1-L3, steel-faced L5+).
- **Gold** — first appears L8 (pauldron rivets / shield boss embellishment), expands L9-L9.5, dominant L10.
- **Dark blue trousers** — held all 10 levels (the only hint of the Archer's olive-green trouser base shifted to a foot-heavy unit's blue).
