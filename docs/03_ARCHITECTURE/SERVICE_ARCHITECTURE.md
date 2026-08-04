# Champions Legacy Challenge — Service Architecture

Current release target: v0.17.0  
Current production: v0.16.0

## Pure domain services

- `services/points` — one scoring source of truth and structured breakdowns.
- `services/statistics` — totals, goals and cross-category contributions.
- `services/progression` — bonuses, streaks, Experience Points, records and timeline.
- `services/seasons/seasonModel.js` — season dates, House identity, C.H.A.O.S. readiness/distribution, elections, roster identifiers and Pocket quantities.
- `services/seasons/leagueModel.js` — lifecycle, standing and honour derivation.
- `services/analytics/analyticsModel.js` — non-persistent weekly trends, consistency, category balance and observations.
- `services/account/accountModel.js` — onboarding compatibility and account-request vocabulary.
- `services/account/dataExportModel.js` — portable timestamp serialisation and filename generation.
- `services/dateService.js` — local-calendar-safe dates.

## Firestore orchestration

- `services/account/onboardingService.js` completes or replays the versioned guide.
- `services/account/accountRequestService.js` subscribes to, submits, cancels and reopens the player’s request.
- `services/account/dataExportService.js` reads account-owned sections, records unavailable sections and builds the JSON export.
- `services/admin/accountRequestService.js` lists requests and performs audited acknowledgement.
- Existing repository/service modules continue to own entries, seasons, libraries, notifications and administrative writes.

Transaction services re-read current documents where historical integrity matters. UI components never assemble privileged batches directly.

## Provider boundaries

Player data, leagues, announcements, private notifications, Coach preferences and global libraries keep separate providers. Onboarding consumes the existing player profile. Help & Privacy reads account tools on demand rather than adding a permanent provider subscription for every route.

## Rule

Route components may coordinate user interaction but must not reproduce scoring, account-request lifecycle, season eligibility or persistence rules.
