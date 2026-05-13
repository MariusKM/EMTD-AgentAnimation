# Prompt Templates

This directory contains templates for the hero animation pipeline.

## Hero Animation Templates

| Template | Pipeline Stage | Purpose |
|----------|---------------|---------|
| `animation_concepts.md` | Hero Stage 2 | Define power + idle animation concepts (model-agnostic) |
| `hero_animation_gen.md` | Hero Stage 3 | I2V prompt template for Seedance 2.0 |

## Variable Convention

Variables are wrapped in double curly braces: `{{variable_name}}`

## Workflow

1. **Hero Stage 2**: Use `animation_concepts.md` to propose and refine animation ideas with the user
2. **Hero Stage 3**: Use `hero_animation_gen.md` to translate the approved concept into a Seedance prompt
3. **Hero Stage 5**: Document iteration results in `Output/<HeroName>/prompts.md`

See `Docs/Pipeline.md` for the full hero pipeline workflow. Hero pipeline skill: [`/hero-animation`](../../.claude/skills/hero-animation/SKILL.md).
