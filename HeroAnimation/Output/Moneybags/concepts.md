# Moneybags — Animation Concepts

> Source art: `Source/Heroes Stylized/Moneybags.png` (closed-mouth variant in use as FFLF: `Output/Moneybags/Moneybags_FFLF_0.png`)
> Hero description: `Docs/Heroes/Moneybags.md`
> Personality keywords: cunning, greedy, flashy, calculating, devious, confident, roguish
> Weapon: ornate gold-plated flintlock pistol (right hand, anatomical) + brown leather coin pouch (left hand, anatomical) — **ROSTER EXCEPTION**: compound two-beat power move (coin-bag toss + catch → pistol raise + fire) per client direction 2026-04-22.

## Slate design principle (user direction 2026-05-06)
**Greed bleeds through every concept.** Moneybags' whole character is based on loving money — every power move must visibly involve coins / pouch / wealth as the driver, not just the canonical pouch-toss tacked on. The pistol per Silviu "fires coins from his weapon and unleashes AoE coin attacks using his coin bag" — money is canonically both his ammo and his obsession.

## Hand convention (anatomical)
- **Right hand (anatomical)** = pistol — viewer's left side of image
- **Left hand (anatomical)** = coin pouch — viewer's right side of image

## Vocal direction
Wordless only. Greedy wordless chuckles, smug "mm-hmm" hums, satisfied wordless snort on the pouch-catch, small wordless cackle on the fire moment, contented humming on idle. **For P3 Coin Calamity**: add a tiny strangled wordless whimper / sharp inhale of horror at the calamity beat. Never actual words — the roguish/cunning personality reads through *how* he laughs, not what he says.

## Chroma background
**GREEN chroma (0x00FF00)** — Moneybags has no green clothing and no green VFX (gold-only effects), so green is the correct chroma. FFLF: `Output/Moneybags/Moneybags_FFLF_0.png` (green-background variant). Decision logged 2026-05-06 after a blue-chroma run bled blue tint into P2's slow-motion freeze frame.

## VFX color note
No green VFX (chroma collision). Gold-tinted muzzle flash and gold coin sparkles are safe — gold reads warm-yellow, distinct from green chroma. Grey smoke puffs are safe.

---

## Power Movement Concepts

### P1 — Classic with Coin-Burst Muzzle *(canonical baseline)*
- **Weapon action**: (Beat 1) tosses coin pouch up to mid-frame, catches with smug closed-mouth grin. (Beat 2) right hand swings pistol forward, aims with calculating squint, fires — gold-tinted muzzle flash **spits a small burst of 3-5 gold coins as the projectile** (per Silviu: "fires coins from his weapon"). Coins exit frame; smug satisfied head-tilt; return to canonical.
- **Greedy reading**: Money is doubled in the beat — pouch is the input (catches it lovingly), coins are the output (fires them away, doesn't mind because he's that rich).
- **Character delivery**: Theatrical showcase — slow deliberate toss → satisfied catch → calculating aim → cocky fire → smug return.
- **Timing feel**: ~6s, deliberate, two distinct beats with a clear pause between
- **VFX**: Gold-tinted muzzle flash, 3-5 coin projectile burst, small grey smoke puff
- **Secondary motion**: Feather on beret bobs on the toss + reacts to the shot recoil; coat flap on the pistol-arm swing
- **Kinetic axis**: Multi-beat sequence (axis 5)

### P2 — Coin Shower Volley *(VFX-heavy spectacle, slate-mandatory)*
- **Weapon action**: (Beat 1) tosses coin pouch high — it bursts open mid-air, gold coins begin raining across the full foreground width. (Beat 2) pistol swings up and fires straight upward — single muzzle flash with grey smoke, no coin fountain from the pistol. (Beat 3) at the peak the action ramps into a dramatic slow-motion freeze with 15+ coins drifting in extreme slow motion, then time resumes. (Beat 4) the empty pouch falls back down through the air and Moneybags catches it cleanly in his left hand pulling the drawstring tight (revised 2026-05-06 v3 — pouch must NOT magically reform). All revisions logged 2026-05-06.
- **Greedy reading**: Pure greed-spectacle — he showers himself in his own wealth as the visible power. The coins ARE the power.
- **Character delivery**: Maximum arrogance. Smug closed-mouth grin held throughout the peak. Calculating eyes track the falling coins like he's counting them.
- **Timing feel**: ~7s, theatrical with a sustained held peak
- **VFX**: Coin burst (pouch bursts open mid-air), coin shower (15+ visible at peak from the pouch only), single warm gold-tinted muzzle flash on the upward pistol fire, light grey smoke
- **Secondary motion**: Coat flaps from the upward shot recoil; feather flicks; coins reflect on his beret/coat
- **Kinetic axis**: Vertical-up + spectacle (axes 2+5)
- **Generation risk**: Higher than P1 — recommend running AFTER P1 lands cleanly so chroma/keying tuning is locked. Coin-particle count needs explicit numeric anchor in the prompt.
- **FFLF integrity**: Pouch must reform fully intact in left hand at end; all loose coins fade/exit frame before loop end.

