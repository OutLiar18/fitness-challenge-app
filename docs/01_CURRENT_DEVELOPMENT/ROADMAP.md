# Champions Legacy Challenge — Roadmap

Last updated: 1 August 2026

## Phase 1 — Core tracking platform

Status: Complete

- Authentication, profiles, factual entries and ten activity categories.
- Validation, local calendar dates, libraries and suggestions.
- Explainable Points Engine v2 and Running/Cardio cross-contribution.

## Phase 2 — Personal progression

Status: Complete

- Daily and weekly goals with moderate bonuses.
- Forgiving streak, shield, experience points, levels, achievements and records.
- Progress timeline, responsive navigation and built-in Legacy Avatars.

## Phase 3 — Administration and communication

Status: Complete foundation

- Live announcements and cross-device read state.
- Trusted roles, moderation, audit history and versioned shared libraries.
- Paginated administrative data and first-party error reporting.

## Phase 4 — Release hardening

Status: Complete foundation

- Firestore Emulator Security Rules tests.
- Firebase Hosting preview configuration.
- Repeatable release checks and QA documentation.

## Phase 5 — Teams and seasonal leagues

Status: Implemented in v0.11.0; integrated verification required

- One persistent team per player.
- Storage-free team emblems, invitations, rosters and captain transfer.
- Seasonal league Draft, Registration, Active, Completed and Archived stages.
- Immutable `consistency-v1` rules and entry-linked contribution snapshots.
- Individual and team standings that cap daily activity and reward participation.
- League-scoped authority and audit records.

Deferred refinements:

- Team disbanding and archived team history.
- Server-authoritative league score recalculation.
- League history privacy settings.
- Seasonal awards and trophy-cabinet integration.
- Dispute and evidence review workflows.

## Phase 6 — Legacy Coach

Status: Implemented in v0.11.0; integrated verification required

- Optional local guidance.
- Current-versus-previous-week comparison.
- Explainable recommendations with evidence.
- Player-controlled tone and focus.

Deferred refinements:

- Longer-term trend charts.
- User-approved goal planning.
- More advanced but still transparent recommendation rules.

## Remaining before v1.0

- Pass v0.11.0 local, emulator and integration tests.
- Conduct the user’s complete mobile and desktop review.
- Implement requested corrections.
- Add account deletion, personal-data export and privacy/support information.
- Complete final accessibility, performance and release-candidate QA.
- Obtain explicit user approval.

## Guardrails

- Never duplicate activity scoring in Teams, Leagues or UI components.
- Store factual entries and immutable seasonal snapshots; derive standings.
- Never let a client-controlled role bypass Firestore Rules.
- Administrative authority never creates competitive points.
- Legacy Coach must remain optional, explainable and non-diagnostic.
- Do not call the product v1.0 until explicitly approved.
