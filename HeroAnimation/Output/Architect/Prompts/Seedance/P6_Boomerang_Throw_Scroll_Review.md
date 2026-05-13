# P6 — Boomerang Throw & Scroll Review (Seedance 2.0)

> Power movement | 7s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Architect.png`
> Concept: [concepts.md](../../concepts.md) — P6 (multi-beat sequence with off-screen elements, user-suggested 2026-04-27)

## Notes for this concept

- **Highest-risk concept in the Architect set** — multi-beat sequence + off-screen blade exit/re-entry + dual-prop coordination (right hand transitions blade-throw → empty-helping-with-scroll → catch). Watch generations carefully.
- **Discrete timecoded beats in Action** — per CLAUDE.md "Seedance defaults to circular motion" rule, multi-beat concepts must enumerate beats with discrete timecode markers so the model doesn't smooth them into one continuous arc.
- **Off-screen blade direction discipline**: blade exits to the **right** of the frame and re-enters from the **left**. Pinned in Constraints. Without this, the blade may leave and return on the same side, or stay in frame, or never come back.
- **FFLF integrity** — blade must end in canonical position across the body in the right hand; bundle must end with three intact coiled scrolls. The mid-loop transitions (right hand empty during scroll review, scroll partially unfurled) MUST resolve by t=loop-end.
- **Section A2 compliance** — `coiled` / `unfurl` / `re-coil` for scroll language, never `rolled` / `unrolls` / `re-roll`.
- **Section A4 retention** — blade noun kept here because the action genuinely IS a weapon-throw beat (combat semantic field is appropriate). Same for the catch beat.
- **Purpose framing** (article B2) — the throw is described as a "sending-the-instrument-to-verify gesture" so the model has a non-combat purpose anchor; the catch as a "retrieval."
- **Closed-mouth FFLF** — smug closed-mouth smirk at start and end, brow-arch verdict in the middle. Mouth stays closed throughout.
- **v2→v3 iteration 2026-04-28** — v2 hit a text-filter rejection (~0.09s inference_time, 500 "Internal Server Error" variant of the silent-content-rejection signature, see `Docs/PromptGuides/Seedance/seedance2_content_flags.md` Section C.1). Suspected trigger: the v2 Beat 3 added loaded face-visibility framing — `his right hand fingers grip the loose end`, `his head and face clearly visible above the upper edge of the parchment`, `his eyes drifting downward toward the diagram`. v3 simplified to neutral language: `his right hand holds the loose end`, `the architect tilts his head down with smug recognition to read the blueprint from above its top edge`. Same scroll-orientation intent (inked face toward camera, architect reads from above), no loaded face/body-positioning vocabulary.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, voice,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, blade returning to wrong hand, blade lost off-screen,
all scrolls unfurling, bundle deforms, blueprint stays unfurled at end,
glasses removed, open mouth, green sparkles, green trail, green VFX,
mantle, cape, cloak
```

---

Subject:     static camera shot of a stocky scholarly architect character with chibi proportions, wearing a large red turban with a long red fabric side-tail draping down his right side, a fully extended brass folding drafting arm rising from the top of the turban, round gold-framed spectacles with a brown frame outer rim, thin waxed black handlebar mustache with curled tips, green tunic with rolled-up sleeves, brown leather cross-body harness with a brass center buckle, brown sturdy leather boots, holding in his right hand a large silver caliper-protractor blade shaped like a draftsman's tool with a wide curved protractor arc as the bottom edge engraved with fine tick marks along its rim, two angular calipered prongs extending forward from the body of the blade, and a circular cutout handle in the body of the blade, weapon-scale, held across his body, and cradling a bundle of three coiled tan parchment scrolls under his left arm, in his canonical pose with mouth closed in a smug smirk

