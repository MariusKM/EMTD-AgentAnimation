# Cavalry L9_5 — Variant Review Notes

**Unit**: `Cavalry`
**Level**: `L9_5`
**Version**: `v3`
**Locked**: not yet

## Implementation

This file is user feedback on the variants generated for **Cavalry L9_5** (version **v3**). It's saved to disk so the `unit-progression` skill can pick it up by path.

**Prompt to revise**: `Cavalry/Prompts/cavalry_edit_L9_to_L9_5.json`

**Suggested workflow:**
1. Read each variant's verdict + adds checklist below.
2. Identify patterns across variants — if 3 of 4 missed the same add, it's a prompt issue (rewrite that section). If 1 of 4 missed it, it's likely a sampling miss (re-roll with a fresh seed).
3. Rewrite the relevant sections of the prompt JSON to address the patterns. Common fix locations: `EDIT GOAL` paragraph, `L9_5 NEW ADDS` block, `PRESERVE FROM ... EXACTLY` block, `NEGATIVE — DO NOT` block.
4. Bump the prompt's `_meta.history` with a one-line entry citing this feedback file (e.g. `"vN+1 (YYYY-MM-DD): rewrite per feedback at <this path>"`).
5. Re-fire generation per the `/unit-progression` skill recipe (with a new `vN+1` to keep the prior batch as audit, or same `v3` to overwrite).

For Cavalry-specific drift patterns, vocab risks, and pose/framing anchors, read `UnitProgression/Cavalry/CLAUDE.md` and `UnitProgression/Archer/CLAUDE.md` (authoritative shared rules).

## Adds at this level (3)

- **L9_5-1** GOLD-SPIKED FIN CAPS — at the apex of each L9 backswept fin, ADD a small pointed buttery polished yellow gold spike CONE (~1.5 inches tall, ~0.7 inch wide at the base, tapering to a sharp point at the tip).
- **L9_5-2** GOLD CROSS EMBLEM ON CUIRASS CHEST — add a four-armed gold CROSS centered on the L7 cuirass's medial ridge, sitting at the center of the chest at sternum height.
- **L9_5-3** FINS GROW TALLER AND MORE SHARPLY CURVED — extend the L9 ~5-inch backswept fins UPWARD to ~7-8 inches tall, and increase their backward+outward curvature so each fin reads more sharply hooked at the trailing tip.

## Variant verdicts

### v1 · seed 351595902

### v2 · seed 351595903

### v3 · seed 351595904

### v4 · seed 351595905
