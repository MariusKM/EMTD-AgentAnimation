# P5 — Reload & Fire (Seedance 2.0)

> Power movement | 7s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Merchant.png`
> Concept: [concepts.md](../../concepts.md) — P5 (full CSV ritual: ramrod gesture → shoulder → fire → settle)

## Notes for this concept

- **Full CSV attack ritual** — "Reload through muzzle, aim, shoot. Puff of smoke after shooting." This is the highest-production-value Merchant power move, attempting all three CSV beats.
- **Multi-beat — discrete timecoded segments are mandatory** per the Architect 2026-04-27 lesson. The three beats are reload (vertical) → aim (horizontal/forward) → fire (forward press). Without explicit timecoding, Seedance will collapse them into a single arc motion.
- **Anatomical hand discipline + hand-release risk** — right hand on forward foregrip releases briefly to perform the ramrod-into-muzzle mime gesture, then returns. Constraints lead with "right hand returns to the forward foregrip by 2.5 seconds." Left hand on rear stock stays anchored throughout.
- **Mimed ramrod, no prop** — no actual ramrod tool is summoned in the loop (would create FFLF integrity problems). The ramrod gesture is pure mime: right hand briefly pinches a phantom rod and pushes it down into the open muzzle, then withdraws and returns to foregrip. If the model insists on rendering a ramrod prop, fallback Constraint requires it disappears before the aim beat.
- **Static-camera prefix** — vertical-then-forward gun motion is high motion; lock down up front.
- **Open-mouth peak at fire only** — laughing grin at the fire moment only. Expression stays mostly closed-mouth focused / determined through the reload + aim beats.
- **VFX color discipline** — warm yellow-orange muzzle flash + thick gray-white smoke puff at fire. NEVER green. Reload + aim beats have no VFX.
- **Recoil is mild here** (P2 has the heavy comedic recoil) — this concept's personality is the focused-but-jolly working-class ritual, not the recoil wobble. Just a small body settle after fire.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, voice,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the blunderbuss, gun changing hands, gun in one hand only,
ramrod tool persists into aim or fire beats, ramrod morphs into a sword or stick,
multiple ramrods, long flowing feather plume, tall feather banner, feathers multiplying,
backpack contents morphing, food items changing shape, basket emptying,
green sparkles, green glow, green smoke, green muzzle flash, green VFX,
mantle, cape, cloak, mouth stays open at end of loop
```

---

Subject:     static camera shot of a stocky jovial merchant trader character with chibi proportions, fair skin with rosy cheeks and a double chin, bright blue eyes, wearing a small fitted yellow cloth cap with a single short white feather tucked at the top and a thin blue cloth headband across the forehead beneath the cap, a green teal tunic, a wide brown leather belt with a large round red gem clasp at the center, crimson red trousers, heavy brown leather boots, a large woven tan basket backpack on his back overflowing with a bread loaf a ham hock a bunch of purple grapes and red apples visible above his shoulders, holding an ornate wood-and-metal blunderbuss across his body in a two-handed grip with his right hand on the forward foregrip on the viewer-left side of the image and his left hand on the rear wooden stock on the viewer-right side of the image with the barrel angled upward toward the viewer's left, in his canonical pose with a closed-mouth warm contented smile

Action:      from his canonical closed-mouth contented smile,
             (0.0-1.0s) both hands together angle the blunderbuss
             upright with the muzzle pointing straight up at the top
             of the frame, the left hand on the rear wooden stock
             braces the gun vertically against his hip, his closed-mouth
             smile holds in focused jolly working-ritual concentration
             with eyebrows lifted slightly,
             (1.0-2.5s) his right hand briefly releases the forward
             foregrip and rises up to the open mouth of the muzzle and
             mimes a single firm ramrod-push downward into the muzzle
             with a closed pinching grip as if pushing an invisible
             ramming rod into the barrel and then withdraws cleanly,
             no actual ramrod tool is visible at any point,
             (2.5-3.0s) his right hand returns smoothly to the forward
             foregrip and resumes the two-handed grip,
             (3.0-4.0s) both hands together lower the blunderbuss
             across his body and shoulder it horizontally with the
             barrel now pointing forward toward the viewer, his eyes
             track forward along the barrel,
             (4.0-4.5s) the blunderbuss fires with a warm yellow-orange
             muzzle flash at the mouth of the barrel and a thick
             gray-white smoke puff billows forward toward the viewer,
             his expression opens into a wide open-mouth jolly laughing
             grin showing teeth at the moment of fire,
             (4.5-5.5s) his stocky body rocks back a small amount with
             a mild settle, the gun barrel kicks up briefly, the
             gray-white smoke drifts up and forward and begins to fade,
             (5.5-7.0s) he settles back to the canonical two-handed
             across-body carry with the barrel angled upward toward
             the viewer's left, the smoke is fully gone, his expression
             closes back into a satisfied warm closed-mouth contented
             smile with a small jolly nod.
             Expression arc: closed-mouth contented smile -> focused
             jolly closed-mouth smile with raised eyebrows during the
             reload mime -> closed-mouth focused look during the
             shouldering and aim -> wide open-mouth jolly laughing grin
             at the fire -> jolly grin held briefly through the mild
             settle -> satisfied warm closed-mouth contented smile with
             a small nod on the final settle.
             The white feather on the cap stays steady through the
             reload and aim then snaps backward briefly on the fire
             and settles, the blue headband stays put, the bread loaf
             and ham hock and grapes and apples in the basket stay in
             place and do not change shape, the woven basket backpack
             jostles a small amount on the body motions, the crimson
             trousers crease at the knees on the rock-back.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       a focused hearty wordless hum from the merchant during the reload mime, a soft wooden creak as the gun is angled upright, a soft cloth shift of the green tunic on the right hand reload gesture, a deeper wooden thunk as the gun is shouldered horizontally, a sharp deep wooden-and-metal blunderbuss firing report at the moment of fire, a jolly hearty wordless laugh from the merchant at the moment of fire, a thick smoke whoosh as the puff billows forward, a soft creak from the woven basket backpack on the settle, no actual words no actual speech no music

Constraints: no actual words no actual speech the merchant's vocal sounds are wordless hearty hums and jolly laughs only no dialogue, blunderbuss in two hands at start and end, left hand on the rear wooden stock always, right hand returns to the forward foregrip by 2.5 seconds and stays there for the rest of the loop, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly, the reload and aim and fire are character-internal motions the camera does not move or pan or zoom, the reload mime gesture uses the right hand alone with no actual ramrod tool visible at any moment of the loop, the muzzle flash is warm yellow-orange and the smoke puff is gray-white not green not yellow-green not any green-tinted color and the smoke is fully faded by the end of the loop, the blunderbuss never drops and is held in two hands at the start and end of the loop, the cap has only a single short white feather tucked at the top not a long flowing plume not a tall feather banner not multiple feathers, the woven basket backpack stays on his back throughout and the bread loaf and ham hock and grapes and apples inside it stay in place and do not change shape and do not float out of the basket, mouth opens into the jolly grin only at the fire peak and closes back to the canonical closed-mouth contented smile by the end of the loop, no blue rim light no environment, seamless loop first and last frame match canonical pose with the closed-mouth warm contented smile and the blunderbuss in the canonical two-handed across-body carry and no smoke remaining, 7s
