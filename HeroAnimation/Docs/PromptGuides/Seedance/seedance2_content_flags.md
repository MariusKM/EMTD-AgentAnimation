# Seedance 2.0 — Content Flag Triggers & Workarounds

> **How to use this doc**: Section A lists triggers we have **verified through our own incidents** — every entry has a date, the prompt that hit it, and the rewrite that fixed it. These are load-bearing rules.
>
> Section B lists **unverified external advice** from a third-party article. We have not run controlled tests against any of it, and our incidents have caught patterns that the article does not cover. Treat Section B as **suggestions to try if prompts get rejected after exhausting Section A**, not as established wisdom.
>
> Section C documents the rejection signature so you can identify a content flag fast.
>
> CLAUDE.md "Seedance 2.0 I2V Pitfalls" remains the master reference for all Seedance authoring rules (including non-content-flag pitfalls like garment-noun over-reads, hand convention, etc.). This doc is scoped specifically to **content-flag rejections** — prompts that the safety filter silently kills.

---

## Section A — Project-verified content flag triggers

Every rule in this section was discovered by an actual rejection on an EMTD prompt. Each has the exact symptom, the exact rewrite that fixed it, and the date / hero / concept where we hit it.

### A1. `rolls` / `rolling` for body motion combined with belly/hip/weight-shift
**Discovered**: 2026-04-16 on Fat King I4.
**Symptom**: Phrases like `his body rolls gently to his left` or `heavy rolling rhythm` paired with `belly`, `hip`, or `weight shift` silently rejected. Filter appears to keyword-match the conjunction.
**Fix**: use `sways`, `rocks`, `leans`, or `shifts` for weight-transfer motion. `sways his torso` not `body rolls`. `rocking rhythm` not `rolling rhythm`.

### A2. `roll`-family triggers extend beyond body motion
**Discovered**: 2026-04-27 on Architect P2.
**Symptom**: Prompt used `roll`-family verbs purely for parchment scrolls (`unrolls`, `rolled scrolls` ×3, `rolls back up`, `re-roll crinkle`) — no body motion phrasing — and still hit the same rejection. Filter does not inspect semantic context; it keyword-matches `roll`-family density.
**Fix**: for parchment, scroll, paper, or any roll-shaped object, use **`coil`/`coiled`/`unfurl`/`unfurled`/`re-coil`** as drop-in synonyms. `Three coiled scrolls` not `three rolled scrolls`. `The scroll unfurls and coils back` not `the scroll unrolls and rolls back`.
**Note**: `rolled-up sleeves` (compound phrase for tunic sleeves) has not yet tripped the filter and can stay — but suspect it next if a future rejection appears with otherwise-clean language.

### A3. Negated violence words still trip the filter
**Discovered**: 2026-04-27 on Architect P2; **confirmed extends to idles 2026-05-06 on Diana I2**.
**Symptom**: Defensive Constraints line `not a stab not a strike the parchment is never torn never cut never pierced` (Architect P2) rejected even though every word was negated. Filter does not parse negations; raw tokens (`stab`, `strike`, `torn`, `cut`, `pierced`) register independently. Diana I2 (Sword Shoulder-Tap idle) recurred the failure mode with `not a heavy slap not a strike not a cut against the shoulder` on a benign blade-touch idle — confirms this generalizes to any prompt type, not just non-combat power moves.
**Fix**: never list violence-adjacent words in negation form anywhere in the prompt — power moves, idles, or any prompt type. **Express positively what you DO want.** `the calipers touch the parchment lightly twice the parchment stays fully intact and unmarked throughout` instead of `not a stab not a strike never torn never cut never pierced`. `the two contacts are light gentle touches of the flat broad face of the blade against the fur collar` instead of `not a heavy slap not a strike not a cut against the shoulder`. Same principle applies to weapons, body parts, or any other word family the filter might safety-filter.

