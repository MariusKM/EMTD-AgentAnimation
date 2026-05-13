# Animation Concept Template

> Use this template during **Stage 2** of the pipeline to define what the character will do before writing any generation prompts. Concepts are model-agnostic.

## Core Rules (Client Direction, 2026-04-22)

1. **Power move = weapon action with real force.** The power movement must be a clean beat of the character using their weapon **with visible force, weight, and intent** — bow loose, hammer smash, pistol fire, fans snap, scepter thump, spoon club, scroll scribble. Do **not** design around the hero's skill kit / ability kit (summoned walls, protective scrolls, thorn magic, AoE buffs). Those belong in gameplay, not the hero screen. Pull the weapon and its natural action from the hero doc's `Weapon` section and the CSV `Default Attack Style` / `Silviu notes`. **No-force theatrical concepts are NOT power moves** (added 2026-05-06 on Princess Arrogant) — concepts whose substance is a snap-shut/snap-open attitude beat, a chin-lift dismissal, a fan-flutter, a pose-and-hold theatrical reveal, a wink-and-shrug, or any other "personality first / weapon barely involved" beat belong in the **expressive idle** slot (I2+), never in the power slate. The power-move authoring test: *if you removed the VFX and the weapon, would what's left still read as a powerful strike?* If the answer is no, it belongs in the idle slate. Princess Arrogant's first-pass `P2 Disdainful Snap-Snap` failed this test (snap-shut → chin-lift → snap-open is pure attitude with no strike) and was replaced with `P2 Imperial Fan-Point Decree` (forward power thrust with shockwave VFX). Princess Sweet's first-pass had the same failure mode (rose-sniffing power moves) and was rebuilt around magical-spectacle thorn-bloom strikes. Personality decorates the strike (smug knowing smirk, imperial chin-up, dry nod, theatrical flourish on recovery) — it is never the substance of the strike itself.
2. **Moneybags exception.** Moneybags leads with a coin-bag toss-and-catch, then transitions into raising and firing his pistol. He is the only hero whose power move combines two beats.
3. **Every hero has one mandatory breathing-only idle (I1).** Chest rise/fall, micro weight shift, minimal secondary motion. No character business, no fidgets, no prop interaction. This is the safe baseline the team can always pick.
4. **Expressive idles (I2+) are optional variants on top of I1** — a Spy sneaky glance, a Fat King belly pat, a Moneybags coin heft. Propose these alongside the baseline, never instead of it.
5. **Content-bearing surfaces default to BLANK unless specified (added 2026-05-05 on Herald).** When a hero's canonical equipment includes a scroll, book, page, parchment, letter, map, banner, sign, tablet, ledger, or any prop with a visible surface that conventionally bears writing or imagery, Seedance defaults to **rendering the surface blank** unless the prompt explicitly describes the visible content. Audit during Stage 1 / Stage 3 and bake visible content into the **Subject line** (`tan parchment scroll covered in visible flowing handwritten black-ink calligraphy lines of royal-decree script`, `open leather-bound book with visible handwritten ink notation`, etc.). When the prop unfurls / opens / reveals more surface area in Action, explicitly describe the additional content revealed. Add a Constraints integrity clause: `the [surface] has visible [content] throughout the entire loop the [surface] is never blank or empty`. Especially critical for cross-out / X-mark / annotation power moves where the action must land on existing content to read at all. See `HeroAnimation/CLAUDE.md` Tone & Style section for full worked examples and the FFLF integrity pattern.
6. **Every hero gets one VFX-heavy power concept (slate-mandatory, added 2026-05-05 on Herald).** Regardless of personality fit, every hero's power slate must include at least one **spectacle-scope** concept where the **VFX is the visible power** — multiple simultaneous VFX paths, off-frame element growth, large element count (10+ glyphs / particles / vine streams / sparks / etc.), and a held peak that fills the foreground. This is the hero's "hero-tier" reading for the slate and gives the client/team a high-spectacle option even on bureaucratic, stoic, or comedic characters. Body motion can stay small if the personality demands it (Herald stays composed-bureaucratic; Spy stays narrative-light) — the VFX carries the spectacle. Reference exemplars: Princess Sweet P6 (Thorn Forest Bloom) / P7 (Hand-Cast Vine Spiral) / P8 (Crown of Thorns) / P9 (Forward Bloom Surge); Herald P6 (Edict Storm). The concept must obey the same loop-integrity rule as any other (FFLF intact, all VFX dissipates before loop end) and inherits the **higher first-pass generation risk** profile — recommend running it AFTER a simpler concept lands cleanly so the keyer + prompt craft are tuned to the hero's quirks.

