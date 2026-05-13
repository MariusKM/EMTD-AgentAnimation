# P3 — Apple Load & Fire (Seedance 2.0)

> Power movement | 7s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Merchant.png`
> Concept: [concepts.md](../../concepts.md) — P3 (food-ammo Silviu flavor: pulls apple from basket, loads it down the muzzle, fires)

## Notes for this concept

- **Silviu food-ammo flavor done literally** — he physically pulls a red apple out of his basket, stuffs it down the muzzle of the blunderbuss as ammunition, and fires it forward. Comedic Supercell-tone showmanship.
- **Multi-beat — discrete timecoded segments are mandatory** per the Architect 2026-04-27 lesson. Beat sequence is enumerated in Action.
- **Anatomical hand discipline + hand-release risk** — right hand on forward foregrip stays anchored throughout (always-hold lead Constraint). The **left hand on rear stock** releases for the basket reach, returns for the brace + fire, then stays anchored through the recoil and settle. Constraints: "left hand returns to the rear wooden stock by 4 seconds and stays there for the rest of the loop."
- **Static-camera prefix** — multi-beat motion + over-shoulder reach + diagonal-up gun is high motion that Seedance may misread as a camera move; lock down up front.
- **Apple silhouette anchor** — explicit Constraint that the apple is "a single bright red apple with a green stem and one small green leaf, round, smaller than a grapefruit" — preserves silhouette during the pull, the muzzle-stuff, and the fired projectile per the Architect P4 silhouette-preservation lesson.
- **Basket integrity** — basket has multiple apples in source PNG; net change over the loop is one apple removed. Multiple apples remaining in the basket make the -1 hard to spot on FFLF compare.
- **VFX color discipline** — warm yellow-orange muzzle flash + thick gray-white smoke puff (NOT green). Apple projectile is bright red.
- **Open-mouth peaks at the muzzle-stuff and at the fire** — comedic delight on stuffing the apple in, jolly laugh on fire. Closes back to canonical contented smile by t=loop-end.
- **Vocal direction** — hearty curious humming on the basket reach, a hearty "aha" chuckle on the apple pull, a jolly mischievous laugh on the muzzle stuff, a jolly hearty laugh at the fire. Per Merchant vocal direction 2026-04-30 — no actual words, wordless vocalizations only.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan, tilt up,
push in, dolly, environment, background scenery, talking, lipsync, actual speech, words,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the blunderbuss, gun changing hands, gun in one hand only,
multiple apples flying, apple cluster, apple morphing, apple becoming a ball, apple becoming a fireball,
basket falls off back, basket emptying entirely, food items changing shape,
long flowing feather plume, tall feather banner, feathers multiplying,
green sparkles, green glow, green smoke, green muzzle flash, green VFX,
mantle, cape, cloak, mouth stays open at end of loop
```

---

Subject:     static camera shot of a stocky jovial merchant trader character with chibi proportions, fair skin with rosy cheeks and a double chin, bright blue eyes, wearing a small fitted yellow cloth cap with a single short white feather tucked at the top and a thin blue cloth headband across the forehead beneath the cap, a green teal tunic, a wide brown leather belt with a large round red gem clasp at the center, crimson red trousers, heavy brown leather boots, a large woven tan basket backpack on his back overflowing with a bread loaf a ham hock a bunch of purple grapes and red apples visible above his shoulders, holding an ornate wood-and-metal blunderbuss across his body in a two-handed grip with his right hand on the forward foregrip on the viewer-left side of the image and his left hand on the rear wooden stock on the viewer-right side of the image with the barrel angled upward toward the viewer's left, in his canonical pose with a closed-mouth warm contented smile

