# Champions Legacy — Roadmap

Last updated: 30 July 2026

## Phase 1 — Core tracking platform

Status: Complete for v0.5

- Authentication and profiles.
- Ten challenge categories.
- Firestore entries and personal Reading library.
- Validation and normalisation.
- Points Engine v2.
- Effective Repetitions and difficulty.
- Running/Cardio cross-category contribution.
- Daily statistics and goals.
- Journal navigation and read-only history.
- Responsive accessible UI.
- Custom content suggestions.

## Phase 2 — Release confidence

Status: Next

- Fresh dependency install and production build verification.
- Firebase integration QA.
- Firestore rules deployment.
- Expand automated tests beyond the current high-risk domain smoke suite.
- Error monitoring strategy.
- Entry history pagination design.

## Phase 3 — Personal progression

Status: Planned

- Streaks with forgiving recovery rules.
- XP and player levels.
- Personal milestones.
- Achievement engine.
- Progress timeline and weekly summaries.

Derived progression must consume the existing point breakdown rather than duplicating scoring rules.

## Phase 4 — Administration and moderation

Status: Planned

- Role/claim-based administrator access.
- Review queues for Exercise, Cardio and Skill suggestions.
- Library publishing tools.
- User and challenge management.
- Audit history.

## Phase 5 — Competition and community

Status: Future

- Teams.
- Leagues and seasons.
- Leaderboards.
- Challenge templates.
- Social encouragement and notifications.

Competition must preserve the core principle that consistency matters more than natural athletic ability.

## Phase 6 — Intelligence and analytics

Status: Future

- Personal trend charts.
- Goal recommendations.
- Training and habit insights.
- AI Coach with transparent, user-controlled guidance.

## Guardrails

Do not begin a later phase by bypassing existing services. New systems must use factual entries, point breakdowns and category configuration as their source of truth.
