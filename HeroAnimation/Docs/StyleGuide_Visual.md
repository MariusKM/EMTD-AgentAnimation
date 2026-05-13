# EMTD Visual Style Guide

> Extracted from the canonical hero art in `Source/Heroes Stylized/`. This guide defines the visual design language for all character-related prompt engineering.

## 1. Overall Aesthetic

**Style family**: Stylized mobile game art in the vein of Supercell (Clash of Clans, Clash Royale) and Kingshot. The look sits between cartoon and hand-painted illustration — appealing, readable at small scale, and full of personality.

**Tone**: Warm, inviting, and slightly humorous. Characters feel like they belong in an animated feature — expressive and charming even when menacing.

## 2. Character Proportions

- **Chibi / super-deformed ratio**: Approximately **2.5 to 3 heads tall**. Large heads relative to compact, stocky bodies.
- **Head size**: Oversized, roughly 30-35% of total character height. This drives readability and expressiveness.
- **Hands**: Slightly enlarged relative to realistic proportions — about 1.5x — for visual weight and gestural clarity.
- **Feet/boots**: Chunky and grounded. Wide, flat soles give characters a planted, stable silhouette.
- **Body types vary by character**: From slim (Princess Sweet, Diana) to very rotund (Fat King, Fat Princess, Merchant), but all share the short-stature chibi skeleton.

## 3. Facial Features & Expressions

- **Eyes**: Large and expressive with clear iris color and visible highlights/catchlights. Eye shape communicates personality — round and wide for friendly characters (Herald, Princess Sweet), narrow and angled for cunning/stern ones (Spy, Count Wilhelm, Moneybags).
- **Eyebrows**: Thick, prominent, and highly expressive. A primary tool for conveying emotion — arched for mischief, furrowed for sternness, raised for surprise.
- **Noses**: Exaggerated and varied — from small button noses (princesses) to large bulbous or pointed noses (Spy, Architect, Merchant). A key personality differentiator.
- **Mouths**: Expressive with visible teeth in many characters. Smirks, grins, open-mouth surprise. When closed, lips are simple and clean.
- **Facial hair**: Prominent where present — full beards (New King, Blacksmith), handlebar mustaches (Architect, Blacksmith), goatees (Moneybags). Always stylized with clear shape grouping.

## 4. Color Palette

### Primary Color Tendencies
- **Rich, saturated colors** with warm undertones dominating: greens, teals, golds, reds, browns
- **Earth tones for grounding**: Brown leather, tan parchment, dark wood tones on boots/belts/accessories
- **Jewel-tone accents**: Emerald green, ruby red, sapphire blue, amber gold on gems and decorative elements
- **Metallic rendering**: Gold is warm and buttery (not chrome-yellow). Silver/steel is cool blue-gray with painted highlights.

### Per-Archetype Palettes
| Archetype | Dominant Colors | Accent Colors |
|-----------|----------------|---------------|
| Royalty (Kings, Princesses) | Teal, crimson, gold | Emerald, sapphire gems |
| Warriors (General, Count Wilhelm) | Silver, steel gray | Red capes/plumes, gem accents |
| Rogues (Spy, Moneybags) | Dark brown, navy | Gold trim, red berets |
| Scholars (Architect, Herald) | Green, blue | Gold glasses/buckles, parchment tan |
| Common folk (Blacksmith, Merchant) | Brown, olive green | Red/teal cloth accents |

### Skin Tones
- Warm, peachy-tan base with soft orange/pink undertones
- Subtle ambient occlusion in warm shadow tones (never gray or cool shadows on skin)
- Rosy cheeks and nose tips on lighter-skinned characters

## 5. Rendering & Shading Style

- **Technique**: Hand-painted digital illustration look — smooth gradients with visible brushwork texture
- **Lighting**: Single dominant **top-left key light** with warm temperature. Soft fill from opposite side.
- **Shadows**: Painted soft shadows, not hard-edged cell shading. Shadow colors shift warm (brown/purple), never pure black.
- **Highlights**: Painted specular highlights on metals, gems, and eyes. Soft rim lighting on hair and shoulders.
- **Edge treatment**: Clean, slightly visible dark outlines on the character silhouette. Internal lines are softer/thinner or implied through value changes.
- **Material differentiation**:
  - *Leather*: Matte with subtle grain, warm brown tones
  - *Metal/armor*: High-contrast reflections, blue-gray base with bright white highlights
  - *Fabric/cloth*: Soft folds with gentle gradients, slight texture
  - *Gems*: Faceted highlights with bright core reflection and colored glow
  - *Hair*: Grouped into large shape masses with painted strand details on edges
  - *Skin*: Smooth subsurface scattering feel, warmest material on the character

## 6. Costume & Equipment Design

- **Silhouette-first design**: Every character has a distinctive, instantly readable silhouette driven by headwear, weapon, and body shape.
- **Medieval-fantasy setting**: Tunics, capes, armor, crowns, leather belts and boots. No modern elements.
- **Functional accessories**: Each character holds or carries items that define their role — scrolls for scholars, weapons for warriors, food for the merchant, coins for moneybags.
- **Layering**: Characters wear multiple visible layers (undershirt, tunic, belt, cape/cloak, accessories) that create visual depth and interest.
- **Gold trim and buckles**: A unifying design motif across the roster — gold buttons, belt buckles, clasps, and decorative borders tie the cast together.
- **Capes and cloaks**: Very common across the roster. Draped with weight, slightly lifted or swept to add dynamism to the pose.

## 7. Pose & Composition

- **Three-quarter view**: Characters are consistently presented at a slight three-quarter angle (roughly 15-30 degrees from front-facing), turned slightly to the viewer's left or right.
- **Active poses**: Characters are never in a neutral standing pose. They are mid-action or holding their signature item in a way that implies movement and personality.
- **Weapon/item presentation**: Signature items are held prominently, often at chest or shoulder height, positioned to be clearly readable in the silhouette.
- **Weight distribution**: Characters lean slightly forward or into their action, giving a sense of energy and engagement.
- **Camera framing**: Full body, head to toe, with minimal cropping. Characters fill the frame vertically.

## 8. Background & Presentation

- **Transparent/clean background**: All character art is rendered on transparent or near-white backgrounds.
- **Subtle watermark**: A faint geometric/shield watermark is visible behind characters in the source art (this is part of the source files, not to be reproduced in generated content).
- **No environmental context**: Characters are presented as isolated figures — no ground plane, no scenery.
- **Drop shadow**: Minimal to none. Characters appear to float slightly or have very soft contact shadow.

## 9. Prompt Engineering Keywords

When generating content in this style, the following keywords and phrases should be used as building blocks:

### Style Tokens
```
stylized mobile game character, Supercell art style, Kingshot visual style,
chibi proportions, 2.5-head-tall character, hand-painted digital illustration,
medieval fantasy, kingdom builder game art
```

### Rendering Tokens
```
soft painted shading, warm lighting, top-left key light, visible brushwork,
saturated colors, rich jewel tones, gold accents, leather and metal materials,
clean dark outline, expressive cartoon face
```

### Composition Tokens
```
three-quarter view, full body portrait, transparent background,
active character pose, signature item held prominently, clear readable silhouette
```

### Anti-Tokens (avoid these in prompts)
```
realistic proportions, photorealistic, anime style, pixel art, flat shading,
cell shading, dark/gritty, modern clothing, sci-fi elements, gray shadows
```
