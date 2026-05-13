# I1 — Breathing Baseline (Seedance 2.0)

> Idle movement | 4s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Merchant.png`
> Concept: [concepts.md](../../concepts.md) — I1 (mandatory breathing-only baseline, client direction 2026-04-22)

## Notes for this concept

- **Mandatory baseline idle** — the safe fallback the team can always pick. Strictly breathing-only, no character business.
- **Canonical pose preserved exactly** — closed-mouth warm contented smile, blunderbuss held across the body in the two-handed grip, no body turn, no head tilt.
- **Continuous ambient breathing pattern** per the 2026-04-30 Princess Sweet / Dragonwitch update — chest moves gently and almost imperceptibly throughout the loop in a continuous smooth rhythm with no discrete visible breath events. Avoid `slow deep breaths` / `single deep breath`. Constraints lead with the full ban list.
- **Only motion**: chest rise/fall ambient, tiny weight shift, occasional slow blink. White feather and blue headband drift minimally. Basket and food stable.
- **No I2 / I3 business** — no sway, no weight rocking, no gun heft, no head turn. Those are variants.
- **Closed-mouth FFLF** — held warm contented smile does not arc.
- **No nose-breath items in Sound** per CLAUDE.md 2026-04-28 lesson — use ambient cloth/wicker/leather sounds. Standard "soft natural calm ambient nose-breathing" framing per Princess Sweet I1 is acceptable as ambient activity.
- **Vocal direction (Merchant-specific 2026-04-30)** — even the breathing baseline gets a single soft warm contented closed-mouth hum partway through the loop so the merchant is not silent. No actual words, no full laugh — just a subtle "hmm" character touch. Audio must include the ambient cloth, wicker, and gun-wood SFX from the Sound field; previous version produced effectively-silent output, so SFX are described concretely (not "faint" / "almost imperceptible") to ensure the audio model commits to producing them.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
environment, background scenery, talking, lipsync, voice, realistic proportions,
photorealistic, static frozen image, flat lighting, blue rim light, cyan edge light,
blue edge glow, warped hands, warped face, extra arms, dropping the blunderbuss,
gun changing hands, gun in one hand only, long flowing feather plume, tall feather banner,
feathers multiplying, backpack contents morphing, food items changing shape, basket emptying,
head turn, head tilt, chin lift, brow arch, smile widen, body sway, body rock,
gun heft, gun lift, gun lower, free hand wave, free hand gesture, mouth opens,
green sparkles, green VFX, mantle, cape, cloak, deep breath, single big breath
```

---

Subject:     a stocky jovial merchant trader character with chibi proportions, fair skin with rosy cheeks and a double chin, bright blue eyes, wearing a small fitted yellow cloth cap with a single short white feather tucked at the top and a thin blue cloth headband across the forehead beneath the cap, a green teal tunic, a wide brown leather belt with a large round red gem clasp at the center, crimson red trousers, heavy brown leather boots, a large woven tan basket backpack on his back overflowing with a bread loaf a ham hock a bunch of purple grapes and red apples visible above his shoulders, holding an ornate wood-and-metal blunderbuss across his body in a two-handed grip with his right hand on the forward foregrip on the viewer-left side of the image and his left hand on the rear wooden stock on the viewer-right side of the image with the barrel angled upward toward the viewer's left, in his canonical pose with a closed-mouth warm contented smile

Action:      stands in his canonical pose exactly as in the source
             image in a natural relaxed idle state, his breathing is
             slow and calm and ambient with the chest moving gently
             and almost imperceptibly throughout the loop in a
             continuous smooth rhythm without any visible discrete
             breath events, a tiny weight shift settles slowly across
             the loop, gives a single slow blink partway through the
             loop, his expression holds the closed-mouth warm
             contented smile throughout, his right hand remains on the
             forward foregrip of the blunderbuss and does not move,
             his left hand remains on the rear wooden stock of the
             blunderbuss and does not move, the blunderbuss stays in
             the canonical two-handed across-body carry with the
             barrel angled upward toward the viewer's left absolutely
             still and unchanged.
             Expression: held closed-mouth warm contented smile, one
             slow blink. The white feather on the cap drifts almost
             imperceptibly with the ambient breathing, the blue
             headband stays absolutely still, the bread loaf and ham
             hock and grapes and apples in the basket stay absolutely
             still, the woven basket backpack stays absolutely still,
             the crimson trousers and green tunic drift minimally.
             At roughly 2 seconds into the loop he gives a single soft
             warm contented wordless closed-mouth hum from the merchant
             that lasts a brief beat and fades, the mouth stays closed
             during the hum.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       a soft cloth shift of the green tunic and crimson trousers from the ambient breathing, a soft wicker creak from the woven basket backpack on his back, a soft wooden creak from the ornate blunderbuss in his hands, soft natural calm ambient nose-breathing at a slow steady relaxed rhythm, a single soft warm contented wordless closed-mouth hum from the merchant partway through the loop, no actual words no actual speech no music

Constraints: no actual words no actual speech the merchant's vocal sounds are wordless contented hums only and there is one single brief hum partway through the loop no dialogue, the audio includes audible ambient cloth and wicker and wooden gun creak SFX throughout the loop the audio is not silent, no deep breaths no sharp breaths no quick breaths no short breaths no panting no audible inhales no audible exhales breathing is slow and calm and ambient and barely perceptible like a person standing relaxed at rest, blunderbuss in two hands always, right hand on the forward foregrip always, left hand on the rear wooden stock always, pure green chroma key 0x00FF00 background only, static camera no movement or zoom, the blunderbuss stays in the canonical two-handed across-body carry absolutely still and unchanged throughout, feet stay planted no stepping, no head turn no head tilt no chin lift no brow arch no smile widen no body sway no body rock no gun heft no gun lift no free hand wave no free hand gesture, breathing is a continuous smooth ambient rhythm with no discrete visible breath events, mouth stays closed throughout including during the hum, the cap has only a single short white feather tucked at the top not a long flowing plume not a tall feather banner not multiple feathers, the woven basket backpack stays on his back throughout and the bread loaf and ham hock and grapes and apples inside it stay in place and do not change shape and do not float out of the basket, no blue rim light no environment, seamless loop first and last frame identical to canonical pose with the closed-mouth warm contented smile and the blunderbuss in the canonical two-handed across-body carry, 4s