7. **Personality-theme bleed-through audit (added 2026-05-06 on Moneybags).** When a hero's personality is built around a single defining theme (greed, fear, vanity, gluttony, paranoia, etc.), every concept in the slate — power AND idle — must visibly express that theme, not just one "themed" concept and four neutral ones. Moneybags' first-pass slate had only one money-driven concept (P2 Coin Shower) plus four compound moves where the pouch was tacked-on rather than driving the beat; user pushback was that **all five power concepts must drive on greed** because that IS the character. Rebuilt slate: P1 fires gold coins as the projectile, P2 coin shower spectacle, P3 comedic coin calamity (his money escapes him), P4 tax magnet vortex (he commands wealth), P5 coin-loaded reload (literal money weaponization). **Authoring rule**: at Stage 2, before locking the slate, audit each concept and ask *does this concept visibly express the hero's defining theme, or is it a neutral compound with the theme tacked on?* Generic-with-flavor concepts get reworked or dropped. Same audit applies to expressive idles (I2+): Moneybags I2 (pouch heft / weighing money) and I3 (coin peek / inspecting his money) both center on greed, not on generic fidgets. The breathing-only I1 baseline is exempt — it stays neutral by mandate. Cross-reference: this rule pairs with the **hero-archetype audit** at Stage 1 in `SKILL.md` — archetype determines tonal weight (comical / dry / powerful), theme drives every concept's *content*.

8. **Idle loops get one expressive beat, not chained-doubled beats (added 2026-05-06 on Moneybags I2).** Multi-beat idles (two pouch hefts, two head-tilts, three weight-shifts) read as "the character doing the same thing twice in 4 seconds" rather than as a rhythmic loop. Single beats per expressive idle work better. Moneybags I2 first-pass had two pouch hefts back-to-back; user pushback flagged the repetition as awkward. Fix: drop to one heft, hold the smug afterglow longer, let the canonical pose breathe. **Authoring rule**: at concept stage and prompt stage, every expressive idle (I2, I3, I4) gets exactly ONE expressive beat (one heft, one wink, one glance, one prop-touch) plus canonical-state framing. The breathing-only I1 baseline still uses continuous ambient breathing per the standard pattern (no discrete events). Rule does not apply to power moves (multi-beat power concepts are correct per the timecoded-segment lesson).

## Character: {{hero_name}}

### Reference
- Source art: `Source/Heroes Stylized/{{hero_name}}.png`
- Hero description: `Docs/Heroes/{{hero_name}}.md`
- Personality keywords: {{personality_keywords}}
- Weapon: {{weapon}} — {{natural_weapon_action}}

---

## Power Movement Concepts

> Propose 3-5 weapon-driven ideas. Every concept centers on the hero using their weapon in one clean beat. Personality comes through *how* they do it (stance, timing, expression, VFX) — not through abilities or non-weapon business.
>
> **Per-hero kinetic-shape diversification (learned 2026-04-27 on Architect Stage 5 review)**: When proposing 3-5 power concepts for a single hero, deliberately diversify the **kinetic shape** within that hero's own set — not just across the roster. Architect's first concept set converged on horizontal arc + rotational flourish + forward press patterns, and the outputs read visually similar even though the concepts were intentionally distinct. Seedance has a strong prior for continuous circular/arc motion (see `HeroAnimation/CLAUDE.md`), which compounds the convergence. To get visual variety across a single hero's locked set, ensure the concepts span at least **3 of these 6 kinetic axes**:
>
> 1. **Horizontal arc / sweep** — sword slashes, hammer side-sweeps, rotational flourishes
> 2. **Vertical down/up** — overhead smashes, ground plants, decree-stakes, vertical lifts
> 3. **Forward thrust / press** — fencer's riposte, broad-face presses, forward extends, point-and-hold
> 4. **Diagonal cut / sweep** — upper-right to lower-left (or vice versa), distinct from purely horizontal or vertical, with straight-line VFX rather than arc
> 5. **Multi-beat sequence with off-screen elements** — throw + return, exits + recoveries, dual-prop coordination (highest production value but highest generation risk; needs discrete timecoded beats in the prompt)
> 6. **No-force theatrical pose** — show, present, demonstrate, hold without big force — relies on attitude/expression rather than motion arc
>
> Cross-reference with the **cross-hero kinetic-shape audit** (Fat Princess concepts.md, 2026-04-23) which audits against other heroes' locked concepts. Both rules apply at concept stage: diversify within the hero AND avoid collisions with the rest of the roster.

