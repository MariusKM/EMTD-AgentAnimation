# Merchant — Animation Concepts

## Reference
- Source art: `Source/Heroes Stylized/Merchant.png` (closed-mouth warm-smile FFLF variant)
- Hero description: `Docs/Heroes/Merchant.md`
- Personality keywords: jovial, generous, well-fed, welcoming, entrepreneurial, hearty
- Weapon: ornate blunderbuss / hand cannon, two-handed grip across body (right hand on forward foregrip, left hand on rear stock; barrel angled upward toward viewer's left)
- CSV default attack: medium-to-slow, reload-through-muzzle → aim → shoot, puff of smoke, "not a professional warrior"
- Silviu food-ammo notes (optional VFX flavor): rapid apples, AoE melon, sticky honey
- Client brief Hero Screen: "jolly wave and then proudly shakes his gun, as if showing off his wares or defense equipment"
- Client tone: kind, warm, hearty fair-trader

## Vocal direction *(hero-wide, 2026-04-30)*

Merchant should not be mute — he is a jovial salesman and his voice is part of his personality. Every prompt's Sound field invites **wordless hearty chuckles, jolly laughs, warm contented hums** at the appropriate beats. Constraints replace the hard `no voice no dialogue` ban with `no actual words no actual speech the merchant's vocal sounds are wordless hearty chuckles and jolly laughs only` so the audio model produces non-verbal character vocalizations without dialogue. I1 (breathing baseline) gets a single soft contented hum partway through plus full ambient SFX (cloth, wicker, gun-wood creak) — must not be silent.

## Cross-hero kinetic-shape audit
- **Moneybags** (Examples reference): pistol-raise + coin shower — theatrical showcase with vertical lift. Merchant's P1 (gun salute / shake) is in the same family — must differentiate via two-handed blunderbuss grip, jolly grin (not smug), gray-white muzzle smoke (not coins), no money-pouch element.
- **Blacksmith P1**: vertical-down hammer slam — different axis from Merchant.
- **Architect P4**: forward-thrust riposte — Merchant P2 (forward fire) shares this axis but with very different content (gun fire + smoke vs. caliper press).
- **New King P1 Royal Salute**: salute pose — adjacent to Merchant P4 (no-force theatrical). Differentiation: New King raises sword, Merchant shows off backpack with free hand.
- **Per-hero diversification**: 5 concepts below span vertical lift, forward thrust, diagonal up + catch, no-force theatrical, and multi-beat reload-aim-fire.

---

## Power Movement Concepts

### P1 — Hearty Gun Salute
*Closest to the client brief's literal description.*
- **Weapon action**: Free-hand wave forward to camera (right hand briefly releases the foregrip), then both hands return to the blunderbuss and lift it overhead. Gun shakes proudly twice, barrel pointed straight up, before settling back down to the canonical two-handed across-body carry.
- **Character delivery**: Wave is broad and jolly — "hello, friend." Lift transitions into open-mouth laughing grin (the canonical open-mouth variant lives mid-loop here as a peak beat). Closes back to the canonical closed-mouth warm smile on the settle.
- **Timing feel**: Heavy and proud — medium pace, wave snappy then lift slow and triumphant. Two-beat shake on the lift.
- **VFX element**: Minimal — small dust glints / warm sparkles around the gun barrel on the shake (proud-of-his-wares glow). No muzzle fire — this concept does not fire the gun.
- **Secondary motion**: White feather on cap bounces with each shake; basket jostles slightly as belly rocks under the lift; blue headband holds.
- **Kinetic axis**: Vertical lift (with brief horizontal wave intro)
- **Reference**: Moneybags theatrical lift — but differentiated by two-handed grip, jolly grin, gray/warm sparkle (not coins), no money pouch.

### P2 — Blunderbuss Fire
*The CSV default attack — the canonical merchant gun beat.*
- **Weapon action**: He shoulders the blunderbuss (heft it up from across-body to firing height, butt of the stock against the left-anatomical shoulder), braces, fires forward, then settles back down to the canonical carry.
- **Character delivery**: Wide cheerful grin held through the fire (open-mouth laugh as a peak beat at the moment of fire). Satisfied jolly nod after the recoil settles. He's enjoying this.
- **Timing feel**: Medium pace — heft (slow) → brace (held) → fire (snap) → recoil-wobble (heavy follow-through) → nod (warm).
- **VFX element**: Warm yellow-orange muzzle flash + thick **gray-white** smoke puff (NOT green — chroma key collision). Smoke billows forward then drifts up. Optional: a few small dark buckshot dots scatter forward briefly before the smoke covers them.
- **Secondary motion**: Stocky belly + basket bounce on the recoil wobble (the comedy beat — he's a heavy man with a heavy gun); white feather snaps; backpack contents jiggle (basket items must NOT morph — keep tight Constraint).
- **Kinetic axis**: Forward thrust + recoil wobble
- **Reference**: A gentler / heavier cousin of Spy crossbow fire — but with a comedic stocky-recoil follow-through.

### P3 — Apple Load & Fire ⭐ *(comedic — food-ammo Silviu flavor, literal apple-as-ammo)*
*Silviu food-ammo flavor done literally — he physically loads an apple as ammunition.*
- **Weapon action**: Left hand releases the rear stock and reaches back over the shoulder into the basket, pulls out a single bright **red apple**, brings it to the muzzle of the upright blunderbuss, **stuffs the apple down into the muzzle** with a comedic loading push, returns the left hand to the stock, two-handed brace, fires forward — the loaded apple launches out the muzzle as a discrete projectile with muzzle flash and gray smoke.
- **Character delivery**: Closed-mouth focused grin during the load, open-mouth jolly laughing grin at the moment of stuffing the apple in (the comedy beat), open-mouth jolly laugh peak at the fire, satisfied closed-mouth contented grin on the settle.
- **Timing feel**: Multi-beat — basket reach (slow) → apple pull (snap) → muzzle stuff (comedic deliberate) → re-grip (snap) → fire (snap) → settle.
- **VFX element**: Warm yellow-orange muzzle flash + thick gray-white smoke puff (NOT green) + a single red apple as a discrete forward-flying projectile after the fire. No green sparks.
- **Secondary motion**: Belly + basket bounce on the recoil; feather bobs; basket stays attached and gives up exactly one apple over the loop (basket has multiple apples in source, net change is -1 hard to spot).
- **Kinetic axis**: Multi-beat sequence (basket reach + stuff + fire) — the highest production value of the five.
- **Reference**: No direct example — closest in feel to Spy narrative-beat sequences.
- **Risk**: Multi-beat needs aggressive timecoding per the Architect lesson. Hand release + over-shoulder basket reach is a complex motion; apple silhouette preservation needed during the pull and stuff beats.

### P4 — Trader's Offer *(physical sales-pitch beat)*
*"Showing off his wares" reimagined as a physical offer — he reaches into his basket, pulls out an apple, and presents it to the camera as a sample.*
- **Weapon action**: Small body turn toward viewer-right exposing the backpack, left hand releases the rear stock and reaches back over the shoulder into the basket, pulls out a single bright **red apple**, extends it forward toward the camera at chest level as an offer, holds the present briefly with eye contact, then returns the apple back over the shoulder into the basket and the left hand resumes the rear-stock grip. Right hand stays on the forward foregrip throughout.
- **Character delivery**: Welcoming salesman pitch — closed-mouth contented grin widens warmly on the body turn, open-mouth jolly laughing grin at the moment of extending the apple toward the camera with a knowing welcoming twinkle, closes back to a satisfied closed-mouth grin on the return-to-basket. "For you, friend — fresh today."
- **Timing feel**: Slow-and-deliberate — body turn (slow) → basket reach (slow) → apple pull (snap) → offer hold (slow held) → return (snap) → settle.
- **VFX element**: None — pure character beat. Maybe a single warm soft cream-gold sparkle pulse on the apple at the offer peak (sales-pitch flourish) but optional.
- **Secondary motion**: Backpack jostles on the body turn and basket reach, feather drifts with the head turn, basket apple count restored at end (apple goes back in).
- **Kinetic axis**: No-force theatrical with a multi-beat hand sequence — characterful beats over force.
- **Reference**: A merchant version of New King's Royal Salute — but the gesture lands on a physical offered apple rather than a held weapon.
- **Risk per Fat King lesson**: Gun stays in right hand throughout — "always-hold right foregrip" Constraint required. Hand release is long (~5s) — needs explicit return-by-time Constraint. Over-shoulder reach is a complex motion; the apple-from-basket and apple-back-to-basket beats need clear silhouette anchors.

### P5 — Reload & Fire
*The full CSV attack sequence as a multi-beat power move.*
- **Weapon action**: He angles the blunderbuss vertical with the muzzle up, mimes a one-beat ramrod stroke into the muzzle (right hand briefly releases foregrip to push down then returns), shoulders the gun horizontally, fires forward, smoke puff, settles to canonical.
- **Character delivery**: Focused-but-jolly working-class ritual — eyebrows lift on the ramrod beat, satisfied grin on the brace, open-mouth laugh on the fire, contented closed-mouth nod on the settle.
- **Timing feel**: The slowest of the five — three discrete beats. Reload (slow deliberate) → aim (snap) → fire (snap) → settle (slow).
- **VFX element**: No VFX on the ramrod beat. Standard warm-yellow muzzle flash + gray-white smoke puff on the fire.
- **Secondary motion**: Belly + basket light bounce on the fire; feather + headband stable through the reload, snap on the fire.
- **Kinetic axis**: Vertical (reload) → horizontal (shoulder) → forward (fire) — multi-axis multi-beat
- **Reference**: No direct example — would be the most production-rich power move in the roster after Moneybags.
- **Risk**: Highest beat-count of the five — needs aggressive Stage 3 timecoded segmentation per the Architect lesson, otherwise Seedance will collapse the three beats into a single arc. Hand release/return on the ramrod is also a Fat-King-style hand-tracking risk.

---

## Idle Movement Concepts

### I1 — Breathing Baseline *(mandatory)*
- **Action**: Continuous ambient breathing with no discrete visible breath events — chest moves gently and almost imperceptibly throughout the loop in a continuous smooth rhythm. Micro weight shift.
- **Expression**: Resting closed-mouth warm smile, held throughout. No arcing.
- **Secondary motion**: Minimal — small ambient drift on the white feather and the blue headband; basket contents stable; backpack stable.
- **Duration feel**: 4s steady loop.
- *(Standard fallback option — same I1 framing as every other hero per the 2026-04-30 Princess Sweet/Dragonwitch update.)*

### I2 — Contented Sway
*The jovial trader at rest — humming and content.*
- **Subtle action**: Slow ambient weight shift — body sways gently from his anatomical-right foot to his anatomical-left foot and back across the loop, as if humming a tune mentally. Hands stay locked in canonical two-handed grip on the blunderbuss the entire time.
- **Expression**: Closed-mouth contented warm smile held throughout. Soft eye-crinkle. Occasional slow blink.
- **Breathing/weight**: Heavy stocky weight feel — the sway is slow and grounded, not bouncy. Belly rises slightly with each sway.
- **Secondary motion**: White feather drifts opposite the body sway (counter-motion), basket sways slightly, backpack contents stable, blue headband holds.
- **Duration feel**: 4s loop.
- **Risk note**: Sway must be small — don't say `rolls` or `rolling rhythm` (Seedance text-filter trigger from Fat King lesson). Use `sways`, `rocks`, `shifts` instead.

### I3 — Gun Heft
*Quiet weight management — he's holding a heavy gun.*
- **Subtle action**: The blunderbuss tips forward and down slightly under its own weight across the first half of the loop, then he subtly hefts it back up to the comfortable two-handed across-body carry by the end. Continuous slow rebalance, no fingers releasing the gun.
- **Expression**: Closed-mouth contented warm smile held throughout. Tiny eyebrow lift on the heft-back beat.
- **Breathing/weight**: Gun feels genuinely heavy — the tip-down is gravity, the heft-back is effort. Belly rises slightly with the lift.
- **Secondary motion**: Feather drifts, basket stable, contents stable.
- **Duration feel**: 4s loop.
- **Risk note**: Both hands stay on the gun — "always-hold" Constraint required (Fat King lesson). Tip-down distance must be small (a few inches at the muzzle) — Stage 3 prompt should specify the rotation amount or Seedance will exaggerate.

---

## Approved Concept

> Locked 2026-04-30. User approved the full slate (P1-P5 + I1-I3) for Stage 3 prompt creation.

### Power Movements (5 approved)
- **P1 — Hearty Gun Salute** — vertical lift + wave + two-beat shake (closest to client brief)
- **P2 — Blunderbuss Fire** — forward thrust, gray smoke puff, stocky recoil wobble (CSV default)
- **P3 — Apple Load & Fire** ⭐ — pulls apple from basket, stuffs it down muzzle, fires (literal food-ammo)
- **P4 — Trader's Offer** — pulls apple from basket and offers it to the camera (physical sales pitch)
- **P5 — Reload & Fire** — multi-beat ramrod → shoulder → fire (full CSV ritual)

### Idle Movements (3 approved)
- **I1 — Breathing Baseline** *(mandatory)*
- **I2 — Contented Sway** — slow weight shift, jovial humming feel
- **I3 — Gun Heft** — heavy gun tips forward, hefts back up

### Total Loop Target
- **Power duration**: 5-7s
- **Idle duration**: 4s
- **Loop**: Must seamlessly connect end → start (canonical pose at t=0 and t=loop-end)
- **Aspect ratio**: 1:1 square (EMTD standard)
- **Model**: Seedance 2.0
- **FFLF input**: `Source/Heroes Stylized/Merchant.png` (closed-mouth warm-smile variant)
