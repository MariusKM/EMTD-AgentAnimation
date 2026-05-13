# Animation Concepts — Spy

> Stage 2 working doc. Concepts are model-agnostic — prompt translation happens in Stage 3.

## Character Context
- Source art: `Source/Heroes Stylized/Spy.png`
- Hero description: `Docs/Heroes/Spy.md`
- Personality keywords: cunning, sneaky, devious, shrewd, mischievous, stealthy, expressive, theatrical
- Weapon/signature: hand crossbow (already loaded, held low-ready in canonical pose)
- Tone direction: jovial / slightly comical (client, 2026-04-16) — lean hard into it for Spy
- Canonical pose for start/end frame: hunched sneaking stance, three-quarter view, crossbow loaded and aimed low-ready two-handed, sly trollface grin

---

## Power Movement Concepts

### P1 — Fourth-Wall Trollface (Alibi Version)  ⭐ (client-brief signature)
- **Action**: From canonical pose, Spy tenses alertly. Sharply snaps his head to the left and scans with shifty eyes — "is anyone watching?" — then snaps to the right for another paranoid check. Coast clear. He leans his upper body forward conspiratorially toward the viewer while slowly rotating his head back to face the camera — the "come here, let me show you something" beat. As his gaze locks on, a thick dark eyebrow raises, then he SLOWLY spreads a massive trollface grin. Silent shoulder-shake chuckle (mouth closed). Straightens up and returns to canonical pose.
- **Emotional arc**: Sneaking grin → alert paranoid → scanning (twice) → conspiratorial lean-in recognition → gleeful trollface → sneaking grin
- **Timing feel**: Sharp paranoid head snaps, slow conspiratorial lean-in, slower trollface reveal. The alibi beats give the trollface a reason to exist — now it's "he got caught scheming and now he's letting YOU in on it."
- **VFX element**: Minimal — tiny speed lines on the head snaps
- **Secondary motion**: Hood whips with head snaps and drapes forward on the lean; quiver bolts jostle; satchel swings
- **Reference**: Spy existing (narrative beats) + Moneybags (performance confidence). The lean-in is the fourth-wall-break setup; the grin is the payoff.
- **Duration**: 7s

### P2 — Quick-Draw Trick Shot
- **Action**: Crossbow snaps up from low-ready to a quick aim, twang — bolt fires off-frame. Spy blows imaginary smoke off the front of the crossbow with a smug smirk, then points a little finger-gun at the camera ("gotcha"), then sinks back into low-ready.
- **Emotional arc**: Focused aim → trigger satisfaction → smug showoff → sneaking grin
- **Timing feel**: Snappy action (crossbow snap-up is fast), slow smug aftermath — strong anticipation-to-strike contrast
- **VFX element**: Motion blur on crossbow snap, small muzzle-puff from the bolt discharge, brief motion streak on the bolt, tiny sparkle on the finger-gun
- **Secondary motion**: Hood snaps forward on the aim, quiver jostles, satchel swings
- **Reference**: Diana snap timing + Moneybags performance aftermath
- **Duration**: 6s

