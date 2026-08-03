# Champions Legacy Challenge — Component Architecture

Current release target: v0.15.0

## Route-level workspaces

- `Dashboard.jsx` — current status and focused next actions.
- `ActivityLog.jsx` — category logging and date-based Journal.
- `Progress.jsx` — Experience Points, streaks, achievements, records and timeline.
- `Analytics.jsx` — derived personal trends and consistency, with no persistence or scoring duplication.
- `Seasons.jsx` — season creation, registration, lifecycle, standings and honours.
- `Houses.jsx` — House forge, visible C.H.A.O.S. readiness, roster, ballots and weekly swap.
- `PocketWeek.jsx` — pre-season reserves and deliberate redemption.
- `Inbox.jsx` — tabbed public announcements and private notifications.
- `LegacyCoach.jsx`, `Rulebook.jsx`, `PointsGuide.jsx`, `Profile.jsx`, `Admin.jsx`.

## Shared shell

`AppShell` owns responsive navigation, player identity, compact progression status and the More dialog. It does not calculate progression or permissions itself.

Desktop navigation is grouped by Journey, Competition and Communications. Profile is reached through the player identity block rather than a duplicate desktop route. Mobile uses four direct destinations plus More.

## Communications boundary

Inbox is one presentation surface, not one data model. `AnnouncementProvider` and `NotificationProvider` remain separate because public announcements and owner-scoped private messages have different read rules, lifecycle and security requirements.

## Analytics boundary

`Analytics.jsx` renders results from `services/analytics/analyticsModel.js`. The model consumes factual entries and point breakdowns. Components do not calculate category scoring.

## Reuse rules

- Business logic belongs in services.
- Repeated interface behaviour belongs in reusable components.
- Route redirects protect old bookmarks but old page implementations remain removed.
- Presentational components receive derived data through props or existing providers.
