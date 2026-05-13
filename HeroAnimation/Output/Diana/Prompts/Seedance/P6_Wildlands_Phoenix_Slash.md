# P6 — Wildlands Phoenix Slash (Seedance 2.0)

> Power movement | 7s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Diana.png`
> Concept: [concepts.md](../../concepts.md) — P6 (slate-mandatory VFX-heavy spectacle: rebel-rally + flaming-blade vertical chop + golden-flame phoenix silhouette)

## Notes for this concept
- **Slate-mandatory VFX-heavy spectacle (rebel-leader iconography reading)** — distinct from P5 (combat-spectacle whirlwind reading). Diana is "Wildlands Rebel Diana" per CSV; the phoenix flame channels her fiery hot-headed personality and red-hair visual rhyme.
- **Highest first-pass risk in the slate alongside P5** — apply all known mitigations preemptively. Recommend running P1 → P5 → P6 in that order so the keyer + prompt craft are tuned by the time we attempt the phoenix.
- **VFX color palette** — golden-orange flame (NOT white, NOT green). Golden-orange does not collide with green chroma key — keying compatibility is fine, no blue-chroma variant needed.
- **Phoenix silhouette painted in flame** — the riskiest VFX element in the slate. Apply Architect P1 elaborate-detail pattern: describe the phoenix concretely with 4-5 specific elements (spread wings flanking her body, head pointing forward, talons extending downward, body of flame, tail-feathers trailing), join with conjunctions not em-dashes, close with a comparison anchor, add Constraints negation of the simple-shape fallback (`not a generic flame burst, not a simple fireball, the phoenix shape with spread wings and a clear head and talons is clearly readable`).
- **Distinctive sword silhouette preservation** (Architect P4 lesson) — the burning blade is the focal element through the rally and chop. Apply (A) Subject silhouette geometry, (B) keep the broad face presented during the held flaming peak (vertical blade aloft = broad face presented to camera naturally), (C) explicit Constraint that the silhouette is clearly visible through the flame and never simplifies.
- **Mood-music inference risk** (Princess Sweet P1/P6 lesson) — heroic rally + theatrical pose + flame spectacle is high mood-music risk. Drop ALL `warm`/`serene`/`majestic`/`triumphant`-mood Action modifiers; replace with mechanical/physical descriptors. Lead Sound with `no voice no dialogue no music`, repeat at end. Add explicit Constraints `no music no orchestral no swells no melodic tones`. Vocal direction is a battle-roar (mechanical-sound territory).
- **Anatomical hand discipline** — sword in **left hand** raises overhead and ignites and chops. **Right hand** raises into the rebel-rally fist-up pose during the rally beat, returns to hip on settle.
- **Static camera prefix** — overhead raise + vertical chop is a high-vertical-motion beat that Seedance can misread as a camera tilt. Lead Subject with `static camera shot of...`.
- **Multi-beat with discrete timecoded segments** — rally raise / flame ignition / held flaming peak / vertical chop / phoenix paint / dissipate / recovery as discrete timecoded segments.
- **Always-hold sword** + **second-sword-stays-sheathed** at start of Constraints.
- **Loop integrity** — start and end frames match canonical (sword raised behind head, right hand on hip, smirk neutral, no VFX, no flame).

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, tilt up, environment, background scenery, talking, lipsync, voice,
sighs, moans, breathy sounds, gasps, vocalizations, music, orchestral, melodic,
choir, swelling music, realistic proportions, photorealistic, static frozen image,
flat lighting, blue rim light, cyan edge light, blue edge glow, warped hands,
warped face, extra arms, dropping the sword, sword switching hands,
second sword unsheathed, multiple chops, two swings, generic flame burst,
simple fireball, abstract fire shape, unreadable phoenix shape,
green flame, green VFX, green sparks, body spin, body pirouette,
mantle, full cape draped over shoulders, flame remains visible at end of loop
```

---

Subject:     static camera shot of a young scrappy warrior woman character with chibi proportions, slim athletic build, fair skin with rosy cheeks, bright green eyes, vibrant copper-red short tousled hair swept to one side with visible volume, wearing a teal turquoise knee-length tunic dress, a gray-brown fur shoulder collar around both shoulders, brown leather bracers on both forearms, a dark brown leather belt with bronze buckles layered with a second cross-belt, a teal cape matching the tunic partially visible behind her, brown fur-lined boots with chunky soles, holding a short sword with a clean silver blade and a gold spherical pommel and gold crossguard in her anatomical left hand at shoulder height with the blade angled up and back behind her head which is on the viewer's right side of the image, her anatomical right hand resting confidently on her hip near the belt which is on the viewer's left side of the image, a second matching short sword with a gold spherical pommel and gold crossguard sheathed at her right hip, the primary sword has a wide flat broad blade face and a clear gold spherical pommel and a gold horizontal crossguard the silhouette is unmistakably a short sword shape, in her canonical pose with a confident closed-mouth smirk

