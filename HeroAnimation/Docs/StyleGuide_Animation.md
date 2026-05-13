# EMTD Animation Style Guide

> Grounded in analysis of 5 reference animations in `Examples/` (each has a companion `.md` description file). This guide is a **living document** — it will be expanded as more reference material is gathered and the pipeline matures.

## 1. Animation Context

These are **hero screen animations** — character portraits shown in menus, hero selection, or idle screens. They are NOT gameplay/combat animations. The purpose is to bring the static hero art to life with personality and presence.

### Reference Games
- **Kingshot** (primary reference — "KS")
- **Supercell titles** (Clash of Clans, Clash Royale hero screens)
- **Rise of Kingdoms** hero portraits
- Similar mobile kingdom-builder hero presentation screens

## 2. Animation Structure

Each hero has **two separate animation loops**, each generated independently:

### Power Movement (separate loop)
- The character performs their **signature action with their weapon** — the power move is weapon-driven, not ability-driven (client direction, 2026-04-22). Bow → loose an arrow; hammer → overhead strike; scepter → thump/point; pistol → aim and fire; fans → slash/snap open; spoon-club → smash; halberd → short swing or jab. Use the CSV `Default Attack Style` / `Silviu notes` and the hero's `Weapon` section as the source of truth for what the weapon does.
- Do **not** design power moves around the hero's skill kit or ability kit (summoned walls, protective scrolls, thorn vines, AoE buffs, etc.) — those belong in gameplay, not the hero screen. Keep it straightforward and intuitive: "what would this weapon do in one clean beat?"
- **Moneybags exception**: lead with a coin toss (flip and catch the coin bag), then transition into the pistol shooting action. He is the only hero whose power move combines two beats.
- Still a "hero moment" — personality carries through the weapon action (stance, expression, timing, VFX). Don't strip character out to make it "generic weapon action."
- Should include a **character-specific VFX element** (slash trails, coin showers, muzzle flash, flame burst, etc.)
- **Energy**: High — this is the peak of the animation
- Observed reference range: 5-7s (Wilhelm 5s, Diana 6s, Spy 7s, Moneybags 7s)

### Idle Movement (separate loop)
- The character in a **subtle resting loop**
- **Every hero must have one mandatory breathing-only baseline idle** (client direction, 2026-04-22): chest rise/fall, a small weight shift, minimal secondary motion (cape/hair drift, blink). No character business, no fidgets, no prop interaction. This is the safe fallback option the team can always pick.
- **Expressive idles are additional, optional variants** on top of the baseline — a Spy glance, a Moneybags coin-heft, a Fat King belly pat. Propose these alongside the baseline, not instead of it.
- **Facial expression** should convey resting personality — characters are "acting" even at rest
- **Energy**: Low — ambient life, not action

### Duration Rules
- Each animation is its own standalone seamless loop
- Duration must be a **whole number of seconds** (4s, 5s, 6s, etc. — no fractional durations)
- **Power movement**: minimum 6 seconds (maximum 15s). Shorter power loops (6s) work for decisive, authoritative characters; longer power loops (8s+) work for personality-heavy characters with narrative beats.
- **Idle movement**: exactly 4 seconds.

### Client Brief as Starting Point
- Each hero doc (`Docs/Heroes/<HeroName>.md`) contains a **Character Brief (Client)** section parsed from the client CSV, including `Hero Screen Animation`, `Victory Animation`, `Defeat/Death Animation`, and `Default Attack Style` fields.
- Treat any animation specified in these fields as **inspiration and a rough starting point only** — not a strict spec. Use them as signals for tone, personality, and weapon use; propose stronger ideas when they serve the character better.

### Source Pose Constraint
- The **source PNG is the start and end frame** for both loops — the character's canonical pose is where each animation begins and must return to
- Both power and idle movements must **depart from and return to** this exact pose
- Animation concepts should be designed around what the character can naturally do **from their canonical stance** (e.g., a character holding a sword two-handed at chest height should perform actions that start and end in that grip)

## 3. Motion Principles

### Overall Tone: Jovial / Slightly Comical (Client Direction)
- All hero animations should lean **jovial and slightly comical** in typical Supercell fashion (Clash Royale, Clash of Clans). This is explicit client direction and applies across the whole roster.
- Every character should carry a small comedic or warm beat somewhere in their loop — a smirk, a wink, a cheeky flourish, a shrug, an eye roll, a satisfied nod. Personality sells through light humor and exaggerated charm, not stoic gravitas.
- This is **character-appropriate**, not one-size-fits-all:
  - Imposing characters (General, Count Wilhelm) stay imposing, but add a smirk or dry, confident beat rather than pure stone face.
  - Comedic characters (Spy, Fat King, Fat Princess, Moneybags) lean hard into it — fourth-wall breaks, theatrical posing, self-satisfied reactions are on the table.
  - Refined characters (Princess Arrogant, Architect, Herald) express humor through *attitude* — a nose tilt, a dismissive wave, a raised brow — rather than broad comedy.
