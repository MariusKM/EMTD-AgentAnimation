# Count Wilhelm — Animation Concepts

> Stage 2 working draft. Power slate proposes 5 concepts spanning kinetic axes 1, 2, 3, 4, 5/6. Signature VFX color is **cool blue** (per in-game VFX). Source PNG = `Source/Heroes Stylized/Count_Wilhelm.png` (canonical pose, used directly as I2V input — no `mouth_closed/` variant needed; stern glare is the resting state).

## Reference
- Hero doc: `Docs/Heroes/Count_Wilhelm.md`
- Existing reference animation: `Examples/wilhelm-with-aac-audio.mov` — heavy overhead slam, 5s
- Personality keywords: stern, intimidating, battle-hardened, authoritative, veteran, fierce
- Weapon: ornate halberd (etched silver axe-head + top spike + decorative scrollwork + brown wooden haft) — held with both hands diagonally across body. Anatomical right hand high (near axe-head, viewer-left), anatomical left hand low on haft (viewer-right).
- CSV `Default Attack Style`: "Medium attack speed, long melee range. Professional fighter — stabs and swings of halberd." Silviu: "Strong 2 handed tank with swipe and stab attacks."
- FFLF rule: both hands on weapon at canonical pose. Single-hand beats (mustache twirl) must release one hand mid-loop and restore the two-handed grip before loop end.

---

## Power Movement Concepts

### P1 — Halberd Forward Stab ⭐
- **Weapon action**: One sharp decisive forward stab with the **top spike** of the halberd. Both hands stay on haft, anatomical right (high grip) drives the thrust, anatomical left (low grip) anchors.
- **Character delivery**: Brief micro wind-back (~2-3 inches), explosive forward thrust, locks diagonal across body. Stern under-brow glare held throughout; dry approving nod after settle.
- **Timing**: Short wind-up (~0.4s), fast strike (~0.3s), held finish (~1.2s). Snappier than the existing slam reference — leans into "professional fighter" CSV note.
- **VFX**: Cool blue energy spike trail along the leading edge of the spear-tip during the thrust; brief blue impact mote at full extension, dissipates within 0.4s.
- **Secondary motion**: Cape drives forward with the body shift then settles to canonical drape. White mustache micro-bounce on impact. Necklace gems glint.
- **Reference**: Closest to Diana's snappy decisive feel but with Wilhelm's weight.
- **Kinetic axis**: 3 (forward thrust)

### P2 — Sweeping Halberd Swipe
- **Weapon action**: Wide horizontal sweep with the **broad axe-head face** presented to camera, traveling viewer-right to viewer-left in front of the body. Anatomical right hand (high grip) leads.
- **Character delivery**: Plants weight on rear leg, sweeps the halberd across with full hip rotation, settles back to canonical. Stern glare; subtle smirk after the sweep.
- **Timing**: Medium wind-up (~0.5s), fast sweep (~0.5s), strong settle (~0.8s).
- **VFX**: Cool blue arc-trail ribbon following the axe-head's broad face — wide curved blue energy slash held briefly, dissipates.
- **Secondary motion**: Cape sweeps strongly viewer-left with the rotation, resettles to canonical drape. Mustache lags slightly.
- **Kinetic axis**: 1 (horizontal arc) — favors broad-face presentation per silhouette-preservation rule
- **Audit note**: Closest in shape to Architect P1's "Measuring Arc Slash"; differentiated by Wilhelm's heavy timing, two-handed grip, and impact weight.

### P3 — Heavy Overhead Slam (refresh of existing reference)
- **Weapon action**: Slow wind-up bringing both hands and halberd overhead, then explosive downward chop ending halberd low and angled. Mirrors the existing reference animation as a fresh I2V take.
- **Character delivery**: Deep coil on wind-up, full release on slam, deep wide-legged stance on settle, stern recovery glare.
- **Timing**: Long wind-up (~1.0s), explosive slam (~0.3s), recovery (~0.8s) — classic slow-fast-slow.
- **VFX**: Blue impact ring radiates outward from the strike point at the bottom of the chop; brief blue energy crack along the axe-head edge during the slam descent. Ring dissipates before loop end.
- **Secondary motion**: Strong cape billow on wind-up + wrap on slam + slow settle (per existing reference). Mustache bounces on impact.
- **Kinetic axis**: 2 (vertical down) — overlaps with Blacksmith P1 / New King P3 by axis; Wilhelm has historic claim via the existing reference.

### P4 — Halberd Plant & Stern Verdict
- **Weapon action**: Brings the halberd vertical (axe-head up) and plants the haft butt sharply on the ground in front of him with both hands. Holds the planted pose.
- **Character delivery**: Closest to client brief ("leans on halberd, stern but approving nod"). Plant is decisive, then he stands tall, stern glare hardens, small approving head-nod, dry smirk under the mustache. Ceremonial / authoritative read.
- **Timing**: Lift (~0.4s), plant (~0.2s), hold + verdict (~2.5s including the nod).
- **VFX**: Single cool blue energy ring ripples outward from the haft-butt at ground level on the plant impact; brief faint blue glow up the haft toward the axe-head, fades within 0.6s.
- **Secondary motion**: Cape shifts on the plant motion and resettles. Necklace gems catch the blue glow briefly.
- **Reference**: Architect P2's no-force theatrical verdict beat, rooted in a two-handed weapon plant.
- **Kinetic axis**: 6 (no-force theatrical) with a light vertical anchor

