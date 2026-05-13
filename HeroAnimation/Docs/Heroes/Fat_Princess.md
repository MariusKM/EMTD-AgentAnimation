# Fat Princess

> Source: `Source/Heroes Stylized/Fat_Princess.png` | Mouth-closed variant: `Source/Heroes Stylized/mouth_closed/Fat_Princess.png`
>
> **FFLF image convention**: Use the **mouth-closed variant** (`mouth_closed/Fat_Princess.png`) as the I2V input / first-and-last frame for all animations. Her canonical open-mouth expression reads well in a static hero card but looks awkward held for the full loop duration; the closed-mouth content smirk is the stable resting state. Power moves that need the wide open-mouthed gleeful expression should reach that beat in the middle of the loop and return to the closed-mouth pose at the end.

## Role
The indulgent, food-obsessed princess — comedic, dramatic, and pampered. She's all about sweets and spectacle, a humorous take on royalty.

## Physical Description
- **Build**: Round and plump, wide-bodied with soft proportions
- **Skin**: Fair/pale with rosy pink cheeks
- **Hair**: Auburn/reddish-brown, one large bun at the back of the head (visible on viewer's right) with side-swept fringe framing the face
- **Expression**:
  - *Open-mouth (default PNG)*: surprise/delight — caught mid-bite or mid-gasp, eyebrows raised high. Dramatic and expressive. Good for peak beats.
  - *Closed-mouth (idle FFLF)*: content smirk, eyes bright and slightly amused. Stable resting state — use this variant as the I2V input for idle and for the return pose of power moves.
- **Eyes**: Large, dark brown, wide open with surprise

## Costume & Equipment
- **Hat**: Tall pink conical princess hat with a **short white cloth tassel at the tip** (only a few inches of fabric, NOT a long flowing veil). A small gold crown sits at the base.
  - Noun audit: avoid `hennin` (historically accurate but obscure). Avoid `veil` and `streamer` — both over-read in Seedance into a long trailing banner silhouette. Use `short white cloth tassel at the tip of the hat` (confirmed fix 2026-04-23 after over-read test).
- **Dress**: Elaborate pink gown — the most complex dress in the roster. Multi-layered with:
  - Pink outer dress with decorative bows along the front and sides
  - Cream/white underskirt with diamond lattice pattern
  - Pink bow at the bodice center
  - White lace trim at sleeves
- **Boots**: Small brown boots, barely visible beneath the dress
- **Held items** (anatomical — character's own left/right, not viewer-side):
  - **Anatomical right hand** (viewer's left side of image): Yellow cupcake/pastry — held up near the mouth, mid-bite
  - **Anatomical left hand** (viewer's right side of image): Gold ladle/spoon with dark chocolate dripping from the bowl — arm extended outward at hip/waist level

## Color Breakdown
| Element | Primary Color | Secondary |
|---------|--------------|-----------|
| Hat | Pink | Short white tassel at tip, gold crown at base |
| Hair | Auburn/red-brown | Bun style |
| Dress | Pink | Cream/white underskirt |
| Bows | Pink | Multiple placements |
| Cupcake | Yellow/cream | — |
| Ladle | Gold | Dark chocolate drip |
| Boots | Brown | — |

## Pose Description
Three-quarter view, slightly turned so the character's anatomical right side faces the viewer's left. **Hand assignment is anatomical (character's own left/right), not viewer-side** — this is the Seedance convention and must be used in all prompts:

- **Anatomical right hand** (viewer's left side of image): raised near the mouth, holding the yellow cupcake mid-bite.
- **Anatomical left hand** (viewer's right side of image): extended outward at hip/waist level, gripping the gold spoon handle with the chocolate-dripping bowl angled downward.

Body language is dramatic and theatrical — caught in a moment of indulgence. Weight is centered, feet planted shoulder-width, belly forward.

## Weapon
- **Primary**: Gold ladle/spoon (wielded as a spoon-club) — held at hip level in the canonical pose, chocolate dripping from the bowl. Cupcake in the other hand is an off-hand signature, not the weapon.
- **Natural one-beat action**: Raise the ladle/spoon overhead with a gleeful wind-up → bring it down in a smashing swing forward. Chocolate droplets fling during the arc. Surprisingly graceful for her size — heavy but not sluggish like Fat King.
- **Power move direction**: Sweet-then-savage — begins with her sweet open-mouthed surprise expression, escalates to a gleeful smash as the spoon comes down. Chocolate-splat VFX on impact (not green — see Seedance pitfalls). Optional bite-of-cupcake recovery beat after the smash for the "scary when angry, then instantly cute again" comedy. The spoon should lead; the cupcake stays in hand.
- **Source of truth**: CSV `Default Attack Style` — "Medium attack speed (graceful), medium melee range. Smashing with spoon club." Silviu notes — consumes cakes for random buffs / AoE damage (ability kit — ignore for power move).

## Personality Keywords
Dramatic, indulgent, pampered, comedic, expressive, food-obsessed

## Prompt Fragment
```
plump princess character, tall pink conical princess hat with a short white cloth
tassel at the tip and a small gold crown at the base, auburn hair in a back bun
with side-swept fringe, elaborate pink gown with decorative pink bows along the front and cream
lattice underskirt, cupcake held near the mouth in her anatomical right hand
(viewer's left), gold spoon with chocolate dripping from the bowl held at hip
level in her anatomical left hand (viewer's right), dramatic theatrical pose
```

## Character Brief (Client)

> **Note**: Per client, the Hero Screen / Victory / Defeat animation descriptions below are **inspiration and a rough starting point only** — not a strict spec. Use them as signals for tone and intent; propose stronger ideas when they serve the character better.

**Role & Traits** — Princess Beatrice of Narrowneck. Princess of the Empire. Gluttonous, very sweet demeanor, scary when angry.

**Hero Screen Animation** — She gives a sweet, graceful curtsy, then suddenly pulls out her spoon and gleefully licks it with a wide smile.

**Movement Style** — Heavy body but surprisingly graceful; slower movements but not as slow as Fat King.

**Victory Animation** — Sweetly curtsies, then gleefully licks her spoon.

**Defeat/Death Animation** — Falls forward flat on her face. Optional: drops spoon.

**Default Attack Style** — Medium attack speed (graceful), medium melee range. Smashing with spoon club.

