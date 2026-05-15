---
name: hero-animation
description: Run the hero animation pipeline for a character. Use when starting or continuing animation work on any EMTD hero — walks through character review, animation concepts, prompt creation, generation, and review stages.
argument-hint: <HeroName> [--stage <1-5>]
---

# Hero Animation Pipeline

Produce a hero screen animation for an EMTD character by following the pipeline stages in order.

## Setup

Read these files for context before starting:
- `HeroAnimation/Docs/Pipeline.md` — full pipeline definition
- `HeroAnimation/Docs/StyleGuide_Animation.md` — animation principles and reference analysis
- `HeroAnimation/Docs/StyleGuide_Visual.md` — visual design language

Determine the hero name from `$ARGUMENTS`. If no hero is specified, ask the user which character to work on.

If `--stage` is provided, resume from that stage (assumes earlier stages are complete). Otherwise start from Stage 1.

---

## Stage 1: Character Review

1. Read `HeroAnimation/Docs/Heroes/<HeroName>.md`. Note: the **Character Brief (Client)** section (Hero Screen Animation, Victory Animation, Defeat Animation, etc.) is **inspiration and a rough starting point only** — not a strict spec. Treat it as a signal for tone, personality, and weapon use; feel free to diverge when a stronger idea serves the character.
2. View the source art at `HeroAnimation/Source/Heroes Stylized/<HeroName>.png`
3. **FFLF audit (mandatory)**: check `HeroAnimation/Output/<HeroName>/` for a file named `<HeroName>_FFLF_<n>.png`. The FFLF is the actual first-and-last-frame source image used as I2V input — distinct from the canonical hero PNG which is just visual reference. **If no FFLF file exists, flag it to the user immediately and ask them to create one before continuing.** Do NOT proceed to Stage 4 (generation) without an FFLF on file. The FFLF should match the canonical pose with the resting expression (see the "mouth-closed FFLF variant" lesson in `HeroAnimation/CLAUDE.md` — heroes with extreme canonical expressions need a neutral variant). The `_<n>` suffix has no fixed semantic meaning — it just disambiguates variants (closed-mouth pose, alt expression, alt chroma, etc.) — so read the file or ask the user which variant is canonical for this hero rather than assuming. Surface this audit result to the user as part of Stage 1 review.
4. **Chroma background audit (mandatory)**: determine which chroma background color the prompts will use. **Default = green (0x00FF00) — always — unless the user explicitly says otherwise.** Only switch to **blue (0x0000FF)** when the character has green clothing, green VFX, or a signature in the green/yellow-green/teal hue range (Dragonwitch dragon-flame, Princess Sweet thorn vines, Spy poison VFX, etc. — see `HeroAnimation/CLAUDE.md` "VFX color collision" lesson) **and** the user confirms it. Ask the user during Stage 1: "Will this hero use green chroma (default) or blue chroma (only for heroes with green clothing/VFX)?" Do NOT infer chroma from the FFLF filename — `_FFLF_1.png` does not imply blue (it's often a closed-mouth or alt-expression variant on a green background). Verify by reading the file or asking. Document the decision in the hero's `concepts.md` so all prompt files use the correct chroma.
5. **Hero-archetype audit (mandatory, added 2026-05-06)**: explicitly classify the hero's tonal archetype before proposing any concepts. **Always ask the user during Stage 1**: "Is this hero a **comical/playful** hero (lean hard into the comedy — Spy, Fat King, Fat Princess, Merchant), a **dry-humor / understated** hero (small comedic beats only — General, Wilhelm, Architect), or a **powerful / hero-tier** hero (powerful weighted strikes; comedy comes from confidence — Diana, Princess Sweet, Princess Arrogant, Dragonwitch)?" The classification governs the entire concept slate — comical heroes can have lighter / wackier power moves; powerful heroes need every power concept to read as a hero-tier weapon strike with visible weight (slow heavy committed wind-up → held charged apex → explosive strike → held imperial follow-through → slow regal return per General P6 v3 + Wilhelm P3 patterns). Misclassification causes painful rebuilds: Princess Sweet's first slate read as too cute (rose-sniffing, blown kisses) and was rebuilt around magical-spectacle thorn strikes; Princess Arrogant's first slate read as too haughty-comedy (snap-attitude as a power move) and was rebuilt around imperial-power moves. **Princess-class heroes default to powerful** unless the user explicitly says otherwise — see `HeroAnimation/CLAUDE.md` "Princess-class heroes are POWERFUL FIRST" lesson. The user's archetype answer must be documented in the hero's `concepts.md` Tone direction line and used as the gate for every power concept proposed in Stage 2 — apply the power-move authoring test (Core Rule §1 in `PromptTemplates/animation_concepts.md`): *if you removed the VFX and the weapon, would what's left still read as a powerful strike?*
6. Present the current description to the user and ask:
   - Is the description accurate? Anything to correct or add?
   - Is the prompt fragment capturing the right details?
   - Are there personality nuances we should emphasize for animation?
7. Apply any corrections the user provides
8. Confirm the description is locked before moving on

**Do not proceed to Stage 2 until the user explicitly approves the description.**

---

## Stage 2: Animation Concepts

Reference: `HeroAnimation/PromptTemplates/animation_concepts.md` for the template structure.

### Power Movement
1. Study the existing animation references — read the `.md` companion files in `HeroAnimation/Examples/` (do NOT re-extract frames if `.md` files exist)
2. Propose 3-5 power movement concepts for this character, considering:
   - Their weapon/signature item and how it would naturally be used
   - Their personality (a theatrical character moves differently than a stoic one)
   - What VFX element would be their signature
   - Which reference animation is closest in feel
3. Present concepts to the user for discussion

### Idle Movement
1. Propose 2-3 idle concepts that reflect personality (not generic breathing)
2. Present to the user

### Save Concepts
Once concepts have been proposed, **immediately** save all concepts to `HeroAnimation/Output/<HeroName>/concepts.md` (create the output directory if needed). This allows the user to review and tweak concepts outside the conversation. Update this file whenever concepts are refined.

### Refinement
- Discuss, combine, or rework concepts based on user feedback
- Lock one power concept + one idle concept
- Update the approved selections in the concepts file

### VFX Uplift Pass (added 2026-05-06)
After the user approves the concept slate, audit each power concept's VFX layers for richness and offer an uplift pass before moving to Stage 3. First-pass concepts often describe VFX as a single signature element (`white slash trail`, `golden glow`, `petal drift`); a richer slate layers 3-5 distinct VFX elements per concept (primary trail + spark-burst + secondary peak flash + drifting embers + post-action gleam, etc.). The Diana 2026-05-06 session is the canonical example — user explicitly asked "could you also add VFX to the other concepts as well" mid-Stage-2, and the resulting layered VFX read clearly improved the spectacle quality of the slate.

**When to offer the uplift**: any time the proposed VFX element on a concept reads as "one effect" rather than "a layered effect family." Lean toward offering on power concepts; idles usually do not need VFX uplift (most should be VFX-free per concept template).

**How to apply** (per the Diana pattern):
- For each power concept, propose 2-4 additional layered VFX elements alongside the core signature element
- Examples: spark-bursts at peak velocity moments, expanding light-rings at impact peaks, drifting embers/particles trailing the primary effect, brief blade-aura gleams during recovery, secondary spark-bursts at fist-pump or staff-plant moments
- Keep all augmented VFX in the same color palette as the core signature (white-on-white for slash heroes, golden-on-golden for flame heroes, etc.) to avoid fragmenting the visual identity
- Update `concepts.md` with the augmented VFX descriptions; surface the changes to the user as a slate diff

**Do not proceed to Stage 3 until the user approves both concepts (and the VFX uplift if applied).**

---

## Stage 3: Prompt Creation

Reference: `HeroAnimation/PromptTemplates/hero_animation_gen.md` for starting points (adapt freely — these are loose references, not rigid formats).

1. The generation model is **Seedance 2.0** (via fal-seedance).
2. Read the model-specific prompt guide from `HeroAnimation/Docs/PromptGuides/Seedance/`
3. Compose the I2V prompt using:
   - The approved concept as the core
   - Hero description details for visual accuracy
   - Model-specific syntax and style
   - The source PNG as input image reference
4. **Save each prompt as a separate `.md` file** in `HeroAnimation/Output/<HeroName>/Prompts/<ModelName>/` using the naming convention `<ConceptID>_<ConceptName>.md` (e.g., `P1_Royal_Salute.md`, `I2_Steady_Breath.md`). Create the directory structure if needed.
5. Present the prompts to the user for review
6. Iterate on wording until the user is satisfied — update the prompt files with each revision

**Do not submit for generation until the user approves the prompts.**

---

## Stage 4: Generation

**FFLF re-check before queueing**: confirm `HeroAnimation/Output/<HeroName>/<HeroName>_FFLF_<n>.png` exists. If missing, **stop and flag to the user** — do not generate without an FFLF on file. When queueing through the webapp API (`POST /api/jobs/seedance`), pass the FFLF path explicitly via `startImageRel` (relative to `HeroAnimation/`, e.g. `Output/Count_Wilhelm/Count_Wilhelm_FFLF_0.png`). The endpoint defaults `endImage = startImage` so a single FFLF is enough for symmetric loops; pass `endImageRel` only when start and end frames intentionally differ.

Submit through the webapp UI (`/heroes/[hero]` → Generate) or the webapp API.

### Manual Submission
Provide the user with:
- The finalized prompt (copy-ready)
- The source image path
- Recommended settings (duration, aspect ratio, mode)
- Ask them to place the result in `HeroAnimation/Output/<HeroName>/`

---

## Stage 5: Review & Iterate

1. Once output is available, review it:
   - View the video file directly (or read the existing companion `.md` if available)
   - If the user describes the result, work from their feedback
2. Evaluate against the approved concept and style guide
3. Identify what worked and what needs to change
4. Propose prompt refinements
5. Document findings in `HeroAnimation/Output/<HeroName>/prompts.md`:
   - Prompt version, model used, settings
   - What worked, what didn't, why
   - Specific observations for this character/model combination
6. **If there are major findings** (model-specific quirks, techniques that work well, things to always avoid), add them to `HeroAnimation/CLAUDE.md` under "Known Issues & Learnings"
7. Repeat Stages 3-5 until the animation is approved

### Automatic learning-review pass (mandatory)

**Trigger**: any time the user signals the current pass is "done for now" — phrases like *"these are good for now"*, *"waiting for feedback"*, *"uploaded for review"*, *"we're done here"*, *"good to go"*, *"that's it for this hero"*, *"taking a break on this one"*, etc. Treat the trigger as a soft completion, not necessarily final approval.

**Do not wait to be asked.** As soon as you see the trigger, automatically run the learning-review pass and **report findings in the conversation** without further prompting. The user has explicitly asked for this — it's a recurring annoyance that they have to ask "is there anything we learned?" after every session.

**What the pass covers** — review the session's prompt iterations, generation results, user feedback, and any blockers/workarounds discovered, then produce a report with:

1. **Session-level findings** worth recording in the hero's `Output/<HeroName>/prompts.md` (per-iteration observations, what worked, what didn't, prompt deltas that moved the result).
2. **Major findings** worth promoting to `HeroAnimation/CLAUDE.md` under "Known Issues & Learnings" — model-specific quirks, durable techniques, things to always avoid, new patterns that generalize beyond this hero. Apply the existing bar in that file (concrete, traceable to a specific session, includes the *why*).
3. **Skill / pipeline findings** worth promoting to this `SKILL.md` or the `webapp/docs/*` — anything about the *process* itself (a new mandatory audit, a stage ordering fix, a tool gap). Rare but real.
4. **Nothing to add** — if the pass turns up no new learnings, say so explicitly. A clean "no new findings, the session reinforced existing patterns" is a valid outcome.

