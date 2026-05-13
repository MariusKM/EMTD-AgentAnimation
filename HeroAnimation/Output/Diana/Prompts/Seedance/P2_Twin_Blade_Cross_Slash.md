# P2 — Twin-Blade Cross Slash (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Diana.png`
> Concept: [concepts.md](../../concepts.md) — P2 (dual-wield multi-beat: draw second sword → X-cross slashes → re-sheath)

## Notes for this concept
- **Dual-wield multi-beat power move** — leverages the second sword sheathed at her right hip per Stage 1 user direction. This is the only Diana concept (alongside P5) that draws the second sword.
- **FFLF integrity is critical** — second sword starts sheathed at right hip and ends sheathed at right hip. The middle of the loop is the dual-wield beat; the start and end frames must match the canonical single-sword pose.
- **Multi-beat with discrete timecoded segments** per the Architect Stage 5 lesson — the action body is timecoded so Seedance does not collapse the draw + X-cross + re-sheath into one continuous circular motion.
- **Anatomical hand discipline** — primary sword stays in **left hand** (anatomical, viewer's right of image) throughout. The second sword is drawn by her **right hand** (anatomical, viewer's left of image) from the right hip and re-sheathed there at end.
- **X-cross VFX read** — two diagonal slash-trail arcs forming a clear X-shape in front of her chest at the peak. White palette throughout (no green, no chroma collision).
- **Always-hold left sword** + explicit "second sword starts and ends sheathed at right hip" at the start of Constraints.
- **Static camera prefix** — fast multi-beat with prop draw is high-motion content that Seedance can read as camera movement. Lead Subject with `static camera shot of...`.
- **Vocal direction** — two-syllable wordless battle shout matching the two-slash rhythm.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, voice,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the sword, dropping the second sword, sword switching hands,
second sword still sheathed at peak, second sword left in hand at end,
single sword power move, three slashes, multiple slashes, sword spinning, sword flipping,
green slash trail, green sparks, green VFX, body spin, body pirouette,
mantle, full cape draped over shoulders
```

---

Subject:     static camera shot of a young scrappy warrior woman character with chibi proportions, slim athletic build, fair skin with rosy cheeks, bright green eyes, vibrant copper-red short tousled hair swept to one side with visible volume, wearing a teal turquoise knee-length tunic dress, a gray-brown fur shoulder collar around both shoulders, brown leather bracers on both forearms, a dark brown leather belt with bronze buckles layered with a second cross-belt, a teal cape matching the tunic partially visible behind her, brown fur-lined boots with chunky soles, holding a short sword with a clean silver blade and a gold spherical pommel and gold crossguard in her anatomical left hand at shoulder height with the blade angled up and back behind her head which is on the viewer's right side of the image, her anatomical right hand resting confidently on her hip near the belt which is on the viewer's left side of the image, a second matching short sword with a gold spherical pommel and gold crossguard sheathed at her right hip, in her canonical pose with a confident closed-mouth smirk

Action:      (0.0-0.3s) from her canonical pose she holds steady with the
             confident closed-mouth smirk and the primary sword raised
             in her anatomical left hand. (0.3-0.8s) her anatomical
             right hand swiftly draws the second short sword from the
             sheath at her right hip in one fluid fast motion, a
             silver-white blade-gleam streaks along the second blade
             as it leaves the sheath, the second sword now held at
             shoulder height in her anatomical right hand with the
             blade angled up and back behind her on her right side
             mirroring the canonical left-hand sword pose, briefly
             held in a dual-wield ready stance with both swords aloft.
             (0.8-1.4s) her primary sword in her anatomical left hand
             cuts diagonally from upper-anatomical-left down to lower-
             anatomical-right across the front of her body, the silver
             blade leaves a bright white diagonal slash-trail arc with
             a sharp leading edge. (1.4-2.0s) immediately after, the
             second sword in her anatomical right hand cuts diagonally
             from upper-anatomical-right down to lower-anatomical-left
             across the front of her body in the opposing direction,
             the silver blade leaves a second bright white diagonal
             slash-trail arc that crosses the first arc forming a
             clear bright white X-shape in front of her chest. At the
             moment the second arc crosses the first, a bright white
             spark-burst of eight to ten distinct sparkle particles
             explodes outward from the X-intersection point and a
             faint expanding white light-ring radiates outward from
             the X-center for a beat. (2.0-2.7s) holds the dual-wield
             X-cross peak pose with both swords held forward at her
             sides extended outward, a brief triumphant grin, the
             X-shape slash trails visible in front of her chest. (2.7-
             3.4s) the X-cross slash trails and the spark-burst and
             the light-ring all begin to fade and dissipate, her
             anatomical right hand smoothly returns the second sword
             to its sheath at her right hip with another silver-white
             blade-gleam streak as it slides home, her right hand then
             returns to rest on her hip near the belt. (3.4-4.0s) her
             primary sword in her left hand returns to its canonical
             raised position at shoulder height with the blade angled
             up and back behind her head. (4.0-6.0s) settles back into
             her canonical pose, the smirk closes back to its neutral
             resting form, all VFX fully dissipated. Expression arc:
             confident closed-mouth smirk -> fierce focused warrior
             face on the draw -> intense warrior face during the X-
             slash -> triumphant grin during the held X-peak ->
             confident closed-mouth smirk recovery on the re-sheath.
             The copper-red hair flares with each slash and the body
             twist, the teal cape flares outward dramatically on the
             X-cross and settles back, the gray-brown fur shoulder
             collar jiggles on each slash impact.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music no vocalizations, a sharp wordless inhale-and-shout from the warrior on the draw beat like a quick Hah followed by a punching exhale shout on the X-cross peak like HAH, a clean steel-on-leather sword-draw schwing as the second sword leaves the sheath, two clean sword-cut whooshes for the two diagonal slashes, a soft white shimmer as the slash-trail X-shape forms, a soft bright crackle as the spark-burst explodes from the X-center, a clean steel-on-leather sword-sheath sound as the second sword returns home, a faint cloth flare from the teal cape, no voice no dialogue no music no vocalizations no humming

Constraints: left sword in left hand always, second sword starts and ends sheathed at right hip, no dialogue, no actual words no actual speech the warrior's vocal sounds are a sharp wordless inhale-shout on the draw and a sharp wordless punching exhale shout on the X-peak only no dialogue, no music no orchestral no swells no melodic tones, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly, the second short sword with the gold pommel starts sheathed at her right hip at the very first frame of the loop and is sheathed back at her right hip by the end of the loop the very last frame matches the canonical single-sword pose, exactly two diagonal slashes total one with each sword forming a single clear X-shape not three slashes not a flurry not multiple X-shapes, the X-shape slash trails are bright white not green not yellow-green not lime, all spark and flash and ring VFX are bright white or pale silver never green, the primary short sword in her anatomical left hand stays gripped firmly throughout never leaves her hand never switches hands the gold spherical pommel stays gripped in her left hand at all times, the second sword is gripped only by her anatomical right hand during the dual-wield beat and is firmly returned to the sheath at the right hip on the recovery, neither sword spins neither sword flips neither sword flourishes the slash motions are clean diagonal cuts only, the dual-wield X-cross slash trails and all spark and flash and ring VFX dissipate fully before the end of the loop, her feet stay planted no stepping no body spin no pirouette no rotation her body stays facing forward in the canonical three-quarter view throughout, the gray-brown fur element at her shoulders stays as a small fur shoulder collar around the neck and shoulders not a full draped cape, mouth opens only briefly at the triumphant grin peak and closes again on settle, no blue rim light no environment, seamless loop first and last frame match canonical pose with the confident closed-mouth smirk and the primary sword raised in her left hand and the right hand on the hip and the second sword sheathed at the right hip and no VFX visible, 6s
