# Sharing, Echo challenges and fair competition

## Viral principle
A satisfying encounter is the content; sharing must not become a chore. **Two MVP loops only:** (1) locally rendered result card that communicates the feat; (2) same-seed Echo URL a friend can play instantly, no login. Further leaderboards and referrals are a higher-risk later feature. The score may be locally editable; label it personal/guest until verified by server replay.

## Loop 1 — result cards
At end, `Generate card` renders original 1080×1350 PNG via offscreen canvas (with optional 1080×1920 vertical template). Card includes brand, score, pure-grove badge if earned, max combo, stage ID, date, QR public challenge URL **only**, and `Beat my score` copy. Avoid adding local guest credential, wallet, full telemetry or private recovery token. The player can download, copy image where supported or invoke Web Share API on explicit click. On unsupported browsers fall back to PNG download and `Copy link`.

## Loop 2 — deterministic Echo challenge
URL shape: `https://<approved-BASE44-host>/?challenge=echo1.<payload>.<checksum>` where payload is compact **public** base64url JSON `{version:1, stageId, seed32, balanceVersion, ruleset:'ranked-standard', targetScore}`; checksum detects accidental corruption, is **not** authentication. Challenge sender's claimed score is labeled `friend's shared score (unverified)` and is not granted authority to award Petals. Recipient loads directly into public stage preview and a big `Challenge accepted` PLAY button; `Continue local story` remains available. Standard gear, no boosts, identical spawn plan. Challenge outcome displays `You beat the target!` or `Try again`. Sender share link never stores or reveals guest identity.

## Same-seed validation
- `seed32` 32-bit integer, stage in allowlist, balanceVersion recognized by deployed build; unknown/malformed seed leads to safe regular PLAY, not a blank app.
- Echo match results are fair **only** for identical `stageId`, `balanceVersion`, engineVersion and ruleset; mismatched versions display `Previous ruleset — play for fun` instead of ranked claim.
- Optionally fingerprint spawn plan `SHA-256(config)` in receipt; do not treat client-derived digest as proof of truth.
- No paid upgrades, progress-dependent unlocks or guest-login requirements in Echo; all challenge stages playable from link.

## Leaderboards — staged plan
**Contest M:** local personal-best table and optional `Friends comparison` made from pasted challenge links; no server leaderboard. **P gated:** public top-100 with signed server-simulated runs, device rate limits, payload size caps, anonymized generated display handles, report/remove ability and no public row-level writes. Never publish a raw client score as verified.

## Abuse and community compliance
Do not automate Base44 Launchpad upvotes, incentivize voting with in-game currency or ask for vote exchanges. Contest terms disallow bots, fake accounts, bought votes, paid/quid-pro-quo votes and other manipulation. Encourage natural screenshots/links to friends and ask for genuine feedback. Referrals as economic rewards are **rejected** for contest; they create fraud surface and could be construed as incentivized voting. Social copy must never claim participation requires a Base44 sign-in (only voting may require an account).

## Optional highlight capture (P)
Manual `Capture highlight` creates a lightweight deterministic replay from input/event log locally, then uses `canvas.captureStream()` + `MediaRecorder` if supported. On iOS Safari/unsupported codec, degrade to three-frame montage or GIF sprite sequence; users explicitly initiate recording and choose download. No background microphone/camera capture, no automatic upload, no access to phone photos. Browser autoplay audio restrictions apply.

## Security/privacy review
Data in public URL: only stable public challenge config and declared target score. Never include `guestToken`, `transferToken`, code verifier, full save state, phone/email, precise region. If analytics are added, aggregate counts only and provide opt-out. Leaderboard geographical categories deferred: reliable country without accounts/consent is not assured and geo-IP can be wrong. See [12](12-GUEST-SAVES-AND-CROSS-DEVICE-SYNC.md), [18](18-CONTEST-COMPLIANCE-AND-SUBMISSION.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
