# Champions Legacy Challenge — Data Model

Last updated: 4 August 2026  
Current release target: v0.22.0  
Current production: v0.20.0

## Principle

Store factual activity, trusted decisions and immutable competitive snapshots. Derive presentation, progress and live standings.

## Player and activity entities

- **Player profile** — identity, trusted role, avatar and onboarding state.
- **Challenge entry** — factual category data, challenge date and optional `evidenceClaimIds`.
- **Account deletion request** — requested, acknowledged or cancelled state.
- **Personal/shared library definitions**, announcement reads, Coach preferences and sanitised error reports.

## Season competition entities

- **League/season** — identity, lifecycle, dates, Houses, frozen ruleset/evidence policy and latest snapshot pointer.
- **League membership** — current House assignment and player presentation snapshot.
- **House**, leadership election/vote, roster swap/lock, Pocket activity/redemption.
- **League contribution** — immutable points and historical House attribution, optionally linked to evidence claim/decision.
- **Player notification** — private season, evidence and account communication.

## Evidence entities

- **Evidence claim** — source user, season, category, date, verification code, deadline, pending/bonus points, House snapshot and current status.
- **Evidence reviewer assignment** — one document per season/user with one or more assigned categories.
- **Evidence decision** — immutable accept, reject, late-accept or reversal record with actor, timestamp, quantity, reason and point delta.
- **Leaderboard snapshot** — immutable publication revision containing player/House standings and honours.

Water and Fruit use one daily claim per category. Running and Steps use one claim per entry.

## Historical stability

- Published activity definitions are copied into entries.
- Season rules and evidence policy are frozen.
- Claim and contribution documents copy House identity at activity time.
- Roster movement affects only future activity.
- Decisions and snapshots are appended, not edited.
- Evidence-linked entries are locked from ordinary deletion.
- Completed and archived competitive history cannot be deleted by the client.

## v0.19 derived season operations model

The Season Command Centre is a read model only. It combines existing league, House, membership, election, evidence, reviewer, contribution and snapshot documents in memory. No `seasonCommandCentres` collection exists. Downloaded reports serialize the currently visible records locally and are not persisted.

## v0.20.0 correction records

### `entryCorrectionHeads/{rootEntryId}`

Forward-only pointer to the current immutable entry version. Fields include root/current entry IDs, user, category, sequence, status, last correction/audit IDs and creation/update actors/timestamps.

### `entryCorrections/{correctionId}`

Immutable correction transaction record. Stores source/replacement IDs, root, sequence, mandatory reason, personal point delta, affected league IDs, linked contribution/claim IDs, actor, audit ID and timestamp.

### `challengeEntries` correction metadata

New entries include `sourceCorrectionId`, `replacesEntryId`, `correctionRootEntryId` and `correctionSequence`. Existing ordinary/Pocket entries use empty defaults. The factual data remains category-shaped and points remain derived.

### Contribution correction metadata

Correction contributions use `correctionId`, `correctionRole` (`reversal` or `replacement`) and `replacesContributionIds`. Existing activity/evidence contributions use empty defaults.

### Evidence correction metadata

Claims may use `supersededByClaimId`, `correctionId`, `replacesClaimId` and `correctionIds`. The new terminal display state `superseded` preserves the earlier claim instead of deleting it.

## Trusted season publication records — v0.21.0

<!-- RELEASE_STATUS: DEPLOYED -->

`seasonTrustedRuns/{runId}` is an immutable operational summary containing season identity, model version, mode, status, source counts, issue counts, fingerprint, snapshot ID, actor and timestamps. It does not contain private service-account material or WhatsApp media.

Trusted `leagueLeaderboardSnapshots` add `publicationType: trusted-local`, `trustedFingerprint`, `trustedRunId`, reconciliation status and source/issue counts. Existing player and House rows remain the player-facing standings payload.

## v0.22.0 trusted account deletion

- `accountDeletionRequests/{userId}` stores the request lifecycle, seven-day policy fields, execution link and anonymised completion display.
- `accountDeletionExecutions/{executionId}` stores trusted-only resumable processing state and planned counts.
- `accountDeletionReceipts/{receiptId}` stores a trusted-only immutable completion summary and audit link.
- Preserved shared records may include `accountDeletionAnonymised`, `accountDeletionExecutionId` and `accountDeletionAnonymisedAt`.
- The former identity uses a deterministic `former-...` identifier and `Former Player XXXX` display label.
- A new Firebase account is a separate player and is never joined to these records.
