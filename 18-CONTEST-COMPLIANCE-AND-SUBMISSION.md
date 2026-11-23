# Verified contest rules, unresolved questions and submission playbook

## Primary authority and snapshot
On **2026-11-21**, reviewed [Official terms](https://nitropay.com/base44webgame/terms-and-conditions/), [contest home/FAQ](https://nitropay.com/base44webgame/) and [Base44 Launchpad](https://app.base44.com/launchpad). Where pages conflict, official legal terms govern. This is not legal advice; user/entrant should verify final rules at actual submission.

## Verified requirements
1. Submission window Nov 5 2026 00:00 UTC to **Dec 3 2026 23:59 UTC**; judging Dec 4–9; winners on/about Dec 10.
2. Must be **new build created during submission window** using Base44; pre-existing projects, reskins, near copies of tutorials/templates/games ineligible.
3. Public browser game, desktop/mobile, **no downloads/extensions/install**.
4. Entire game free and playable **without any login, registration, subscription, payment, in-game purchase or other condition**.
5. Live at submitted URL throughout judging and at least **90 days after winner announcement**; material changes prohibited after submissions close until winners announced.
6. Original content or written/open licenses with conditions satisfied; proof of assets and build provenance may be requested.
7. One submission per person/team. Teams up to **four** natural persons per **Official Terms §4.3**, notwithstanding less precise contest homepage FAQ that says individual entry only. If collaborating, read legal terms and designate representative; reconcile with organizers before submitting if uncertain.
8. Contest-wide equal weights: **Gameplay Quality, Creativity, Technical Execution**. Community upvotes choose top 25 shortlist, then panel ranks; **votes alone do not choose winner**.
9. No scripted/bot, fake, purchased, incentive or exchange vote manipulation; no incentivized votes for in-game currency.
10. Entrants ≥18 with Base44 account in good standing and satisfy residency/sanctions and lawful receipt requirements; verify individual eligibility personally; do not infer eligibility solely from an approximate location.

## Platform-hosting nuance
FAQ explicitly states games must be hosted on a **Base44 URL**, not custom domains, for entry. Official terms also require use of Base44 and a stable public URL. Submit an `*.base44.app` or other host directly provided by Base44, not a Vercel-only mirror. Using npm packages in a Base44 project is documented and not per se banned by these rules, but **external engine/library specifics, external hosting of the gameplay bundle and anonymous cloud mechanics are not expressly blessed**. Maintain audit trail showing actual Base44 project code and hosting.

## Requirement -> product evidence
| Requirement | Design decision | Proof to retain |
|---|---|---|
| New original project | Start Pulpward inside Base44 after Nov 5 | Project creation timestamp + revision history |
| Built with Base44 | Canvas code embedded in Base44 React app | Editor code screenshots/commit history |
| No login | Local guest save, all stages public | Private mode screen recording |
| Free in full | No monetization, all unlocks earned | App menu walkthrough; payment absence |
| Original assets | Commission/create distinct sprites, original music | ASSET-LICENSES.csv, source files |
| Browser playable | Desktop + mobile tests | Device capture and browser matrix |
| No material updates post-close | Freeze rule version and production app | Final build SHA/version and change log |
| Stable for ≥90 days | Maintain Base44 URL/hosting | Subscription/ownership check and uptime plan |
| Fair votes | Organic promo only | No reward-linked vote CTA |

## Features not verified as contest-permitted
**Anonymous Base44-backed guest accounts, recovery codes, QR device transfer:** not expressly addressed by rules; though a guest invisible to player may work technically, it must not impose sign-in and may need compliance review. **Decision:** not in contest M. **Phaser npm:** Base44 supports npm installs, but game-specific runtime compatibility requires integration test. **External backend:** Terms allow third-party services subject to responsibility, but still require genuinely building in Base44; no off-platform game inside an iframe. **Ads and referrals:** full free experience non-negotiable; omit all ads and referral bonuses in contest to reduce risk. **Global leaderboard:** no-login is possible but score trust is unproven; local only.

## Submission instructions
1. Publish new Base44 app as public; open as logged-out visitor in fresh private Chrome and mobile Safari.
2. Confirm every stage can be started and replayed without signup or external payment.
3. Capture final app URL, title **Pulpward**, succinct authentic description, 15–30s real gameplay clip, logo and 3 screenshots.
4. Go to [Nitro contest page](https://nitropay.com/base44webgame/) and use Submit Your Game; fill official form accurately. If a separate Launchpad listing is desired for community prizes, add it through [Base44 Launchpad](https://app.base44.com/launchpad).
5. Confirm completed submission by final page/receipt. Do not assume clicking submit constitutes acceptance. Save a screenshot and timestamp.
6. Invite genuine players to play and share authentic opinions. Do not buy/exchange votes.
7. Freeze material gameplay on Dec 3 23:59 UTC; monitor uptime through judging and 90-day retention.

## Final preflight (owner checklist)
[ ] Legally eligible and team size compliant. [ ] Brand name clearance review. [ ] Public game live on Base44 URL. [ ] Full content free. [ ] No login or account interstitial. [ ] Original/licenses documented. [ ] New build proof. [ ] P0 QA green. [ ] Form submitted before 23:59 UTC Dec 3. [ ] Launchpad community track separately entered if desired. [ ] Freeze and post-award retention scheduled.

## Official reference sections
Terms §§3 (dates), 4 (eligibility/team), 5 (entry), 6 (content/new build/live duration), 7 (content standards), 8 (judging/vote integrity), 9 (prizes), 11 (license). Homepage FAQ clarifies Base44-hosted URL vs custom domain; official terms supersede if any discrepancy. See [15](15-IMPLEMENTATION-ROADMAP.md), [17](17-QA-PERFORMANCE-AND-SECURITY.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