> ⚠ **Heading format is webapp-parser-critical** (Merchant 2026-04-30, Diana 2026-05-06 idle-block recurrence). Headings below MUST start with the bare concept ID (`### P1 — Title` / `### I1 — Title`) — never `### Concept P1 ...` or `### Concept I1 ...`. The webapp regex `/^#{3,4}\s+([PI])(\d+)\s*[:\-—]\s*(.+?)\s*$/` requires the ID immediately after the `###`. The `Concept` prefix silently fails the parser and the concept (and all its prompt files) vanishes from the webapp UI. After authoring, grep with `^#{3,4}\s+(Concept\s+)?[PI]\d+` and confirm zero matches contain `Concept`. See `HeroAnimation/CLAUDE.md` Pipeline / Tooling section for the full lesson.

### P1 — {{concept_name}}
- **Weapon action**: What the weapon physically does (the beat — draw/load/aim/strike/fire/slash/smash/etc.)
- **Character delivery**: Stance, expression arc, small personality flourish layered onto the weapon action (smirk before firing, dry nod after the strike, etc.)
- **Timing feel**: Fast/snappy, heavy/deliberate, theatrical/showy, etc.
- **VFX element**: The signature visual effect (slash trail, muzzle flash, particles, glow, etc.)
- **Secondary motion**: What reacts — cape, hair, accessories, fabric
- **Reference**: Which existing animation is closest in feel? (Diana=agile slashes, Wilhelm=heavy slam, Spy=narrative beats, Moneybags=theatrical showcase)

### P2 — {{concept_name}}
...

### P3 — {{concept_name}}
...

> **Do not propose**: ability-based concepts (summoning walls, casting buffs, skill-kit VFX without the weapon), non-weapon business as the power move (pure facial reactions, pure posing). Those can live in expressive idles (I2+), not the power slot.

---

## Idle Movement Concepts

> Propose **I1 as the mandatory breathing-only baseline**, then 1-2 optional expressive variants (I2, I3).

### I1 — Breathing baseline *(mandatory)*
- **Action**: Chest rise/fall, micro weight shift. Nothing else.
- **Expression**: Resting personality face (smirk, scowl, calm smile) — held, not arcing.
- **Secondary motion**: Minimal — subtle cape/hair drift, occasional blink.
- **Duration feel**: 4s steady loop.
- *(This slot is filled the same way for every hero. It is the fallback option the team can always pick.)*

> **Stage 3 prompt-authoring note (learned 2026-04-27 on Architect I1, applies to every hero's I1)**: Seedance interprets `slow deep quiet breaths` as **one single deep breath**, not multiple breaths across the loop. To get the intended steady rhythm of multiple calm breath cycles in 4s, the prompt must:
> - **Action**: specify rhythm + multiplicity. `a steady rhythm of calm relaxed regular breaths through his/her nose with multiple small soft chest rises and falls visible across the loop` (or similar — the key tokens are `steady rhythm`, `calm`, `regular`, `multiple`, `small`).
> - **Sound**: reinforce. `calm relaxed regular quiet nose-breathing in a steady rhythm with multiple small breath cycles`.
> - **Constraints**: lead with a short imperative ban at the very front of the line (like the always-hold pattern). `no deep breaths, [hero's always-hold clauses], ...`.
> - **Avoid** the words `slow deep quiet breaths` / `slow deep breath` / `single deep breath` anywhere in the prompt body — they collapse to one breath in the output.
>
> This is a baked-in Seedance default, not a per-hero quirk. Apply this on every I1 prompt without re-discovering it.

### I2 — {{expressive_variant_name}} *(optional)*
- **Subtle action**: Character-specific resting business (glance, hand flourish, prop heft, shoulder roll).
- **Expression**: Resting face — what emotion reads? Does it arc?
- **Breathing/weight**: How do they carry themselves?
- **Secondary motion**: Ambient movement on cape, hair, accessories
- **Duration feel**: 4s loop.

### I3 — {{expressive_variant_name}} *(optional)*
...

---

## Approved Concept

> After review with user, document the final selection.

### Power Movement: {{chosen concept name}}
{{Final refined description}}

### Idle Movement: {{chosen concept name}}
{{Final refined description}}

### Total Loop Target
- **Duration**: {{5-7}}s
- **Split**: ~{{X}}s power + ~{{Y}}s idle
- **Loop**: Must seamlessly connect end → start
