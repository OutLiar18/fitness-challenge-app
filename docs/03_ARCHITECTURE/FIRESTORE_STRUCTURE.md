# Champions Legacy Challenge — Firestore Structure

Last updated: 4 August 2026  
Current release target: v0.23.0  
Current production: v0.20.0

## Player and activity

- `users/{userId}`
  - `library/{itemId}`
  - `announcementReads/{announcementId}`
  - `coach/preferences`
- `challengeEntries/{entryId}`
- `accountDeletionRequests/{userId}`

## Season competition

- `leagues/{leagueId}`
- `leagueInvites/{code}`
- `leagueMemberships/{leagueId_userId}`
- `leagueHouses/{houseId}`
- `leadershipElections/{leagueId_houseId_weekKey}`
- `leadershipVotes/{electionId_userId}`
- `leagueRosterSwaps/{swapId}`
- `leagueRosterLocks/{leagueId_houseId_weekKey}`
- `pocketActivities/{pocketId}`
- `pocketRedemptions/{redemptionId}`
- `playerNotifications/{notificationId}`
- `leagueContributions/{contributionId}`

## v0.18.0 evidence and publication

- `seasonEvidenceClaims/{claimId}`
- `seasonEvidenceDecisions/{decisionId}`
- `leagueEvidenceReviewers/{leagueId_userId}` — retired legacy records; no longer used for client authorization or new writes.
- `leagueLeaderboardSnapshots/{leagueId_dateKey_revision}`

Collections appear only after their first document is created.

## Administrative and library collections

- `announcements`
- `exerciseSuggestions`
- `librarySuggestions`
- `publishedLibraryItems`
- `libraryReleases`
- `clientErrorReports`
- `auditEvents`

## Retired collections

- `teams`
- `playerTeams`
- `teamInvites`

Rules deny all use of permanent-Team collections.

## Data rules

- Invitation collections support direct known-code reads, not enumeration.
- Membership and participant counts change atomically.
- Claim creation is linked to the newly created source entry through `evidenceClaimIds`.
- New reviewer assignments are disabled; historical assignment documents remain server-managed legacy data.
- Evidence decisions, claim status, contribution release/reversal, notification and audit records are atomic.
- Player leaderboard snapshots are immutable and player-readable only after publication.
- Players cannot read another player's live contribution stream in v2.
- Completed contribution and snapshot history remains permanent.

## v0.19 command-centre reads

The command centre reads existing collections only: `leagues`, `leagueHouses`, `leagueMemberships`, `leadershipElections`, `seasonEvidenceClaims`, `seasonEvidenceDecisions`, `leagueContributions` and `leagueLeaderboardSnapshots`. Security Rules are unchanged from v0.18.0. Queries remain role-scoped and no command-centre collection is introduced.

## v0.20.0 additions

- `entryCorrectionHeads` — owner-readable current-version pointers; Platform Administrator create/update only; no delete.
- `entryCorrections` — owner-readable immutable correction records; Platform Administrator create only.

`challengeEntries`, `leagueContributions` and `seasonEvidenceClaims` receive backwards-compatible optional correction metadata. No bulk migration is required.

## `seasonTrustedRuns` — v0.21.0

<!-- RELEASE_STATUS: DEPLOYED -->

Purpose: immutable summaries of successful trusted local publications.

Client access:

- read: Platform Administrators and administrators assigned to the referenced season;
- create/update/delete: denied to every client role.

Admin SDK publication also creates a trusted `leagueLeaderboardSnapshots` document and an `auditEvents` record, then advances the standard league publication pointer.

## Trusted account-deletion collections (v0.22.0)

### `accountDeletionRequests`
Player-owned request document. Clients may create, cancel or reopen within the constrained lifecycle; Platform Administrators may acknowledge. Trusted Admin SDK processing bypasses client Rules for later states.

### `accountDeletionExecutions`
Administrator-only readable operational state. All client writes are denied. Records support safe resume after partial failure.

### `accountDeletionReceipts`
Administrator-only readable immutable completion receipt. All client writes are denied.

Shared documents are updated in place only to replace identity and attach anonymisation metadata. Private documents are deleted.

## Power Play records (v0.23.0)

### `leaguePowerPlayWeeks/{leagueId}_{weekKey}`

One document per official v3 season week. Players may read only started weeks for seasons they can access. Platform and season administrators may read operational assignments. Client writes are restricted to valid audited transactions and frozen definitions.

### `leagues/{leagueId}.powerPlayState`

Append-only used-ID summary and selection sequence. A replaced ID remains present so it cannot be selected again.

### Frozen policy

`ruleset.powerPlayPolicy.powerPlayDefinitions` is a map keyed by Power Play ID. Weekly assignment name, multiplier and categories must exactly match the frozen definition.

## v0.24 development — immutable House assignment history

### `leagueHouseAssignmentHistory/{sourceId}_{userId}`

Append-only v4 season records for opening C.H.A.O.S. assignments and weekly House roster swaps. Each record preserves the player identity used at the time, previous House, new House, assignment method, source operation, actor, audit link and creation time.

Client access:

- read/query: season members, authorised season administrators and Platform Administrators;
- create: only as part of a Rules-validated v4 C.H.A.O.S. or weekly roster-swap operation;
- update/delete: denied to every client role.

The live `leagueMemberships` document remains the efficient current-House record. Assignment history is the permanent timeline and does not rewrite historical `leagueContributions`. Trusted account deletion anonymises player identity in these shared records while preserving the House movement facts.



### v0.24 House movement administrator corrections

A Platform Administrator may bypass only the one-week post-move rest restriction for a factual correction. The immutable `leagueRosterSwaps` document stores `overrideApplied`, `overrideReason`, and `overriddenPlayerIds`. The affected player's `leagueHouseAssignmentHistory` record repeats the correction flag and reason, while the audit event records the same context. Same-week repeat movement, House weekly locks, and current House leadership are never bypassed by this path.


## leagueCompositionProfiles

Private, season-scoped optional composition responses introduced by v0.24 Checkpoint 6. Document ID is deterministic: `{leagueId}_{userId}`.

Fields:
- `leagueId`
- `userId`
- `value` (`woman`, `man`, `non-binary-or-another`, `prefer-not-to-say`)
- `profileVersion` = `season-composition-v1`
- `createdAt`
- `updatedAt`

Privacy boundary:
- the player may get/create/update/delete only their own response;
- Platform Administrators and authorised season administrators may read exact responses for operational balancing;
- House leaders and ordinary season members cannot read another player's response;
- trusted account deletion deletes this private record;
- `leagueHouseBalanceWeeks` stores immutable member-safe weekly metadata; `leagueHouseBalanceHouseWeeks` stores one member-safe House row per week; exact counts live only in administrator-readable `leagueHouseBalancePrivateWeeks` and `leagueHouseBalancePrivateHouseWeeks`. Public rows contain no player identifiers or exact response/disclosure counts.
