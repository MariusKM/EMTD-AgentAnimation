# P4 — Fencer's Forward Lunge (Seedance 2.0)

> Power movement | 5s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Diana.png`
> Concept: [concepts.md](../../concepts.md) — P4 (forward thrust + held challenging stare, finesse-over-force fencer's riposte)

## Notes for this concept
- **Forward thrust kinetic axis** — distinct from P1/P3 slash variants. Covers the "stab" half of the CSV "stabs and slashes" attack style.
- **Critical: forward-lean read as camera zoom** (Spy lesson) — the forward lunge motion is at high risk of being interpreted by Seedance as a camera push-in / dolly-in. **Mitigations**: (a) lead Subject with `static camera shot of...` (mandatory); (b) express the lunge as a character-internal beat (`her body coils forward into a low fencer's lunge stance with her front foot extending forward and her back leg bracing`) NOT as a forward-lean toward viewer; (c) lock down with explicit Constraints `static camera no movement or zoom no push in no dolly` and `the lunge is a character-internal forward weight shift the camera does not move or push in or zoom in to follow the lunge`.
- **Anatomical hand discipline** — sword in **left hand** drives the thrust forward. **Right hand** sweeps backward behind the hip in a balancing flourish (matches the forward extension). This means the right hand briefly leaves the hip during the lunge but returns to the hip on the recovery.
- **Linear forward slash trail** — distinct from P1 curved arc and P3 straight diagonal. Streaks straight forward along the blade path with a sharp bright tip-flash.
- **Vocal direction** — sharp short clipped wordless punching exhale ("Tah!" / "Hut!"). Distinct from the wider battle-cries of P1 and P3.
- **Always-hold sword** + **second-sword-stays-sheathed** + **right hand returns to hip** at start of Constraints.
- **Loop integrity** — start and end frames match canonical (sword raised behind head, right hand on hip, balanced stance).

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, push toward viewer, dolly in, environment, background scenery,
talking, lipsync, voice, realistic proportions, photorealistic, static frozen image,
flat lighting, blue rim light, cyan edge light, blue edge glow, warped hands,
warped face, extra arms, dropping the sword, sword switching hands,
second sword unsheathed, lean toward viewer, character moves forward toward camera,
upper body leans toward viewer, two slashes, multiple slashes, sword spinning,
curved arc trail, diagonal trail, green slash trail, green sparks, green VFX,
body spin, body pirouette, mantle, full cape draped over shoulders
```

---

Subject:     static camera shot of a young scrappy warrior woman character with chibi proportions, slim athletic build, fair skin with rosy cheeks, bright green eyes, vibrant copper-red short tousled hair swept to one side with visible volume, wearing a teal turquoise knee-length tunic dress, a gray-brown fur shoulder collar around both shoulders, brown leather bracers on both forearms, a dark brown leather belt with bronze buckles layered with a second cross-belt, a teal cape matching the tunic partially visible behind her, brown fur-lined boots with chunky soles, holding a short sword with a clean silver blade and a gold spherical pommel and gold crossguard in her anatomical left hand at shoulder height with the blade angled up and back behind her head which is on the viewer's right side of the image, her anatomical right hand resting confidently on her hip near the belt which is on the viewer's left side of the image, a second matching short sword with a gold spherical pommel and gold crossguard sheathed at her right hip, in her canonical pose with a confident closed-mouth smirk

Action:      from her canonical pose she gives a brief small wind-up
             pulling the short sword tip a touch further back behind
             her head while her anatomical right hip pulls back in a
             fencer's coil, then she drives the short sword in her
             anatomical left hand forward in one fast precise fencer's
             thrust extending her left arm fully forward at chest
             height with the silver blade horizontal and the tip
             pointing forward toward the viewer, simultaneously her
             body coils forward into a low fencer's lunge stance with
             her anatomical right foot stepping forward into the
             extended front-foot position and her anatomical left leg
             bracing back stretched behind her, her anatomical right
             hand sweeps backward off her hip behind her right hip in
             a balancing fencer's flourish to counterbalance the
             forward sword extension, a short bright white linear
             slash-trail streaks straight forward along the blade path
             with a sharp leading edge at the tip, at the moment the
             lunge fully extends a bright concentrated white tip-flash
             pops at the blade tip and a small expanding white light-
             ring radiates outward from the tip briefly, three or four
             small white sparkle particles trail back along the blade-
             path streak as the trail begins to dissipate, a subtle
             white speed-streak runs along the length of the blade
             itself during the forward extension as a rim-of-light on
             the blade silhouette, she holds the lunge pose briefly
             with a fierce smirking gaze locked forward toward the
             viewer in a challenging stare, then her body smoothly
             recovers from the lunge stance back to her canonical
             upright balanced stance as her anatomical right foot
             steps back to the canonical position, her anatomical
             right hand returns from the backward flourish to rest on
             her hip, her short sword swings smoothly back up to its
             canonical raised position behind her head, all white VFX
             dissipates fully before the end of the loop, settles back
             into her canonical pose. Expression arc: confident
             closed-mouth smirk -> focused fierce eyes during the
             lunge -> held intimidating closed-mouth smirk during the
             challenging stare peak -> confident closed-mouth smirk
             recovery. The copper-red hair sweeps back with the
             forward lunge motion, the teal cape billows backward
             dramatically with the forward weight shift and settles
             back, the gray-brown fur shoulder collar jiggles subtly
             on the lunge.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music no vocalizations, a sharp short clipped wordless punching exhale shout from the warrior at the moment of the lunge extension like a clipped Tah or Hut, a tight sword-cut whoosh as the blade drives forward, a soft bright tip-flash crackle as the white tip-flash pops at the lunge peak, a faint cloth flare from the teal cape billowing backward with the forward weight shift, no voice no dialogue no music no vocalizations no humming

Constraints: sword stays in left hand always, second sword stays sheathed at right hip always, no dialogue, no actual words no actual speech the warrior's vocal sound is a single sharp short clipped wordless punching exhale shout only no dialogue, no music no orchestral no swells no melodic tones, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no tilt up no follow, the lunge is a character-internal forward weight shift the camera does not move or push in or zoom in or dolly in or pan to follow the lunge the camera stays absolutely locked off the entire loop, her body coils forward into a low fencer's lunge stance with her front foot extending forward and her back leg bracing this is character-internal motion not a camera move not the camera moving toward the character, exactly one single forward thrust not two thrusts not multiple thrusts not a flurry, the slash trail is a short bright white linear streak straight forward along the blade path not a curved arc not a diagonal not a sweeping shape, all spark and flash and ring VFX are bright white or pale silver never green not yellow-green not lime, the short sword in her anatomical left hand stays gripped firmly throughout never leaves her hand never switches to her right hand the gold spherical pommel stays gripped in her left hand at all times, the second short sword with the gold pommel stays sheathed at her right hip absolutely still and unchanged throughout never comes loose never partially draws never appears in either hand, her anatomical right hand sweeps briefly backward behind her right hip in a balancing flourish during the lunge and returns to rest on her hip on the recovery the right hand ends the loop on her hip in the canonical position, the white slash-trail and tip-flash and light-ring and sparkles and speed-streak all dissipate fully before the end of the loop, her body returns from the lunge stance back to the canonical upright balanced stance by the end of the loop her feet are in the canonical position at the first and last frame, no body spin no pirouette no rotation, the gray-brown fur element at her shoulders stays as a small fur shoulder collar around the neck and shoulders not a full draped cape, mouth stays in the closed smirk throughout, no blue rim light no environment, seamless loop first and last frame match canonical pose with the confident closed-mouth smirk and the sword raised in her left hand and the right hand on the hip and the second sword sheathed at the right hip and no VFX visible and the body in the canonical balanced stance, 5s
