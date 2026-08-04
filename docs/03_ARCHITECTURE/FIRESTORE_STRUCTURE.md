# Champions Legacy Challenge — Firestore Structure

Last updated: 4 August 2026  
Current release target: v0.18.0  
Current production: v0.17.0

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
- `leagueEvidenceReviewers/{leagueId_userId}`
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
- Reviewer assignment changes require an audit record and preserve original creation metadata.
- Evidence decisions, claim status, contribution release/reversal, notification and audit records are atomic.
- Player leaderboard snapshots are immutable and player-readable only after publication.
- Players cannot read another player's live contribution stream in v2.
- Completed contribution and snapshot history remains permanent.

## v0.19 command-centre reads

The command centre reads existing collections only: `leagues`, `leagueHouses`, `leagueMemberships`, `leadershipElections`, `seasonEvidenceClaims`, `seasonEvidenceDecisions`, `leagueEvidenceReviewers`, `leagueContributions` and `leagueLeaderboardSnapshots`. Security Rules are unchanged from v0.18.0. Queries remain role-scoped and no command-centre collection is introduced.