Action:      (0.0-0.4s) from her canonical pose she holds steady with the
             confident closed-mouth smirk and the primary sword raised
             in her anatomical left hand. (0.4-1.4s) her anatomical
             left hand raises the short sword in a slow rising arc
             until the blade is fully overhead with the tip pointing
             straight skyward and her left arm fully extended upward,
             simultaneously her anatomical right hand raises off her
             hip into a triumphant rebel-rally fist-up pose with her
             right arm extended upward, both her arms now raised
             overhead in a wide rebel-rallying stance with her chest
             open and her head tilted slightly back. (1.4-2.6s) at the
             rally peak the silver blade ignites with a burst of bright
             golden-orange flame, the flame wraps the entire sword
             from the gold pommel all the way up the silver blade to
             the tip with a bright gold core and orange flame-tongues
             licking outward and ten or more small upward-shedding
             ember particles drifting up from the burning blade, she
             holds the flaming-blade peak with her arms raised wide
             in the rally stance and a fierce open-mouth battle-roar
             expression on her face, the wide flat broad blade face is
             presented vertically to the camera with the gold spherical
             pommel and the gold crossguard still readable through the
             flame the sword silhouette stays clearly visible. (2.6-
             3.3s) she swings the flaming sword forward and downward
             in one decisive single overhand vertical chop her left
             arm bringing the burning blade from overhead down to
             chest height in front of her body, the chop leaves a
             massive vertical golden-orange flame slash-trail behind
             the blade as it travels with dense saturated golden-
             orange flame in a thick column roughly twice the width
             of a standard slash trail. (3.3-4.5s) as the chop
             completes the flame slash-trail expands outward and
             paints the silhouette of a phoenix in mid-air around her
             body in clear golden-orange flame, the phoenix has its
             two large feathered wings spread wide flanking her body
             on either side and its head pointing forward over her
             anatomical left shoulder and its talons extending
             downward toward her feet and a long tail-feather plume
             trailing behind, the phoenix shape is clearly readable
             as a phoenix silhouette with spread wings and a clear
             head and talons rendered in flame like a heraldic
             phoenix emblem painted in golden fire, she holds the
             post-chop pose with the sword forward at chest height
             and the phoenix flame silhouette held visible behind and
             around her body and her right fist still raised. (4.5-
             5.5s) the phoenix flame silhouette dissipates outward
             into twenty or more floating golden-orange ember
             particles that drift upward and outward and fade into
             the air, the flame on the blade itself burns down and
             extinguishes, the silver blade returns to clean steel.
             (5.5-6.3s) her anatomical left hand smoothly raises the
             short sword back to its canonical raised position at
             shoulder height with the blade angled up and back
             behind her head, her anatomical right hand drops back
             down to rest on her hip near the belt, her open-mouth
             battle-roar closes back into the confident closed-mouth
             smirk. (6.3-7.0s) settles back into her canonical pose,
             all flame and embers fully dissipated. Expression arc:
             confident closed-mouth smirk -> fierce determined
             intensity on the rally raise -> wild open-mouth battle-
             roar at the flaming-blade peak and the chop -> satisfied
             closed-mouth smirk recovery as the embers drift. The
             copper-red hair flares dramatically with the overhead
             raise and visually rhymes with the golden-orange flame,
             the teal cape billows upward and outward through the
             rally pose and sweeps forward with the chop and settles
             back, the gray-brown fur shoulder collar jiggles on the
             chop impact frame, the second sword sheathed at her
             right hip stays absolutely still throughout.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music no vocalizations, a rising wordless rebel battle-roar from the warrior building across the rally and landing on the chop like a Yaaaah HAAH, a bright golden-flame ignition crackle and whoosh as the blade ignites at the rally peak, a deeper roaring flame whoosh as the burning sword chops downward, a soft fading flame-ember sizzle as the phoenix silhouette dissipates into floating embers, a faint cloth flare from the teal cape on the rally raise and the chop, no voice no dialogue no music no orchestral no swells no vocalizations no humming

Constraints: sword stays in left hand always, second sword stays sheathed at right hip always, no dialogue, no actual words no actual speech the warrior's vocal sound is a single rising wordless rebel battle-roar only no dialogue, no music no orchestral no swells no melodic tones no choir, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no tilt up no follow, the rally raise and the chop are character-internal motion the camera stays absolutely locked off and does not move or tilt or zoom to follow the action, exactly one single overhand vertical chop not two chops not multiple chops not a flurry, the flame and the slash trail and the phoenix silhouette are all bright golden-orange in color with a gold core and orange flame-tongues never green not yellow-green not lime, the phoenix silhouette painted in flame is a clearly readable phoenix shape with two large spread wings flanking her body and a clear head pointing forward and clear talons extending downward and a tail-feather plume trailing not a generic flame burst not a simple fireball not an abstract fire shape not an unreadable blob the phoenix shape is a heraldic phoenix emblem painted in golden fire, the short sword in her anatomical left hand stays gripped firmly throughout never leaves her hand never switches to her right hand the gold spherical pommel stays gripped in her left hand at all times, the wide flat broad blade face and the gold spherical pommel and the gold crossguard of the sword remain clearly visible through the flame at every moment of the loop and the sword silhouette never simplifies into a generic blade shape never morphs into a spear, the second short sword with the gold pommel stays sheathed at her right hip absolutely still and unchanged throughout never comes loose never partially draws never appears in either hand never ignites with flame, her anatomical right hand starts on her hip and lifts only on the rally beat and returns to her hip on settle, the rally fist-up uses her anatomical right hand which is on the viewer's left side of the image, her feet stay planted no stepping no body spin no pirouette no rotation, the golden-orange flame on the blade and the flame slash-trail and the phoenix silhouette and all golden ember particles dissipate fully before the end of the loop the silver blade returns to clean steel before the loop ends, the gray-brown fur element at her shoulders stays as a small fur shoulder collar around the neck and shoulders not a full draped cape, mouth opens at the wild battle-roar peak and closes again on settle, no blue rim light no environment, seamless loop first and last frame match canonical pose with the confident closed-mouth smirk and the silver sword raised in her left hand with no flame and the right hand on the hip and the second sword sheathed at the right hip and no VFX visible, 7s
