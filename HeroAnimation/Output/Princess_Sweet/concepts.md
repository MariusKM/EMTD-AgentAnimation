# Animation Concepts — Princess Sweet

> Stage 2 working doc. Concepts are model-agnostic — prompt translation happens in Stage 3.

## Character Context
- Source art (FFLF input): `Source/Heroes Stylized/Princess_Sweet.png` — gentle closed-mouth smile, no neutral variant needed (canonical pose is already a stable resting state)
- Hero description: `Docs/Heroes/Princess_Sweet.md`
- Personality keywords: sweet, kind, gentle, innocent, romantic, graceful, hopeful — with a **hidden tomboy** that surfaces as a brief mischievous beat
- Weapon: single red rose (no literal weapon; rose channels **thorn-vine magic** as her signature power VFX) — held delicately at chest height in her **anatomical right hand**
- Off-hand: open and relaxed at her side (anatomical left)
- Tone direction: jovial / slightly comical (client, 2026-04-16) — Princess Sweet is a **"refined feminine character"** — humor expressed through the *tomboy reveal* (a brief mischievous wink/half-grin layered onto the gentle smile) rather than broad comedy. The "I am the perfect princess... mostly" beat is her warm comedy hook.
- Animation focus: **fairy-tale princess presenting** — soft theatrical with VFX as the visible action, body motion is light and graceful, no combat read.
- Canonical pose for FFLF: **back-three-quarter view** with face turned over the shoulder toward the viewer, gentle closed-mouth smile, blue ball gown flowing in a wide bell silhouette, rose held at chest height in anatomical-right hand (viewer's right side of image), left hand open at her side (viewer's left side of image).

