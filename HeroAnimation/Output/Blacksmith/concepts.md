# Blacksmith — Animation Concepts

> Stage 2 output. Character direction: **stoic strongman** — quietly proud, slow, heavy, direct, grounded. Expressive through character acting, not theatrics.

## Reference
- Source art: `Source/Heroes Stylized/Blacksmith.png`
- Hero description: `Docs/Heroes/Blacksmith.md`
- Personality keywords: strong, proud, reliable, hardworking, confident, stoic
- Weapon/signature item: Large iron hammer with wooden handle
- Closest animation reference in feel: **Count Wilhelm** (heaviest motion, slow-wind/fast-release); **Spy** for personality-beat pacing.

---

## Approved Shortlist

### Power Movement — 4 approved concepts

#### P1: Ground Slam
- **Action**: Both hands grip the hammer, lifts it overhead with deliberate effort, then slams the head straight down to the ground in front of him. Ends in a grounded wide stance, hammer head resting on the ground, satisfied slow nod.
- **Emotional arc**: Focused effort → release of force → quiet pride.
- **Timing feel**: Slow heavy wind-up (~1.2s), explosive drop (~0.3s), long hold on the impact pose.
- **VFX**: Dust shockwave + a few orange sparks radiating outward on impact. Faint lingering dust settling.
- **Secondary**: Beard/mustache bounce on impact, slight shoulder recoil, belt and apron shift.
- **Reference**: Wilhelm's overhead slam — without cape drama, with more weight.

#### P2: Shoulder Rest + Sweat Wipe
- **Action**: Raises the hammer slowly and rests the head on his right shoulder with a solid *thunk*. Free left hand wipes his brow with the back of the wrist. A gruff chest-out exhale, subtle proud smirk, slight nod.
- **Emotional arc**: Effort → relief → quiet pride.
- **Timing feel**: Slow and measured throughout — no fast beats. Very stoic.
- **VFX**: Minimal — optional tiny heat-shimmer off the hammer head suggesting it's freshly forged.
- **Secondary**: Mustache shifts as he exhales, apron sways slightly, tattoo catches light on the arm flex.
- **Reference**: Spy-like personality beat pacing, Wilhelm's weight.

#### P5: Hammer Flip & Catch
- **Action**: Lifts the hammer off the ground, gives it a slow single vertical flip in front of him (handle over head), and catches it firmly in the same hand with a solid *thwack* of palm on wood. Settles into a proud grounded pose, small smirk, a subtle nod like "still got it."
- **Emotional arc**: Focus → casual confidence on the catch → quiet pride.
- **Timing feel**: Slow lift, slow arcing flip (heavy, not showy), firm catch, hold.
- **VFX**: Minimal — tiny dust puff from the catch.
- **Secondary**: Bicep flex on the catch, beard bounces slightly on impact, apron sways.

#### P8: Flex & Nod
- **Action**: Raises the right arm (free hand) into a classic strongman flex at his shoulder, turns head slightly to glance at the bicep, gives a single proud nod toward it. Lowers arm back to resting on the hammer.
- **Emotional arc**: Self-assessment → proud approval → grounded return.
- **Timing feel**: Slow lift into flex, hold the pose, slow lower.
- **VFX**: None — optional subtle highlight on the flexed bicep/tattoo.
- **Secondary**: Anvil tattoo catches light on the flex, apron shifts, mustache curls up slightly with the smirk.

---

### Idle Movement — 4 approved concepts

#### I2: Steady Breath + Mustache Twirl
- **Subtle action**: Preserves the signature source pose. Slow deep breaths, with the right hand giving the mustache tip a slow twirl once per cycle.
- **Expression**: Proud, quietly pleased.
- **Breathing/weight**: Deep, steady chest expansion; body rock-solid.
- **Secondary motion**: Chest rises/falls with breath, mustache tip subtly deforms under the finger, hammer completely stable.
- **Duration feel**: Medium, matches source pose for clean loop.

#### I3: Flex & Settle
- **Subtle action**: Very subtle: between breaths he gives a slight shoulder roll / bicep flex (almost imperceptible), as if checking his own strength.
- **Expression**: Stoic, self-assured.
- **Breathing/weight**: Grounded, still.
- **Secondary motion**: Tattoo arm catches light on the flex, apron shifts.
- **Duration feel**: Tight.

#### I4: Slow Chuckle
- **Subtle action**: A single slow, almost-silent amused exhale through the nose — shoulders rise and fall once, mustache lifts slightly. Eyes stay forward and calm.
- **Expression**: Quiet amusement.
- **Secondary motion**: Beard and belly rise/fall with the chuckle, shoulders bob.
- **Duration feel**: Medium.

#### I5: Knuckle Crack
- **Subtle action**: Lifts his free hand briefly and gives his knuckles a slow stretch/crack (curling and releasing the fingers), then returns to rest.
- **Expression**: Stoic, slightly satisfied.
- **Secondary motion**: Forearm flex visible, fingers articulate slowly, wrist wrap shifts.
- **Duration feel**: Tight.

---

