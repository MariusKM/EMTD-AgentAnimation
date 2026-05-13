# I4: The Builder's Glance — Seedance 2.0 Prompt

> Hero: New King | Type: Idle Movement | Duration: 4s | Model: Seedance 2.0
> Source image: `Source/Heroes Stylized/mouth_closed/New_King.png`
> Concept: [concepts.md](../../concepts.md) — I4

## Prompt

Subject:     stylized 3D game character, bearded king in gold crown, olive green tunic, maroon cape, holding silver sword in two-handed grip at chest height, scroll pouch at his hip
Action:      right hand releases the sword grip and lowers smoothly to the scroll pouch at his hip, fingertips brush the rolled parchment inside, eyes flick down briefly to glance at it, small thoughtful nod as he looks back up to the horizon, right hand returns to the sword grip, settles back into the starting two-handed pose
Camera:      locked, full body, centered, static
Style:       Supercell mobile game art, saturated hand-painted colors
Sound:       ambient silence, soft leather creak and fabric rustle, no VO
Constraints: no camera movement, no background/environment, no talking/lipsync, no drawing a weapon, no sudden movements, seamless loop, start=end pose, 4s

## Negative Prompt

walk cycle, run animation, jumping, falling, camera movement, camera shake, zoom, pan, environment, background scenery, talking, lipsync, voice, drawing sword, drawing pistol, attack motion, combat, realistic proportions, photorealistic, static image, freeze frame, flat lighting

## Notes

- Expression arc: calm confidence → thoughtful as eyes drop to pouch → small approving nod as he looks back up → calm confidence
- Mouth closed throughout
- Weight shifts subtly to the right hip as the hand dips, recenters on return
- Cape drifts gently from the small weight shift
- Scroll pouch visibly moves as the hand engages it — this is the anchor detail
- Crown catches light on the head lift back up
- I2V risk: the model may try to fully draw the parchment out or turn this into a weapon draw — keep prompt language soft ("brush", "glance", "touch") and rely on the negative prompt to suppress draw/attack motions
- Nods to the "Builder" identity from the client brief — King Eric as military and administrative leader
