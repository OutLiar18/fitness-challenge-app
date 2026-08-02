# Champions Legacy Challenge — Firestore Structure

Last updated: 1 August 2026  
Current release: v0.13.1

## Player and activity collections

- `users/{userId}` — identity and trusted role.
  - `library/{itemId}` — personal library.
  - `announcementReads/{announcementId}` — private cross-device read state.
  - `coach/preferences` — private Legacy Coach settings.
- `challengeEntries/{entryId}` — owner-scoped factual activity; immutable after creation and deletable only during the recent edit window.

## Teams

- `teams/{teamId}` — identity, captain, `memberCount` and invitation code.
  - `members/{userId}` — roster identity, role and current-week accountability snapshot.
- `playerTeams/{userId}` — one-team membership pointer.
- `teamInvites/{code}` — known-code mapping; direct get only, no collection listing.

## Leagues

- `leagues/{leagueId}` — frozen season configuration, lifecycle, `participantCount` and `participantLimit`.
- `leagueInvites/{code}` — known-code registration mapping; direct get only, no collection listing.
- `leagueMemberships/{leagueId_userId}` — season identity/team snapshot and membership status.
- `leagueContributions/{leagueId_entryId}` — immutable entry-linked activity contribution.

Active contribution snapshots may be removed with a recent source entry. Completed/archived contribution snapshots remain permanent.

## Communication and administration

- `announcements/{announcementId}` — draft, published and archived messages.
- `exerciseSuggestions/{suggestionId}` — exercise moderation.
- `librarySuggestions/{suggestionId}` — Cardio and Skill moderation.
- `publishedLibraryItems/{itemId}` — shared definitions.
- `libraryReleases/{releaseId}` — immutable publication releases.
- `clientErrorReports/{reportId}` — sanitised client failures.
- `auditEvents/{auditId}` — immutable privileged history.

## Index expectations

Queries currently use simple equality, membership and array-contains constraints. Add composite indexes only in response to a confirmed Firebase query error and document the requirement.

## Data rules

- Store factual activity and trusted decisions; derive personal progression.
- Never allow a player to own two active `playerTeams` pointers.
- Keep team and league counts paired with membership writes.
- Never mutate a league contribution after creation.
- Never change a league ruleset after creation.
- Preserve completed/archived league history.
- Archive trusted history instead of deleting it.
