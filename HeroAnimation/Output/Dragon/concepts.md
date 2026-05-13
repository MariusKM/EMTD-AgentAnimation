# Dragon — Animation Concepts (Idle-only slate)

> **Scope:** Idle-only. Dragon is a unit (end-game heavy), not a hero — no power-move slate.
> **Tone direction (AD 2026-05-11):** Juvenile / teenager / rebellious-but-menacing. Knowing smirk register, NOT proud-dignified mythic-mascot. Permitted comedic beats: an accidental small fire puff, a small burp with a tiny ember, or a small cough with a soft soot puff — the dragon's fire-breathing isn't fully under control yet. NEVER a deliberate fire-breath, NEVER large flames, NEVER a flame stream, NEVER a roar.
> **Chroma:** Green (`0x00FF00`), FFLF input = `Output/Dragon/Dragon_FFLF_0.png` (to be created by user after concept lock).
> **Reference source:** `Source/Heroes Stylized/Dragon.png`, hero doc `Docs/Heroes/Dragon.md`.

## Reference
- Source art: `Source/Heroes Stylized/Dragon.png`
- Hero description: `Docs/Heroes/Dragon.md`
- Personality keywords: juvenile, teenage, rebellious, slightly menacing, mischievous, attitudinal, knowing smirk, mythic-mascot-in-training, comedic-accidents
- Canonical pose: seated chibi red dragon, three-quarter view turned ~15–25° to viewer-left, both rear paws folded under, both front paws planted, folded-but-raised wings, tail curling to viewer-right with leaf-spade tip near ground, head held high with slight teenage cock, mouth closed in knowing smirk, bright saturated green almond eyes

---

## Idle Movement Concepts

> Six variants proposed. I1 is the mandatory breathing-only baseline (safe pick, no character business). I2–I4 cover the three AD-approved comedic accident beats (each loop carries exactly ONE accident beat). I5 is a pure rebellious-attitude variant with no accident. I6 is the user-approved deliberate smug show-off fire-breath variant (the only permitted deliberate fire-breath, strictly cartoon-scale flex).
>
> **Critical loop integrity rule for all variants:** mouth defaults CLOSED in canonical half-smirk. On variants with a mouth-open beat (I2/I3/I4/I6), the mouth opens briefly mid-loop and returns to closed by loop end — the FFLF first/last frame matches the canonical closed-mouth pose exactly. No teeth visible at t=0 and t=loop_end. The accident/show-off VFX (puff, ember, soot, cartoon flame) fully dissipates before loop end so the FFLF is clean.

