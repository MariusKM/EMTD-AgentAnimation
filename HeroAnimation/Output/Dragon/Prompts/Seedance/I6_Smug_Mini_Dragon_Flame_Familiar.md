# I6 — Smug Mini-Dragon Flame Familiar (Seedance 2.0)

> Idle movement | 6s | 1:1 | Static locked-off I2V
> FFLF source = `Output/Dragon/Dragon_FFLF_0.png` (green chroma)
> Concept: [concepts.md](../../concepts.md) — I6 (deliberate smug mini-dragon flame familiar — Dragonwitch-P5-style theatrical flame manipulation, "watch what I conjured" register)

## Notes

- **HIGHEST FIRE-VFX RISK** on Dragon's slate. Three distinct first-pass risks: (a) the `fire / flame` keyword family pulls combat-scale fire VFX hard; (b) the **mini-dragon shape** is fragile — Seedance may collapse it to a generic flame puff OR worse, render a confusingly-sized second full dragon; (c) the **figure-8 / loop motion path** competes with Seedance's default "drift forward and dissipate" prior.
- **Pattern lineage**: Adapts the Dragonwitch P5 "smug flame inspect & snuff" theatrical-manipulation arc — anticipation → conjure flame familiar → admire/inspect (extended hold on the figure-8 path) → dissipate → satisfied flex recovery. Mouth-driven instead of palm-driven. The flame-dragon mirrors his own silhouette in fire form (knowing nod to the Dragonwitch flame-familiar tradition).
- **Shape scoping (critical)**: explicit miniature-dragon-shape positive scope (`tiny chibi cartoon flame-dragon`, `miniature wedge-shaped head with two small backswept horn-flicks`, `miniature folded wings`, `sinuous flame-tail`, `roughly head-sized in total`, `clearly a tiny flame-creature silhouette not a generic flame`). Paired with explicit shape negation (`not a generic flame puff, not a solid flame ball, not a flame plume, not a fireball, not a flame jet, not a second full-size dragon, not a real dragon`). Both required.
- **Motion-path scoping (critical)**: explicit `flies in a small playful figure-8 loop pattern in midair`, `undulates along its path like a tiny living flame creature`, `the dragon's eyes track the flame-familiar's loop motion`. Counters Seedance's default "drift forward, dissipate immediately" prior on flame VFX.
- **Color**: warm orange-yellow-red cartoon flame (NOT greenish-purple — that's Dragonwitch's signature color; Dragon's flame is the warm-classic palette). Keep the flame in the warm range to avoid color collision with the bright green eyes on green chroma.
- **Scale anchor**: `roughly head-sized in total` keeps the flame-familiar at the same approximate scale as the dragon's own head, preventing the model from rendering either a microscopic flame or a full-sized second dragon.
- **Single trick beat per loop** — one conjure + one figure-8 loop hold + one dissolution. No chained familiars, no second puff, no flame-dragon transforming into a different shape mid-loop.
- **Mouth opens for the conjure puff**, returns to closed-smirk by loop end. FFLF integrity preserved: first/last frame match canonical closed-mouth pose; flame-familiar fully dissipates before loop end; no residual smoke or glow.
- **Expression register**: NOT surprised / NOT sheepish (accident reads — wrong here). This is **proud + smug + connoisseur**: chin-up anticipation → smug puff → admiring head-tilt + eye-tracking inspection ("look at this thing I just made") → satisfied chin-down recovery flex → deeper smug grin.
- **Output-audio safety**: drop `hum` / `chime` / `harmonic` / `melodic` / `swell` vocabulary entirely (Princess Arrogant fan-VFX audio lesson). Audio uses percussive `fwoomp` / `crackle` / `fizzle` / `huff` events.

## Negative prompt (reference)
```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
environment, background scenery, talking, lipsync, voice, blue rim light, warped face,
generic flame puff, shapeless flame, formless fire, solid flame ball, flame plume,
flame puff, flame jet, fireball, flame stream, sustained fire-breath, war-flame,
hero-tier fire-breath, breath weapon, fire weapon, large flame, fire plume,
fire pillar, full mouth flame burst, flame engulfing the frame,
second full-size dragon, second large dragon, two dragons, real dragon flying,
flame-familiar drifts straight, flame disappears immediately, flame fades too fast,
multiple flame creatures, chained familiars,
sustained smoke trail, wings spread, wings extended, wing flap, standing,
rearing, take-off, roar, growl, snarl, deep breath, panting, screaming,
orchestral, harmonic, swell, greenish-purple flame, green flame, purple flame
```

---

Subject:     a chibi cartoon red dragon unit character with oversized wedge-shaped head and stocky barrel torso in the Supercell / Kingshot stylized mobile game art style, seated on his haunches in a three-quarter view with body angled slightly to the viewer's left, both rear paws folded under and both front paws planted on the ground in front, saturated warm crimson red chunky hand-painted overlapping rounded leaf-shaped scales, warm honey-gold underbelly with visible horizontal plate segmentation, small triangular dark warm-brown dorsal spines with near-black tips, two prominent backswept dark warm-brown horns rising from the top of the skull, small flared cheek-frill scale plates fanning out behind each jaw, bright saturated green almond-shaped eyes with black pupils and a single bright catchlight, closed mouth in a subtle confident knowing smirk with no teeth visible, two leathery membrane wings folded but slightly raised behind the shoulders, long flexible tail curling behind the body to the viewer-right with the leaf-spade tip resting near the ground, four dark warm-brown claws on each foot

Action:      stays seated in his canonical pose exactly as in the
             source image with continuous ambient deep slow breathing
             throughout the loop, partway through the loop at roughly
             one second in he arches his neck and chin back slightly
             in a confident proud chin-up anticipation beat with his
             chest filling under the warm gold underbelly plates and
             his bright green eyes carrying a smug-knowing connoisseur
             look, then his mouth opens with a confident showy
             expression showing two small rounded upper fangs and a
             row of small lower teeth in a chibi-cute not razor-sharp
             read, he puffs forward from his open mouth a single tiny
             chibi cartoon flame-creature that takes the clear shape
             of a miniature flame-dragon familiar with a miniature
             wedge-shaped flame-head and two small backswept
             horn-flicks on top of the flame-head and miniature folded
             flame-wings on the back and a long sinuous flame-tail
             ending in a small spade-tip the whole flame-creature
             rendered in warm orange-yellow-red hand-painted cartoon
             flame and roughly head-sized in total clearly a tiny
             flame-creature silhouette not a generic flame and not a
             second full-size dragon, the tiny flame-dragon familiar
             flies forward in front of him in a small playful figure-8
             loop pattern in midair drifting and undulating along its
             path like a tiny living flame creature for roughly two
             seconds, as the flame-familiar flies its loop the dragon
             closes his mouth back into a smug-admiring knowing
             smirk and tilts his head slightly to one side and his
             bright green eyes track the flame-familiar's motion
             following the figure-8 path like a connoisseur admiring
             his own conjured work, then the flame-dragon familiar
             completes its loop and dissolves into a small wisp of
             warm orange smoke that fades away to nothing, his
             expression resolves into a satisfied chin-down recovery
             flex face a deeper smug grin than the canonical smirk a
             so-called yeah did you see what I just did look held for
             a beat before returning to the canonical knowing smirk
             for the rest of the loop, his folded wing tips lift a
             hair on the chin-up anticipation beat as part of a
             puffed-up read then settle back, his long flexible tail
             tip flicks once on the recovery beat like a satisfied
             connoisseur cat, his body and torso stay seated in
             canonical position throughout with no rotation and no
             standing and no rearing, the tiny flame-dragon familiar
             and the wisp of smoke fully dissipate and are gone
             before the loop ends leaving the canonical pose intact
             with no residual flame and no residual smoke and no
             residual glow.
             Expression arc: canonical knowing smirk -> confident
             proud chin-up anticipation with smug-knowing eyes ->
             smug-showy mouth-open conjure puff -> admiring
             head-tilt connoisseur smirk with eyes tracking the
             flame-familiar's loop path -> satisfied chin-down
             recovery flex grin a deeper smug smirk than canonical
             -> back to canonical knowing smirk.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no actual words no actual speech no music, soft natural calm ambient deep slow nose-breathing at a slow steady relaxed rhythm appropriate to a large creature throughout, a confident short controlled cartoon flame-fwoomp at the moment of the conjure puff like a soft controlled fwoosh lasting roughly a fraction of a second, a soft warm cartoon flame-crackle ambient as the tiny flame-dragon familiar flies its figure-8 loop path through midair, a small soft fizzle as the flame-dragon dissolves into smoke, a small soft satisfied smug huff at the recovery chin-down beat a tiny self-satisfied flex exhale read as a smug huff not as a roar not as a growl, a faint leathery rustle of the folded wing membranes with the ambient breath, a faint soft scale-creak from the dorsal scale plates with the breath, no roar no growl no snarl no dragon vocalization no scream no orchestral no harmonic no swell, no actual words no actual speech no music

Constraints: mouth defaults closed in canonical knowing smirk and only opens for the single show-off conjure puff beat returning to closed before loop end, the visual effect is exactly one tiny chibi cartoon flame-dragon familiar with a clearly readable miniature flame-creature silhouette featuring a miniature wedge-shaped flame-head with two small backswept horn-flicks and miniature folded flame-wings and a long sinuous flame-tail with a small spade-tip rendered entirely in warm orange-yellow-red hand-painted cartoon flame roughly head-sized in total clearly a small flame-creature silhouette not a generic flame puff not a shapeless flame not a solid flame ball not a flame plume not a flame puff not a flame jet not a fireball not a sustained flame stream not a sustained fire-breath not a war-flame not a hero-tier fire-breath not a breath weapon not a large flame not flame engulfing the frame not a second full-size dragon not a real flying dragon, the flame-dragon familiar flies forward in front of him in a small playful figure-8 loop pattern in midair undulating along its path for roughly two seconds before dissolving into a small wisp of warm orange smoke that fades to nothing, the flame-familiar must hold its clearly readable miniature flame-creature shape throughout the figure-8 loop and must not collapse into a shapeless flame puff and must not grow into a second full-size dragon, the dragon's bright green eyes track the flame-familiar's loop path with the head tilting slightly to follow, exactly one flame-familiar per loop never two never chained never a second conjure, the flame-familiar and all smoke fully dissipate and are gone before the loop ends leaving no residual flame no residual smoke no residual glow, wings stay folded behind the shoulders always, dragon stays seated always, tail stays curled behind the body to the viewer-right always, no deep breaths no sharp breaths no panting no audible inhales except the single confident chest-fill at the chin-up anticipation, no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom, no full snake-coil neck twist only a small confident chin-up anticipation and a small head-tilt during the inspection and a small chin-down recovery, no wing flap no wing extend no wing spread no take-off no standing no rearing no stepping, no roar no growl no snarl no scream no dragon vocalization, the flame-familiar's color is warm orange-yellow-red cartoon flame never greenish-purple never green never purple, the flame-familiar reads as a confident clearly-formed tiny flame-dragon mascot not as a feeble wisp and not as a generic flame puff and not as a sustained fire-breath weapon and not as a second full-size dragon, no blue rim light no environment, seamless loop first and last frame identical to canonical pose with mouth closed in knowing smirk and no flame visible, 6s
