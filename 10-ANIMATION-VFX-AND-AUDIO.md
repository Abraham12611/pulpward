# Animation, juice, sound and performance-adaptive effects

## North-star impact sequence
Every successful swipe executes: **0ms** pointer trail begins; **≤16ms** trail visually follows pointer; **≤33ms** enemy reacts with brief squash/cut, clean central split; **30–120ms** peel halves separate and splash; **90–350ms** droplets arc and fade; **≤400ms** score chip collapses into HUD. Interactions remain physically readable: never bury a second live enemy under particles. Impact freeze 30–40ms reserved for boss armor break or ≥4-enemy cut; normal attacks never freeze the global stage.

## Effect tiers
| Tier | Particles per cut | Trail points | Canvas DPR cap | Dynamic lighting | Target |
|---|---:|---:|---:|---|---|
| High | 14 | 18 | 2.0 | 1 fake highlight layer | stable 60fps typical laptop |
| Medium | 8 | 12 | 1.5 | sprite highlight only | stable 50–60fps mid phone |
| Low | 4 | 8 | 1.0 | none | ≥30fps modest phone |
| Reduced motion | 2 | 5 | by tier | none | no shake, quick cuts |

Auto-select medium on first frame, measure rolling 120 frames; if median FPS <48 for 3s, lower one tier; >57 for 20s permit upgrade at most once every minute. Never change collision rules, hitbox sizes, clock progression or score based on tier. Limit particle pooling to 60/100/140 as low/medium/high and projectile trails to 30; recycle objects instead of fresh allocation in hot loops.

## VFX palette and design
Normal slice: warm pulp droplets colored to fruit, white-hot seam for 2 frames, 2 peel halves spring ±15 degrees, thin mint-ribbon blade trail; clean cut: 1 golden diamond ripple + audio `tink`; triple cut: angled score popups and restrained outward starlets; Bloom Burst: a radial leaf ring expanding across the court over 200ms with a 150ms advance telegraph, **no white screen flash**. Heartseed hit: low-frequency quiver, -1 card and momentary red rim; avoid global strobing. Boss guard break: rind fracture, clustered citrus spray, one soft camera nudge of ≤3 px.

## Animation specification
- Miri: idle 8 frames at 8fps; attack lean 4 at 20fps; anticipation max 33ms (does not delay hit); win 6 frames 10fps; sad 4 frames 6fps.
- Apple Scout: 6-cycle bob 8fps; kiwi dart: 200ms squash before accelerated sideways move; grape: clusters split into two elastic berries with deterministic arcs; coconut: first cut crack decals (no second health bar needed); Warden Pom: distinct wedge glow and 8-second sector rotation.
- UI panel entrance 160ms cubic-out; stage victory <=500ms, share card 220ms. All animated menus permit immediate input before transition ends.

## Original sound identity
Musical language: bright kalimba/xylophone-pluck mallets, brushed percussion, elastic pizzicato, a simple original 4-note seed leitmotif. Sounds from newly created synthesis or properly licensed libraries with attribution ledger. Five event busses: `slice` (2 variants), `impact` (3 materials), `reward` (combo/petal), `danger` (Heartseed/crack), `music` (ambient/intensity layers). Polyphony: max 6 slice voices/100ms and 12 voices total, compress peaks under −1 dBFS. Main music muted by default until a user interaction; autoplay policy must be respected. Pause/rerun disposes all playing instances.

## Sound event map
| Event | Sound | Layering | Mix priority |
|---|---|---|---|
| Stroke through ordinary fruit | airy swish + juicy pop | random-pitch ±3% seeded cosmetically | medium |
| Clean cut | short glassy bell | 1 note 1–3 kHz | medium |
| Armored coconut first cut | wooden crack | replace juicy pop with low thud | high |
| Damage to Heartseed | warm low hit + mute 80ms music | one per grace period | highest |
| Bloom Burst | leaf rush + 3-note rising chime | limit to 800ms | high |
| Victory | original 4-note triumph | duck background −6dB | high |
| Defeat | gentle descending two-note motif | no harsh failure buzzer | medium |

## Pipeline and provenance
Source illustration SVG/PSD -> sprite atlas WebP/AVIF or lossless PNG where alpha requires -> precompressed image variants (1x/2x), fonts WOFF2, compressed OGG/MP3 optional fallback. Keep each stage preload ≤1.2MB initial art+audio on average mobile, cumulative first-play download budget ≤3MB gzip/brotli where feasible. Avoid heavyweight general particle engines. Maintain `ASSET-LICENSES.csv` in repo with asset ID, author/source, license, evidence URL and transformation method; verify promotional video audio rights separately.

## Acceptance
100 rapid cuts should not leak AudioNodes or particle objects. Effect downgrades leave score identical in deterministic replay. Hidden browser pauses music, no autoplay rejection blocks PLAY; low effects allows users to distinguish split/armor/perfect events. See [17](17-QA-PERFORMANCE-AND-SECURITY.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
