# Reference game — evidence-led reverse engineering

## Source and observation protocol
The direct user upload `VID_20261117_234857_839.mp4` was inspected as an approximately **26.97-second, 1080×1920, 30 fps** social-video compilation. The actual gameplay appears as a wide landscape strip inside a tall social post with persistent caption, not as an original full-resolution continuous gameplay capture. Frames were reviewed at 1-second intervals and at higher detail around 1, 4, 6, 10, 14 and 23 seconds. **Observed** below means visibly present in frames; **strong inference** is plausible but not demonstrated in uninterrupted controls; **unknown** needs hands-on confirmation. Social-video edits mean time ordering and run continuity cannot be assumed.

## Timestamped evidence ledger
| Approx. video span | Seen directly | Evidence confidence | Design takeaway |
|---|---|---|---|
| 00–04 s | Side-view grassy platforms, trees with fruit, glowing collectible-looking icons, character-like figure, enemies or boxes; explosion and combo labels such as `BOOM` and x2/x3 | High for visuals; low for cause of explosion | Layered 2D terrain + readable consequences make action fun to watch |
| 04–10 s | Overlay labeled **FRUIT INVENTORY** with entries including **Pineapple**, **Java Apple**, **Cas**; Pineapple description visibly says it explodes in a vertical beam when enemies are too close | High for text and visual inventory; uncertain controls | Between-combat selection creates strategic variation |
| 10–15 s | Different cooler blue terrain palette, a small figure on upper platforms, luminous beams, impact splashes, enemy/target indicators, HUD top corners | High visual, low causal | Recoloring and environment shifts support level freshness |
| 15–19 s | Repeated inventory choices overlay, icons entering slots, ongoing arena behind it | High | A finite list of deployable abilities may be manageable mid-run |
| 19–23 s | Tall bright vertical red/pink effect, bottom HUD and top percentage indicator change; upgrade shop transition | High | Combine charged spectacle with short upgrade interludes |
| 23–27 s | Upgrade cards labeled **Double Cas** (doubles thrown cas), **Colada Beam** (vertical explosion), **Empanada** (heals character for 3 HP) and **Reroll 20**; social overlay increasingly obscures view | High for legible card text | Three-choice upgrade moments encourage replayability |

## Mechanics taxonomy — observed versus inferred
1. **Objective:** Unknown; top-right percentage may track enemy wave, territory, progress or resource, not definitively tower health. Do not label it health as fact.
2. **Camera:** Side-on, layered orthographic/pixel-art view and multiple grounded platforms are seen. Camera may track a moving character; edits prevent continuous tracking proof.
3. **Player movement:** A small humanoid sprite changes platform positions between clips. Whether controlled by keyboard, AI or teleport is unknown. Jump/dash is an inference only.
4. **Approaching entities:** Colored square-faced objects and glowing cards float at several positions, and projectiles/particle streams traverse the frame. Their exact taxonomy and behavior are unknown.
5. **Attack:** Vertical beam and impact effects are clearly visible; inventory text confirms an automatic-proximity explosion for Pineapple. It does **not** prove swipe-to-slice or sword mechanics.
6. **Damage/failure:** Top-left meter and `Empanada` heal description strongly suggest player HP. Actual death screen absent; precise hit sources unknown.
7. **Difficulty:** HUD values, different terrain and repeated upgrades imply run escalation, but duration and spawn curves are not observable.
8. **Scoring:** Small numeric indicators, combo multipliers and a currency icon appear. Formula cannot be reconstructed.
9. **Movement/combat coupling:** Figure and fruit effects share a platform stage; positional proximity likely matters, but its code/aim logic are unknown.
10. **Game feel:** Beams, particles, smash text, color changes, rhythmic shots, HUD feedback and moments of visual abundance are evident even without source audio isolation.
11. **Accessibility:** Familiar platform ledges and prominent colored icons hint at intuitive goals; the short clip alone cannot establish onboarding quality.
12. **Retention:** Upgrade decisions and variable abilities plausibly create runs with different builds; not directly measurable from a highlight clip.
13. **Pain points:** Tiny pixels, a dense HUD and obstructing inventory on a small phone would be problematic **if reproduced as shown**; this is our usability assessment, not a measured flaw in the source.
14. **Adaptation:** Use the broad decision rhythm (combat > upgrade > larger effects) and discrete archetypes, but do not reproduce maps, avatars, interface, text, names, or sprites.

## Reverse-engineered loop hypothesis — NOT confirmed
Explore/hold position -> automatically triggered fruit powers -> collect experience/currency -> choose among upgrades -> increase wave pressure -> repeat, perhaps with a progress or difficulty meter. The video is consistent with this, but does not prove all steps, trigger methods or exact win/loss condition. No video-based claim should be used to justify precise timing or economy values for Pulpward; those are our new design.

## Transferable design principles
**Keep:** 2D immediacy; strongly contrasting collectible/enemy glyphs; fruit-themed interactions that generate impact; explicit upgrade choices; mid-run crescendo and environmental variety. **Replace:** platform navigation, pixel-scale sprites, the inventory card art/text, and automatic attack loop with clean, gesture-driven defensive slicing. **Avoid:** assuming that the reference is a game about slashing, a tower, specific enemies, or any observed score formula. **IP rule:** underlying ideas and broad game feel are references only; do not trace or recolor frames for assets.

## Evidence confidence register
| Claim | Confidence | Validation needed |
|---|---:|---|
| 2D layered platform arena | High | None |
| Fruit-themed upgrade inventory and vertical attacks | High | None |
| Combo-style HUD and explosion feedback | High | None |
| One player controls movement directly | Medium/low | Watch original unedited capture |
| Enemy AI pathfinding or waves | Low | Source-game gameplay test |
| Tower protection objective | Unsupported | Do not claim |
| Mobile swipe combat in original | Unsupported | Do not claim |

## How Pulpward changes the reference
The new game uses a bounded portrait-friendly defense field, single-pointer cuts, a protected Heartseed, enemy taxonomy, and deterministic 90-second rounds. The **Fruit Ninja** comparison describes the tactile goal of slicing, not an intent to reproduce that game's intellectual property. Art and audio are created from blank specifications. See [02](02-GAME-CONCEPT-EXPLORATION.md), [04](04-COMBAT-AND-SLASHING-SYSTEM.md) and [10](10-ANIMATION-VFX-AND-AUDIO.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
