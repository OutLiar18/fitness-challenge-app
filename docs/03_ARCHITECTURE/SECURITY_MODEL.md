# Champions Legacy Challenge — Security Model

Last updated: 1 August 2026

## Principles

- Firebase Authentication establishes identity.
- Firestore Security Rules enforce authorization and data shape.
- React visibility is not security.
- Trusted roles cannot be self-assigned.
- Privileged league/platform changes require same-batch audit events.
- Factual entries and league contributions are immutable after creation.

## Teams

- A team may be created only when the player has no `playerTeams` pointer.
- Team, captain member, player pointer and invitation must be created atomically.
- Joining requires an active invitation and paired member/pointer documents.
- Only the captain may edit team identity.
- Captain transfer requires the team, both member roles and both player pointers to agree after the batch.
- A member may update only their own bounded weekly snapshot.
- A non-captain may leave only by deleting both membership documents together.

## Leagues

- Only a Platform Administrator or a profile with `leagueAdmin` may create a Draft.
- The creator must be listed as an administrator and create a matching audit event and invitation in the same batch.
- Only an assigned administrator may move a league forward one supported stage.
- Rules, dates, mode and administrator list remain immutable through lifecycle transitions.
- Registration requires an active league invitation.
- League contribution creation requires an active league, active owner membership, matching identity/team snapshot, matching entry category/date and the frozen rules version.
- Contribution updates are denied; deletion requires the source entry to be absent after the batch.

## Legacy Coach

Coach preferences are readable and writable only by their owner. Allowed values and server timestamp are constrained. Recommendations are local derived data and create no shared Firestore document.

## Platform systems

Existing protections remain for profiles, announcements, moderation, versioned libraries, audit history and client error reports.

## Trust boundary

Security Rules cannot reproduce the full category scoring engine. League contribution points remain client-calculated and bounded. Friendly competition is supported; monetary or prize competition requires trusted server-side recalculation.

## Test requirement

`npm run test:rules` must pass all 12 v0.11.0 tests before deploying `firestore.rules`.