### A4. Re-noun weapons as instruments when the action is non-combat
**Discovered**: 2026-04-27 on Architect P2 (third rejection after A2 and A3 cleanups).
**Symptom**: Even with `roll`-family and negated-violence cleaned up, the prompt still rejected. Remaining trigger was a **dense semantic cluster of weapon/violence-adjacent words around a blade-on-parchment action**: `blade` (×6), `tap`/`tap-tap` (×4), `impacts`, `burst` (in `ripple-burst`), `sharp`, `contacts`. The action was semantically a measurement-tap on a paper diagram, but the vocabulary read as combat.
**Fix**: re-noun the weapon as a **measuring instrument** for the specific concept where it isn't being used as a weapon — `silver drafting calipers` instead of `silver caliper-protractor blade`. Replace `tap`/`taps` with `touch`/`touches`. `impacts` → `tick sounds`. `ripple-burst` → `ripple-glow`. Drop `sharp` and `contacts` from action vocabulary.
**Authoring rule**: when a hero's weapon is functioning in a non-combat capacity in a specific concept (a sword being inspected, a hammer resting, a bow being polished, a caliper-blade tapping a diagram), audit whether the weapon-noun + action verbs create a false combat semantic field. If yes, re-noun for that prompt only — keep the weapon-noun in concepts where the action genuinely IS a strike/slash/swing.

### A5. Multi-element em-dash list in Action or Constraints
**Discovered**: 2026-04-27 on Architect P1 (after VFX intricacy upgrade).
**Symptom**: An em-dash-separated list of small noun phrases (`an intricate diagram blooms outward — multiple concentric arcs, two intersecting circles, fine radius lines, tick-mark notches, and a small triangle`) silently rejected even after vocabulary cleanups (`construction` → removed; `compass-and-dividers` → removed; etc.). Three different vocabulary cleanups all kept the rejection. The structural fix worked.
**Fix**: collapse the list into a **single connected descriptive phrase** using conjunctions (`with`, `and`, `, with`). Same content elements survive. `an elaborate ornate diagram trail follows the blade through the arc with many fine layered arcs at smaller radii nested inside the primary sweep, fine tick-mark notches at regular intervals along all the curves, small circles spaced along the trail, short radius lines from a central focal point, and a small triangle of fine line work near the focal point, like a detailed ornate protractor diagram with rich ornamental detail drawn in midair`.
**Authoring rule**: never use em-dash `—` to introduce a list of small noun phrases in Action or Constraints. Em-dash for a single appositive phrase is fine. Connected prose with conjunctions is preferred over enumerated lists.

### A8. The `impact` word family is a standalone trigger, even in legit combat prompts
**Discovered**: 2026-05-06 on Diana P1 Flourish Slash & Fist Pump.
**Symptom**: Architect P2 (A4) first surfaced `impacts` as one component of a dense weapon-action cluster, but Diana P1 isolates `impact`-family density as a **standalone trigger** in an otherwise textbook combat-power prompt. P1 first-pass had `slash impact midpoint`, `slash impact frame` (in secondary motion), `the moment of the slash impact` (Sound), and `fist-impact-air whoosh` (Sound). Same silent rejection signature (COMPLETED, ~0.05s `inference_time`, 400 "error parsing the body"). Same-session P3 Diagonal Upcut Fist Punch — same combat-power kinetic class with battle-cry shout, slash, and fist-punch language but **no `impact` words** — ran cleanly. Confirms `impact` is independently keyword-matched by the filter (same shape as the `roll`-family trigger in A1/A2), regardless of semantic context.
**Fix**: avoid `impact` / `impacts` / `impact frame` / `at the moment of impact` / `fist-impact` / `slash impact` anywhere in any prompt type. Drop-in replacements that worked on Diana P1 v2:
- `slash impact midpoint` → `slash midpoint`
- `slash impact frame` → `slash peak frame`
- `the moment of the slash impact` → `the peak of the slash`
- `fist-impact-air whoosh` → `air whoosh on the fist-pump peak`
- `pops at the slash midpoint` → `appears at the slash midpoint`
- `popping at her knuckles` → `appearing at her knuckles`

