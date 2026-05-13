# Animation Concepts — Fat Princess

> Stage 2 working doc. Concepts are model-agnostic — prompt translation happens in Stage 3.

## Character Context
- Source art (canonical pose, open mouth): `Source/Heroes Stylized/Fat_Princess.png`
- **FFLF input image (mouth-closed)**: `Source/Heroes Stylized/mouth_closed/Fat_Princess.png` — use this as the I2V input so the character starts and ends the loop with a closed-mouth content smirk (open-mouth peaks live in the middle of the loop)
- Hero description: `Docs/Heroes/Fat_Princess.md`
- Personality keywords: dramatic, indulgent, pampered, comedic, expressive, food-obsessed, sweet-but-scary-when-angry
- Weapon: **gold spoon/ladle (spoon-club)** with dark chocolate dripping from the bowl — held at hip level in her **anatomical left hand** (viewer's right side of image)
- Off-hand signature: **yellow cupcake** near her mouth in her **anatomical right hand** (viewer's left side of image)
- Natural weapon action: raise spoon with a gleeful wind-up → bring it down in a smashing swing forward. Chocolate droplets fling during the arc. Heavy but surprisingly graceful — not as sluggish as Fat King.
- Tone direction: jovial / slightly comical (client, 2026-04-16) — Fat Princess is a "lean hard into it" character
- Animation focus: **the sweet-to-savage pivot** ("very sweet demeanor, scary when angry") is the comedic heart of the character; spoon smashes and indulgence beats should both land

## Differentiation notes (cross-hero power-move audit)
- **Overhead-raise-then-smash pattern is already covered on the roster** by Blacksmith P1 (hammer ground slam) and New King P3 (sword rally + chop). Our P1 Overhead Spoon Smash is kept here as a fallback only — **primary picks should use a different force-display axis** (horizontal swing, forward thrust, pop-up swing, figure-eight flourish, or no-force theatrical beat).

## Cupcake integrity rule
- The FFLF image has an **intact yellow cupcake with its icing peak visible**. The cupcake must appear identical at t=0 and t=loop-end. Therefore:
  - No bites (frosting peak must survive).
  - No crumbs falling off (cupcake is whole at both ends).
  - No cream-frosting "reveal" (source already shows the frosting).
  - She may hold, lift, wave, admire, gesture with, or briefly toss-and-recover the cupcake — but never visibly consume it.
  - If the cupcake leaves her hand during the loop (e.g. P2 pop-up), a replacement must appear before the loop ends (from gown pocket in P2).

## Seedance pitfalls to guard against (concept-stage checks)
- **No green VFX**: all signature VFX use chocolate brown, cream white, pale pink, or pale gold — never green/mint sparkles (keyer would eat them).
- **Avoid "rolls" / "rolling"** for body motion (Seedance text-safety filter risk on fat-body heroes; use "sways", "shifts", "rocks").
- **Anatomical-hand discipline**: spoon stays in anatomical left hand (viewer right) at hip, cupcake stays in anatomical right hand (viewer left) near mouth — lock these in all prompts.
- **Mouth-closed FFLF**: loops must start and end with closed-mouth smirk; open-mouth peaks sit mid-loop.
- **Noun audit**: use "tall pink conical princess hat with a short white cloth tassel at the tip" (not "hennin", not "veil", not "streamer" — both `veil` and `streamer` over-read into a long trailing banner silhouette; confirmed on P2 test 2026-04-23). Use "spoon" or "gold spoon" (not "ladle" — ladle is fine in flavor text but spoon is the unambiguous weapon noun).
- **Static-camera prefix**: lead the Subject line with `static camera shot of...` on all power concepts — the tosses, thrusts, and swings are high-motion actions that Seedance may otherwise interpret as camera pushes/zooms.

---

## Power Movement Concepts

### P1 — Overhead Spoon Smash *(shared pattern — fallback only)*
- **Weapon action**: Spoon raises from hip overhead with a gleeful wind-up, peaks with open-mouth delighted grin, drives down in a forward smash. Chocolate splat bursts at impact. Recovers upright and settles to canonical closed-mouth smirk. Cupcake stays intact and in place throughout — no nibble recovery.
- **Character delivery**: Sweet surprise → gleeful wind-up grin → fierce gleeful smash → pleased closed-mouth settle.
- **Timing feel**: Slow graceful wind-up (~1s), sharp snap downswing, sustained chocolate splat, slow settle. Heavy but surprisingly graceful.
- **VFX**: Dark chocolate splat at impact, droplets flung along the arc.
- **Secondary motion**: Pink gown sways with the wind-up, the small white tassel at the hat tip flicks briefly with the downswing, fringe bounces, cupcake held locked.
- **Reference**: Wilhelm (weight/wind-up) + Spy (expression arc).
- **Shared-pattern caveat**: Same kinetic shape as Blacksmith P1 and New King P3. Keep as fallback only.
- **Duration**: 6s

### P2 — Cupcake Pop-Up & Pocket Refill ⭐ *NEW* (horizontal swing + comedic refill)
- **Beat 1 — Setup (~0.7s)**: Underhand toss of the cupcake upward a few inches with her anatomical right hand (icing peak stays up).
- **Beat 2 — Wind-up (~0.4s)**: Spoon cocks back to her anatomical-left side at hip level like a baseball bat.
- **Beat 3 — Swing contact (~0.4s)**: As cupcake peaks, she swings the spoon bowl horizontally — light pop with the flat of the bowl — cupcake flies upward and forward **out of the top of frame**. Open-mouth "*ha!*" grin.
- **Beat 4 — Held peak (~0.8s)**: Triumphant batter pose, spoon follow-through on her anatomical-right side.
- **Beat 5 — Pocket refill (~1.2s)**: Empty right hand dips down to a **hidden pocket at her right hip in the gown**, pulls out a fresh identical yellow cupcake (icing peak up).
- **Beat 6 — Settle (~2.5s)**: Cupcake raises back to canonical position near mouth, spoon returns to hip, expression softens to content closed-mouth smirk.
- **Character delivery**: Sweet → focused batter → gleeful impact → pleased "of course I have more" refill → content settle. Comedic self-indulgence — the "scary when angry" expressed as impish aggression on her own food, with a "princess is so spoiled she has infinite cupcakes" punch line.
- **VFX**: Small pale-pink sparkle puff on the cupcake-contact moment; chocolate droplet flung from the spoon bowl on the swing.
- **Secondary motion**: Weight shifts left on wind-up, right on swing. The small white tassel at the hat tip sways briefly with the swing. Gown swings laterally. Hip pocket is implied in the pink gown skirt — Seedance invents it on the reach-in.
- **Reference**: Moneybags (theatrical showmanship) + Diana (swing snap) + classic "infinite snacks" cartoon gag.
- **Duration**: 6s
- **Risks in prompt stage**: (a) Cupcake integrity on contact — describe as "light pop" not "smash" so Seedance doesn't deform it; (b) Cupcake flight path — describe "flies out of top of frame" not "flies toward camera" (avoid zoom misread); (c) Refilled cupcake must visually match the original (same yellow, same icing peak).

### P3 — Forward Spoon Jab (Chocolate-Splat Point) ⭐ *NEW* (forward projection axis)
- **Weapon action**: She dips into a subtle forward battle-poise, spoon drawn back briefly to her anatomical-left hip. **Thrusts the spoon forward toward the viewer, bowl-first**, in a fencing-jab motion. **Chocolate splatters forward in a cone** from the bowl. Holds the forward-pointed pose with fierce gleeful open-mouth grin, chocolate still dripping from the bowl tip. Settles back to canonical closed-mouth smirk.
- **Character delivery**: Sweet → micro-prep → fierce forward thrust projection → held battle-grin → settle. Projects her force toward the camera — strongest "hero screen" viewer-facing read.
- **Timing feel**: Short prep (~0.5s), explosive snap thrust (~0.3s), long held grin (~2s), slow settle (~3s).
- **VFX**: Chocolate splatter cone sprayed forward from the bowl on the thrust; small pale-pink sparkle puff on the grin-hold.
- **Secondary motion**: Forward body lean on the thrust, gown shifts, the small white tassel at the hat tip flicks with the snap, cupcake hand stays firmly anchored at mouth.
- **Reference**: New King P6 Commander's Point (forward projection) re-skinned for chocolate-splat comedy.
- **Duration**: 6s
- **Risks in prompt stage**: Forward jab direction must read as character-anatomical forward — pair with "static camera" prefix and "thrust projects forward through the frame the camera does not zoom or push in" so Seedance doesn't read it as a zoom-in.

### P4 — Graceful Pirouette with Chocolate Ribbon (body rotation, ribbon wraps around her)
- **Concept revised 2026-04-23 after first generation** — the original "single spoon twirl + waist tap" brief produced a much stronger output when Seedance re-interpreted "twirl" as a full body pirouette. User approved the pirouette read; concept is now baked around the body spin.
- **Weapon action**: Spoon lifts from hip to shoulder height, left arm extends outward, character performs **one complete graceful 360° pirouette in place**. During the rotation the spoon carves a wide horizontal arc around her so a dark chocolate droplet ribbon wraps fully around her silhouette. She decelerates smoothly to face the camera again, lowers the spoon back to hip, and lifts her chin with a pleased chef's-kiss smirk as a pale-gold sparkle-ring pulses outward.
- **Character delivery**: Focused smirk → confident pirouette → pleased chin-up → content settle. "Graceful with authority" — realizes the CSV "medium attack speed (graceful)" direction via dance vocabulary rather than direct impact.
- **Timing feel**: Smooth ease-in on the arm extension, sustained pirouette through the middle, gentle deceleration to forward-facing, soft held chin-up, slow settle.
- **VFX**: Full ring of dark brown chocolate droplets trailing the spoon through the rotation and encircling her body; small pale-gold sparkle-ring pulse on the finish.
- **Secondary motion**: Pink gown skirt flares outward from centrifugal rotation and settles on the finish, hat tassel flicks briefly with the spin, auburn back bun stays tight in place, cupcake orbits with her body in her right hand (never released).
- **Reference**: Diana (graceful flourish with trail VFX) at full-body scale — the chocolate ribbon serves the same role as Diana's slash trails, just wrapping around the character rather than crossing the frame.
- **Duration**: 6s
- **Risks in prompt stage**:
  - **Camera orbit misread** — a body spin can read as the camera circling a static character. Lead Subject with `static camera shot of...` and pin in Constraints: "camera does not orbit, only the character turns in place."
  - **Rotation count** — more than one turn chains into dizziness; less than one leaves her facing away. Pin "exactly one complete 360-degree rotation, ends facing forward toward the camera."
  - **Cupcake release** — during fast rotation I2V may let go of the cupcake. Explicit "cupcake orbits with her body, never released" in Constraints.

### P5 — Gleeful Spoon Lick (no-force indulgence, direct client Hero Screen brief)
- **Weapon action**: Spoon lifts from hip toward her face (cupcake hand stays anchored at mouth throughout — no contact). Extravagant **long lick** up the chocolate-coated bowl — eyes flutter closed in bliss, cheeks flush — pulls away with huge open-mouth delighted grin, gives the spoon a proud little shake, settles spoon back to hip, returns to canonical smirk.
- **Character delivery**: Anticipation smirk → focused lick → blissful eye-closure → delighted reveal grin → satisfied settle.
- **Timing feel**: Slow deliberate build, sustained middle lick-beat, snappy reveal grin, slow settle.
- **VFX**: Cream-white sparkle trail on the lick, pale-pink blush glow on cheeks at peak, single chocolate droplet falling from the bowl after she pulls away.
- **Secondary motion**: Head tilts back slightly on the lick peak, side-fringe drifts, the small white tassel at the hat tip sways with the head-tilt, gown shifts on the inward arm motion.
- **Reference**: Moneybags (sustained theatrical indulgence).
- **Duration**: 6s

### P6 — Showcase Presentation ⭐ *NEW* (no-force theatrical, both props aloft)
- **Weapon action**: Spoon does a small conducting-style **figure-eight flourish** in front of her (two loops) at waist level, flinging chocolate droplets in a ribbon-pattern trail. At the same time, her cupcake hand **lifts the cupcake slightly upward and outward** — presenting it like a trophy, still intact, icing peak up. Peaks with open-mouth delighted "*ta-dah!*" grin, head tilted with theatrical pride, both props held aloft. Settles both back to canonical.
- **Character delivery**: Calm smirk → growing excitement → theatrical conducting flourish → trophy-peak presentation → delighted reveal grin → modest settle. The cupcake is **displayed, not consumed**.
- **Timing feel**: Slow conducting flourish (~2s), held peak pose (~1.5s), slow settle (~2.5s).
- **VFX**: Chocolate droplet ribbon following the spoon's figure-eight path; soft pale-gold sparkle-halo around both props at the peak pose.
- **Secondary motion**: Gown lifts slightly at the peak (weight onto toes), the small white tassel at the hat tip sways slightly with the motion, bun bobs gently, cupcake rotates minimally so the icing peak stays visible.
- **Reference**: Moneybags (theatrical showmanship) + General (trophy-display bearing).
- **Duration**: 6s
- **Risks in prompt stage**: Cupcake must remain visibly intact and recognizable at the peak — frame as "lifted, held aloft, presenting" not "thrust" or "waved" which could corrupt it.

---

## Idle Movement Concepts

> Overall idle direction: Fat Princess is **content, indulgent, theatrically self-pleased, mouth-closed smirk at rest**. Motion is heavy but graceful — slow gentle sways, never jerky.

### I1 — Breathing Baseline *(mandatory)*
- **Subtle action**: Chest rises/falls in slow breathing rhythm. Micro weight shift left-to-right across 4s. Occasional blinks.
- **Expression**: Closed-mouth content smirk, held steady. Eyes bright and amused.
- **Breathing/weight**: Slow, relaxed, fully grounded.
- **Secondary motion**: The small white tassel at the hat tip drifts minimally, side-fringe lifts and settles, skirt hem stirs minimally, single slow chocolate drip from the spoon bowl at the loop midpoint.
- **Duration**: 4s.

### I2 — Spoon Gaze & Drip Appreciation
- **Subtle action**: Eyes drift down-and-to-her-right to admire the chocolate on the spoon, head tilts a few degrees toward the spoon side with a dreamy closed-mouth smirk. A chocolate drip falls from the bowl. Smirk widens slightly with satisfaction. Head returns to forward.
- **Expression**: Smirk → dreamy admiring smirk → slightly wider satisfied smirk → canonical smirk. All mouth-closed.
- **Breathing/weight**: Steady slow breathing, hip sways gently toward the spoon side on the gaze, returns center.
- **Secondary motion**: Side-fringe falls slightly across the face on the tilt, the small white tassel at the hat tip drifts slightly with the head motion, skirt shifts with the hip sway, single visible chocolate drip.
- **Duration**: 4s.
- **Risks**: Head tilt must stay subtle (a few degrees) — keep explicit "character-internal gesture not a camera pan or tilt."

### I3 — Curtsy Dip ⭐ *NEW* (nod to client brief)
- **Subtle action**: Her weight dips **slightly downward** (feet planted, small knee-bend for a ladylike curtsy-lite). Head tilts with a demure closed-mouth smirk on the dip-peak, rises back to canonical with a pleased exhale. No prop interaction.
- **Expression**: Content smirk → demure pleased smirk at dip → content smirk on rise. All closed-mouth.
- **Breathing/weight**: Slow breathing through the cycle; weight dips and rises as a single gentle movement.
- **Secondary motion**: Gown skirts gently shift downward on the dip and lift on the rise, the small white tassel at the hat tip drifts slightly with the dip and rise, fringe shifts softly.
- **Duration**: 4s.
- **Risks**: Dip must be a gentle knee-bend a few degrees — not a crouch or kneel or bow.

### I4 — Content Hum & Chest Puff ⭐ *NEW*
- **Subtle action**: Closed-mouth happy **nose-hum** — lips stay firmly closed, smirk widens slightly, eyes close briefly in bliss and reopen. Shoulders and chest rise gently with the hum-breath and settle back. Subtle side-to-side weight sway.
- **Expression**: Content smirk → slightly widened closed-mouth smirk with closed-eye bliss at peak → content smirk on settle.
- **Breathing/weight**: Slow content breathing, weight sways gently once.
- **Secondary motion**: The small white tassel at the hat tip drifts slightly with the chest rise, fringe drifts softly, props held locked.
- **Duration**: 4s.
- **Risks**: Lips must stay closed throughout — "soft nasal hum with closed mouth not singing not humming a melody" in the prompt.

---

## Approved Concept

> To be filled in after review with user.

### Power Movement: _TBD_
### Idle Movement: _TBD_

### Total Loop Target
- **Power duration**: 6s
- **Idle duration**: 4s
- **Loop**: Each independent, must seamlessly connect end → start via the closed-mouth FFLF pose

---

## Seedance 2.0 Prompts

Generated per concept — see `Prompts/Seedance/`:

| # | File | Concept |
|---|------|---------|
| P1 | [P1_Overhead_Spoon_Smash.md](Prompts/Seedance/P1_Overhead_Spoon_Smash.md) | Overhead Spoon Smash *(fallback)* |
| P2 | [P2_Cupcake_Popup_Pocket_Refill.md](Prompts/Seedance/P2_Cupcake_Popup_Pocket_Refill.md) | Cupcake Pop-Up & Pocket Refill ⭐ |
| P3 | [P3_Forward_Spoon_Jab.md](Prompts/Seedance/P3_Forward_Spoon_Jab.md) | Forward Spoon Jab ⭐ |
| P4 | [P4_Twirl_and_Tap_Flourish.md](Prompts/Seedance/P4_Twirl_and_Tap_Flourish.md) | Twirl-and-Tap Flourish |
| P5 | [P5_Gleeful_Spoon_Lick.md](Prompts/Seedance/P5_Gleeful_Spoon_Lick.md) | Gleeful Spoon Lick |
| P6 | [P6_Showcase_Presentation.md](Prompts/Seedance/P6_Showcase_Presentation.md) | Showcase Presentation ⭐ |
| I1 | [I1_Breathing_Baseline.md](Prompts/Seedance/I1_Breathing_Baseline.md) | Breathing Baseline *(mandatory)* |
| I2 | [I2_Spoon_Gaze_Drip.md](Prompts/Seedance/I2_Spoon_Gaze_Drip.md) | Spoon Gaze & Drip Appreciation |
| I3 | [I3_Curtsy_Dip.md](Prompts/Seedance/I3_Curtsy_Dip.md) | Curtsy Dip ⭐ |
| I4 | [I4_Content_Hum_Chest_Puff.md](Prompts/Seedance/I4_Content_Hum_Chest_Puff.md) | Content Hum & Chest Puff ⭐ |