Present the report as a short summary first (what's new, what category each finding belongs in), then offer to write the changes. Do not edit `HeroAnimation/CLAUDE.md` or `SKILL.md` without the user confirming the wording — the bar for entries in those files is high and they review each one. The per-hero `prompts.md` is yours to write directly.

---

## Stage 6: Post-Processing (Background Removal + Composition)

The generation models output the character on a **pure green background**. Post-processing strips the green screen and produces deliverable video files with alpha.

### Step 6.1 — Keying (`/key-clips`)
Invoke the `/key-clips` skill on the approved green-screen clip. It wraps the EZ-CorridorKey pipeline (video → EXR → BiRefNet + chroma subtract alpha → CorridorKey inference) with project-tuned defaults: `birefnet+chroma` alpha merge, despill 0.2, all outputs as PNG, temp project auto-deleted.

```bash
cd "<EZ-CorridorKey install dir>" && source .venv/Scripts/activate && \
  python scripts/batch_pipeline.py \
    -i "HeroAnimation/Output/<HeroName>/Animations/<ClipName>.mp4" \
    -o "HeroAnimation/Output/<HeroName>/Animations/<ClipName>"
```

(EZ-CorridorKey install dir defaults to `<parent-of-repo>/EZ-CorridorKey/` per SETUP.md Step 2 / `/setup` skill Stage 5.)

Produces:
```
HeroAnimation/Output/<HeroName>/Animations/<ClipName>/
├── FG/       # Despilled foreground PNGs
├── Matte/    # Alpha matte PNGs
├── Comp/     # Composite preview PNGs
└── Processed/  # Production RGBA PNGs (compose-frames writes final videos to the clip root in 6.2)
```

If BiRefNet struggles on a particular clip, re-run with `--alpha gvm` or bump `--despill` to 0.3–0.5 for heavier spill removal. See the `/key-clips` skill docs for all flags.

### Step 6.2 — Frame Composition
Invoke the `/compose-frames` skill or run the script directly:

```bash
.venv/Scripts/python HeroAnimation/scripts/compose_frames.py \
  "HeroAnimation/Output/<HeroName>/Animations/<ClipName>" --fps 24
```

Or process all clips for the hero at once by pointing at the Animations/ directory:
```bash
.venv/Scripts/python HeroAnimation/scripts/compose_frames.py \
  "HeroAnimation/Output/<HeroName>/Animations" --fps 24
```

Produces three files per clip in `Processed/`:
- `<clip>_fg_alpha.mov` — Final deliverable (PNG codec, alpha channel)
- `<clip>_fg_alpha.mp4` — Preview composited over neutral gray
- `<clip>_comp.mp4` — Comp preview for mask quality check

### Step 6.3 — Quality Check
Review the `_comp.mp4` and `_fg_alpha.mov` outputs with the user:
- Mask cleanly follows the character silhouette
- No green spill on the character
- No edge aliasing or holes
- Loop still connects seamlessly

If issues exist, re-run `/key-clips` with adjusted flags (e.g. `--despill 0.3`, `--alpha gvm`) and then re-run Step 6.2.

---

## Stage 7: Audio (WIP)

Audio generation via ElevenLabs is not yet set up. Flag this as the next step when the post-processed animation is approved and move on to the next character or wait for pipeline setup.

---

## Key Rules

- **Never skip stages** — concepts before prompts, prompts before generation
- **Always get user approval** before advancing to the next stage
- **Document learnings** — the pipeline improves with each character
- **Templates are loose references** — adapt to the specific character and concept
- **Client brief is inspiration** — the Hero Screen / Victory / Defeat animation descriptions in each hero's `Character Brief (Client)` section are rough starting points, not strict specs. Use them as signals for tone and intent; propose stronger ideas when they serve the character better.
- **No blue rim light** — do NOT add "soft blue rim light" / "blue edge light" phrasing to prompts. This was included on earlier animations but the direction has been reversed.
- **Do NOT describe source-frame lighting in prompts** — the source PNG's baked lighting (warm key from upper-left, painted specular, etc.) transfers automatically via I2V. Re-describing it ("warm key light from upper-left", "warm lighting", etc.) introduces a conflicting second light rig. Only describe lighting when it is **action-specific and new to the scene** (e.g. a blue magic flame that ignites and illuminates the character, a blade that glows on a slash).
- **Seedance hand convention = anatomical (character's own left/right), not viewer-side.** Seedance 2.0 interprets "left hand" / "right hand" in prompts as the **character's anatomical** hands — not the viewer's left/right of the image. When writing prompts, look at the source PNG and figure out which hand is which from the character's own perspective (usually requires identifying body orientation in the 3/4 view). Most heroes are in a 3/4 turn where the viewer-left side of the image corresponds to the character's anatomical right. Call out the assignment explicitly in the hero doc's `Pose Description` so prompt authors use the right terms. Example: for Fat King, the scepter is held in his **left** hand (anatomical, viewer's right side of image) and the **right** hand rests on the hip (anatomical, viewer's left side of image).
- **Avoid over-read garment nouns ("mantle" → cape)**: Seedance collapses `mantle` into a full cape silhouette even when the source art shows a small ermine collar or fur shoulder-piece. Use `scarf`, `stole`, or `fur collar` for small neck-pieces. Same risk applies to any garment noun with larger-silhouette semantics (`cloak`, `robe`) — pick a more constrained noun or describe fully ("white spotted ermine fur around the neck and shoulders"). Audit this term choice in the hero doc during Stage 1 before writing prompts.