Action:      from his canonical closed-mouth contented smile,
             (0.0-0.5s) his closed-mouth smile widens warmly with
             theatrical anticipation and a small chin lift,
             (0.5-1.5s) his left hand releases the rear wooden stock
             and reaches back over his right shoulder into the woven
             basket on his back, his right hand keeps the firm hold
             on the forward foregrip and angles the blunderbuss further
             upright with the muzzle now pointing diagonally up toward
             the upper-viewer-left,
             (1.5-2.0s) his left hand pulls a single bright red apple
             with a green stem and one small green leaf out of the
             basket and brings it forward into view,
             (2.0-3.0s) his left hand brings the red apple to the
             open mouth of the muzzle and stuffs the apple firmly
             down into the muzzle of the blunderbuss with a comedic
             deliberate loading push, the apple disappears down into
             the barrel, his expression opens into a wide open-mouth
             jolly mischievous laughing grin showing teeth at the
             moment of stuffing,
             (3.0-4.0s) his left hand withdraws cleanly from the
             muzzle and returns to the rear wooden stock and resumes
             the two-handed grip on the blunderbuss,
             (4.0-4.5s) both hands together lower the blunderbuss to
             a horizontal forward aim with the barrel now pointing
             forward toward the viewer, his eyes track forward along
             the barrel with focused jolly anticipation,
             (4.5-5.0s) the blunderbuss fires with a warm yellow-orange
             muzzle flash at the mouth of the barrel and a thick
             gray-white smoke puff billows forward toward the viewer,
             a single bright red apple projectile launches forward out
             of the muzzle and travels off into the upper-viewer-left,
             his expression opens into a wide open-mouth jolly
             laughing grin at the moment of fire,
             (5.0-6.0s) his stocky body rocks back from the recoil
             with a hearty wobble, his belly bounces, the gun barrel
             kicks up briefly, the gray-white smoke drifts up and
             forward and begins to fade,
             (6.0-7.0s) he settles back to the canonical two-handed
             across-body carry with the barrel angled upward toward
             the viewer's left, the smoke is fully gone, the apple
             projectile is fully out of frame, his expression closes
             back into a satisfied warm closed-mouth contented smile.
             Expression arc: closed-mouth contented smile -> warm
             widened closed-mouth smile with chin lift on the
             anticipation -> focused closed-mouth grin during the
             basket reach and apple pull -> wide open-mouth jolly
             mischievous laughing grin at the moment of stuffing the
             apple into the muzzle -> closed-mouth focused grin during
             the re-grip and aim -> wide open-mouth jolly laughing
             grin at the moment of fire -> jolly grin held briefly
             through the recoil -> satisfied warm closed-mouth
             contented smile on the settle.
             The white feather on the cap drifts as the head and body
             move and snaps back on the recoil, the blue headband
             stays put, the basket on his back jostles during the
             over-shoulder reach but stays attached, the bread loaf
             and ham hock and grapes and remaining red apples stay in
             the basket and do not change shape, exactly one apple is
             removed from the basket over the loop and the basket
             still has remaining apples and grapes and ham and bread
             at the end of the loop.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       a warm hearty curious wordless hum from the merchant on the basket reach, a hearty wordless aha chuckle on the apple pull, a jolly mischievous wordless laugh from the merchant as the apple is stuffed down the muzzle, a sharp deep wooden-and-metal blunderbuss firing report at the moment of fire, a jolly hearty wordless laugh from the merchant at the fire and through the recoil, a thick smoke whoosh as the puff billows forward, a soft creak from the woven basket backpack on the over-shoulder reach, a soft cloth shift of the green tunic, no actual words no actual speech no music

Constraints: no actual words no actual speech the merchant's vocal sounds are wordless hearty chuckles and jolly laughs and contented hums only no dialogue, blunderbuss in two hands at start and end, right hand on the forward foregrip always, left hand returns to the rear wooden stock by 4 seconds and stays there for the rest of the loop, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no tilt up, the multi-beat action is character-internal motion the camera does not move or pan or zoom or tilt, the apple is a single bright red apple with a green stem and one small green leaf round and smaller than a grapefruit and the apple silhouette stays clearly readable as an apple at every moment of the pull and stuff and projectile beats and never morphs into a generic ball or fireball or gem, the muzzle flash is warm yellow-orange and the smoke puff is gray-white not green not yellow-green not any green-tinted color and the smoke is fully faded by the end of the loop, exactly one apple is removed from the basket over the loop and the basket still has remaining apples grapes ham and bread at the end of the loop, the basket stays attached to his back throughout, the blunderbuss never leaves either hand at the brace and fire beats and never drops, the cap has only a single short white feather tucked at the top not a long flowing plume not a tall feather banner not multiple feathers, mouth opens for the muzzle-stuff peak and the fire peak and closes back to the canonical closed-mouth contented smile by the end of the loop, no blue rim light no environment, seamless loop first and last frame match canonical pose with the closed-mouth warm contented smile and the blunderbuss in the canonical two-handed across-body carry and no apple visible and no smoke visible, 7s
