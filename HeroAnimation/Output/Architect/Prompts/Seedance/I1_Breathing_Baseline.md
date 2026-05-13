# I1 — Breathing Baseline (Seedance 2.0)

> Idle movement | 4s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Architect.png`
> Concept: [concepts.md](../../concepts.md) — I1 (mandatory breathing-only baseline, client direction 2026-04-22)

## Notes for this concept

- **Mandatory baseline idle** — the safe fallback the team can always pick. Strictly breathing-only, no character business.
- **Canonical pose preserved exactly** — smug closed-mouth smirk, blade across the body in right hand, scroll bundle cradled under left arm.
- **Breathing must be calm and regular, not deep** (per user feedback 2026-04-27 on first-pass output) — multiple small soft breath cycles across the 4s loop, relaxed and natural. The first-pass prompt asked for "slow deep quiet breaths" and the model produced one single deep breath; the rewrite specifies "a steady rhythm of calm relaxed regular breaths with multiple small soft chest rises and falls." Constraints line also explicitly bans "one deep held breath."
- **Only motion**: chest rise/fall with each calm breath, tiny weight shift between breaths, occasional slow blink. Brass drafting arm and turban side-tail drift minimally as ambient detail.
- **No I2 / I3 business** — no brow arch, no chin tilt, no side-glance, no glasses-settle. Those are variants.
- **Closed-mouth FFLF** — held smug smirk does not arc.
- **Scroll language uses `coiled` not `rolled`** — see CLAUDE.md Seedance pitfalls section. Prophylactic on this prompt even though I1 has no scroll motion.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
environment, background scenery, talking, lipsync, voice, realistic proportions,
photorealistic, static frozen image, flat lighting, blue rim light, cyan edge light,
blue edge glow, warped hands, warped face, extra arms, dropping the blade,
scrolls unrolling, scroll bundle deforms, glasses removed, open mouth,
head turn, head tilt, brow arch, side glance, chin lift, smirk widen,
blade flourish, blade thrust, blade lift, green sparkles, mantle, cape, cloak
```

---

Subject:     a stocky scholarly architect character with chibi proportions, wearing a large red turban with a long red fabric side-tail draping down his right side, a fully extended brass folding drafting arm rising from the top of the turban, round gold-framed spectacles with a brown frame outer rim, thin waxed black handlebar mustache with curled tips, green tunic with rolled-up sleeves, brown leather cross-body harness with a brass center buckle, brown sturdy leather boots, holding a large silver caliper-protractor blade across his body in his right hand and cradling a bundle of three rolled tan parchment scrolls under his left arm, in his canonical pose with mouth closed in a smug smirk

Action:      stands in his canonical pose exactly as in the source
             image, takes a steady rhythm of calm relaxed regular
             breaths through his nose, a tiny weight
             shift settles between breaths, gives a single slow blink
             partway through the loop, his expression holds a smug
             closed-mouth smirk throughout, his right hand remains
             holding the silver caliper-protractor blade across his
             body and does not move, his left arm remains cradling the
             bundle of three coiled parchment scrolls and does not
             move. Expression: held smug closed-mouth smirk, one slow
             blink. The brass drafting arm at the top of the turban
             drifts almost imperceptibly with each small chest rise,
             the long red turban side-tail drifts minimally, the curled
             mustache tips stay steady, the coiled scrolls absolutely
             still.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music, calm relaxed regular quiet nose-breathing in a steady rhythm with multiple small breath cycles, a soft cloth creak of the green tunic and red turban with each gentle chest rise, a faint metallic ambient shimmer from the blade, no voice no dialogue no music

Constraints: no deep breaths, caliper blade in right hand always, scrolls under left arm always, no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom, the silver caliper-protractor blade stays in his right hand absolutely still and unchanged throughout, the bundle of three coiled scrolls stays cradled under his left arm absolutely still and fully intact throughout, feet stay planted no stepping, no head turn no head tilt no chin lift no brow arch no smirk widen no side glance no flourish no thrust no blade lift, breathing is calm and regular and relaxed, mouth stays closed throughout, the gold-framed spectacles stay on his face never removed, the turban has a long red fabric side-tail not a long flowing veil or trailing banner, no blue rim light no environment, seamless loop first and last frame identical to canonical pose with mouth closed, 4s
