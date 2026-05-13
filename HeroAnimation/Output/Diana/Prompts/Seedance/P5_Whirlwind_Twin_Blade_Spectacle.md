# P5 — Whirlwind Twin-Blade Spectacle (Seedance 2.0)

> Power movement | 7s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Diana.png`
> Concept: [concepts.md](../../concepts.md) — P5 (slate-mandatory VFX-heavy spectacle: dual-wield 360° pirouette + multi-arc cyclone)

## Notes for this concept
- **Slate-mandatory VFX-heavy spectacle** — the gameplay-canonical Diana whirlwind attack per Silviu notes ("Dual wielder, attacks with both swords, performs whirlwind attacks").
- **Highest first-pass risk in the slate** — apply all known mitigations preemptively. Recommend running P1 (or P3) FIRST so the keyer + prompt craft are tuned to Diana's quirks before attempting P5.
- **`twirl`/`spin` body-rotation read** (Fat Princess P4 lesson) — the pirouette must be locked precisely as exactly one complete 360-degree rotation in place, ending facing forward. Pair with explicit `camera does not orbit only the character turns in place`.
- **Dual-wield integrity** — second sword starts sheathed at right hip, is drawn at the start of the beat, and is sheathed back at right hip by the end of the loop. FFLF first/last frame match canonical single-sword pose.
- **Distinctive sword silhouette preservation** (Architect P4 lesson) — the two swords are visible throughout the rotation. Apply (A) Subject silhouette geometry concretely, (B) keep the broad face of each blade presented to camera at multiple points during the rotation, (C) explicit Constraint that the silhouettes never simplify into generic shapes.
- **Multi-beat with discrete timecoded segments** per the Architect Stage 5 lesson — draw → spin → held peak → re-sheath as four discrete timecoded segments.
- **Multi-arc whirlwind cyclone VFX** — 8-10 distinct white arc-segments at varying radii forming a radial vortex around her at chest height, plus 10+ scattered white sparkles, plus a vertical light pillar (the "eye of the storm"), plus a ground shockwave ring, plus 12-15 hanging white embers at the held peak. White palette throughout (no green, no chroma collision).
- **VFX intricacy upgrade pattern** (Architect P1 lesson) — describe the cyclone with elaborate ornate detail, name 4-5 concrete distinct VFX elements layered into the figure, join with conjunctions not em-dashes, close with a comparison anchor, add explicit Constraints negation of the simple-shape fallback.
- **Mood-music inference risk** (Princess Sweet P1/P6 lesson) — heroic spectacle has high mood-music risk. Drop all `warm`/`serene`/`majestic` modifiers from Action. Lead Sound with `no voice no dialogue no music`, repeat at end. Add explicit Constraints `no music no orchestral no swells no melodic tones`. Vocal direction is a battle-roar (mechanical-sound territory) which helps.
- **Static camera prefix** — high-motion rotation is at high risk of being read as a camera orbit. Lead Subject with `static camera shot of...` and lock down camera with explicit Constraints.
- **Always-hold left sword** + **second sword starts and ends sheathed at right hip** at start of Constraints.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, camera orbit, camera circles around character, environment,
background scenery, talking, lipsync, voice, sighs, moans, breathy sounds,
gasps, giggles, vocalizations, music, orchestral, melodic, choir, swelling music,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the sword, dropping the second sword, sword switching hands,
second sword still sheathed at peak, second sword left in hand at end,
multiple rotations, two pirouettes, three spins, character chains spins,
generic blade shape, simplified sword silhouette, sword morphs into spear,
green slash trail, green sparks, green VFX, green cyclone, green vortex,
mantle, full cape draped over shoulders
```

---

Subject:     static camera shot of a young scrappy warrior woman character with chibi proportions, slim athletic build, fair skin with rosy cheeks, bright green eyes, vibrant copper-red short tousled hair swept to one side with visible volume, wearing a teal turquoise knee-length tunic dress, a gray-brown fur shoulder collar around both shoulders, brown leather bracers on both forearms, a dark brown leather belt with bronze buckles layered with a second cross-belt, a teal cape matching the tunic partially visible behind her, brown fur-lined boots with chunky soles, holding a short sword with a clean silver blade and a gold spherical pommel and gold crossguard in her anatomical left hand at shoulder height with the blade angled up and back behind her head which is on the viewer's right side of the image, her anatomical right hand resting confidently on her hip near the belt which is on the viewer's left side of the image, a second matching short sword with a gold spherical pommel and gold crossguard sheathed at her right hip, both swords are clean silver short swords with a wide flat broad blade face engraved with subtle detail and a clear gold spherical pommel and a gold horizontal crossguard the silhouette is unmistakably a short sword shape, in her canonical pose with a confident closed-mouth smirk

