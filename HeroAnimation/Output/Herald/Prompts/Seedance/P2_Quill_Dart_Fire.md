# P2 — Quill Dart Fire (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/Herald.png`
> Concept: [concepts.md](../../concepts.md) — P2 (homing-projectile read per Silviu's gameplay note)

## Notes for this concept
- **Forward thrust kinetic axis** — fast clean projectile fire-and-return. Static-camera lock is critical because the quill leaves the frame foreground and returns.
- **Single exception to the always-hold rule** — the quill briefly leaves the left hand (~0.5-1s mid-shot) and returns to the same hand before the loop end. Constraints clause locks this explicitly.
- **Re-noun fits**: in this concept the quill IS the weapon, so `quill projectile` / `quill dart` is the correct vocabulary. Avoid `stab` / `pierce` / `strike` — use `marks` / `punctuates` / `flicks against` for the punctuation beat.
- **Open-mouth peak** at the satisfied catch (the wider grin landing on the return).
- **No body lean forward** — Spy lesson: leaning forward triggers camera-zoom misread. The forward thrust is wrist-and-arm only.
- **Black-ink streak VFX** — comet-trail behind the quill on both outbound and return arcs. Chroma-safe.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
push in, dolly, environment, background scenery, talking, lipsync, voice,
sighs, moans, breathy sounds, gasps, vocalizations, realistic proportions,
photorealistic, static frozen image, flat lighting, blue rim light, cyan edge light,
blue edge glow, warped hands, warped face, extra arms, leaning forward toward viewer,
dropping the scroll, dropping the quill permanently, quill in right hand,
scroll in left hand, scroll thrown, scroll moves, green ink streak, lime green VFX,
quill outside left hand at end, body spin, body rotation,
camera following the quill, camera push in, camera zoom toward viewer
```

---

Subject:     static camera shot of a medieval herald messenger character with chibi proportions, slim build, warm tan skin with rosy cheeks, friendly brown eyes, dark brown hair mostly hidden beneath a blue beret hat with a draped tail to one side decorated with a gold circular medallion on the front and a dark red feather to the side, wearing a short blue hooded shoulder cloak with the hood raised behind the head falling to elbow length, a gold-yellow tunic top with ornate scrollwork pattern at the sash, a wide ornate gold belt with embossed scrollwork, a red and gold vertical striped lower section reaching mid-thigh, brown leather boots with buckle details, holding a large blue-grey quill feather pen with a silver nib aloft in his anatomical left hand which is on the viewer's right side of the image, presenting a tan parchment scroll with two red wax seals at chest height in his anatomical right hand which is on the viewer's left side of the image, in his canonical pose with a warm closed-mouth smirk-grin

Action:      from his canonical warm closed-mouth smirk-grin
             (0.0s to 0.3s) brief held canonical with the quill aloft
             and the scroll presented,
             (0.3s to 0.8s) anticipation pull-back as he draws the quill
             back over his anatomical-left shoulder like a small loaded
             dart while the parchment scroll lifts slightly forward in
             his right hand as a presentation guide,
             (0.8s to 1.2s) he flicks his left wrist sharply forward
             and the blue-grey quill leaves his hand traveling rapidly
             toward the right side of the frame with a long trailing
             black ink comet streak behind it as a homing projectile
             beat,
             (1.2s to 1.5s) the quill exits the frame past the right
             edge of the frame leaving the visible image entirely with
             the trailing black ink comet streak fading as the quill
             goes off-screen,
             (1.5s to 2.0s) brief held offscreen beat with no quill in
             the frame his anatomical-left hand stays held aloft in an
             open expectant catching pose his eyes track toward the
             right side of the frame where the quill exited his
             closed-mouth smirk-grin briefly opens into a wider beaming
             open-mouth grin in anticipation of the return,
             (2.0s to 2.5s) the blue-grey quill arcs back into the
             frame from the right edge on a returning trajectory with
             a fresh trailing black ink comet streak and lands cleanly
             back into his anatomical-left hand at its canonical
             triumphant aloft position with a soft catch,
             (2.5s to 3.0s) held canonical pose with the quill caught
             back aloft as the wider beaming open-mouth grin holds in
             a satisfied good-shot expression,
             (3.0s to 6.0s) the open-mouth grin closes back to the
             warm closed-mouth smirk-grin and he settles fully into
             canonical. Expression arc: warm closed-mouth smirk-grin
             -> focused jerky concentration during the pull-back and
             flick -> wider beaming open-mouth grin during the
             offscreen beat and the return catch -> closed smirk-grin
             on the settle. The hat draped tail-tassel snaps on the
             forward flick and settles on the catch, the dark red
             feather flicks dramatically on the wrist motion and on
             the catch, the gold medallion catches light on the
             satisfied wider grin, the blue cloak edge shifts on the
             wrist motion, both feet stay planted.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music no vocalizations, a sharp short whoosh as the quill flicks forward from his hand, a faint dry ink-trail whisper following the quill on the outbound arc as it flies toward the right side of the frame, a brief held silence with only ambient cloth and breath as the quill is offscreen, a sharp short whoosh as the quill arcs back into the frame from the right edge, a soft leathery catch sound as the quill lands back in his palm, a faint metallic tick from the gold medallion on the satisfied grin, no voice no dialogue no music no vocalizations no breathy sounds no sighs

Constraints: quill leaves the left hand briefly during the dart-and-return beat the quill returns to the left hand before the loop end and stays in the left hand for the final settle the quill is never dropped and never held in the right hand, scroll stays in right hand always, no dialogue, no vocal sounds in audio only material and mechanical sounds like quill-feather whoosh ink-trail whisper papery crinkle cloth shift and metallic tick are present in the audio track, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no push in no dolly no tilt no pan, the camera does not pan or follow the quill the camera stays locked the quill exits the frame past the right edge of the frame on the outbound trajectory and returns into the frame from the right edge on the return trajectory, the forward dart is a character-internal arm and projectile motion the camera does not push in or zoom toward the action, the blue-grey quill projectile travels rapidly off the right edge of the frame is briefly fully off-screen for a held beat then returns into the frame from the same right edge on a clean homing arc back to the same left hand it left from, the black ink comet streaks behind the quill are dark black and sepia in color never green never lime green never spring green, the parchment scroll stays held in the right hand at chest height throughout and does not throw or move forward only the quill leaves the hand, the parchment scroll has visible flowing handwritten black-ink calligraphy lines of royal-decree script across the parchment surface throughout the entire loop the parchment is never blank or empty, the parchment scroll's two red wax seals stay intact and at the same positions throughout the entire loop, the warm closed-mouth smirk-grin is the resting expression at the start and end of the loop the wider beaming open-mouth grin is a brief mid-loop expression during the offscreen-beat and the return catch only and closes back to the smirk-grin before the settle, his body stays in the canonical front-three-quarter pose throughout he does not lean forward toward the viewer no body spin no rotation no pirouette no facing change, both feet stay planted, the blue beret hat with the gold medallion and dark red feather stays on his head throughout, all black ink comet streaks fully dissipate and disappear before the loop ends, no blue rim light no environment, seamless loop first and last frame match canonical pose with the warm closed-mouth smirk-grin and the quill aloft in his left hand and the scroll partial-roll in his right hand with both red wax seals visible and the visible canonical calligraphy lines on the parchment and no ink streaks in view, 6s
