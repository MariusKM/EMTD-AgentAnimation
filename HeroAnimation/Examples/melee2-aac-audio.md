# Animation Reference: Melee Knight (Generic Unit)

> Source: `melee2-aac-audio.mov` | 24 FPS | 144 frames | 6.0s duration

## Character
A generic **foot soldier / melee knight** — not one of the 15 named heroes. This is a common unit-type character. Stocky chibi build, wearing a brown tunic with a full-face **great helm** (crusader-style bucket helmet), carrying a **round shield** (orange/red with silver cross-brace pattern) and a **short sword** with gold pommel.

## Rendering Style
- **3D-rendered** in the same Supercell/Kingshot stylized look as other references
- **Black background** (not transparent)
- No ground shadow or ground plane visible
- **Soft blue rim light** on character edges — intentional, for compositing onto the blue in-game background
- Warm key light from upper-left

## Animation Breakdown

### Phase 1: Idle / Guard Stance (0.0s - 2.0s)
- Knight stands in a guarded three-quarter view
- Shield held forward on left arm at chest height
- Sword held low at right side, pointing slightly down and forward
- Very **subtle idle movement** — gentle breathing/weight shift
- The idle is notably **more minimal** than Diana's — this is a disciplined soldier, not a personality character
- Head turns very slightly side to side within the helmet

### Phase 2: Power Movement — Sword Strike (2.0s - 4.5s)
- **Preparation** (~2.0s): Body leans slightly forward, shield tightens to body
- **Strike** (~2.5-3.0s): Sword swings forward in a short, practical **horizontal thrust/slash** at waist level. The motion is compact and military — no flashy flourish
- **Motion blur on blade** visible during the fastest part of the swing — the sword blade stretches with a white gleam/blur effect
- **Shield stays up** throughout — the knight maintains guard during the attack
- **Follow-through** (~3.5s): Sword held extended forward, the blade gleam fades
- **Second shift** (~3.5-4.0s): Body rotates slightly, resetting
- The overall attack is **much more contained** than Diana's — tighter arc, less exaggeration, befitting a disciplined infantry unit

### Phase 3: Return to Idle (4.5s - 6.0s)
- Sword returns to low guard position
- Shield settles back to forward guard
- Body returns to upright stance
- Seamless loop back to start pose

## Key Motion Observations

### Timing & Easing
- **Slower, heavier timing** than Diana — the knight moves with weight and deliberation
- Anticipation is more of a **lean/shift** than a dramatic pull-back
- The attack is **fast but short-range** — a military thrust, not a sweeping arc
- Recovery is **steady and measured** — professional, not flashy

### VFX
- **Minimal VFX** — only a subtle white gleam/blur on the sword blade during peak velocity
- No persistent slash trails like Diana's — appropriate for a common unit vs. a hero
- The difference in VFX treatment between hero and unit is a **useful hierarchy signal**

### Secondary Motion
- **Very limited secondary motion** — the helmet, armor, and shield are rigid
- Slight movement in the brown tunic fabric at the waist
- The shield has subtle positional shifts during the attack
- Much less secondary motion than Diana — appropriate for a heavily armored figure

### Character Consistency
- Design is **very stable** throughout all frames
- Helmet, shield design, and proportions remain consistent
- The simpler design (full helmet covering face) makes consistency easier to maintain

## Quality Assessment
- **Solid, clean animation** — technically well-executed
- The restrained motion style is **deliberately different** from hero animations
- This reference is valuable for establishing the **visual hierarchy**: heroes get dramatic flourishes + VFX trails; common units get practical, contained motions
- Useful as a contrast reference when designing hero animations — they should feel more dramatic than this baseline

## Key Takeaway for Pipeline
This animation demonstrates the **unit tier** of motion — practical, contained, minimal VFX. Hero animations should be visibly more dramatic, with bigger arcs, more personality, and prominent VFX effects (like Diana's slash trails).
