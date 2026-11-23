# Data models, API contracts and validation

## MVP persistence strategy
Contest MVP has **no mandatory server database**. Every stage, item, best and settings value is usable with browser persistence; data is guest-owned but locally editable. This prevents misleading security claims about anonymous Base44 entity access. Base44 backends may be used for **public read-only static events/catalog** where `All Users` Read is appropriate and all Writes are admin. **Never** put guest save secrets, recovery codes or authoritative scores into an entity with `All Users` Read or Write.

## Entities if anonymous backend functions are validated (P scope)
| Entity | Fields | Access rule |
|---|---|---|
| `GuestProfile` | `id`, `secretHash`, `version`, `createdAt`, `lastSeenAt`, `disabled` | Private, server function only |
| `GuestSave` | `guestId`, `revision`, `encryptedOrValidatedState`, `updatedAt` | Private, server function only |
| `RunReceipt` | `runId`, `guestId`, `stageId`, `seed`, `balanceVersion`, `score`, `eventDigest`, `verified`, `settledAt` | Private authoritive backend only |
| `RewardLedger` | `operationId`, `guestId`, `amount`, `reason`, `runId`, `createdAt` | Private append-only server function |
| `TransferCode` | `tokenHash`, `guestId`, `expiresAt`, `usedAt`, `attemptCounter` | Private, server function only |
| `Challenge` | `id`, `stageId`, `seed`, `ruleset`, `balanceVersion`, `createdAt`, `public` | Public read sanitized fields, controlled create |
| `LeaderboardEntry` | `id`, `publicHandle`, `stageId`, `score`, `balanceVersion`, `verifiedAt` | Public Read, backend-only create/update |
| `PublicConfig` | `id`, `balanceVersion`, `dailyChallengeSeed`, `disabled` | Public Read, admin write |

Base44 `All Users` is documented for public entity access, even unsigned visitors. **Do not treat row-level rule filters as equivalent to possession of a high-entropy guest secret.** Private cloud reads/writes must pass through a checked backend function; use service-role access only inside server execution, never expose credentials to client.

## Proposed function contracts (CONDITIONAL, not yet tested on Base44)
```http
POST /guest/claim
Content-Type: application/json
{"clientNonce":"base64url-128bit","protocol":1}
-> 201 {"guestId":"opaque", "revision":1, "sessionToken":"opaque-short-lived"}
```
Server creates random secret and binds guest; avoid allowing the client to choose ID used to authorize queries. Requests carry `Authorization: Bearer <short-lived-token>` and backend checks owner. Limit 3 claims/hour/IP under suspicious patterns; never block the base game.

```http
GET /guest/save
Authorization: Bearer <token>
-> 200 {"schemaVersion":1,"revision":N,"save":{...}}

PUT /guest/save
Authorization: Bearer <token>
If-Match: N
{"revision":N,"operations":[{"opId":"uuid","kind":"unlock","itemId":"..."}]}
-> 200 {"revision":N+1,"save":{...}}
-> 409 {"code":"VERSION_CONFLICT","revision":N+1}
```
Never trust arbitrary client `petals` balances; server accepts validated operation types. For run rewards, **prefer deterministic input replay** if time budget permits; otherwise run verification unavailable and server reward mode disabled.

```http
POST /runs/submit
Authorization: Bearer <token>
{"runId":"uuid","stageId":"s2","seed32":1234,"balanceVersion":"1.0", "inputs":[[100,320,104],[130,290,120]],"clientClaimedScore":9000}
-> 202 {"status":"processing"}
-> 422 {"code":"INVALID_REPLAY"}
```
Validation: payload 1MB max; <=4,000 sample points per 90s run; monotonic integer timestamps; reasonable max swipe speed, no overlapping strokes, valid entity interactions, equal deterministic spawn plan, per-event score recomputation and settled-run uniqueness. Client claim is advisory only. A full authoritative replay may require precise deterministic event timing and browser sampling normalization and is a significant engineering project; defer if unproven.

## Types and local indexed storage
```ts
type RunReceipt={
 runId:string;stageId:string;seed32:number;ruleset:'story'|'ranked-standard';
 balanceVersion:string;engineVersion:string;
 tStart:number;tFinish:number;endReason:'victory'|'defeat'|'aborted';
 score:number;streakMax:number;cleanCuts:number;heartseedDamage:number;
 earnedPetals:number;settled:boolean;spawnPlanHash:string;
};

type StoreIndex={
 guestSave:GuestSaveV1; activeRun?:{runId:string;checkpointAt:number};
 receipts:RunReceipt[]; challengeCache:Record<string,unknown>;
};
```
Access through `loadSave`/`updateSave`/`settleRun` functions, never direct UI mutation. Local write protocol: compute next save in memory, schema-validate, write temporary key, atomically swap active pointer where possible, record checksum and archive previous snapshot. Crash after settling before UI acknowledgment returns same saved receipt and must not double-credit.

## Permission and security tests
Create anonymous user in private browser, attempt reading every private entity directly, creating `LeaderboardEntry`, fetching other guest save by ID and mutating `RewardLedger`; all must fail. Create public visitor, allow public configuration read. If any private write works without server owner credential, disable entire cloud subsystem. Test backend function rate limits; avoid disclosing whether a recovery code exists in error message. Standardize `400 BAD_INPUT`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 CONFLICT`, `429 RATE_LIMITED`, and `500 INTERNAL` without sensitive details.

## Versioning and migrations
`schemaVersion` changes with storage layout; `balanceVersion` with gameplay numbers; `engineVersion` with deterministic semantics. Migrations are pure functions and tested against old fixtures. Unknown future version -> render `Update required` and allow read-only export; never overwrite new-format data with older code. See [12](12-GUEST-SAVES-AND-CROSS-DEVICE-SYNC.md), [17](17-QA-PERFORMANCE-AND-SECURITY.md).

---

> **Status:** v1.0 proposed production specification, 21 November 2026. **Numbers are design hypotheses** until verified by playtesting. This game is a new, original Base44 contest project. **Canonical terms:** Heartseed = defended object; Sprites = characters; Blights = hostile fruits; Petals = persistent free currency; Spark = transient run meter; Bloom Burst = earned special; Grove = level/world; Echo = same-seed challenge; Wardline = invisible defense boundary. **Scope codes:** V = vertical slice, M = contest MVP, P = post-MVP. Core baseline: 90-second stage, 5 Heartseed HP, pointer-only slashes, 60 Hz simulation when feasible, 3-minute-or-less replay loop. Unless this document explicitly overrides a value, these are binding defaults. See [00-README.md](00-README.md) and [03-GAME-DESIGN-DOCUMENT.md](03-GAME-DESIGN-DOCUMENT.md).
