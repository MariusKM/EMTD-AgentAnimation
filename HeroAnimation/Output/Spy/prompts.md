# Spy — Prompt Findings (Stage 5)

> Per-concept observations from the 2026-04-16 Seedance 2.0 generation run. The Seedance prompt files in `Prompts/Seedance/` were iterated on during this pass; this doc captures what worked and what didn't so future re-animation passes don't repeat dead ends.
>
> **Model**: Seedance 2.0 (pro tier) via webapp → fal.ai
> **Source image**: `Source/Heroes Stylized/Spy.png`
> **Aspect**: 9:16, **Duration**: per-concept (6–7s power, 4s idle)

## Summary

| Concept | Takes | Kept | Status | Headline finding |
|---------|-------|------|--------|------------------|
| P1 Fourth-Wall Trollface (Alibi) | 7 | 2 | ✅ | Camera zoom from "upper body leans in" wording; fixed via static-camera prefix + rephrase |
| P2 Quick-Draw Trick Shot | 3 | 2 | ✅ | Landed cleanly |
| P3 Over-the-Shoulder Check | 3 | 2 | ✅ | Landed cleanly |
| P4 Poison Vial Reveal | 4 | 2 | ✅ | Green liquid → purple with skull sign (green unkeyable on green BG) |
| P5 Bomb Mishap | 6 | 3 | ✅ | Worked despite ambitious offscreen explosion. Static-camera prefix critical. |
| I1 Paranoid Scan | 2 | 1 | ✅ | Landed |
| I2 Plotting Chuckle | 2 | 1 | ✅ | Landed |
| I3 Crossbow Fidget | 3 | 1 | ✅ | Rework from earlier "predatory breath / finger drumming" concept — single heft beat read cleanly |
| I4 Satchel Pat | 3 | 1 | ✅ | Pat-pat was too static; reworded as "rummages in satchel" — produced richer motion |
| I5 Target Double-Take | 2 | **0** | ❌ | Rapid chained head snaps caused arrow morphing in quiver + phantom cape swing |
| I6 Neck Crack Unwind | 2 | 1 | ✅ | Landed |

---

## Per-concept findings

### P1 — Fourth-Wall Trollface (Alibi Version)
**7 takes, 2 kept (P1_0, P1_6).** The hardest concept in the batch.

**Dominant failure mode**: Early prompt phrasing *"he leans his whole upper body forward conspiratorially toward the viewer"* caused Seedance to interpret the lean as a **camera zoom-in** rather than a character body motion. Multiple takes had the character standing still while the framing pushed in.

**What fixed it**: Adding **"static camera shot of..."** at the head of the Subject line plus rewording the lean as internal character motion ("leans forward conspiratorially toward the viewer a few inches") rather than "whole upper body." User applied both fixes manually during iteration.

**Keeper conditions**: Head snaps left/right must read as discrete beats; conspiratorial lean-in must be *character* movement not *camera* movement; trollface spread and silent chuckle arrive after the lean.

### P2 — Quick-Draw Trick Shot
**3 takes, 2 kept.** Landed with minimal friction. Strong anticipation-to-strike timing translated well; the finger-gun-after-shot beat reads as a character quirk rather than an artifact.

### P3 — Over-the-Shoulder Check
**3 takes, 2 kept.** The sharp head-turn-away + slow head-turn-back + wink + nose-tap sequence held together despite the nose-tap being flagged as an iteration risk. Good landing.

### P4 — Poison Vial Reveal
**4 takes, 2 kept.**

**Critical keying finding**: Original prompt specified a **bright green** poisonous liquid with a faint green wisp. On a pure green chroma background, that VFX collapses into the background during keying — the matte eats the vial contents. Switched to **purple liquid with a skull sign on the bottle** (user edit) and the vial became readable post-key.

**Lesson**: any character-held VFX or liquid that would have been "sickly green" on a traditional black background must be re-tinted (purple, orange, red) when generating on green chroma. The skull sign/label fallback carries the "poison" semantic even without color coding.

