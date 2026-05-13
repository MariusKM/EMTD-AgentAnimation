# P3 — Heavy Overhead Slam (Seedance 2.0)

> Power movement | 6s | 1:1 | Static locked-off I2V
> FFLF source = `Output/Count_Wilhelm/Count_Wilhelm_FFLF_0.png`
> Concept: [concepts.md](../../concepts.md) — P3 (refresh of existing reference, vertical down kinetic axis, blue impact ring + shockwave + fragments)

## Notes for this concept

- **v1 review (2026-05-05)**: impact VFX read as too small/restrained + halberd morphed into a double-bladed battle axe on the foreshortened slam frame.
- **v2 fix — halberd anchor**: led Subject with `tall ornate single-bladed halberd polearm`, replaced every `axe-head` → `halberd-blade` / `halberd-head`, dropped the standalone word `axe`. Added explicit negative + Constraint against `double-bladed battle axe / double-headed axe / two-bladed axe / battle axe / war axe shape`. The foreshortened slam frame is the highest morph risk on the slate so the silhouette-preservation Constraint is doubled.
- **v2 fix — bigger impact VFX**: rewrote the impact moment to include (a) a **bright cool blue impact flash** at the strike point, (b) **multiple expanding shockwave rings** radiating outward from the strike point at ground level, (c) **scattered cool blue energy fragments and motes** bursting outward from the impact like shrapnel of light, (d) **short cool blue radial cracks of energy** branching outward across the ground from the strike point, (e) **brief lifted dust-equivalent of cool blue energy debris** fanning up around his stance. All blue VFX dissipates before loop end so FFLF connects.
- **Multi-beat discrete timing** — wind-up + slam descent + impact peak + recovery + settle. Use timecoded segments.
- **Hand convention**: anatomical right (high) drives the lift, anatomical left (low) follows. Both hands stay on weapon throughout.
- **Always-hold halberd** at start of Constraints.
- **Static camera prefix** — heavy weapon traveling toward camera is a high camera-misread risk.
- **Vocal direction**: stern wordless gruff grunt on impact + low hmph on recovery.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, pull back, environment, background scenery, talking, lipsync, voice,
chuckles, laughs, sighs, breathy sounds, vocalizations,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light on character silhouette, cyan edge light, blue edge glow on body,
warped hands, warped face, extra arms, dropping the halberd, releasing the halberd,
single-hand grip, switching hands, halberd morphing into sword or spear,
double-bladed battle axe, double-headed axe, two-bladed axe, battle axe, war axe,
twin-bladed axe head, mirrored blade head, axe with two blades,
generic blade silhouette, simplified weapon shape, full body pirouette, body rotation,
green VFX, green energy, green sparkles, blue ring remaining at end of loop,
energy fragments remaining at end, ground cracks remaining at end, scorch marks remaining,
small impact, weak impact, restrained impact, modest VFX
```

---

Subject:     static fixed camera shot of a stocky veteran warlord character with chibi proportions and a broad heavy build, holding a tall ornate single-bladed halberd polearm with a long brown wooden haft and a single etched silver curved blade head featuring one long curved single-edged blade on the front side of the head and one straight upward-pointing top spike at the very top with decorative scrollwork along the silver halberd-head, the halberd held diagonally across his body with both hands gripping the wooden haft his anatomical right hand high on the haft just below the silver halberd-head and his anatomical left hand low near the butt of the haft, weathered tan skin with ruddy cheeks, dark deep-set eyes shadowed beneath heavy dark eyebrows, white swept-back voluminous hair, a very large white handlebar mustache that fully covers his mouth, polished silver plate armor on his shoulders and chest with visible pauldrons, a teal undergarment visible beneath the chest plate, a thick gold chain necklace at his throat with five large faceted red-orange cabochon-cut gemstones, brown leather arm guards with metal plate reinforcement, a deep crimson cape draped from both shoulders falling behind to his anatomical-left side, dark teal trousers, heavy brown leather military-style boots, in his canonical pose with a stern intimidating under-brow glare

Action:      from his canonical stern under-brow glare he begins a
             slow heavy weighted wind-up across the first beat
             lifting the tall halberd polearm upward and back
             overhead his shoulders coiling powerfully and his torso
             leaning back slightly the silver halberd-head traveling
             above and behind his head as anticipation builds his
             anatomical right hand high on the haft drawing the
             weapon up and his anatomical left hand low on the haft
             following, then in one explosive fast committed
             downward chop he swings the halberd forward and
             downward in a powerful overhead slam the curved
             single-edged silver halberd-blade accelerating down
             through the air toward the lower portion of the frame
             in front of him with brief dramatic foreshortening of
             the halberd-head, a sharp cool blue energy crack
             flashes along the leading edge of the silver
             halberd-blade during the descent, at the moment of the
             strike at the bottom of the chop a powerful impact
             erupts including a bright cool blue impact flash at
             the strike point and multiple expanding cool blue
             shockwave rings radiating outward in flat ground-level
             bursts from the strike point and scattered cool blue
             energy fragments and motes bursting outward from the
             impact like shrapnel of light and short cool blue
             radial cracks of energy branching outward across the
             ground from the strike point and a brief fan of lifted
             cool blue energy debris around his stance, the warlord
             holds the deep impact pose for an extended beat with
             the halberd extended low and angled to his
             anatomical-right side and his stance settled into a
             deep wide-legged grounded recovery, all the cool blue
             impact VFX dissipates and fades during the held
             recovery the shockwave rings expand outward and fade
             the energy fragments wink out the radial ground cracks
             dim away the lifted debris settles and disappears,
             then he draws the halberd smoothly back through a low
             return arc into his canonical two-handed diagonal grip
             across the body with a stern recovery glare. Expression
             arc: stern under-brow glare -> coiled grim resolve
             through the wind-up -> hardened battle intent at the
             moment of the slam -> stern grim acknowledgment on the
             held recovery -> resolved canonical stern glare. The
             deep crimson cape billows outward and upward during
             the wind-up then wraps inward across the body during
             the slam descent and settles slowly during recovery
             to its canonical drape on his anatomical-left side,
             the white handlebar mustache bounces visibly on the
             impact frame, the white hair lifts on the wind-up and
             lags during the slam, the gold chain necklace and the
             five red-orange gemstones swing during the rapid
             motion, the silver pauldrons catch sharp gleams at
             the top of the wind-up and at the impact frame.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions, hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no speech no music no vocalizations no humming, a heavy slow leather-creak and an armor-shift as he coils his shoulders for the wind-up, a sharp sustained metallic woosh as the heavy halberd accelerates downward through the air, a deep loud resonant impact thud at the moment of the strike at the bottom of the chop, a sharp cool energy crackle and a low bass shockwave rumble during the brief multi-ring blue impact burst, a soft cool energy hum and small fizzles as the cool blue energy fragments scatter and fade, a heavy cloth rustle of the deep crimson cape billowing during the wind-up wrapping during the slam and settling during the recovery, a low gruff wordless grunt from the warlord at the moment of impact and a low wordless hmph on the recovery, no voice no dialogue no speech no music no vocalizations

Constraints: halberd stays in both hands always, the weapon is a tall single-bladed halberd polearm with a single curved single-edged silver blade-head and one straight top spike never a double-bladed battle axe never a double-headed axe never a two-bladed axe never a battle axe never a war axe never a twin-bladed weapon, the halberd-head has only one curved blade on the front side of the head it does not have a second blade on the rear side of the head, no dialogue no speech no vocal sounds in audio only material and mechanical and energy sounds like leather creak armor shift metallic woosh deep impact thud cool energy crackle bass shockwave rumble cool energy hum cloth rustle and low wordless gruff grunts and hmph sounds are present in the audio track, the warlord's vocal sounds are wordless gruff grunts and low hmph sounds only no actual words no actual speech, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no pull back no dolly, the heavy overhead slam is a character-internal weapon action and the camera does not move or zoom or follow the halberd at any point, the impact VFX is large and powerful including a bright cool blue impact flash multiple expanding cool blue shockwave rings scattered cool blue energy fragments and motes short cool blue radial cracks of energy across the ground and a brief fan of lifted cool blue energy debris all of which is cool blue in color never green never yellow-green, all blue impact VFX fully dissipates and disappears before the loop ends the shockwave rings the energy fragments the radial cracks and the lifted debris all wink out and fade away leaving the ground unmarked, both his anatomical right hand high on the haft and his anatomical left hand low on the haft remain firmly gripping the halberd throughout the entire loop and he never releases either hand and never switches hands, the ornate halberd silhouette including the single curved silver halberd-blade with decorative scrollwork the single straight top spike and the long brown wooden haft remains clearly visible to the camera at every moment of the loop and the silhouette never simplifies into a generic sword or spear shape and never morphs into a double-bladed battle axe shape even during the foreshortened slam descent, the ground beneath him remains undamaged and unmarked at the loop end no cracks no debris no scorch marks no glow remain, the deep crimson cape returns to its canonical drape on his anatomical-left side at the loop end, the white handlebar mustache stays in place throughout and fully covers his mouth, the gold necklace with five red-orange gemstones stays in place throughout, the silver plate armor stays in place throughout, mouth stays closed throughout no lipsync no talking, his stance stays grounded with feet planted he does not jump or leap during the slam, no body spin no rotation no pirouette his body stays in the canonical strong three-quarter pose at the loop endpoints, no blue rim light on the character silhouette no environment, seamless loop first and last frame match canonical pose with the stern under-brow glare and the halberd held diagonally in both hands with no blue VFX visible, 6s
