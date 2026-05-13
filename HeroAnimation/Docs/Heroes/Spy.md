# Spy

> Source: `Source/Heroes Stylized/Spy.png` | Mouth-closed variant: `Source/Heroes Stylized/mouth_closed/Spy.png`

## Role
The infiltrator and intelligence operative — sneaky, cunning, and always one step ahead. A rogue-archetype character with a darkly humorous edge.

## Physical Description
- **Build**: Lean and angular, slightly hunched in a sneaking posture — the most dynamic pose in the roster
- **Skin**: Tan/olive with warm shadows
- **Hair**: Not visible (covered by hood)
- **Facial features**: Pronounced pointed nose (the largest and most angular nose in the roster), sharp chin
- **Eyebrows**: Heavy, dark, angled — a primary personality read. The brow shape drives the "scheming" expression and should remain readable at all times.
- **Expression**: Sly, devious grin — one side of the mouth pulled up higher. Knowing, mischievous, trollface-adjacent.
- **Eyes**: Brown, narrow and shrewd, partially hooded. Hood casts a soft shadow across the forehead that intensifies the eyes.

## Costume & Equipment
- **Hood/cloak**: Full dark brown hooded cloak covering head and shoulders — the defining visual element
- **Tunic**: Dark brown layered outfit, muted earth tones throughout
- **Belt**: Brown leather belt with small leather satchel/pouch at the hip
- **Strap**: Diagonal cross-body leather strap (for quiver)
- **Boots**: Dark brown leather boots with tan cuffed tops (two-tone)
- **Primary weapon**: Hand crossbow — compact, mechanical, wooden and metal construction. In the canonical pose the crossbow is **already loaded and aimed/ready** (bolt in place, weapon held low-ready, not mid-reload).
- **Secondary**: Arrow/bolt quiver on back, filled with white-feather-fletched bolts, extending above the shoulder line

## Color Breakdown
| Element | Primary Color | Secondary |
|---------|--------------|-----------|
| Hood/cloak | Dark brown | — |
| Outfit | Dark brown/charcoal | — |
| Leather gear | Medium brown | Brass buckles |
| Crossbow | Wood brown | Metal gray mechanisms |
| Quiver/bolts | Brown leather | White feather fletching |
| Satchel | Tan/medium brown | — |

## Pose Description
Hunched forward in a sneaking stance, three-quarter view. Crossbow held two-handed at waist level, **loaded and aimed low-ready**. Weight forward on the balls of the feet. Head tilted slightly with the knowing grin — caught mid-stealth.

## Weapon
- **Primary**: Hand crossbow — compact, wood-and-metal, held two-handed at waist level in the canonical pose. Bolt already nocked (weapon is loaded and low-ready, not mid-reload). Quiver of white-fletched bolts on back.
- **Natural one-beat action**: Raise the crossbow from low-ready up into aim → loose the bolt forward with a mechanical snap. Narrative-beat variant (matching the tax-collector/Spy reference gold standard): a short aim-shift or glance-then-fire for personality. Medium speed — fast but ungraceful, snappy and weight-forward.
- **Power move direction**: Trollface aim-and-loose. Pre-aim devious grin → focused intensity during aim → satisfied smirk after the loose. Bolt flies forward (short streak VFX). The fourth-wall break can live either in the approach (a direct-to-camera grin before aiming off-axis) or the recovery (a trollface grin to camera after the shot). **Avoid chained head snaps / double-takes** during the power beat — Seedance morphs the fletched bolts and quiver on rapid head motion (see Known Issues in CLAUDE.md).
- **Source of truth**: CSV `Default Attack Style` — "Medium attack speed. Reload between shots: lowers crossbow, inserts arrow, aims crossbow. Professional fighter." Silviu notes — "Uses dirty AoE attacks like smoke and poison bombs, poison attacks etc. Goes stealth, and strikes backline heroes" (dirty tricks / stealth are ability kit — ignore for power move; keep it to the clean crossbow shot).

