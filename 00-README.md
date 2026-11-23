# PULPWARD — master production index

**Tagline:** *One swipe from disaster.*  **Format:** free 2D skill-based fruit-invasion defense, instant-play browser game. **Target:** Base44 x Nitro Web Game Contest, 3 Dec 2026 23:59 UTC. **Design maturity:** production blueprint, not an assertion of a built or tested game.

> **Revision V2 (2026-11-23):** direction changed to a side-view action platformer with full character control, tiered levels, landscape-only play and Base44 CLI orchestration. See [21-DIRECTION-REVISION-V2.md](21-DIRECTION-REVISION-V2.md). Decisions D-01, D-02 and D-03 below are superseded; chapters 03 to 10 and 13 to 17 are pending rewrite. Mockups are in `mockups/out/`.

## Executive vision
Pulpward puts the player in charge of a luminous Heartseed in a miniature orchard. Play is a single finger/mouse gesture: draw a blade across incoming corrupted fruits. Consecutive cuts release a luminous peel chain; precise cutting at the gold ripeness flash refills Spark, occasionally unleashing a spectacular Bloom Burst. What makes it different is not an arbitrary number of swords; it is a **readable defensive objective + precise slashing + interacting fruit trajectories + shared challenge seeds**. The battlefield is bounded, portrait-friendly, and deliberately not a full platformer. Players enter action in one tap and know whether they succeeded within 90 seconds.

## Locked decisions
| ID | Decision | Why | Status |
|---|---|---|---|
| D-01 | Gesture-only combat; character is a reactive animated defender rather than directly steered | Solves touchscreen conflict | Locked for V/M |
| D-02 | Stationary 2D lane-like orchard arena, no platform jumping | Visually clear and feasible in browser | Locked |
| D-03 | A 90s timed stage, 5 Heartseed health, six 15s phases | Short sessions, tuneable tension | Locked baseline |
| D-04 | Native Canvas 2D render/simulation inside Base44 React screen | Minimal bundle and direct input, contingent on build validation | Primary |
| D-05 | Local-only guest save for contest MVP; secure cloud optional post-MVP | Do not rely on unverified anonymous ownership | Locked MVP |
| D-06 | No payments, ads, account requirement, copyrighted assets, or paid advantages | Official contest compliance | Locked |
| D-07 | Same-seed share link and score image prioritized over social network | Organic replay without login | Locked |
| D-08 | Global scores remain disabled unless server replay verification is operational | Prevent false integrity claims | Conditional |
| D-09 | Fruit/enemy art, animation, sound, names and UI are original | Reference footage used for general principles only | Locked |

## Production acceptance definition
**V:** swipe cuts one enemy correctly at 30/60 fps; 5-HP objective and fail/victory; mobile scroll lock; at least three distinct enemy behaviors; one VFX pass and original sound. **M:** six stages across two Groves, six enemy archetypes, one boss, progression and three purchases, offline reload, share image and seed challenge, settings and a complete public Base44 URL. **P:** authenticated opt-in cross-device recovery, validated public board, advanced cosmetics and seasonal events.