- Keep exaggeration **Supercell-scale**, not Looney Tunes — snappy anticipation, overshoot, slight wind-ups, facial expression changes. Not full-cartoon squash-and-stretch.

### Character-Driven Motion (Confirmed by Reference Analysis)
- Every movement should reflect the character's **personality** (see individual hero docs)
- **Heavy characters move with weight**: Wilhelm's axe has a long, deliberate wind-up (~1s anticipation) followed by an explosive slam. The weapon weight dictates the timing.
- **Agile characters move with snap**: Diana's sword swings are fast with short anticipation (~0.3s). Multiple quick slashes rather than one big hit.
- **Personality characters move with theatrics**: Moneybags' coin shower is slow and deliberate — he's performing for an audience. The Spy's crossbow sequence includes narrative beats (load, aim, glance around).

### Anticipation-to-Strike Contrast
The most critical timing principle observed across references:
- **The bigger the anticipation, the more impactful the strike**
- Wilhelm: ~1s slow wind-up → instant slam = massive impact feel
- Diana: ~0.3s quick pull-back → fast slash = agile/snappy feel
- Moneybags: ~0.5s deliberate aim → sustained coin shower = theatrical feel
- The contrast ratio between anticipation speed and strike speed defines the character's combat personality

### VFX Hierarchy
Each hero should have a **signature VFX element** during their power movement:
- **Slash trails** (Diana): White glowing arc trails that persist 1-1.5s after sword swings, crossing patterns during combos
- **Particle showers** (Moneybags): Individually animated gold coins with realistic parabolic arcs, tumbling, and ground scatter
- **Perspective foreshortening** (Wilhelm): Weapon swinging toward camera for dramatic scale effect
- **Motion blur**: Weapon blades stretch/blur during peak velocity — observed in Diana and the melee knight
- **Hero vs. Unit hierarchy**: Heroes get prominent VFX (trails, particles); common units get only subtle blade gleam. This visual hierarchy is important.

### Facial Expression Arcs
From the Spy reference (the gold standard for personality):
- Characters should **change expression** throughout the animation loop
- Idle: resting personality expression (smirk, scowl, smile)
- Pre-action: focused/determined
- During action: intensity matching the action (fierce, gleeful, concentrated)
- Post-action: satisfaction, wariness, or return to personality expression
- The Spy demonstrates the full range: devious grin → focused aim → satisfied smirk → suspicious glance

### Exaggeration & Appeal
- Follow the **Supercell standard** for motion exaggeration:
  - Anticipation before major actions (slight pull-back before a swing)
  - Overshoot on follow-through (weapon continues past the action peak)
  - Squash and stretch on soft materials (capes, fabric, hair)
  - Snappy timing on quick actions, smooth easing on slow ones

### Secondary Motion (Observed Detail)
- **Capes/cloaks**: Wilhelm's red cape is the best reference — billows outward during overhead swings, wraps during slams, settles slowly during recovery. Cape intensity should scale with action intensity.
- **Hair**: Diana's red hair bounces and follows head movement with ~2-3 frame delay
- **Accessories**: Moneybags' beret feather sways prominently; Spy's quiver arrows shift during body rotation; belt pouches swing during lateral movement
- **Weapons**: Heavy weapons (axe) have visible lag during wind-up; light weapons (sword, crossbow) snap to position
- **Fabric/cloth**: Tunic hems, coat flaps, and skirt edges react to body rotation with delayed follow-through

### Camera & Framing
- **Static camera** — no camera movement or zooms
- Character remains centered in frame
- Full body visible at all times
- **Transparent background** — character only, no environment (reference videos use black BG but final delivery is transparent)
- **Ground shadow**: Soft, dark elliptical shadow beneath the character (observed in Diana reference)

### Rendering Observations
- All references use **3D-rendered characters** with a stylized hand-painted look applied to 3D geometry
- **No blue rim light** on new animations — reference animations in `Examples/` show a soft blue rim/edge light on silhouettes (to composite onto the blue in-game background), but this direction has been reversed. New animations should NOT include blue/cyan rim lighting; treat it as a negative-prompt item.
- **Do NOT describe the source-frame lighting in prompts** — the source PNG's lighting (warm key from upper-left, painted highlights, etc.) is already baked in and transfers automatically via I2V. Re-describing it adds a second conflicting light rig and degrades the output. Only describe lighting when a new light source appears as part of the action (e.g. a magic flame igniting, a blade glowing on a slash).
- Frame rate: Most references are 24 FPS; the tax-collector reference uses 30 FPS and appears noticeably smoother

## 4. Technical Specifications

