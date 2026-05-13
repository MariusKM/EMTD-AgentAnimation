# P6 — Thorn Forest Bloom (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Princess_Sweet.png`
> Concept: [concepts.md](../../concepts.md) — P6 (spectacular vine forest off-screen + 3-5 bloomed roses + retract into petal cloud)

## Notes for this concept

- **Spectacle scope** — largest VFX of the slate. Vines extend in multiple directions across the frame, several leaving the frame edges, with 3-5 small bloomed roses appearing along the vine network. Then full retract into petal cloud.
- **⚠ v1 audio safety rejection (2026-04-28)** — first generation completed video (146s inference) but failed on **output audio safety check** (`type: content_policy_violation`, `reason: partner_validation_failed`) — same failure mode as P1 v1. Triggers: vines `wrap around her right wrist and forearm and arc up around her shoulders and back` + `the vines wither away` + Sound line with multiple `warm` modifiers and `nose-exhale on settled smile`. v2 fix (per P1 v1→v2 pattern): vines hover in midair around her forming the forest framing without body contact, Sound line uses only structural/mechanical sounds with no breath items, explicit Constraints ban on vocal sounds in audio.
- **Recommend running AFTER P1 lands cleanly** so we have a tuned keyer baseline before testing this scope.
- **FFLF integrity is the structural risk** — original red rose in right hand must remain identical at t=0 and t=loop-end. All conjured vines and bloomed roses must fully disappear before the loop ends. Constraints line is heavy on this point.
- **Off-frame growth is unusual for static-camera I2V** — explicit `vines extending past the edges of the frame on both sides` language so Seedance doesn't try to zoom out.
- **Multiple roses count drift** — specify `3 to 5 small additional roses` (range, not exact count) and explicitly distinguish them from the held rose.
- **Em-dash discipline** (per content-flag A5) — VFX described as connected prose, no enumerated lists.
- **Chroma rule** as P1 — olive yellow-green vines and small additional bloomed roses in pink/red, no bright/lime/spring green.
- **Tomboy reveal beat** as P1 — brief mischievous half-grin on the settle ("yes, I grew that").
- **Static-camera prefix** — explosive multi-direction vine growth is the highest camera-misread risk on the slate. Lock down hard.
- **Always-hold rose** at start of Constraints.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, pull back, environment, background scenery, talking, lipsync, voice,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the rose, tiara removed, choker removed, earring removed,
bright green vines, lime green vines, spring green vines, glowing green vines,
pure green sparkles, green VFX, body spin, body rotation, character pirouette,
vines remaining at end of loop, bloomed roses remaining at end of loop,
multiple roses in her hand, rose count change in her hand
```

---

Subject:     static camera shot of a graceful fairy-tale princess character with chibi proportions, slim build, very fair skin with rosy cheeks, large bright blue eyes, golden blonde hair styled in a large elegant updo bun with a few loose strands at the temples, a delicate silver crystal tiara with a small blue gem at the center placed in the updo, a single small pearl drop earring visible on her right ear, a thin pearl choker necklace at the throat, wearing a flowing royal blue ruffled ball gown with off-shoulder short puffed sleeves and a multi-tiered ruffled blue skirt over a white underskirt with small blue floral embroidery at the hem, holding a single red rose with a green stem delicately at chest height in her right hand, her left hand relaxed and open at her side, in her canonical pose with a gentle closed-mouth smile

Action:      from her canonical gentle closed-mouth smile she lifts the
             single red rose forward at chest height with a fast graceful
             wrist motion as a presentation gesture, then olive
             yellow-green thorn vines with small leaves and small purple
             thorn accents grow rapidly outward from the green rose stem
             spreading laterally and diagonally across the entire scene
             in many flowing branching streams that extend outward in
             multiple directions in midair, several vines grow past the
             left edge of the frame and several others grow past the
             right edge of the frame as if a thorn forest is sprawling
             outward through the air across the whole scene, more vines
             grow upward and diagonally in foreground and background
             layers spreading widely without enclosing her, the vines
             do not form a closed ring or wreath or arch around her body
             they sprawl outward across the scene like a wild thorn
             thicket expanding through the air, the vines hover in the
             air without touching her body or her dress, as the vine
             network reaches full extension three to five small
             additional roses bloom open in soft pink and red colors at
             various points along the sprawling vine branches throughout
             the scene, she stands at the center of the sprawling
             midair thorn garden with her closed-mouth smile holding,
             the bloom holds at peak for a brief beat, then the entire
             thorn forest recedes and dissolves back toward the green
             rose stem in her right hand, the vines retract and the
             additional bloomed roses dissolve into a cloud of red and
             pink rose-petal motes that drift downward and outward and
             fade away, the original single red rose stays intact in
             her right hand throughout the dissolve, she settles back
             into her canonical pose, then a brief mischievous
             closed-mouth half-grin breaks for a single beat then
             resolves back into the closed-mouth smile. Expression arc:
             closed-mouth smile -> closed-mouth smile holding during the
             bloom peak -> closed-mouth smile during the dissolve ->
             brief mischievous half-grin on the settle -> resolved
             closed-mouth smile. The loose hair strands at her temples
             lift slightly on the bloom peak and settle on the dissolve,
             the pearl earring catches light on the half-grin, the
             ruffled blue dress hem shifts at the moment of the rapid
             vine growth and settles on the recede, the silver tiara
             catches a brief gleam at the bloom peak.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music no vocalizations no melodic tones no orchestral sounds, a light cloth rustle of the ruffled blue ball gown as she lifts the rose, dry organic creaks and leafy rustles as the olive thorn vines grow rapidly outward in multiple directions, dry papery crackles and small soft pops as the additional small roses unfold open along the vine network, dry papery rustles as the thorn forest recedes and dissolves into rose-petal motes drifting downward, no voice no dialogue no music no orchestral no ambient music no swells no melodic sounds no harmonic tones no vocalizations no breathy sounds no sighs

Constraints: rose stays in right hand always, no dialogue, no music no orchestral no ambient music no melodic tones no harmonic swells in the audio, no vocal sounds in audio only dry mechanical material sounds like cloth rustle leaf rustle vine creak papery crackle and small pops are present in the audio track, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no pull back no dolly, the thorn forest bloom is a character-internal VFX growing outward from the rose stem in the air around her body and the camera does not move or zoom or pull back to fit the vines or to reveal the additional roses, the vines hover in the air around her body and never touch or wrap her body or her dress, the vines sprawl outward across the scene in many directions like a wild thorn thicket they do not form a closed ring or wreath or arch or circle or oval shape around her body, multiple vine branches grow past the left and right edges of the frame extending laterally outward, vines also grow upward and diagonally in foreground and background layers without enclosing her, the vines extending past the left and right edges of the frame are intentional and the camera does not pull back to show them, the vines are olive yellow-green or warm muted forest-green with R roughly equal to G in color value with small purple thorn accents and small leaves, the vines are not bright green not lime green not pure saturated green not spring green not glowing green, the three to five small additional roses appear only along the conjured vine network in the air around her and they are smaller than her held rose and they are soft pink and red in color, the held rose in her right hand stays the original solo single red rose with a green stem and is the only rose in her hand throughout the entire loop, the additional bloomed roses fully dissolve into petal motes before the loop ends, all conjured vines fully recede and disappear before the loop ends, the petal motes from the dissolve are red and pink in color, all sparkle accents are pale gold or warm amber color never green, the silver crystal tiara stays in her hair throughout never falls off, the pearl earring and pearl choker stay in place throughout, mouth stays closed throughout, no body spin no rotation no pirouette her body stays in the canonical back-three-quarter pose throughout, no blue rim light no environment, seamless loop first and last frame match canonical pose with the gentle closed-mouth smile and the single original red rose held in her right hand at chest height with no vines or additional roses or petal motes visible, 6s