Action:      (0.0-0.4s) from her canonical pose she holds steady with the
             confident closed-mouth smirk and the primary sword raised
             in her anatomical left hand. (0.4-0.9s) her anatomical
             right hand swiftly draws the second short sword from the
             sheath at her right hip in one fluid fast motion, a
             silver-white blade-gleam streaks along the second blade as
             it leaves the sheath, both swords now held aloft at
             shoulder height in a brief dual-wield ready stance. (0.9-
             2.1s) she executes exactly one full controlled three
             hundred sixty degree pirouette in place rotating clockwise
             as seen from above, her body turns once completely around
             ending facing forward exactly where she started, both
             swords sweep through wide horizontal arcs around her body
             at chest height, both blade silhouettes remain clearly
             visible throughout the rotation with the broad face of
             each blade presented to the camera at multiple points and
             the gold spherical pommels and gold crossguards remain
             readable at all times, as she rotates the two blades trail
             a dense whirlwind cyclone of bright white slash-trail arcs
             that wrap radially around her body forming an elaborate
             multi-arc vortex with eight to ten distinct overlapping
             arc-segments at varying radii and varying heights all
             woven together into a dense radial cyclone pattern. (2.1-
             3.5s) she lands in a held two-blade peak pose facing
             forward with both swords angled outward at her sides in a
             wide stance and her feet planted, she opens into a fierce
             triumphant open-mouth grin, the multi-arc whirlwind
             cyclone holds visible around her at chest height as the
             readable spectacle peak with the radial vortex of arcs
             still wrapping her silhouette and ten or more bright white
             sparkle particles scattering outward from the cyclone,
             during the held peak a translucent vertical column of
             white energy rises from her feet to slightly above her
             head framing the cyclone like the eye of the storm, a
             bright white shockwave ring expands outward at ground
             level from beneath her feet for a brief beat, twelve to
             fifteen tiny drifting white embers hang in the air around
             her at chest height. (3.5-4.5s) the whirlwind cyclone and
             the vertical light pillar and the shockwave ring and the
             scattered sparkles and the hanging embers all dissipate
             outward fading into the air around her, her anatomical
             right hand smoothly returns the second sword to its sheath
             at her right hip with another silver-white blade-gleam
             streak as it slides home, her right hand then returns to
             rest on her hip near the belt. (4.5-5.5s) her primary
             sword in her anatomical left hand returns to its canonical
             raised position at shoulder height with the blade angled
             up and back behind her head, her open-mouth grin closes
             back to the confident closed-mouth smirk. (5.5-7.0s)
             settles back into her canonical pose, all VFX fully
             dissipated. Expression arc: confident closed-mouth smirk
             -> focused warrior face on the draw -> wild fierce eyes
             during the spin -> triumphant open-mouth grin during the
             held two-blade peak -> confident closed-mouth smirk
             recovery on the re-sheath. The copper-red hair fans
             outward dramatically with the rotation, the teal cape
             billows in a wide skirt-like flare around her body during
             the spin and settles back, the gray-brown fur shoulder
             collar jiggles vigorously through the rotation.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music no vocalizations, a rising wordless battle-roar from the warrior building across the rotation and landing on the held peak like a Yaaah HAH, two clean steel-on-leather sword-draw schwings as the second sword leaves and returns to the sheath, the whirlwind whoosh of two blades crossing the air repeatedly during the rotation, a soft bright shimmer as the multi-arc cyclone forms and dissipates, a soft thump as the shockwave ring expands at ground level, a faint cloth flare from the teal cape on the rotation, no voice no dialogue no music no orchestral no swells no vocalizations no humming

Constraints: left sword in left hand always, second sword starts and ends sheathed at right hip, no dialogue, no actual words no actual speech the warrior's vocal sound is a single rising wordless battle-roar only no dialogue, no music no orchestral no swells no melodic tones no choir, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no orbit no pan, the camera stays absolutely locked off and does not orbit around her does not circle her does not follow her rotation only the character turns in place, exactly one single complete three hundred sixty degree pirouette in place not two rotations not three spins not chained spins not multiple pirouettes she ends the rotation facing forward exactly where she started, the second short sword with the gold pommel starts sheathed at her right hip at the very first frame of the loop and is sheathed back at her right hip by the end of the loop the very last frame matches the canonical single-sword pose, both swords are short swords with a wide flat broad blade face and a clear gold spherical pommel and a gold horizontal crossguard the full sword silhouette including the broad blade face and the gold pommel and the gold crossguard remains clearly visible to the camera at every moment of the loop and the silhouette never simplifies into a generic blade shape never morphs into a spear never morphs into a dagger, the multi-arc whirlwind cyclone is bright white not green not yellow-green not lime, all spark and flash and ring and pillar and ember VFX are bright white or pale silver never green, the cyclone is an elaborate dense radial vortex of eight to ten distinct overlapping arc-segments at varying radii woven together not a single simple ring not a basic cross-hair not a single circular swoosh, the primary short sword in her anatomical left hand stays gripped firmly throughout never leaves her hand never switches hands the gold spherical pommel stays gripped in her left hand at all times, the second sword is gripped only by her anatomical right hand during the dual-wield rotation and is firmly returned to the sheath at the right hip on the recovery, neither sword spins independently in her hand neither sword flips, the multi-arc cyclone and the vertical light pillar and the shockwave ring and all sparkles and embers dissipate fully before the end of the loop, her feet stay planted on the ground throughout the rotation no jumping no leaping, the gray-brown fur element at her shoulders stays as a small fur shoulder collar around the neck and shoulders not a full draped cape, mouth opens at the held triumphant peak and closes again on settle, no blue rim light no environment, seamless loop first and last frame match canonical pose with the confident closed-mouth smirk and the primary sword raised in her left hand and the right hand on the hip and the second sword sheathed at the right hip and no VFX visible and her body facing forward, 7s
