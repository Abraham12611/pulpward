# Guest saves, identity, recovery and sync — honest threat model

## Launch strategy
**Contest MVP is anonymous local-first.** No sign-in, no forced registration, no background account creation. `localStorage` holds small settings and latest local snapshot, `IndexedDB` may hold larger journal/replay entries. The game starts instantly and can function while offline once cached. Clearly state: **`Saved on this device`** and allow `Export backup` / `Import backup` JSON with checksum. Do not promise cloud or cross-device identity before anonymous authorization is verified with Base44. The official contest requires no login to play and Base44 has `All Users` entity permissions; that is *not* a secure per-guest authorization model.

## Local data shape
```ts
type GuestSaveV1={
 schemaVersion:1; saveId:string; createdAt:string; updatedAt:string; revision:number;
 balanceVersion:string; petals:number; ownedItemIds:string[];
 equipped:{skinId:string;trailId:string;charmId:string|null};
 unlockedStages:string[]; achievements:string[]; completedMilestones:string[];
 personalBests:Record<string,{score:number;seed:number;ruleset:string}>;
 settledRunIds:string[]; journal:Array<{opId:string;kind:string;delta:number}>;
 settings:{music:boolean;sfx:boolean;fx:'high'|'medium'|'low';reducedMotion:boolean;assist:boolean};
};
```
`saveId` is random 128-bit UUID, but **not an authorization credential**. Use indexed read/write with a single serialized save transaction; keep prior two revisions for recovery from failed write. Import: schema validation, size limit 512 KB, never run arbitrary script from JSON, require explicit replace confirmation, validate Petals bounds and item unlock constraints. Since a user controls their local file, import cannot confer globally trusted rankings.

## Optional secure cloud model (P only, after API validation)
- Browser creates `guestSecret` with `crypto.getRandomValues`, at least 128 bits, stored only in device storage, never in URL. Registration via `POST /guest/claim` over HTTPS; server hashes secret using keyed HMAC-SHA256 with server-held pepper and binds record owner, never exposes direct entity write APIs.
- Every save and restore request validates secret against a server-side session/ownership mapping; applying an `All Users` rule to `GuestSave` raw entities is **forbidden**. If anonymous functions cannot be invoked securely or service role cannot be properly isolated on Base44, disable cloud and keep local backup only.
- Rate limits per IP/session on claim and recovery; CAPTCHA only for repeated suspicious attempts and never to play base game.
- Secret rotation: issue new credential on successful transfer, revoke previous single-use transfer token. Backups require explicit export; do not auto-upload file data to untrusted storage.

## Recovery code design
The originally suggested **six-character code is insufficient** for valuable unrestricted saves, especially under online guessing. Proposed manual code 26 Crockford Base32 chars (~130 bits entropy) grouped `XXXXX-XXXXX-XXXXX-XXXXX-XXXXXX`, or 128-bit random token encoded with 26 characters. Server stores keyed hash of token; never store plaintext. Code can be issued with 10-minute expiry and single successful redemption; reveal only once and require explicit user action. Backup string/QR is a **private capability**; treat it like password, never mix with share links. Transfer flow on second device: enter code -> server validates + rate limits -> shows destination summary -> user confirms -> server transfers copy of encrypted/signed guest state or assigns new owner credential -> rotates token. It is an enhancement, not a contest necessity.

## Multi-device merge and revocation
Conflict policy: server authoritative `revision` CAS update; client submits `expectedRevision` and operation IDs; on conflict load latest, merge only commuting actions (settings last-write-wins, achievement union, personal best max **for same rule version**, purchases revalidated serially). Noncommuting money changes require server arbitration; do not blindly add Petal totals. Signed receipts idempotent by `(runId, ruleVersion)`. Replayed copy cannot mint rewards. Lost guestSecret + lost backup = cannot recover identity; be transparent rather than granting reset access from guessed profile names.

## Save corruption, privacy and anti-cheat
No scoring function may trust `savedScore` as proof. Offline receipts can support personal best but cannot enter verified competition until a replay validator runs. Local clock edits do not affect stage timer; milestones key off settled `runId`. Browser data clearing loses local progress; export prior to clearing. On privacy request, clear all local guest data using one `Reset saved data` button with confirmation; if cloud later exists, add deletion endpoint and retention policy. Do not collect under-13 personal data or location.

## Compliance decision
The no-login rule does not prove silent accounts are permitted. **Pulpward uses no server guest identity in contest M.** Cloud, QR and codes are held behind feature flags default OFF pending documented platform test and sponsor clarification if needed. Preserve the public game URL and core gameplay regardless. See [14](14-DATABASE-AND-API-SPECIFICATION.md), [18](18-CONTEST-COMPLIANCE-AND-SUBMISSION.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