### I1 — Breathing Baseline *(mandatory)*
- **Action**: Continuous ambient breathing with no discrete visible breath events. Chest puffs gently and almost imperceptibly under the warm gold underbelly plates. Shoulders rise and fall in a slow steady rhythm appropriate to a large creature (deeper / slower than a human's breath rhythm). No comedic accident, no head-tilt, no eye-tracking, no tail-swish — pure baseline.
- **Expression**: Resting canonical face — closed-mouth knowing smirk, eyes level with camera, brow framing held. The expression doesn't arc; it holds.
- **Breathing/weight**: Slow deep ambient. Body remains planted: front paws steady on the ground, rear haunches steady, weight distributed evenly.
- **Secondary motion**: Subtle leathery wing-membrane drift at the wing tips with the breath. Tail tip barely twitches. Dorsal spines catch a faint shimmer of painted highlight as the back rises and falls. Folded wing membrane shows a hair of give with each chest cycle.
- **Duration feel**: 4s steady loop.
- **VFX**: None.
- **Reference feel**: Princess Sweet I1 / Dragonwitch I1 baseline — continuous ambient rhythm framing per the Princess Sweet 2026-04-30 lesson; the older "multiple breath cycles" Architect framing is deprecated.

### I2 — Accidental Fire Puff
- **Action**: Mid-loop, the dragon's chest hitches in a small involuntary breath, the mouth opens briefly, and a **tiny short-lived chibi flame puff** (warm orange-yellow, no larger than his snout, lasting a fraction of a second) escapes from his mouth and dissipates almost immediately. His eyes widen for a beat in a surprised / sheepish "oh" read — caught off-guard by his own slip. Mouth closes back to the canonical smirk. The whole accident lasts under a second; the rest of the loop is ambient breathing.
- **Expression arc**: smirk → brief widened-eye surprise at the moment of the puff → recovery to smirk (with a hair of sheepish self-correction in the brow — a teenager hoping nobody noticed).
- **Breathing/weight**: Ambient slow breathing baseline. The small chest-hitch at the accident moment reads as one involuntary intake.
- **Secondary motion**: Subtle wing-membrane drift; small ear-spike twitch on the surprise beat. Tail tip flicks once at the embarrassment recovery.
- **Duration feel**: 4s loop with the accident beat at roughly t≈1.5–2.0s.
- **VFX**: ONE tiny chibi flame puff — warm orange-yellow, no larger than the snout, dissipates within a fraction of a second. NOT a flame stream, NOT a sustained breath, NOT a deliberate fire-breath, NOT a fire-breath weapon. Strictly an accidental burp-puff scale.
- **Audio**: Soft small puff sound at the moment of the puff (a tiny `pfft` / soft fwoosh), layered over the ambient breathing baseline.

### I3 — Hiccup Burp (with tiny ember)
- **Action**: Mid-loop, the dragon's chest hitches in a small hiccup — body jolts gently with the hiccup motion — and the mouth opens briefly to release a **small ember puff** (a tiny warm-orange glowing speck rising and dissipating like a single bright spark). The dragon's expression reads slightly embarrassed for a beat — a small head-shake of mild self-amusement — before the mouth closes back to a smug-recovery smirk (the "yeah, that was me, what about it" attitude). Loops back to ambient breathing.
- **Expression arc**: smirk → small hiccup-jolt with closed-eye blink → embarrassed-then-smug recovery smirk with a tiny head-shake.
- **Breathing/weight**: Hiccup is a single sharp chest-jolt on top of the ambient breathing baseline — readable as an involuntary muscle spasm, not a deep breath.
- **Secondary motion**: Folded wings shift fractionally with the hiccup jolt. Tail tip twitches once on the recovery head-shake.
- **Duration feel**: 4s loop with the hiccup-burp beat at roughly t≈2.0s.
- **VFX**: ONE small warm-orange ember speck rising from the mouth and dissipating within a fraction of a second. Glow only — no flame stream, no flame puff. A single bright speck, smaller than the I2 puff.
- **Audio**: A small soft burp-hiccup sound layered over the ambient breathing — read as a hiccup, not a belch.

### I4 — Cough with Soot Puff
- **Action**: Mid-loop, the dragon's chest hitches in a small involuntary cough — body jolts forward slightly with the cough motion — and a **soft small soot / smoke puff** (dark gray-black, no larger than his snout, dissipates within a fraction of a second) escapes the briefly-open mouth. The dragon recovers with a small head-shake and a faintly annoyed brow-furrow ("ugh, again") before the mouth closes back to the canonical smirk. The cough reads as the punchline equivalent of a smoker's morning cough on a juvenile dragon whose fire-stoves are still warming up.
- **Expression arc**: smirk → small cough-jolt with brief brow-furrow → annoyed-but-recovering head-shake back to smirk.
- **Breathing/weight**: Cough is a single forward chest-jolt on top of the ambient breathing baseline. The body recoils a hair with the cough then settles.
- **Secondary motion**: Folded wings shift fractionally with the cough jolt. Dorsal spines along the neck and shoulders ripple briefly with the chest-jolt.
- **Duration feel**: 4s loop with the cough beat at roughly t≈2.0s.
- **VFX**: ONE small dark-gray soot / smoke puff, no larger than the snout, dissipates within a fraction of a second. Soft / soft-edged / chibi-shaped puff — never a smoke plume, never a sustained smoke stream.
- **Audio**: A small soft cough-puff sound (a soft `kff` / muffled cough), layered over the ambient breathing baseline.

### I6 — Smug Mini-Dragon Flame Familiar *(deliberate cartoon-scale show-off — Dragonwitch-P5-style theatrical flame manipulation)*
- **Action**: Mid-loop, the dragon **arches his neck and chin back** in a confident proud chin-up anticipation ("watch this"). His mouth opens and he **puffs out a small cartoon flame that takes the shape of a tiny chibi cartoon flame-dragon** — warm orange-yellow-red hand-painted cartoon flame, miniature wedge-shaped head with two small backswept horn-flicks, miniature folded wings, a long sinuous flame-tail, roughly head-sized in total — a tiny flame-creature that mirrors his own silhouette in fire form. The flame-dragon **flies forward in front of him in a small playful figure-8 / loop pattern** in midair for roughly two seconds, undulating along its path like a tiny living flame familiar. He **tilts his head admiringly** with a smug-knowing connoisseur's smirk and watches his own conjured familiar with eyes tracking its motion (directly mirroring the Dragonwitch P5 inspection beat). The flame-dragon completes its loop, the shape dissolves into a small wisp of warm orange smoke that fades away. He gives a tiny chin-down "yeah, did you see what I just did" satisfied flex recovery, then settles back to canonical with the mouth closed in a deeper smug grin.
- **Expression arc**: canonical knowing smirk → confident proud chin-up anticipation → smug-knowing puff with mouth open → admiring head-tilt connoisseur's smirk with eyes tracking the flame-familiar's path → satisfied chin-down "told you so" flex face on the dissipation → deeper smug recovery smirk → back to canonical.
- **Breathing/weight**: Ambient slow breathing baseline. Chest fills with a deeper inhale during the chin-up anticipation, releases with the conjure puff. Body weight stays planted; the show-off is all head + chest + mouth + tracking eyes.
- **Secondary motion**: Folded wing tips lift a hair on the chin-up anticipation (the "puffed up" read). Head tilts slightly to follow the flame-familiar's loop path. Eyes track the flame-familiar's motion (gaze shifts during the figure-8). Tail tip flicks once during the satisfied recovery like a connoisseur cat.
- **Duration feel**: 6s loop. Conjure puff at roughly t≈1.0–1.8s; flame-familiar figure-8 hold at t≈1.8–4.0s; dissipation at t≈4.0–4.8s; recovery and settle at t≈4.8–6.0s. The extended hold on the figure-8 inspection beat is what sells the "watch what I conjured" read (mirrors the Dragonwitch P5 inspection pause).
- **VFX**: ONE small chibi cartoon flame-dragon familiar — warm orange-yellow-red hand-painted cartoon flame, miniature wedge-shaped head with two small backswept horn-flicks, miniature folded wings, sinuous flame-tail, total size roughly head-sized, undulating along a small figure-8 / loop path in midair for ~2s before dissolving into a wisp of warm orange smoke. Strictly cartoon-scale familiar — NOT a real fire breath, NOT a full-size dragon, NOT a solid flame ball, NOT a flame plume, NOT a sustained flame stream, NOT a flame jet, NOT a fireball, NOT a war-flame, NOT a hero-tier fire-breath, NOT a breath weapon. Reads as a teenager conjuring a tiny flame-mascot to flex, not as combat fire-breath.
- **Audio**: A confident short controlled flame-fwoomp at the moment of the conjure puff (a soft controlled fwoosh, NOT a roar) + a soft warm flame-crackle ambient as the flame-familiar flies its figure-8 path + a small soft fizzle as the flame-dragon dissolves into smoke + a tiny smug satisfied huff at the recovery chin-down beat. Layered over the ambient breathing baseline.
- **Risk note (Stage 3 prompt)**: HIGHEST first-pass generation risk variant. Three distinct VFX risks: (a) the `fire / flame` keyword family pulls combat-scale fire VFX hard; (b) the **mini-dragon shape** is fragile — Seedance may collapse it to a generic flame puff or render a confusingly-sized second full dragon; (c) the **figure-8 / loop motion path** competes with Seedance's default "drift forward and dissipate" prior. Mitigations: (1) explicit miniature-dragon-shape positive scope (`tiny chibi cartoon flame-dragon`, `miniature wedge-shaped head with small backswept horns`, `miniature folded wings`, `sinuous flame-tail`, `roughly head-sized total`, `clearly a flame-creature shape not a generic flame`); (2) explicit shape negation (`not a generic flame puff, not a solid flame ball, not a flame plume, not a fireball, not a second full-size dragon`); (3) explicit motion-path language (`flies in a small playful figure-8 loop pattern in midair`, `undulates along its path`, `tracking eyes follow the loop`); (4) "small flame-familiar" / "cartoon flame-creature" framing throughout to keep the read at flex-scale, not weapon-scale; (5) inspection-hold language to slow Seedance's default "drift and dissipate immediately" prior. Be prepared for shape iteration on v1.

### I5 — Rebellious Side-Glance & Tail Swish *(no accident, pure attitude)*
- **Action**: Mid-loop, the dragon's head **tilts slightly** toward viewer-right and his eyes **track off-camera** in a knowing side-glance (the "yeah, what?" attitude beat) — held for a beat with the smirk subtly deepening. At the same time, his tail tip gives a single slow **bored cat-like swish** (low amplitude, the tip lifting a few inches and settling back near the rear paw on the viewer-right). Then the head and tail return to canonical. No comedic accident; pure rebellious-teen idle.
- **Expression arc**: canonical smirk → smirk deepens slightly + brow lowers fractionally into knowing side-glance → returns to canonical. The deeper smirk and the sideways eye-track carry the attitude; nothing else changes.
- **Breathing/weight**: Ambient slow breathing baseline runs throughout. The head-tilt is a hair of neck rotation; body weight remains planted.
- **Secondary motion**: Subtle wing-membrane drift. One folded wing tip shifts a hair with the head-tilt. Tail-tip swish is the loop's most pronounced secondary movement.
- **Duration feel**: 4s loop with the side-glance + tail-swish at roughly t≈1.5–2.5s.
- **VFX**: None.
- **Audio**: Ambient breathing baseline + a soft small dragging-scale sound from the tail-tip swish across the ground + a faint leathery wing-membrane creak on the head-tilt. No vocalization.

---

## VFX Uplift Audit (per SKILL.md Stage 2.5)
The three comedic-accident variants (I2/I3/I4) each carry a single tiny VFX element by AD design — uplift is NOT applicable. The whole point per AD direction is that the fire/ember/soot is **accidental and small** ("no large flames"). I6 carries a deliberate but **cartoon-scale** flame demonstration — also intentionally bounded; uplift would push it toward war-flame which violates the brief. The VFX across all variants is intentionally minimal.

## Slate Diversity Audit
- **I1** = pure breathing (mandatory baseline)
- **I2/I3/I4** = three distinct comedic-accident shapes (fire puff / ember burp / soot cough) — same family, different beat textures and VFX, "fire isn't under control" register
- **I5** = pure attitude beat (no accident, head-tilt + tail swish) — menacing-teen-bored register
- **I6** = deliberate smug **mini-dragon flame familiar** (cartoon-scale flex, Dragonwitch-P5-style theatrical manipulation) — "watch what I just conjured" register

This gives the team six readable options: one safe, three comedic-accident variants of increasing embarrassment register (puff → ember → cough), one menacing-teen attitude variant, and one deliberate show-off flex.

---

## Approved Selections

> *(To be filled after user review. Default lock will be **I1 (breathing baseline)** plus one or two of I2–I5 depending on which comedic register the team prefers. The team often picks I1 + I2 as the deliverable pair; I3/I4 are alternate variants; I5 is the no-accident attitude variant.)*

### Locked Idle: *TBD*
*Pending user selection.*

### Total Loop Target
- **Duration**: 4s for I1 (breathing baseline); 6s for I2–I6 (gestured variants — the extra two seconds give the comedic-accident / show-off beat room to land cleanly without compressing the canonical recovery hold, and the I6 flame-ring trick specifically needs the longer hold on the inspection beat to read as "cool" rather than a puff that disappears immediately)
- **Loop**: Must seamlessly connect end → start; mouth-open accident/show-off beats return to canonical closed-smirk by loop end (FFLF integrity)