### P5 — Aurora Halberd Storm *(slate-mandatory VFX-heavy spectacle)*
- **Weapon action**: Lifts the halberd vertically with both hands, axe-head ignites with intense cool blue energy, halberd held aloft as the focal anchor while the spectacle unfolds.
- **Character delivery**: Slow ceremonial lift, stern glare hardens to grim resolve as the energy builds, small triumphant head-tilt-up at the peak, then settles back to canonical two-handed diagonal grip.
- **Timing**: Lift (~0.8s), VFX build (~1.0s), held peak (~1.5s), VFX dissipates (~0.7s), settle (~0.5s) — needs full 6-7s duration.
- **VFX (the visible power)**: 10+ swirling cool-blue energy ribbons spiraling around the haft from butt to axe-head; off-frame wind currents visualized as blue particle streams sweeping across the foreground; bright blue radial burst at the axe-head at peak; cape lifted and rippled by the wind effect. All VFX dissipates before loop end so FFLF connects.
- **Secondary motion**: Cape strongly lifted and wind-rippled during peak, settles to canonical drape. Mustache fluttered briefly.
- **Reference**: Princess Sweet P6 / Herald P6 (spectacle-tier).
- **Kinetic axis**: 5 (multi-beat with off-screen elements) + vertical lift
- **Generation risk**: Higher first-pass risk per the rule — recommend running AFTER P1 or P3 lands cleanly.

---

## Idle Movement Concepts

### I1 — Stern Battle-Ready Breathing *(mandatory baseline)*
- **Action**: Both hands stay on halberd in canonical diagonal grip throughout. Continuous ambient slow regular calm breathing — chest moves gently and almost imperceptibly across the loop, no discrete visible breath events.
- **Expression**: Stern under-brow glare held; occasional slow blink.
- **Secondary motion**: Cape and mustache drift almost imperceptibly with the ambient breathing. Necklace gems static.
- **Duration**: 4s steady loop.

### I2 — Mustache Twirl & Approving Nod *(client-brief idle)*
- **Action**: Direct translation of the client's Hero Screen brief ("leans one hand on his halberd, slowly strokes his beard while nodding thoughtfully"). Adapted for FFLF integrity: canonical is two-handed, so this is a mid-loop excursion that returns.
- **Mid-loop**: Releases anatomical-left hand from lower haft (anatomical-right hand keeps the halberd anchored — he leans on it briefly), brings the freed hand to one end of the handlebar mustache, gives it one slow thoughtful twirl/stroke between thumb and forefinger, slow approving head-nod. Returns the hand to the haft before loop end.
- **FFLF**: Two-handed canonical grip restored before loop end so first/last frames match.
- **Expression**: Stern face warms slightly to a dry approving smirk during the stroke, returns to stern glare.
- **Duration**: 5s.

### I3 — Veteran's Heft & Shoulder Roll
- **Action**: Both hands stay on halberd throughout (no FFLF risk). Small upward heft of the halberd (lifts maybe 2-3 inches, settles back from its weight), small shoulder roll, brow furrow deepens for a moment then resets, stern glare unbroken.
- **Read**: The "I've been doing this for 40 years" tic — pure veteran beat, no character business.
- **Duration**: 4s.

---

## Vocal Direction

Wilhelm is a stern battle-hardened veteran. Wordless vocalizations:
- **Power moves**: a low gruff approving grunt on settles, a deep "hmph" or low throaty acknowledgment after impact
- **Idles**: a deep relaxed nose-breath rhythm; on I2 a quiet "hmph" or contented low rumble during the approving nod

No chuckles, no laughter — too jovial for this character. The mustache fully covers the mouth so lipsync risk is minimal.

Standard Sound-field bans: `no voice no dialogue no speech no vocalizations no humming no music`. Standard positive Constraint: `no dialogue no speech no vocal sounds in audio only material and mechanical sounds [list] are present in the audio track`.

---

## Approved Concepts

> Locked 2026-05-05. User approved the full slate (P1-P5 + I1-I3) for Stage 3 prompt creation. Vocal direction confirmed: stern, no-nonsense, no chuckles — gruff grunts and "hmph" only.

### Power Movements (5 approved)
- **P1 — Halberd Forward Stab** ⭐ — snappy spike thrust with blue spike trail (forward thrust axis)
- **P2 — Sweeping Halberd Swipe** — broad-face horizontal arc with blue arc trail (horizontal arc axis)
- **P3 — Heavy Overhead Slam** — refresh of existing reference, blue impact ring (vertical down axis)
- **P4 — Halberd Plant & Stern Verdict** — client-brief beat, blue ground ring + verdict nod (no-force theatrical axis)
- **P5 — Aurora Halberd Storm** — slate-mandatory spectacle, 10+ blue energy ribbons + wind particles (multi-beat + vertical lift)

### Idle Movements (3 approved)
- **I1 — Stern Battle-Ready Breathing** — mandatory baseline, two-handed canonical grip
- **I2 — Mustache Twirl & Approving Nod** — client-brief idle, mid-loop one-hand release with FFLF restore
- **I3 — Veteran's Heft & Shoulder Roll** — two-handed throughout, weight-heft tic

### Total Loop Target
- **Duration**: 5-7s (P5 spectacle needs 6-7s; P1/P2/P3/P4 fit in 5-6s; idles 4-5s)
- **Split**: ~3s power + ~2-4s idle
- **Loop**: Must seamlessly connect end → start. FFLF = canonical two-handed diagonal grip with stern glare.
