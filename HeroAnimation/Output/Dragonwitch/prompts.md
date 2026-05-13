# Dragonwitch — Prompt Findings (Stage 5)

> Per-concept observations from the 2026-04-29 → 2026-04-30 Seedance 2.0 generation run. The Seedance prompt files in `Prompts/Seedance/` were locked first-pass for the green-chroma set; this doc captures what worked and what didn't, plus a separate blue-chroma variant set generated to resolve a keying issue.
>
> **Model**: Seedance 2.0 (pro tier) via webapp → fal.ai
> **Source images**: `Output/Dragonwitch/Dragonwitch_FFLF_0.png` (green chroma), `Output/Dragonwitch/Dragonwitch_FFLF_1.png` (blue chroma)
> **Aspect**: 1:1, **Duration**: 6s power / 4s idle

## Summary

| Concept | Green takes | Blue takes | Status | Headline finding |
|---------|-------------|------------|--------|------------------|
| P1 Mocking Flame Hurl | 1 (P1_0) | 1 (P1_1) | ✅ kept | Forward flame-punch + open-mouth mocking laugh peak resolved cleanly |
| P2 Finger Flame Roll | 1 (P2_0) | 1 (P2_1) | ✅ kept | Hand-only ember manipulation; no body pirouette (avoided `twirl`/`spin`) |
| P3 Dragon Wisp Lunge | 1 (P3_0) | 1 (P3_1) | ✅ kept | Signature dragon-head VFX held silhouette through the lunge |
| P4 Flame Whip Snap | 1 (P4_0) | 1 (P4_1) | ✅ kept | Lateral wrist-flick whip; soft `snaps` verb avoided filter risk |
| P5 Smug Flame Inspect & Snuff | 1 (P5_0) | 1 (P5_1) | ✅ kept | No-force theatrical; lower motion budget held up |
| I1 Breathing Baseline | 2 (I1_0, I1_1) | 1 (I1_2) | ✅ kept | First pass too heavy; v2 with continuous-ambient breathing pattern fixed it |
| I2 Flame Admiration | 1 (I2_0) | 1 (I2_1) | ✅ kept | Wrist + head-tilt landed cleanly |
| I3 Smug Side-Glance | 1 (I3_0) | 1 (I3_1) | ✅ kept | Eyes-only glance avoided head-snap morph (Spy I5 lesson) |

**Run-level result**: 17/17 generations approved. No rejections, no rebakes for content reasons. The only iteration was I1 → I1 v2 for over-pronounced breathing on the first pass.

---

## Run-level observations

### What worked (write this down for the next character)
- **Anatomical hand-and-shoulder discipline up front**. The Stage 1 review caught the dragon skull misclassification (held prop → shoulder armor) and locked anatomical assignments in the hero doc before any prompts were written. Result: zero hand-confusion errors across 17 generations. Cost: one round of hero-doc edits during Stage 1.
- **Color pre-tint for green chroma fight**. Pre-emptively re-tinted the canonical green dragon-flame to **greenish-purple** in all prompts per the standard Spy P4 rule. Even the greenish-purple still partially collapsed during keying (see below) — but the chibi character-art and edge details stayed clean.
- **`coiled` substitution for `roll`-family**. P2 says "the ember **rolls** across her fingertips" — singular `rolls` did not trigger the safety filter. The prior Architect P2 rule about `roll`-family density still holds; isolated singular use is fine.
- **No-extreme-expression FFLF**. Canonical PNG already showed a confident closed-mouth smirk — used as-is for FFLF, no `mouth_closed/` variant needed. Open-mouth mocking laugh in P1/P2 lived mid-loop only and resolved correctly.
- **Static body for hand-only beats** (P2, P5, I2). Explicit `body and torso stay in canonical position throughout with no rotation` prevented Seedance from reading any hand or wrist motion as a body pirouette.

### What needed iteration
- **I1 breathing was visibly heavy on the first pass**. The legacy Architect-era I1 wording ("calm regular breaths with multiple small breath cycles") still produced over-pronounced chest motion. The user had already validated the Princess Sweet I1 fix pattern but had not yet logged it. We applied that pattern (continuous ambient breathing, no discrete visible breath events, full ban-list at start of Constraints) and re-queued; v2 (`I1_1.mp4` green / `I1_2.mp4` blue) read correctly. **Logged to CLAUDE.md** as a global I1 authoring rule with the Architect-era wording explicitly deprecated.

### Keying issue (resolved via blue-chroma variant set)
- **The greenish-purple flame VFX still got eaten by the green chroma key in post**. The green-chroma generations look great in raw playback, but the keyer cannot cleanly separate the green channel of the flame from the chroma background. **Fix**: generated a **parallel blue-chroma variant set** (`P1_1` … `I3_1`) using a blue-background source PNG (`Dragonwitch_FFLF_1.png`) and `pure blue chroma key 0x0000FF` in Constraints. The blue-chroma set keys cleanly. **Logged to CLAUDE.md** as a global rule for any hero with green/yellow-green/teal-family VFX — ship both a green-chroma primary and a blue-chroma variant from the start.

