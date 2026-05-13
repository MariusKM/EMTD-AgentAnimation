# P10 — Triple Blueprint Cascade (Seedance 2.0)

> Power movement | 7s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Architect.png`
> Concept: [concepts.md](../../concepts.md) — P10 (off-screen via parchment streaming past three frame edges, VFX-heavy with three independent blueprints, uses canonical scrolls)
>
> **Iteration note**: an earlier P10 draft used a generic "surveyor's chain" VFX which the user rejected at concept stage on the grounds that the architect doesn't canonically own a chain. Replaced with this concept which uses his actual scroll bundle as the source of the off-screen extension.

## Notes for this concept

- **Concept reframed v2 2026-04-28** — first-pass output (v1) was approved by user but they wanted "more scrolls and a more epic effect." v2 reframe: cascade expanded from 3 parchment streams in 3 directions to **6 parchment streams in 6 directions** (peacock fan around the architect — lower-left, far-left, upper-left, upper-right, far-right, lower-right). Architect is now wrapped in a **brass-gold radiant aura** that glows around his silhouette through the cascade and flares brighter at a **synchronized mega-pulse** at the verdict moment. Each blueprint upgraded from concentric arcs to **non-circular technical content with equations** (rectangular schematics, vector arrows, mathematical formulas with Greek letters, dimension lines, coordinate axes — same content shift as P9 v2).
- **High-risk concept** — multi-beat sequence + very heavy VFX (six independent blueprints + brass-gold aura + synchronized mega-pulse) + off-screen extension on six different edges + scroll bundle integrity (canonical 3 scrolls expand to phantom additional scrolls mid-loop and must collapse back). Watch generations carefully.
- **Off-screen mechanism**: parchment streams cascade from the bundle outward in six different directions and each stream extends continuously past its respective frame edge or corner off-screen.
- **Bundle integrity** — the canonical three scrolls stay seated in his left arm bundle throughout. Only the parchment (and any phantom additional scrolls inside the brass-gold radiance) streams outward. Phantom scrolls dissolve back into the bundle. Bundle silhouette returns to three intact coiled scrolls by the end of the loop.
- **VFX intricacy applied to each blueprint** (P1/P5/P9 pattern). Named elements per blueprint: nested concentric arcs, fine tick-mark notches, small dimension lines with drafting-style numerical notations, small overlapping circles, fine radius lines, small triangles of fine line work, rich ornamental drafting details. Comparison anchor: `like detailed ornate architectural blueprints with rich ornamental complexity`. Constraints negate the simple-shape fallback.
- **Discrete-beat language** — anticipation → command gesture → cascade → verdict → retract → settle are 6 discrete events. Timecoded markers in Action.
- **Broad-face presentation** of the blade throughout (silhouette-morph rule from P4).
- **Closed-mouth FFLF**, anatomical hand discipline, `coiled` / `unfurl` / `re-coil` for scroll language (Section A2).
- **Section A4 retention** — blade noun kept here because the blade gesture is a refined commanding-instrument beat in the smug-architect register.
- **Purpose framing** (article B2) — the gesture is `as a presenting-my-masterworks command`.
- **Safe vocabulary** — `elaborate`, `ornate`, `detailed`, `rich ornamental detail`, `architectural blueprint`. NO `compass-and-dividers`, `construction circles/triangle`, `vesica-piscis`, `network`, `draftsman's working diagram`, `constructs itself`.
- **v2→v3 iteration 2026-04-28** — v2 generated visually but hit an output-audio-safety rejection (Section A6 family 2 extension). Suspected triggers: `brass-gold radiance hum` (`hum` is voice-coded — humming is a vocal action) and `sustained crescendo of parchment-paper unfurl crinkles` (`crescendo` is music-coded). P9 v2 with near-identical Sound but without `hum` and without `crescendo` passed, isolating these two as the audio-safety triggers. v3 replaces `hum` → `shimmer`, `crescendo` → `sequence`, plus `whisper` → `tick-shimmer of fine quill strokes` as defensive cleanup.
- **v3→v4 iteration 2026-04-28** — v3 still hit the same audio-safety rejection. Operator error: I missed `chime` in `a clean bright synchronized chime as the mega-pulse flares at the verdict moment`. Section A6 family 2 explicitly bans `chime` as a musical-instrument word — it just wasn't carried over from the existing rule list during the v2→v3 cleanup. v4 replaces `chime` → `clean sharp synchronized snap` (mechanical, non-musical). Also stripped three `sustained` modifiers from the multi-shimmer items (`sustained sequence` → `sequence`, `soft sustained ink-blue inscription tick-shimmer` → `soft ink-blue inscription tick-shimmer`, `soft sustained brass-gold radiance shimmer` → `soft brass-gold radiance shimmer`) on the hypothesis that stacked `sustained` items cumulate into something the audio classifier reads as a music swell. **Authoring rule reinforced**: when stripping audio-flagged words from a Sound line, run the result against the FULL Section A6 family 2 banned-word list, not just the words that triggered the immediate rejection. See `Docs/PromptGuides/Seedance/seedance2_content_flags.md` Section A6 family 2 for the rule on voice-coded and music-coded vocabulary in Sound.
- **v4→v5 iteration 2026-04-28** — v4 generated successfully (no rejection) but the output audio contained **actual speech** at the verdict beat, even though Sound bracketed `no voice no dialogue no music` at both ends and Constraints said `no dialogue`. Two suspected causes: (1) the Action body had a quoted personality phrase `with smug "I have unveiled my masterworks" verdict` — the audio model reads Action as scene context (per Section A6 family 2) and a literal quoted phrase is essentially telling the model what speech happens at this beat; (2) the light ban `no voice no dialogue no music` is insufficient for proclamation/verdict scenes — Section A6 family 1 (Princess Sweet) had a similar finding for body-contact scenes and the fix was an explicit positive Constraint plus an extended ban list. v5 applies all three fixes: (a) drop the quoted phrase from Action — `with smug "I have unveiled my masterworks" verdict` → `with smug verdict`; (b) extend the Sound bans to `no voice no dialogue no speech no vocalizations no humming no breaths no music` at both ends; (c) add an explicit positive Constraint at the front: `no dialogue no speech no vocal sounds in audio only material and mechanical sounds like cloth rustle parchment crinkle metallic shimmer and ambient brass-gold shimmer are present in the audio track`. **Authoring rule (new)**: never include literal quoted personality phrases in the Action body — they cue the audio model to generate speech regardless of the Sound ban. Express personality through facial expression / pose / posture instead.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, voice,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the blade, scrolls flying out of bundle,
scrolls detaching from bundle, bundle empties, parchment stays inside frame,
parchment does not extend off-screen, scrolls remain unfurled at end,
glasses removed, open mouth, simple ruled lines, simple speedometer arcs,
green sparkles, green parchment, green VFX, mantle, cape, cloak
```

---

Subject:     static camera shot of a stocky scholarly architect character with chibi proportions, wearing a large red turban with a long red fabric side-tail draping down his right side, a fully extended brass folding drafting arm rising from the top of the turban, round gold-framed spectacles with a brown frame outer rim, thin waxed black handlebar mustache with curled tips, green tunic with rolled-up sleeves, brown leather cross-body harness with a brass center buckle, brown sturdy leather boots, holding in his right hand a large silver caliper-protractor blade shaped like a draftsman's tool with a wide curved protractor arc as the bottom edge engraved with fine tick marks along its rim, two angular calipered prongs extending forward from the body of the blade, and a circular cutout handle in the body of the blade, weapon-scale, held across his body, and cradling a bundle of three coiled tan parchment scrolls under his left arm, in his canonical pose with mouth closed in a smug smirk

Action:      from his canonical smug closed-mouth smirk the loop unfolds
             in six discrete stages.
             First from zero to point six seconds his chin lifts a small
             amount and his brow arches over the spectacles in a smug
             down-the-nose look at the viewer.
             Second from point six to one point two seconds he raises
             the silver caliper-protractor blade in his right hand to
             chest height and sweeps it in a small precise commanding
             arc toward midair as a presenting-my-masterworks gesture
             with the broad face of the blade with the curved protractor
             arc face turned forward toward the viewer throughout.
             Third from one point two to three point five seconds the
             architect's left arm bundle of three coiled scrolls glows
             with brass-gold radiance and the bundle expands to reveal
             additional phantom parchment scrolls emerging from the
             radiance, six unfurling parchment streams cascade outward
             from the expanded bundle in a wide peacock fan formation
             around the architect spreading in six different directions
             across the frame, the first stream cascades toward the
             lower-left corner of the frame and extends continuously
             past the lower-left edge off-screen, the second stream
             cascades toward the far-left edge of the frame and
             extends continuously past the left edge off-screen, the
             third stream cascades toward the upper-left corner of the
             frame and extends continuously past the upper-left edge
             off-screen, the fourth stream cascades toward the
             upper-right corner of the frame and extends continuously
             past the upper-right edge off-screen, the fifth stream
             cascades toward the far-right edge of the frame and
             extends continuously past the right edge off-screen, and
             the sixth stream cascades toward the lower-right corner of
             the frame and extends continuously past the lower-right
             edge off-screen, each unfurled parchment displays a
             different detailed elaborate ornate technical architectural
             blueprint diagram drawn in fine glowing warm ink-blue inked
             lines containing rectangular schematic boxes, fine vector
             arrows with small magnitude labels at their tips, fine
             straight horizontal and vertical dimension lines with
             drafting-style numerical notations and units in small
             characters, mathematical formulas with Greek letters and
             numbers in flowing ink-blue characters, fine coordinate
             axes, small geometric constructions of triangles and
             squares with their vertices marked, and rich ornamental
             technical drafting details, all rendered in fine clean
             warm ink-blue line work like detailed ornate technical
             architectural blueprints with rich mathematical and
             ornamental complexity, and the architect at the center of
             the peacock fan is wrapped in a soft brass-gold radiant
             aura that glows around his silhouette and grows brighter
             as the cascade fully deploys.
             Fourth from three point five to four point five seconds
             his chin lifts further and his closed-mouth smirk widens
             with smug verdict and his right hand raises the silver
             caliper-protractor blade high above his head in a
             triumphant decree gesture with the broad face turned
             toward the camera as he gives a small dismissive
             head-shake, at the peak of his gesture the brass-gold
             radiant aura around him flares brightly and a
             coordinated mega-pulse synchronizes outward across the
             entire fan so all six blueprints flash brighter
             simultaneously in a unified moment of completion with
             warm ink-blue light pulsing along every line and a
             radiant brass-gold mega-flash blooming briefly from the
             architect's silhouette.
             Fifth from four point five to five point eight seconds
             the brass-gold aura softly fades, the six parchment
             streams retract smoothly back inward toward the bundle,
             the phantom scrolls dissolve back into the bundle with
             the brass-gold radiance fading away, and the three
             original canonical scrolls settle back into their fully
             coiled state in the bundle under his left arm so the
             bundle returns to three intact coiled scrolls cradled
             under his left arm exactly as in the source.
             Sixth from five point eight to seven point zero seconds
             the silver caliper-protractor blade returns smoothly
             across his body to canonical position with the curved
             protractor arc face turned forward toward the viewer and
             his expression softens to the held canonical smug
             closed-mouth smirk.
             Expression arc: smug closed-mouth smirk to arched brow
             with chin lift on the anticipation to focused commanding
             gesture to smug satisfied unveiling during the held fan
             pose to wider smirk with masterworks verdict head-shake to
             settled smug closed-mouth smirk on the retract and
             recovery. The brass drafting arm at the top of the turban
             catches light on the chin lift and on the unveil peak,
             the long red turban side-tail drifts gently throughout
             the loop, the curled mustache tips ride the smirk widen.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no speech no vocalizations no humming no breaths no music, a soft fabric shift of the green tunic on the chin lift, a smooth metallic shimmer as the blade rises in the commanding gesture, a sequence of parchment-paper unfurl crinkles as the six streams deploy outward, a soft ink-blue inscription tick-shimmer of fine quill strokes as the blueprints inscribe themselves on the parchment, a soft brass-gold radiance shimmer as the aura grows around the architect, a clean sharp synchronized snap as the mega-pulse flares at the verdict moment, a fading parchment re-coil sequence as the streams retract, a fading brass-gold shimmer as the aura softens, soft cloth rustle of the green tunic and red turban side-tail, a faint metallic ambient shimmer from the blade on the settle, no voice no dialogue no speech no vocalizations no humming no breaths no music

Constraints: caliper blade in right hand always, scrolls under left arm always, no dialogue no speech no vocal sounds in audio only material and mechanical sounds like cloth rustle parchment crinkle metallic shimmer and ambient brass-gold shimmer are present in the audio track, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no pan, the cascade is a character-internal VFX event the camera does not move or zoom, the silver caliper-protractor blade is presented broad face forward toward the camera throughout the loop with the curved protractor arc face turned toward the viewer the full silhouette of the blade including the protractor arc the calipered prongs and the circular cutout handle remains clearly visible to the camera at every moment of the loop and the silhouette never simplifies into a generic sword or spear shape, the six architectural blueprint VFX are warm ink-blue color not green and read as elaborate ornate detailed technical architectural blueprints with rich mathematical and ornamental complexity drawn in fine clean ink-blue line work containing rectangular schematic boxes fine vector arrows with magnitude labels fine straight horizontal and vertical dimension lines with drafting-style numerical notations mathematical formulas with Greek letters and numbers fine coordinate axes small geometric constructions of triangles and squares and rich ornamental technical drafting details not single simple ruled lines and not single simple speedometer-style arcs, six total parchment streams cascade outward from the bundle and each stream extends continuously past its respective frame edge or corner off-screen with the first stream past the lower-left edge the second stream past the far-left edge the third stream past the upper-left edge the fourth stream past the upper-right edge the fifth stream past the far-right edge and the sixth stream past the lower-right edge of the frame, the architect at the center is wrapped in a soft brass-gold radiant aura that glows around his silhouette throughout the cascade and flares brighter at the verdict mega-pulse moment then softens and fades on the retract, at the verdict peak all six blueprints flash synchronized in a single coordinated mega-pulse with warm ink-blue light pulsing along every line and a brass-gold mega-flash blooming briefly from the architect's silhouette, the canonical three scrolls in the bundle stay seated in his left arm throughout the loop with only the parchment streaming outward and any phantom additional scrolls dissolve back into the bundle by the end of the loop so the bundle returns to exactly three intact coiled scrolls identical to the source by the end of the loop, the silver caliper-protractor blade stays in his right hand throughout, the gold-framed spectacles stay on his face throughout, mouth stays closed throughout, the turban has a long red fabric side-tail, no blue rim light no environment, seamless loop first and last frame match canonical pose with the blade across the body in the right hand and three intact coiled scrolls under the left arm and mouth closed, 7s
