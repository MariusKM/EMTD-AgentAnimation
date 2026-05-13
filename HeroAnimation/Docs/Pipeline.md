# Hero Animation Pipeline

> This document defines the end-to-end workflow for producing hero screen animations.

## Overview

The pipeline is **Image-to-Video (I2V)** — we feed the canonical hero source art as the input image and generate animated video from it. The workflow is collaborative and iterative, with the user involved at each decision point.

**Critical constraint**: The source PNG serves as both the **first and last frame** of the animation. The character must begin and end in their canonical pose as depicted in the source art. All motion — power movement and idle — must depart from and return to this exact pose to create a seamless loop.

**Duration constraint**: Generated video length must be a **whole number of seconds** (4s, 5s, 6s, etc.). Power movement minimum is **6 seconds**, idle minimum is **4 seconds**, maximum for both is **15 seconds**. Power and idle are **separate animation loops**, each generated independently.

## Pipeline Stages

### Stage 1: Character Review
**Goal**: Ensure the hero description is accurate and complete before any animation work begins.

1. Load the hero's description doc from `Docs/Heroes/<HeroName>.md`
2. Load the source art from `Source/Heroes Stylized/<HeroName>.png`
3. Review the description against the source art together with the user
4. Polish and fine-tune: correct any inaccuracies, add missing details, refine the prompt fragment
5. Confirm the description is locked for this character

**Output**: Finalized hero description doc

---

### Stage 2: Animation Concepts
**Goal**: Define what the character will do in their animation before writing any generation prompts.

Create two sets of concepts:

#### Power Movement Concepts
- Propose 3-6 concept ideas for the character's signature action
- Each concept should describe: the action, timing, emotional arc, and VFX element
- Reference the animation style guide (`Docs/StyleGuide_Animation.md`) and per-character notes
- Reference existing animation descriptions in `Examples/` for quality benchmarks
- **Slate must include at least one VFX-heavy spectacle concept** (added 2026-05-05) — large element count, off-frame VFX growth, held peak where the VFX is the visible power. Required even for bureaucratic, stoic, or comedic characters; body motion can stay personality-appropriate while the VFX carries spectacle. See `PromptTemplates/animation_concepts.md` Core Rules §6 for the full rule and reference exemplars.

#### Idle Movement Concepts
- Propose 2-3 concept ideas for the idle/breathing loop
- Each concept should describe: the subtle motion, personality expression, secondary motion details

#### Concept Refinement
- Walk through concepts with the user
- Refine, combine, or discard based on feedback
- Lock one power concept and one idle concept