## Hand convention (anatomical, per Seedance/Fat King 2026-04-16 lesson)
- **Anatomical right hand** (viewer's **right** side of image) = **rose**, held delicately at chest height
- **Anatomical left hand** (viewer's **left** side of image) = open and relaxed at her side
- Pose is **back-three-quarter** (back partially toward camera, face turned over shoulder), so viewer-side and anatomical-side **align** for this hero — unlike most other heroes which are front-three-quarter and inverted. Be explicit in prompts regardless: use anatomical terms.

## Always-hold prop rule
- The rose is the only prop. It must remain in her **anatomical right hand at chest height throughout every loop**. Lead the Constraints line in every prompt with `rose stays in right hand always` (short imperative form, per the Fat King 2026-04-16 lesson).
- Rose is intact and not consumed/mutated by any concept — no FFLF prop-integrity trap.

## Chroma constraint (critical for thorn-vine VFX)
- The pipeline keys on a **green chroma background** (CorridorKey + chroma subtract, hardcoded green-channel despill).
- Chroma formula: `strength = G − max(R, B)` — anything where **G dominates both R and B** gets keyed out. Pure bright/lime green vines AND traditional forest green both get eaten (forest green RGB(34,139,34) → G=0.55, max(R,B)=0.13 → strength=0.41 → fully keyed).
- **Vines must be olive/yellow-leaning green** (R roughly equal to G, low B) — reads as a **mature woody thorn-vine** with autumnal-toned leaves. Target palette: olive RGB(130,170,60), khaki RGB(180,180,90), or warm brown stems RGB(90,70,50) with olive leaves. These all survive the keyer because R is high enough that G doesn't dominate.
- Confirmed pattern from Spy P4 (poison vial switched green→purple for the same chroma reason).
- Rose-petal drift (red/pink) is safe — no chroma collision.
- Sparkle/glow accents: pale gold, warm pink, or amber — never spring/lime green.
- Constraints line in every power prompt: `vines are olive yellow-green or warm brown wood color not bright green not lime green not pure green not glowing green not spring green`.
- **Alternative if the client wants the fresh lime-green look from the reference image**: switch to `--alpha gvm` mode in the `/key-clips` step (subject segmentation only, no chroma). Preserves bright green vines but is less reliable on fine VFX trails. Decide on a per-concept basis at Stage 6.

## Roster differentiation note
- Princess Sweet's natural niche is **theatrical no-force where the VFX is the visible power**, with personality beats as the punchline. This slot is currently unoccupied across the locked roster — Architect/Wilhelm/Blacksmith/New King all run on body-driven weapon mechanics. Lean into the niche; don't try to give her a "combat" read she doesn't structurally support.

---

## Power Movement Concepts

> Five concepts proposed across distinct kinetic axes. ⭐ = recommended primary.

### P1 — Rose Presentation & Thorn Bloom ⭐ *(theatrical no-force, signature VFX, spectacular scope)*
- **Weapon action**: From canonical, lifts the rose forward in a slow graceful arc to face height (small wrist-and-forearm motion, no big shoulder commit). Holds the rose presented toward the viewer for a beat. **Olive-green thorn vines burst out from the rose stem in multiple streams** — vines wrap around her wrist and forearm, additional vines arc up around her shoulders and across her back, several extend outward to either side framing her silhouette in a thorn arch. Small purple thorn accents catch the light along the vine network. Held bloom peak (~1s) — vines fully extended around her body in a living thorn-and-rose framing. Then vines **recede back into the rose stem** in a soft retract, dissolving into a fine drift of red rose-petal motes. As the vines pull back, **a brief mischievous half-wink** breaks her gentle smile (tomboy reveal beat), then resolves back into the kind soft smile. Rose returns to chest height. Settles to canonical.
- **Character delivery**: Spectacular reveal → "look what I can do" wink → return. The vines wrap her body like the reference image — wrist + forearm + shoulders + back, a full thorn-armor framing. The wink is the warm comedy hook — the perfect princess showing she has a hidden edge.
- **Timing feel**: Slow lift (~0.8s), vines burst outward across her body (~1s), held bloom peak (~1s), retract into petal drift (~0.8s), wink and settle (~0.4s + ~2s). ~6s total.
- **VFX**: **Olive/yellow-green thorn vines** with small purple thorn accents wrapping her right arm, arcing around her shoulders and back, and extending outward to either side framing her silhouette. **Red rose-petal drift** (5-8 petals) lifting around the retract moment. Soft pale-gold sparkle along the vine path. Strictly no bright/lime/spring green per chroma rule.
- **Secondary motion**: Loose hair strands at the temple lift on the bloom peak; pearl earring catches light on the wink; ruffled dress hem barely shifts (light body motion only); choker stays still; tiara catches a soft gleam at peak.
- **Reference**: Spy (narrative beats / acting — VFX is the action, not body motion). Visual ref image provided by client shows wrist/forearm wrap + back-shoulder vines + soft motes around — match this silhouette closely.

### P2 — Curtsy Bloom *(vertical-down full-body, graceful — distinct from smash)*
- **Weapon action**: From canonical, dips into a **graceful slow curtsy** — left hand lifts the side of her ruffled dress slightly (small lift, doesn't break the silhouette), the rose tips forward in her right hand presenting it downward toward the viewer. As she dips at the bottom of the curtsy, **a spiral of dark forest-green thorn vines twists upward from the floor around her**, rising past her dress hem and dissolving into red rose-petal motes around her shoulders. She rises smoothly back up, vines retract downward and dissolve, settles back into canonical with a kind smile and a small head dip. Brief mischievous half-grin breaks just before the head dip resolves (tomboy reveal beat).
- **Character delivery**: Refined fairy-tale princess making a courtly entrance. The full-body graceful dip differentiates her from any "smash"-axis concept across the roster — same vertical axis but inverted in tone (graceful descent + rising VFX, not heavy slam + dust shockwave).
- **Timing feel**: Smooth dip down (~1.2s), held curtsy with vine spiral peak (~1.2s), smooth rise (~1.2s), tomboy half-grin and settle (~0.4s + ~2s). ~6s total.
- **VFX**: **Dark forest-green thorn vine spiral** rising upward around her body (around the dress, NOT through it), dissolving into a soft cloud of **red rose-petal motes** around her shoulders at peak. Pale gold sparkle on the dissolution. Strictly no bright green.
- **Secondary motion**: Ruffled dress hem flares slightly during the dip and settles on rise; loose hair strands sway with the head movement; tiara catches light on the rise; pearl earring swings slightly.
- **Reference**: New King P7 (Sovereign's Oath — solemn full-body beat with VFX peak), but graceful-courtly instead of solemn-resolute.

### P3 — Blown Kiss & Heart Bloom *(theatrical, strongest comedy beat)*
- **Weapon action**: Slowly raises the rose to her lips in a graceful arc, **brushes the petals against her lips** with a soft eye-close, opens her eyes warmly, then tilts her hand and **blows a soft kiss forward toward the viewer**. As the kiss leaves, a swirl of dark forest-green thorn vines and red rose petals **bloom outward in a brief heart-shape ring** in front of her at chest height — vines forming the outline, petals filling the interior. The heart expands briefly then fades into petal drift. Rose returns to chest height. Settles back with the gentle smile, then a brief **mischievous half-grin breaks** (tomboy reveal beat) and resolves back to the kind smile.
- **Character delivery**: This is the most "Supercell jovial" of the slate — the heart bloom is unapologetically comedy-adjacent without breaking her elegant character. The hidden tomboy lands here as: "I made a heart of thorns. Cute, right?"
- **Timing feel**: Slow rose-to-lips (~1s), held kiss with petal brush (~0.8s), blown-kiss release (~0.4s), heart bloom expansion (~0.8s — vines form ring, petals fill), bloom fade (~0.6s), tomboy grin and settle (~0.4s + ~2s). ~6s total.
- **VFX**: A brief **heart-shaped ring outline** drawn in dark forest-green thorn vines with small purple thorn accents, filled with **red rose petals** that drift outward as the ring fades. Pale-pink sparkle accents around the ring as it forms. Strictly no bright green.
- **Secondary motion**: Hair strands lift on the kiss exhale; pearl earring catches light; ruffled dress hem barely shifts; tiara holds.
- **Reference**: Spy (narrative beats) + Moneybags (theatrical) — the comedy beat IS the hero moment.

### P4 — Forward Vine Lash *(closest to combat read, fallback if you want more "power")*
- **Weapon action**: From canonical, lifts the rose forward at chest height in a fast graceful motion — wrist-driven, no big shoulder commit. **Dark forest-green thorn vines extend rapidly outward from the rose forward toward the viewer**, briefly coiling around an unseen point at arm's length (as if binding an invisible enemy in vines). Vines hold the bind for a beat, then **snap back into the rose** with a small recoil that her wrist absorbs. Brief mischievous half-grin on the snap-back (tomboy reveal beat — "yes I just did that"). Rose returns to chest height. Settles to canonical.
- **Character delivery**: The most "this princess is also a combat hero" read of the slate. Body motion stays light and graceful — the vines do the aggressive work, she stays composed. Closest analog to a forward thrust without her actually thrusting.
- **Timing feel**: Fast graceful lift (~0.5s), vines extend forward (~0.5s), held bind (~0.8s), snap-back retract (~0.5s), wrist-absorb recoil (~0.3s), tomboy grin and settle (~0.4s + ~2.5s). ~6s total.
- **VFX**: **Dark forest-green thorn vines extending forward** from the rose, with small purple thorn accents. Brief **dark purple thorn-spark** at the bind point when vines snap back (NOT bright green spark). Faint red petal drift from the rose during the action. Strictly no bright green.
- **Secondary motion**: Loose hair strands flick on the snap-back; pearl earring catches light; dress hem barely shifts.
- **Reference**: Architect P4 (riposte) — but VFX-driven not blade-driven, and theatrical not refined-fencer.

### P5 — Rose Pivot & Petal Halo *(hand-only "rotational" — careful language required)*
- **Weapon action**: From canonical, brings the rose down in front of her chest and **the rose head pivots slowly between her thumb and index finger** — not a body spin, not a hand twirl, just the **stem rolling between her fingers** so the rose head rotates a half-turn in place. As the rose pivots, **a soft halo of red rose petals lifts off and orbits her wrist briefly** in a small ring. **Dark forest-green thorn vines coil in a tight ring around her forearm** during the petal-halo peak — small purple thorn accents. Petals drift away, vines uncoil and retract into the stem, rose returns to chest height with a gentle smile. Brief mischievous half-grin on the settle (tomboy reveal beat).
- **Character delivery**: Quiet admiration turned into a small magical reveal. "Look closer at my rose" energy. Differentiates from Architect P5 (full-body geometric flourish) and New King P4 (full-arm sword wrist flourish) by staying entirely at the rose-and-wrist scale.
- **Timing feel**: Slow rose-down to chest framing (~0.8s), stem-pivot with petal halo (~1.5s), held vine ring peak (~0.5s), petals drift and vines retract (~0.8s), tomboy grin and settle (~0.4s + ~2s). ~6s total.
- **VFX**: **Red rose-petal halo orbit** around her wrist (small ring, 5-7 petals). **Dark forest-green thorn vine ring** coiled around her forearm at peak. Pale-pink sparkle accents. Strictly no bright green.
- **Secondary motion**: Loose hair strands drift on the settle; pearl earring stays still; dress hem barely shifts.
- **Reference**: Architect P5 (geometric flourish — rotational tradition) but rose-and-wrist scale, not full-body.
- **⚠ Stage 3 prompt-craft warning**: Per Fat Princess P4 (2026-04-23) — Seedance reads `twirl` / `spin` as **full body rotation**, not object-only rotation. This concept must avoid both words entirely. Use phrasing like `the rose stem rolls between her fingers`, `the rose head pivots half a turn in her hand`, `she rotates the rose stem between her thumb and index finger`. Do NOT write `she twirls the rose` or `the rose spins.` Add explicit Constraints clause: `she does not turn or spin her body the rotation is only the rose head pivoting in her fingers`.

### P6 — Thorn Forest Bloom *(spectacle scope, off-screen vine growth + reset)*
- **Weapon action**: From canonical, lifts the rose forward at chest height with a fast graceful motion. As she presents the rose, **thorn vines burst out from the rose stem in multiple streams and grow rapidly outward**, several extending **off the left and right edges of the frame** while others arc up around her shoulders and down past her hips. The vines twist and weave in the foreground, **forming a small dense thorn-forest framing her like a living arch**, with **3-5 small pink-and-red roses blooming open** at points along the vine network as the forest reaches full extension. Holds the bloom peak briefly — she stands serene at the center of her own thorn garden, gentle smile widening as the roses open. Then the entire forest **retracts and dissipates**: vines wither and disintegrate into a soft cloud of red and pink rose-petal motes that drift downward and fade, the bloomed roses dissolve into petal drift, all vines pulling back into her single rose stem. Brief mischievous half-grin on the settle (tomboy reveal beat — "yes, I grew that"). Settles to canonical, the original single red rose intact in her right hand.
- **Character delivery**: Spectacle hero moment — the largest VFX scope of the slate. She does almost nothing physically (small lift + smile + tomboy grin); the **thorn forest IS the power**. Reads as "this gentle princess is actually a powerful thorn-magic conjurer." Closest in feel to the dragonwitch's flame conjure or a high-tier mage hero moment, but expressed through living plant growth instead of magical fire.
- **Timing feel**: Fast graceful lift (~0.6s), explosive vine growth outward across the frame (~1.2s), held forest peak with roses blooming (~1s — the spectacle hold), retract/disintegrate into petal cloud (~1.5s), petals drift and fade (~0.8s), tomboy grin and settle (~0.4s + ~1.5s). ~7s total.
- **VFX**: **Olive/yellow-green thorn vines** with small purple thorn accents extending in multiple directions across the frame, some leaving the frame edges. **3-5 small bloomed roses** in soft pink and red appearing along the vine network. Faint pale-gold sparkle motes throughout. On retract: **red and pink rose-petal cloud** drifting downward as vines disintegrate, fading within ~1s. Strictly no bright/lime/spring green per the chroma rule above.
- **Secondary motion**: Loose hair strands lift on the bloom peak as if caught in a gentle breeze; pearl earring swings; ruffled dress hem flutters at the moment of explosive vine growth and settles on retract; tiara catches a soft gleam at the bloom peak.
- **Reference**: New King P3 (overhead rally with dramatic peak VFX) for the spectacle scaling — but where New King uses sword-and-light, Princess Sweet uses living thorn-and-rose growth.
- **⚠ Generation-risk notes**:
  - **Higher I2V difficulty** than P1-P5. Multiple simultaneous vine paths with off-frame growth + multiple blooming roses + a clean retract is significantly more complex than a single-vine wrap. First-pass may produce: vine count drift, vines that don't fully retract (loop break), bloomed roses that linger past the retract beat, or roses that morph the original stem rose mid-shot.
  - **Loop seamlessness is the structural risk.** The original red rose in her right hand must remain identical at t=0 and t=loop-end (FFLF integrity). The retract must complete cleanly so the final frame is the canonical pose. Constraints line must include: `original red rose in her right hand stays intact and identical throughout, all conjured vines and bloomed roses fully disintegrate and disappear before the loop end, only the original single red rose remains`.
  - **Off-frame growth is unusual for static-camera I2V.** Lead the Subject line with `static camera shot of...` (per Spy P1 lesson). Describe the vines explicitly as `extending past the edges of the frame on both sides` so Seedance doesn't try to zoom out to fit them.
  - **Multiple roses risk count drift.** Specify `3 to 5 small additional roses bloom along the vine network` (range, not exact count) to give Seedance latitude. Distinguish them from the held rose: `the held red rose in her right hand stays the original solo rose` vs `the additional bloomed roses are smaller and appear along the conjured vine network only`.
  - Recommend running this concept **after** P1 (or another simpler concept) lands cleanly, so we have a baseline keyer setup tuned for the vine VFX before testing the spectacle scope.

### P7 — Hand-Cast Vine Spiral *(spell-cast hero beat — addresses art-team feedback 2026-04-28)*
- **Origin**: Art team feedback 2026-04-28 — existing slate (P1-P6) reads cute / soft / passive-spectacle. Princess Sweet needs at least one concept that lands as a **powerful magic-caster hero** despite the cute design. Built per art-team brief: vines come from her hands (not the rose stem) → hold the gather pose ~1s like P4 → she points to the side → vines fast-orbit around her body, pass behind her silhouette, shoot off-screen in the pointed direction → spell-cast feel.
- **Weapon action**: From canonical, both arms lift slightly forward and outward at chest height (right hand still cradling the rose, left hand opening palm-up). **Olive yellow-green thorn vines spiral out from between her fingers around the rose stem (right hand) and from her open left palm simultaneously** — vines emanate from her hands, not from the rose itself. The vines gather in front of her at arm's length forming a hovering thorn-and-leaf cluster, holding the gather pose for ~1s as if she is concentrating power for the cast. Then she **extends her left arm sharply outward to the anatomical-left side** (viewer's left in this back-3/4 view) with index finger pointing — a clear directional spell-cast gesture. **The vines respond instantly: they fast-orbit around her body in a tight ring**, sweeping across the front of her chest, passing behind her silhouette (she partially occludes them at the back of the orbit), then **streaming off the left edge of the frame** in the pointed direction with motion-trail VFX behind them. Petal drift trails the exit. Brief mischievous half-grin on the settle (tomboy reveal beat — "yes, that just happened"). Left arm returns to her side, right hand returns rose to chest height, settles to canonical.
- **Character delivery**: Powerful magic-caster hero beat. The two-handed gather + held concentration pose + sharp directional point + responsive vine orbit + off-screen exit reads as **she is commanding a spell**, not gently presenting flowers. The tomboy half-grin lands at the end as the warm comedy hook (same as other P-concepts), but the power beat is unambiguously hero-grade.
- **Timing feel**: Canonical hold (~0.3s), arms lift + vines spiral out from hands (~0.7s), held gather pose with vines hovering at arm's length (~1s), sharp left-arm side-point (~0.4s), fast vine orbit around body passing behind her (~0.7s), vines stream off left edge with motion trails (~0.5s), petal drift and tomboy half-grin (~0.4s), settle to canonical (~2s). ~6s total.
- **VFX**: **Olive/yellow-green thorn vines** with small purple thorn accents emerging from her hands. **Pale gold or warm amber motion-trail streaks** behind the vines as they orbit and exit (NOT green sparkles). **Red and pink rose petal drift** trailing the off-screen exit. Strictly no bright/lime/spring green per the chroma rule above. No music/orchestral/chime tones in audio (per A6 family 2 lesson on P6).
- **Secondary motion**: Loose hair strands lift on the side-point gesture and settle on the recede; ruffled dress hem flares slightly with the body-weight shift on the point; pearl earring catches light on the half-grin; tiara catches a brief gleam at the gather peak.
- **Reference**: P4 (Forward Vine Lash — held vine pose then return) for the gather-and-hold structure; New King P3 (Defender's Rally — directional-decree gesture with VFX peak) for the side-point command; combined into a multi-beat spell-cast sequence.
- **⚠ Generation-risk notes**:
  - **Audio safety risk** — the spectacular two-hand cast + magical orbit + offscreen exit fits the A6 family 2 mood-music-inference profile (large dramatic VFX moment). Apply preemptively from prompt v1: drop ALL `chime`, `bell`, `tone`, `melodic`, `harmonic` from Sound; drop ALL `warm`, `soft`, `serene`, `peaceful`, `calmly`, `widening calmly` from Action; explicit Constraints ban `no music no orchestral no ambient music no swells no melodic tones no harmonic sounds in audio`.
  - **No "spell" / "cast" / "incantation" nouns** in the Action body (per A6 family 3 — words may cue audio model toward voiceover). Describe the gesture mechanically: `extends her left arm outward and points sharply to her anatomical-left side as a directional gesture`. Notes can call it spell-cast for the human reader; the prompt body avoids the noun.
  - **Vine emanation from hands ≠ body wrap** — vines ORIGINATE at her hands and spiral outward into midair. The orbit around her body passes through midair around her, not contacting her dress or skin. Explicit Constraints clause: `the vines emerge from her hands and orbit through the air around her body but they never touch or wrap her body or her dress`. This avoids A6 family 1 body-contact trigger.
  - **Static-camera prefix** — the off-screen exit is exactly the type of high-motion lateral beat Seedance reads as a camera pan. Lead Subject with `static camera shot of...` and add explicit Constraint `the camera does not pan or follow the vines as they exit the frame the camera stays locked`.
  - **Side-point body discipline** — her body stays in the canonical back-3/4 pose. Only her **left arm extends outward** (with the right hand still holding the rose at chest height). No body rotation, no pirouette, no facing change. Constraints clause: `her body stays in the canonical back-three-quarter pose throughout, only her left arm extends outward to the side for the directional gesture, no body spin no rotation no pirouette no facing change`.
  - **Anatomical-left = viewer-left in back-3/4 view** for this hero (per the Hand convention section above) — so "she points to the anatomical-left side" reads as "she points to viewer's left side of the image" and the vines exit through the left edge of the frame. Be explicit in the prompt to prevent ambiguity.
  - **Loop integrity** — original red rose stays in right hand throughout; left arm returns to relaxed-at-side position before loop end; all vines and motion trails fully exit/dissolve before loop end so FFLF first/last frame match.

### P8 — Crown of Thorns & Radial Wave *(vertical-up axis + radial shockwave — addresses art-team feedback 2026-04-28)*
- **Origin**: Art team feedback 2026-04-28 — slate needs powerful hero concepts. P8 occupies the **vertical/overhead axis** (gather-up, then radial-out) — distinct from P7 (lateral) and P9 (forward).
- **Weapon action**: From canonical, both arms raise smoothly overhead, the right hand lifting the rose high above her head. **Olive yellow-green thorn vines erupt upward from her hands forming a tall hovering thorn-and-rose pillar above her** — like a magical staff or "crown of thorns" floating overhead at twice her height. She holds the **commanding "queen of thorns" pose** for ~1s, standing tall with the magical pillar above her, closed-mouth smile holding firm. Then she brings both arms down sharply and decisively, the pillar bursts apart and the vines **surge outward in a radial shockwave at chest-to-hip level around her body** (in midair, not contacting her body or dress) — vines spreading outward like ripples from a pond. The shockwave dissipates into a cloud of red and pink rose petal motes that expand outward past the frame edges and fade. Brief mischievous half-grin on the settle (tomboy reveal beat — "behold my thorn-magic"). Both arms return to canonical, rose returns to chest height, settles.
- **Character delivery**: Powerful magic-summoning hero beat — the "queen of thorns commanding her magic" moment. The two-stage gather-up + decisive release reads as classic hero invocation. The vertical pillar over her head is the **commanding silhouette** that screams hero, and the radial release is the satisfying "force projection" payoff.
- **Timing feel**: Canonical hold (~0.3s), both arms raise overhead and vines erupt upward into the pillar (~0.8s), held "queen of thorns" pose with pillar standing above her (~1s), arms come down sharply and pillar bursts into radial shockwave (~0.6s), shockwave expands outward and dissipates into petal cloud (~0.7s), petals drift outward and fade (~0.4s), tomboy half-grin and settle (~0.4s + ~1.8s). ~6s total.
- **VFX**: **Olive/yellow-green thorn vines** with small purple thorn accents forming a tall vertical pillar above her head, then bursting outward in a radial wave at body-level. **Pale gold or warm amber sparkle accents** along the vine pillar at peak. **Red and pink rose petal cloud** expanding outward as the wave dissipates, drifting past the frame edges and fading. Strictly no bright/lime/spring green per the chroma rule above. No music/orchestral/chime tones in audio (per A6 family 2 lesson).
- **Secondary motion**: Loose hair strands lift on the overhead reach and settle on the release; ruffled blue dress hem flares slightly with the body weight shift on the arm-down release; pearl earring catches light on the half-grin; tiara catches a brief gleam at the pillar peak.
- **Reference**: New King P3 (Defender's Rally — overhead rally with peak VFX) for the vertical-axis structure; Wilhelm overhead axe for the commanding silhouette. Princess Sweet's version replaces sword/axe with living thorn-magic.
- **⚠ Generation-risk notes**:
  - **Audio safety risk** — large dramatic VFX moment (overhead pillar + radial release) fits A6 family 2 mood-music-inference profile. Apply preemptively from prompt v1 (same as P7): NO `chime`/`bell`/`tone`/`melodic`/`harmonic` in Sound; NO `warm`/`soft`/`serene`/`peaceful`/`calmly` in Action; explicit Constraints ban on music/orchestral/swells; mechanical-sounds-only positive constraint.
  - **No "spell"/"cast"/"incantation"/"summon"** nouns in Action body (per A6 family 3). Describe gesture mechanically: `she raises both arms overhead and brings them down sharply`. Notes can call it "queen of thorns" for the human reader; the prompt body avoids the noun.
  - **Vine emanation from hands ≠ body wrap** — vines erupt upward from her hands into the pillar above her head, then the radial release passes through midair around her body without contacting her dress or skin. Explicit Constraints: `the vines pass through the air around her body but never touch or wrap her body or her dress`.
  - **Body discipline** — body stays in the canonical back-3/4 pose throughout. Both arms raise overhead and come back down, but no body rotation, no pirouette, no facing change. Constraints clause to lock this.
  - **Static-camera prefix** — vertical pillar growth + radial outward expansion is exactly the type of high-motion VFX Seedance reads as a camera tilt-up or pull-back. Lock down up front.
  - **Loop integrity** — original red rose stays in right hand throughout; both arms return to canonical positions before loop end; all vines and petal motes fully exit/dissolve before loop end so FFLF first/last frame match.

### P9 — Forward Bloom Surge *(forward-axis projection at camera — addresses art-team feedback 2026-04-28)*
- **Origin**: Art team feedback 2026-04-28 — slate needs powerful hero concepts. P9 occupies the **forward-axis projection** (cast-at-camera with foreshortening) — distinct from P7 (lateral) and P8 (vertical).
- **Weapon action**: From canonical, brief held pose (~0.4s). Quick **anticipation** — rose pulls back toward her chest in her right hand, left hand pulls in close to her body (both hands gathering inward, ~0.5s). Then she **thrusts the rose forward with conviction toward the viewer** while her left hand simultaneously **rises and pushes palm-forward toward the camera in a two-handed magic-push gesture** (~0.5s). A wave of **olive yellow-green thorn vines and red rose petals SURGES forward from both hands toward the camera**, expanding outward as it travels — large foreshortening on the lead vines that grow toward the viewer, smaller bloom-cloud of vines and petals filling out behind. She holds the **projection peak** with both arms extended forward and the wave filling the foreground (~0.8s). The vines and petal cloud rapidly dissipate outward past the frame edges and fade. Quick retract — both arms come back, rose returns to chest height. Brief mischievous half-grin on the settle (tomboy reveal beat — "did that hit you?"). Settles to canonical.
- **Character delivery**: Most cinematic "she is casting at the viewer" beat on the slate. The two-handed gather-then-thrust reads as a deliberate magical projection. The foreshortening payoff — vines visibly larger at the camera-end — gives the cinematic depth that Wilhelm's overhead axe slam achieves with an axe blade. Princess Sweet's version uses the wave of thorn-magic.
- **Timing feel**: Canonical hold (~0.4s), gather/anticipation pulling rose and left hand inward (~0.5s), forward thrust + palm-push with vines surging forward toward camera (~0.5s), held projection peak with foreshortened vines filling foreground (~0.8s), vines and petals dissipate outward past frame edges (~0.7s), retract and arms return (~0.5s), tomboy half-grin and settle (~0.4s + ~2.2s). ~6s total.
- **VFX**: **Olive/yellow-green thorn vines** with small purple thorn accents surging forward toward the camera with foreshortening — vines visibly larger at the camera-end of the wave. **Red and pink rose petals** filling the bloom-cloud behind the lead vines. **Pale gold or warm amber sparkle accents** along the lead vine tips. Strictly no bright/lime/spring green per the chroma rule above. No music/orchestral/chime tones in audio.
- **Secondary motion**: Loose hair strands lift slightly on the forward-thrust wind; ruffled blue dress hem shifts forward with the body weight transfer on the thrust; pearl earring catches light on the half-grin; tiara holds steady.
- **Reference**: Wilhelm overhead axe slam (foreshortening — blade comes toward camera) for the depth/projection technique; Architect P4 broad-face press (forward extension) for the structural anchor; combined into a magical-projection beat.
- **⚠ Generation-risk notes**:
  - **Audio safety risk** — large dramatic forward-projection VFX fits A6 family 2 mood-music profile. Apply preemptively (same as P7/P8): mechanical Sound only, no chime/musical words, no warm/serene/calmly in Action, explicit music ban.
  - **No "spell"/"cast"/"incantation"/"blast"** nouns in Action body (per A6 family 3). Describe gesture mechanically: `she thrusts the rose forward toward the viewer while her left hand pushes palm-forward toward the viewer`.
  - **No body-contact wording** — vines surge forward from her hands through midair toward the camera. They do not contact her body. Explicit Constraints: `the vines surge forward from her hands through the air toward the viewer and never touch or wrap her body or her dress`.
  - **Forward thrust = camera push-in risk.** Per Spy lesson: phrases like "leans forward toward the viewer" or "thrusts toward camera" are read by Seedance as a camera push-in, not a character gesture. **Critical**: lead Subject with `static camera shot of...` AND add explicit Constraint: `the forward thrust is a character-internal arm motion the camera does not push in or zoom toward the action the camera stays locked`. Foreshortening should be described as a property of the VFX (vines visibly larger at the camera-end of the wave), NOT the camera.
  - **Body discipline** — body stays in canonical back-3/4 pose throughout. Both arms extend forward and return to canonical, but no body rotation, no facing change, no leaning forward (per Spy lesson — leaning forward triggers camera-zoom misread). Constraints clause to lock this.
  - **Loop integrity** — original red rose stays in right hand throughout; both arms return to canonical positions before loop end; all vines and petal motes fully exit/dissolve before loop end so FFLF first/last frame match.

---

## Idle Movement Concepts

### I1 — Breathing Baseline *(mandatory)*
- **Action**: A steady rhythm of calm relaxed breaths through her nose — multiple small soft chest rises and falls visible across the loop. Micro weight shift from one foot to the other once across the loop (very subtle, ball gown silhouette stays stable). Nothing else.
- **Expression**: Held gentle closed-mouth smile, soft warm gaze toward the viewer over her shoulder. Occasional slow blink.
- **Secondary motion**: Loose hair strands at the temple drift gently; one pearl earring sways minutely; ruffled dress hem occasional faint sway; tiara stays still.
- **Duration feel**: 4s steady loop.
- *(Standard mandatory baseline — same shape for every hero. Apply the Architect-2026-04-27 prompt-authoring pattern in Stage 3: specify rhythm + multiplicity in Action and Sound, lead Constraints with `no deep breaths`, avoid `slow deep quiet breaths` phrasing.)*

### I2 — Rose Sniff & Soft Smile
- **Action**: Brings the rose up to her nose in a slow graceful arc, **soft eye-close as she inhales** the scent for a beat, opens her eyes with the smile widening softly (warm contentment), then returns the rose to chest height. Returns to held canonical resting smile.
- **Expression**: Gentle smile → soft eye-close (peaceful) → eyes open warmer → resting smile.
- **Secondary motion**: 1-2 red rose petals drift down faintly during the inhale; loose hair strands shift with the gesture; pearl earring catches light on the rose-down.
- **Duration feel**: 4s loop.
- **Personality**: Pure gentle princess — romantic, hopeful, takes a moment to enjoy something small and beautiful.

### I3 — Tomboy Wink *(hidden personality beat — pure facial micro-acting)*
- **Action**: Held resting smile and forward gaze for ~1s. Eyes flick briefly toward the viewer (head holds), then **a quick mischievous half-grin breaks and a single wink** lands — single beat, ~0.5s. Settles back to gentle resting smile and forward gaze. The hidden tomboy peeks out for one warm comedy beat, then resolves.
- **Expression**: Gentle smile → eye flick → mischievous half-grin + wink → resolves back to gentle smile.
- **Secondary motion**: None on body — purely facial. Loose hair strands drift faintly throughout (ambient).
- **Duration feel**: 4s loop.
- **Personality**: The "hidden tomboy" beat in its purest form — no prop interaction, no body motion, just the brief slip of personality through the perfect-princess mask.

### I4 — Rose Tilt & Admire
- **Action**: She tilts the rose **head a few degrees in her hand** (rose pivots slightly between her fingers — NOT a twirl/spin), head tilts in toward the rose with a small fond smile, holds the admiring beat, then lifts head back to forward gaze with the resting smile. A small comfortable settling exhale.
- **Expression**: Gentle smile → soft admiring smile (head tilted toward rose) → resolves back to forward-gaze gentle smile.
- **Secondary motion**: Loose hair strands sway with the head tilt; pearl earring swings slightly; ruffled dress hem barely shifts.
- **Duration feel**: 4s loop.
- **Personality**: Quiet admiration — romantic disposition, takes a moment with a beautiful thing.
- **⚠ Stage 3 prompt-craft warning**: Same `twirl`/`spin` risk as P5 — use `the rose head tilts a few degrees in her hand` / `she tilts the rose stem slightly between her fingers`. Do NOT write `twirl` or `spin`.

---

## Approved Concepts

> Locked 2026-04-27. User approved the full slate (P1-P6 + I1-I4) for Stage 3 prompt creation.

### Chroma decision
- **Vine palette**: olive / yellow-leaning green (R≈G, low B) — survives the chroma keyer. Reference: olive RGB(130,170,60) / khaki RGB(180,180,90) / warm brown stems with olive leaves. Strictly no bright/lime/spring green.
- Thorn accents: small purple or dark red.
- Petal drift: red and pink (chroma-safe).
- Sparkle accents: pale gold or warm amber, never green.

### P1 scope decision
- **Spectacular** — vines wrap her wrist/forearm AND arc around her shoulders/back AND extend outward framing her silhouette. Match the client reference image silhouette closely. NOT the minimal-scope wrist-only version.

### Power Movements (6 approved)
- **P1 — Rose Presentation & Thorn Bloom** ⭐ — spectacular vine wrap (wrist + back-shoulder + framing arch), tomboy wink reveal
- **P2 — Curtsy Bloom** — graceful curtsy + rising vine spiral peaking in petal motes around shoulders
- **P3 — Blown Kiss & Heart Bloom** — kiss launch + heart-ring of vines and petals
- **P4 — Forward Vine Lash** — fast graceful lift + vines extend forward to bind invisible point + snap back
- **P5 — Rose Pivot & Petal Halo** — rose head pivots between fingers (NOT body twirl) + petal halo orbits wrist + vine ring around forearm
- **P6 — Thorn Forest Bloom** — explosive vine forest off-screen + 3-5 bloomed roses + retract into petal cloud
- **P7 — Hand-Cast Vine Spiral** ⭐ — spell-cast hero beat, vines spiral from her hands + held gather + side-point + fast orbit + off-screen exit (added 2026-04-28 per art-team feedback that the slate lacks "hero feeling")
- **P8 — Crown of Thorns & Radial Wave** ⭐ — vertical-up axis, vines erupt overhead into a "queen of thorns" pillar + decisive arms-down release + radial shockwave outward + petal cloud (added 2026-04-28 per art-team feedback)
- **P9 — Forward Bloom Surge** ⭐ — forward-axis projection, two-handed gather + thrust forward at camera + foreshortened vine wave surging toward viewer + bloom cloud (added 2026-04-28 per art-team feedback)

### Idle Movements (4 approved)
- **I1 — Breathing Baseline** *(mandatory)* — multi-breath rhythm, gentle smile held
- **I2 — Rose Sniff & Soft Smile** — rose to nose + soft eye-close + warm smile widens
- **I3 — Tomboy Wink** — pure facial micro-acting, gentle smile → mischievous half-grin + wink → resolves
- **I4 — Rose Tilt & Admire** — rose head tilts in fingers (NOT spin), head leans in fondly

### Total Loop Target
- **Duration**: 5-7s per concept (P6 may extend to ~7s for spectacle scope)
- **Loop**: Must seamlessly connect end → start (FFLF: rose stays intact in right hand, all conjured VFX disappears before loop end)
