# P4 — Poison Vial Reveal (Seedance 2.0)

> Power movement | 7s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Spy.png`

## Notes for this concept

- The **bubbling green liquid + green wisp** is the entire "this is dangerous" payload — if the vial reads as water or wine, the concept fails. Green-only constraint is in the Constraints line.
- The **sniff beat** is the critical personality anchor. If the model skips it, re-roll.
- Vial silhouette should be a small classic apothecary shape (narrow neck, bulbous body) — not a round flask or test tube.
- The vial is a new object introduced mid-animation — I2V models sometimes struggle to materialize new hand-held objects cleanly. May need iteration.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
environment, background scenery, talking, lipsync, voice, realistic proportions,
photorealistic, static frozen image, flat lighting, blue rim light, cyan edge light,
blue edge glow, warped hands, warped face, extra arms, duplicated weapon,
red liquid, clear liquid, water, potion bottle without liquid
```

---

Subject:     hooded rogue spy character holding a hand crossbow

Action:      lowers the crossbow slightly in his right hand, reaches his left
             hand into the hip leather satchel and produces a small glass
             apothecary vial filled with bubbling sickly purple liquid, with a skull 
             sign on the bottle and a faint purple wisp rising from its cork, tilts the vial so the
             liquid sloshes wickedly, brings it to his pointed nose and
             sniffs, his eyes widen with delight and he pulls back wearing a
             devious grin, waggles his thick dark eyebrows directly at the
             camera, then slips the vial back into the satchel and returns
             both hands to the crossbow in two-handed low-ready aim.
             Expression arc: sneaking grin -> gleeful reveal -> malicious
             satisfaction -> conspiratorial eyebrow -> sneaking grin. Hood
             follows head tilts, satchel swings.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       glass vial clink as he pulls it from the satchel, liquid sloshing inside the vial, sharp inhaled sniff, amused exhaled nose chuckle, no voice no dialogue no music

Constraints: pure green chroma key 0x00FF00 background only, static camera no movement or zoom, vial contents must be bright purple liquid only not green, no blue rim light no environment, seamless loop first and last frame match canonical pose, 7s
