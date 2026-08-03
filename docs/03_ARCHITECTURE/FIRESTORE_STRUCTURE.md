# Champions Legacy Challenge — Firestore Structure

Last updated: 3 August 2026  
Current release target: v0.16.0

## Player and activity

- `users/{userId}`
  - `library/{itemId}`
  - `announcementReads/{announcementId}`
  - `coach/preferences`
- `challengeEntries/{entryId}`

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

## Retired collections

- `teams`
- `playerTeams`
- `teamInvites`

Firestore Rules deny all use of these permanent-Team collections from v0.14 onward. Existing data must be inspected before deployment and is not automatically converted.

## Administrative collections

Announcements, moderation queues, published library items/releases, client error reports and audit events remain unchanged.

## Data rules

- Invitation collections support direct known-code reads, not enumeration.
- Membership and participant counts change atomically.
- House leadership must match a finalised election or a valid Captain appointment.
- C.H.A.O.S., swaps, Pocket redemption and privileged lifecycle actions use atomic writes.
- Contribution updates are denied.
- Completed/archived contributions are permanent.