## Personality Keywords
Cunning, sneaky, devious, shrewd, mischievous, stealthy, expressive, theatrical, wired, restless, slightly unhinged (in a funny way)

## Animation Notes
The Spy is the **gold standard for personality and facial expression arcs** across the roster (confirmed by the Spy reference video analysis in `StyleGuide_Animation.md`). He relies more on expression changes than any other hero:
- Expression should visibly shift within every loop — devious grin → focused aim → satisfied smirk → sly glance, or similar progression
- Lean hard into the **jovial/comical Supercell tone** (client direction) — fourth-wall breaks, direct-to-camera trollface beats, and self-satisfied reactions are all on-brand for this character
- The client brief explicitly calls out a **"trollface" grin** and **direct-to-camera** beats — treat these as first-class animation signals, not just flavor text
- Motion style is "fast but ungraceful" — snappy, slouched, weight-forward; no balletic elegance

### Idle Energy: Wired, Restless, Unhinged (expressive variants only)
Per the client rule of 2026-04-22, Spy still gets a **mandatory breathing-only baseline idle (I1)** like every other hero — simple chest rise/fall with minimal secondary motion. It is the safe fallback the team can always pick, even for him.

All **expressive idle variants (I2, I3, ...)**, however, must feel **wired, restless, nervous, slightly unhinged** (in a funny way). He's always scheming, always on the edge of something. When designing non-baseline idles for Spy, avoid generic calm breathing and let the whole body telegraph that he's about to do something.

### Idle Fidget-Target Principle
When designing multiple idle variants for Spy, spread them across **distinct fidget targets** so the set feels dynamic rather than repetitive. Observed mapping from 2026-04-16 session:
- **Head** — paranoid scans over the shoulders
- **Face/eyes** — drifting schemer's gaze with "idea strikes" beats and silent chuckles
- **Weapon** — single clean crossbow heft / weight-check
- **Off-hand + satchel** — rummaging to reassure himself his dirty tricks are still there
- **Shoulders/neck** — wired neck-crack unwind, warming-up-for-violence beat
- **Outward gaze** — spotting off-camera targets, predator double-takes (this one is higher I2V risk — see Known Issues)

### I2V Motion Granularity
**Avoid sub-beat micro-fidgets** — finger drumming, eyelid twitches, lip ticks, individual fingers moving. I2V models cannot resolve them reliably and they waste generation budget. Use **one clear sustained beat per second** instead — a heft, a snap, a spread. When an earlier concept depends on a micro-motion (e.g. "fingers drum on the crossbow stock"), replace it with a single larger readable action before prompting.

## Prompt Fragment
```
sneaky hooded rogue character, dark brown cloak and hood, pointed nose,
sly devious grin, holding hand crossbow, arrow quiver on back with feathered bolts,
leather satchel on belt, hunched sneaking posture, all earth-tone browns,
mischievous expression
```

## Character Brief (Client)

> **Note**: Per client, the Hero Screen / Victory / Defeat animation descriptions below are **inspiration and a rough starting point only** — not a strict spec. Use them as signals for tone and intent; propose stronger ideas when they serve the character better.

**Role & Traits** — Anon Nymous the Sneak, player's spy master. Face inspired by the trollface meme. Sneaky character in charge of espionage and sabotage. Shifty, still loyal to player. Uses dirty tricks.

**Hero Screen Animation** — He crouches in a slouched, sneaky pose, looks directly at the camera with a wide "trollface" grin, and gives a mischievous chuckle.

**Movement Style** — Fast movements, but no grace; walks slouched, as if sneaking.

**Victory Animation** — Chuckles gleefully with a trollface grin, looking directly at the camera to break the fourth wall.

**Defeat/Death Animation** — Trips comically and falls flat on his face. Alternative: disappears in a puff of smoke (not really dead?).

**Default Attack Style** — Medium attack speed. Reload animation between shots — lowers crossbow, inserts arrow, aims crossbow. Professional fighter.

