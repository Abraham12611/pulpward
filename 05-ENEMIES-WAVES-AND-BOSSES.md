# Enemy taxonomy, spawn director and boss patterns

## Readability rules
Each enemy has a unique silhouette, motion and audio tell, not only a health bar. Never put visually equivalent fruit into two different roles; use edge icons for reduced-color perception. Early stages introduce at most one unseen archetype each. Every attack has ≥450ms telegraph unless it is an ordinary direct approach. Do not overwhelm a 390px-wide screen with more than six simultaneous urgent targets at the Wardline.

## Enemy catalogue (initial tuning)
| ID / shape | HP | Speed logical units/s | Contact damage | Base points | Unlock | Behavior / counter |
|---|---:|---:|---:|---:|---|---|
| `apple_scout` round red | 1 | 75 | 1 | 100 | Stage 1 | Linear descent, gold ripeness flash; any cut |
| `kiwi_dart` teardrop green | 1 | 125 | 1 | 140 | Stage 2 | 600ms windup then short sideways dash; cut crossing path |
| `grape_cluster` tri-lobed purple | 1+2 fragments | 65 | 1 each | 180 parent, 40 berry | Stage 2 | On death releases two slow berries; prioritize parent early |
| `coconut_armor` angular brown | 2 | 45 | 2 | 220 | Stage 3 | First cut cracks, second disarms; 1s between cuts minimum? **No**; 120ms only |
| `lime_splinter` spiked lime | 1 | 90 | 1 | 175 | Stage 4 | When cut, launches max three auto-targeting peel seeds to nearby minors |
| `dragonflare` horned magenta | 1 | 90 | 1 | 200 | Stage 5 | Telegraphs lane-fire projectile; slash projectile separately or kill caller |
| `warden_pom` boss pomegranate | 3 guard sectors | 35 | 2 | 1500 | Stage 6 | Each 8s cycle shows distinct bright wedge; damage only when cut through lit wedge |

**Grape fragments:** spawned with unique IDs and each at 40 points, 45 speed, never spawn new fragments. **Projectile:** bright triangular marker with 1 HP and 45 points; contact damage 1; no Spark gain. All visual/collision boxes authored by designer as gameplay data with stable IDs. Stage-specific palettes may vary without changing role colors/silhouettes.

## Director algorithm
- Six phases in 90s stage: 0–15 warmup, 15–30 variation, 30–45 defense pressure, 45–60 mixed pattern, 60–75 rush, 75–90 finale.
- `phaseBudget = floor(4 + 1.3 * p + 0.6 * stageIndex)` where `stageIndex` 0–5 and p 0–5. Each archetype has threat cost: apple 1, kiwi 1.5, grape 2, coconut 2.6, splinter 2.2, dragonflare 2.8, boss reserve 7.
- At most 2 spawns per 500ms; positions 15–85% width; avoid pair spawns with <40 logical units separation; enforce open corridor if HP ≤2.
- `dangerPressure = Σ(1/max(0.25,timeToWardline))` capped to 9; director delays a heavy when pressure >8. Strong events are scheduled by stage seed and phase, not random on every frame.
- Use seeded `xorshift32` PRNG on integers; no `Math.random()` for gameplay. Freeze `balanceVersion` per run. FPS cannot change spawns.

```ts
type EnemyArchetype = 'apple_scout'|'kiwi_dart'|'grape_cluster'|'coconut_armor'|'lime_splinter'|'dragonflare'|'warden_pom';
type SpawnPlan = { atMs:number; archetype:EnemyArchetype; lane:number; elite?:boolean };
function makePhase(seed:number, stageIndex:number, phase:number):SpawnPlan[] {
 const rng=xorshift32(seed ^ (phase*2654435761));
 const budget=Math.floor(4+1.3*phase+0.6*stageIndex);
 return packThreatBudget(budget,allowedEnemySet(stageIndex),rng,{minGapMs:450,maxLateUrgent:6});
}
```

## Boss — Warden Pom
Visual: segmented dark ruby rind protecting a luminous seed, almost like a little fruit-armored fortress. Boss enters with 3 lit rind sectors, **one vulnerable sector at a time**, clearly represented by an outlined wedge and audio rising note. Each sector lasts 8s; only a cut crossing the white core of lit wedge removes one guard. Damage from Bloom Burst may remove at most one segment and immediately imposes a 2s protection. Projectiles telegraphed 800ms. Boss reaches Wardline at 90s if uncleared; normal stage completion requires all sectors broken before the countdown expires. For accessibility, provide an assist setting with 11s vulnerability windows; exclude assist runs from ranked comparisons.

## Waves by stage
| Stage | Spawn pool | New twist | Finale |
|---|---|---|---|
| 1 Orchard Alarm | apple | tutorial pure streak | Apple Rush (no boss) |
| 2 Violet Rain | apple, kiwi, grape | first splitting enemy | Grape shower |
| 3 Hard Shell | + coconut | armored two cuts | Armored caravan |
| 4 Peel Storm | + lime | peel chains | Triple split alignment |
| 5 Ember Branch | + dragonflare | projectile intercept | Paired flyer |
| 6 The Seedheart Siege | all | boss telegraphs | Warden Pom |

## Edge cases and acceptance
Spawn deterministically using seed 42: 100 repeated runs must yield the same `SpawnPlan` JSON hash. No enemy can spawn on/in Heartseed, repeat own contact damage, inherit parent armor indefinitely or produce infinite fragments. A fatal 2-HP coconut hit when HP 1 clamps HP to zero. If the last boss wedge is removed at t=89.99s, register victory before time-expiry resolution in stable event order. See [03](03-GAME-DESIGN-DOCUMENT.md), [17](17-QA-PERFORMANCE-AND-SECURITY.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