Action:      from his canonical smug closed-mouth smirk the loop unfolds
             as a multi-beat sequence in seven discrete stages.
             First stage from zero to point six seconds his chin lifts a
             small amount and his brow arches over the spectacles in a
             smug down-the-nose look at the viewer.
             Second stage from point six to one point two seconds his
             right hand snaps the silver caliper-protractor blade
             outward to the right with a precise wrist-flick as a
             sending-the-instrument-to-verify gesture and the blade
             exits the frame at the right edge leaving a brief
             brass-gold motion trail behind it on its way out.
             Third stage from one point two to two point four seconds
             his now-empty right hand joins his left arm at the
             parchment bundle and the top scroll partially unfurls
             outward, his right hand holds the loose end of the
             parchment so the unfurled section hangs vertically at
             chest height in front of him with the inked side of the
             parchment turned forward toward the camera so the
             blueprint on the parchment is visible to the viewer, the
             architect tilts his head down with smug recognition to
             read the blueprint from above its top edge, the other two
             scrolls stay coiled and tucked under his left elbow.
             Fourth stage from two point four to three point four
             seconds his chin lifts again and his brow arches higher
             and his closed-mouth smirk widens with smug verdict and
             he gives a small dismissive head-shake as he finishes
             reading the blueprint.
             Fifth stage from three point four to four point two seconds
             the unfurled section coils back up smoothly and tucks back
             into the bundle so the bundle returns to three intact
             coiled scrolls cradled under his left arm exactly as in
             the source.
             Sixth stage from four point two to five point zero seconds
             the silver caliper-protractor blade re-enters the frame
             from the left edge on a smooth return path with a brief
             brass-gold motion trail leading the blade in, and his
             right hand snaps closed in a clean retrieval to catch the
             blade by its circular cutout handle.
             Seventh stage from five point zero to seven point zero
             seconds the blade rotates smoothly across his body to
             canonical position with the curved protractor arc face
             turned forward toward the viewer and his expression
             softens to the held canonical smug closed-mouth smirk.
             Expression arc: smug closed-mouth smirk to arched brow
             with chin lift on the anticipation to focused throw to
             smug recognition during the scroll review to wider smirk
             with verdict head-shake to focused catch to settled smug
             closed-mouth smirk. The brass drafting arm at the top of
             the turban catches light on the chin lift and on the
             catch, the long red turban side-tail flicks once on the
             throw and once on the catch and drifts during the scroll
             review, the curled mustache tips ride the smirk widen.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music, a sharp swift whoosh of the blade leaving on the throw, a soft parchment-paper unfurl crinkle, a soft fabric shift of the green tunic on the verdict head-shake, a soft parchment re-coil crinkle on the tuck-back, a sharp swift return-whoosh as the blade re-enters from the left, a clean wooden-leather snap as the right hand catches the handle, soft cloth rustle of the green tunic and red turban side-tail, a faint metallic ambient shimmer from the blade on the settle, no voice no dialogue no music

Constraints: blade in right hand at start and end, scrolls under left arm always, no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly, the blade exits the frame at the right edge in stage two and re-enters the frame from the left edge in stage six the blade does not exit and return on the same side and the blade does not stay in frame during the middle of the loop, the off-screen path of the blade is implied not shown the camera stays locked on the character throughout, the brass-gold motion trail behind the blade is brief and brass-gold color not green only present on the throw exit and on the return entry, only the top scroll partially unfurls during the loop the other two scrolls stay coiled and tucked under his left arm throughout, the unfurled scroll coils back up completely and tucks back into the bundle by stage five so the bundle returns to exactly three intact coiled scrolls identical to the source by the end of the loop, the silver caliper-protractor blade returns to the right hand at the catch and rotates back across the body to canonical position by the end of the loop with the curved protractor arc face turned forward toward the viewer the full silhouette of the blade including the protractor arc the calipered prongs and the circular cutout handle is clearly visible at the canonical start and end frames and the silhouette never simplifies into a generic sword or spear shape, the gold-framed spectacles stay on his face throughout, mouth stays closed throughout, the turban has a long red fabric side-tail, no blue rim light no environment, seamless loop first and last frame match canonical pose with three intact coiled scrolls under the left arm and the blade across the body in the right hand and mouth closed, 7s
