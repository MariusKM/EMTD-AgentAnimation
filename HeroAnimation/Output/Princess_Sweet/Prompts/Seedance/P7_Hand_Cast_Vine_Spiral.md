# P7 — Hand-Cast Vine Spiral (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Princess_Sweet.png`
> Concept: [concepts.md](../../concepts.md) — P7 (spell-cast hero beat, addresses art-team "needs hero feeling" feedback 2026-04-28)

## Notes for this concept

- **Origin**: Art team feedback 2026-04-28 — existing Princess Sweet slate lacks "hero feeling." Built per art-team brief: vines come from her hand (not the rose stem) → gather pose hold ~1s like P4 → she points to the side → vines retract through a spectacular orbit around her body → exit behind her silhouette off-frame → spell-cast feel.
- **v1 → v2 revision (2026-04-28)**: v1 produced a circular vine arc immediately on extension instead of the intended straight forward whip. Root cause: v1 said "spiral out from her hands" + "gather in front of her at arm's length forming a hovering thorn-and-leaf cluster" — both phrases biased Seedance toward its strong default of circular/arc VFX (per `HeroAnimation/CLAUDE.md` continuous circular motion prior). v2 fixes this by:
  - **Switching from two-handed cast to single-LEFT-hand cast** (cleaner kinetic line; right hand stays anchored on rose at chest)
  - **Replacing "spiral out" / "gather as a cluster" with explicit linear language**: `vines erupt straight forward from her open left palm in a fast straight rod-like extension`, `the vines extend in a straight line toward and past the camera at chest height like a thrown forward whip`
  - **Foreshortening as a VFX property** (vines visibly larger at the camera-end of the line), NOT a camera property — camera stays locked
  - **Discrete timecoded beats in Action body** to prevent Seedance from smoothing the multi-stage sequence into one continuous circular motion (per Architect Stage 5 lesson)
  - **Encircle/orbit happens during the RETRACT after the side-point**, not on the initial extension. The orbit is the response to her directional gesture, not the cast itself.
  - **Vines exit behind her body off-frame** as the final beat — a distinct kinetic stage, not a tail of the orbit.
- **v2 → v3 revision (2026-04-28)**: v2 forward extension worked structurally (vines extending forward instead of forming a circle on extension) but the visual was too plain — a single straight rod of vine read as boring. User feedback: upgrade to a **double-vine helix**: a central straight vine extending forward with a secondary thinner vine spiraling tightly around it in a helix pattern as both travel forward together (like a barber-pole / candy-cane stripe wrapping a stick).
- **v3 → v4 revision (2026-04-28)**: User feedback — upgrade further to **a richer parallel cluster of multiple vines + multiple spirals**. The geometry: 3-5 thicker straight vines extending forward in parallel as a tight bundle (all along the same forward axis, like a braided rope of vines thrown forward), with 3-5 thinner helix-wrapping vines coiling tightly around the central bundle in spiral patterns. All vines travel forward together as one cohesive cluster reaching toward and past the camera. Adds the "powerful magic burst" density without regressing to body-spiral. Key prompt-craft details:
  - **All vines extend FORWARD together along the same axis** — never describe them as `fanning out in different directions` or `radiating outward` (those phrasings would regress to body-circular).
  - Describe the geometry as a **forward bundle**: `a tight parallel bundle of multiple thicker straight vines extending directly forward together along the same forward axis with multiple thinner vines wrapping around the bundle in tight continuous helix spirals`.
  - **Critical disambiguation** (carry-over from v3): the helix wraps are around the FORWARD-EXTENDING bundle, NOT around her body. Constraint must explicitly state: `the helix wraps are around the forward-extending vine bundle only and are NOT around her body`.
  - Keep the straight-line anchor on the bundle: `the central bundle of thicker vines travels in a straight line forward through the air it does not curve arc or fan out sideways`.
  - All vines reach the camera-end together with foreshortening on the whole bundle.
- **Vine emanation source = HER OPEN LEFT PALM, not the rose stem.** This is the deliberate visual differentiator from P1-P6 where vines emerge from the rose stem.
- **Audio-safety preemptive (v1 from prompt start, per A6 lessons learned on P1 v1→v2 and P6 v1→v5)**:
  - Action body uses NO `warm`, `soft`, `serene`, `peaceful`, `calmly`, `widening calmly`, `gentle breeze` mood modifiers (per A6 family 2 — these shape audio-model mood inference toward orchestral content).
  - Sound line uses ONLY mechanical/material sounds (cloth rustle, vine creak, leaf rustle, sharp whoosh on exit, papery petal rustle). NO `chime`, `bell`, `tone`, `melodic`, `harmonic` (per A6 family 2 — instrument words trigger music-classifier rejections).
  - Constraints leads with explicit positive `no music no orchestral no swells in audio only material and mechanical sounds` (per A6 family 2 + A3 — express positively).
  - NO `spell`, `cast`, `incantation`, `magic` nouns in Action body (per A6 family 3 — quoted/named-magic phrases cue audio model toward voiceover incantation). Describe gesture mechanically: `extends her left arm outward and points sharply`.
  - Vines orbit through midair AROUND her body without contacting her dress or skin (per A6 family 1 — body-contact + intimate-vocab → breathy/sigh audio rejection).
