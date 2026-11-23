# Combat, input and slashing implementation

## Input philosophy
One pointer does everything. **Miri**, the animated sprite guardian at the Heartseed rail, follows successful slash locations with a 90ms lean/dash animation that has no collision authority. The finger is the blade, so no dual joystick vs. swipe conflict exists. If later added, direct character movement must be an entirely separate mode, never stacked with swipe controls by default.

## Coordinate system
Game world nominal 390×700 logical units (landscape gets safe side gutters; content centered at ~16:9/9:16 adaptive bounded court). `sx = canvas.width / logicalWidth`, `sy = canvas.height / logicalHeight` with **uniform** scale `min(sx,sy)`, letterboxing. Convert `PointerEvent.clientX/Y` using `getBoundingClientRect()` to logical coords; account for devicePixelRatio, CSS scale and safe insets. All collision uses logical units, never screen pixel delta.

## Pointer pipeline
```ts
type Point = { x:number; y:number; t:number };
type Stroke = { id:number; points:Point[]; hitIds:Set<string>; success:boolean; misses:number; startedAt:number };
function pointerDown(e:PointerEvent){
 if (state!=="Playing"||activeStroke) return;
 canvas.setPointerCapture(e.pointerId);
 activeStroke={id:e.pointerId, points:[world(e)],hitIds:new Set(),success:false,misses:0,startedAt:now()};
}
function pointerMove(e:PointerEvent){
 if (!activeStroke||e.pointerId!==activeStroke.id)return;
 const next=world(e); const prev=activeStroke.points.at(-1)!;
 const distance=Math.hypot(next.x-prev.x,next.y-prev.y);
 if(distance<2)return;
 // Resample long pointer jumps into maximum 16-unit segments.
 for(const [a,b] of resample(prev,next,16)) collideSegment(a,b,activeStroke);
 activeStroke.points.push(next); emitTrail(next);
}
function pointerUp(e:PointerEvent){
 if(!activeStroke||e.pointerId!==activeStroke.id)return;
 finalizeStroke(activeStroke); activeStroke=null;
}
```
On `pointercancel` safely end, do not award extra misses. On `visibilitychange` pause and release capture. `touch-action:none` only on `canvas` and wrapper; prevent context menu within arena. Ignore extra touches unless accessibility setting allows two-finger pausing (post-MVP). Do not block browser zoom globally.

## Collision qualification
An enemy uses a circle hitbox `r` = 65–80% of its visible half-width, or convex hull for bosses. Test segment/circle by projecting enemy center onto segment `A->B`, clamping `t∈[0,1]`, and checking `|P-center| <= r + bladeWidth/2`. Treat path as capsule, not a sample of pointer endpoints. Minimum purposeful stroke: path length ≥12 logical units and at least two distinct sampled points. Fast swipes never tunnel. Process enemies by front-to-back depth, stable `entityId` tie-break. Each entity receives at most one hit from each stroke; invulnerability 120ms after a cut. Prevent a single massive mouse sweep >650 logical units per 140ms from registering implausible screen-clearing hits in ranked mode; local arcade is more forgiving.

## Direction and precision
Slash speed from the median of recent nonzero segment `distance/dt`, clamped against event timestamp anomalies. A Clean Cut needs enemy ripeness indicator `ripeUntil >= t` (gold halo active for 650ms before reaching Wardline), a usable stroke path length ≥28 and intersection with a centered sweet spot radius = 45% of hurtbox. The indicator is visual **and** shape-based: concentric diamond + subtle audio ping, not color alone. Precision bonuses do not depend on device sampling rate: intersection geometry and window evaluate in simulation time.

## Combos and damage
Normal apple 1 hit, dart kiwi 1, grape cluster 1 + two berries, coconut 2, splinter lime 1 but fragments, boss 3 guard sectors. Cleave deals one stack per stroke, except effect-granted cleave. Multi-kill strokes award `multi = floor((kills-1)*15)` once, max +60. Combo multiplier after applying this stroke: thresholds 3/6/10/18/30 -> 1.25/1.5/2/2.5/3.0. A missed swipe only counts when inside arena, ≥12 units, and not within 60ms of a UI control becoming active. If two misses or streak idle >1.4s => reset. Success results invoke an ordered game event pipeline, not arbitrary React state updates:

```mermaid
flowchart LR
 A[Pointer segment] --> B[World transform]
 B --> C[Collision candidates]
 C --> D[Hit validation]
 D --> E[Combat event queue]
 E --> F[HP and split]
 F --> G[Score and Spark]
 G --> H[VFX and audio]
 H --> I[Run receipt]
```

## Defensive interaction
A Blight crossing the bottom Wardline collides once with Heartseed shield; it cannot strike twice. Compute `damage = min(contactDamage, 2)` and apply 250ms shared grace cooldown. Destroy enemy on collision to avoid pileups. On damage, reduce score streak by 2 (min 0) rather than all progress; never erase accrued Petals.

## Performance and test vectors
- Collision work: spatial hash 64×64 cells; per segment query crossed cells expanded by max enemy radius. Cap normal onscreen enemies at 18, active particles at 140 (desktop) or 60 (low).
- Cap new point samples at 120 per stroke; thin by Ramer-Douglas-Peucker **after** collisions, not before.
- Test: horizontal cut (10,100)→(120,100) through circle center (50,100), radius 12 registers exactly once; same cut through center radius 12 at (50,120) does not.
- Test: huge jump (0,0)→(200,200) passes through circle at (100,100) despite sparse samples; no tunneling.
- Test: CSS canvas at 2x DPR yields same outcome using identical world coords; moving cursor out of browser triggers pause, not spurious success.
- Test: pressure/tilt/stylus behave as ordinary pointer and cannot boost score.

## Audio/VFX emission contract
For each `EnemyCut` event, emit one `slice` SFX (voice-limited), two peel halves, 4–14 particles depending quality, one score popup and `HitStop(30–40ms)` only on boss or exceptional simultaneous multikill. Normal cuts have no global simulation freeze. Visual response target input→trail ≤16ms at 60fps; input→slice ≤33ms on target devices. See [10](10-ANIMATION-VFX-AND-AUDIO.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
