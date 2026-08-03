# Champions Legacy Challenge — Service Architecture

Current release target: v0.15.0

## Pure domain services

- `services/points` — one scoring source of truth and structured breakdowns.
- `services/statistics` — totals, goals and cross-category contributions.
- `services/progression` — bonuses, streaks, Experience Points, records and timeline.
- `services/seasons/seasonModel.js` — season dates, House identity, C.H.A.O.S. readiness/distribution, elections, roster identifiers and Pocket quantities.
- `services/seasons/leagueModel.js` — lifecycle, standing and honour derivation.
- `services/analytics/analyticsModel.js` — non-persistent weekly trends, consistency, category balance and transparent observations.
- `services/dateService.js` — local-calendar-safe dates.

## Firestore orchestration

Repository/service modules perform writes, subscriptions and transactions. They validate current documents again inside transactions where historical integrity matters.

## Provider boundaries

Player data, leagues, announcements, private notifications, Coach preferences and global libraries keep separate providers. Inbox composes two provider outputs but does not merge their repositories or permissions.

## Rule

Route components may coordinate user interaction but must not reproduce scoring, season eligibility or persistence rules.
