# P4 — Architect's Riposte (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Architect.png`
> Concept: [concepts.md](../../concepts.md) — P4 (refined fencer's forward thrust, cleanest weapon beat)

## Notes for this concept

- **Forward-thrust axis with refined timing** — same family as Fat King P6 / New King P6 / Fat Princess P3, differentiated by **wrist-driven snap** (no shoulder commit) and **smug down-the-nose** chin-lift anticipation. Fencer's riposte, not heavy thrust.
- **Camera-zoom misread guard** — Seedance reads "leans forward toward viewer" as a zoom-in (per CLAUDE.md Spy lesson). Phrase the lean as character-internal: "his upper body commits an inch forward with the thrust." Lock down with `static camera` prefix and explicit constraints.
- **Blade silhouette preservation — fix attempt 1, 2026-04-27 (insufficient on its own)** — added explicit silhouette geometry to the Subject line (`wide curved protractor arc as the bottom edge engraved with fine tick marks, two angular calipered prongs extending forward, circular cutout handle in the body of the blade`). Hypothesis was that the model lacked a strong prior for "caliper-protractor blade" and a stronger geometry description would anchor it. **Result**: the model still morphed the silhouette into a generic spearhead at the thrust peak. Subject geometry alone is not sufficient when the action foreshortens the broad face away from camera. Geometry description retained as a baseline anchor (it doesn't hurt) but the structural fix is the broad-face reframing in attempt 2.
- **Blade silhouette preservation — fix attempt 2, 2026-04-27 (broad-face presentation)** — reframed the action from a tip-first thrust to a **broad-face press**: the blade extends forward but with the curved protractor arc face turned toward the viewer, so the full silhouette (protractor arc + calipered prongs + circular cutout handle) stays presented flat to the camera throughout. This both prevents the foreshortening that lets the model substitute a generic blade shape AND plays better with the "I have measured you" personality beat — presenting the protractor face is more on-character than a tip-first stab. Action and Constraints both updated: Action describes "presses... with the curved protractor arc face turned toward the viewer and the full broad face presented flat to the camera throughout"; Constraints adds "the silver caliper-protractor blade is presented broad face forward toward the camera throughout the press... the full silhouette... remains clearly visible to the camera at every moment of the loop and the blade silhouette never simplifies into a generic sword or spear shape." Verb changed from "thrust" to "press" to reinforce the broad-face read (thrust implies tip-first; press implies broad surface contact). Brass-gold pulse VFX repositioned from "blade tip" to "along the protractor arc edge" to match the new broad-face orientation.
- **Brass-gold light pulse** glows briefly along the curved protractor arc edge of the blade on the press peak — not a sustained beam. Color is **brass-gold** (NOT green).
- **Anatomical hand discipline** — blade in **right hand**, scrolls under **left arm**. Both stay locked.
- **Closed-mouth FFLF** — smug closed-mouth smirk holds. Personality lives entirely in the chin-lift anticipation and the dismissive settle.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, voice,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the blade, scrolls unrolling, scroll bundle deforms,
glasses removed, open mouth, green sparkles, green light, green VFX,
mantle, cape, cloak
```

---

Subject:     static camera shot of a stocky scholarly architect character with chibi proportions, wearing a large red turban with a long red fabric side-tail draping down his right side, a fully extended brass folding drafting arm rising from the top of the turban, round gold-framed spectacles with a brown frame outer rim, thin waxed black handlebar mustache with curled tips, green tunic with rolled-up sleeves, brown leather cross-body harness with a brass center buckle, brown sturdy leather boots, holding in his right hand a large silver caliper-protractor blade shaped like a draftsman's tool with a wide curved protractor arc as the bottom edge engraved with fine tick marks along its rim, two angular calipered prongs extending forward from the body of the blade, and a circular cutout handle in the body of the blade, weapon-scale, held across his body, and cradling a bundle of three rolled tan parchment scrolls under his left arm, in his canonical pose with mouth closed in a smug smirk

Action:      from his canonical smug closed-mouth smirk his chin lifts a
             small amount and his brow arches over the spectacles in a
             smug down-the-nose look at the viewer, he holds the smug
             beat for a moment, then he presses the silver
             caliper-protractor blade forward in a precise wrist-driven
             and forearm-only measurement-display gesture with the
             curved protractor arc face of the blade turned toward the
             viewer and the full broad face of the blade presented
             flat to the camera throughout the press so the protractor
             arc and the calipered prongs and the circular cutout
             handle all remain clearly visible to the camera, the
             blade extends forward at chest height as a refined
             "I have measured you" gesture, his upper body commits a
             small amount forward with the press as a character-internal
             motion, a brief brass-gold light pulse glows along the
             curved protractor arc edge of the blade and fades within
             a moment, he holds the forward-extended pose with a smug
             stare past the blade at the viewer, then he pulls the
             blade back smoothly to canonical position with a small
             dismissive head-shake, his upper body returns to canonical,
             and his expression softens to the held canonical smug
             closed-mouth smirk. Expression
             arc: smug closed-mouth smirk -> arched brow with chin lift
             and smug down-the-nose look on the anticipation -> held
             smug stare down the blade on the thrust -> dismissive
             head-shake on the retract -> settled smug closed-mouth
             smirk. The brass drafting arm at the top of the turban
             catches light on the chin lift, the long red turban
             side-tail flicks once on the snap thrust and settles, the
             rolled scrolls shift minimally with the slight forward
             weight transfer and settle, the curled mustache tips ride
             the dismissive head-shake, the gold-framed spectacles catch
             a sharp gold reflection on the chin lift.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music, a soft refined nose-inhale on the chin lift, a swift whoosh of the blade through the air on the press, a thin metallic shimmer as the brass-gold light pulses along the protractor arc edge, soft cloth rustle of the green tunic and red turban side-tail, a small dismissive nose-exhale on the settle, no voice no dialogue no music

Constraints: caliper blade in right hand always, scrolls under left arm always, no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly, the press is a character-internal arm motion his upper body commits a small amount forward but the camera does not move or zoom or push in or dolly, the blade extends forward through the frame the camera stays locked, the silver caliper-protractor blade is presented broad face forward toward the camera throughout the press with the curved protractor arc face turned toward the viewer the full silhouette of the blade including the protractor arc the calipered prongs and the circular cutout handle remains clearly visible to the camera at every moment of the loop and the blade silhouette never simplifies into a generic sword or spear shape, the brass-gold light pulse glows briefly along the curved protractor arc edge of the blade not a sustained beam color is brass-gold not green, the silver caliper-protractor blade stays in his right hand throughout, the bundle of three coiled scrolls stays cradled under his left arm throughout fully intact, the gold-framed spectacles stay on his face throughout, mouth stays closed throughout, the turban has a long red fabric side-tail, no blue rim light no environment, seamless loop first and last frame match canonical pose with mouth closed, 6s
