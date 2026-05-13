# Empire: Titans & Dragons - AI Art & Animation Pipeline

## Project Overview
This workspace supports **Goodgame Empire: Titans & Dragons** (EMTD), a mobile kingdom-builder game by Stillfront/Goodgame Studios. The game is built on the Rise of Firstborn (ROFB) engine and targets a **Kingshot-inspired visual style** — stylized, vibrant, and character-driven.

Our role is to develop AI-powered pipelines for **2D game art and animation**, primarily hero screen animations, character assets, and unit rank-progression PNGs. This involves creating prompt frameworks for image and video generation models, establishing repeatable workflows, and iterating on visual quality to match the project's art direction.

## Two parallel pipelines

| Pipeline | What it produces | External services | Skill | Browser UI |
|---|---|---|---|---|
| **Hero animations** (`HeroAnimation/`) | Per-hero idle + power animations (transparent `.mov` + delivered WebM 550) | fal-seedance (I2V) → CorridorKey (keying) | [`/hero-animation`](.claude/skills/hero-animation/SKILL.md) | `/heroes/[hero]` in [`webapp/`](webapp/README.md) |
| **Unit progressions** (`UnitProgression/`) | 10-level rank-progression PNG ramps (L1 → L10, 2048×2048) for army units (Archer, Infantry, Cavalry, …) | fal-ai/nano-banana-pro/edit (image edit, 1024 native out) → fal-ai/esrgan @ 2× saved at 2K (default cleanup + dim-bump; NAFNet deblur on the ESRGAN-upscaled raw as fallback) → composite-keeper skill (chain runs at 2K throughout per 2026-05-13 lock) | [`/unit-progression`](.claude/skills/unit-progression/SKILL.md) | Skill / CLI driven (no webapp UI) |

The webapp under [`webapp/`](webapp/) is a single Next.js app that drives the hero animation pipeline from the browser. Unit-progression work is driven via the `/unit-progression` skill, which calls fal directly via the `fal-api-skills` and runs the `composite-keeper` script for the diff-mask noise fix. The webapp treats `HeroAnimation/` as the source of truth for hero artifacts; `UnitProgression/<Unit>/` is the source of truth for per-unit rank progressions. The only persistent state added by the webapp is editorial metadata (locks, ratings, verdicts, notes) in `webapp/data/app.db`. See [`webapp/README.md`](webapp/README.md) for the overview.

### Unit-progression single-input chain rule (LOCKED 2026-05-08)

For the unit-progression pipeline (Archer / Infantry / Cavalry rank PNG ramps): **chained levels send EXACTLY ONE input to `fal-ai/nano-banana-pro/edit` — the prior chain composite.** Earlier the chain also uploaded a second-image `L1_Base.png` scale anchor; that turned out to be the source of visible drift across many generations and is now dropped. The prior composite's own canvas already encodes the locked framing envelope, so framing is preserved without the model conflating reference + content.

L2 sends 1 input (the L1_Base ground-truth as the chain origin). L3..L10 send 1 input each (the prior level's locked composite). Anchored tier-break prompts (rare, optional) send their literal `image_urls` entries as-is.

## Visual Style Reference
The art style follows a **Supercell / Kingshot aesthetic**: chibi-proportioned characters (~3-head-tall), bold outlines, hand-painted textures with digital polish, rich saturated colors, and exaggerated personality-driven poses. See `HeroAnimation/Docs/StyleGuide_Visual.md` for the full style breakdown.

## Workspace Structure
```
Empire Titans/
├── CLAUDE.md                          # This file - project overview
├── HeroAnimation/                     # Hero animation pipeline workspace
│   ├── CLAUDE.md                      # HeroAnimation-specific context
│   ├── Docs/
│   │   ├── Heroes/                    # Per-hero visual description sheets
│   │   ├── StyleGuide_Visual.md       # General visual style guide
│   │   └── StyleGuide_Animation.md    # Animation style guide
│   ├── PromptTemplates/               # Reusable prompt frameworks for generation
│   ├── Source/
│   │   └── Heroes Stylized/           # Source character art (16 heroes + variants)
│   └── Examples/                      # Animation reference videos (.mov)
├── UnitProgression/                     # Unit rank-progression pipeline workspace
│   ├── Archer/                        # Per-unit dirs: README + CLAUDE + Refs/L1_Base.png + Prompts/ + out/v<N>/
│   ├── Infantry/                      # Same structure (10 levels + L9.5 bridge)
│   └── Cavalry/                       # Same; locked composite-only chain
└── webapp/                            # Next.js webapp driving the hero animation pipeline
    ├── README.md                      # Overview + quick start
    └── docs/                          # architecture, conventions, api, workflows
```

## Key Conventions
- **Hero references**: Each hero has a dedicated description in `HeroAnimation/Docs/Heroes/` that can be injected into prompts
- **Prompt templates**: Reusable prompt skeletons live in `HeroAnimation/PromptTemplates/`
- **Source images are reference, not generated**: The PNGs in `Source/Heroes Stylized/` are the canonical character designs provided by the art team
- **Output format**: Animations are delivered as transparent-background `.mov` files with SFX only (no VO/lipsync)

## Working With This Project
When assisting with prompt creation or iteration:
1. Always reference the style guide (`StyleGuide_Visual.md`) for visual consistency
2. Load the specific hero / unit description from `HeroAnimation/Docs/Heroes/<HeroName>.md` (heroes) or `UnitProgression/<Unit>/CLAUDE.md` + `<Unit>.md` (units) for character-specific work
3. Follow the animation guide (`StyleGuide_Animation.md`) for motion and timing direction
4. For unit-progression work, read `UnitProgression/Archer/CLAUDE.md` first (authoritative shared rules) then the per-unit deltas in `Infantry/CLAUDE.md` or `Cavalry/CLAUDE.md`. Run via the `/unit-progression` skill.