Promoted to `HeroAnimation/CLAUDE.md > Known Issues & Learnings > Seedance 2.0 I2V Pitfalls`.

### P5 — Bomb Mishap
**6 takes, 3 kept.** The most ambitious concept in the batch — offscreen explosion with shockwave reaction is a stress test for I2V. Succeeded.

**What made it work**:
- `static camera shot of...` prefix on Subject (no camera drift during the panic kick)
- Explicit `explosion must occur fully off-screen right never in hand or in frame` in Constraints
- The shockwave reaction (hood blown back, quiver jostle, body lean) as the primary readable cue that the explosion happened

**Still an iteration-heavy concept**: 3/6 is healthy but not effortless. Expect similar burn rate on any slapstick concept with offscreen action beats.

### I1 — Paranoid Scan
**2 takes, 1 kept.** Sharp head snaps read well as "paranoid." Wired/jittery breathing rhythm carried through.

### I2 — Plotting Chuckle
**2 takes, 1 kept.** The "eyes drift + idea-strikes + silent chuckle" arc held together. Mouth stayed closed per constraints.

### I3 — Crossbow Fidget
**3 takes, 1 kept.** Rework justified — the earlier "predatory breath / finger drumming" was never going to resolve in I2V (see Spy.md "I2V Motion Granularity" + CLAUDE.md). The single clean heft beat produced the cleanest idle in the set.

### I4 — Satchel Pat (became Satchel Rummage)
**3 takes, 1 kept.** Starting prompt ("pat-pat-pat on the satchel") produced flat under-motivated frames. User reworded as **"rummages in the satchel trying to confirm that his supplies are still there, while turning his head nervously"** — the deeper motion with head-turn integration gave Seedance enough material to generate interesting frames.

**Principle**: for idle concepts, prefer **one sustained action with a head/face beat** over a minimal repeated micro-action. Promoted to CLAUDE.md.

### I5 — Target Double-Take
**2 takes, 0 kept. ❌**

**Failure mode**: The three rapid chained head snaps (snap left → snap center → snap left harder) caused Seedance to **morph the fletched arrows in the quiver** into inconsistent shapes between frames, and in one take a **phantom cape** appeared swinging behind the character (Spy has no cape). The chained head-snap dynamics appear to bleed motion predictions onto back accessories.

**Lesson (cross-character)**: Avoid rapid chained head snaps on any character with back accessories — quiver, cape, hood, banner, etc. A single sharp snap is fine (see I1); a double-take chain is the risk zone. Promoted to CLAUDE.md.

**Future rescue option**: this concept might work on characters with tight silhouettes and no back accessories (e.g. Princess Sweet, Merchant without his backpack). Leave shelved for the Spy.

### I6 — Neck Crack Unwind
**2 takes, 1 kept.** Shoulder roll + firm head tilt + satisfied nose exhale read cleanly. The "warming up for violence" tone landed.

---

## Cross-cutting prompt conventions validated this run

These are the prompt-file patterns that worked and should be the default for future heroes' Seedance prompts:

1. **Lead Subject with "static camera shot of ..."** for any concept with high motion or off-screen beats
2. **Bracket Sound with "no voice no dialogue no music"** at both ends + **lead Constraints with "no dialogue"** (redundant-ban pattern)
3. **`---` separator** between human notes and the Seedance body (webapp parsing convention — everything before `---` is stripped)
4. **Fold critical negatives into Constraints line** (webapp doesn't forward a `negative_prompt` parameter)
5. **Use non-green colors for VFX / held liquids** (greenscreen collision)

## Open follow-ups

- I5 Target Double-Take is shelved for Spy. Worth attempting on a cape-less / quiver-less character when we reach them.
- Post-processing audio-preservation confirmed working via `compose_frames.py` auto-mux (see `Docs/Pipeline.md` Stage 6.2).
- Stage 7 ElevenLabs SFX pipeline still WIP — deferred until a second hero completes generation.
