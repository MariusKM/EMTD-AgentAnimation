# P1 — Rose Presentation & Thorn Bloom (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Princess_Sweet.png`
> Concept: [concepts.md](../../concepts.md) — P1 (signature rose-and-thorn power, spectacular scope)

## Notes for this concept

- **Spectacular scope per user direction (2026-04-27)** — vines form a thorn-and-rose arch in the air around her silhouette, matching the client reference image. Not the minimal-scope version.
- **⚠ v1 audio safety rejection (2026-04-27)** — first generation completed video (167s inference) but failed on **output audio safety check** (`type: content_policy_violation`, `reason: partner_validation_failed`). v1 had vines `wrap around her right wrist and forearm` + `arc up around her shoulders and across her upper back` + Sound line with `soft warm` modifiers and `nose-exhale on settled smile`. The audio model likely generated breathy/sigh sounds interpreting the princess-being-wrapped-by-vines visual, which the partner validator flagged. v2 fix: vines hover around her in midair forming a framing arch (no body-contact language), Sound line uses only structural/mechanical sounds (cloth, vine creak, chime, leaf rustle) with no breath/exhale items, explicit Constraints ban on vocal sounds in the audio.
- **Chroma rule**: vines are **olive/yellow-leaning green** (R≈G, low B). Pure forest green and bright lime green both get keyed out by the chroma subtract formula `G − max(R,B)`. Olive RGB(130,170,60) and khaki RGB(180,180,90) survive. Strictly no bright/lime/spring green anywhere positively in the prompt.
- **Tomboy reveal beat** — the brief mischievous half-wink as the vines retract is the warm comedy hook. Per project tone direction (2026-04-16) and Princess Sweet's "hidden tomboy" trait.
- **Static-camera prefix** — vines extending outward across the silhouette is a high-motion off-axis VFX beat that Seedance may misread as a camera pull-back. Lock down up front.
- **Anatomical hand discipline** — rose in **right hand** (anatomical) which is on the viewer's right side of the image because she is in back-three-quarter view. Hand convention aligns viewer-side and anatomical-side for this hero specifically; still use anatomical terms throughout.
- **Gentle closed-mouth FFLF** — canonical resting smile, no extreme expression to handle. Loop opens and closes on the same gentle smile.
- **Always-hold rose** at start of Constraints per Fat King 2026-04-16 lesson.
- **Em-dash discipline** (per content-flag A5) — connected prose with conjunctions for VFX descriptions, no em-dash-introduced lists.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, voice,
sighs, moans, breathy sounds, gasps, giggles, vocalizations,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the rose, tiara removed, choker removed, earring removed,
bright green vines, lime green vines, spring green vines, glowing green vines,
pure green sparkles, green VFX, body spin, body rotation, character pirouette,
vines touching her body, vines wrapping her arm, vines wrapping her shoulders
```

---

Subject:     static camera shot of a graceful fairy-tale princess character with chibi proportions, slim build, very fair skin with rosy cheeks, large bright blue eyes, golden blonde hair styled in a large elegant updo bun with a few loose strands at the temples, a delicate silver crystal tiara with a small blue gem at the center placed in the updo, a single small pearl drop earring visible on her right ear, a thin pearl choker necklace at the throat, wearing a flowing royal blue ruffled ball gown with off-shoulder short puffed sleeves and a multi-tiered ruffled blue skirt over a white underskirt with small blue floral embroidery at the hem, holding a single red rose with a green stem delicately at chest height in her right hand, her left hand relaxed and open at her side, in her canonical pose with a gentle closed-mouth smile

Action:      from her canonical gentle closed-mouth smile she lifts the
             single red rose forward in a slow graceful arc to face
             height as a presentation gesture with a small wrist motion,
             the rose held presented toward the viewer for a brief beat,
             then olive yellow-green thorn vines with small leaves and
             small purple thorn accents grow rapidly outward from the
             green rose stem in multiple flowing streams expanding into
             the air around her, the vines extend outward to either side
             of her body and curve upward in midair behind her forming
             a tall thorn-and-rose arch silhouette that frames her
             figure like a living garden trellis, the vines hover in the
             air around her without contacting her body or her dress,
             the full vine arch holds at peak extension for a brief beat
             with her standing serene at the center of the bloom, then
             the vines recede smoothly back into the green rose stem
             dissolving into a fine drift of red and pink rose-petal
             motes that float outward briefly and fade, the rose returns
             to chest height in her right hand, she settles back into
             her canonical pose with a brief mischievous closed-mouth
             half-wink with her right eye for a single warm comedy beat
             that resolves back into the kind closed-mouth smile.
             Expression arc: gentle closed-mouth smile -> held warm
             presenting smile during the bloom peak -> brief mischievous
             half-wink on the settle -> resolved kind closed-mouth
             smile. The loose hair strands at her temples lift on the
             bloom peak and settle on the retract, the pearl earring
             catches light on the wink, the ruffled dress hem barely
             shifts with the light wrist motion, the tiara catches a
             gentle gleam at peak.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music no vocalizations, a light cloth rustle of the ruffled blue ball gown as she lifts the rose, a dry organic creak and leafy rustle as the olive thorn vines grow outward and form the arch in midair, a faint metallic chime as the vines reach peak extension, a dry papery rustle as the vines dissolve into rose-petal motes, no voice no dialogue no music no vocalizations no breathy sounds no sighs

Constraints: rose stays in right hand always, no dialogue, no vocal sounds in audio only material and mechanical sounds like cloth rustle leaf rustle vine creak chime and papery whisper are present in the audio track, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly, the vine bloom is a character-internal VFX growing outward from the rose stem in the air around her body the camera does not move or zoom or pull back to fit the vines, the vines hover in the air around her body and never touch or wrap her body or her dress they form an arch silhouette behind and beside her in midair, the vines are olive yellow-green or warm muted forest-green with R roughly equal to G in color value with small purple thorn accents and small leaves, the vines are not bright green not lime green not pure saturated green not spring green not glowing green, the small additional rose petals drifting around the retract are red and pink in color, all sparkle accents are pale gold or warm amber color never green, the single original red rose with a green stem stays held in her right hand at chest height throughout the entire loop fully intact and identical at the start and end, all conjured vines and petal motes fully dissolve and disappear before the loop ends, the silver crystal tiara stays in her hair throughout never falls off, the pearl earring and pearl choker stay in place throughout, mouth stays closed throughout, no head turn no body spin no rotation no pirouette her body stays in the canonical back-three-quarter pose throughout, no blue rim light no environment, seamless loop first and last frame match canonical pose with the gentle closed-mouth smile and the rose held in her right hand at chest height with no vines visible, 6s
