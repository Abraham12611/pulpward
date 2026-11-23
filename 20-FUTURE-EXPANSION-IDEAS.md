# Future releases — value-first, gated and consciously excluded from MVP

## The expansion contract
No future feature ships merely to enlarge the menu. It must change a meaningful decision, produce measurable enjoyment without compromising instant-play or hurt mobile performance. Every experiment has a hypothesis, minimal prototype, baseline metric, risk and kill condition. Prioritize gameplay before retention mechanisms.

| Priority | Candidate | Hypothesis | Build gate | Kill if |
|---|---|---|---|---|
| P1 | Frost Orchard Grove (3 stages) | Mirror-slice ice fruits add variety | 6 current stages fun and bug-free | Visual noise/confusing reflect hitboxes |
| P1 | One rotating ricochet event | Controlled chain physics creates clips | Stage 4 Peel Link proven readable | Fragments block next enemies |
| P1 | More bosses with 2 patterns max | Variety without control complexity | Warden Pom fairness ≥80% playtest rating | Boss fails mobile visibility |
| P1 | Replay montage from input trace | Sharing rises with authentic moments | Replay deterministic and opt-in | Safari codec compatibility low |
| P2 | Anonymous backup and private QR transfer | More players retain saves | Secure function owner mapping and compliance | Secret/access model unverified |
| P2 | Server-validated global board | Public rank motivates replay | Replay checks block forged receipts | Honest verified ranking impossible |
| P2 | Seasonal cosmetic pass (entirely free) | Fresh identity without power creep | Economic integrity/asset pipeline stable | FOMO/paid cues appear |
| P2 | Score duel friend rooms | Synchronous competition drives play | Base44 live updates proven secure, low latency | Forces accounts / stutters |
| P3 | Convoy escort special mode | Camera motion adds spectacle | Gesture hit accuracy maintained | Players lose track of targets |
| P3 | Co-op pass-the-blade | Shared challenge with no auth | Device conflict / identity model solved | Connection required for core game |

## Five deliberate rejections
1. **Forced account/social login**: contradicts contest and instant-play identity.
2. **Paid blade damage upgrades/energy systems**: violate contest free-full-game condition and skill fairness.
3. **Aggressive reward ads/infinite popups**: break momentum and undermine no-payment core.
4. **Full 3D open world / parkour controls**: expensive and competes with one-swipe fantasy.
5. **Unverified global score table**: trivially cheated, harms trust.

## Metrics and experiment method
Instrumentation only with user-appropriate consent and privacy safeguards. Core success: % reaching first cut within 10s, completion rate (target 60–80% stage 1; 25–45% final boss at unboosted baseline), median stage 1 duration, input miss complaint rate, 7-day voluntary return, share card clicks per completed run, repeat challenge attempts. No manipulative push or penalty for skipping days. Five-user owner-led tactile playtest before deciding each expansion, followed by A/B if volume permits.

## Dependency/policy fences
No features needing remote backend until 12/13/14 security gates pass. No material gameplay updates during contest freeze. Any larger commercial edition should have separate branch, design review, privacy check and independent compliance assessment. Maintain all-core-access-free ethos, even if later adding optional cosmetic monetization; contest build remains unchanged and no changes that violate contest 90-day requirements. For architecture see [13](13-BASE44-TECHNICAL-ARCHITECTURE.md); for timeline see [15](15-IMPLEMENTATION-ROADMAP.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
