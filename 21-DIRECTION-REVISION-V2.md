# Direction revision V2: side-view action platformer

Status: **supersedes** the locked decisions listed in section 1. Chapters 03 to 10 and 13 to 17 still describe the V1 gesture-only defense game and must be rewritten from this document (section 9 lists what changes in each).

Mockups: `mockups/out/01` to `12` (PNG). Source: `mockups/art.mjs` and `mockups/build.mjs`. Regenerate with `node build.mjs` inside `mockups/` (needs Microsoft Edge).

## 1. Decisions changed

| ID | V1 decision | V2 decision |
|---|---|---|
| D-01 | Gesture-only combat, character reactive | **Full character control.** Run, jump (double jump), dash, drop through, climb, plus a context-sensitive slash. |
| D-02 | Stationary lane-like arena, no platforming | **Multi-tier side-view world** with four height tiers, stepped cliffs, ledges, canopy branches, bounce pads, waterfalls. |
| D-03 | 90 s stage, six 15 s phases | **Waves of about 25 to 40 s with a short upgrade pick between them**, 3 to 5 minutes per stage, boss at the end of each grove. Fast pacing target: first enemy contact within 3 s of pressing PLAY. |
| D-04 | Canvas 2D | Unchanged. Canvas 2D with a fixed-step simulation. |
| D-09 | Original art | Unchanged. The reference game's pixels, names and layouts are not reused. Pulpward uses a clean flat-vector look with chunky outlines. |
| New D-10 | n/a | **Landscape only on every device.** Portrait shows a rotate gate (mockup 04). |
| New D-11 | n/a | **Base44 CLI is the backend toolchain** (section 7). |
| New D-12 | n/a | **Game feel is a feature**: hit-stop, screen shake, RGB split, layered SFX, animation variants (section 5). |

Kept from V1: Heartseed as the objective, 5 HP pips, Spark and Bloom Burst, chain multiplier, Peel Link, no payments or ads, guest-first saves, same-seed Echo challenges.

## 2. What the reference actually shows

From the 30 extracted video frames: a side-view pixel-art world with stepped dirt terrain topped by grass, a fruit tree in the middle, a waterfall and pool on the left, torches and a warm light gradient, floating glowing enemies that parachute in, boxed enemies on ledges, HUD with two HP bars, a currency counter, three ability slots and a top-right progress percentage, combo numbers (x2, x3) and a tall red/pink vertical beam effect with debris. The other screenshots add: Vector (fluid parkour poses, strong silhouettes), Jetpack Joyride (speed, coins in arcs, spectacle effects) and Fruit Ninja (juice splashes, blade trails, Frenzy banner).

What we take: height variation, readable enemy glow, tree-as-landmark, big payoff effects. What we do not take: sprites, palette-for-palette layout, enemy designs, text.

## 3. Core loop

1. Press PLAY, land in the orchard in the middle of a wave.
2. Run and jump between tiers to reach enemies; slash to cut them. Enemies attack the Heartseed or you.
3. Clean Cuts and chains fill Spark. At 100% a Bloom Burst clears the screen.
4. After each wave, pick one of three fruit upgrades (mockup 07).
5. Boss at the end of the grove (mockup 09). Results screen with a share card (mockup 10).

Objective stays defensive (Heartseed HP 5), so the goal is readable within seconds even though the movement is richer.

## 4. Controls

| Action | Desktop | Mobile (landscape) |
|---|---|---|
| Move | A / D or arrows | Left virtual stick |
| Jump, double jump | W / Space | JUMP button, or flick up on stick |
| Drop through / plunge | S | Flick down on stick |
| Dash | Shift | DASH button |
| Slash | Click; mouse position sets the angle | SLASH button; drag from it to aim |
| Charged Heart Slash | Hold click, release | Hold SLASH, release |
| Fruit powers | Q, E, R | FRUIT button (cycles) |
| Pause | Esc | Pause icon |

Mobile layout rules: HUD stays inside the safe area; thumbs own the outer 25% of the width; no UI over the centre 50%; buttons at least 56 CSS px; haptic taps where `navigator.vibrate` exists.

## 5. Combat and animation

### 5.1 Context-sensitive slash moves (mockup 05)

| Move | Trigger context | Notes |
|---|---|---|
| Ground Slash | Enemy ahead, same height | 3-hit string; each hit a different angle |
| Rising Uppercut | Aim above, enemy higher | Launches enemy; can juggle |
| Plunge Slam | Airborne + down | Shockwave radius scales with fall height |
| Aerial Spin | Two or more enemies around you in air | 360 degree sweep |
| Dash Slash | Dash then slash | Invulnerable during dash, cuts everything on the line |
| Slide Cut | Down while running + slash | Lower hurtbox, passes under hazards |
| Parry Deflect | Slash within 120 ms of a projectile reaching you | Reflects it, gives Spark |
| Ledge Strike | Hanging on a ledge | Pull-up cut or strike from below |
| Heart Slash | Hold and release, Spark at least 50% | Wide wave; costs half of Spark |

Further ideas to prototype: wall-cling slash, bounce-pad launch slash, finisher on stunned Coconut Brutes, ground-pound on a parachuting Wisp's cap, boomerang toss with the leaf blade, juggle-extender on kiwis.

### 5.2 Animation variety rules

- Every move has 2 to 3 swing variants (different arc, hand, scarf motion) chosen by a no-repeat shuffle.
- Hero poses: idle (3 variants), run, skid, jump, double jump, fall, land (soft, hard), dash, slide, wall-cling, ledge hang, hurt, victory.
- Enemy death variants per type (splat, slice halves, pop). Cut direction decides which way halves fly.
- Particles by material: juice (per fruit colour), dust on landing, leaf bits, sparks on armour.

