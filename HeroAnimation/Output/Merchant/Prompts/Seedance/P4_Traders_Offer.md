# P4 — Trader's Offer (Seedance 2.0)

> Power movement | 7s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Merchant.png`
> Concept: [concepts.md](../../concepts.md) — P4 (physical sales pitch — pulls apple from basket and offers to camera)

## Notes for this concept

- **Physical sales pitch** — he reaches into his basket, pulls out a fresh red apple, extends it forward toward the camera as a sample offering, holds the present briefly, then returns the apple back into the basket. The action is the personality.
- **Multi-beat — discrete timecoded segments are mandatory** per the Architect 2026-04-27 lesson. Beat sequence is enumerated in Action.
- **Anatomical hand discipline + hand-release risk (longest of the five)** — right hand on forward foregrip stays anchored throughout (always-hold lead Constraint). Left hand on rear stock releases for the basket reach + offer + return — release window is roughly 1-6s of a 7s loop. Constraints: "right hand on the forward foregrip always" and "left hand returns to the rear wooden stock by 6.5 seconds."
- **Static-camera prefix** — body turn + over-shoulder reach is character-internal motion that Seedance may misread as a camera orbit. Not a `twirl` or `spin`.
- **Apple silhouette anchor** — same red-apple-with-green-stem-and-leaf anchor as P3 to prevent silhouette morph during the pull and offer beats.
- **Basket integrity over the loop** — apple is taken out and put back. Net change: 0. FFLF clean.
- **Open-mouth peak only at the offer-to-camera moment** — welcoming jolly laugh as the apple is presented. Closes back to canonical contented smile by t=loop-end.
- **Vocal direction** — a welcoming hearty chuckle on the body turn, a warm "here-friend" hearty laugh as the apple is offered to the camera, a contented chuckle on the return-to-basket. Per Merchant vocal direction 2026-04-30 — no actual words, wordless vocalizations only.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, camera orbit, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, actual speech, words,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the blunderbuss, gun changing hands, gun in one hand only,
full body twirl, full body spin, pirouette, character rotates 180 or 360 degrees,
multiple apples in hand, apple morphing, apple becoming a ball, apple becoming a gem,
basket falls off back, basket emptying entirely, food items changing shape,
long flowing feather plume, tall feather banner, feathers multiplying,
green sparkles, green VFX, mantle, cape, cloak, mouth stays open at end of loop
```

---

Subject:     static camera shot of a stocky jovial merchant trader character with chibi proportions, fair skin with rosy cheeks and a double chin, bright blue eyes, wearing a small fitted yellow cloth cap with a single short white feather tucked at the top and a thin blue cloth headband across the forehead beneath the cap, a green teal tunic, a wide brown leather belt with a large round red gem clasp at the center, crimson red trousers, heavy brown leather boots, a large woven tan basket backpack on his back overflowing with a bread loaf a ham hock a bunch of purple grapes and red apples visible above his shoulders, holding an ornate wood-and-metal blunderbuss across his body in a two-handed grip with his right hand on the forward foregrip on the viewer-left side of the image and his left hand on the rear wooden stock on the viewer-right side of the image with the barrel angled upward toward the viewer's left, in his canonical pose with a closed-mouth warm contented smile

Action:      from his canonical closed-mouth contented smile,
             (0.0-1.0s) his stocky body turns a small amount toward
             the viewer's right exposing the woven basket backpack
             better at his back, his chin lifts slightly and his
             closed-mouth smile widens warmly with welcoming charm,
             his right hand keeps the firm hold on the forward
             foregrip,
             (1.0-2.5s) his left hand releases the rear wooden stock
             and reaches back over his right shoulder into the woven
             basket on his back,
             (2.5-3.5s) his left hand pulls a single bright red apple
             with a green stem and one small green leaf out of the
             basket and brings it forward into view at chest level,
             (3.5-5.0s) his left hand extends forward toward the
             camera with the open palm holding the red apple at chest
             level offering it directly to the viewer, his expression
             opens into a wide open-mouth jolly welcoming laughing
             grin with eyes meeting the camera in a warm friendly
             twinkle and the apple is held steady at the offer point
             for a beat,
             (5.0-6.0s) his left hand draws back across his body and
             returns the red apple back over his right shoulder into
             the woven basket where it came from, his expression
             closes back into a satisfied warm closed-mouth contented
             smile,
             (6.0-6.5s) his left hand returns smoothly to the rear
             wooden stock and resumes the two-handed grip on the
             blunderbuss,
             (6.5-7.0s) his body un-turns to face forward in the
             canonical pose, the blunderbuss returns to the canonical
             two-handed across-body carry with the barrel angled
             upward toward the viewer's left.
             Expression arc: closed-mouth contented smile -> warm
             widened closed-mouth smile with chin-lift on the body
             turn -> focused closed-mouth grin during the basket reach
             and apple pull -> wide open-mouth jolly welcoming
             laughing grin at the offer-to-camera with knowing
             friendly eye twinkle -> closed-mouth contented smile on
             the apple-return-to-basket -> closed-mouth warm contented
             smile on the un-turn settle.
             The white feather on the cap drifts as the body turns
             and settles, the blue headband stays put, the woven
             basket backpack jostles during the reach and return but
             stays attached to his back, the apple count in the basket
             is restored at the end of the loop because the same
             apple is returned, the bread loaf and ham hock and grapes
             stay in the basket and do not change shape, the green
             tunic and crimson trousers drift minimally with the body
             turn.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       a warm hearty welcoming wordless chuckle from the merchant on the body turn, a hearty curious wordless hum on the basket reach, a warm hearty here-friend wordless laugh from the merchant at the moment the apple is offered toward the camera, a contented wordless chuckle on the apple-return-to-basket, a soft cloth shift of the green tunic on the body turn, a soft wicker creak from the woven basket backpack on the reach and return, no actual words no actual speech no music

Constraints: no actual words no actual speech the merchant's vocal sounds are wordless hearty chuckles and jolly laughs and contented hums only no dialogue, blunderbuss in two hands at start and end, right hand on the forward foregrip always, left hand returns to the rear wooden stock by 6.5 seconds and stays there for the rest of the loop, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no orbit, the body turn is a small character-internal upper-body rotation of just a few degrees the camera does not move or pan or zoom or orbit, this is not a full body twirl or pirouette the character does not rotate 180 or 360 degrees only a small upper-body turn toward the viewer's right and back, the apple is a single bright red apple with a green stem and one small green leaf round and smaller than a grapefruit and the apple silhouette stays clearly readable as an apple at every moment of the pull and offer and return beats and never morphs into a generic ball or gem or other fruit, the apple is taken out of the basket and the same apple is returned to the basket so the basket apple count is restored by the end of the loop, the basket stays attached to his back throughout, the blunderbuss never leaves the right hand and never drops, the cap has only a single short white feather tucked at the top not a long flowing plume not a tall feather banner not multiple feathers, the bread loaf and ham hock and grapes inside the basket stay in place and do not change shape, mouth opens into the welcoming jolly laughing grin only at the offer-to-camera peak and closes back to the canonical closed-mouth contented smile by the end of the loop, no blue rim light no environment, seamless loop first and last frame match canonical pose with the closed-mouth warm contented smile and the blunderbuss in the canonical two-handed across-body carry and no apple visible in either hand, 7s