## Document map
| File | Ownership / core question |
|---|---|
| [01-REFERENCE-GAME-ANALYSIS.md](01-REFERENCE-GAME-ANALYSIS.md) | What the 27s source actually demonstrates |
| [02-GAME-CONCEPT-EXPLORATION.md](02-GAME-CONCEPT-EXPLORATION.md) | Why this concept beat the alternatives |
| [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md) | Core loop and formal game rules |
| [04-COMBAT-AND-SLASHING-SYSTEM.md](04-COMBAT-AND-SLASHING-SYSTEM.md) | Pointer pipeline, cuts, precision |
| [05-ENEMIES-WAVES-AND-BOSSES.md](05-ENEMIES-WAVES-AND-BOSSES.md) | Archetypes, pacing, boss pattern |
| [06-CHARACTERS-WEAPONS-AND-UPGRADES.md](06-CHARACTERS-WEAPONS-AND-UPGRADES.md) | Progression and equipment |
| [07-ECONOMY-REWARDS-AND-BALANCING.md](07-ECONOMY-REWARDS-AND-BALANCING.md) | Numerical economy, reward ceilings |
| [08-LEVELS-WORLDS-AND-ENVIRONMENTS.md](08-LEVELS-WORLDS-AND-ENVIRONMENTS.md) | Stage catalogue, hazards, map |
| [09-UI-UX-AND-VISUAL-DIRECTION.md](09-UI-UX-AND-VISUAL-DIRECTION.md) | 18 screens and responsive layouts |
| [10-ANIMATION-VFX-AND-AUDIO.md](10-ANIMATION-VFX-AND-AUDIO.md) | Input-to-impact budget and art pipeline |
| [11-SOCIAL-VIRALITY-AND-LEADERBOARDS.md](11-SOCIAL-VIRALITY-AND-LEADERBOARDS.md) | Fair challenges and screenshot share |
| [12-GUEST-SAVES-AND-CROSS-DEVICE-SYNC.md](12-GUEST-SAVES-AND-CROSS-DEVICE-SYNC.md) | Guest data, recovery and threat model |
| [13-BASE44-TECHNICAL-ARCHITECTURE.md](13-BASE44-TECHNICAL-ARCHITECTURE.md) | Actual Base44 implementation boundaries |
| [14-DATABASE-AND-API-SPECIFICATION.md](14-DATABASE-AND-API-SPECIFICATION.md) | Schema, RPC contracts, access matrix |
| [15-IMPLEMENTATION-ROADMAP.md](15-IMPLEMENTATION-ROADMAP.md) | Critical path and gates |
| [16-ENGINEERING-TASK-BACKLOG.md](16-ENGINEERING-TASK-BACKLOG.md) | Work packets with tests and DoD |
| [17-QA-PERFORMANCE-AND-SECURITY.md](17-QA-PERFORMANCE-AND-SECURITY.md) | Test matrix and budgets |
| [18-CONTEST-COMPLIANCE-AND-SUBMISSION.md](18-CONTEST-COMPLIANCE-AND-SUBMISSION.md) | Verified rules, proof checklist |
| [19-BRANDING-AND-LAUNCH-STRATEGY.md](19-BRANDING-AND-LAUNCH-STRATEGY.md) | Names, icon, creative, growth |
| [20-FUTURE-EXPANSION-IDEAS.md](20-FUTURE-EXPANSION-IDEAS.md) | Risk-gated product extensions |

## Vocabulary and invariants
- **Cut:** qualified pointer segment intersects Blight hit geometry, with per-stroke hit suppression.
- **Clean Cut:** cut when the gold ripeness ring is active and slash length ≥28 CSS px, yields precision bonus.
- **Chain:** consecutive successful strokes separated by ≤1.4 seconds; misses reset streak after 2 unsuccessful strokes, not on a single empty gesture.
- **Bloom Burst:** generated automatically at Spark 100, consumes all Spark, destroys ordinary Blights in a telegraphed ring; cannot damage bosses beyond one armor segment.
- **Peel Link:** certain enemies split into shards that can strike adjacent enemies when sliced; strictly capped at 3 secondary targets.
- **Run receipt:** summary of run seed/version, events, score, rewards; never considered authoritative merely because generated in JavaScript.

## Official sources and review dates
- [Official contest terms](https://nitropay.com/base44webgame/terms-and-conditions/), reviewed 2026-11-21.
- [Official contest home](https://nitropay.com/base44webgame/), reviewed 2026-11-21.
- [Base44 Launchpad](https://app.base44.com/launchpad), reviewed 2026-11-21.
- [Base44 npm package support](https://docs.base44.com/Building-your-app/NPM-packages), reviewed 2026-11-21.
- [Base44 developer tools](https://docs.base44.com/documentation/building-your-app/developer-tools), reviewed 2026-11-21.
- [Base44 data permissions](https://docs.base44.com/Setting-up-your-app/Managing-security-settings), reviewed 2026-11-21.
- Source video: `VID_20261117_234857_839.mp4`, about 26.97 s, portrait compilation of landscape gameplay; see chapter 01 for evidence limits.

## Change control
Game design owner approves rule changes; engineer owns feasibility experiments; art director owns readable style; producer gates release. Every balance change increments `balanceVersion` and updates 03/05/07 and deterministic fixtures. Changes after Dec 3 23:59 UTC require compliance review; no material changes through winner announcement.
