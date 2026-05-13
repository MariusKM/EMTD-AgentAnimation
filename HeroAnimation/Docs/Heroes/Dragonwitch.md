# Dragonwitch

> Source: `Source/Heroes Stylized/Dragonwitch.png`

## Role
A dark magical warrior — part sorceress, part dragon cultist. She channels draconic power and sits between villain and anti-hero. The most visually distinct and edgy character in the roster.

## Physical Description
- **Build**: Slim and athletic, slightly taller proportions than most of the roster
- **Skin**: Tan/olive with a cool undertone, distinct from the warmer skin of other characters
- **Hair**: Dark navy blue, short and spiky/windswept, swept up and to one side with punk-like volume
- **Expression**: Confident smirk with visible teeth, one side higher — playful menace
- **Eyes**: Bright green with intensity, slightly narrowed
- **Lips**: Green-tinted lips — a unique distinguishing detail, suggesting magical corruption or draconic influence

## Costume & Equipment
- **Top**: Black cropped sleeveless top/bodice — the most minimalist upper garment in the roster
- **Skirt**: Green leaf-like or scale-like tattered skirt — organic, ragged edges suggesting dragon or nature themes
- **Belt**: Brown leather belt with diamond-shaped buckle at center
- **Gloves**: Dark gray/black elbow-length gloves
- **Boots**: Black/dark gray knee-high boots, heavy buckled straps
- **Shoulder armor (anatomical-left shoulder, viewer-right of image)**: Silver/bone-white horned **dragon skull pauldron** worn as armor — NOT a held prop. It rides on the shoulder; the character does not interact with it as an active animation prop. Eye-glow may pulse subtly during a power beat but must return to baseline by loop-end.
- **Anatomical-left hand**: Rests on the hip — neutral anchor pose.
- **Magic (anatomical-right hand, viewer-left of image)**: Bright **greenish-purple** magical flame/energy floating above open palm — dragon-shaped wisps forming in the fire. This is the signature visual effect. **Re-tinted greenish-purple in prompts** (canonical art is green; pure green collapses into the green chroma key during post).

## Color Breakdown
| Element | Primary Color | Secondary |
|---------|--------------|-----------|
| Hair | Dark navy blue | — |
| Skin accents | Green lips | Cool undertone |
| Top | Black | — |
| Skirt | Green (leaf/scale) | Tattered edges |
| Boots/gloves | Dark gray/black | Buckle straps |
| Dragon skull pauldron | Silver/bone white | Horn details (shoulder armor) |
| Magic flame (canonical art) | Bright green | Dragon-shaped wisps |
| Magic flame (in prompts) | Greenish-purple | Re-tinted to survive chroma key |
| Belt | Brown leather | Diamond buckle |

## Pose Description
Standing upright in a confident stance, **three-quarter view turned slightly toward viewer-right** (so viewer-left of image = her anatomical right side). **Anatomical-right hand** (viewer-left of image) extends out with palm up, summoning greenish-purple draconic fire. **Anatomical-left hand** (viewer-right of image) rests on the hip. The silver horned **dragon skull pauldron** sits on her **anatomical-left shoulder** (viewer-right of image) as worn armor — not a held prop. Weight balanced, chest open — a power display pose.

## Weapon
- **Primary**: **Greenish-purple** magical dragon-flame channeled through the **anatomical-right palm** — her signature VFX. The dragon skull on the anatomical-left shoulder is **worn armor, not a held prop** — keep it static (subtle eye-pulse OK on power beats, must return to baseline by loop end).
- **Natural one-beat action**: The flame grows/intensifies in her palm → she hurls or punches it forward in a short burst. Alternative: short dagger-like stab gesture with a small flame-dagger forming in the hand. Fast, graceful, short-range.
- **Power move direction (per client brief)**: Struts forward arrogantly, twirls a small flame between her fingers, mocking laugh into a pose. Dragon-shaped wisps in the flame are her signature read. **Keying caution**: green flame on a green chroma background will be eaten by the keyer. On generation, tint the flame **greenish-purple** in the prompt — locked color choice for Dragonwitch. Avoid `twirl`/`spin` verbs around the body (Seedance reads them as full-body pirouettes, learned on Fat Princess P4); for finger-twirl flame use phrases like `the flame rolls across her fingers` or `she flips the flame once between her fingers`.
- **Source of truth**: CSV `Default Attack Style` — "Fast attack speed, short attack range. Punch with flame or stab with dagger. Professional fighter." Silviu notes — "Ranged spellcaster who unleashes AoE spells such as curses, fire breath, summon magic dragon" (ability kit — ignore for power move; keep the single flame punch).

## Personality Keywords
Mysterious, powerful, edgy, confident, dark, magical, draconic

## Prompt Fragment
```
dark sorceress character, short spiky navy blue hair, bright green eyes, green-tinted lips,
black sleeveless crop top, short green leaf-shaped skirt with ragged jagged edges falling
to mid-thigh, dark gloves and dark knee-high boots, brown belt with diamond buckle,
silver horned dragon skull pauldron worn as armor on her anatomical-left shoulder,
anatomical-left hand resting on the hip, anatomical-right palm extended with a greenish-purple
magical dragon-shaped flame floating above the open palm, confident smirk, dark magical
warrior aesthetic
```

## Character Brief (Client)

> **Note**: Per client, the Hero Screen / Victory / Defeat animation descriptions below are **inspiration and a rough starting point only** — not a strict spec. Use them as signals for tone and intent; propose stronger ideas when they serve the character better.

**Role & Traits** — Yigris, Lady of the Flames. Antagonist, leader of the dragon cult. Mocking and cruel, self-centered, wicked, treacherous and smart.

**Hero Screen Animation** — She struts forward arrogantly, twirling a small flame between her fingers, and then lets out a short, mocking laugh while striking a pose.

**Movement Style** — Fast movements, graceful and quick. Either arrogantly strutting, OR bent-over as if to sneak up on enemies.

**Victory Animation** — Laughs mockingly while twirling a flame around her fingers, striking an arrogant pose.

**Defeat/Death Animation** — Reaches out dramatically in disbelief before collapsing on her back.

**Default Attack Style** — Fast attack speed, short attack range. Punches with flame or stabs with dagger. Professional fighter.

