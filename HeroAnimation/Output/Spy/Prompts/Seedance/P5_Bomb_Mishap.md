# P5 — Bomb Mishap (Seedance 2.0)

> Power movement | 7s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Spy.png`

## Notes for this concept

- **Critical risk**: the offscreen explosion read depends entirely on (a) the bomb visually exiting frame-right via the kick, and (b) the flash originating from off-frame right. If the bomb detonates in-hand or in-frame, the joke dies and the character looks injured. Top iteration concern.
- **Shockwave reaction is mandatory** — hood blown back + body lean + quiver jostle are what sell "something exploded just offscreen." Without them, the flash looks like a lighting glitch.
- The "return to canonical pose" after the explosion is ambitious — the model may not fully recover the pose. Expect iteration on the tail half.
- Smoke drifting in from the right edge is a secondary confirmation cue; helps readability.
- Bomb shape: classic black sphere with short fuse — not a modern grenade (wrong tone for Supercell stylization).

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
environment, background scenery, talking, lipsync, voice, realistic proportions,
photorealistic, static frozen image, flat lighting, blue rim light, cyan edge light,
blue edge glow, warped hands, warped face, extra arms, duplicated weapon,
explosion in hand, bomb detonating on character, character injured, blood,
destruction, debris fragments, gore
```

---

Subject:     hooded rogue spy character holding a hand crossbow

Action:      reaches his left hand into the hip leather satchel while the
             crossbow stays in his right hand, produces a small round black
             cartoon bomb with a short lit fuse sparking orange particles,
             holds it up at eye level and spreads a huge trollface grin at
             the camera with an eyebrow waggle, the bomb slips from his
             fingers and falls, his grin collapses into a wide-eyed
             open-mouthed panic, he snappily kicks the bomb with motion blur
             off-camera to the right edge of frame, a split-second beat,
             then a small orange-yellow explosion flash erupts from
             off-frame right flooding the right side of the image with light
             as a shockwave blows his hood back and jostles the arrows in
             the quiver, he leans slightly away from the blast while
             drifting gray smoke curls in from the right, shakes it off,
             brushes his coat with a  shrug, a grin
             slowly returns and he settles back into two-handed low-ready
             aim. Expression arc: sneaky -> gleeful reveal -> panic ->
             relief -> sneaking grin.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level


Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:      no voice no dialogue no music, lit fuse sizzle with sparking, fast kick whoosh, loud off-screen explosion boom with low thump and rushing shockwave gust, soft cloth-brushing dust-off at the end, no voice no dialogue no music

Constraints: no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom, explosion must occur fully off-screen right never in hand or in frame, no blue rim light no environment no gore or injury, seamless loop first and last frame match canonical pose, 7s
