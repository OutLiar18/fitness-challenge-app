# Champions Legacy Challenge — Firestore Structure

Last updated: 4 August 2026  
Current release target: v0.17.0  
Current production: v0.16.0

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
- `leagueContributions/{leagueId_entryId}`

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

Firestore Rules deny all use of these permanent-Team collections from v0.14 onward.

## Account-request rules

- The request document ID equals the Firebase user ID.
- The player may get, create, cancel and reopen only their own request.
- Platform Administrators may list and acknowledge requests.
- Acknowledgement requires a matching immutable audit event in the same batch.
- Client deletion is denied; final trusted removal remains external to this collection.

## Data rules

- Invitation collections support direct known-code reads, not enumeration.
- Membership and participant counts change atomically.
- C.H.A.O.S., swaps, Pocket redemption and privileged lifecycle actions use atomic writes.
- Own private votes and sanitised own error reports are readable for personal export.
- Contribution updates are denied and completed/archived contribution history remains permanent.
