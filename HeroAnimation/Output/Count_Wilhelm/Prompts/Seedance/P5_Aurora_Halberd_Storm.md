# P5 — Aurora Halberd Storm (Seedance 2.0)

> Power movement | 7s | 1:1 | Static locked-off I2V
> FFLF source = `Output/Count_Wilhelm/Count_Wilhelm_FFLF_0.png`
> Concept: [concepts.md](../../concepts.md) — P5 (slate-mandatory VFX-heavy spectacle, multi-beat + vertical lift kinetic axes, blue energy ribbons + wind particles)

## Notes for this concept

- **Spectacle scope** — slate-mandatory hero-tier reading per the 2026-05-05 rule. VFX is the visible power. 10+ swirling blue energy ribbons + off-frame wind particle streams + radial burst at peak.
- **Recommend running AFTER P1 or P3 lands cleanly** so we have a tuned keyer baseline before testing this scope.
- **Multi-beat discrete timing** — lift + VFX build + held peak + dissipate + settle. Use timecoded segments (per Architect Stage 5 review).
- **Hand convention**: both hands stay on weapon throughout. Anatomical right (high) drives the lift, anatomical left (low) anchors. Halberd held vertically with axe-head up at the peak.
- **Always-hold halberd** at start of Constraints.
- **Audio safety risk** (P5 spectacle pattern from Princess Sweet P6 v1): mood-music inference can trigger output-audio rejection on spectacular VFX with serene/warm Action modifiers. Mitigation:
  - Drop ALL `warm` / `serene` / `gentle` / `chime` / `melodic` / `harmonic` words from Action and Sound
  - Sound list uses only mechanical/material/wind sounds — no chimes, no swells
  - Explicit Constraint ban: `no music no orchestral no swells no melodic tones no harmonic sounds`
