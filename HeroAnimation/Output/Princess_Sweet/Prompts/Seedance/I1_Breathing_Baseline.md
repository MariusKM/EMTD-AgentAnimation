# I1 — Breathing Baseline (Seedance 2.0)

> Idle movement | 4s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Princess_Sweet.png`
> Concept: [concepts.md](../../concepts.md) — I1 (mandatory breathing-only baseline, client direction 2026-04-22)

## Notes for this concept

- **Mandatory baseline idle** — the safe fallback the team can always pick. Strictly breathing-only, no character business.
- **Canonical pose preserved exactly** — gentle closed-mouth smile, rose held in right hand at chest height, left hand relaxed at her side.
- **Breathing must be calm and regular, not deep** (per Architect I1 lesson 2026-04-27) — multiple small soft breath cycles across the 4s loop, relaxed and natural. Avoid the words `slow deep quiet breaths` / `slow deep breath` / `single deep breath` anywhere in the prompt body. Constraints leads with `no deep breaths`.
- **Only motion**: chest rise/fall with each calm breath, tiny weight shift between breaths, occasional slow blink. Loose hair strands and dress hem drift minimally as ambient detail. Pearl earring may sway minutely.
- **No I2 / I3 / I4 business** — no rose-to-nose, no head tilt, no wink, no rose-pivot. Those are variants.
- **Closed-mouth FFLF** — held gentle smile does not arc.
- **Always-hold rose** at start of Constraints.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
environment, background scenery, talking, lipsync, voice, realistic proportions,
photorealistic, static frozen image, flat lighting, blue rim light, cyan edge light,
blue edge glow, warped hands, warped face, extra arms, dropping the rose,
tiara removed, choker removed, earring removed, head turn, head tilt, brow arch,
side glance, chin lift, smile widen, wink, rose lift, rose pivot, rose to nose,
rose to lips, vines, thorn vines, petal drift, VFX, deep breath, single big breath
```

---

Subject:     a graceful fairy-tale princess character with chibi proportions, slim build, very fair skin with rosy cheeks, large bright blue eyes, golden blonde hair styled in a large elegant updo bun with a few loose strands at the temples, a delicate silver crystal tiara with a small blue gem at the center placed in the updo, a single small pearl drop earring visible on her right ear, a thin pearl choker necklace at the throat, wearing a flowing royal blue ruffled ball gown with off-shoulder short puffed sleeves and a multi-tiered ruffled blue skirt over a white underskirt with small blue floral embroidery at the hem, holding a single red rose with a green stem delicately at chest height in her right hand, her left hand relaxed and open at her side, in her canonical pose with a gentle closed-mouth smile

Action:      stands in her canonical pose exactly as in the source
             image in a natural relaxed idle state, her breathing is
             slow and calm and ambient with the chest moving gently and
             almost imperceptibly throughout the loop in a continuous
             smooth rhythm without any visible discrete breath events,
             a tiny weight shift settles slowly across the loop, gives
             a single slow blink partway through the loop, her
             expression holds a gentle closed-mouth smile throughout,
             her right hand remains holding the single red rose at
             chest height and does not move, her left hand remains
             relaxed and open at her side and does not move.
             Expression: held gentle closed-mouth smile, one slow
             blink. The loose hair strands at her temples drift almost
             imperceptibly with the ambient breathing, the pearl
             earring sways minutely, the ruffled blue dress hem drifts
             minimally, the silver crystal tiara stays absolutely
             still, the red rose in her right hand stays absolutely
             still.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music, soft natural calm ambient nose-breathing at a slow steady relaxed rhythm, a faint cloth ambience from the ruffled blue ball gown, a faint papery ambience from the rose petals at rest, no voice no dialogue no music

Constraints: no deep breaths no sharp breaths no quick breaths no short breaths no panting no audible inhales no audible exhales breathing is slow and calm and ambient and barely perceptible like a person standing relaxed at rest, rose stays in right hand always, no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom, the single red rose with a green stem stays held in her right hand at chest height absolutely still and unchanged throughout, her left hand stays relaxed and open at her side absolutely still throughout, feet stay planted no stepping, no head turn no head tilt no chin lift no brow arch no smile widen no wink no side glance no rose lift no rose pivot no rose-to-nose no rose-to-lips, no vines no petal drift no VFX of any kind during the loop, breathing is a continuous smooth ambient rhythm with no discrete visible breath events, mouth stays closed throughout, the silver crystal tiara stays in her hair throughout never falls off, the pearl earring and pearl choker stay in place throughout, no blue rim light no environment, seamless loop first and last frame identical to canonical pose with the gentle closed-mouth smile and the rose held in her right hand at chest height, 4s
