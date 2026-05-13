# Herald

> Source (canonical FFLF, closed-mouth): `Source/Heroes Stylized/Herald.png`
> Open-mouth peak variant (mid-loop only, never FFLF): `Source/Heroes Stylized/mouth_closed/Herald_open.png`

**FFLF image convention**: Use the closed-mouth canonical (`Source/Heroes Stylized/Herald.png`) as the I2V input for every loop. The open-mouth wide-grin variant in the `mouth_closed/` folder is reserved as a possible mid-loop peak expression beat (e.g. shouting the proclamation) but is never the start/end frame. The folder naming is inverted from the convention used elsewhere — Herald's canonical IS closed-mouth and the variant in `mouth_closed/` is the open-mouth peak.

## Role
The kingdom's messenger and announcer — cheerful but bureaucratically stiff, the embodiment of "if the concept of bureaucracy took human form." Delivers royal proclamations with theatrical, jerky-eager flair.

## Physical Description
- **Build**: Medium-slim, composed-stately posture with bureaucratic stiffness
- **Skin**: Warm tan with rosy cheeks
- **Hair**: Dark brown, mostly hidden beneath hat
- **Expression** (canonical FFLF): Closed-mouth warm smirk-grin — friendly, eager, slightly self-important. NOT a teeth-baring beam. The wide open-mouth grin lives only in the peak variant for mid-loop use.
- **Eyes**: Brown, bright and friendly, looking forward

## Costume & Equipment
All elements below are classified as `worn armor (body-attached)` unless noted otherwise.

- **Hat** (worn): Blue beret/chaperon with a draped tail hanging to one side, decorated with a gold circular medallion on the front and a dark red feather to the side
- **Cloak** (worn): Short blue hooded shoulder cloak with the hood raised behind the head, falling to elbow length — NOT a long flowing cape. Use the concrete phrase to lock the silhouette per the garment-noun over-read rule.
- **Tunic** (worn): Gold/yellow tunic top with ornate pattern at the sash; red and gold vertical striped lower section reaching mid-thigh
- **Belt** (worn): Wide ornate gold belt with embossed scroll/wave pattern
- **Boots** (worn): Brown leather boots with buckle details
- **Held items**:
  - **Anatomical left hand** (viewer's right side of image): Large blue/dark-grey quill feather pen with silver nib — held up triumphantly. Classified as `held prop (hand-attached)` — needs always-hold Constraints clause in prompts.
  - **Anatomical right hand** (viewer's left side of image): Tan parchment scroll with two red wax seals — being presented forward at chest level. Classified as `held prop (hand-attached)` — needs always-hold Constraints clause in prompts. **Off-hand prop integrity**: the scroll's red wax seals must remain intact and in the same position at t=0 and t=loop-end (FFLF constraint). Concepts that visibly break the seals or fully unfurl the scroll are invalid as written.

## Color Breakdown
| Element | Primary Color | Secondary |
|---------|--------------|-----------|
| Hat/cloak | Royal blue | Gold medallion, dark red feather |
| Tunic upper | Gold/yellow | Ornate pattern |
| Tunic lower | Red and gold vertical stripes | — |
| Belt | Gold | Embossed scrollwork pattern |
| Quill | Dark blue/grey feather | Silver nib |
| Scroll | Tan parchment | Two red wax seals |
| Boots | Brown | Buckle details |

## Pose Description
Three-quarter view, body composed and stately with bureaucratic stiffness. **Anatomical left hand** (viewer's right side of image) holds the quill up high in a triumphant gesture. **Anatomical right hand** (viewer's left side of image) presents the sealed scroll forward at chest level. Feet planted, slight forward lean of the upper body only — composed presentation rather than bursting-forward enthusiasm. Reads as eager-to-announce in a slightly officious bureaucratic way, not as a hyperactive cheerleader.

**Hand convention reminder for prompts**: When writing Seedance/Kling prompts, "left hand" means the character's anatomical left (viewer's right side of the image) and "right hand" means anatomical right (viewer's left side of the image). Quill = anatomical left hand. Scroll = anatomical right hand.

## Weapon
- **Primary**: Large blue/dark-grey quill feather pen in the **anatomical left hand**; tan parchment scroll with two red wax seals in the **anatomical right hand**. The scroll is the canvas; the quill is the weapon.
- **Natural one-beat action**: Unfurl a small section of the scroll (quick downward flick to extend it without breaking the seals) → emphatic stabbing scribble with the quill across the paper → flourish the quill upward at the end. Fast but stiff/lanky movement — jerky bureaucratic energy, not grace.
- **Power move direction**: Bureaucratic comedy — the scribble is the "attack." Paper/ink-flick VFX in **black ink + tan parchment glyphs + small floating letter/seal-symbol motifs** (no green / no yellow-green — but Herald's natural VFX palette has no green collision risk, so standard green-chroma generation is fine; no blue-screen variant required). Per Silviu notes the quill is a homing projectile in gameplay — a flick-forward variant (quill darts forward like a thrown dart with a trailing ink streak) is on the table as an alternative power beat. Closed-mouth smirk-grin throughout, with the open-mouth peak available for the climax beat if desired.
- **Source of truth**: CSV `Default Attack Style` — not specified (non-combat role). Silviu notes — "Ranged caster who reads from a scroll to buff allies, while a quill acts as a homing projectile, rapidly attacking multiple targets or piercing through to the backline." The quill-as-projectile is the weapon action; the scroll-buff is the ability kit (ignore for power move per the client direction "power move = weapon action, not ability").

## Personality Keywords
Cheerful, theatrical, jerky-energetic, bureaucratic-comedic, eager-to-announce, slightly officious

## Prompt Fragment
```
medieval herald messenger character, blue beret hat with gold medallion on the front
and a dark red feather to the side, short blue hooded shoulder cloak with hood
raised behind the head falling to elbow length, gold-yellow tunic top with ornate
pattern, red and gold vertical striped lower section reaching mid-thigh, wide ornate
gold belt with embossed scrollwork, warm closed-mouth smirk-grin, holding a large
blue-grey quill feather pen up high in his anatomical left hand, presenting a tan
parchment scroll with two red wax seals at chest level in his anatomical right
hand, composed eager-to-announce bureaucratic pose
```

## Character Brief (Client)

> **Note**: Per client, the Hero Screen / Victory / Defeat animation descriptions below are **inspiration and a rough starting point only** — not a strict spec. Use them as signals for tone and intent; propose stronger ideas when they serve the character better.

**Role & Traits** — Lumbricus, Herald of the Emperor. Announces events, contests, and any edicts by his imperial majesty. Described as "if the concept of bureaucracy took human form."

**Hero Screen Animation** — He stands in a stiff, bureaucratic posture, quickly unrolls a small section of a scroll, and makes a swift, jerky scribbling motion with a quill.

**Movement Style** — Fast but stiff, lanky.

**Victory Animation** — Unrolls his scroll and scribbles down on it.

**Defeat/Death Animation** — Faints stiffly like a board backwards. Optional: drops scroll.

**Default Attack Style** — Not specified (non-combat role).
