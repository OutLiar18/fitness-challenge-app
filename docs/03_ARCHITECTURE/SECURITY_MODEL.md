# Champions Legacy Challenge — Security Model

Last updated: 1 August 2026  
Current release: v0.13.1

## Principles

- Firebase Authentication establishes identity.
- Firestore Security Rules enforce authorization and data shape.
- React visibility is not security.
- Trusted roles cannot be self-assigned.
- Privileged league/platform changes require same-batch audit events.
- Historical competitive snapshots become immutable when a season completes.

## Challenge entries

- Create requires the authenticated owner, a supported category, server creation timestamp and recent challenge date.
- Category data must match bounded category-specific shape.
- Updates are denied.
- Reads are owner-only.
- Deletion is owner-only and limited to the recent editable period.
- Active league contribution deletion must be paired with source-entry deletion.
- Completed/archived league contribution deletion is denied even when the personal entry is removed.

## Teams

- A team may be created only when the player has no `playerTeams` pointer.
- Team, captain member, player pointer and invitation are created atomically.
- Joining requires a known active code and transactionally increments `memberCount` without exceeding 25.
- Invite documents may be fetched directly by code but the collection cannot be listed.
- Only the captain edits team identity.
- Captain transfer requires team, member roles and player pointers to agree after the batch.
- A member updates only their bounded weekly snapshot.
- A non-captain leaves by deleting paired membership data and decrementing member count atomically.

## Leagues

- Only a Platform Administrator or trusted `leagueAdmin` creates a Draft.
- Creation requires frozen rules, creator administration, invitation and audit event in one batch.
- Platform Administrators manage every league; League Administrators manage assigned leagues.
- Lifecycle changes move forward one stage and remain audited.
- Rules, dates, mode and administrator list remain immutable through lifecycle changes.
- Registration requires a known active code and paired membership/count transaction.
- `participantCount` must remain between zero and `participantLimit: 200`.
- Invite documents may be fetched directly by code but cannot be listed.
- Contributions require active league/membership, matching identity/team snapshot, matching source entry category/date and frozen rules version.
- Players may read their own contribution snapshots; league members and trusted administrators may read standings data.
- Contribution updates are always denied.
- Active contributions may be deleted only when the source entry is absent after the same write.
- Completed and archived contributions are permanent.

## Legacy Coach

Coach preferences are readable and writable only by their owner. Recommendations are local derived data and create no shared Firestore record.

## Platform systems

Existing protections remain for profiles, announcement reads, announcements, moderation, versioned libraries, audit history and sanitised client error reports.

## Trust boundary

Security Rules cannot reproduce the complete category scoring engine. Team summaries and league contribution points remain client-calculated and bounded. Friendly competition is supported; money, prizes or high-stakes ranking require trusted server-side recalculation.

## Test requirement

`npm run test:rules` must pass all 15 v0.13.1 tests before deploying `firestore.rules`.