- **No green-VFX collision** — energy ribbons explicitly cool blue, never green. Wilhelm is not in the green-VFX-collision risk roster, so no blue-chroma variant needed.
- **FFLF integrity**: all VFX dissipates before loop end so first/last frame matches canonical two-handed diagonal grip.
- **Static camera prefix** — multiple swirling VFX paths and off-frame elements is the highest camera-misread risk on the slate. Lock down hard.
- **Off-frame growth language** — wind particle streams sweep across the foreground from off-frame, but explicit `the camera does not pull back to fit the wind currents`.
- **Silhouette-preservation** for the halberd held aloft as the focal anchor.
- **Vocal direction**: a low gruff approving wordless grunt at the peak and a low hmph on the settle. No chuckles.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, pull back, environment, background scenery, talking, lipsync, voice,
chuckles, laughs, sighs, breathy sounds, vocalizations, humming, melodic tones,
orchestral music, ambient music, harmonic swells, chime sounds, bell tones,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light on character silhouette, cyan edge light, blue edge glow on body,
warped hands, warped face, extra arms, dropping the halberd, releasing the halberd,
single-hand grip, switching hands, halberd morphing into staff or spear,
generic blade silhouette, simplified weapon shape, body spin, body rotation, pirouette,
green VFX, green energy, green sparkles, blue ribbons remaining at end of loop,
wind particles remaining at end, environment scenery
```

---

Subject:     static camera shot of a stocky veteran warlord character with chibi proportions, broad heavy build, weathered tan skin with ruddy cheeks, dark deep-set eyes shadowed beneath heavy dark eyebrows, white swept-back voluminous hair, a very large white handlebar mustache that fully covers his mouth, polished silver plate armor on his shoulders and chest with visible pauldrons, a teal undergarment visible beneath the chest plate, a thick gold chain necklace at his throat with five large faceted red-orange cabochon-cut gemstones, brown leather arm guards with metal plate reinforcement, a deep crimson cape draped from both shoulders falling behind to his anatomical-left side, dark teal trousers, heavy brown leather military-style boots, holding a large ornate halberd with an etched silver curved axe-head featuring a top spike and decorative scrollwork on a long brown wooden haft diagonally across his body with both hands gripping the haft his anatomical right hand high on the haft just below the axe-head and his anatomical left hand low near the butt of the haft, in his canonical pose with a stern intimidating under-brow glare

Action:      from his canonical stern under-brow glare he lifts the
             ornate halberd ceremonially upward rotating it from its
             diagonal position into a tall vertical orientation held
             aloft in front of him with the curved silver axe-head
             pointing straight upward at full extension overhead, both
             hands gripping the haft his anatomical right hand high
             near the axe-head and his anatomical left hand low on the
             haft, then the curved silver axe-head ignites with intense
             cool blue energy and a multi-stream cool blue energy
             effect builds up around the weapon, ten or more swirling
             cool blue energy ribbons spiral around the wooden haft
             from butt to axe-head winding upward in flowing helical
             paths through the air around the halberd, additional cool
             blue particle streams flow inward across the foreground
             of the frame from off-camera on both the left and right
             sides as if strong gusts of cool blue energy are
             sweeping across the scene toward the warlord and the
             halberd, the streams curve toward the axe-head and feed
             into the build, at the peak a bright cool blue radial
             burst flares outward from the axe-head at the top of the
             halberd radiating energy spokes outward in a wide circle,
             he holds the peak pose with the halberd raised high and
             the energy storm at full intensity for a brief beat his
             stern under-brow glare hardening to grim battle resolve
             with a small triumphant chin lift, then the entire cool
             blue energy storm rapidly dissipates the spiral ribbons
             unwind and fade the inflowing particle streams trail away
             and the radial burst contracts and disappears, all blue
             energy fully gone, then he draws the halberd smoothly back
             to his canonical two-handed diagonal grip across the body.
             Expression arc: stern under-brow glare -> hardened grim
             resolve as the energy builds -> stern grim battle resolve
             with a small triumphant chin lift at the held peak ->
             resolved canonical stern glare on the settle. The deep
             crimson cape lifts and ripples upward and outward during
             the held peak as if caught by the inflowing wind currents
             then settles smoothly during the dissipate to its
             canonical drape on his anatomical-left side, the white
             handlebar mustache flutters briefly during the peak then
             resettles, the white hair lifts during the peak and
             settles during the dissipate, the gold chain necklace and
             the five red-orange gemstones catch the cool blue glow
             during the peak frame, the silver pauldrons reflect cool
             blue light at the peak and return to neutral on the
             settle.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions, hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no speech no music no vocalizations no humming no melodic tones no orchestral sounds no harmonic swells no bell tones no chime sounds, a heavy leather-creak and an armor-shift as he lifts the halberd ceremonially upward, a low rising cool energy whoosh as the cool blue energy storm builds up around the weapon, a sustained cool wind rush as the cool blue particle streams sweep inward across the scene from off-frame, a sharp cool energy crackle at the moment of the radial burst at the peak, a heavy cloth rustle of the deep crimson cape lifting and rippling at the peak and resettling on the dissipate, a low gruff approving wordless grunt from the warlord at the peak and a low wordless hmph on the settle, no voice no dialogue no speech no music no orchestral no ambient music no melodic sounds no harmonic tones no swells no bell tones no chime sounds no vocalizations

Constraints: halberd stays in both hands always, no dialogue no speech no vocal sounds in audio only material and mechanical and energy sounds like leather creak armor shift cool energy whoosh cool wind rush cool energy crackle cloth rustle and low wordless gruff grunts and hmph sounds are present in the audio track, the warlord's vocal sounds are wordless gruff grunts and low hmph sounds only no actual words no actual speech, no music no orchestral no ambient music no melodic tones no harmonic swells no bell tones no chime sounds anywhere in the audio, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no pull back no dolly, the cool blue energy storm is a character-internal VFX building around the halberd in his hands and the camera does not move or zoom or pull back to fit the energy ribbons or the inflowing wind particle streams, the cool blue particle streams that flow inward from off-camera on the left and right sides of the frame are intentional and the camera does not pull back to show their origin, both his anatomical right hand high on the haft and his anatomical left hand low on the haft remain firmly gripping the halberd throughout the entire loop and he never releases either hand and never switches hands, the ornate halberd silhouette including the curved silver axe-head with decorative scrollwork the top spike and the long brown wooden haft remains clearly visible to the camera at every moment of the loop and the silhouette never simplifies into a generic staff or spear shape, the cool blue swirling energy ribbons the cool blue inflowing particle streams and the cool blue radial burst at the axe-head are the only VFX and they are cool blue in color never green never yellow-green never purple never red, all blue VFX fully dissipates and disappears before the loop ends, the deep crimson cape returns to its canonical drape on his anatomical-left side at the loop end, the white handlebar mustache stays full and in place throughout and fully covers his mouth, the gold necklace with five red-orange gemstones stays in place throughout, the silver plate armor stays in place throughout, mouth stays closed throughout no lipsync no talking, his stance stays grounded with feet planted throughout, no body spin no rotation no pirouette his body stays in the canonical strong three-quarter pose at the loop endpoints, no blue rim light on the character silhouette no environment, seamless loop first and last frame match canonical pose with the stern under-brow glare and the halberd held diagonally in both hands across the body with no blue VFX visible, 7s