### P3 — Over-the-Shoulder Check
- **Action**: Suddenly tenses — thinks he heard something. Sharp head-snap over his left shoulder, eyes dart side-to-side paranoidly, holds the crossbow extra still. Slow beat. Relaxes, turns back to camera, gives a wink + taps the tip of his pointed nose (conspiratorial "shh"), settles back into sneaking ready pose.
- **Emotional arc**: Alert-paranoid → scanning → relieved → conspiratorial wink
- **Timing feel**: Sharp head snap, slow scan, quick wink. Pure personality, no shooting.
- **VFX element**: Subtle speed-line on the head snap; otherwise none
- **Secondary motion**: Hood swings sharply on head snap, then settles; arrows jostle
- **Reference**: Spy existing (the glance beat, but here it's the whole loop)
- **Duration**: 7s

### P4 — Poison Vial Reveal
- **Action**: Crossbow dips in right hand. Off-hand reaches into the hip satchel and produces a small glass apothecary vial filled with **bubbling sickly-green liquid**, a faint green wisp rising off its cork. Holds it up, gives a knowing tilt so the liquid sloshes. Brings it to his pointed nose and **sniffs** — eyes light up, pulls back with a delighted devious grin. Eyebrow waggle directly at camera — "wait till you see what this does." Slips vial back into satchel and returns to low-ready aimed pose.
- **Emotional arc**: Sneaky → gleeful reveal → malicious satisfaction (sniff) → conspiratorial eyebrow → sneaking ready
- **Timing feel**: Patient, deliberate — he's savoring showing us. The sniff beat is the key personality anchor.
- **VFX element**: Bubbling green liquid inside the vial, faint green wisp rising from the cork, a tiny green drip-plink that hisses on the ground when he tilts the vial
- **Secondary motion**: Hood follows head tilts; satchel swings as he retrieves and returns the vial
- **Reference**: Spy existing (narrative beat structure) — this is his "dirty tricks" client note realized with unambiguous poison color language
- **Duration**: 7s

### P5 — Bomb Mishap  ⭐ (jovial/comical slapstick)
- **Action**:
  1. Off-hand reaches into the hip satchel (crossbow stays in right hand at low-ready)
  2. Produces a small round cartoon bomb — black sphere, short lit fuse sparking orange
  3. Holds it up at eye level, spreads a huge trollface grin at camera, eyebrow waggle — "check this out"
  4. Bomb slips out of his fingers. Grin freezes, then collapses into a wide-eyed open-mouthed "oh no" panic face
  5. Snappy kick — foot whips out and punts the bomb off-camera to the right
  6. Split-second beat. Offscreen explosion flash — bright orange light fills the frame from the right edge, small shockwave puffs his hood back, quiver arrows jostle, satchel swings sideways
  7. Small cloud of smoke drifts in from the right. Spy leans slightly away from the blast
  8. Quick recovery — shakes it off, dusts his coat with a "nothing to see here" shrug, grin slowly returns, settles back into canonical aimed low-ready pose
- **Emotional arc**: Sneaky → gleeful reveal → panic → relief/recovery → sneaking grin ("nailed it")
- **Timing feel**: Slow theatrical reveal, snap-panic kick, slow recovery. Classic cartoon contrast timing — big wind-up to a self-defeating gag.
- **VFX element**: Sparking fuse (orange particles off fuse tip), motion blur on kick, offscreen explosion flash from right edge, drifting smoke, tiny ash particles after
- **Secondary motion**: Hood blown back on shockwave and slowly settling; quiver arrows violently jostle then settle; satchel swings hard
- **Reference**: Moneybags (theatrical showmanship) + Fat Princess / Supercell slapstick energy
- **Duration**: 7s
- **Risks to watch in prompt stage**: I2V needs to be explicitly told the explosion is off-frame right — otherwise the bomb may detonate in his hand and change the joke. The shockwave reaction (hood blown back, body lean) is the key readable beat for the "offscreen explosion" read.

---

## Idle Movement Concepts

> Overall idle direction: Spy is **restless, wired, nervous, slightly unhinged (in a funny way)**. No calm breathing. He fidgets like he's always scheming or on the edge of something. Each idle below is a distinct flavor of that wired energy.

### I1 — Paranoid Scan (was Shifty Glance)
- **Subtle action**: Head makes small restless paranoid turns — sharp glance over left shoulder, holds a beat, snaps right for another quick check, pauses, back to center with a subtle forward head-bob as if peering. Eyes narrow and shifty throughout; fixed sly grin. Shoulders have a tight energized breathing rhythm (jittery, not calm). Weight transfers subtly foot to foot.
- **Expression**: Fixed sly grin, shifting wary eyes
- **Secondary motion**: Hood whips with each head turn, quiver bolts shift, satchel sways
- **Duration**: 4s

### I2 — Plotting Chuckle (was Silent Chuckle)
- **Subtle action**: Eyes drift up and to one side as if lost in a devious thought — you can see him scheming. Suddenly his eyebrows raise a hair and his eyes widen imperceptibly (a "YES, that's it!" beat). His grin widens and his shoulders start a rhythmic silent chuckle, nose crinkling, as if relishing some insane plan. After a couple of pulses, settles back into his normal sneaking grin. Mouth stays closed throughout.
- **Expression**: Contemplative → idea strikes → gleeful plotting → sneaking grin
- **Secondary motion**: Hood drifts with shoulder shake, quiver bolts shiver
- **Duration**: 4s

### I3 — Crossbow Fidget (was Predatory Breath)
- **Subtle action**: Spy gives his crossbow a single nervous heft — bounces it up an inch or two in his grip as if checking its weight, shoots it a quick narrow-eyed approving glance, then settles it back to low-ready. One quick shifty sideways glance, then eyes forward. Wired energized breathing throughout.
- **Expression**: Restless focus, briefly pleased with the weapon, shifty
- **Secondary motion**: Hood drifts, satchel sways slightly, quiver bolts jostle on the heft
- **Duration**: 4s
- **Note**: Replaces the earlier "predatory breath" concept — the original finger-drumming on the crossbow stock was too subtle/complex for I2V models to resolve. A single clear heft is simpler and reads better.

### I4 — Satchel Pat-Pat Check
- **Subtle action**: Off-hand briefly leaves the two-handed crossbow grip and pat-pat-pats the hip leather satchel two or three times — "yep, all my dirty tricks are still in here" — narrow-eyed approving grin, tiny satisfied eyebrow twitch. Off-hand returns to the crossbow and he settles back into canonical pose. Wired energized breathing.
- **Expression**: Fixed sly grin, approving narrowed eyes during the pat
- **Secondary motion**: Satchel gives a meatier swing on the pats, quiver bolts shift, hood drifts
- **Duration**: 4s
- **Fidget target variety**: I1 uses head, I2 uses face/eyes, I3 uses crossbow, this uses the off-hand + satchel — completes the idle-fidget set. Lore-consistent with P4 (the poison vial came *from* this satchel).

### I5 — Target Double-Take
- **Subtle action**: He suddenly "spots" something off-camera — sharp head whip to his left with widened eager eyes. A beat. Head snaps back toward center. Then snaps back to the left *harder*, now with a hungry widened-eye grin and the crossbow lifting an inch or two in eager anticipation. Predatory tension beat. Then a small deflating shoulder-shrug — "not now" — he lowers the crossbow back and head returns to center, settling into canonical.
- **Expression**: Shifty grin → eager widening eyes → hungry predator grin → resigned shrug → canonical sneaking grin
- **Timing feel**: Classic comedic double-take — snap away, snap back, snap away harder. Cartoon timing.
- **Secondary motion**: Hood whips on the head snaps, quiver bolts jostle, crossbow lift adds movement
- **Duration**: 4s
- **Why it works**: Double-takes are well-represented in I2V training data and read cleanly. Adds an outward-focused idle to complement the inward-scheming/self-checking ones.

### I6 — Neck Crack Unwind
- **Subtle action**: Wired restless shoulder roll, then a firm head-tilt sideways with an audible neck-crack pop, satisfied exhale through nose, sly grin widens slightly — "warming up for something nasty" energy. Subtle shoulder resettle and head returns to canonical.
- **Expression**: Tense focus → satisfied pop → widened grin → sneaking grin
- **Secondary motion**: Hood drifts on the shoulder roll and neck tilt, quiver bolts shift
- **Duration**: 4s
- **Personality read**: Unhinged-calm — less spy-specific, more "this guy is one beat from snapping." Pairs well with comedic power movements.

---

## Recommendation
- **Power**: P1 (Fourth-Wall Trollface) **or** P5 (Bomb Mishap) — both hit the jovial/comical client direction hardest. P1 is safer/simpler and more on-model with the "trollface to camera" client brief; P5 is more ambitious and more comedic but carries I2V risk (offscreen explosion read).
- **Idle**: I2 — Silent Chuckle (pairs with any power concept)

**Strong alternates**: P2 if more action-forward is preferred; I1 if I2's chuckle feels redundant next to a chuckle-heavy power beat.

---

## Approved Concept

> Fill in after user lock-in.

### Power Movement: _TBD_

### Idle Movement: _TBD_

### Total Loop Target
- Power duration: _TBD_
- Idle duration: 4s

---

## Revised Concepts (2026-04-22 — client weapon-driven rule)

> Appended after client feedback (2026-04-22): power move = weapon action, not ability / dirty-trick / personality-only beat. Every hero gets a mandatory breathing-only baseline idle. See `HeroAnimation/Docs/StyleGuide_Animation.md` §2 and `HeroAnimation/PromptTemplates/animation_concepts.md` Core Rules.
>
> **Audit of existing Spy power concepts against the new rule**:
> - ✅ P2 Quick-Draw Trick Shot — passes (snap aim + fire; the only weapon-driven concept in the current set)
> - ❌ P1 Fourth-Wall Trollface — paranoid scans + lean-in + grin; no crossbow use. Off-brief as a power move.
> - ❌ P3 Over-the-Shoulder Check — head-snap scan + wink + nose tap; no crossbow use. Off-brief.
> - ❌ P4 Poison Vial Reveal — satchel dirty-trick, no crossbow fire. Off-brief (falls into the "dirty tricks / ability kit" territory the client explicitly excluded).
> - ❌ P5 Bomb Mishap — satchel dirty-trick + kick + explosion; no crossbow. Off-brief (same ability-kit bucket as P4).
>
> Many of the off-brief concepts are genuinely fun beats and could be repurposed as expressive idle variants (I7+) in a future pass, since the personality work is strong. They just don't fit the weapon-driven power slot under the new rules.
>
> **Idle audit**: None of I1-I6 are breathing-only. The prior guidance in this doc said "No calm breathing — he's always scheming" — **that guidance is overridden by the client rule of 2026-04-22**. Even Spy now gets a mandatory breathing-only baseline (I0 below). The wired/restless energy persists in I1-I6 as expressive variants on top of the baseline.

### P6 — Trollface Fire *(weapon-primary reimagining of P1)*
- **Weapon action**: From canonical hunched low-ready pose, eyes drift up and **lock directly on camera** with a slowly widening trollface grin (no head snap — the fourth-wall break is in the eyes, not a head whip). Silent eyebrow-waggle. Then — without breaking the camera stare — **crossbow snaps up from low-ready into aim and looses a bolt forward**. Bolt streaks out of frame. Eyes stay locked on camera through the shot. Recovery: satisfied smirk with a single silent shoulder-shake chuckle. Crossbow dips back to low-ready, settles to canonical.
- **Character delivery**: The trollface-to-camera client signature threaded through a clean crossbow fire. The grin is the personality; the shot is the payoff. He's looking at YOU while he fires off-axis — unsettling and funny at once.
- **Timing feel**: Slow eye-drift-and-grin build (~2s), snap crossbow raise + fire (~0.8s, the only fast beat), slow smug recovery (~2s), settle (~2s).
- **VFX**: Tiny bolt streak off-frame, faint muzzle puff from the crossbow mechanism, minor motion blur on the raise.
- **Secondary motion**: Hood sways as the body commits to the aim, quiver bolts jostle briefly on the snap-up, satchel swings. No chained head snaps (see CLAUDE.md Known Issues — Seedance morphs quiver bolts on chained head-snap sequences).
- **Reference**: P1 personality structure + P2 weapon beat fused. The existing P1 trollface beats stay as flavor; the new addition is the actual shot.
- **Duration**: 7s
- **Why added**: Gives the team a weapon-driven version of the client-brief trollface signature. Fixes P1's core problem (no crossbow use) without losing the fourth-wall payoff.

### P7 — Sneaky Single-Glance Shot
- **Weapon action**: From canonical, Spy gives **one slow sideways eye-glance** (eyes only, minimal head movement — avoids chained head-snap morph risk per CLAUDE.md Spy Known Issues) — checking for witnesses. Eyes return forward. He then raises the crossbow smoothly from low-ready up into firing position, aims down the shaft briefly, and **looses the bolt forward**. Bolt streaks out. Recovery: sly satisfied grin held to camera. Crossbow dips back to low-ready, settles to canonical.
- **Character delivery**: The "stealth-shot" archetype — glance, commit, fire. Understated compared to P6's overt trollface. Subtle focus → confidence → satisfaction.
- **Timing feel**: Slow eye-glance (~1.5s), deliberate crossbow raise (~1s), held aim (~0.5s), fire (~0.3s), slow grin recovery (~2s), settle.
- **VFX**: Bolt streak, small mechanical puff at loose, subtle motion blur on the raise.
- **Secondary motion**: Hood drifts, quiver jostles on the raise, satchel sways. Head motion is minimal and single-axis — does not trigger the double-take morph risk.
- **Reference**: P3 glance-beat structure fused with P2's shot. The sneaky archetype fully realized as a weapon action.
- **Duration**: 6s

### P8 — Aim & Wink Fire
- **Weapon action**: From canonical, crossbow raises smoothly from low-ready into a deliberate steady aim (two-handed, tracks forward). He holds the aim a beat, then **winks to camera with one eye** while keeping the crossbow locked on target, then **looses the bolt** on the wink. Recovery: both eyes open, wide trollface grin to camera, crossbow dips back to low-ready, settles to canonical.
- **Character delivery**: The "showoff assassin" beat — he's SO confident he winks while firing. Focus → cheeky wink → release → grin. Fully on-brand jovial/comical.
- **Timing feel**: Slow aim rise (~1.5s), held aim (~0.5s), wink-and-loose (~0.5s, wink and shot fire simultaneously for comedic sync), slow grin recovery (~2s), settle (~1.5s).
- **VFX**: Tiny sparkle/gleam on the wink (optional — Supercell-style), bolt streak, small muzzle puff.
- **Secondary motion**: Hood drifts with the raise, quiver bolts shift, satchel sways. Controlled single-axis motion, no snap chains.
- **Reference**: P2 trick-shot swagger dialed up. Moneybags theatrical-confidence energy applied to the Spy.
- **Duration**: 6s

### I0 — Breathing Baseline *(mandatory — overrides the earlier "no calm breathing" guidance in this doc)*
- **Subtle action**: Canonical hunched low-ready pose preserved exactly — crossbow held two-handed at waist level, loaded and aimed low-ready. Slow shallow chest breathing (not deep/relaxed — Spy's baseline breath is still quick-tempo'd like a coiled spring, just without any head snaps or fidget beats). Tiny weight shift between breaths. Nothing else — no scan, no chuckle, no crossbow heft, no satchel pat, no neck crack, no double-take.
- **Expression**: Held sly trollface grin, eyes forward and narrowed. Occasional slow blink. Expression does not arc.
- **Breathing/weight**: Shallow quick-ish chest breath (still wired, just not fidgeting), weight forward on balls of feet, hunched stance preserved.
- **Secondary motion**: Hood drifts almost imperceptibly, quiver bolts still, satchel still.
- **Duration**: 4s
- **Why added**: Satisfies the client mandatory-baseline idle rule (every hero gets one, no exceptions — including Spy). The prior guidance in this doc that "Spy's idles must feel wired, restless, nervous" is now scoped to expressive variants (I1-I6) only; the baseline I0 is the safe fallback option the team can always pick. The breathing-only beat is still characterized — wired-calm rather than fully relaxed — but nothing fidget-y happens in the loop.
