# Champions Legacy Challenge — Firestore Structure

Last updated: 1 August 2026

## Player and activity collections

- `users/{userId}` — identity and trusted role.
  - `library/{itemId}` — personal library.
  - `announcementReads/{announcementId}` — private cross-device read state.
  - `coach/preferences` — private Legacy Coach settings.
- `challengeEntries/{entryId}` — immutable owner-scoped factual activity.

## Teams

- `teams/{teamId}` — team identity, captain and access code.
  - `members/{userId}` — roster identity, role and weekly accountability snapshot.
- `playerTeams/{userId}` — one-team membership pointer.
- `teamInvites/{code}` — active code-to-team mapping.

## Leagues

- `leagues/{leagueId}` — frozen season configuration and lifecycle.
- `leagueInvites/{code}` — registration state for an access code.
- `leagueMemberships/{leagueId_userId}` — season identity/team snapshot and membership status.
- `leagueContributions/{leagueId_entryId}` — immutable entry-linked activity contribution.

## Communication and administration

- `announcements/{announcementId}` — draft, published and archived messages.
- `exerciseSuggestions/{suggestionId}` — exercise moderation.
- `librarySuggestions/{suggestionId}` — Cardio and Skill moderation.
- `publishedLibraryItems/{itemId}` — shared definitions.
- `libraryReleases/{releaseId}` — immutable publication releases.
- `clientErrorReports/{reportId}` — sanitised client failures.
- `auditEvents/{auditId}` — immutable privileged history.

## Index expectations

Queries currently use simple equality, membership and array-contains constraints. Firebase may request composite indexes during real data testing; add only indexes required by confirmed query errors and document them.

## Data rules

- Never store derived personal progression as authority.
- Never allow a player to own two `playerTeams` documents.
- Never mutate a league contribution after creation.
- Never change a league ruleset after creation.
- Delete linked league contributions when the source entry is deleted.
- Archive trusted history instead of deleting it.
