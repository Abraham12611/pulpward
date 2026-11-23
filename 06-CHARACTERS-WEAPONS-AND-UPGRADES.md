# Character personality, equipment and progression

## Creative premise and player roles
**Miri** is an original miniature orchard sentinel with a pearlescent cape, tiny seed-shaped hair tuft and a crescent ribbon-blade. The avatar responds theatrically to cuts but is never the hitbox owner. This keeps controls obvious. A second selectable guardian, **Pip**, is cosmetic in contest M; no gameplay advantages. Character variants should be expressive, modestly animated and never make target hitboxes visually unclear.

## Equipped item model
A loadout consists of `guardianSkin`, `bladeTrailId` and `wardCharmId`; `wardCharmId` provides mild permanent PvE bonuses only. In ranked Echo mode `wardCharmId` is set to null and stats are standardized. Player selects one of three cosmetic blade trails and up to one charm. No premium rarity, paid content, loot boxes or gacha. All items have explicit unlock conditions.

| Item | Scope | Price Petals | Effect | Cap / unlock |
|---|---|---:|---|---|
| Glimmer Ribbon | default | 0 | baseline teal trail | Start |
| Ember Comet Trail | cosmetic | 160 | orange spark VFX | Win stage 2 |
| Moon Glass Trail | cosmetic | 280 | pale blue translucent arc | Win stage 4 |
| Root Guard I | permanent | 80 | +1 starting shield charge **not HP** once per stage | Stage 2 |
| Root Guard II | permanent | 180 | replaces I with one stronger 2-point absorb shield | Stage 4 |
| Dew Catcher I | permanent | 100 | +5% Petals per run (ceil) | Stage 2 |
| Dew Catcher II | permanent | 220 | total +10% Petals (not additive) | Stage 5 |
| Spark Keeper I | permanent | 120 | Spark from ordinary slice 9 instead of 8 | Stage 3 |
| Spark Keeper II | permanent | 240 | Spark from ordinary slice 10 instead of 8 | Stage 6 |

**Balance constraint:** Charm bonuses do not stack across tiers; one charm equipped; never increase blade physical hitbox or slash effective reach via upgrades. Pure skill can clear all stages using default gear. Petal bonus applies after hard earning cap, not before. Total permanent PVE benefit must not double baseline effective survivability.

## In-run temporary upgrades (post-vertical-slice)
Spark and Blossom Tokens (in-run only) can sometimes grant a single-use aid, but to avoid interruption the contest M has just one pick: at **45s between phases**, the game pauses and shows 2 choices for maximum 2 seconds, **Shield Leaf** (absorbs next one Heartseed hit) or **Ripe Pulse** (Clean Cut window +150ms for 15s). If the player does nothing, auto-select Shield Leaf. This is not a shop, currency transaction or gacha. Max 1 Shield Leaf active; cannot stack. Ripe Pulse ends before boss unless selected exactly 45s, in which case until 60s. No persistent random in-run prices for M. Later P may introduce a fixed currency shop.

## Progression milestones
- Complete 1: establish personal best, unlock stage 2.
- Complete 2: 60 Petals milestone reward once; unlock cosmetics and charm shop.
- Complete 3: unlock stage 4 and Spark Keeper I.
- Complete 4: unlock Lantern Marsh reveal and Moon Glass visual trail.
- Complete 5: unlock stage 6 and upgrade tiers.
- Complete 6: unlock Pure Grove master challenge and ranked Echo ruleset.

## UI and fairness
Every upgrade card exposes exact stat delta and whether it affects Echo. Purchasing a charm debits only if funds suffice, writes atomically to local save snapshot and updates UI without reload. Rapid taps are idempotent. Duplicate cosmetic unlocks do not reward extra currency. Character menus have 44px minimum pointer targets and a preview `Try swipe` mini-canvas that never changes progression.

## Ownership and asset spec
Miri: 512×512 source layered vector/illustration, 8 idle frames, 4 lean, 4 win, 4 sad, two silhouettes for small scale, prepared both light/dark background; original work or properly documented license. Asset pipeline and reduced motion are in [10](10-ANIMATION-VFX-AND-AUDIO.md). Economy math in [07](07-ECONOMY-REWARDS-AND-BALANCING.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