### 5.3 Game feel budget

| Effect | Value |
|---|---|
| Input to visible response | at most 1 frame (16 ms) |
| Hit-stop | 40 ms normal hit, 60 ms Clean Cut, 90 ms Bloom Burst |
| Screen shake | amplitude 3 px normal, 8 px heavy, 12 px Bloom Burst; decays over 0.2 to 0.4 s; respects Reduced Motion |
| RGB split | Bloom Burst and boss slam only, 4 frames |
| Camera | look-ahead 80 px, slight zoom on big hits, vertical follow between tiers |
| HUD | does not shake |
| Slow-mo | 0.3x for 250 ms on the final boss hit |

### 5.4 Audio

All sounds are generated with the Web Audio API or sourced from CC0 libraries, so there are no licence risks. Layer 2 to 3 sounds per event: a transient (click), a body (swish or squelch) and a tail (sparkle or thud). Pitch rises with chain count, 6 semitones maximum. Footsteps differ for grass, wood and stone. Music has two layers (calm and intense) that cross-fade on wave start. Audio unlocks on the first input; there is a master mute and separate music and SFX sliders.

## 6. World and level design (mockup 12)

- Four tiers: T1 orchard floor, T2 ledges (single jump), T3 Heartseed shelf (double jump or bounce pad), T4 canopy branches (one-way, drop through with S).
- Jump physics baseline: gravity 2400 px/s squared, jump impulse 780 px/s, double jump 640 px/s, coyote time 90 ms, jump buffer 110 ms, variable height by release. Max single-jump height 126 px, so tier steps are 60 to 120 px.
- Enemies spawn at several tiers so the player must change height. Flyers cover gaps.
- Hazards: spike logs, thorn bushes, falling coconuts, poison water.
- Worlds: Sunlit Terrace (stages 1 to 6, boss Coconut Titan) and Lantern Marsh (stages 7 to 12). Each stage has one gimmick (waterfall slows spawns, wind gusts, rotating platforms, darkness with lantern light).
- Parallax: 4 background layers, light shafts, floating motes, animated water and torches. World height is 2 to 3 screens in a stage; width 3 to 6 screens, with the camera clamping to the active arena during waves.

## 7. Base44 and the CLI

CLI version seen: 0.3.7. Verified commands from `--help`: `create`, `link`, `dev`, `deploy`, `entities push`, `functions deploy|list|pull|delete`, `site deploy|dev|open`, `secrets`, `auth`, `visibility`, `logs`, `types`, `exec`, `build`.

Plan (not yet executed; running `create` or `deploy` touches a remote account, so it needs your go-ahead):

1. `base44 create pulpward --template backend-and-client` inside `C:\Users\DELL\workspace`, or `base44 link --create --name pulpward` inside an existing folder.
2. Frontend: React + a Canvas 2D engine in `src/game/` (simulation, renderer, input, audio) kept separate from React screens.
3. Entities (JSON schemas, pushed with `base44 entities push`): `PlayerProfile`, `RunReceipt`, `EchoSeed`, `LeaderboardEntry`.
4. Backend functions (deployed with `base44 functions deploy`): `submitRun` (validates the receipt and writes the score), `getEcho` (daily seed), `leaderboard` (top N). Replay verification is out of scope for the contest build, so leaderboards are labelled "unverified" unless it is added.
5. Guest play works with local storage only; cloud saves are optional.
6. `base44 visibility public`, then `base44 deploy -y`, then `base44 site open` for the final proof checklist in chapter 18.

Hackathon proof: keep terminal logs of `create`/`link`, `entities push`, `functions deploy` and `deploy`, and a screenshot of the Base44 dashboard, in `docs/proof/`.

## 8. Performance and accessibility notes

- Target 60 fps on a mid-range phone, fixed 120 Hz simulation step optional. Entity cap 80, particle cap 600, with a low-effects mode that halves both.
- Offscreen canvas for the static terrain, sprite atlas via generated SVG-to-bitmap at boot.
- Reduced Motion disables shake, RGB split and slow-mo. Colour-blind safe enemy shapes. Hold-to-charge has a toggle option. All gameplay actions are remappable on desktop.
- Landscape gate: use the Screen Orientation API (`screen.orientation.lock('landscape')` after a fullscreen request on Android Chrome). iOS Safari has no lock, so the gate overlay is the primary mechanism: listen for `orientationchange` and `resize`, pause the loop in portrait.

## 9. Documents to rewrite

| File | Change needed |
|---|---|
| 03 | New core loop, wave structure, movement rules |
| 04 | Replace the pointer pipeline with the movement + slash state machine (sections 4 and 5) |
| 05 | Add vertical spawn rules and enemy behaviours per tier; add the boss pattern from mockup 09 |
| 06 | Fruit upgrades (mockup 07), blades, cosmetics |
| 07 | Re-tune economy for 3 to 5 minute stages |
| 08 | Replace the stage catalogue with the tiered stages in section 6 |
| 09 | Replace screens with mockups 01 to 10; landscape-only layouts |
| 10 | Section 5.2 to 5.4 become the animation, VFX and audio spec |
| 13, 14 | Base44 CLI workflow (section 7), entity schemas, function contracts |
| 15, 16 | New critical path: movement and slash prototype first, then world, then juice, then Base44 deploy |
| 17 | Landscape gate tests, 60 fps phone budget, input-latency test |
| 18 | Add `docs/proof/` CLI log checklist |

## 10. Open questions

1. Art direction: the mockups use a clean vector style. Do you want true pixel art (matching the reference more closely) instead? It changes the asset pipeline.
2. Should the hero be Miri (the original defender), or do you want a different character?
3. Is a boss needed in the contest build, or only enemies and waves?
4. Do you want me to run `base44 create` now, and in which workspace?