## Total Loop Target (per concept pairing)
- **Duration**: 5-7s
- **Split**: ~3-4s power + ~2-3s idle
- **Loop**: Must seamlessly connect end → start

## Deferred Concepts (not selected for this round)
- P3 Forge Strike + Sparks
- P4 One-Handed Heft
- P6 Test the Edge
- P7 Beard Stroke & Nod
- I1 Anvil Lean
- I6 Deep Chest Breath + Eye Sweep

---

## Revised Concepts (2026-04-22 — client weapon-driven rule)

> Appended after client feedback (2026-04-22): power move = weapon action, not ability or personality-only beat. Every hero gets a mandatory breathing-only baseline idle. See `HeroAnimation/Docs/StyleGuide_Animation.md` §2 and `HeroAnimation/PromptTemplates/animation_concepts.md` Core Rules.
>
> **Audit of existing Blacksmith power concepts against the new rule**:
> - ✅ P1 Ground Slam — passes (clean overhead hammer strike)
> - ⚠️ P2 Shoulder Rest + Sweat Wipe — weak weapon beat (heft-to-shoulder is movement, not a strike); see revised P9 below
> - ⚠️ P5 Hammer Flip & Catch — weapon is present but action is a juggling flourish, not a strike; keep as alternate, not primary
> - ❌ P8 Flex & Nod — no weapon use at all; demoted to expressive-idle territory if we want to keep it, not power
>
> **Idle audit**: none of I2/I3/I4/I5 meet the new "breathing-only baseline" requirement — all add character business (mustache twirl, shoulder roll, chuckle, knuckle crack). I0 below fills that slot.

### P9 — Forge Strike + Shoulder Rest *(weapon-primary revision of P2)*
- **Weapon action**: From canonical (hammer resting on ground beside him), both hands grip the handle and lift the hammer up to waist height. He delivers **two or three slow rhythmic forge strikes** forward at waist level — as if striking an invisible anvil in front of him — each strike producing a bright spark burst on contact. After the final strike, he lifts the hammer up to rest its head solidly on his right shoulder with a satisfied *thunk*, free left hand wipes his brow with the back of the wrist. Gruff chest-out exhale, proud smirk, slight nod. Returns to canonical.
- **Character delivery**: Stoic craftsman at work — the forging IS the hero moment. Proud → focused → satisfied.
- **Timing feel**: Slow heavy strikes (~0.5-0.6s each with full anticipation), brief hold between, slow lift to shoulder, slow personality beat.
- **VFX**: Bright orange/yellow sparks on each forge strike, minor heat shimmer off the hammer head after, tiny dust settling.
- **Secondary**: Bicep and shoulder flex on each strike, apron shifts with body, beard bounces on the strike impacts, mustache lifts on the smirk.
- **Reference**: Wilhelm weight timing + his own client-brief victory pose at the end.
- **Duration**: 7s
- **Why revised**: Fixes the weapon-weak P2 by adding explicit hammer strikes before the personality beat. Now the hammer action is the heart of the loop and the sweat-wipe is the earned recovery.

### P10 — Side Hammer Sweep
- **Weapon action**: From canonical, grips hammer two-handed, lifts it off the ground and pulls it back across his body to the right (slow heavy wind-up), then sweeps it forward in a one-handed horizontal arc from right to left at chest-to-hip height. The hammer head whistles past in front of him, trailing a faint dust/motion streak. Continues the arc through and the hammer settles tip-down on the ground at his left side. He settles back into a slightly adjusted canonical stance with the hammer now planted at the left instead of the original right (seamless loop returns via the reverse — or accept a handed variant at generation time).
- **Character delivery**: Controlled heavy power — not theatrical, just working force. Focused brow during the swing → proud exhale after.
- **Timing feel**: ~1s wind-up (slow), fast 0.3-0.4s sweep, ~1s settle.
- **VFX**: Faint motion streak behind the hammer head during the sweep, small dust puff where it grounds at the end. No sparks (no impact).
- **Secondary**: Apron and beard react to the sweep, shoulder muscles flex, beret-less dome catches the light on the exertion.
- **Reference**: Diana slash-arc structure but with hammer weight (Wilhelm-scale timing).
- **Duration**: 6s
- **Why added**: Different weapon axis from P1's overhead — gives the team a horizontal-strike option alongside the vertical-slam option.

### I0 — Breathing Baseline *(mandatory)*
- **Subtle action**: Canonical pose preserved exactly. Slow deep chest rise and fall. Tiny weight shift between breaths. Nothing else — no mustache twirl, no flex, no chuckle, no knuckle crack.
- **Expression**: Held proud half-smile. Occasional slow blink.
- **Breathing/weight**: Heavy grounded chest breathing, stance unchanged, both hand positions preserved (right hand on mustache tip or at hip, left hand on hammer handle).
- **Secondary motion**: Beard and mustache drift with breath, apron shifts minimally, hammer absolutely still.
- **Duration**: 4s
- **Why added**: Satisfies the client mandatory-baseline idle rule. The safe fallback the team can always pick. I2-I5 remain as expressive variants on top of this baseline.
