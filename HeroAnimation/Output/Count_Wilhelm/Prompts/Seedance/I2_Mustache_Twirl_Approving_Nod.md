# I2 — Mustache Twirl & Approving Nod (Seedance 2.0)

> Idle movement | 5s | 1:1 | Static locked-off I2V
> FFLF source = `Output/Count_Wilhelm/Count_Wilhelm_FFLF_0.png`
> Concept: [concepts.md](../../concepts.md) — I2 (client-brief idle: "leans on halberd, slowly strokes his beard while nodding thoughtfully")

## Notes for this concept

- **Direct translation of client Hero Screen brief** — leans one hand on the halberd, slowly strokes the mustache, gives an approving nod. Adapted for FFLF integrity since the canonical pose is two-handed: this is a mid-loop excursion that returns to the two-handed grip before loop end.
- **FFLF risk — single-hand grip mid-loop**: the anatomical-left hand releases the lower haft mid-loop, comes up to the mustache, twirls/strokes one end with thumb and forefinger, returns to the haft. Loop opens and closes on the canonical two-handed grip. **Always-hold protective Constraint** must explicitly allow the controlled mid-loop release while requiring the return: `the halberd stays in his anatomical-right hand throughout the loop and his anatomical-left hand returns to the lower haft before the loop ends`.
- **Anatomical right hand stays on the haft throughout** — keeps the halberd anchored upright while the left hand fidgets. He effectively leans on the halberd briefly with the right hand alone supporting it.
- **Multi-beat discrete timing** — release + reach + twirl + nod + return. Use timecoded segments to keep Seedance from collapsing into one motion.
- **Mustache stroke is the personality beat** — slow thoughtful single twirl with the thumb and forefinger of the freed hand. One twirl, not multiple.
- **Static camera prefix** included even for idle since hand-traveling-toward-face has some camera-misread risk.
- **Vocal direction**: a single low gruff approving wordless grunt on the head-nod, no chuckles.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
environment, background scenery, talking, lipsync, voice, chuckles, laughs, sighs,
breathy sounds, vocalizations, realistic proportions, photorealistic, static frozen image,
flat lighting, blue rim light on character silhouette, cyan edge light, blue edge glow on body,
warped hands, warped face, extra arms, dropping the halberd, halberd falling,
halberd tipping over, halberd dropped to the ground, releasing both hands at once,
left hand stays away from the halberd at the loop end, two-handed twirl,
mustache pulled off, mustache distortion, halberd switching hands, full beard stroke down,
hand at the loop end not on the halberd, VFX, deep breath, sharp breath
```

---

Subject:     static camera shot of a stocky veteran warlord character with chibi proportions, broad heavy build, weathered tan skin with ruddy cheeks, dark deep-set eyes shadowed beneath heavy dark eyebrows, white swept-back voluminous hair, a very large white handlebar mustache that fully covers his mouth, polished silver plate armor on his shoulders and chest with visible pauldrons, a teal undergarment visible beneath the chest plate, a thick gold chain necklace at his throat with five large faceted red-orange cabochon-cut gemstones, brown leather arm guards with metal plate reinforcement, a deep crimson cape draped from both shoulders falling behind to his anatomical-left side, dark teal trousers, heavy brown leather military-style boots, holding a large ornate halberd with an etched silver curved axe-head featuring a top spike and decorative scrollwork on a long brown wooden haft diagonally across his body with both hands gripping the haft his anatomical right hand high on the haft just below the axe-head and his anatomical left hand low near the butt of the haft, in his canonical pose with a stern intimidating under-brow glare

Action:      from his canonical stern under-brow glare and canonical
             two-handed diagonal grip on the halberd he releases his
             anatomical left hand from the lower haft slowly while
             his anatomical right hand stays firmly gripping the haft
             high near the axe-head supporting the halberd as if he
             leans on it briefly, his freed anatomical left hand
             rises smoothly up to the anatomical-left tip of his
             large white handlebar mustache, he gives one slow
             thoughtful twirl-stroke of the anatomical-left tip of
             the handlebar mustache between his thumb and forefinger
             a single deliberate gesture, he holds for a brief beat
             with the hand at the mustache and gives one slow stern
             approving head-nod his under-brow glare warming slightly
             to a dry approving acknowledgment beneath the mustache,
             then his anatomical left hand lowers smoothly back down
             to its canonical low grip on the haft near the butt of
             the halberd reuniting both hands on the weapon, he
             settles back into his canonical two-handed diagonal
             grip and resolved stern under-brow glare. Expression
             arc: stern under-brow glare -> stern glare softening
             slightly during the slow mustache twirl -> stern
             approving glare on the head-nod -> resolved canonical
             stern under-brow glare. The deep crimson cape barely
             shifts with the small body motions, the white
             handlebar mustache flexes slightly during the twirl
             beat then resettles to its full canonical shape covering
             his mouth, the white swept-back hair stays settled, the
             gold chain necklace and the five red-orange gemstones
             stay almost still with only a faint shift on the
             head-nod, the silver pauldrons stay still.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions, hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no speech no music no vocalizations no humming, a soft leather-creak as his anatomical left hand releases the lower haft and rises to the mustache, a soft cloth-on-skin rustle as his thumb and forefinger pass along the white handlebar mustache during the slow twirl, a soft fabric shift of the deep crimson cape on the head-nod, a soft leather-creak as his anatomical left hand returns to the lower haft, a single low gruff approving wordless grunt from the warlord on the stern approving head-nod, no voice no dialogue no speech no music no vocalizations

Constraints: the halberd stays in his anatomical-right hand throughout the loop and his anatomical-left hand returns to the lower haft before the loop ends, no dialogue no speech no vocal sounds in audio only material and mechanical sounds like leather creak cloth-on-skin rustle fabric shift and a single low wordless gruff grunt are present in the audio track, the warlord's vocal sounds are wordless gruff grunts only no actual words no actual speech, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly, the mustache twirl is a character-internal beat and the camera does not move or zoom toward the face, his anatomical right hand never releases the haft at any point during the loop, his anatomical left hand releases the haft only briefly during the mid-loop excursion to twirl the mustache and then returns to the canonical low grip on the haft near the butt before the loop ends both hands gripping the halberd at the loop endpoints, only one slow single mustache twirl beat occurs not multiple twirls, the ornate halberd silhouette including the curved silver axe-head with decorative scrollwork the top spike and the long brown wooden haft remains clearly visible to the camera at every moment of the loop and the halberd stays upright supported by his anatomical-right hand and never tips over or falls or drops to the ground, the white handlebar mustache stays attached and full and covering his mouth throughout no distortion no pulling off, the gold necklace with five red-orange gemstones stays in place throughout, the silver plate armor stays in place throughout, the deep crimson cape stays in its canonical drape on his anatomical-left side throughout, mouth stays closed throughout no lipsync no talking, his stance stays grounded with feet planted throughout, no body spin no rotation no pirouette his body stays in the canonical strong three-quarter pose throughout, no VFX of any kind during the loop, no blue rim light on the character silhouette no environment, seamless loop first and last frame identical to canonical pose with the stern intimidating under-brow glare and the halberd held diagonally in both hands across the body, 5s
