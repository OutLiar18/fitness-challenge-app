# Champions Legacy Challenge — Component Architecture

Current release target: v0.16.0

## Route-level workspaces

- `Dashboard.jsx` — current status and focused next actions; intentionally direct rather than tabbed.
- `ActivityLog.jsx` — separate Log Activity and Journal workspaces.
- `Progress.jsx` — Overview plus selectable Achievements, Records, Timeline and Level Journey.
- `Analytics.jsx` — persistent summary cards plus Trends, Consistency, Category Balance and Insights.
- `Seasons.jsx` — Browse, Join and Create workspaces; selected-season Overview, Standings and Honours.
- `Houses.jsx` — Overview, Roster, Leadership, Roster Turn and authorised Management.
- `PocketWeek.jsx` — phase-aware Store Activity, Your Pocket and How It Works.
- `Inbox.jsx` — purpose-built public announcements and private notifications tabs.
- `LegacyCoach.jsx` — Recommendations, Evidence and Preferences.
- `PointsGuide.jsx` — Activity Scoring, Bonuses and Difficulty, Season Scoring and Formula Reference.
- `Profile.jsx` — Overview, Personalise and Protections.
- `Admin.jsx` — seven operational workspaces using the same full-width section pattern.
- `Rulebook.jsx` — native disclosure sections remain the correct pattern for searchable reference content.

## Shared workspace pattern

`components/common/WorkspaceTabs.jsx` owns route-level progressive disclosure.

- Receives declarative tab metadata and the active identifier.
- Uses an accessible tablist on desktop.
- Supports Arrow keys, Home and End.
- Uses a labelled native select on small screens.
- Renders active content through `WorkspacePanel` with tab/panel relationships.
- Optional badges communicate counts or readiness without becoming the only source of meaning.
- `services/ui/workspaceModel.js` contains pure selection and keyboard-navigation helpers.

Pages remain responsible for choosing which summary content is always visible and which sections are available for the current role or season phase. Pages must resolve dynamic section availability before passing the active identifier to panels.

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
- Route-level tabs organise presentation; they must not own domain state or scoring.
- Route redirects protect old bookmarks but old page implementations remain removed.
- Presentational components receive derived data through props or existing providers.
