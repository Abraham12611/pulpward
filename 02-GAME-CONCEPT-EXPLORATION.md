# Concept options, weighted decision and innovation filter

## Candidates
**A — Pulpward: Heartseed Siege (chosen).** Enemies descend through bounded lanes toward a central Heartseed. One swipe hits any visible Blight; precision and timing produce Spark and peel chains. No conventional avatar steering. A stage lasts 90 s. Strongest advantage: immediate readability and a compact, highly polishable core.

**B — Orchard Run: moving convoy.** A rolling Seedcart travels across a parallax landscape while fruit enemies approach from ahead and above. Players slash to protect the cart and periodically choose its route. Advantage: travel spectacle. Risk: camera motion obscures hit targets and creates gesture/motion coupling.

**C — Groveguard: tactical platform positions.** Players switch an avatar among three ledges and slash locally, protecting fruit pylons. Advantage: positional skill. Risk: requires simultaneous movement plus swipe and is harsh on small phones.

**D — Rind Circuit: ricochet orchard (original alternative).** Player swipes to cut enemies into peel fragments that ricochet off rotating orchard shields. The level resembles a tiny billiards puzzle under real-time pressure. Advantage: emergent physics clips. Risk: ricochet readability and deterministic physics under mixed frame rates.

## Scoring method
Scores 1–5 (5 best). **Complexity** means engineering *feasibility* (5 easiest); Base44 is judged on how straightforward the implementation can be delivered within its hosted React/code model. Weighted points = `weight * score / 5`; highest max 100. Weights intentionally prioritize immediate fun, mobile readability and project feasibility.

| Criterion | Weight | A | B | C | D |
|---|---:|---:|---:|---:|---:|
| Instant accessibility | 12 | 5 | 4 | 3 | 3 |
| Satisfaction | 12 | 5 | 4 | 4 | 5 |
| Depth without complexity | 8 | 4 | 4 | 3 | 4 |
| Touch suitability | 12 | 5 | 3 | 2 | 4 |
| Desktop suitability | 5 | 5 | 4 | 4 | 4 |
| Session fit | 8 | 5 | 4 | 4 | 4 |
| Visual spectacle | 8 | 5 | 5 | 4 | 5 |
| Replayability | 8 | 4 | 5 | 4 | 5 |
| Social share | 7 | 5 | 4 | 3 | 5 |
| Engineering feasibility | 8 | 4 | 2 | 3 | 2 |
| Base44 feasibility | 7 | 4 | 3 | 3 | 2 |
| Expandability | 5 | 4 | 5 | 4 | 5 |

### Calculation and selected concept
Weights total **100**. This is a forward-looking design-team judgment, not a survey of players; A should be favored unless playtest measurements overturn it. Weighted totals **A=92.8/100, B=77.2/100, C=66.8/100, D=79.6/100**. Recompute if scores change. A's primary risk is its closeness to conventional swipe games; differentiation depends on defender HP, enemy pressure, chain interactions and same-seed competition. B and C become thematic special modes only if the MVP excels. D becomes a single contained bonus encounter, not a base mechanic.

## Ten innovation candidates scored 1–5
| Mechanic | Novelty | Clarity | Fun | Feasibility | Verdict |
|---|---:|---:|---:|---:|---|
| Ripeness flash precision window | 4 | 5 | 5 | 5 | **M** |
| Peel Link three-target chain | 4 | 4 | 5 | 4 | **M** |
| Combo-charged Bloom Burst | 3 | 5 | 5 | 5 | **M** |
| Two-angle armored rind cracking | 4 | 3 | 4 | 4 | **P**; initial simple two-cut |
| Beat-synced critical rhythm | 4 | 2 | 3 | 3 | Reject; sound accessibility |
| Crumpling fruit-pulp physics propellant | 5 | 2 | 4 | 2 | P prototype only |
| Distinct protected sub-objective | 3 | 3 | 4 | 3 | Future mission variety |
| Split-swarm grapefruit | 3 | 5 | 5 | 4 | **M** |
| Same-seed Echo duel | 4 | 5 | 5 | 4 | **M** |
| Weather-modified blade drag | 4 | 2 | 2 | 3 | Reject; ruins feel |
| Boss telegraphed vulnerability sectors | 4 | 4 | 5 | 4 | **M** |
| Endless rotating weapon encyclopedia | 2 | 2 | 3 | 2 | Reject bloat |

## Why fewer mechanics win
The player should learn one rule at 0:05, understand defensive urgency by 0:15, activate a gratifying skill at 0:30, and see an escalating special by 1:00. The MVP retains just four emergent hooks: enemy behavior, precision timing, bounded combo feedback, and seed fairness. No grind wall, gacha, long in-run shops or movement controls. See [03](03-GAME-DESIGN-DOCUMENT.md), [15](15-IMPLEMENTATION-ROADMAP.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
