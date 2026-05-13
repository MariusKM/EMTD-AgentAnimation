# Dragonwitch — Animation Concepts

> Source: `Source/Heroes Stylized/Dragonwitch.png`
> FFLF input: canonical PNG (no mouth-closed variant needed — confirmed 2026-04-29)
> Hand convention: anatomical (character's own left/right). Flame palm = anatomical-right (viewer-left of image). Hip hand = anatomical-left (viewer-right). Dragon skull pauldron = worn armor on anatomical-left shoulder, NOT a held prop.
> Flame color in prompts: **greenish-purple** (canonical art is green; re-tinted to survive chroma key).

---

## Authoring Constraints (Dragonwitch-specific)

- **Greenish-purple flame** — NOT pure green (chroma-key fight) and NOT pure purple (loses signature). The blend keeps the dragon-cult read while surviving keying.
- **Skull pauldron is static armor** — eye-glow may pulse during a power beat but must return to baseline by loop-end. No interaction (no donning, no removing, no shoulder-mounting changes).
- **Hip hand stays anchored** on the anatomical-left hip in nearly every concept. Add to Constraints line: `anatomical-left hand stays on hip throughout`.
- **Avoid `twirl`/`spin`** entirely for the finger-flame roll concept — use `the ember rolls across her fingertips` or `she walks the ember between her fingers` (Fat Princess P4 lesson).
- **Skirt phrasing**: `short green leaf-shaped skirt with ragged jagged edges falling to mid-thigh` — locks the silhouette.
- **No `crack`/`stab`/`strike` in dense vocabulary clusters** (Architect P2 lesson) — soften to `snaps`, `whips across`, `presses forward`.
- **Mocking-laugh peak**: open-mouth toothy laugh is the peak of P1/P2 — must resolve back to canonical closed-mouth smirk by loop end (canonical PNG is the FFLF anchor).

---

## Power Movement Concepts

### P1 — Mocking Flame Hurl ⭐ *(forward thrust axis — direct CSV "professional fighter punches with flame")*
- **Weapon action**: From canonical, the greenish-purple dragon-flame swells and intensifies in her anatomical-right palm (anticipation, ~0.6s) — wisps curl tighter, dragon-head silhouette sharpens. Arrogant smirk widens. Sharp **forward flame-punch**: palm thrusts forward toward the viewer, flame projectile shoots off-frame leaving a brief greenish-purple trail with dragon wisps. Pulls the arm back, head **throws back into an open-mouth mocking laugh** (peak expression beat), then resolves to canonical closed-mouth smirk. Anatomical-left hand stays on hip throughout. Skull pauldron eyes briefly pulse greenish-purple on the punch then return to baseline.
- **Kinetic axis**: Forward thrust.
- **Risk notes**: Off-frame projectile — bake `static camera shot of...` prefix into Subject line. Mocking-laugh peak must return to closed-mouth smirk on settle.

### P2 — Finger Flame Roll & Mocking Laugh ⭐ *(no-force theatrical — direct client brief)*
- **Weapon action**: From canonical, the flame in her palm compacts into a small dragon-shaped ember the size of a marble. The ember **rolls across her fingertips** from index to pinky and back (hand-only — NOT a body rotation, NOT a wrist twirl), her gaze tracking it with vain admiration. After two passes, she snaps her fingers and the ember **flares back up into a full palm flame**. She **throws her head back in an open-mouth mocking laugh** (peak), then resolves to canonical smirk. Hip hand stays.
- **Kinetic axis**: No-force theatrical, hand-only manipulation.
- **Authoring**: Use `the ember rolls across her fingertips` / `she walks the ember between her fingers`. Avoid `twirl`, `spin`, `rotate the flame in her hand`.

### P3 — Dragon Wisp Lunge ⭐ *(forward + signature VFX — strongest unique read)*
- **Weapon action**: From canonical, the greenish-purple flame in her palm gathers and condenses into a **small ethereal dragon head** with horns mirroring her shoulder pauldron (~1s gather). The dragon snarls and **lunges forward off her palm toward the viewer**, fully projecting out of frame on the lunge, leaving a trail of greenish-purple smoke. She snaps her hand closed as the dragon dissipates, eyes flash bright greenish-purple briefly, mocking smirk widens to camera. Hip hand stays.
- **Kinetic axis**: Forward projection + signature VFX read.
- **Risk notes**: Distinctive VFX silhouette — apply Architect P4 fix pattern (concrete silhouette description + broad-face presentation + silhouette-preservation Constraint). Bake `static camera shot of...` prefix.

### P4 — Flame Whip Snap *(lateral/horizontal axis)*
- **Weapon action**: From canonical, the flame in her palm elongates outward into a **short whip of greenish-purple fire** about an arm-length long. She **snaps it horizontally across in front of her** with a sharp wrist-flick (wrist + forearm only — NOT a body sweep). The snap leaves a brief horizontal flame-trail with dragon-wisps writhing along it, then the whip **retracts back into a small flame in her palm**. Mocking head-tilt to camera. Hip hand stays.
- **Kinetic axis**: Lateral / horizontal.
- **Authoring**: Use `snaps it horizontally` / `whips across` — avoid `cracks`/`crack` in dense violence-adjacent clusters.

### P5 — Smug Flame Inspect & Snuff *(no-force theatrical, vain personality)*
- **Weapon action**: From canonical, she lifts the palm flame up to face level with a slow refined wrist motion. Tilts her head, examines the flame admiringly with a slow connoisseur's smirk (~1.5s). Then **closes her fingers around the flame** and snuffs it — a small puff of greenish-purple smoke escapes between her fingers, dragon-shaped. She blows the smoke at the camera with a mocking smirk, and the flame **re-ignites in her open palm** as she settles back to canonical.
- **Kinetic axis**: No-force, low motion budget.
- **Risk notes**: Generation may feel under-motivated — better as an idle if a quieter primary is wanted.

---

## Idle Movement Concepts

### I1 — Breathing Baseline *(mandatory — safe fallback per CLAUDE.md)*
- Strictly breathing only: chest rise/fall, micro weight shift in hips, blink, secondary motion in the spiky navy hair drifting subtly. Greenish-purple palm flame flickers minutely with the breath rhythm, dragon-wisps barely curling. Canonical smirk holds. Skull pauldron static. Hip hand anchored.

### I2 — Flame Admiration
- Slow lift of the flame palm a few inches toward her face, head tilts to examine it, smirk subtly widens with vain admiration, then returns. Subtle blink + breath underneath. The dragon-wisps in the flame curl slightly more on the lift. Hip hand stays.

### I3 — Smug Side-Glance
- Eyes-only side-glance to camera (no head snap — Spy I5 morph risk), one eyebrow micro-arches, smirk widens a hair — *"yes, I'm watching you."* Returns gaze forward. Flame steady, breath continues underneath. Hip hand never moves.

---

## Approved Selections

### Power Movement: **all 5 approved** (P1, P2, P3, P4, P5) — user direction 2026-04-29
### Idle Movement: **all 3 approved** (I1, I2, I3) — user direction 2026-04-29

All 8 concepts queued for Seedance generation 2026-04-29 with FFLF input `Output/Dragonwitch/Dragonwitch_FFLF_0.png` (start = end frame). Aspect 1:1, durations 6s (power) / 4s (idle).