### P3 — Comedic Coin Calamity *(revised 2026-05-06)*
- **Weapon action**: (0.0–4.0s) joyful celebration dance — Moneybags shimmies and bobs in place with his canonical pouch held in his left hand at hip height, firing the pistol carelessly upward into the air twice in celebratory cheer with big smug closed-mouth grins, hips swaying, head bobbing. **Crucially**: as he dances, the pouch (held throughout) leaks coins — coins tumble out of the top of the pouch one or two at a time and fall to the ground around him, leaving a small visible pile. He doesn't notice. (4.0–5.5s) **realization beat** — his eyes catch the pile of coins on the ground around his feet, his joyful grin collapses into a wide-eyed open-mouthed frozen comedic horror, body locks in canonical pose, dance freezes. Eye-darting horror tracks the scattered pile. Tiny strangled wordless whimper. (5.5–7.0s) comedic recovery — the fallen coins on the ground roll back into the pouch on their own with a soft warm gold sparkle, pouch restores intact, smug closed-mouth smirk returns as if nothing happened. Dignity recovered.
- **Greedy reading**: His celebration is so reckless that he literally bleeds money — and the moment he sees it, the joy evaporates. Pure greed comedy.
- **Character delivery**: Joyful celebration → carefree shooting → unaware leak → realization → frozen horror → relief → dignity restored.
- **Timing feel**: ~7s, multi-beat dance + comedic peak
- **VFX**: Two upward muzzle flashes during celebration (no projectile bursts), trail of 6-8 coins visibly leaking from the pouch and tumbling to the ground, small ground-pile of coins, returning-coin sparkle on recovery
- **Secondary motion**: Big feather bobs and flicks during the dance; coat tail swings with the hip-sway; feather slumps on horror beat; perks back up on recovery
- **Kinetic axis**: Multi-beat dance + off-screen recovery (5+6)
- **Pouch always-hold rule**: pouch stays in his anatomical **left hand at all times** — the leak is from the top of the held pouch (carelessly tied, coins escape the dance jostling), not from the pouch leaving the hand
- **FFLF integrity**: pouch must reform fully intact at end, all leaked coins return to the pouch, final smirk must match canonical resting smirk
- **Audio**: jubilant wordless cackles during dance, two pistol cracks, faint metallic coin tinks during the leak (he doesn't hear them over his own celebration), strangled wordless whimper on horror beat, satisfied wordless mm-hmm on recovery

### P4 — Tax Magnet Pull *(revised 2026-05-06 — epic ability move, NO gunshot)*
- **Weapon action**: Pure pouch-channeled spectacle — no pistol fire, pistol stays in canonical raised right-hand position throughout. Three-phase epic ability:
  - (0.0–2.0s) **Wind-up (tension)**: the brown coin pouch in his left hand begins to glow with a building warm gold light, his body tenses into a power-channeling stance — feet plant firmly, shoulders pull back, his calculating eyes narrow with focused intensity, gold light intensifies on the pouch with a rising shimmering hum
  - (2.0–2.5s) **Held pause** — peak of tension, pouch glow at maximum, his expression locked in focused intensity, brief silence before release
  - (2.5–5.5s) **Epic release**: the pouch bursts wide open in a brilliant warm gold flash, an EPIC vortex whirlwind erupts outward and **20+ warm yellow-gold coins materialize in midair orbiting around his entire body** in spiraling arcs at multiple radii, the coins orbit fast and bright catching warm light like a sensational gold whirlwind around him, then the orbit tightens and the coins spiral inward and disappear cleanly into the open pouch one after another in a cascading inward stream, gold sparkle aura around the swollen pouch held at peak, his expression breaks into a victorious smug greedy grin
  - (5.5–6.5s) **Settle**: the pouch closes and shrinks back to canonical size, gold aura fades, body relaxes back to canonical pose, smirk closes back
- **Greedy reading**: This is his hero-ability beat — sensational, climactic. He commands wealth itself. The pouch is the channeling focus, not the pistol.
- **Character delivery**: Tense focus → held intensity → victorious release → settled satisfaction.
- **Timing feel**: ~6.5s with rising tension, sustained orbital peak, tight settle
- **VFX**: Building gold pouch-glow during wind-up, gold burst on release, orbital coin whirlwind (20+ coins at peak orbiting at multiple radii around his full body), inward spiral collapse into pouch, gold sparkle aura, no pistol fire
- **Secondary motion**: Strong feather flick on the burst; coat tails lift outward during the vortex peak (caught in the magical wind); gold light reflects on his beret, coat trim, wrist cuffs throughout
- **Kinetic axis**: No-force theatrical wind-up (6) + spectacle orbital pull (5)
- **FFLF integrity**: pouch must shrink back to its exact canonical size and tied closed by end; pistol stays in canonical raised right-hand position throughout (never moves); vortex fully dissipates
- **Audio**: rising warm gold shimmering hum during wind-up, brief held silence at the pause, sensational warm gold release whoosh, sustained orbital metallic coin clinks, victorious wordless cackle on the peak, soft cloth and pouch settle

### P5 — Coin-Loaded Reload + Coin-Stream Fire
- **Weapon action**: (0.0–1.5s) opens pouch with his left thumb, tilts it, **pours a small stream of gold coins down into the muzzle of the pistol** (per CSV: "loads gun through muzzle") — eyes locked on the loading with miserly precision. (1.5–2.5s) snaps pistol forward, smug satisfied wordless snort. (2.5–4.0s) fires a **horizontal stream of 5-8 gold coins as the projectile** in a spread shot, gold-tinted muzzle flash. (4.0–5.5s) coins exit frame; pouch closes; smug reload-complete head-tilt; return to canonical.
- **Greedy reading**: Literally weaponizing his money — the pistol is a coin-launcher. The reload itself is a greedy beat (he savors loading his gold).
- **Character delivery**: Miserly precision on the loading → cocky on the fire → satisfied head-tilt on the close.
- **Timing feel**: ~5.5s, deliberate-then-snappy
- **VFX**: Coin-pour stream into muzzle (1.5-3 coins visible falling in), horizontal coin-stream projectile (5-8 coins in spread), gold muzzle flash
- **Secondary motion**: Pouch tilt + close motion; feather bob on the snap-up
- **Kinetic axis**: Forward thrust horizontal stream (axis 3)
- **FFLF integrity**: pouch must close and return to canonical position; all loaded coins exit frame as projectiles before loop end

---

## Idle Movement Concepts

### I1 — Breathing Baseline *(mandatory)*
- **Action**: Continuous ambient breathing — chest moves gently and almost imperceptibly throughout in a continuous smooth rhythm. No discrete visible breath events.
- **Expression**: Resting smug closed-mouth smirk — held, not arcing. Calculating dark eyes hold steady.
- **Secondary motion**: Feather on beret drifts almost imperceptibly with the ambient breathing; coat gold trim catches subtle light shifts; occasional natural blink.
- **Duration feel**: 4s steady loop
- **Sound**: `soft natural calm ambient nose-breathing at a slow steady relaxed rhythm`
- **Hands**: Pistol stays raised in canonical right-hand position; pouch stays in canonical left-hand position. No prop fidget.

### I2 — Pouch Heft *(expressive variant — greedy)*
- **Subtle action**: ONE small upward bounce of the coin pouch in his left hand — weighing it greedily, head tilts slightly with the heft (revised 2026-05-06 v2: dropped the second heft to avoid same-motion repetition).
- **Expression**: Calculating with slight brow-arch of greed satisfaction; smirk widens fractionally on each bounce.
- **Breathing/weight**: Small weight shift onto his left foot on each pouch heft.
- **Secondary motion**: Feather drift; faint gold-coin clink in audio.
- **Duration feel**: 4s loop
- **Hands**: Pistol stays in canonical raised position throughout — only the left hand fidgets.

### I3 — Coin Peek *(expressive variant — greedy)*
- **Subtle action**: Pouch and pistol both stay absolutely still — only his head and eyes move. He glances down toward the open top of the pouch greedily, brief calculating brow-arch ("yep, all there") with a tiny inside-pouch gold gleam catching his eye, then a small satisfied head-nod and back to canonical (revised 2026-05-06 v2: removed all pouch-lift / drawstring-pull language because Seedance was reading it as the pouch being lifted by an imaginary string).
- **Expression**: Possessive greedy pride; brief downward glance into the pouch then back up to canonical eye position.
- **Breathing/weight**: Steady upright, no weight shift.
- **Secondary motion**: Tiny gold sparkle from inside the pouch on the peek (light catching coins); feather drift.
- **Duration feel**: 4s loop
- **Hands**: Pistol stays in canonical raised position throughout — only the left hand opens and closes the pouch.

---

## Approved Concept

> *To be filled after user review.*

### Power Movement: TBD
### Idle Movement: TBD
### Total Loop Target
- Duration: TBD
- Split: TBD
- Loop: Must seamlessly connect end → start with FFLF intact