**Authoring rule**: avoid `impact` family in every prompt by default — power moves, idles, anywhere. Use `peak` / `apex` / `at the peak` / `appears at` / `air whoosh` instead.

### A6. Output-audio safety rejection (post-generation, not text-filter)
**Discovered**: 2026-04-27 on Princess Sweet P1 v1, then iterated through 2026-04-28 on Princess Sweet P6 v1→v5.
**Symptom**: Different from A1–A5. Video generates successfully (~150–190s `inference_time`), then the result endpoint returns `httpCode: 422` with body:
```
{"detail":[{"loc":["body","generated_video"],"msg":"Output audio has sensitive content.","type":"content_policy_violation","ctx":{"extra_info":{"reason":"partner_validation_failed"}}}]}
```
The text safety filter **passed** (the prompt was accepted, the video was generated), but the **auto-generated output audio** failed a separate partner-validation safety layer. Seedance does not deliver the video when audio rejects, so the visual content is gone — you cannot review what was generated.

**Two distinct trigger families** discovered, each with its own fix recipe:

#### Family 1 — Body-contact + intimate-vocabulary cluster (Princess Sweet P1 v1)
Triggers when the prompt combines a **female character + body-contact VFX (vines wrapping arm/shoulders, ribbon binding, etc.) + warm/soft modifiers in Sound + nose-exhale or sigh items**. The audio model interprets the scene as physically intimate and generates breathy/sigh sounds that the partner validator flags.

**Fix pattern (P1 v1→v2)**:
- **Reframe VFX as midair-only**: vines/ribbons hover in the air around the body without contacting it. `the vines hover in the air around her body and never touch or wrap her body or her dress`. Same spectacular silhouette, no body-contact semantic.
- **Strip Sound to mechanical-only**: drop all `warm`, `soft graceful`, `delicate organic`, `nose-exhale`, `nose-inhale on settled smile` items. Use neutral mechanical vocabulary: `light`, `dry`, `material`, `structural`. Architect's nose-exhale items pass for combat scenes; they reject for princess-vine scenes.
- **Explicit positive Constraint**: `no vocal sounds in audio only material and mechanical sounds like cloth rustle leaf rustle vine creak and papery rustle are present in the audio track`. Doubled with negative bans `no vocalizations no breathy sounds no sighs` at both ends of the Sound line.

#### Family 2 — Mood-music inference cluster (Princess Sweet P6 v1→v5)
Triggers when the prompt has **dramatic spectacle visual (multiple bloomed roses, sprawling VFX, magical-reveal moment) + chime/musical-instrument words in Sound + serene/calm/warm mood modifiers in Action body**. The audio model interprets the scene as a magical-reveal cue and generates orchestral/musical content. The partner validator's audio-safety classifier flags it as music (which violates the `no music` ban).

