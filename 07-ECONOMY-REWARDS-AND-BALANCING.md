# Economy: earned-only progression, numerical guards

## Currency definitions
- **Score**: volatile numeric skill result. Reset each run and used for local PB and Echo sharing. Never spendable.
- **Petals**: persistent earned-only free currency. Stored in local guest save. Purchases: charms and cosmetic trails. Entire contest game playable without buying anything.
- **Spark**: temporary combat charge from qualified hits, 0–100 per run, resets on Bloom Burst and death; never saved, purchased or transferred.
- **Shield**: a combat resource; not monetized. No premium currencies, loot boxes, ad rewards, monetization gates, or artificial energy meters.

## Scoring equation
For each eliminated enemy `e` caused by direct cut:
`points_e = floor(base_e * comboMultiplier * (cleanCut ? 1.20 : 1.00))`.
Per stroke multi-hit bonus: `min(60, 15 * max(0, directlyCutEnemies - 1))` points, multiplied by current combo multiplier only once (round down). Chain secondary hits: `floor(0.30 * base_e)` points with no multiplier or Spark, to stop feedback loops. Stage win: +500 score and Pure Grove +250 score. Score soft cap expected 40,000; hard defensive anti-abuse cap 200,000, beyond which run is flagged for replay review but local play never blocked.

### Worked scoring examples
- First regular apple: `100*1.0 = 100`.
- At streak 6, clean kiwi: `floor(140*1.5*1.2) = 252`.
- At streak 10, slash two apples and one lime: `(100+100+175)*2.0 = 750` plus multi-hit `30*2 = 60`; if the lime chain then hits two extra apples, `2*floor(0.3*100)=60`; total stroke outcome **870** before any unrelated events.
- Damage events never directly grant score. A Bloom Burst clears enemies at only 70% of their base score, without combo modifier, and no Spark refilling.

## Persistent payout
```text
rawPetals = stageCompleted ? 36 + 4*stageIndex : 18 + 2*stageIndex
skillBonus = min(18, floor(score / 1800))
pureBonus = stageCompleted && heartseedDamage == 0 ? 12 : 0
preCharm = rawPetals + skillBonus + pureBonus
petalsAward = min(85, ceil(preCharm * (1 + equippedPetalBonus)))
```
`stageIndex=0…5`. No infinite replays provide more than **85 Petals per settled run**; no daily hard cap to avoid coercion. Example: stage 1 clear, 7,000 points, one HP lost => 36+3=39 Petals; same clear, no damage => 51 Petals. Stage 6 clear with 25,000 points, pure => `56+13+12=81`, with +10% Dew => min(85,90)=85.

## Shop progression expectation
| Player stage | Typical cumulative Petals | Affordable target | Time estimate |
|---|---:|---|---|
| After first 2 stages | ~80–130 including one milestone | Root Guard I (80) | 4–8 min |
| After stage 3–4 | ~200–340 | cosmetic trail (160) or charm tier | 10–18 min |
| After stage 5–6 | ~400–650 | stronger charm or both cosmetics | 20–35 min |
| Endgame | surplus normal | alternative trails, not pay-to-win | open-ended |
Numbers are **proposals**, not validated averages. Rebalance after player telemetry and direct feedback. Baseline must remain beatable without charms.

## Purchase transaction spec
`buyItem(save, itemId, opId)` validates canonical catalog price, milestone, coins and non-ownership, then deducts and adds ownership **in the same local transaction**. Journal `(opId, beforeBalance, afterBalance, itemId)` ensures idempotency. Never trust price from UI. Local save naturally remains editable by players, hence leaderboard must not blindly trust economy or client-generated run score.

## Inflation and reward threats
Infinite Spark feedback: prohibited by secondary-hit zero Spark; huge scores from boss duplicate hits: stable enemy id and damage state. Farm stage 1 by easy replay: allowed for cosmetics, but later item prices cannot become mandatory. Backwards save migration must never add earned currency on every load. Use single `settledRunIds` bounded LRU (last 100) + completed milestone IDs to prevent duplicate reward award after restart.

## Economy QA conditions
For any stage and score, awarded Petals ∈[18,85]; losing never produces a negative reward; Pure Grove cannot be claimed on any contact even if shield absorbed damage (counts damage attempt). A purchase cannot create negative balance, trigger twice under double-click, or purchase unavailable tier. Fixed equipment is used for leaderboard competitive Echo. Related specs [06](06-CHARACTERS-WEAPONS-AND-UPGRADES.md), [12](12-GUEST-SAVES-AND-CROSS-DEVICE-SYNC.md), [14](14-DATABASE-AND-API-SPECIFICATION.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
