# P2 — Sweeping Halberd Swipe (Seedance 2.0)

> Power movement | 5s | 1:1 | Static locked-off I2V
> FFLF source = `Output/Count_Wilhelm/Count_Wilhelm_FFLF_0.png`
> Concept: [concepts.md](../../concepts.md) — P2 (broad-face horizontal arc, blue arc trail, horizontal arc kinetic axis)

## Notes for this concept

- **v1 review (2026-05-05)**: floaty/weightless sweep + halberd morphed into a double-bladed battle axe.
- **v2 fix — halberd anchor**: led Subject with `tall ornate single-bladed halberd polearm`, replaced every `axe-head` → `halberd-blade` / `halberd-head`, dropped the standalone word `axe` entirely. Added explicit negative + Constraint against `double-bladed battle axe / double-headed axe / two-bladed axe / battle axe / war axe shape`. Halberd description moved earlier in the Subject sentence so the model anchors weapon identity before character build.
- **v2 fix — weight/power**: rewrote Action with heavier slow committed wind-up + weighted hip-driven sweep + deep grounded follow-through + longer impact-frame hold. Strong slow-fast-slow timing contrast (per the Wilhelm reference animation lesson). Cape billows during the wind-up, wraps with the sweep, settles slowly during recovery. Added impact-thud SFX at the moment the broad blade-face passes through the front of his body and a heavier anchored stance language to read inertia.
- **Hand convention**: anatomical right (high) leads the sweep, anatomical left (low) anchors. Both hands stay on weapon throughout.
- **Always-hold halberd** at start of Constraints.
- **Broad-face presentation** of the halberd-blade per silhouette-preservation rule (Architect P4 lesson).
- **Static camera prefix** — high-motion horizontal arc is the highest camera-misread risk on the slate.
- **Avoid full body pirouette** — Constrain explicitly: hip rotates partially but body does not pirouette.
- **Blue VFX**: blue arc-trail ribbon following the halberd-blade broad face.
- **Vocal direction**: stern wordless gruff grunt on the follow-through.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, voice,
chuckles, laughs, sighs, breathy sounds, vocalizations,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light on character silhouette, cyan edge light, blue edge glow on body,
warped hands, warped face, extra arms, dropping the halberd, releasing the halberd,
single-hand grip, switching hands, halberd morphing into sword or spear,
double-bladed battle axe, double-headed axe, two-bladed axe, battle axe, war axe,
twin-bladed axe head, mirrored blade head, axe with two blades,
generic blade silhouette, simplified weapon shape, full body pirouette, body rotation,
character spin, halberd-blade edge-on to camera, weightless sweep, floaty motion,
fast windup, instant strike, green VFX, green energy, green sparkles
```

---

Subject:     static fixed camera shot of a stocky veteran warlord character with chibi proportions and a broad heavy build, holding a tall ornate single-bladed halberd polearm with a long brown wooden haft and a single etched silver curved blade head featuring one long curved single-edged blade on the front side of the head and one straight upward-pointing top spike at the very top with decorative scrollwork along the silver halberd-head, the halberd held diagonally across his body with both hands gripping the wooden haft his anatomical right hand high on the haft just below the silver halberd-head and his anatomical left hand low near the butt of the haft, weathered tan skin with ruddy cheeks, dark deep-set eyes shadowed beneath heavy dark eyebrows, white swept-back voluminous hair, a very large white handlebar mustache that fully covers his mouth, polished silver plate armor on his shoulders and chest with visible pauldrons, a teal undergarment visible beneath the chest plate, a thick gold chain necklace at his throat with five large faceted red-orange cabochon-cut gemstones, brown leather arm guards with metal plate reinforcement, a deep crimson cape draped from both shoulders falling behind to his anatomical-left side, dark teal trousers, heavy brown leather military-style boots, in his canonical pose with a stern intimidating under-brow glare

Action:      from his canonical stern under-brow glare he begins a
             slow heavy committed wind-up across the first beat his
             shoulders coiling powerfully back and his weight
             transferring fully onto his rear leg as he draws the
             tall halberd polearm back to his anatomical-right side
             the halberd-head pulled high and back the haft visibly
             loaded with stored power, a moment of held anticipation
             with the warlord coiled and grounded, then in one
             explosive committed sweep he drives the halberd in a
             powerful weighted horizontal arc traveling from his
             anatomical-right side across the full front of his body
             to his anatomical-left side at chest height his hips
             rotating strongly with the sweep and his rear leg
             pushing off to drive the motion his anatomical right
             hand high on the haft leading the sweep and his
             anatomical left hand low on the haft anchoring and
             following through, the curved single-edged silver
             halberd-blade is presented broad-face flat toward the
             camera throughout the sweep with the broad face turned
             toward the viewer rather than edge-on, as the broad
             blade-face passes through the front of his body a wide
             curved cool blue energy arc-trail ribbon follows the
             broad face of the halberd-blade tracing the path of the
             sweep through the air with weighted substance, at the
             moment the blade-face passes the centerline of his body
             a low heavy resonant impact thud sounds and the cape
             snaps strongly with the inertia, he ends the sweep with
             the halberd extended fully to his anatomical-left side
             in a deeply grounded committed follow-through stance
             his weight now planted on his front leg his shoulders
             angled with the motion and holds this powerful
             follow-through pose for an extended beat letting the
             weight read, the cool blue arc-trail dissipates and
             fades during the held follow-through, then he draws the
             halberd slowly and heavily back across his body to his
             canonical two-handed diagonal grip with a small dry
             approving head-nod beneath the heavy mustache.
             Expression arc: stern under-brow glare -> coiled grim
             resolve through the slow heavy wind-up -> hardened
             battle resolve through the committed sweep -> stern
             approving glare on the held follow-through -> small dry
             approving nod on the settle -> resolved canonical stern
             glare. The deep crimson cape billows outward during the
             slow wind-up and snaps strongly with the body rotation
             then drapes wrapping toward his anatomical-left side
             with the follow-through and resettles slowly to its
             canonical drape on his anatomical-left side during the
             return, the white handlebar mustache lags substantially
             behind the head motion through the sweep showing
             inertia, the white hair lifts on the wind-up and trails
             through the sweep, the gold chain necklace and the five
             red-orange gemstones swing weighted with the body
             rotation, the silver pauldrons catch a bright gleam at
             the peak of the sweep and at the held follow-through.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions, hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no speech no music no vocalizations no humming, a heavy slow leather-creak and an armor-shift as he coils his shoulders for the slow heavy wind-up, a strong sustained low metallic woosh as the broad single-edged halberd-blade sweeps powerfully through the air across the front of his body, a low heavy resonant impact thud at the moment the blade-face passes the centerline of his body, a soft cool energy hum as the blue arc-trail traces the path of the sweep, a strong heavy cloth snap of the deep crimson cape on the body rotation and the follow-through and a slow resettle on the return, a low gruff committed wordless grunt from the warlord on the follow-through, no voice no dialogue no speech no music no vocalizations

Constraints: halberd stays in both hands always, the weapon is a tall single-bladed halberd polearm with a single curved single-edged silver blade-head and one straight top spike never a double-bladed battle axe never a double-headed axe never a two-bladed axe never a battle axe never a war axe never a twin-bladed weapon, the halberd-head has only one curved blade on the front side of the head it does not have a second blade on the rear side of the head, no dialogue no speech no vocal sounds in audio only material and mechanical sounds like leather creak armor shift heavy metallic woosh resonant impact thud cool energy hum cloth snap and a single low gruff committed wordless grunt are present in the audio track, the warlord's vocal sounds are wordless gruff grunts only no actual words no actual speech, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no pan, the horizontal sweep is a character-internal weapon action and the camera does not pan or move with the halberd, the wind-up is slow and heavy and committed and the sweep is fast and powerful and weighted with strong slow-fast-slow timing contrast that reads as a heavy weapon with real inertia not a floaty weightless slash, the follow-through pose is held in a deeply grounded stance with weight planted on the front leg for a clearly visible extended beat to read weight, both his anatomical right hand high on the haft and his anatomical left hand low on the haft remain firmly gripping the halberd throughout the entire loop and he never releases either hand and never switches hands, the curved single-edged silver halberd-blade broad face is presented flat toward the camera throughout the sweep and is never turned edge-on to the camera, the ornate halberd silhouette including the single curved silver halberd-blade with decorative scrollwork the single straight top spike and the long brown wooden haft remains clearly visible to the camera at every moment of the loop and the silhouette never simplifies into a generic sword or spear shape and never morphs into a double-bladed battle axe shape, his hips and torso rotate strongly with the sweep but his stance stays grounded with feet planted he does not perform a full body pirouette or a full body spin or rotation in place, the cool blue arc-trail ribbon is the only VFX and it is cool blue in color never green never yellow-green, the cool blue arc-trail fully dissipates and disappears before the loop ends, the deep crimson cape returns to its canonical drape on his anatomical-left side at the loop end, the white handlebar mustache stays in place throughout and fully covers his mouth, the gold necklace with five red-orange gemstones stays in place throughout, the silver plate armor stays in place throughout, mouth stays closed throughout no lipsync no talking, no head turn beyond the natural follow-through angle, no blue rim light on the character silhouette no environment, seamless loop first and last frame match canonical pose with the stern under-brow glare and the halberd held diagonally in both hands with no blue VFX visible, 5s
