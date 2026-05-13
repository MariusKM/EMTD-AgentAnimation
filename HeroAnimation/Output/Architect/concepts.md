# Animation Concepts — Architect

> Stage 2 working doc. Concepts are model-agnostic — prompt translation happens in Stage 3.

## Character Context
- Source art (FFLF input): `Source/Heroes Stylized/Architect.png` — closed-mouth smug smirk, no neutral variant needed
- Hero description: `Docs/Heroes/Architect.md`
- Personality keywords: refined, smug, confident, precise, eccentric, condescending-charming, draftsman-as-duelist
- Weapon: large silver **caliper-protractor blade** (literal blade shaped like a draftsman's caliper-divider with a protractor arc along the bottom edge) — held forward across the body in his **anatomical right hand** (viewer's left side of image)
- Off-hand: bundle of three rolled parchment scrolls cradled in his **anatomical left arm** (viewer's right side of image)
- Tone direction: jovial / slightly comical (client, 2026-04-16) — Architect is a **"refined character"** per StyleGuide_Animation §3 — humor expressed through *attitude* (raised brow, nose tilt, smug nod) rather than broad comedy
- Animation focus: **scholar-as-duelist** — precision, controlled timing, "I have already solved this" smugness. Refined fencer's discipline, not heavy combat.
- Canonical pose for FFLF: three-quarter view, chin lifted, closed-mouth smug smirk, eyes slightly half-lidded behind the gold-framed spectacles, blade held forward across the body in anatomical-right hand, scrolls cradled in anatomical-left arm

## Hand convention (per Seedance/Fat King 2026-04-16 lesson)
- **Anatomical right hand** (viewer's **left** side of image) = caliper-protractor **blade**
- **Anatomical left arm** (viewer's **right** side of image) = **scroll bundle**
- All prompts must use anatomical terms.

## Off-hand prop integrity rule
- The three rolled scrolls under the left arm are an **off-hand prop with a fixed silhouette** at FFLF.
- Permanent mutations (one scroll fully unrolled at end, scroll dropped, count reduced, ink-blot stain) are **invalid as written** — t=0 and t=loop-end are the same frame.
- A scroll briefly unrolling and re-rolling/tucking back into the bundle within the loop is fine, provided the bundle silhouette is identical at start and end. P2 below uses this carefully.

## Differentiation notes (cross-hero kinetic-shape audit, 2026-04-23 method)
The roster is heaviest on **vertical-smash** (Blacksmith P1, New King P3, Fat King P7, Fat Princess P1) and **salute/oath/raise** (New King P1/P7/P9, Fat King P8). Forward-thrust and horizontal-swing are also well-covered. Architect's primary differentiation should come from:
1. **Unique blade-shape VFX** — the caliper-protractor blade literally draws geometric arcs / measurement lines as it moves. No other hero has this read.
2. **Refined fencer's timing** — controlled, wrist-driven, precision-flick rather than full-arm windup. Differentiates even shared kinetic shapes (forward thrust, slash).
3. **Smug-attitude beats** layered on the weapon action — chin lift, brow arch, dismissive nod — per StyleGuide_Animation §3 "refined characters" guidance.

The vertical-smash and salute axes are explicitly avoided in the proposals below.

## Seedance pitfalls to guard against (concept-stage checks)
- **No green VFX**: signature VFX uses warm ink-blue, brass-gold, or fine white drafting-line trails — no green/mint sparkles (keyer would eat them).
- **Avoid "twirl"/"spin" without anchoring** (per Fat Princess P4 lesson, 2026-04-23): if a hand-only flourish is intended, use "the blade rotates once in his hand" not "twirls" — Seedance reads `twirl`/`spin` as full body rotation. Pin "exactly one rotation" + "camera does not orbit only the blade rotates in his hand" in Constraints.
- **Static-camera prefix**: lead Subject with `static camera shot of...` — every concept below has either a snap-action or a precise small motion that Seedance might misread as a camera move.
- **Anatomical-hand discipline**: blade stays in anatomical right hand (viewer left), scrolls stay in anatomical left arm (viewer right). Lock in all prompts.
- **No "mantle"/"cloak"/"robe" over-read terms** — describe the turban as "large red turban with long fabric side-tail" and the harness as "brown leather cross-body harness with brass center buckle." No garment-noun ambiguity.
- **Glasses framing**: prompts should call out "round gold-framed spectacles, brown frame outer rim, gold inner rim" so Seedance doesn't push them to bright pure gold.
- **Brass drafting arm on the turban tip**: explicitly include in subject description (`fully extended brass folding drafting arm rising from the top of the turban`) — small accessories like this drop out of Seedance output if not named.

---

## Power Movement Concepts

### P1 — Measuring Arc Slash ⭐ (signature blade-shape VFX)
- **Weapon action**: From canonical (blade held forward across the body in anatomical-right hand), Architect draws the blade back to his anatomical-right shoulder with a refined wrist-pull anticipation (no big arm windup — fencer's discipline). His chin tilts up half an inch, brow arches over the spectacles. Then he sweeps the blade forward in a **smooth horizontal arc at chest height**, the protractor edge leading. As the arc completes, **a fine glowing geometric arc traces in the air** along the blade's sweep — a clean semicircle with faint tick-mark notches like a protractor diagram drawn in midair. The arc lingers a beat, then fades. Blade decelerates back across the body to canonical, smug closed-mouth smirk widens a hair on the settle.
- **Character delivery**: Smug brow-arch anticipation → controlled wrist-driven arc → "I have measured" pleased nod → settle. The geometric VFX makes the slash *feel* like a draftsman's compass swing rather than a combat strike.
- **Timing feel**: Short refined wind-up (~0.6s wrist pull, no shoulder commit), smooth medium-speed arc (~0.7s), held arc-trace VFX (~0.8s), slow settle (~2.5s). Diana-snap structure but slower and more measured.
- **VFX**: **Glowing fine drafting-line arc** following the blade through the sweep — clean semicircle with faint tick-marks where the protractor scale would land. Color: warm ink-blue or brass-gold (NOT green). Lingers ~0.8s and fades.
- **Secondary motion**: Turban side-tail lifts and trails the arc; brass drafting arm at the turban tip bobs once on the wrist-pull anticipation; scrolls under the left arm shift very slightly with the upper-body rotation; mustache curls ride the chin lift.
- **Reference**: Diana slash-arc structure with the blade trail re-skinned as a measured geometric figure. The "arc-becomes-protractor-diagram" beat is unique to Architect.
- **Duration**: 6s
- **Risks in prompt stage**: Geometric VFX must read as a clean arc with tick-marks — describe explicitly as "a fine glowing semicircular line trail" with "faint tick-mark notches along the arc" so Seedance doesn't fall back to a generic motion blur.

### P2 — Blueprint Tap & Diagnosis ⭐ (off-hand interaction, weapon-as-pointer)
- **Beat 1 — Reveal (~0.8s)**: Anatomical-left arm rotates outward a few inches and the **top scroll of the bundle unrolls partway** (held by the same arm that cradles the bundle — fingers grip the loose end, the rest of the bundle stays tucked under the elbow). A short stretch of parchment hangs visible across the front of his torso, ink linework just barely readable. Other scrolls in the bundle stay rolled and visible.
- **Beat 2 — Inspection (~0.6s)**: Chin lifts, brow arches, eyes drift down to the unfurled blueprint with smug recognition.
- **Beat 3 — Diagnosis tap (~0.4s)**: Blade lifts from canonical and **taps the unfurled blueprint sharply twice** with the protractor-arc edge — sharp tap-tap. Each tap leaves a tiny ink-blot ripple of warm ink-blue light at the tap point.
- **Beat 4 — Smug verdict (~0.8s)**: Chin lifts further, brow arches higher, closed-mouth smirk widens — "I have located the flaw and you may now correct it." Small dismissive head-shake.
- **Beat 5 — Re-roll & settle (~3.4s)**: The blueprint rolls back up smoothly and tucks back into the bundle (silhouette returns identical to FFLF — three rolled scrolls under the left arm). Blade returns across the body to canonical. Smirk softens to held canonical smirk.
- **Character delivery**: Refined inspector finding fault with the world. The blade is the diagnostic instrument; the blueprint is the canvas; the smirk is the punch line.
- **Timing feel**: Slow refined reveal, brief inspection beat, sharp clean tap-tap (the only fast beat — fencer's wrist), slow smug verdict, smooth re-roll and settle. ~6s total.
- **VFX**: Two small warm ink-blue ripple-bursts at the blueprint tap-points (each fades after ~0.4s). No motion trail on the blade — this is precision tapping, not slashing.
- **Secondary motion**: Brass drafting arm at the turban tip catches light on the chin-lift; turban side-tail drifts slightly with the upper-body lean toward the blueprint; rolled-up sleeve cuff shifts on the tap; mustache curls ride the smirk widen.
- **Reference**: New King P8 Builder's Decree structure (off-hand prop interaction as the beat) — but here the **weapon is primary**: the blade actively taps; the blueprint is the diagnostic surface, not the focus. Personality echo: refined inspector vs. New King's leader-with-decree.
- **Duration**: 6s
- **Risks in prompt stage**: (a) FFLF integrity — bundle MUST return to three-rolled-scrolls silhouette by t=loop-end (re-roll and tuck back is non-negotiable); (b) blueprint visibility — describe the unfurled section as "a single scroll partially unrolled across his torso, the other two scrolls remain tucked and rolled" so Seedance doesn't unfurl all three; (c) blade tap is precise short contact — describe as "the blade taps the blueprint twice sharply" not "stab" or "strike" so it doesn't pierce the parchment; (d) "ink-blot ripple" VFX color must be warm ink-blue or brass-gold, not green.

### P3 — Caliper-Compass Open & Snap (mechanical-detail variant)
- **Weapon action**: From canonical, Architect lifts the blade from across the body up to vertical at chest height, **calipered points facing forward toward the viewer**, the protractor arc at the bottom. Holds it presentation-style for a beat. Then the **two divider points slowly open a few inches** (mechanical articulation — the blade has divider-style legs that hinge at the top), as if measuring an invisible distance in front of him. He squints down the calipers smugly through the spectacles. Then **SNAP closed** with a clean metallic click. Brow arches, chin lifts: "Q.E.D." Returns the blade smoothly to canonical position across the body.
- **Character delivery**: Smug measurer. The blade is treated as an actual draftsman's tool, mid-action — refined fencer's discipline applied to a measurement gesture. Closed-mouth smirk holds; brow does the heavy lifting.
- **Timing feel**: Smooth lift to vertical (~1s), held presentation (~0.8s), slow open of calipers (~1s), squinted measurement beat (~0.5s), snap close (~0.2s — sharp), smug verdict hold (~0.8s), slow settle (~1.7s). ~6s total.
- **VFX**: Tiny brass-gold gleam on each caliper point at the snap-close moment; minor sparkle line traveling along the protractor arc on the lift. No motion trail.
- **Secondary motion**: Brass drafting arm at the turban tip catches light on the chin-lift; turban side-tail drifts on the smug verdict; spectacles catch a sharp gold reflection on the snap; mustache curls ride the brow arch.
- **Reference**: Refined no-force theatrical pose (similar in spirit to Fat Princess P6 Showcase but with mechanical articulation). Closest in feel: General's authority-bearing without the salute structure.
- **Duration**: 6s
- **Risks in prompt stage**: The mechanical open-close articulation of the divider points is **the highest-risk beat in this concept set** — Seedance may render the blade as a fixed solid silhouette rather than a hinged divider that articulates. **Mitigations**: (a) describe the blade explicitly as "two silver divider points hinged at the top of the blade, resembling a draftsman's caliper-divider, that hinge open a few inches and then snap closed"; (b) lead Subject with `static camera shot of...`; (c) include a fallback acceptance — if Seedance ignores the articulation and just lifts/lowers the solid blade, the concept still reads as a measured presentation beat. Worth a generation-test before locking.

### P4 — Architect's Riposte (refined fencer's forward thrust)
- **Weapon action**: From canonical, Architect's chin lifts a quarter-inch with a smug brow arch — looking down his nose at the viewer. Brief held beat. Then a **precise controlled forward thrust** with the blade — all wrist and forearm, no shoulder commit. The blade extends forward toward the viewer at chest height, calipered tip leading. Holds the thrust briefly, smug-eyed down the blade. Pulls the blade back smoothly to canonical with a small dismissive head-shake — "obviously."
- **Character delivery**: Refined duelist's riposte. The thrust is short, fast, and clean — no big-arm windup, no theatrical follow-through. Personality lives entirely in the chin-lift anticipation and the dismissive settle. "I have already won; this is a formality."
- **Timing feel**: Slow chin-lift anticipation (~1s), held smug beat (~0.6s), snap forward thrust (~0.3s — the only fast beat), held thrust pose (~0.8s), slow retract (~0.8s), dismissive head-shake settle (~2.5s). ~6s total.
- **VFX**: A short forward streak of brass-gold light from the blade tip on the thrust — fades within ~0.3s. Tiny gleam on the spectacles on the chin-lift. No lingering trail.
- **Secondary motion**: Brass drafting arm at the turban tip catches light on the chin-lift; turban side-tail flicks once on the snap-thrust; scrolls shift minimally with the slight forward weight transfer; mustache rides the smug head-shake.
- **Reference**: Forward-thrust axis (same family as Fat King P6, New King P6, Fat Princess P3) — differentiated by **refined fencer's timing**: tight wrist-driven snap rather than heavy committed thrust. The chin-lift anticipation and dismissive settle are the personality differentiators.
- **Duration**: 6s
- **Risks in prompt stage**: Forward thrust must read as character-anatomical forward, not a camera push-in (lead Subject with `static camera shot of...` and pin in Constraints "the blade thrusts forward through the frame the camera does not zoom or push in"). Per CLAUDE.md Spy lesson, never write "leans forward toward the viewer" — describe the lean as character-internal: "his upper body commits an inch forward with the thrust."

### P5 — Geometric Flourish & Held Point (rotational + measurement-pose)
- **Weapon action**: From canonical, the blade rotates **once** in his anatomical-right hand — a tight semicircular flourish that traces a short glowing arc in front of him at chest height. The flourish settles with the blade extended forward, calipered tip pointing at a precise spot in the air at viewer height. He holds the **measurement point pose** with a smug brow arch and chin lift — as if he has just located something invisible and rendered it visible by measurement. Settles back to canonical with a satisfied closed-mouth smirk.
- **Character delivery**: Refined showmanship. The flourish is brief and disciplined — no Diana-style multi-arc combo, just one clean rotation that says "let me show you exactly where the problem is." The held pointing pose is the punch line.
- **Timing feel**: Smooth flourish (~1.2s — one full rotation), settle into pointing pose (~0.4s), held smug measurement beat (~1.5s), slow return to canonical (~2.9s). ~6s total.
- **VFX**: Fine glowing geometric arc trailing the blade through the rotation (similar to P1's arc VFX but a tighter loop, not a wide slash). At the point-hold, a small drafting-line cross-mark briefly appears at the spot the blade indicates — like a pencil cross-hair on a blueprint — fades within ~0.5s.
- **Secondary motion**: Brass drafting arm at the turban tip catches light through the rotation; turban side-tail drifts with the rotation; scrolls under the left arm stay locked; mustache rides the chin-lift.
- **Reference**: New King P4 Guardian's Flourish structure but tighter (one rotation not two), and ending in a held measurement pose rather than returning straight to canonical. The cross-hair VFX at the point is unique to Architect.
- **Duration**: 6s
- **Risks in prompt stage**: (a) "Rotates once" must be pinned — per Fat Princess P4 lesson, write "the blade rotates exactly one full turn in his hand" + "camera does not orbit only the blade rotates" so Seedance doesn't read it as a body pirouette or camera move; (b) "geometric arc trailing the blade" + "small drafting-line cross-hair appears at the indicated spot" — both VFX described concretely; (c) the held pointing pose duration is the personality hold — describe as "held smug measurement pose with chin lifted and brow arched" not "freezes" so the body still subtly breathes through the hold.

> **Do not propose for Architect**: vertical-down smashes (saturated on the roster); ability-kit beats (no protective-spell scroll-casting per the weapon-driven rule — that's gameplay); broad-comedy beats (he's a refined character per StyleGuide_Animation §3 — humor through attitude only).

---

## Idle Movement Concepts

> Overall idle direction: Architect is **smug, refined, content with his own intelligence, mouth-closed throughout**. Motion is small, precise, and attitude-driven. Refined humor channel: brow arches, chin tilts, slow side-glances, glasses-settle nods. No fidgets, no prop interaction beyond what FFLF preserves.

### I1 — Breathing Baseline *(mandatory)*
- **Subtle action**: Canonical pose preserved exactly — blade held forward across the body in anatomical-right hand, scroll bundle cradled in anatomical-left arm. Slow chest rise/fall with breath. Tiny weight shift between breaths. Nothing else — no brow arch, no chin tilt, no glasses settle, no head movement.
- **Expression**: Held closed-mouth smug smirk, chin lifted, eyes slightly half-lidded behind the spectacles. Occasional slow blink.
- **Breathing/weight**: Slow steady breathing, fully grounded stance, both prop positions unchanged.
- **Secondary motion**: Brass drafting arm at the turban tip drifts almost imperceptibly with breath; turban side-tail drifts minimally; mustache curls steady; scrolls absolutely still.
- **Duration**: 4s
- **Why added**: Satisfies the client mandatory-baseline idle rule. The safe fallback the team can always pick. I2-I3 are expressive variants on top.

### I2 — Brow Arch & Slow Side-Glance ⭐ (refined humor through attitude)
- **Subtle action**: Eyes slowly drift to one side with a smug knowing look — "have you understood yet?" — while the brow arches a hair. Brow lowers, eyes return to forward. Closed-mouth smirk widens almost imperceptibly on the return. One quiet beat per loop, the rest is held breathing.
- **Expression**: Held smirk → brow arch + slow side-glance → smirk widens a hair → settle. All closed-mouth.
- **Breathing/weight**: Slow steady breathing, weight unchanged.
- **Secondary motion**: Brass drafting arm at the turban tip drifts minimally with the chest rise; turban side-tail still; spectacles catch a tiny gold reflection on the brow arch; mustache curls subtly ride the smirk.
- **Duration**: 4s
- **Why it works**: Realizes the StyleGuide_Animation §3 "refined characters" guidance directly — humor through attitude (raised brow + side-glance), not broad comedy. Pure mouth-closed refined-character signature.
- **Risks**: Side-glance must stay subtle (eyes only, no head turn) — describe as "his eyes slowly drift to one side then return forward" and "his head does not turn." Avoid "scans" (scanning reads as paranoid head-snaps, wrong character).

### I3 — Glasses Settle (chin-tilt push)
- **Subtle action**: Chin lifts a quarter-inch with a refined head-tilt back — the kind of motion that visually settles a pair of slipping spectacles into place via the bridge of the nose rather than a hand push. Smirk holds. Brow arches a hair on the settle peak. Chin returns to canonical level. Closed-mouth throughout.
- **Expression**: Held smirk → smirk-with-arched-brow on the chin-lift peak → settle to held smirk.
- **Breathing/weight**: Slow steady breathing, weight unchanged. The chin-tilt is the entire beat.
- **Secondary motion**: Brass drafting arm at the turban tip catches light on the chin-lift; turban side-tail drifts very slightly; spectacles catch a clean gold reflection at the peak; mustache curls ride the brow arch.
- **Duration**: 4s
- **Why it works**: A glasses-settle is one of the most character-specific refined beats imaginable for a scholar — doing it with the chin instead of a hand keeps both props locked at canonical (FFLF safe). Reads as "I am simply too refined to use my hands for this."
- **Risks**: Describe as "his chin lifts a quarter-inch" + "his head tips back a few degrees" — never "he adjusts his glasses with a hand" (the off-hand is full of scrolls and the blade hand is committed; either would mutate the FFLF prop layout).

---

## Recommendations

### Power
- **P1 Measuring Arc Slash** — strongest signature. The geometric protractor-arc VFX is unique to Architect's blade shape; no other hero on the roster has this read. Lowest risk after P4.
- **P2 Blueprint Tap & Diagnosis** — most "Architect" of the set. Realizes his scholar-as-duelist character through the off-hand prop interaction, and the refined-inspector punch line (smug verdict after the tap-tap) lands the personality direction perfectly. FFLF integrity risk is real but manageable.
- **P4 Architect's Riposte** — cleanest weapon beat. Differentiates from other forward-thrust concepts via refined fencer's timing. Lowest generation risk of the set.

### Idle
- **I1 Breathing Baseline** *(mandatory — always include)*
- **I2 Brow Arch & Slow Side-Glance** — best expressive variant. Realizes the "refined humor through attitude" direction with no FFLF risk.

### Strong combos
| Combo | Character read |
|-------|----------------|
| **P1 + I2** | Pure smug measurer — geometric slash + slow knowing glance. Most coherent. |
| **P2 + I1** | Refined inspection beat resting back into still smug breathing. Low risk. |
| **P4 + I3** | Disciplined fencer's riposte + glasses-settle. Most "scholar in his element." |

---

## Approved Concept

> Locked 2026-04-27. User selected the full power slate minus P3 (caliper-snap mechanical-articulation risk too high), and all three idle concepts.

### Power Movement (4 approved)
- **P1 — Measuring Arc Slash** ⭐ — horizontal arc with glowing protractor-arc VFX
- **P2 — Blueprint Tap & Diagnosis** ⭐ — off-hand blueprint reveal + blade tap-tap + smug verdict
- **P4 — Architect's Riposte** — refined fencer's forward thrust with chin-lift anticipation
- **P5 — Geometric Flourish & Held Point** — one-rotation flourish settling into a held pointing pose with cross-hair VFX

### Idle Movement (3 approved)
- **I1 — Breathing Baseline** *(mandatory)* — pure breathing, held smug smirk
- **I2 — Brow Arch & Slow Side-Glance** ⭐ — refined humor through attitude
- **I3 — Glasses Settle (chin-tilt push)** — chin-lift that visually settles the spectacles

### Deferred
- P3 Caliper-Compass Open & Snap — mechanical articulation risk on Seedance is too high; revisit if/when we have a way to validate hinged-divider rendering

### Total Loop Target
- Power duration: 6s (per concept)
- Idle duration: 4s (per concept)
- Loop: Each independent, must seamlessly connect end → start via the canonical FFLF pose

---

## Round 2 Concepts (2026-04-27 — diversifying away from circular motion)

> **Stage 5 review feedback (2026-04-27)**: Round 1 power concepts (P1, P2, P4, P5) all read as variants of circular/arc motion in the generations even though they were intentionally distinct concepts. Two compounding factors: (a) all concepts described their action as one continuous flourish, and (b) Seedance has a strong prior for smooth continuous arc patterns and collapses multi-beat actions into circular motion when not given discrete-beat language. (See `CLAUDE.md` Seedance pitfall about continuous-circular bias and `PromptTemplates/animation_concepts.md` per-hero kinetic-shape diversification rule.)
>
> Round 2 deliberately spans three new kinetic axes that Round 1 didn't cover: **multi-beat sequence with off-screen elements** (P6), **vertical down/plant** (P7), **diagonal cut with straight-line VFX** (P8).

### P6 — Boomerang Throw & Scroll Review ⭐ *(user-suggested, multi-beat axis, highest production value / highest risk)*
- **Beat 1 — Anticipation (~0.0–0.6s)**: Smug chin lift, brow arch over the spectacles. He holds the smug beat for a moment.
- **Beat 2 — Throw (~0.6–1.2s)**: Right hand snaps the silver caliper-protractor blade to the right with a wrist-flick. The blade exits the frame to the right with a brief brass-gold trail behind it.
- **Beat 3 — Scroll reveal (~1.2–2.4s)**: Now-empty right hand joins the left arm at the scroll bundle. The top scroll partially unfurls with the right hand gripping the loose end across the front of his torso, showing faint dark ink linework. The other two scrolls stay coiled and tucked under his left elbow.
- **Beat 4 — Smug verdict (~2.4–3.4s)**: Chin lifts, brow arches further, smug closed-mouth smirk widens. Small dismissive head-shake — "noted."
- **Beat 5 — Scroll re-coil (~3.4–4.2s)**: The unfurled section coils back smoothly and tucks back into the bundle. Bundle returns to three intact coiled scrolls.
- **Beat 6 — Catch (~4.2–5.0s)**: The blade re-enters the frame from the **left** side on a curved return path, brass-gold trail leading. Right hand catches the handle with a clean snap.
- **Beat 7 — Settle (~5.0–7.0s)**: Blade rotates smoothly across his body to canonical position. Settled smug closed-mouth smirk.
- **Character delivery**: Refined inspector who multitasks — sends his measuring instrument to verify in the field while he reviews the records. Smug coordination, not theatricality.
- **Timing feel**: Snappy throw, deliberate paper inspection, smooth catch and settle. Discrete beats throughout — NOT one continuous motion.
- **VFX**: Brief brass-gold trail behind the blade on both the throw exit and the return entry. Tiny brass-gold gleam on the catch contact.
- **Secondary motion**: Brass drafting arm at turban tip catches light on the chin lift and the catch. Long red turban side-tail flicks once on the throw, drifts during inspection, flicks once on the catch. Coiled scrolls shift slightly as the right hand engages the bundle.
- **Reference**: Spy P5 Bomb Mishap structure (multi-beat with off-screen elements) re-skinned for refined-inspector tone.
- **Duration**: 7s
- **Risks in prompt stage**:
  - **Off-screen blade direction discipline**: Action and Constraints must explicitly say "the blade exits the frame to the right" and "the blade re-enters the frame from the left" — Seedance may otherwise have the blade leave and return on the same side, or stay in frame the whole time.
  - **Discrete-beat language**: Action must enumerate beats with timecoded markers (`(0.0-0.6s)`, `(0.6-1.2s)`, etc.) so the model doesn't smooth them into one continuous arc.
  - **Two-prop coordination**: right hand transitions from blade-throwing → empty-and-helping-with-scroll → catching. Describe each transition explicitly so the hand doesn't morph or duplicate.
  - **FFLF integrity**: blade must end in canonical position across the body in the right hand; bundle must end with three intact coiled scrolls.
  - **Section A2/A4 compliance**: scrolls described as `coiled`/`unfurl`, blade kept as `blade` (the action IS a weapon-throw beat, so blade-noun is correct here).

### Round 2 revision (2026-04-27 — P7 and P8 dropped at concept stage)

> User feedback after reading P7 and P8 concepts: "They read very similar and remind me of the Blacksmith and New King prompts where we raise a blade and lower it." Both P7 (vertical raise + plant + return) and P8 (diagonal pull-back + cut + return) collapse into the "raise/extend in some direction, then come back" pattern that already saturates the roster (Blacksmith P1 ground slam, New King P3 defender's rally, Fat King P7 scepter ground slam, plus P1/P5 from Architect's own set). Per-hero kinetic-shape diversification needs to go further than just "different angle" — it needs different **mechanism**.
>
> P9 and P10 below replace P7 and P8. Both retained P6's spirit (multi-beat + off-screen) but go harder on **VFX-heavy + off-screen action** per user request. P7 and P8 prompt files in `Prompts/Seedance/` are kept on disk for reference only — marked as deferred at the top, not for queueing.

### P9 — Architectural Diagram Bloom ⭐ *(VFX-heavy, off-screen via diagram extending past frame edges, character stays in-frame)*
- **Beat 1 — Anticipation (~0.0–0.6s)**: Smug chin lift, brow arch over the spectacles.
- **Beat 2 — Anchor tap (~0.6–1.0s)**: Right hand raises the silver caliper-protractor blade to chest height in front of him and taps a single anchor point in midair with the broad face of the blade presented flat to the camera. A small bright brass-gold spark appears at the anchor point.
- **Beat 3 — Diagram bloom (~1.0–2.5s)**: From the anchor point, an elaborate ornate architectural blueprint diagram blooms outward in fine glowing warm ink-blue lines, growing rapidly to fill the entire frame around the architect. The diagram is composed of: nested concentric arcs at different radii, fine tick-mark notches at regular intervals along the curves, small dimension lines with drafting-style numerical notations spaced throughout, small overlapping circles, fine radius lines extending outward from the central anchor point, small triangles of fine line work, and rich ornamental drafting details. **Critically, the diagram lines extend continuously beyond all four edges of the frame so the diagram clearly continues off-screen beyond what's visible.** Architect stays calmly at center, surrounded by his masterwork.
- **Beat 4 — Verdict (~2.5–3.5s)**: Chin lifts further, brow arches higher, smug closed-mouth smirk widens with "I have inscribed my masterwork" satisfaction. Calipers gesture toward a final precise spot on the diagram. The diagram pulses brighter once with completion.
- **Beat 5 — Fade (~3.5–5.0s)**: The diagram slowly fades back inward toward the anchor point and disappears.
- **Beat 6 — Settle (~5.0–6.0s)**: Blade returns smoothly across his body to canonical position. Settled smug closed-mouth smirk.
- **Character delivery**: Refined inspector orchestrating his own technical-drawing world. The character is the calm anchor at the center while the VFX does the spectacular work — a "no-force theatrical" power move where the work is the demonstration.
- **Timing feel**: Slow refined anticipation, fast bloom (the only fast beat), long held verdict pose, slow fade, smooth settle.
- **VFX**: Elaborate ornate architectural blueprint diagram in fine warm ink-blue line work, filling the frame around the character, extending beyond all four edges. Same intricacy pattern as P1 / P5 VFX upgrades but at frame scale, not blade-scale.
- **Secondary motion**: Brass drafting arm at turban tip catches light on the chin lift and the verdict. Long red turban side-tail drifts. Coiled scrolls absolutely still.
- **Reference**: New no-force-theatrical archetype — closest in spirit to General-style ceremonial bearing combined with Diana-trail-VFX vocabulary scaled up to the full frame.
- **Duration**: 6s
- **Risks in prompt stage**:
  - **Heavy VFX rendering** — Seedance may simplify the diagram to a basic figure. Apply the P1/P5 VFX intricacy pattern: name 5+ elements concretely, use safe vocabulary, anchor with "like a detailed ornate architectural blueprint with rich ornamental complexity," negate the simple-shape fallback in Constraints.
  - **Off-screen extension** — explicitly state "lines extend beyond all four edges of the frame" and "the diagram clearly continues off-screen." Without this, the model will keep the diagram contained within the frame.
  - **Camera-zoom misread** — heavy VFX expanding around the character could read as a zoom-in. Lead Subject with `static camera shot of...`, pin in Constraints.
  - **Discrete-beat language** — anchor tap → bloom → verdict → fade are 4 discrete events. Use timecoded markers in Action so the model doesn't smooth them into one motion.

### P10 — Triple Blueprint Cascade ⭐ *(off-screen via parchment streaming past three frame edges, VFX-heavy with three independent blueprints, uses canonical scrolls)*

> **Iteration note (2026-04-27)**: an earlier P10 proposal used a generic "surveyor's chain" VFX. User rejected it at concept stage on the grounds that the architect doesn't canonically own a chain — the off-screen extension should leverage his actual scroll bundle instead. Concept replaced with the version below which uses his three coiled scrolls as the source of the off-screen extension.

- **Beat 1 — Anticipation (~0.0–0.6s)**: Smug chin lift, brow arch over the spectacles.
- **Beat 2 — Commanding gesture (~0.6–1.2s)**: Right hand raises the silver caliper-protractor blade to chest height and sweeps it in a small precise commanding arc toward midair as a "presenting my masterworks" gesture. Broad face of the blade presented to camera throughout.
- **Beat 3 — Cascade (~1.2–3.5s)**: The three coiled scrolls in his left arm bundle each unfurl outward rapidly with **parchment streaming from each scroll in three different directions** in a fan formation around the architect:
  - The first scroll's parchment streams toward the **left edge of the frame** and extends continuously past the left edge off-screen.
  - The second scroll's parchment streams **upward** toward the top of the frame and extends continuously past the top edge off-screen.
  - The third scroll's parchment streams toward the **right edge of the frame** and extends continuously past the right edge off-screen.

  Each unfurled parchment displays a different elaborate ornate architectural blueprint diagram in fine glowing warm ink-blue ink (nested concentric arcs, fine tick-mark notches, small dimension lines with drafting-style numerical notations, small overlapping circles, fine radius lines, small triangles of fine line work, rich ornamental drafting details). The bundle stays cradled in his left arm — only the parchment streams outward; the scrolls themselves do not detach.
- **Beat 4 — Verdict (~3.5–4.5s)**: Chin lifts further, brow arches higher, smug closed-mouth smirk widens with "I have unveiled my masterworks" verdict. Calipers gesture toward the central composition. Small dismissive head-shake. The three blueprints pulse brighter once with completion.
- **Beat 5 — Retract (~4.5–5.8s)**: The three parchment streams retract smoothly back inward toward their respective scrolls, the parchment coiling back up into each scroll, and the scrolls settle back into their fully coiled state in the bundle. Bundle returns to three intact coiled scrolls.
- **Beat 6 — Settle (~5.8–7.0s)**: Blade returns smoothly across his body to canonical position. Settled smug closed-mouth smirk.
- **Character delivery**: Refined master architect unveiling his complete body of work in a single smug command gesture. The character is the calm anchor at the center; the masterworks unveil themselves around him on three sides. Theatrical mastery, not action.
- **Timing feel**: Slow refined anticipation, sustained cascade build, long held unveil pose, smooth retract, smooth settle.
- **VFX**: Three independent elaborate ornate architectural blueprints in fine warm ink-blue line work, displayed on parchment that streams from each of his three scrolls and extends past three different frame edges.
- **Secondary motion**: Brass drafting arm at turban tip catches light on the chin lift and the unveil peak. Long red turban side-tail drifts. Curled mustache tips ride the smirk widen.
- **Reference**: New no-force-theatrical archetype, sibling to P9 (where the blueprint blooms from a midair anchor). P10 uses the canonical scroll bundle as the VFX source instead, leveraging the architect's actual props.
- **Duration**: 7s
- **Risks in prompt stage**:
  - **Bundle integrity** — scrolls must stay seated in the bundle throughout; only the parchment streams outward. Pin "the scrolls themselves do not detach from the bundle and the bundle never empties." All three scrolls must re-coil to fully intact by t=loop-end.
  - **Three-edge off-screen extension** — left, top, right. Pin each direction explicitly so the model doesn't keep the parchment contained inside the frame.
  - **Heavy VFX intricacy at frame scale** — same P1/P5/P9 pattern: named elements, safe vocabulary, comparison anchor, negate simple-shape fallback.
  - **Discrete-beat language** — anticipation → command gesture → cascade → verdict → retract → settle are 6 discrete events. Timecoded markers in Action.
  - **Section A2 compliance** — `coiled` / `unfurl` / `re-coil` for parchment language, no `roll`-family verbs.

### P7 (Vertical Decree Plant) — DEFERRED at concept stage 2026-04-27
Original concept proposal kept on disk in `Prompts/Seedance/P7_Vertical_Decree_Plant.md` for reference but **not approved for queueing**. Pattern collapsed into "raise blade vertically, plant, return" which reads similar to existing roster vertical-smash concepts (Blacksmith P1, Fat King P7, New King P3). Replaced by P9.

### P8 (Diagonal Cut & Verdict) — DEFERRED at concept stage 2026-04-27
Original concept proposal kept on disk in `Prompts/Seedance/P8_Diagonal_Cut_Verdict.md` for reference but **not approved for queueing**. Pattern collapsed into "pull blade back, sweep, return" which reads similar to other slash concepts (Diana, New King P2). The diagonal axis was insufficient differentiation. Replaced by P10.

---

## Original Round 2 concepts (kept for traceability, see "Round 2 revision" above for status)

### P7 — Vertical Decree Plant *(vertical down axis, low risk, decisive personality)*
- **Beat 1 — Anticipation (~0.0–0.8s)**: Smug chin lift, brow arch over the spectacles.
- **Beat 2 — Raise (~0.8–1.5s)**: Right hand smoothly raises the silver caliper-protractor blade upward to chest height with the calipered prongs pointing down and the broad face of the blade presented flat to the camera throughout.
- **Beat 3 — Plant (~1.5–1.8s)**: Sharp downward press — blade plants vertically at an invisible point at waist height in front of him. Broad face still presented to camera.
- **Beat 4 — Decree hold (~1.8–3.5s)**: Blade held vertical with broad face turned to the camera. A small warm ink-blue diamond-shaped survey-stake mark appears at the plant point with two concentric ripple-glow rings pulsing outward briefly. Smug "I have decreed the measurement" pose — chin tilted up, brow arched.
- **Beat 5 — Verdict (~3.5–4.0s)**: Small dismissive head-shake. Stake mark fades.
- **Beat 6 — Settle (~4.0–6.0s)**: Blade rotates smoothly back across his body to canonical position. Settled smug closed-mouth smirk.
- **Character delivery**: "I have set the marker. The matter is settled." Decisive, ceremonial, refined-inspector authority. Stake-driving beat.
- **Timing feel**: Smooth raise, sharp drop, long held verdict pose, smooth recovery. Vertical axis throughout.
- **VFX**: Small warm ink-blue diamond-shaped survey-stake mark at the plant point with two concentric ripple-glow rings (pulses outward and fades within ~0.8s).
- **Secondary motion**: Brass drafting arm at turban tip catches light on the raise and the chin lift. Long red turban side-tail drifts with the raise and settles on the plant. Coiled scrolls absolutely still.
- **Reference**: Wilhelm halberd plant + Fat King scepter ground slam, but at chest height rather than the ground, and refined rather than heavy.
- **Duration**: 6s
- **Risks in prompt stage**: Broad-face presentation must be pinned (per the silhouette-morph rule from P4). The "plant into an invisible point at waist height" needs to be described carefully so the blade doesn't read as planting on the ground or piercing his own body.

### P8 — Diagonal Cut & Verdict *(diagonal axis, straight-line VFX, distinct from P1's horizontal arc)*
- **Beat 1 — Anticipation (~0.0–0.8s)**: Brow arch + chin lift, blade pulls back smoothly to his right shoulder area.
- **Beat 2 — Cut (~0.8–1.4s)**: Single sharp diagonal sweep with the blade from upper-right to lower-left across his body, the curved protractor arc face presented to the camera throughout. A clean precise **straight ruled line** in warm ink-blue traces diagonally across the frame in the wake of the blade — NOT an arc — with fine tick-mark notches at regular intervals along its length and a small drafting-style numerical notation near one end.
- **Beat 3 — Settle at endpoint (~1.4–2.5s)**: Blade comes to rest at the lower-left endpoint of the sweep. He tilts his head with smug "noted" satisfaction. The ruled line lingers with all its detail visible.
- **Beat 4 — Verdict (~2.5–3.5s)**: Small dismissive head-shake. Closed-mouth smirk widens. Ruled line fades.
- **Beat 5 — Settle (~3.5–6.0s)**: Blade returns smoothly diagonally back across his body to canonical position.
- **Character delivery**: "I have established this dimension." Precise diagonal measurement, refined and decisive. Different motion register from P1's wider sweep — this is a single committed cut, not a flourish.
- **Timing feel**: Slow refined wind-up, fast snap diagonal cut (the only fast beat), long held endpoint pose, smooth recovery.
- **VFX**: A clean precise **straight ruled line** (not an arc) in warm ink-blue tracing the blade's diagonal path, with fine tick-mark notches at regular intervals along its length and a small drafting-style numerical notation near one end. Lingers and fades.
- **Secondary motion**: Brass drafting arm at turban tip catches light on the chin lift and the cut. Long red turban side-tail flicks once on the snap of the cut and settles. Coiled scrolls shift slightly with the upper-body rotation.
- **Reference**: Diana slash structure with the trail re-skinned as a measured straight ruled line rather than a curved arc. Distinct from Architect P1 which traces a curved arc.
- **Duration**: 6s
- **Risks in prompt stage**:
  - The VFX must read as a **straight ruled line, not an arc** — pin this in Action and Constraints (`a clean precise straight ruled line not a curved arc`).
  - Diagonal direction must be explicit (`from upper-right of the frame to lower-left of the frame`) so Seedance doesn't default to horizontal.
  - Broad-face presentation pinned (silhouette-morph rule).