| Parameter | Specification |
|-----------|--------------|
| Format | `.mov` with alpha channel |
| Background | Transparent |
| Audio | SFX only (impact sounds, swooshes, material sounds) |
| Voice | None — no voice-over, no lipsync, no talking |
| Loop | Seamless — end frame matches start frame |
| Start/End Frame | Source PNG is the first and last frame — all motion departs from and returns to the canonical pose |
| Duration | Whole seconds only. Power: min 6s, max 15s. Idle: exactly 4s |
| Structure | Power movement and idle movement are **separate loops**, each independently generated |

## 5. Per-Character Animation Notes

> Power moves are **weapon-driven** per client direction (2026-04-22). Each entry names the weapon and the clean one-beat action it performs. Idle column shows the **baseline breathing idle** every hero gets; expressive variants are proposed on top of the baseline during concepting (see `PromptTemplates/animation_concepts.md`).

| Hero | Weapon | Power Movement (weapon action) | Baseline Idle |
|------|--------|-------------------------------|---------------|
| New King | Pistol | Check the pistol mechanism, raise and fire forward | Breathing, small weight shift |
| Diana | Sword (dual-wield) | Quick flourish slash, finishing with fist/blade raised | Breathing, subtle weight shift |
| Count Wilhelm | Halberd | Stroke beard, then short halberd jab or swing | Breathing, cape drift |
| General | Sword | Draw/unsheathe sword, confident salute | Breathing, minimal sway |
| Spy | Crossbow | Load bolt, raise crossbow, aim and loose | Breathing, sneaky weight shift |
| Dragonwitch | Flame / dagger | Conjure flame in palm, throw it forward (or dagger stab) | Breathing, hair/flame flicker |
| Architect | Quill + blueprint | Adjust glasses, unroll blueprint, quick scribble/point | Breathing, small weight shift |
| Blacksmith | Heavy hammer | Heft hammer overhead and slam down | Breathing, shoulder roll |
| Fat King | Croissant pole-arm / scepter | Raise scepter and thump ground, or short stab | Breathing, belly rise/fall |
| Fat Princess | Spoon-club | Raise spoon and gleeful smash/lick | Breathing, gentle sway |
| Herald | Quill + scroll | Unfurl scroll, sharp scribble flourish with quill | Breathing, stiff sway |
| Merchant | Gun (blunderbuss) | Shoulder the gun, aim and fire proud | Breathing, basket sway |
| Moneybags | Pistol (+ coin bag) | **Exception**: toss coin bag up and catch, then raise pistol and fire | Breathing, small weight shift |
| Princess Arrogant | Dual fans | Snap fans open, quick slash, haughty fan flutter | Breathing, light sway |
| Princess Sweet | Thorn-vine magic | Vines coil around hand, gentle conjure gesture forward | Breathing, hair drift |

## 6. Available Reference Videos

> **Important**: These references are **internal guidance only** — they inform our understanding of timing, motion quality, and personality during concept development. They must **never be referenced in generation prompts** — the video generation model has no context about other animations.

Located in `Examples/` — each video has a companion `.md` file with detailed frame-by-frame analysis:

| File | Character | Duration | FPS | Key Lesson |
|------|-----------|----------|-----|------------|
| `diana-with-aac-audio.mov` | Diana (hero) | 6.0s | 24 | Slash trail VFX, agile sword flourish, 50/50 action/idle split |
| `melee2-aac-audio.mov` | Generic knight (unit) | 6.0s | 24 | Baseline unit motion — contained, no VFX, hero vs. unit hierarchy |
| `sneak-with-aac-audio.mov` | Spy (hero) | 7.0s | 24 | Gold standard for personality — facial expression arcs, narrative beats |
| `tax-collector-aac-audio.mov` | Moneybags (hero) | 7.0s | 30 | Coin particle VFX, theatrical timing, highest production value |
| `wilhelm-with-aac-audio.mov` | Count Wilhelm (hero) | 5.0s | 24 | Weapon weight timing, perspective foreshortening, cape physics |

> **Status**: Reference collection is ongoing. More examples will be added. Read the `.md` companion files for full analysis without re-extracting frames.

## 7. Animation Prompt Tokens

### Motion Quality Tokens
```
smooth looping animation, seamless loop, character idle animation,
hero screen animation, subtle breathing movement, cape physics,
secondary motion on accessories, anticipation and follow-through,
Supercell-quality animation, mobile game hero portrait animation,
3D stylized character animation
```

### Action Tokens
```
weapon flourish, power pose, signature move, dramatic action,
settling into idle, gentle sway, ambient movement, hair drift,
weapon motion trail, glowing slash arc effect, particle VFX,
dramatic foreshortening, overhead weapon swing, theatrical pose
```

### Personality Tokens
```
expressive facial animation, changing expression, confident smirk,
fierce battle cry, suspicious glance, theatrical showmanship,
character-driven timing, personality-revealing action
```

### Anti-Tokens (avoid)
```
walk cycle, run animation, combat sequence, jumping, falling,
camera movement, zoom, environment interaction, talking, lipsync,
static image, freeze frame, stiff mechanical motion, identical repeat,
realistic proportions, no expression change
```
