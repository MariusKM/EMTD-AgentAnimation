# P5 — Geometric Flourish & Held Point (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Architect.png`
> Concept: [concepts.md](../../concepts.md) — P5 (one-rotation flourish + held pointing pose, drafting cross-hair VFX)

## Notes for this concept

- **One-rotation hand flourish, NOT a body pirouette** — per Fat Princess P4 lesson (2026-04-23) the words `twirl` / `spin` collapse into a full body rotation in Seedance. Use `rotates exactly once in his hand` and pin "the camera does not orbit and his body does not rotate only the blade turns in his hand" in Constraints.
- **Two distinct VFX**: (1) **an elaborate ornate concentric-ring diagram** trailing the blade through the rotation in warm ink-blue with rich ornamental detail (nested fine rings, tick-marks at regular intervals, small dot accents, radius lines from a central focal point, a small triangle of fine line work), and (2) **an intricate ornate measurement target diagram** that appears at the spot the blade indicates at the held pose, also warm ink-blue with rich ornamental detail (central focal point, cross-hair lines extending outward, a small ring around the center, tick-marks around the ring, radial line work outward), fading within a moment. Describe both as connected prose with conjunctions — never as em-dash separated lists (Section A5 rule from `Docs/PromptGuides/Seedance/seedance2_content_flags.md`).
- **VFX intricacy upgrade 2026-04-27** — first-pass output rendered both VFX as basic shapes (a clean ring trail and a simple cross-hair) that read as boring/under-detailed, same diagnosis as P1's first-pass speedometer arc. Action and Constraints now describe both VFX as elaborate ornate diagrams with rich ornamental detail. Same authoring pattern as P1 v4 — connected prose with conjunctions, no em-dash lists, vocabulary kept to safe adjectives (`elaborate`, `ornate`, `detailed`, `rich ornamental detail`). Constraints explicitly negate the simple-shape fallback (`not a single simple ring or basic cross-hair`).
- **Held pointing pose is the punch line** — the rotation is the setup, the pointing pose is where the smug arched-brow personality reads land.
- **Differentiates from New King P4 Guardian's Flourish** by being a **single tighter rotation** ending in a measurement-pose, not a multi-arc loose flourish returning straight to canonical.
- **Anatomical hand discipline** — blade in **right hand**, scrolls under **left arm**. Both held throughout.
- **Closed-mouth FFLF** — smug closed-mouth smirk holds and widens slightly on satisfaction.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, body pirouette, full body spin, character turning in place,
camera orbit, camera rotation, environment, background scenery, talking, lipsync,
voice, realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the blade, scrolls unrolling, scroll bundle deforms,
multiple rotations, blade flips end over end, glasses removed, open mouth,
green sparkles, green arc, green crosshair, green VFX, mantle, cape, cloak
```

---

Subject:     static camera shot of a stocky scholarly architect character with chibi proportions, wearing a large red turban with a long red fabric side-tail draping down his right side, a fully extended brass folding drafting arm rising from the top of the turban, round gold-framed spectacles with a brown frame outer rim, thin waxed black handlebar mustache with curled tips, green tunic with rolled-up sleeves, brown leather cross-body harness with a brass center buckle, brown sturdy leather boots, holding a large silver caliper-protractor blade across his body in his right hand and cradling a bundle of three rolled tan parchment scrolls under his left arm, in his canonical pose with mouth closed in a smug smirk

Action:      from his canonical smug closed-mouth smirk the silver
             caliper-protractor blade rotates exactly one full turn in
             his right hand in a tight controlled flourish at chest
             height in front of him, an elaborate ornate diagram trail
             follows the blade through the rotation in fine glowing
             warm ink-blue lines forming a detailed concentric ring
             figure with multiple fine ring traces nested inside each
             other, fine tick-mark notches at regular intervals around
             all the rings, small dot accents spaced along the trail,
             short radius lines extending from a central focal point
             outward through the rings, and a small triangle of fine
             line work near the center, like a detailed ornate
             circular protractor diagram with rich ornamental detail
             drawn in midair, the flourish completes and the blade
             settles into a held forward-pointing pose with the
             calipered tip extended forward and angled slightly down
             indicating a precise spot in the air at chest height in
             front of him, his chin lifts and his brow arches with smug
             satisfaction as he holds the measurement-point pose, an
             intricate ornate measurement target diagram appears at the
             spot the blade indicates with a small central focal point,
             fine cross-hair lines extending outward through the focal
             point, a small ring around the focal point, fine tick-mark
             notches around the ring, and short radial line work
             extending outward from the focal point, all in fine clean
             warm ink-blue lines like a detailed ornate target marker
             with rich ornamental detail drawn on a blueprint, and
             fades within a moment, his closed-mouth smirk widens a
             small amount with satisfaction, then he returns the blade
             smoothly across his body to canonical position. Expression
             arc: smug closed-mouth smirk -> arched brow on the
             flourish peak -> smug satisfied closed-mouth smirk during
             the held pointing pose -> settled smug closed-mouth smirk.
             The brass drafting arm at the top of the turban catches
             light through the rotation, the long red turban side-tail
             drifts with the rotation and settles, the rolled scrolls
             under his left arm stay locked and still, the curled
             mustache tips ride the chin lift.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music, a thin metallic shimmer as the blade rotates, a soft swift whoosh on the flourish, a thin warm chime as the measurement target diagram appears, a small refined nose-exhale on the satisfied smirk, soft cloth rustle of the green tunic and red turban side-tail, no voice no dialogue no music

Constraints: caliper blade in right hand always, scrolls under left arm always, no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly, the blade rotates exactly one full turn in his right hand the camera does not orbit and his body does not rotate or pirouette only the blade turns in his hand, the held forward-pointing pose is a character-internal arm extension the camera does not zoom or push in, the rotation trail VFX and the held-point measurement target VFX are warm ink-blue color not green and read as elaborate ornate detailed protractor-style diagrams with rich ornamental complexity drawn in fine clean ink-blue lines not a single simple ring or basic cross-hair, the silver caliper-protractor blade stays in his right hand throughout never dropped never flipped end over end, the bundle of three rolled scrolls stays cradled under his left arm throughout fully intact never unrolled never dropped, the gold-framed spectacles stay on his face never removed, mouth stays closed throughout, the turban has a long red fabric side-tail not a long flowing veil or trailing banner, no blue rim light no environment, seamless loop first and last frame match canonical pose with mouth closed, 6s
