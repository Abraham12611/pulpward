# Groves, worlds, levels and encounters

## World strategy
A vertically scrolling illustration/map is for navigation **between** stages; actual gameplay remains fixed and bounded. The first Grove is vibrant daytime and the second twilight with high-contrast glowing enemies, to show art range while reusing mechanics. Each stage lasts 90s. An interstage reveal animates the map path, but the whole game can be played in under five minutes per session without lengthy lore.

## Map and stage list
| Grove | Stage | Theme | Teaching objective | Hazard | Clear unlock |
|---|---|---|---|---|---|
| Sunlit Terrace | 1 Orchard Alarm | Golden orchard gazebo | Basic swipe and Heartseed | None | 2 |
| Sunlit Terrace | 2 Violet Rain | Grape trellis, iridescent petals | Moving kiwi + split grapes | Cosmetic petal drift only | 3 |
| Sunlit Terrace | 3 Hard Shell | Shell-strewn terraces | 2-cut armor | Wind leaves hint direction, no physics force | 4 |
| Lantern Marsh | 4 Peel Storm | Luminescent water and lush trees | Peel Link reactions | Visible plank spans aesthetically separate lanes | 5 |
| Lantern Marsh | 5 Ember Branch | Sunset lantern grove | Projectile interception | Warning lantern pulse indicates attack lane | 6 |
| Lantern Marsh | 6 Seedheart Siege | Moonlit seed sanctuary | Boss sector cuts | Boss shadow warns zones | Endgame |

### Arena layout
390×700 logical viewport; scoreboard/UI at y=0–68, upper spawn ribbon y=85–155, active cut region y=135–585, Wardline y=580, Heartseed x=195 y=622, bottom action controls y=646–700. UI never obscures enemy hurtbox, and spawn warnings are clipped to the play field. On 16:9 desktop, expand decorative side art instead of stretching gameplay; keep enemy speeds in logical units/s. The Heartseed and collision geometry remain consistent across aspect ratios.

## Environment requirements
- Parallax layers: far sky, mid canopy, foreground leaves; maximum three layers in MVP. Clear enemy color contrast over every theme. Do not place fruit-looking background decorations at attack scale.
- Stage 1 entry: warm amber, creamy white clouds, turquoise/coral interface. Stage 4 entry: cool navy, glowing mint and lilac, with edge and shape highlights for non-color vision.
- Ambient motion: 10–15s tree sway, 1–2 sprite idle loops, occasional drifting seeds; pause all on browser hidden and reduce motion setting.
- Stage hazards in MVP are **non-damaging telegraphs**, because random damaging backgrounds would undermine one-finger readability. Later hazards must present ≥700ms preparation and deterministic seeds.

## Stage generation
The enemy plan is deterministic by `stageId`,`seed`,`balanceVersion`. Map decorations may use unseeded cosmetic randomness but cannot influence collisions, timer or score. A fixed sequence of 90 seconds is preferable to an endless procedural swarm for contest reliability. Stage 6 boss reserves 75–90 seconds. Stage selection and complete/unlock stored in local save; later stage visibility may be teased but clicking it opens a non-blocking unlock explainer rather than an artificial currency requirement.

## Events and reward beats
At 25–28s: optional golden Blight worth 2x standard points (no unique currency) on stages 2+. At 58–63s: one **Rush** telegraph: canopy shakes and spawning accelerates ≤20%; never sudden visual-only projectile spam. Stage 3 and 5 gain a 45s upgrade interlude; other stages remain continuous to keep pace. At 75s boss or crescendo. Pure Grove badge triggers only if no Heartseed damage attempt occurred.

## Content authoring schema
```ts
type StageConfig={
 id:string; worldId:'sunlit'|'lantern'; durationMs:90000;
 seed:number; paletteId:string; bgLayers:string[];
 unlockAfter?:string; allowedEnemies:string[];
 phaseBudgets:number[]; bossId?:'warden_pom';
 hazards:Array<{id:string;startMs:number;endMs:number;type:string}>;
 rewards:{clearPetals:number;pureBonus:number}; balanceVersion:string;
};
```
Config JSON must validate and reject unknown enemy IDs at build time. Designers can retheme backgrounds without altering physics. QA snapshots one frame at 0, 30, 60, 75s for each stage at 390×844 and 1366×768.

## Roadmap expansion guard
Only introduce a new Grove when it adds a distinct gameplay idea and at least three stage variations, not merely a new image. First expansion might be Frost Orchard: waxy fruit resistors and mirror shards; omit from contest. See [05](05-ENEMIES-WAVES-AND-BOSSES.md), [09](09-UI-UX-AND-VISUAL-DIRECTION.md), [20](20-FUTURE-EXPANSION-IDEAS.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
