# P1 — Measuring Arc Slash (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Architect.png`
> Concept: [concepts.md](../../concepts.md) — P1 (signature blade-shape VFX recommendation)

## Notes for this concept

- **Signature character VFX** — the caliper-protractor blade traces a primary glowing arc, and from it an **intricate compass-and-dividers technical drawing** blooms outward in midair like a draftsman's working architectural diagram (concentric arcs at different radii, intersecting construction circles, radius lines from a center point, tick-mark notches, a small geometric construction triangle). No other hero on the roster has this visual read. Color is **warm ink-blue** (NOT green — keyer would eat it).
- **VFX intricacy iteration 2026-04-27** — first-pass output rendered the VFX as a single clean tick-marked arc that read as a speedometer/protractor (too basic). The user wanted it upgraded to feel like an intricate architectural/technical drawing rendered by compass and dividers. Action and Constraints now describe a multi-element draftsman's diagram: nested concentric arcs, two small overlapping circles, radius lines from a center point, tick marks, and a small geometric triangle — anchored to "fine clean ink-blue lines like a draftsman's working diagram." Constraints explicitly negate the simple-arc fallback ("not a single simple speedometer-style arc") so the model doesn't revert.
- **Vocabulary cleanup after second-attempt rejection 2026-04-27** — the upgraded VFX prompt hit a silent safety-filter rejection (COMPLETED, ~0.057s `inference_time`, empty logs, 400 "error parsing the body"). Suspected triggers were `construction` (×2 in `construction circles` + `construction triangle`), `compass-and-dividers` (×2), `vesica-piscis-style overlap`, and `constructs itself` in Sound. Rewrite uses safer drop-in vocabulary — `network of ink-blue diagram lines` for the overall figure, `two small overlapping circles` instead of `intersecting construction circles forming a vesica-piscis-style overlap`, `small geometric triangle of line work` instead of `geometric construction triangle`, `the geometric diagram appears in midair` instead of `constructs itself`. Intricate-VFX intent preserved with no `construction` / `vesica-piscis` / `compass-and-dividers` tokens anywhere in the prompt body.
- **Refined fencer's timing** — the wind-up is a wrist pull, not a shoulder commit. Differentiates this from the heavy-arc slashes in the Diana / Wilhelm references.
- **Chin-lift + brow-arch** is the personality anticipation per the Architect doc — refined humor through attitude.
- **Anatomical hand discipline** — blade in **right hand** (anatomical), scroll bundle under **left arm** (anatomical). Per Seedance/Fat King 2026-04-16 lesson.
- **Static-camera prefix** — the horizontal arc is a fast motion that Seedance may misread as a camera pan; lock down up front.
- **Closed-mouth FFLF** — the smug closed-mouth smirk is the canonical resting expression and holds throughout (no open-mouth peaks).

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, voice,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the blade, scrolls unrolling, scroll bundle deforms,
glasses removed, open mouth, green sparkles, green arc trail, green VFX, mantle, cape, cloak
```

---

Subject:     static camera shot of a stocky scholarly architect character with chibi proportions, wearing a large red turban with a long red fabric side-tail draping down his right side, a fully extended brass folding drafting arm rising from the top of the turban, round gold-framed spectacles with a brown frame outer rim, thin waxed black handlebar mustache with curled tips, green tunic with rolled-up sleeves, brown leather cross-body harness with a brass center buckle, brown sturdy leather boots, holding a large silver caliper-protractor blade across his body in his right hand and cradling a bundle of three rolled tan parchment scrolls under his left arm, in his canonical pose with mouth closed in a smug smirk

Action:      from his canonical smug closed-mouth smirk he draws the
             silver caliper-protractor blade back toward his right
             shoulder with a refined wrist-pull anticipation while his
             chin lifts a small amount and his brow arches over the
             spectacles, then he sweeps the blade smoothly forward in a
             horizontal arc at chest height with the curved protractor
             edge of the blade leading, a fine glowing warm ink-blue
             elaborate ornate diagram trail follows the blade through
             the arc with many fine layered arcs at smaller radii nested
             inside the primary sweep, fine tick-mark notches at regular
             intervals along all the curves, small circles spaced along
             the trail, short radius lines from a central focal point on
             the trail, and a small triangle of fine line work near the
             focal point, like a detailed ornate protractor diagram with
             rich ornamental detail drawn in midair, the full trail
             lingers briefly and then fades, the blade decelerates back across his body to
             canonical position, his smug closed-mouth smirk widens a
             small amount with satisfaction on the settle.
             Expression arc: smug closed-mouth smirk -> arched brow with
             chin lift on the wind-up -> held smug focused look during
             the arc -> satisfied widened smug closed-mouth smirk on the
             settle. The long red turban side-tail lifts and trails the
             arc and settles, the brass drafting arm at the top of the
             turban bobs once on the wrist-pull anticipation, the rolled
             scrolls under his left arm shift slightly with the upper-body
             rotation, the curled mustache tips ride the chin lift.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music, a swift sharp whoosh of the blade through the air, a soft refined nose-inhale on the wind-up, a thin metallic shimmer as the geometric diagram appears in midair, soft cloth shift of the green tunic and red turban side-tail, a small satisfied nose-exhale on the settle, no voice no dialogue no music

Constraints: caliper blade in right hand always, scrolls under left arm always, no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly, the blade arc is a character-internal arm motion the camera does not move or pan or zoom, the trail VFX is warm ink-blue color not green and reads as an elaborate ornate detailed protractor diagram with rich ornamental complexity drawn in fine clean ink-blue lines not a single simple speedometer-style arc, the silver caliper-protractor blade stays in his right hand throughout never dropped, the bundle of three rolled scrolls stays cradled under his left arm throughout never unrolled never dropped fully intact, the gold-framed spectacles stay on his face never removed, mouth stays closed throughout, the turban has a long red fabric side-tail not a long flowing veil or trailing banner, no blue rim light no environment, seamless loop first and last frame match canonical pose with mouth closed, 6s