**Fix pattern (P6 v4→v5)**:
- **Drop ALL chime / musical-instrument words from Sound**: `chime`, `chime tones`, `sustained chime`, `metallic chime`, `bell`, `tone` all class as instruments. Replace with **purely mechanical organic sounds**: `dry papery crackle`, `small soft pops`, `dry organic creak`, `leafy rustle`. Mechanical material sounds carry the same diegetic information without triggering the music classifier.
- **Drop voice-coded and music-coded words even when describing non-vocal phenomena** (extension learned 2026-04-28 on Architect P10 v2). The Architect P10 cascade prompt had Sound items `brass-gold radiance hum` and `sustained crescendo of parchment-paper unfurl crinkles` — describing non-vocal radiance and non-musical paper sounds, but using voice-coded (`hum`) and music-coded (`crescendo`) vocabulary. Audio-safety rejected. P9's near-identical prompt (with `whisper` but no `hum` and no `crescendo`) passed, isolating `hum` and `crescendo` as the triggers. **Rule**: never use `hum`, `humming`, `crescendo`, `decrescendo`, `tone`, `tonal`, `melody`, `melodic`, `harmonic`, `harmony`, `chord` in Sound items, even as descriptors of non-vocal/non-musical phenomena. Replace with neutral neighbors — `radiance hum` → `radiance shimmer` or `radiance glow`; `sustained crescendo of crinkles` → `sustained sequence of crinkles` or just `crinkles`. `Whisper` itself has not yet rejected at the audio safety layer in our incidents (P9's `inscription whisper` passed) but treat it as suspect — prefer `tick-shimmer`, `scratch`, or `fine quill stroke` instead.
- **Drop ALL warm/soft/serene/peaceful/calmly mood modifiers from the Action body** (not just Sound). The audio model reads Action as scene context and shapes audio toward the mood. `she stands serene at the center` → `she stands at the center`. `gentle smile widening calmly` → `closed-mouth smile holding`. `soft warm gleam` → `brief gleam`. `flutters softly` → `shifts`. `explosive vine growth` → `rapid vine growth`.
- **Watch for duplicate Expression-arc / lighting blocks** during multi-edit sessions. P6 v3 still had the OLD `warm widened presenting smile -> peaceful smile` block lingering after v2 added a new clean block. Both were in the prompt simultaneously, so the model still saw all the warm-modifier mood signals. Always grep for orphaned `warm` / `soft` after structural edits.
- **Expand the music ban explicitly**: in Sound and Constraints, add `no music no orchestral no ambient music no swells no melodic sounds no harmonic tones`. The standard `no voice no dialogue no music` is not enough when the visual is magical-spectacular — Seedance's audio model treats `no music` narrowly.
- **Reduce duration if the concept allows**: P6 dropped from 7s → 6s on v5. Less audio time means less opportunity for the model to build to a swell. 6s matches all the other successful power prompts in the Princess Sweet slate.

**Authoring rule**: when designing a princess-class power move with body-contact VFX OR a spectacular magical-reveal beat, **preemptively apply both fix patterns from the start** — don't wait for the rejection to discover this. Specifically:
- Audit the Action body for `warm`, `soft`, `serene`, `peaceful`, `calmly`, `gentle breeze`, `flutters softly`, `explosive`, `widening warmly` and rewrite them as neutral motion verbs.
- Audit the Sound line for `chime`, `bell`, `tone`, `melodic`, `harmonic` and replace with `creak`, `rustle`, `crackle`, `pop`.
- Default to midair VFX (no body contact) for any female-character power move with growing/wrapping VFX.

#### Family 3 — Quoted personality phrases in Action body trigger speech in output audio (Architect P10 v4)
**Discovered 2026-04-28**. Different mode from family 1 and family 2: the prompt **does not reject** at any safety layer (text-filter passed, audio-safety passed). Instead, the **video generates and delivers successfully**, but the auto-generated audio track contains **actual speech** in the output even though Sound and Constraints both ban it.

**Trigger**: a literal quoted personality phrase in the Action body, e.g. `with smug "I have unveiled my masterworks" verdict` or `the architect raises his blade with a triumphant "I have solved it" gesture`. The audio model reads Action as scene context and treats the quoted text as a literal speech cue. The standard Spy ban `no voice no dialogue no music` (bracketed at both ends of Sound, plus `no dialogue` in Constraints) is **insufficient** to override this scene-context cue.

**Fix pattern (P10 v4→v5)**:
- **Drop quoted personality phrases from Action entirely** — express personality through facial expression / pose / posture / head-shake / brow-arch instead. `with smug verdict and a small dismissive head-shake` not `with smug "I have unveiled my masterworks" verdict`.
- **Extend the bracketed Sound ban** beyond the standard Spy ban — `no voice no dialogue no speech no vocalizations no humming no breaths no music` at both ends.
- **Add an explicit positive Constraint** at the front of Constraints (Section A6 family 1 pattern, now extended to verdict-beat scenes): `no dialogue no speech no vocal sounds in audio only material and mechanical sounds like cloth rustle parchment crinkle metallic shimmer and ambient brass-gold shimmer are present in the audio track`.

