# Quality assurance, performance, accessibility and security

## Release priorities
P0 = player cannot start/play/restart, inaccurate swipe, black screen, infinite loading, broken browser, signup gate, non-original asset, wrong Base44 hosting, loss of earned currency after clear. P1 = one stage unbalanced, share fallback broken, dropped audio, minor responsive clipping. P2 = decorative animation and cosmetic polish. No release with P0. Manual UI and tactile playtests are performed by the product owner; engineers deliver reproducible automated suites and video evidence.

## Automated test pyramid
- **Pure unit:** segment-circle, DPR transform, streak thresholds, damage grace, speed calc, respawn, Petals math, cap enforcement, shop idempotency, schema migrations. Must run before merge.
- **Deterministic simulation:** 100 preset seeds across stages 1–6; same inputs at synthetic 30/60/120 rAF schedules yield equal final simulation state; physics seeded only and FX randomness ignored. Snapshot stage spawn plan and compare hash.
- **Browser integration:** public loading, Play, pause, swipe from pointer events, stage progression, summary, save reload, local challenge URL, PNG share, focus/visibility behavior, keyboard focus and tab navigation.
- **Security:** public entities only; private code disabled or authorization verified, no frontend secrets, CSP/XSS, user-generated display text escaped, challenge URL size <2KB, JSON import size limit 512KB and no prototypes/script evaluation.
- **Manual device feel:** owner assesses gesture accuracy, enemy readability at actual screen dimensions, 90-second enjoyment, feedback restraint, gamepad/keyboard expectations and audio balance.

## Device/browser test matrix
| Platform | Target | Critical checks |
|---|---|---|
| Android Chrome, midrange 2023–2026 | ≥45fps medium or ≥30 low | Swipe trails, safe insets, responsive, audio unlock |
| iPhone Safari recent | ≥30fps with auto-tier | pointercancel, bottom bar, orientation, page scroll lock |
| Windows Chrome | 60fps target | Mouse drag, pointer capture, Web Share fallback |
| Windows Firefox | ≥45fps target | No unsupported APIs, local save, sound |
| macOS Safari | ≥45fps target | Canvas DPR and modal focus |
| Small Android 320×568 | 30fps low | No hidden enemy/controls; still playable |
| Laptop 1366×768 landscape | 60fps target | Arena letterbox without stretched hitboxes |

## Measurable budgets
- rAF simulation: typical target 60 fps, minimum acceptable playable 30 fps on entry device; 95th percentile main-thread frame ≤33ms low tier. 16.7ms median at 60fps on desktop.
- Input-to-visible trail target ≤16ms at 60fps; input-to-hit ≤33ms; avoid >50ms 95th percentile on normal phones.
- Core JS+CSS compressed target ≤450KB; initial playable assets ≤3MB; single stage preload ≤1.2MB target.
- 18 active Blights max, 140 particles high (100 medium, 60 low), 120 pointer points per stroke. Runtime heap after 20 consecutive runs should not grow >20% after GC from warm baseline.
- CLS under 0.1 on menus and no layout shifts in active gameplay; contrast as documented in 09.

## Accessibility pass
Speech/screen-reader can navigate menus and replay but pointer gameplay cannot be fully equivalent with keyboard alone in V; honest limitation. Provide optional accessible target buttons or slower assist mode in P rather than falsely claiming WCAG-complete gameplay. Core HUD text and settings meet WCAG 2.2 AA where feasible; reduced motion removes camera shake, flash intensity and long transitions; non-color telegraph shapes; tappable buttons ≥44px; audio never mandatory. Test at 200% browser zoom for menus and game safely letterboxes.

## Exact regression scenarios
| ID | Setup and action | Expected outcome |
|---|---|---|
| QA-001 | Start stage 1 private browser | No login, visible playable court in ≤3s target |
| QA-002 | Swipe through one enemy twice in same stroke | One registered hit |
| QA-003 | Swipe across two aligned apples | Both die, streak +1 |
| QA-004 | Two independent empty swipes after 3 streak | Streak reset |
| QA-005 | One kiwi hits Heartseed at 1 HP | HP 0, fail, no continued enemies |
| QA-006 | Force two enemy contacts 100ms apart | Shared grace prevents duplicate immediate HP drain |
| QA-007 | Leave game tab for 30 seconds and return | Stage paused, no hidden farming or instant death |
| QA-008 | Finish stage and reload 3x | Petals awarded once |
| QA-009 | Purchase Root Guard I with exactly 80 Petals | Balance 0, owned once |
| QA-010 | Import malformed save or huge JSON | Safe rejection, existing data preserved |
| QA-011 | Open Echo with invalid Base64 | Safe fallback to Play screen, no script executed |
| QA-012 | Open Echo from two devices same version | Same spawn plan; results vary by player input only |
| QA-013 | Enable reduced motion during rush | Gameplay unchanged, effects reduced |
| QA-014 | Mute all and reload | No unexpected audio before gesture |
| QA-015 | Browser zoom 150%; swipe at visible center | Collision aligns with rendered enemy |
| QA-016 | Score 200,001 via local editing | Not represented as verified global score |

## Bug triage and provenance
Every defect ticket: build hash, device/OS/browser, stage seed, balance version, repro steps, expected/observed, input trace if consented, screenshot/video and severity. No private guest recovery token in logs or bug reports. Asset and source audit links recorded and available to contest administrators. Test all changes in fresh incognito browser and warm-cache mode.

## Gate signoff checklist
[ ] All P0 automated cases pass. [ ] Product owner manually tests both a real Android and a real iPhone. [ ] No auth/pop-ups/paywall. [ ] 90s stage resolves correctly. [ ] All sprites and music original/licensed. [ ] New Base44 app date confirmed. [ ] Published official Base44 URL valid. [ ] Contest page fields captured. [ ] P2 server features off unless verified. See [18](18-CONTEST-COMPLIANCE-AND-SUBMISSION.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
