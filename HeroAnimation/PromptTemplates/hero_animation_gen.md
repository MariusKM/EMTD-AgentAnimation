# Hero Animation Prompt Templates (I2V)

> **Pipeline Stage 3** — Translate an approved animation concept into a model-specific generation prompt. These are **Image-to-Video** templates: the source hero PNG is provided as the input image.
>
> **These templates are loose references, not rigid formats.** Every character and animation concept is different — adapt the structure, reorder elements, add or drop sections as the specific animation demands. The goal is to capture the right intent for the model, not to fill in a form.

## Input Requirements
Before using these templates, you need:
1. **Approved animation concept** from Stage 2 (see `animation_concepts.md`)
2. **Hero description** from `Docs/Heroes/<HeroName>.md`
3. **Source image** from `Source/Heroes Stylized/<HeroName>.png`

## Lighting Rule (I2V)

Do **not** describe the lighting of the source frame — that lighting is baked into the source PNG and will transfer automatically. Re-describing it ("warm key light from upper-left", "soft blue rim light", etc.) can introduce a second, conflicting light rig and degrade the result.

Only describe lighting when it is **action-specific and new to the scene**, for example:
- "a blue magic flame ignites in his palm and bathes the face in cold light"
- "the blade ignites with an orange glow that rim-lights the chest and cape"
- "a warm golden spark flares at the sword tip and briefly lights the crossguard"

If no new light source appears in the action, omit lighting phrasing entirely.

## Variables
- `{{approved_concept}}` — The refined concept description from Stage 2
- `{{hero_name}}` — Character name
- `{{weapon_or_item}}` — Primary weapon/item
- `{{secondary_motion_details}}` — Cape, hair, accessories that should react
- `{{vfx_element}}` — The signature VFX (slash trails, particles, glow, etc.)
- `{{timing_feel}}` — Fast/snappy, heavy/deliberate, theatrical, etc.
- `{{expression_arc}}` — How the face changes through the animation

---

> **Aspect ratio rule**: EMTD hero animations are always **`1:1` (square)**. The webapp UI defaults to `1:1`, but the webapp API endpoint `POST /api/jobs/seedance` defaults to `9:16` if `aspect` is omitted — always pass `"aspect": "1:1"` explicitly when calling the API directly.

## Seedance 2.0 — I2V Prompts

> Seedance prompt style and syntax to be refined after first generation tests. Starting structure below.
>
> **Important**: Seedance 2.0 outputs video **with audio**. In the `Sound:` field, always specify character-appropriate SFX (cloth rustle, weapon sounds, impacts, breath, material sounds, etc.) and explicitly ban voice with `no voice no dialogue no music`. **Do NOT write `silence`** — we want SFX in the generation output. The only thing banned is voice-overs, dialogue, lipsync, and music beds. Non-verbal character vocalizations (breaths, gasps, nose chuckles) are allowed.
>
> **Hand convention (critical)**: Seedance interprets `left hand` / `right hand` as the **character's anatomical** hands, not the viewer's left/right of the image. Most hero source art is in a 3/4 view, so the viewer-left side of the image usually corresponds to the character's anatomical right. Before writing any prompt, check the hero doc's `Pose Description` for the anatomical hand assignment (e.g. "scepter in left hand, hip in right hand"). Using viewer-side terms in the prompt causes Seedance to swap the wrong hand onto the wrong object. If the hero doc doesn't specify, derive it from the source PNG and add it to the doc first.
>
> **Avoid over-reading garment nouns**: Seedance collapses `mantle` into a full cape silhouette even when the source art shows a smaller shoulder-fur or ermine neck-piece. Use `scarf`, `stole`, or `fur collar` for small neck-pieces. Same goes for any other garment noun that has larger-silhouette semantics (`cloak`, `robe`, etc.) — if the source shows something smaller, pick a more constrained noun or describe it fully ("white spotted ermine fur around the neck and shoulders").
>
> **Prepend an "always-hold" clause to Constraints if the canonical pose includes a held prop**: for characters whose canonical pose includes a weapon/scepter/tool, lead the `Constraints:` line with a short imperative like `one hand on golden staff always,` or `crossbow stays in left hand always,` (under 7 words, at the very start). This is redundant with the longer "scepter stays upright in X hand throughout never dropped" clause later in the same line, but the redundancy significantly improves adherence when the Action involves expressive beats on the off-hand. Use a simple common noun (`staff`, `hammer`, `bow`) in this clause, even if the hero doc uses a fancier term.

### Starting Point — Power Movement

```
Subject:     {{hero_short_description}}

Action:      {{approved_concept_beats}}. Expression arc:
             {{expression_start}} -> {{expression_peak}} -> {{expression_settle}}.
             {{secondary_motion_details}} react with delayed follow-through.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       {{character-appropriate SFX — weapon sounds, cloth rustle, impacts,
             breath, material sounds}}, no voice no dialogue no music

Constraints: pure green chroma key 0x00FF00 background only, static camera no
             movement or zoom, {{concept-specific negatives folded in here}},
             no blue rim light no environment, seamless loop first and last
             frame match canonical pose, {{Ns}}
```

### Starting Point — Idle Movement

```
Subject:     {{hero_short_description}} in canonical pose

Action:      {{idle_personality_beats}}, subtle breathing, gentle weight shift.
             {{secondary_motion_details}} drift with ambient movement.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       subtle breathing, soft cloth rustle, {{character-specific ambient
             SFX if any — finger taps, accessory jingle, etc.}}, no voice no
             dialogue no music

Constraints: pure green chroma key 0x00FF00 background only, static camera no
             movement or zoom, {{concept-specific negatives folded in here}},
             no blue rim light no environment, seamless loop first and last
             frame identical to canonical pose, 4s
```

### File structure (webapp parsing)

The webapp extractor (`webapp/app/api/jobs/seedance/route.ts`) takes everything **after** the first `---` line and strips `#` heading lines. So each prompt file must follow this layout:

```markdown
# {{Concept title}}

> {{metadata}}

## Notes for this concept
- Human-only notes, iteration warnings, risks

## Negative prompt (reference only — not forwarded by webapp)
(old-style negative list kept here for future webapp support)

---

Subject:     ...
Action:      ...
Camera:      ...
@Refs:       ...
Style:       ...
Sound:       ...
Constraints: ...
```

The webapp does **not** forward a `negative_prompt` parameter. Fold the 2-3 most critical negatives into the `Constraints:` line.

> **Note**: Seedance 2.0 templates are provisional and will likely diverge from these starting points. Update after initial test runs with actual generation results.

---

## Negative Prompt (both models)

```
walk cycle, run animation, jumping, falling, camera movement, camera shake,
zoom, pan, environment, background scenery, talking, lipsync, voice,
realistic proportions, photorealistic, static image, freeze frame,
flat lighting, blue rim light, cyan edge light, blue edge glow
```

---

## Prompt Composition Workflow

1. Start with the approved concept from Stage 2
2. Use the Seedance template above
3. Fill in all variables from the hero description and concept docs
4. Read the filled prompt aloud — does it flow as a continuous description?
5. Cross-check against the model's prompt checklist
6. Review with the user before submitting
7. After generation, document what worked / didn't in `Output/<HeroName>/prompts.md`
