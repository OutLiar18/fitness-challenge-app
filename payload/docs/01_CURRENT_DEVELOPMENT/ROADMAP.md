# Champions Legacy Challenge — Roadmap

Last updated: 1 August 2026

## Phase 1 — Core tracking platform

Status: Complete

- Authentication, profiles and ten activity categories.
- Factual Firestore entries, validation and normalisation.
- Explainable Points Engine v2 and Running/Cardio cross-contribution.
- Journal, local-safe dates, libraries and suggestions.

## Phase 2 — Release confidence

Status: Ongoing discipline

Completed:

- Firestore rules deployment workflow.
- Domain tests and safe dependency review.
- Route-level lazy loading.
- Shared player-data and announcement providers.

Remaining:

- Error-monitoring strategy.
- Historical aggregation and pagination.
- Repeatable browser and Firestore emulator testing.

## Phase 3 — Personal progression and experience

Status: Complete

- Daily and weekly goals with moderate bonuses.
- Forgiving streak and earned shield.
- Experience points, levels, titles, achievements and personal records.
- Chronological progress timeline.
- Responsive multi-route application shell.
- Built-in Legacy Avatars and secure profile editing.

## Phase 4 — Secure administration and moderation

Status: Operational foundation complete in v0.9.0

Complete:

- Trusted Platform Administrator authorization.
- Live announcement publishing and archiving.
- Cross-device announcement read status.
- Suggestion review queues.
- User role and team management foundation.
- Immutable audit history.

Next:

- Publish approved suggestions into versioned global libraries.
- Add paginated administrative queries.
- Add Firestore emulator rule tests.
- Add versioned challenge configuration and release approval workflow.

## Phase 5 — Competition and community

Status: Structured preview only

- Teams.
- Leagues and seasons.
- Leaderboards.
- Challenge templates.
- Social encouragement.

Competition must preserve consistency over natural athletic ability. League scoring must freeze an immutable versioned ruleset.

## Phase 6 — Intelligence and analytics

Status: Structured preview only

- Trend charts and weekly summaries.
- Goal recommendations.
- Training and habit insights.
- Transparent, user-controlled Legacy Coach.

## Guardrails

- Never duplicate scoring or progression logic in UI components.
- Never trust a client-controlled role without Firestore enforcement.
- Store facts; derive progress.
- Audit every privileged change.
- Humour and easter eggs must remain optional, respectful and non-blocking.
- Do not start live leagues before immutable challenge configuration exists.
