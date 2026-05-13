# Animation Reference: Diana

> Source: `diana-with-aac-audio.mov` | 24 FPS | 145 frames | 6.0s duration

## Character
Diana — young red-haired warrior with teal tunic, fur-trimmed shoulder mantle, brown leather gear, and short sword with gold pommel. Matches the canonical hero art closely.

## Rendering Style
- **3D-rendered** in a stylized Supercell/Kingshot aesthetic — smooth, hand-painted look applied to 3D geometry
- **Black background** (not transparent in this reference — final delivery should be transparent .mov)
- **Dark elliptical ground shadow** beneath the character, soft-edged
- **Soft blue rim/edge light** visible on the character silhouette — intentional, designed to help the character composite naturally onto the blue in-game background
- Character is well-lit with warm key light from upper-left, consistent with the style guide

## Animation Breakdown

### Phase 1: Idle / Ready Stance (0.0s - 1.5s)
- Diana stands in a three-quarter view, sword held upright at shoulder height in right hand
- Subtle **breathing motion** — torso rises and falls gently
- Slight **weight shift** between feet
- Hair has gentle ambient sway
- Left hand rests confidently on belt/hip
- Expression: confident smirk, eyes forward

### Phase 2: Power Movement — Sword Flourish (1.5s - 4.5s)
- **Anticipation** (~1.5s): Sword pulls back behind the head, body coils slightly
- **Swing arc** (~2.0-3.0s): Sword sweeps in a wide horizontal arc from right to left across the body. The blade leaves a prominent **white motion trail/slash arc** — a glowing swoosh effect that lingers for several frames
- **Full extension** (~3.0s): Sword fully extended forward at face level, body in wide combat stance, legs spread for stability
- **Follow-through** (~3.0-4.0s): The slash trail forms a large circular swoosh pattern that dissipates. Sword continues past the action peak.
- **Second slash** (~4.0-4.5s): A second upward-diagonal slash with another visible trail arc. The slash trails create crossing arc patterns.
- **Recovery** (~4.5s): Body pulls back from the extended position

### Phase 3: Return to Idle (4.5s - 6.0s)
- Sword returns to upright shoulder position
- Slash trail effects fade and disappear completely
- Body settles back into relaxed ready stance
- Returns to the same position as frame 0, creating a **seamless loop**

## Key Motion Observations

### Timing & Easing
- Anticipation is **quick but visible** (~0.3s pull-back before the swing)
- Sword swings are **fast with motion blur** — the blade becomes stretched/blurred during peak velocity
- Recovery/settling is **slower and eased** — smooth deceleration back to idle
- Total power movement is ~3s, idle is ~3s — roughly 50/50 split

### VFX: Slash Trail
- **White glowing arc trails** follow the sword path
- The trails persist for ~1-1.5s after the swing, fading gradually
- Multiple overlapping arcs create a dynamic pattern during the double-slash
- This is a key visual element — not just motion blur but a deliberate **VFX overlay**

### Secondary Motion
- **Hair**: Red hair bounces and follows head movement with slight delay
- **Cape/tunic flap**: Teal tunic hem and cape react to body rotation during swings
- **Fur mantle**: Shoulder fur has subtle jiggle on impact frames
- **Belt accessories**: Slight swing on pouch and slingshot during movement

### Character Consistency
- Character design remains **very consistent** throughout — no deformation or style drift
- Proportions match the source art closely (chibi ~2.5 heads tall)
- Colors and materials are stable across all frames

## Quality Assessment
- **High quality** animation — smooth motion, consistent character, appealing VFX
- Slash effects are well-timed and add impact without overwhelming the character
- Good balance of action vs. idle time
- Loop appears seamless (first and last frames are near-identical poses)
- The 3D rendering faithfully captures the 2D art style
