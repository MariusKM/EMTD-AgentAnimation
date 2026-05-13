# P3 — Royal Proclamation Flourish (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Herald.png`
> Concept: [concepts.md](../../concepts.md) — P3 (overhead theatrical announcement, vertical-up + no-force theatrical axis)

## Notes for this concept
- **No quoted speech in Action body** — the temptation is huge ("hear ye, hear ye!" is the literal client direction) but per Architect P10 v4 lesson (2026-04-28) literal quoted phrases cue the audio model to generate actual speech. Express the announcement beat through expression and pose only.
- **No `proclaim`/`proclamation`/`announce`/`announcement`/`declare`** as nouns in the Action body — these may cue audio model toward voiceover. The concept name calls it Proclamation for the human reader; the prompt body uses `ceremonial pose` / `ceremonial gesture`.
- **Extended audio ban** — verdict-beat scene per Architect lesson. Use the full extended ban: `no voice no dialogue no speech no vocalizations no humming no breaths no music`.
- **Audio safety pre-emptive** — large dramatic VFX moment (overhead glyph fan burst) fits A6 family 2 mood-music profile. Drop ALL `warm`/`serene`/`peaceful` Action modifiers; explicit Constraints ban on music/orchestral.
- **Open-mouth peak** at the theatrical climax (mid-shout expression).
- **Both arms extended simultaneously** — left arm overhead with quill, right arm forward with scroll. Both return to canonical before loop end.
- **No `roll` family** — golden royal-decree shimmer along the scroll edge, not "rolls along the edge."

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, tilt up, environment, background scenery, talking, lipsync, voice,
sighs, moans, breathy sounds, gasps, vocalizations, humming, speech,
realistic proportions, photorealistic, static frozen image, flat lighting,
blue rim light, cyan edge light, blue edge glow, warped hands, warped face,
extra arms, dropping the quill, dropping the scroll, quill in right hand,
scroll in left hand, green letterforms, lime green sigils, glowing green VFX,
orchestral music, ambient music, melodic tones, choir, swells,
body spin, body rotation, camera tilt up, camera following the glyphs
```

---

Subject:     static camera shot of a medieval herald messenger character with chibi proportions, slim build, warm tan skin with rosy cheeks, friendly brown eyes, dark brown hair mostly hidden beneath a blue beret hat with a draped tail to one side decorated with a gold circular medallion on the front and a dark red feather to the side, wearing a short blue hooded shoulder cloak with the hood raised behind the head falling to elbow length, a gold-yellow tunic top with ornate scrollwork pattern at the sash, a wide ornate gold belt with embossed scrollwork, a red and gold vertical striped lower section reaching mid-thigh, brown leather boots with buckle details, holding a large blue-grey quill feather pen with a silver nib aloft in his anatomical left hand which is on the viewer's right side of the image, presenting a tan parchment scroll with two red wax seals at chest height in his anatomical right hand which is on the viewer's left side of the image, in his canonical pose with a warm closed-mouth smirk-grin

Action:      from his canonical warm closed-mouth smirk-grin
             (0.0s to 0.4s) brief held canonical pose,
             (0.4s to 1.1s) his anatomical left arm raises the
             blue-grey quill straight overhead in a slow theatrical
             arc to a fully extended overhead position while
             simultaneously his anatomical right hand thrusts the tan
             parchment scroll forward and slightly upward at chest
             height in a ceremonial pose with both arms extended,
             (1.1s to 2.3s) held theatrical peak with both arms fully
             extended his head tilts slightly back and his smirk
             briefly opens into a wide beaming open-mouth grin as a
             cluster of approximately six to eight small black-ink
             letterform glyphs and quill-script symbol motifs bursts
             upward and outward from above the scroll in a fan shape
             with two or three small golden royal-decree sigils mixed
             in including a small crown sigil a small quill-and-scroll
             motif and a small flourish curl as the official
             ceremonial elements,
             (2.3s to 2.9s) the floating glyphs and golden sigils drift
             outward and start to fade with a faint golden shimmer
             along the edge of the scroll throughout the peak,
             (2.9s to 3.6s) both arms return smoothly to canonical
             positions with the quill back at its triumphant aloft
             position and the scroll back at chest height in a partial
             coiled state, the open-mouth grin closes back to the warm
             closed-mouth smirk-grin,
             (3.6s to 6.0s) settles fully into canonical pose with all
             ink glyphs and golden sigils fully faded and gone.
             Expression arc: warm closed-mouth smirk-grin -> theatrical
             ceremonial focus during the arms-up arc -> brief wide
             beaming open-mouth grin with chin lifted at the peak ->
             closed smirk-grin on the settle. The hat draped
             tail-tassel lifts on the overhead arm raise and settles
             on the return, the dark red feather catches light at the
             peak, the gold medallion gleams at the climax, the blue
             cloak collar barely shifts, both feet stay planted.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no speech no vocalizations no humming no music, a soft cloth rustle of the blue cloak as both arms extend outward to the ceremonial peak pose, a brisk papery crinkle as the parchment scroll lifts forward at chest height, a faint dry papery whisper as the floating ink glyphs burst outward in a fan, a small metallic tick from the gold medallion at the peak beat, a soft cloth shift of the cloak as the arms return to canonical, no voice no dialogue no speech no vocalizations no humming no breaths no music

Constraints: quill stays in left hand always, scroll stays in right hand always, no dialogue no speech no vocal sounds in audio only material and mechanical sounds like cloth rustle papery crinkle dry papery whisper and metallic tick are present in the audio track, no music no orchestral no ambient music no swells no melodic tones no harmonic sounds no choir, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no tilt up no tilt down no pan, the overhead arm raise and the ceremonial pose are character-internal arm motions the camera does not tilt up to follow the glyphs the camera stays locked, the floating glyphs and golden sigils are black ink letterforms and golden royal sigils only never green never lime green never spring green never glowing green, approximately six to eight floating ink letterforms and two to three small golden sigils appear in the fan burst at the peak, the parchment scroll's two red wax seals stay intact and at the same positions on the scroll throughout the entire loop and the seals are not the same as the floating sigil motifs the floating sigils are separate VFX elements in midair, all floating ink letterforms and golden sigils fully fade and disappear before the loop ends only the canonical scroll and quill remain at the final frame, the warm closed-mouth smirk-grin is the resting expression at the start and end of the loop the wide beaming open-mouth grin is a brief mid-loop ceremonial peak only and closes back to the smirk-grin before the settle, both arms return to canonical positions before loop end with the quill aloft in the left hand and the scroll at chest height in the right hand, no body spin no rotation no pirouette no facing change his stance stays in the canonical front-three-quarter pose throughout, both feet stay planted, the blue beret hat with the gold medallion and dark red feather stays on his head throughout, no blue rim light no environment, seamless loop first and last frame match canonical pose with the warm closed-mouth smirk-grin and the quill aloft in his left hand and the scroll partial-roll in his right hand with both red wax seals visible and no floating glyphs or sigils in view, 6s
