# Champions Legacy Challenge — Architecture Overview

Last updated: 1 August 2026  
Current release: v0.10.0

## Application structure

```text
Firebase Authentication
        ↓
PrivateRoute
        ↓
PlayerDataProvider + GlobalLibraryProvider + AnnouncementProvider
        ↓
Adaptive AppShell and lazy route navigation
        ↓
Route-level pages
        ↓
Reusable presentation components
        ↓
Domain, repository and administration services
        ↓
Cloud Firestore + Security Rules
```

## Protected route tree

```text
ProtectedApp
└── PlayerDataProvider
    └── GlobalLibraryProvider
        └── AnnouncementProvider
            └── AppShell
            ├── /dashboard
            ├── /log
            ├── /progress
            ├── /announcements
            ├── /profile
            ├── /admin
            └── /future/:featureId
```

## Player data flow

```text
Firestore factual entries + user profile
        ↓
shared real-time subscriptions
        ↓
PlayerDataProvider
        ↓
points / statistics / progression services
        ↓
Dashboard, Progress, Profile and navigation
```

One protected app session creates one player profile subscription and one owner-scoped entry subscription.

## Announcement data flow

```text
published Firestore announcements
        +
bundled fallback release history
        ↓
announcement model merge and sort
        ↓
AnnouncementProvider
        ↓
Announcements page + navigation unread badges
```

Read state is stored under the signed-in player and synchronises across devices.

## Shared library data flow

```text
source-controlled baseline + published Firestore items
        ↓
GlobalLibraryProvider
        ↓
Exercise, Cardio and Skill selectors
        ↓
entry stores selected published definition snapshot
```

Approved suggestions require a separate versioned release before appearing in player forms.

## Administration flow

```text
trusted administrator action
        ↓
administration service validation
        ↓
Firestore write batch
        ├── business-object change
        └── immutable audit event
        ↓
Security Rules verify role + getAfter(audit event)
```

React visibility is only presentation. Firestore Security Rules remain authoritative.

## Domain boundaries

- `constants/` — category, goal, progression, navigation, administration and content configuration.
- `services/entries/` — factual activity persistence and orchestration.
- `services/statistics/` — goals, totals and category contributions.
- `services/progression/` — bonuses, streaks, experience points, achievements, records and timeline.
- `services/announcements/` — pure announcement model, published reads and read-state writes.
- `services/admin/` — privileged announcement, moderation, library release, role, error-resolution and audit operations.
- `services/monitoring/` — pure error sanitization and optional client reporting.
- `services/libraries/globalLibrary*` — shared published-library model and Firestore subscription.
- `utils/displayFormatters` — complete player-facing measurement and reward labels.
- `context/` — shared route-session state, never scoring formulas.
- `components/` — presentation and interaction patterns.
- `pages/` — route-level orchestration.

## Persistence principle

Firestore stores factual activity, profile identity, live announcements, suggestion decisions and audit history. Competitive points, goal bonuses, streaks, experience points, records and timeline events remain derived until a documented versioned aggregation strategy is required.

## Future requirements

- Firestore Emulator Suite security tests.
- Approved-suggestion publishing into versioned global libraries.
- Paginated historical and administrative queries.
- Immutable challenge configuration snapshots for seasons.
- Server-side aggregation when scale requires it.