**Output**: Approved animation concept (documented in the character's task file)

---

### Stage 3: Prompt Creation
**Goal**: Translate the approved concept into generation-ready prompts for the chosen model.

1. The generation model is **Seedance 2.0** (via fal-seedance).
2. Load the prompt template from `PromptTemplates/hero_animation_gen.md`
3. Compose the prompt by combining:
   - Hero description / prompt fragment
   - Approved animation concept
   - Visual style tokens from `Docs/StyleGuide_Visual.md`
   - Animation tokens from `Docs/StyleGuide_Animation.md`
   - Model-specific syntax and best practices from `Docs/PromptGuides/`
4. Create separate prompts for power movement and idle movement (these are independent loops)
5. Review prompts with the user before submission

**Output**: Finalized prompts ready for generation

---

### Stage 4: Generation
**Goal**: Submit prompts and produce video output.

**Aspect ratio for EMTD hero animations is always `1:1` (square).** The webapp UI defaults to `1:1` correctly, but the webapp API endpoint `POST /api/jobs/seedance` defaults to `9:16` if `aspect` is omitted — **always pass `"aspect": "1:1"` explicitly when calling the API directly**.

**Option A — Webapp UI**: open `/heroes/[hero]`, pick the prompt + FFLF, click Generate.

**Option B — Webapp API** (Seedance):
```bash
curl -s -X POST http://localhost:3000/api/jobs/seedance \
  -H "Content-Type: application/json" \
  -d '{"heroId":"<HeroName>","conceptId":"<P1>","promptFile":"<P1_Name.md>","duration":6,"aspect":"1:1","tier":"pro","startImageRel":"Output/<HeroName>/<FFLF>.png","endImageRel":"Output/<HeroName>/<FFLF>.png"}'
```

**Option C — Manual submission**:
- User copies the prompt and source image to Seedance 2.0 directly
- User downloads the result and places it in `Output/<HeroName>/`

---

### Stage 5: Review & Iterate
**Goal**: Evaluate the generated animation and refine until quality targets are met.

1. Review the generated video directly
2. Evaluate against the style guide and approved concept:
   - Does the motion match the concept?
   - Is the character visually consistent with the source art?
   - Are VFX elements present and well-timed?
   - Is secondary motion (cape, hair, accessories) natural?
   - Does the loop connect seamlessly?
   - Are there any artefacts or quality issues?
3. Document findings — what worked, what didn't, and why
4. Refine the prompt based on findings
5. Re-generate and re-review until approved
6. **Document any major findings or model-specific learnings to `CLAUDE.md`** for future reference

**Output**: Approved animation + documented learnings

---

### Stage 6: Post-Processing (Background Removal + Composition)
**Goal**: Strip the green-screen background from the approved animation and produce deliverable video files with a proper alpha channel.

Seedance outputs the character on a **pure green background** (0x00FF00). We then run post-processing to remove the background and produce the final deliverables.

This stage uses the **`key-clips` skill** (headless EZ-CorridorKey wrapper) to produce four PNG frame sequences per clip:
- **FG** — Despilled foreground PNGs (RGB)
- **Matte** — Alpha matte PNGs (grayscale)
- **Comp** — Composite preview PNGs (for checking mask quality)
- **Processed** — Production RGBA PNGs

#### Step 6.1: Keying (`/key-clips`)
Run the `key-clips` skill on the approved green-screen clip. The skill wraps the EZ-CorridorKey pipeline (video → EXR frames → BiRefNet + chroma subtract alpha hint → CorridorKey inference) and writes PNGs directly into a target folder named after the clip. Defaults are tuned for EMTD heroes: `birefnet+chroma` alpha merge, despill 0.2, project folder auto-cleaned after the run.

```bash
cd "<EZ-CorridorKey install dir>" && source .venv/Scripts/activate && \
  python scripts/batch_pipeline.py \
    -i "HeroAnimation/Output/<HeroName>/Animations/<ClipName>.mp4" \
    -o "HeroAnimation/Output/<HeroName>/Animations/<ClipName>"
```

(EZ-CorridorKey install dir defaults to `<parent-of-repo>/EZ-CorridorKey/` per SETUP.md Step 2 / `/setup` skill Stage 5.)

Output layout:
```
Output/<HeroName>/Animations/<ClipName>/
├── FG/
├── Matte/
├── Comp/
└── Processed/        # Populated by key-clips with RGBA PNG frames; compose-frames writes final .mov/.mp4 to the clip root in Step 6.2
```

#### Step 6.2: Frame Composition
Run the `compose-frames` skill or directly invoke the script to assemble the frame sequences into final video files:

```bash
.venv/Scripts/python HeroAnimation/scripts/compose_frames.py \
  "HeroAnimation/Output/<HeroName>/Animations" \
  --fps 24
```

Or for a single clip:
```bash
.venv/Scripts/python HeroAnimation/scripts/compose_frames.py \
  "HeroAnimation/Output/<HeroName>/Animations/<ClipName>"
```

This produces three files per clip in `<ClipName>/Processed/`:

| File | Format | Purpose |
|------|--------|---------|
| `<clip>_fg_alpha.mov` | PNG .mov with alpha | Final deliverable with transparency |
| `<clip>_fg_alpha.mp4` | H.264 MP4 over gray | Preview (character composited over neutral gray BG) |
| `<clip>_comp.mp4` | H.264 MP4 | Comp sequence for mask quality review |

**Note**: `compose_frames.py` composites RGBA frames over a neutral gray (0x808080) background in Python before encoding the MP4. This avoids ffmpeg filter-graph instability and produces the same visual content as the `.mov` on a gray backdrop.

**Audio is preserved by default**: `compose_frames.py` automatically muxes the audio track from the original raw Seedance `<ClipName>.mp4` sitting next to the clip directory into all three outputs (PCM s16le in the `.mov`, AAC 192k in the `.mp4`s). This means the SFX generated by the video model (weapon sounds, cloth rustle, impacts, etc.) survive keying and composition. Pass `--no-audio` to force silent outputs. If the source has no audio track, the script silently falls back to silent outputs and logs a note.

#### Step 6.3: Quality Check
Review the `_comp.mp4` and `_fg_alpha.mov` to verify:
- Mask cleanly follows the character silhouette
- No green spill visible on the character
- No edge aliasing or holes in the matte
- Loop still connects seamlessly after keying

If issues exist, re-run `/key-clips` with adjusted parameters (e.g. `--despill 0.3` for stubborn green spill, or `--alpha gvm` if BiRefNet struggles on a specific clip) and then re-run Step 6.2.

---

### Stage 7: Audio (WIP)
**Goal**: Layer on additional / replacement sound effects beyond what Seedance produces natively.

Note: the audio pipeline is partially live already — Seedance generates SFX at the video layer, and `compose_frames.py` (Step 6.2) muxes that audio through to the final deliverables. Stage 7 is about augmenting or replacing those baked SFX with higher-quality ElevenLabs-generated sounds.

- Pipeline: ElevenLabs for SFX generation
- Requirements: SFX only, no voice-over, no lipsync
- This stage will be defined after the video/animation pipeline is validated

---

## File Organization Per Hero

```
Output/<HeroName>/
├── concepts.md                        # Approved animation concepts (from Stage 2)
├── Prompts/
│   └── Seedance/                      # Seedance 2.0 prompt files (one per concept)
│       ├── P1_Royal_Salute.md
│       └── I1_Watchful_King.md
├── Animations/                        # Generated clips + post-processing (Stage 4-6)
│   ├── <ClipName>.mp4                 # Raw generation output (green screen)
│   ├── <ClipName>/                    # Per-clip post-processing directory
│   │   ├── FG/                        # Despilled foreground frames (key-clips)
│   │   ├── Matte/                     # Alpha matte frames (key-clips)
│   │   ├── Comp/                      # Composite preview frames (key-clips)
│   │   ├── Processed/                 # RGBA keyed PNG frames (key-clips)
│   │   ├── <ClipName>_fg_alpha.mov    # compose-frames output (clip root)
│   │   ├── <ClipName>_fg_alpha.mp4
│   │   └── <ClipName>_comp.mp4
│   └── ...
├── final_power.mov                    # Approved final power loop (with alpha)
├── final_idle.mov                     # Approved final idle loop (with alpha)
├── final_power_audio.mov              # After Stage 7
└── final_idle_audio.mov               # After Stage 7
```

## Key Principles

- **User is involved at every decision point** — no autonomous generation without approval
- **Concepts before prompts** — get the idea right before optimizing the prompt
- **Document everything** — learnings feed back into the pipeline for future characters
- **Model-agnostic concepts** — animation concepts are written independently of the generation model; prompts are model-specific translations of those concepts
- **Reference animations are internal guidance only** — the examples in `Examples/` inform our understanding of timing, motion quality, and personality. They must never be referenced in generation prompts — the video generation model has no context about other animations