- **Anatomical hand discipline** — rose stays in **right hand** anchored at chest height throughout. Only the **left hand** moves: lifts forward to chest height (cast pose), pivots to side-point (anatomical-left = viewer's left in back-3/4 view), returns to her side.
- **Body discipline** — body stays in canonical back-3/4 pose throughout the loop. Only her LEFT ARM extends/pivots; NO body rotation, NO pirouette, NO facing change, NO body lean forward toward viewer (per Spy lesson — body lean reads as camera push-in).
- **Static-camera prefix** — forward extension + lateral exit + retract-through-orbit are all high-motion VFX patterns Seedance reads as camera moves. Lock down hard. Foreshortening is a VFX property, NOT a camera property.
- **Loop integrity** — original red rose stays in right hand throughout; left arm returns to relaxed-at-side; all vines and motion trails fully exit/dissolve before loop end so FFLF first/last frame match.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, follow, environment, background scenery, talking, lipsync, voice,
sighs, moans, breathy sounds, gasps, giggles, vocalizations, humming, speech,
incantation, spoken magic words, orchestral music, ambient music, swells, melodic tones,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the rose, tiara removed, choker removed, earring removed,
bright green vines, lime green vines, spring green vines, glowing green vines,
pure green sparkles, green VFX, body spin, body rotation, character pirouette,
body facing change, vines touching her body, vines wrapping her arm, vines wrapping her shoulders,
vines emerging from rose stem, camera following the vines off-screen
```

---

Subject:     static camera shot of a graceful fairy-tale princess character with chibi proportions, slim build, very fair skin with rosy cheeks, large bright blue eyes, golden blonde hair styled in a large elegant updo bun with a few loose strands at the temples, a delicate silver crystal tiara with a small blue gem at the center placed in the updo, a single small pearl drop earring visible on her right ear, a thin pearl choker necklace at the throat, wearing a flowing royal blue ruffled ball gown with off-shoulder short puffed sleeves and a multi-tiered ruffled blue skirt over a white underskirt with small blue floral embroidery at the hem, holding a single red rose with a green stem delicately at chest height in her right hand, her left hand relaxed and open at her side, in her canonical pose with a closed-mouth smile

Action:      (0.0-0.4s) from her canonical closed-mouth smile she lifts
             her left arm forward at chest height with her left palm
             open and facing forward toward the viewer, her right hand
             stays at chest height holding the single red rose
             throughout. (0.4-1.0s) a rich cluster of multiple olive
             yellow-green thorn vines with small leaves and small
             purple thorn accents erupts straight forward from her open
             left palm at the same moment, the cluster is composed of
             three to five thicker straight vines extending directly
             forward in a tight parallel bundle along the same forward
             axis like a braided rope of vines thrown forward through
             the air toward and past the camera at chest height, with
             three to five thinner vines wrapping in tight continuous
             helix spirals around the parallel bundle like candy-cane
             stripes wrapping a stick or like vines wrapping a tree
             trunk, the entire cluster of bundle and spirals travels
             together as one cohesive forward-extending shape, the lead
             ends of all the vines at the camera-end of the cluster
             appear visibly larger than the trailing ends giving the
             whole forward extension a foreshortened depth as if
             growing toward the viewer, the central bundle of thicker
             vines does not curve arc or fan out sideways they all
             follow the same straight forward axis and the helix
             spirals wrap only around the central forward-extending
             bundle. (1.0-2.0s) she holds the forward-extended pose for
             a brief held beat with her left arm extended forward palm
             open and the rich cluster of straight thicker vines and
             helix-wrapping thinner vines all stretching forward
             together through the air past the camera, her closed-mouth
             smile holds firm. (2.0-2.4s) she pivots her left hand
             sharply from forward to a directional gesture pointing to
             her anatomical-left side which appears on the left side
             of the image with her left index finger pointing
             outward to the left. (2.4-3.2s) the vines retract from
             their forward-extended position and during the retract
             they sweep into a fast wide orbit around her body
             traveling in a curved path through the air around her
             from front to side to back, the orbit passes around her
             waist and chest level in midair without contacting her
             body or her dress. (3.2-3.8s) the vines complete the
             orbit by passing behind her silhouette which partially
             occludes them at the back of the orbit and then exit off
             the left edge of the frame behind her trailing pale gold
             motion-trail streaks and a drift of red and pink rose
             petals that fade. (3.8-4.2s) her left arm returns
             smoothly to a relaxed position at her side, a brief
             mischievous closed-mouth half-grin breaks for a single
             beat. (4.2-6.0s) she settles back into her canonical
             pose with the closed-mouth smile resolved and the rose
             held in her right hand at chest height. Expression arc:
             closed-mouth smile -> focused closed-mouth smile during
             the forward extension and side-point -> brief
             mischievous half-grin on the settle -> resolved
             closed-mouth smile. The loose hair strands at her temples
             lift on the side-point gesture and settle on the recede,
             the ruffled blue dress hem flares slightly with the body
             weight shift on the side-point, the pearl earring catches
             light on the half-grin, the silver tiara holds steady.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music no vocalizations no melodic tones no orchestral sounds, a light cloth rustle of the ruffled blue ball gown as she lifts her left arm forward, a layered sharp dry vine whoosh as the rich cluster of olive thorn vines erupts straight forward from her open left palm with multiple parallel thicker vines and multiple helix-wrapping thinner vines all extending together in a fast linear forward extension toward the viewer, layered dry organic creaks as the forward bundle and its helix wraps hold extended in midair, a sharp light fabric snap as she pivots her hand to the side-point, layered dry vine whooshes as the cluster retracts into the orbit around her body and exits off the left edge of the frame behind her silhouette, dry papery rustles as the rose petals drift after the exit, no voice no dialogue no music no orchestral no ambient music no swells no melodic sounds no harmonic tones no vocalizations no breathy sounds no sighs no humming no speech no incantation

Constraints: rose stays in right hand always, no dialogue, no music no orchestral no ambient music no swells no melodic tones no harmonic sounds in audio, no vocal sounds in audio only dry mechanical material sounds like cloth rustle leaf rustle vine creak fabric snap dry whoosh and papery rustle are present in the audio track, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no pull back no dolly no pan no follow no tilt, the camera stays at fixed distance and fixed framing throughout the entire loop, the forward extension of the vines is a character-internal VFX growing from her left palm forward through the air the camera does not push in or zoom toward the action, the foreshortening on the forward extension is a property of the VFX with the lead vines at the camera-end visibly larger than the trailing vines and is not a property of the camera the camera does not move at all, the vines emerge only from her open left palm not from the rose stem and not from her right hand, in the forward extension stage a rich cluster of multiple vines extends together in a straight line directly forward toward and past the camera composed of three to five thicker straight vines traveling in a tight parallel bundle along the same forward axis with three to five thinner vines wrapping in tight continuous helix spirals around the central bundle the helix wraps are around the forward-extending vine bundle only and are NOT around her body the central bundle of thicker vines does not curve arc or fan out sideways they all follow the same straight forward axis and the entire cluster travels together as one cohesive forward-extending shape for the duration of the forward extension stage, the orbit around her body happens only after the side-point gesture during the retract stage not on the initial forward extension, during the orbit and exit the vines pass through the air around her body in midair and never touch or wrap her body or her dress they pass behind her silhouette and her body partially occludes them at the back of the orbit then they exit off the left edge of the frame behind her, the vines are olive yellow-green or warm muted forest-green with R roughly equal to G in color value with small purple thorn accents and small leaves, the vines are not bright green not lime green not pure saturated green not spring green not glowing green, the motion-trail streaks behind the exiting vines are pale gold or warm amber color never green, the rose petals trailing the exit are red and pink in color, the single original red rose with a green stem stays held in her right hand throughout the entire loop fully intact and identical at the start and end, all conjured vines fully exit off-frame behind her silhouette and disappear and all motion-trail streaks and petal motes fully fade before the loop ends, her body stays in the canonical back-three-quarter pose throughout only her left arm moves and only her left arm extends outward and her body does not lean forward toward the viewer, no body spin no rotation no pirouette no facing change no body lean, the silver crystal tiara stays in her hair throughout never falls off, the pearl earring and pearl choker stay in place throughout, mouth stays closed throughout, no blue rim light no environment, seamless loop first and last frame match canonical pose with the closed-mouth smile and the rose held in her right hand at chest height with her left hand relaxed at her side and no vines or petal motes or motion trails visible, 6s