---

## Per-concept findings

### P1 — Mocking Flame Hurl
**1 take green + 1 take blue, both kept.** Forward flame-punch off-frame + open-mouth toothy mocking laugh peak + resolve to canonical closed-mouth smirk. The `static camera shot of...` prefix prevented the off-frame projectile from being read as a camera dolly-in. Skull pauldron eye-pulse on the punch returned to baseline by loop-end. The mocking-laugh peak resolved correctly on both takes.

### P2 — Finger Flame Roll & Mocking Laugh
**1 take green + 1 take blue, both kept.** Direct client-brief mapping — twirl flame between fingers + mocking laugh + arrogant pose. Authored carefully per the Fat Princess P4 lesson: **no `twirl`/`spin`/`rotate` verbs anywhere**. Used `the ember rolls across her fingertips` and `she walks the ember between her fingertips`. Constraints-line lock on `body and torso stay in canonical position throughout with no rotation at all` prevented any body-pirouette read. Hand-only ember manipulation read cleanly.

### P3 — Dragon Wisp Lunge
**1 take green + 1 take blue, both kept.** The strongest unique VFX read in the slate — only Dragonwitch has dragon-head wisp VFX. Applied the **Architect P4 distinctive-silhouette fix pattern**: (A) explicit silhouette geometry (two horns curving back, snarling mouth, trailing wisps as tail), (B) broad-face presentation (dragon-head presented broad-face to camera before the lunge), (C) silhouette-preservation Constraint (`never simplifies into a generic flame ball or generic fireball`). The dragon-head silhouette held through the lunge in both takes.

**Cross-character validation**: the Architect P4 fix pattern, originally formulated for distinctive **physical weapon** silhouettes (caliper-protractor blade), works equally well for distinctive **ethereal VFX** silhouettes (dragon-head wisp). Worth adding to the rule's scope note in CLAUDE.md.

### P4 — Flame Whip Snap
**1 take green + 1 take blue, both kept.** Lateral wrist-flick whip — distinct from the forward-projection P1/P3. Authored per the **Architect P2 dense-cluster lesson**: avoided `crack` (combat vocab cluster) in favor of `snaps it horizontally` / `whips across`. Body-stillness constraint locked the motion to wrist + forearm only. The horizontal flame trail with dragon-wisps along it read as a clean signature beat.

### P5 — Smug Flame Inspect & Snuff
**1 take green + 1 take blue, both kept.** No-force theatrical — vain connoisseur's beat. Lower motion budget than the other power moves; the longer hold on the inspection beat let the flame VFX read fully before the snuff. Re-ignition at end correctly restored the canonical FFLF flame in the open palm. Mouth stayed closed throughout — no laugh peak (P1/P2 carried that beat).

### I1 — Breathing Baseline
**2 takes green (I1_0, I1_1) + 1 take blue (I1_2), all kept.** First pass (`I1_0.mp4`) had visibly heavy chest motion that read as over-pronounced breathing. v2 prompt rewrite applied the Princess Sweet I1 pattern: continuous ambient breathing with no discrete visible breath events; full breath-ban list at the start of Constraints (`no deep breaths no sharp breaths no quick breaths no short breaths no panting no audible inhales no audible exhales`); Sound field switched from "with multiple small breath cycles" to "soft natural calm ambient nose-breathing at a slow steady relaxed rhythm." v2 (`I1_1.mp4`) and v3 (`I1_2.mp4` = blue variant) read correctly. **The Architect-era I1 wording is now deprecated** — see CLAUDE.md.

### I2 — Flame Admiration
**1 take green + 1 take blue, both kept.** Wrist-driven flame lift + head-tilt admiration + return. Subtle expressive variant; no risk surfaces.

### I3 — Smug Side-Glance
**1 take green + 1 take blue, both kept.** Eyes-only side-glance + brow micro-arch + smirk widen. Authored per the **Spy I5 lesson** — explicit `head stays forward and unmoved, no head turn no head tilt no head snap, only the eyes and the brow move` to avoid the chained-head-snap morph risk that broke Spy I5 (especially relevant here because the dragon skull pauldron is exactly the kind of back/shoulder accessory that morphs on head snaps).

---

## Open items (post-AD review)

- AD review feedback (pending) — record any retake / refinement requests against this baseline.
- Keying validation — once the user runs `/key-clips` on the **blue-chroma variant set**, log the keyer settings that worked (despill values, alpha-mode choice) for the next hero with green/teal-family VFX.
- The blue-chroma variant set was queued under `conceptId="P1_1"`...`"I3_1"` (incorrect — produces `P1_1_0.mp4` instead of `P1_1.mp4`); files were renamed on disk to match the correct `<conceptId>_<version>.mp4` pattern. There are 7 stale job-DB entries with `concept_id="<X>_1"` and `clip_name=null` — leave or clean up at convenience. Future variant queues use `conceptId=<parent>` + `promptFile=<variant>.md` (logged to CLAUDE.md).
