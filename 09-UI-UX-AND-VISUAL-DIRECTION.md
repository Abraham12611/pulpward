# Product UX and high-polish visual system

## Visual identity
Original 2D illustration with round, deeply shaded fruits, soft sculpted edges, strategically crisp slash lines and richly layered small environments. Not pixel art, not imitation of the reference video, not a copied Fruit Ninja screen. Brand colors: Plum Night `#251C39`, Rind Teal `#44D9B1`, Core Gold `#FFD66E`, Punch Coral `#FF6C72`, Sky Cream `#FFF4DC`, Violet `#9789EB`. Cream for principal text on dark; dark plum on cream panels. Font direction: chunky but legible rounded display headings + geometric sans body (select specifically licensed faces); avoid ornate mini-labels.

## Responsive rules
Base design vertical 390×844. Safe insets on phones, target size ≥44 CSS px, labels ≥14px. Real-time game bounded 390×700 logical coordinate space, fit aspect uniformly; nonplayable gutters decorate wider desktop. For 1366×768 desktop, centered game court nominal 480px wide with left world map teaser/right score cards **outside** the active court. For small 320×568: shrink decorative HUD, keep 25% bottom protected space, wrap only secondary text, and never place core in browser toolbar/safe inset area. Arena content and hitboxes must not drift due to CSS zoom.

## Screen specs (18 distinct routes/states)
| Screen | Purpose, hierarchy and key interaction | Mobile/desktop treatment | Motion / transition |
|---|---|---|---|
| 01 Landing/Instant Play | Giant logo, animated Heartseed, **PLAY NOW** primary, single sentence `Swipe to guard the seed`; secondary sound | Full-screen central action, no auth | One canvas preview; tap immediately launches stage 1 |
| 02 First-time tutorial | One highlighted apple and swipe ghost; skip visible | Single tip anchored outside hit target | Freezes first enemy until initial cut; removes prompt |
| 03 Main menu | Play, World, Loadout, Challenges, Settings; visible local best | Stacked controls mobile; left art, right actions desktop | 180ms tab easing |
| 04 Active gameplay | Top: Heartseed 5 hearts, timer, score. Middle: 80% usable cut court. Bottom: Spark ring and Pause | No overlays over enemies; translucent HUD edge | 16ms trail, clear 200ms award |
| 05 Pause | Resume, Retry, audio/FX toggles, Exit; no ambiguous backdrop hit | Overlay 90% dark; large Resume | Input releases, simulation clock stops |
| 06 Victory | Large `GROVE SECURED`, 1–3 seed stars, score and HP | One clear CTA Next | 450ms fanfare; skip button |
| 07 Defeat | `Heartseed held for 63s`, one Retry CTA and free rewards | No punishment and no monetization | Gentle wilt; immediate retry |
| 08 Run summary | Score, best, streak, clean cuts, Petals, Share | Scroll if needed; compact key figures | Increment numbers ≤400ms |
| 09 Character selection | Miri/Pip art, available skins, `Use` | Card carousel mobile, grid desktop | 150ms idle flourish |
| 10 Weapons/trails | Current trail preview, unlock requirement, no stat cheating | Full-screen preview on phone | Live preview in isolated canvas |
| 11 Upgrade shop | Petals top, 3 upgrade lines with exact prices/effects | Stacked shop cards | Success pulse; insufficient funds disabled |
| 12 World map | Six stage nodes between two scenic regions | Vertical animated path, 3 cols desktop | Path grows after win |
| 13 Achievements | Clear counts, Pure Grove, milestone progress | Filter pills and cards | Tiny confetti only when earned |
| 14 Daily/Seed challenges | Daily fixed seed and your personal best | Plain cards; guest mode | Countdown decorative only, no FOMO penalties |
| 15 Leaderboards | If server verified: ranked scores; otherwise `Your Best` and explain no global | Table with rank readable | Stable loading/empty/error states |
| 16 Share/Challenge | Preview share card, `Copy challenge link`, native share | 9:16 crop for short video; PNG card | Confirmation toast only on successful copy/share |
| 17 Guest save/sync | Local save status; Backup/export; conditional cross-device code | Explanatory privacy copy | Code hidden until explicit reveal, never in share |
| 18 Settings/accessibility | Music, SFX, VFX quality, reduced motion, high contrast, assist | All switches labeled, local persist | Immediate preview, no page reload |

## Active gameplay wireframe: portrait
```text
┌────────────────────────────────┐
│ ♥♥♥♥♥   01:14       9,280    │
│ [combo x2.0]       [pause ⏸] │
│    ✦ spawn telegraph strip    │
│       🍎    ◇🟢              │
│         \  slash ↗           │
│   🍇          🥥              │
│    ✦ ✦ peel link!             │
│                                │
│  ── defense limit / Wardline ─ │
│              HEARTSEED         │
│    Spark ◉ 72/100              │
└────────────────────────────────┘
```
Glyphs above are layout placeholders, not asset specifications. Never use emoji as actual combat sprites. The top-left health indicator is Heartseed health, not player body health. The HUD must not claim keyboard arrows are required.

## Text and accessibility
Plain player-facing copy: `Swipe to slice`, `Protect the seed`, `Perfect cut`, `Grove saved`, `Try again`. Support `prefers-reduced-motion`, a 3-tier FX slider, toggles for SFX/music, flashing reduction (no full-screen strobes), non-color tells and haptics disabled by default. Color contrast >=4.5:1 for body copy and >=3:1 for large HUD icons, with translucent backplates.

## Style production checklist
Brand guide page, 2 worlds × 3 parallax layers, 7 enemy sheets, guardian animation sheet, HUD spritesheet, menu illustrations, 3 share-card templates, icon set, particle atlas, panel 9-slice, loading logo. Minimum art acceptance: clear silhouettes at 48 logical px; unique shape language across enemies; no sprites or text lifted from reference or commercial franchises. See [10](10-ANIMATION-VFX-AND-AUDIO.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
