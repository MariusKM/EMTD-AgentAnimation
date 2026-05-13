# P4 — Graceful Pirouette with Chocolate Ribbon (Seedance 2.0)

> Power movement | 6s | Static locked-off I2V | Source image = `Source/Heroes Stylized/mouth_closed/Fat_Princess.png`
> Concept: [concepts.md](../../concepts.md) — P4 (graceful body pirouette, chocolate ribbon wraps around her)

## Notes for this concept

- **Core beat is a BODY PIROUETTE, not a spoon-only twirl** — confirmed on first generation: Seedance interpreted "twirl" as a body rotation and the result was far stronger than a hand-only flourish. The character turns once gracefully in place while the spoon arm carves a wide arc around her, creating a chocolate-ribbon ring that visibly wraps around her silhouette.
- **Exactly ONE complete 360-degree rotation, ending facing forward** — more than one full turn produces dizzy chaining and breaks the FFLF return; less than a full turn leaves her facing away. Guard in Constraints with "turns exactly one complete rotation in place, ends facing forward toward the camera."
- **Character turns in place — camera does NOT orbit**. A body spin can trigger Seedance to interpret it as a camera move around a static character. Lead the Subject line with `static camera shot of...` and add "the camera does not orbit or rotate only the character turns in place" to Constraints.
- **Cupcake stays anchored in her right hand throughout the spin** — her right hand holds the cupcake near her face across the rotation so the cupcake orbits with her (not released, not pinwheeled out). Only the left/spoon arm extends outward to carve the ribbon.
- **Spoon arm extends outward during the rotation** — about shoulder height, creating the wide horizontal arc that generates the chocolate-ribbon trail. At the end of the rotation the spoon returns smoothly to hip.
- **Mouth-closed FFLF** — the entire loop can stay closed-mouth; a small pleased chin-up chef's-kiss smirk is the peak emotion, no open-mouth beat required.
- **VFX**: dark brown chocolate droplet ribbon following the spoon across the full rotation, wrapping around her in a full circle. Small pale-gold sparkle-ring briefly pulses at the peak of the rotation. No green.
- **Gown physics are a key read** — the pink skirt should flare outward from the centrifugal rotation, visibly separating from her body during the spin and settling back on the finish. Hat tassel flicks briefly with the rotation.

## Negative prompt (reference only — not forwarded by webapp)

```
walk cycle, running, jumping, falling, camera movement, camera shake, zoom, pan,
camera orbit, camera rotation around character, environment, background scenery,
talking, lipsync, voice, realistic proportions, photorealistic, static frozen image,
flat lighting, blue rim light, cyan edge light, blue edge glow, warped hands,
warped face, extra arms, dropping the spoon, multiple rotations, spin chain,
chained pirouette, ghost spoon, duplicated spoon, cupcake released, biting the cupcake,
cupcake deforms, ends facing away, green sparkles, hennin
```

---

Subject:     static camera shot of a plump princess character with a tall pink conical princess hat with a short white cloth tassel at the tip and a small gold crown at the base, auburn hair in a back bun with side-swept fringe, elaborate pink gown with decorative pink bows along the front and a cream-white lattice underskirt, holding a yellow cupcake near her mouth in her right hand and a gold spoon with dark chocolate dripping from the bowl at hip level in her left hand

Action:      from her canonical closed-mouth smirk her left hand lifts
             the gold spoon up from hip level to shoulder height and
             extends her left arm outward to her side, then her whole
             body begins to turn gracefully in place in a single smooth
             pirouette, rotating exactly one complete 360-degree turn
             with her feet staying on the spot, her extended left arm
             sweeps the gold spoon around her in a wide horizontal arc
             at shoulder height so that a ribbon trail of dark brown
             chocolate droplets streams off the spoon bowl and wraps
             around her full silhouette forming a full circular ring of
             chocolate droplets around her, her pink gown skirt flares
             outward from the rotation and her auburn hair and hat
             tassel flick with the spin, she completes the turn smoothly
             decelerating as she ends facing forward toward the camera
             again, she lowers the gold spoon back to hip level and
             lifts her chin with a pleased small closed-mouth
             chef's-kiss smirk as a small pale-gold sparkle-ring briefly
             pulses outward around her, and she settles into the
             canonical pose. Expression arc: content closed-mouth smirk
             -> focused closed-mouth smirk on the spoon lift and arm
             extension -> steady content closed-mouth smirk through the
             pirouette -> pleased closed-mouth chef's-kiss smirk with
             lifted chin on the finish -> content closed-mouth smirk on
             the settle. Her pink gown skirt flares outward during the
             pirouette and settles back on the finish, the small white
             tassel at the hat tip flicks briefly with the rotation, her
             auburn back bun stays tight and in place, the yellow
             cupcake stays firmly in her right hand near her face
             throughout the spin orbiting with her body never released
             and never deformed.

Camera:      50mm, medium-wide, locked tripod, static, full body centered, eye level

@Refs:       img1 = character appearance and canonical starting/ending pose

Style:       Supercell mobile game hero animation, stylized 3D chibi proportions,
             hand-painted saturated colors, bold outlines, Kingshot visual language

Sound:       no voice no dialogue no music, a soft swishing whoosh of the spoon sweeping through the air around her, a continuous stream of scattered chocolate droplet plips along the ribbon arc, a soft silk flare of the pink gown skirt during the spin, a soft pale-gold sparkle chime at the finish, a satisfied content nose-exhale at the end, no voice no dialogue no music

Constraints: always hold cupcake and spoon, no dialogue, pure green chroma key 0x00FF00 background only, static camera no movement or zoom no orbit no rotation around character only the character turns in place, the character turns exactly one complete 360-degree rotation in place and ends facing forward toward the camera not multiple rotations not a chained pirouette not less than one full turn, feet stay on the spot no stepping away, the yellow cupcake stays in her right hand near her face fully intact throughout the rotation never released never dropped never deformed icing peak pointing up orbiting with her body as she turns, the gold spoon stays in her left hand throughout never dropped arm extended outward at shoulder height during the rotation, the chocolate droplet ribbon is dark brown not green and wraps around her in a full circle, sparkle-ring is pale gold not green, the hat has only a short white cloth tassel at the tip not a long flowing veil or trailing banner, no blue rim light no environment, seamless loop first and last frame match canonical pose with mouth closed and the character facing forward toward the camera, 6s
