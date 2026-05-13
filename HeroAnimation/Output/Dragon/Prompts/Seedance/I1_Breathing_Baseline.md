# I1 — Breathing Baseline (Seedance 2.0)

> Idle movement | 4s | 1:1 | Static locked-off I2V
> FFLF source = `Output/Dragon/Dragon_FFLF_0.png` (green chroma)
> Concept: [concepts.md](../../concepts.md) — I1 (mandatory breathing-only baseline)

## Notes

- **Mandatory baseline idle** — strictly breathing-only, no comedic accident, no head-tilt, no eye-tracking, no tail-swish, no fire VFX.
- **Continuous ambient breathing, no discrete visible breath events** (Princess Sweet / Dragonwitch I1 lesson). Frame breathing as a continuous ambient rhythm appropriate to a large creature (deeper / slower than human).
- **Full ban-list leads Constraints**: `no deep breaths no sharp breaths no quick breaths no short breaths no panting no audible inhales no audible exhales breathing is slow and calm and ambient and barely perceptible like a large creature at rest`. Double the ban across Action and Constraints per standard redundancy.
- **Closed-mouth FFLF** — canonical smirk holds throughout, no expression arc, no teeth visible at any point.
- **No fire / flame / smoke vocabulary anywhere** in this prompt (positive OR negative) per the Dragon-doc visual-anchor warning — even negated fire keywords pull fire VFX into the latent.
- **Wings stay folded, tail stays curled, body stays seated, head stays in canonical S-curve neck position.**
- Audio safety: use `no actual words no actual speech no music` framing (silence-collapse lesson). Add `no roar no growl no snarl no dragon vocalization` explicit ban — the audio model otherwise reaches for cliché dragon roar SFX.

## Negative prompt (reference)
```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
environment, background scenery, talking, lipsync, voice, blue rim light, warped face,
head tilt, head turn, brow arch, side glance, eye flash, smirk widen, mouth open,
teeth visible, fangs visible, wings spread, wings extended, wing flap, standing,
rearing, take-off, snake-coil neck, full neck twist, roar, growl, snarl,
deep breath, sharp breath, panting, audible breath
```

---

Subject:     a chibi cartoon red dragon unit character with oversized wedge-shaped head and stocky barrel torso in the Supercell / Kingshot stylized mobile game art style, seated on his haunches in a three-quarter view with body angled slightly to the viewer's left, both rear paws folded under and both front paws planted on the ground in front, saturated warm crimson red chunky hand-painted overlapping rounded leaf-shaped scales across the head and neck and back and outer wings and flanks and outer legs and outer tail, warm honey-gold underbelly with visible horizontal plate segmentation running from the lower jaw down the throat and chest and belly and inner tail, small triangular dark warm-brown dorsal spines with near-black tips from the back of the skull along the spine to the tail tip, two prominent backswept dark warm-brown horns rising from the top of the skull, small flared cheek-frill scale plates fanning out behind each jaw, pronounced spiked brow ridges framing the eyes, bright saturated green almond-shaped eyes with black pupils and a single bright catchlight, closed mouth in a subtle confident knowing smirk with no teeth visible, two leathery membrane wings folded but slightly raised behind the shoulders with deeper desaturated red wing membrane stretched between the dorsal-red wing arms, long flexible tail curling behind the body to the viewer-right with the leaf-spade tip resting near the ground, four dark warm-brown claws on each foot

Action:      stays seated in his canonical pose exactly as in the source
             image in a natural relaxed idle state, his breathing is
             slow and calm and ambient and deeper than human as
             befits a large creature with the chest moving gently and
             almost imperceptibly throughout the loop in a continuous
             smooth rhythm without any visible discrete breath events,
             gives a single slow blink partway through the loop with
             the lids closing vertically over the bright green eyes
             and reopening, his closed-mouth knowing smirk holds
             throughout, his head stays held in the relaxed S-curve
             neck position with no head turn no head tilt no chin
             lift no chin drop, his folded-but-raised wings stay
             folded behind the shoulders throughout with only a hair
             of leathery membrane drift at the wing tips with the
             ambient breath, his long flexible tail stays curled
             behind the body to the viewer-right with the leaf-spade
             tip resting near the ground throughout with only a hair
             of imperceptible tail-tip motion, his front paws and
             rear paws stay planted throughout, his body and torso
             stay in canonical seated position throughout with no
             rotation. Expression: held closed-mouth knowing smirk
             with a single slow blink. The chunky hand-painted scales
             along the back and shoulders catch a faint shimmer of
             painted highlight as the back rises and falls almost
             imperceptibly with the ambient breath, the dorsal spines
             along the neck and back catch a faint highlight shimmer
             with the breath rhythm, the leathery wing membrane
             between the dorsal-red wing arms drifts almost
             imperceptibly with the breath, the long flexible tail
             and the gold underbelly plate segments hold steady.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no actual words no actual speech no music, soft natural calm ambient deep slow nose-breathing at a slow steady relaxed rhythm appropriate to a large creature, a faint leathery rustle of the folded wing membranes with the ambient breath, a faint soft scale-creak from the dorsal scale plates along the back and shoulders with the breath rhythm, no roar no growl no snarl no dragon vocalization, no actual words no actual speech no music

Constraints: no deep breaths no sharp breaths no quick breaths no short breaths no panting no audible inhales no audible exhales breathing is slow and calm and ambient and barely perceptible like a large creature at rest, mouth stays closed in canonical knowing smirk always, wings stay folded behind the shoulders always, dragon stays seated always, tail stays curled behind the body to the viewer-right always, no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom, no head turn no head tilt no chin lift no chin drop no side glance no brow arch no smirk widen no teeth visible no fangs visible, no wing flap no wing extend no wing spread no take-off no standing no rearing no stepping, no roar no growl no snarl no dragon vocalization, breathing is a continuous smooth ambient rhythm with no discrete visible breath events, no blue rim light no environment, seamless loop first and last frame identical to canonical pose with mouth closed in knowing smirk, 4s
