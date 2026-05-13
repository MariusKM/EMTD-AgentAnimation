# P1 — Flourish Slash & Fist Pump (Seedance 2.0)

> Power movement | 5s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Diana.png`
> Concept: [concepts.md](../../concepts.md) — P1 (canonical client-direction beat: horizontal flourish-slash + held triumphant fist-punch verdict)

## Notes for this concept
- **Canonical client beat** — directly matches CSV Hero Screen description ("quick, graceful flourish with her sword, finishing by punching her fist into the air with a confident and passionate expression"). Also mirrors the existing Diana reference in `Examples/diana-with-aac-audio.mov` but tightened to a single slash + held fist-pump (vs. the reference's double-slash) so the verdict reads cleanly.
- **Anatomical hand discipline** — sword in **left hand** (anatomical, viewer's right side of image), fist pump uses **right hand** (anatomical, viewer's left side of image). Both hands are active mid-beat: left does the slash, right starts on hip and pumps up at the slash completion.
- **Single slash, not double** — keep prompt clean of "second slash" / "double slash" / "two arcs" wording.
- **Static camera prefix** — fast horizontal slash + fist-up motion is a high-motion beat that Seedance can misread as a camera tilt-up. Lead Subject with `static camera shot of...`.
- **Always-hold sword** + **second-sword-stays-sheathed** at start of Constraints.
- **Augmented VFX** (per concept doc) — slash-trail arc + mid-arc spark-burst + post-slash blade aura-gleam + fist-pump star-flash with light ring. White palette throughout (no green, no chroma collision).
- **Vocal direction** — short sharp wordless battle-cry shout ("Ha!" / "Hyah!") at the slash impact moment. Keep cry short — long shouts trip mood-music inference (Princess Sweet lesson).
- **Loop integrity** — start and end frames match canonical (sword raised behind head, right hand on hip, smirk neutral, no VFX).

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, tilt up, environment, background scenery, talking, lipsync, voice,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the sword, sword switching hands, second sword unsheathed,
two slashes, double slash, multiple slashes, sword spinning,
green slash trail, green sparks, green VFX, body spin, body pirouette,
mantle, full cape draped over shoulders
```

---

Subject:     static camera shot of a young scrappy warrior woman character with chibi proportions, slim athletic build, fair skin with rosy cheeks, bright green eyes, vibrant copper-red short tousled hair swept to one side with visible volume, wearing a teal turquoise knee-length tunic dress, a gray-brown fur shoulder collar around both shoulders, brown leather bracers on both forearms, a dark brown leather belt with bronze buckles layered with a second cross-belt, a teal cape matching the tunic partially visible behind her, brown fur-lined boots with chunky soles, holding a short sword with a clean silver blade and a gold spherical pommel and gold crossguard in her anatomical left hand at shoulder height with the blade angled up and back behind her head which is on the viewer's right side of the image, her anatomical right hand resting confidently on her hip near the belt which is on the viewer's left side of the image, a second matching short sword with a gold spherical pommel and gold crossguard sheathed at her right hip, in her canonical pose with a confident closed-mouth smirk

Action:      from her canonical pose she gives a brief crisp anticipation
             pull-back of the short sword in her anatomical left hand,
             the blade arcs slightly further back behind her head as her
             body coils a touch, then she sweeps the sword in one fast
             wide horizontal slash from her anatomical right side across
             to her anatomical left side at chest height in front of her
             body, the silver blade leaves a bright white slash-trail
             arc curving cleanly across the air in front of her with a
             sharp leading edge and a soft fading tail, a small bright
             white spark-burst appears at the slash midpoint as the
             blade reaches peak velocity, and as the slash completes
             her anatomical right hand pumps up off her hip into a
             triumphant fist-pump raised into the air at face height,
             her right fist held in the raised pose with a small
             bright white star-flash appearing at her knuckles and a
             faint expanding white light-ring radiating outward
             briefly, she holds the fist-pump verdict pose for a beat
             with a brief triumphant grin, then her sword swings
             smoothly back up to its canonical raised position behind
             her head and her right fist drops back down to rest on
             her hip, the white slash trail and the spark burst and
             the fist-flash all dissipate fully before the end of the
             loop, settles back into her canonical pose. Expression
             arc: confident closed-mouth smirk -> fierce focused eyes
             during the slash -> brief triumphant grin at the held
             fist-pump peak -> confident closed-mouth smirk recovery.
             The copper-red hair bounces and follows her head with
             slight delay, the teal cape flares outward on the slash
             and settles back, the gray-brown fur shoulder collar
             jiggles subtly on the slash peak frame, the second sword
             sheathed at her right hip stays absolutely still
             throughout.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music no vocalizations, a sharp short wordless battle-cry shout from the warrior at the peak of the slash like a quick Ha or Hyah, a clean sword-cut whoosh as the blade sweeps through the air, a soft white shimmer as the slash-trail forms and dissipates, a small bright air whoosh on the fist-pump peak, a faint cloth flare from the teal cape on the slash, no voice no dialogue no music no vocalizations no humming

Constraints: sword stays in left hand always, second sword stays sheathed at right hip always, no dialogue, no actual words no actual speech the warrior's vocal sound is a single sharp wordless battle-cry shout only no dialogue, no music no orchestral no swells no melodic tones, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no tilt up, exactly one single horizontal slash not two slashes not a double slash not multiple slashes, the slash sweeps from her anatomical right to her anatomical left across her body once and once only, the slash trail is bright white not green not yellow-green not lime, all spark and flash and ring VFX are bright white or pale silver never green, the short sword in her anatomical left hand stays gripped firmly throughout never leaves her hand never switches to her right hand the gold spherical pommel stays gripped in her left hand at all times, the second short sword with the gold pommel stays sheathed at her right hip absolutely still and unchanged throughout never comes loose never partially draws never appears in either hand, her anatomical right hand starts on her hip and lifts only on the fist-pump beat and returns to her hip on settle, the fist-pump uses her anatomical right hand which is on the viewer's left side of the image, her feet stay planted no stepping no body spin no pirouette no rotation, the white slash-trail and all spark bursts and flashes and rings dissipate fully before the end of the loop, the gray-brown fur element at her shoulders stays as a small fur shoulder collar around the neck and shoulders not a full draped cape, mouth opens only briefly at the triumphant grin peak and closes again on settle, no blue rim light no environment, seamless loop first and last frame match canonical pose with the confident closed-mouth smirk and the sword raised in her left hand and the right hand on the hip and the second sword sheathed at the right hip and no VFX visible, 5s
