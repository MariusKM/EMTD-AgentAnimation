# P3_1 — Dragon Wisp Lunge (BLUE chroma) (Seedance 2.0)

> Power movement | 6s | 1:1 | Static locked-off I2V
> FFLF source = `Output/Dragonwitch/Dragonwitch_FFLF_1.png` (blue chroma variant)
> Concept: [concepts.md](../../concepts.md) — P3 (forward + signature VFX, strongest unique read)
> Variant of [P3_Dragon_Wisp_Lunge.md](P3_Dragon_Wisp_Lunge.md) — chroma background switched green → blue to avoid keying conflict with the greenish-purple dragon-flame VFX.

## Notes (variant-specific)

- **Blue chroma background** (`0x0000FF`) instead of green — Dragonwitch's signature greenish-purple flame collapses into the green chroma during keying. Switching to blue chroma gives the keyer clear separation between the flame VFX and the background.
- **All other prompt body details unchanged** from P3 — same Action, Camera, Style, Sound, expression arc, silhouette discipline.
- **Character lighting rule preserved** — `no blue rim light` stays in negatives (chroma background color does not change the no-blue-edge-light direction on the character itself).

(See [P3_Dragon_Wisp_Lunge.md](P3_Dragon_Wisp_Lunge.md) for the full concept-level notes — signature VFX, distinctive silhouette fix pattern, static-camera prefix, hip-hand anchor, no mouth-open peak.)

## Negative prompt (reference)
```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan, push in, dolly,
environment, background scenery, talking, lipsync, voice, blue rim light, warped hands, warped face,
extra arms, dragon skull held in hand, mantle, cape, cloak, pure green flame, body twirl, body spin,
camera orbit, generic fireball, generic flame, simple flame ball, green background, green chroma
```

---

Subject:     static camera shot of a slim athletic dark sorceress character with chibi proportions, short spiky dark navy blue hair swept up to one side, bright green eyes, green-tinted lips, tan olive skin with cool undertone, black sleeveless cropped bodice top, short green leaf-shaped skirt with ragged jagged edges falling to mid-thigh, brown leather belt with diamond-shaped buckle at center, dark gray elbow-length gloves, black knee-high buckled boots, a silver horned dragon skull pauldron worn as armor on her anatomical-left shoulder, anatomical-left hand resting on her hip, anatomical-right palm extended out to the side palm up facing the camera with a small greenish-purple magical dragon-shaped flame floating above the open palm, in her canonical pose with a confident closed-mouth smirk

Action:      from her canonical confident closed-mouth smirk the
             greenish-purple flame above her anatomical-right palm
             gathers and condenses into a small ethereal greenish-purple
             dragon head with two horns curving back along its skull, an
             open snarling mouth, and trailing wisps as a tail, the
             dragon head hovers above her palm presented broad-face
             toward the camera, her smirk widens a small amount with
             arrogant satisfaction, then the small dragon head snarls
             and lunges forward off her palm toward the camera fully
             projecting out the front of frame, leaving a trail of
             greenish-purple smoke and dragon wisps behind, she snaps
             her fingers closed sharply on the empty palm, her bright
             green eyes briefly flash bright greenish-purple on the
             snap, then her hand opens again and a small
             greenish-purple dragon-shaped flame reforms above her open
             palm as she settles back to canonical with her closed-mouth
             smirk widened a small amount to the camera, her
             anatomical-left hand never leaves the hip throughout, the
             silver horned dragon skull pauldron stays still on her
             anatomical-left shoulder with its eyes briefly flashing
             greenish-purple in time with hers on the snap then
             returning to silver bone-white. Expression arc: confident
             closed-mouth smirk -> arrogant widened smirk on the gather
             -> sharp eye-flash on the snap -> satisfied widened
             closed-mouth smirk on the settle. The spiky navy hair
             lifts a small amount on the lunge and settles, the ragged
             green leaf-shaped skirt edges flutter on the lunge.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music, a low ominous magical crackle as the dragon head condenses, a sharp ethereal snarl as the dragon lunges forward, a sharp magical fwoom on the projection, a clean finger-snap on the closing palm, a faint metallic shimmer from the silver dragon skull pauldron, soft cloth shift of the leaf-shaped skirt and spiky hair, no voice no dialogue no music

Constraints: anatomical-left hand stays on hip always, dragon skull pauldron stays on shoulder as worn armor always, no dialogue, pure blue chroma key 0x0000FF background only, static camera no movement or zoom no push in no dolly, the dragon-head flame projection is a character-internal motion the camera does not move or pan or zoom, the magical flame is greenish-purple in color not pure green and never pure purple, the dragon head shape with two curved horns and snarling mouth and trailing wisp tail remains clearly visible to the camera at every moment of the lunge and the silhouette never simplifies into a generic flame ball or generic fireball, the silver horned dragon skull pauldron stays on her anatomical-left shoulder as worn armor throughout never held in hand never removed, a small greenish-purple dragon-shaped flame reforms above her anatomical-right palm on the settle, mouth stays closed in a smirk throughout the loop, no blue rim light no environment, seamless loop first and last frame match canonical pose with mouth closed in confident smirk, 6s