**Authoring rule**: never put quoted text in the Action body, period. Personality direction belongs in Notes for the human author and in expressive language (smirks, brow-arches, head-shakes, postures) in Action — but never as a literal `"quoted phrase"`. The verdict-beat ban-extension and explicit-positive-constraint should be applied preemptively to any concept with a proclamation / commanding-gesture / triumphant-decree beat, not just princess-class scenes.

---

## Section B — External advice (unverified)

Source: [apidog.com/blog/seedance-2-prompts-avoid-content-flags](https://apidog.com/blog/seedance-2-prompts-avoid-content-flags/) (read 2026-04-27).

> **We have not verified any of these claims through controlled tests.** They are listed here as candidate workarounds to **try if a prompt is rejected after exhausting Section A** — not as proven rules. Note that the article does NOT cover any of the Section A triggers, so it is also not a comprehensive reference; it's one perspective among others.

### B1. Age descriptors
The article reports `boy` / `girl` / `child` / `kid` / `young` / `teen` / `youth` / `juvenile` and numeric ages under 18 trigger heightened safety filters even for innocent activities.

Suggested workaround: describe characters by **role and visual identity** rather than age (`a young boy riding a horse` → `a rider on a gray horse wearing a colorful striped poncho`).

**Project relevance**: low — all EMTD heroes are adult.

### B2. Isolated actions without scene context, purpose, or cinematic framing
The article reports bare action statements (`person fires a rifle into the sky`, `child standing alone in the wilderness`) fail consistently when the model can't tell what kind of scene the action belongs to.

Suggested workaround: wrap actions in **scene context, purpose, and cinematic anchors**:
> the rider raises an old rifle overhead and **fires once into the gray sky as a signal**, the sound echoing across the empty valley, **cinematic, 35mm film grain, 2.39:1 anamorphic**

**Project relevance**: medium-high. EMTD prompts have isolated weapon actions. We already supply scene context via the chroma-background description and the Supercell `Style:` line. We do **not** consistently supply explicit purpose framing (`as a salute`, `as a measured stroke`, `as a presentation gesture`). If a hero prompt rejects without an obvious Section A trigger, **adding a purpose phrase to the weapon action is the first thing to try**.

### B3. Missing cinematic anchoring
The article reports prompts that read as real-world descriptions get evaluated more strictly than prompts that read as film directions.

Suggested workaround: add `wide establishing shot`, `35mm film grain`, `overcast diffused light`, `2.39:1 anamorphic`, etc.

**Project relevance**: low. Our `Style:` line (`Supercell mobile game hero animation, stylized 3D chibi proportions, hand-painted saturated colors, bold outlines, Kingshot visual language`) and our `Camera:` line (`50mm, medium-wide, locked tripod, static, full body centered, eye level`) already function as cinematic anchors for the animation register. We are probably fine on this axis already.

### B4. Backstory and motivation language
The article reports `after years of searching`, `driven by revenge`, `feeling lost and alone` waste prompt budget and add noise.

Suggested workaround: describe what the camera sees, not internal state.

**Project relevance**: low. Our `Expression arc:` lines describe **visible facial-expression beats** (smug smirk → arched brow → settled smug smirk), not internal motivations. We should avoid drifting into motivation phrasing (`he has finally found the flaw`, `smug at the recognition of his own genius`) but we are not currently doing that.

---

## Section C — Rejection signatures (how to identify which kind of rejection fast)

Two distinct rejection modes exist. They are caused by different filters at different stages and have different signatures.

### C.1 — Silent text-filter rejection (A1–A5 family)

Triggered by the **text safety filter** before generation starts. The symptoms in our webapp job log:

- `status: COMPLETED` (not `ERROR` — the filter reports the request as completed)
- `inference_time` ≈ **0.05–0.10 seconds** (instant — no actual generation happened; this is the most reliable signature)
- `logs: []` (empty array — no generation telemetry)
- Result endpoint returns either:
  - `400 {"detail": "There was an error parsing the body"}` (most common), OR
  - `500 {"detail": "Internal Server Error"}` (variant observed on Architect P6 v2, 2026-04-28). The variant 500 signature has the same instant-rejection upstream pattern (~0.09s inference_time, empty logs) — different error code, same content-flag cause.

The `400 "error parsing the body"` and `500 "Internal Server Error"` messages are both **misleading** — neither is an actual API or server failure. They are documented Seedance silent-content-rejection responses. If you see `inference_time` under ~0.10s and an empty `logs` array, it's a text-filter content flag regardless of which HTTP status the result endpoint returns.

When you hit one:
1. Check the prompt against Section A1–A5 first — most rejections we've hit fall under one of those.
2. If no trigger applies, try the relevant Section B suggestion (most often B2 — add purpose framing to the action).
3. If both fail, simplify aggressively — strip Action and Constraints back to a minimal version that we know would pass, then add complexity back one element at a time to bisect the trigger.

### C.2 — Output-audio safety rejection (A6 family)

Triggered by the **partner-validation audio safety layer** after the video has been generated. The symptoms are different:

- `status: COMPLETED`
- `inference_time` ≈ **150–190 seconds** (full generation completed; this is the key distinguisher from C.1)
- `logs: []` (still empty — Seedance does not log audio safety events)
- Result endpoint returns `422 {"detail":[{"loc":["body","generated_video"],"msg":"Output audio has sensitive content.","type":"content_policy_violation","ctx":{"extra_info":{"reason":"partner_validation_failed"}}}]}`

The video was generated but is not delivered — fal does not return the video file when audio validation fails. This means the visual content cannot be reviewed; you only see the prompt + the rejection response.

When you hit one:
1. Check the prompt against Section A6 first — both fix families (body-contact and mood-music) cover the cases we have seen.
2. **The text was fine — do not waste time looking for A1–A5 triggers**. Those are different signatures (httpCode 400 vs 422, inference_time 0.05s vs 150s+).
3. If A6 fixes don't work after 2 iterations, fall back to muting audio entirely on that one prompt by plumbing `generate_audio: false` through the webapp call. Project memory `feedback_audio_sfx_not_silence` says we generally want SFX, but a single P6-class concept with intractable audio rejection is a justified exception — SFX gets added in post via ElevenLabs anyway.

### Worked example — Architect P1 v3→v4 bisection (2026-04-27)

P1 hit two consecutive rejections (v2 and v3) with different vocabulary but the same structural pattern in the Action body. Procedure that worked:

**v2 (rejected)** had: `multiple concentric arcs nested at different radii, two small intersecting construction circles forming a vesica-piscis-style overlap, fine radius lines emanating from a center point, faint tick-mark notches along the curves, and a small geometric construction triangle near the center`

**Step 1 — initial guess: vocabulary**. Suspected `construction` (×2), `compass-and-dividers` (×2), `vesica-piscis`, `constructs itself` based on density and adjacency to weapon-themed words.

**v3 (still rejected)** removed all four suspect tokens but kept the multi-element em-dash list structure. Same rejection signature. Vocabulary alone wasn't the trigger.

**Step 2 — structural bisection**. The thing v2 and v3 both had that v1 (which succeeded) didn't was the **em-dash-separated list of small noun phrases**. v1 was a single connected description. Hypothesis shifted from "specific words" to "structural pattern."

**v4 (worked)** kept all the same content elements (nested arcs, tick-marks, circles, radius lines, triangle) but joined them as connected prose with conjunctions — no em-dash, no list. Single flowing sentence.

**Lesson encoded as Section A5** above. The bisection itself took two failed attempts before the structural pattern became visible — vocabulary cleanup is the obvious first guess but isn't always the answer. When word-level cleanups fail, suspect structure (lists, dense repetition, semantic clustering) before assuming the safety filter is irrational.
