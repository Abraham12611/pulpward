# Development roadmap and critical path

## Time reality
Work starts during contest submission window; official cutoff **2026-12-03 23:59 UTC**. This plan uses relative working days and an explicit last-day buffer rather than committing to fictitious staffing. It assumes a small delivery team of one gameplay engineer, one product/frontend engineer and one illustrator/audio contributor; if fewer people, drop scope, never quality. Critical path: Base44 project public shell -> reliable pointer stroke -> playable 90s loop -> assets and audio -> responsive cross-device QA -> publish and submit.

## Milestones
| Phase | Outcome / evidence | Dependencies | Hard exit criterion |
|---|---|---|---|
| A0 — Setup (day 0) | New Base44 project, published blank shell with no login, repo/code history | None | Public private-mode URL opens |
| A1 — Technical spike (day 0–1) | Canvas at 390×700, pointer capture, 60/30fps performance probe | A0 | Desktop + Android swipe collision works |
| B — Combat vertical slice (days 1–3) | 3 Blights, cut/collision, Heartseed HP, timed 60s proof, failure/win | A1 | 5 scripted scenarios pass and feel responsive |
| C — Game-feel pass (days 3–5) | Original art first pass, trails, fragments, 5 SFX, combo and Spark | B; artist parallel | Video clip visually satisfying at phone scale |
| D — MVP progression (days 5–7) | Six 90s stages, boss, shop, save, unlocks | B and stable data | Reload continuity and deterministic spawns verified |
| E — Share + polish (days 7–9) | Echo link, PNG card, 2 Groves, accessibility, UX states | D | Guest challenge loads in private mode |
| F — Contest hardening (days 9–10) | Automated tests, device matrix, errors, asset licenses, compliance proof | E | All P0 defects fixed, public URL stable |
| G — Submission (by Dec 3 UTC) | Nitro entry + Launchpad listing, metadata and media captured | F | Real submission receipts/screenshots recorded |

Days are work sequencing, not promised calendar delivery. Leave one full day for unknown Base44 publishing or mobile regressions. If A1 feasibility fails: switch to simple HTML Canvas sample without extra engine dependency and test on Base44 again. If that still fails, reduce gameplay to static court with DOM-backed hit lines but keep actual action-play core; do not silently external-host the game.

## Vertical slice Definition of Done
1. Canvas clear frame, at least one moving enemy and one visible objective.
2. One touch/click-and-drag slices a Blight by segment-circle hit even at low sample rate.
3. One timer-driven stage, dynamic score, 5 HP, victory and defeat.
4. At least Apple Scout, Kiwi Dart and Coconut Armor with distinctive counters.
5. Input-to-feedback recorded in browser under 33ms median on sample target phone.
6. No missing assets, stuck loading or runaway rAF after pause.
7. Can replay without login or any paid API call.

## Scope cut order if behind schedule
Cut **global leaderboards first** (already P) → QR/cloud transfer → capture video → second character → 45s upgrade choice → three of the six stages → secondary art layers. **Never cut:** gesture hit accuracy, public access, predictable fail/win, no-login, distinct original art, basic sound, pause/restart, responsive viewport and at least 90s core stage. Deadline is contest-specific; avoid risking disqualification to achieve P features.

## Parallel work streams
- Game engineer: engine, event/tick, collision, director, deterministic tests.
- Product/frontend engineer: Base44 shell, loading, summary, settings, save, share card, challenge parser.
- Art/audio: mascot/enemy atlases, two Grove scenes, sound assets and documented licensing.
- QA/owner: manual device playtests and acceptance feedback on every milestone; engineers do automated runs. Do not claim an engineer's simulation replaces human feel evaluation.

## Handoffs and release gates
At each completed phase, create build hash, screenshot artifact, automated test summary and open risk list. Engineering can parallelize after interface contracts in [04](04-COMBAT-AND-SLASHING-SYSTEM.md) and [14](14-DATABASE-AND-API-SPECIFICATION.md) stabilize. **F gate:** no console errors, core controls work on Android+iOS+desktop, game playable full without signup, only original licensed assets, no payments, Base44 native public URL, proof of new project date, no duplicate submission.

## Post-submission freeze
Until winners announced, no material gameplay changes; only nonmaterial fixes after legal/compliance review. Remain available at same URL from submission through Dec 9 and ≥90 days after winner announcement (~March 2027, subject to actual announcement date). Retain source, art provenance and submission screenshots.

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
