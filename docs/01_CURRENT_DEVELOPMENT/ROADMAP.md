# Champions Legacy Challenge — Roadmap

Last updated: 1 August 2026

## Phase 1 — Core tracking platform

Status: Complete

- Authentication, profiles and ten activity categories.
- Factual Firestore entries, validation and normalisation.
- Explainable Points Engine v2 and Running/Cardio cross-contribution.
- Journal, local-safe dates, libraries and suggestions.

## Phase 2 — Personal progression and experience

Status: Complete

- Daily and weekly goals with moderate bonuses.
- Forgiving streak and earned shield.
- Experience points, levels, titles, achievements and personal records.
- Chronological progress timeline.
- Responsive multi-route application shell.
- Built-in Legacy Avatars and secure profile editing.

## Phase 3 — Secure administration and communication

Status: Complete foundation

- Trusted Platform Administrator authorization.
- Live announcements and cross-device read status.
- Suggestion review queues.
- User role and team management foundation.
- Immutable audit history.
- Versioned publication of approved suggestions into shared libraries.
- Archiving that preserves historical entry facts.

## Phase 4 — Pre-1.0 release hardening

Status: Implemented in v0.10.0; verification and user review next

- Paginated administrative users, audit events and error reports.
- Firestore Emulator Security Rules tests.
- Optional first-party client error monitoring.
- Firebase Hosting preview and production configuration.
- Repeatable release-check scripts.
- Full responsive, accessibility, security and gameplay QA checklist.

Remaining before a v1.0 decision:

- Run all local and emulator checks on the development computer.
- Deploy and test a preview channel.
- Complete manual QA.
- Fix verified defects and add regression tests.
- Review bundle size and initial loading performance using real build output.
- Obtain explicit user approval of the v1.0 scope.

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
- Version global libraries and future challenge rules.
- Humour and easter eggs must remain optional, respectful and non-blocking.
- Do not start live leagues before immutable challenge configuration exists.
- Do not call the product v1.0 until the user explicitly approves it.
