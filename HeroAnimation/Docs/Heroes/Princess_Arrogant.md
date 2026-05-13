# Princess Arrogant

> Source: `Source/Heroes Stylized/Princess_Arrogant.png`

## Role
The deadly noble — elegant, dangerous, and supremely confident. She weaponizes her royal status and carries concealed blades disguised as fans. A femme fatale archetype.

## Physical Description
- **Build**: Slim and poised, elegant posture with an S-curve silhouette
- **Skin**: Fair with warm undertones, clear complexion
- **Hair**: Rich auburn/red, styled in an elaborate updo/bun secured with a gold headband/tiara
- **Expression**: Cool, knowing smirk — half-lidded eyes, one eyebrow slightly raised. Radiates superiority and amusement.
- **Eyes**: Dark brown/amber, heavily lidded, looking slightly down at the viewer
- **Accessories**: Small gold drop earrings

## Costume & Equipment
- **Crown**: Tiny gold crown/tiara perched atop the updo — subtle and refined
- **Dress top**: Rich gold/amber fitted bodice with puffed short sleeves — armored or structured, suggesting hidden protection
- **Skirt**: Layered — gold outer dress panels with decorative scalloped trim, revealing a deep crimson red underskirt/petticoat
- **Waist**: Gold sash/belt area where the dress panels connect
- **Boots**: Not prominently visible, implied beneath the long dress
- **Weapons**: Two metal folding war fans — sharp-edged, silver/steel, held open in each hand. The fan blades are visibly sharp and pointed. One held up near the face, the other at hip level.

## Color Breakdown
| Element | Primary Color | Secondary |
|---------|--------------|-----------|
| Hair | Rich auburn/red | Gold headband |
| Crown | Small gold | — |
| Bodice/dress | Rich gold/amber | Puffed sleeves |
| Underskirt | Deep crimson red | — |
| War fans | Silver/steel | Sharp pointed edges |
| Earrings | Gold | — |

## Pose Description
Elegant three-quarter view with an S-curve posture. Right hand holds one war fan open near the face at chest height — partially concealing the smirk. Left hand holds the second fan open at hip level. Shoulders slightly turned, chin tilted up — the pose of someone looking down on everyone else.

## Weapon
- **Primary**: Two metal folding war fans — sharp-edged, silver/steel. One held open near the face at chest height (anatomical right hand, viewer-left side of image), the other open at hip level (anatomical left hand, viewer-right side of image).
- **Classification**: Held props (hand-attached) ×2. Apply Fat-King "always-hold" Constraint pattern in Stage 3 (`one fan in each hand always`). Both fans must be present and identical-shape at FFLF first/last frame.
- **Natural one-beat action**: Sharp snap-close → snap-open of both fans in rhythm, finishing in a short crossing slash forward OR a haughty face-veil flutter after the slash. Fast, graceful, short-range.
- **Power move direction**: Deadly elegance — snap-slash with both fans in a quick cross, then snap-fold back to canonical with nose-up dismissal. Keep the smirk half-lidded throughout; comedy comes from the disdainful attitude (chin-lift, eye-roll, dismissive flutter), not expression changes. Hair and dress ruffle as secondary motion on the snap.
- **Boomerang throw allowance** (locked 2026-05-06): Fan throws are valid power moves **if** the thrown fan returns to her hand before loop end so the FFLF first/last frame matches. Single-fan boomerang or dual-fan boomerang both viable; spinning fan-blade VFX trails are on-brand for the spectacle slot.
- **Source of truth**: CSV `Default Attack Style` — "Fast attack speed, short melee range. Slashes with both fans. Not a professional fighter." Silviu notes — "Agile hero who unleashes whirlwind attacks, lifts into the air and dashes down with spinning fan strikes" (whirlwind/aerial = ability kit — ignore for power move; the fan-slash + boomerang throw are the on-screen beats).

## FFLF Integrity Constraints
- Both fans must appear open and identical-shape at t=0 and t=loop_end (canonical pose match).
- Boomerang throws OK only if fans return to canonical hand positions by loop end.
- Hair updo and tiara stay intact (no hair-down reveal).
- Skirt layering must return to canonical drape on the final frame.

## Token-Collision / Over-Read Audits (Stage 1 lock)
- **`fan` + `blade`/`slash` adjacency**: war fans have sharp metal ribs; pairing `fan` with `blade`/`slash` risks Seedance morphing the fan into a sword/dagger on dynamic motion (Wilhelm `axe-head → halberd-blade` family). **Stage 3 wording**: prefer `metal folding war fan with sharp pointed steel ribs` or `silver fan-blade ribs`; avoid standalone `blade` near the fan; anchor silhouette geometry early in Subject (Architect P4 fix).
- **`skirt` over-read**: layered gold-overskirt + crimson underskirt. Lock as `floor-length crimson underskirt with layered gold scalloped overskirt panels with small gold pendant tassels above` to prevent collapse to a single flowing gown.
- **`tiara`**: small — no `crown` over-read risk noted, but keep `small gold tiara perched atop the auburn updo` for length specificity.
- **No content-bearing surfaces** in the costume (no scrolls/banners/books) — the Herald 2026-05-05 blank-surface rule does not apply.

## Personality Keywords
Elegant, dangerous, arrogant, calculating, superior, deadly, refined

## Prompt Fragment
```
elegant deadly princess character, auburn red hair in elaborate updo with gold tiara,
rich gold dress with crimson underskirt, gold drop earrings, holding two sharp silver
war fans, cool superior smirk, half-lidded eyes looking down, S-curve elegant pose,
femme fatale noble aesthetic
```

## Character Brief (Client)

> **Note**: Per client, the Hero Screen / Victory / Defeat animation descriptions below are **inspiration and a rough starting point only** — not a strict spec. Use them as signals for tone and intent; propose stronger ideas when they serve the character better.

**Role & Traits** — Princess Augusta of Needlingbeck. Princess of the Empire. Arrogant and nagging, very self-centered and demanding.

**Hero Screen Animation** — She snaps her fans open and haughtily fans herself, tilting her nose up and looking away with a demanding expression.

**Movement Style** — Fast movements, with grace; light body weight.

**Victory Animation** — Haughtily fans herself, hiding her face behind fans, nose held high.

**Defeat/Death Animation** — Faints dramatically, throwing a hand over her forehead while falling back.

**Default Attack Style** — Fast attack speed, short melee range. Slashes with both fans. Not a professional fighter.

