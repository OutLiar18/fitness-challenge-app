# Champions Legacy Challenge — Architecture Overview

Last updated: 1 August 2026
Current release: v0.7.0

## Application structure

```text
Firebase Authentication
        ↓
PrivateRoute
        ↓
PlayerDataProvider
(profile + one owner-scoped entry subscription)
        ↓
AppShell + route navigation
        ↓
Lazy-loaded route pages
        ↓
Reusable presentation components
        ↓
Pure domain services and configuration
```

## Protected route tree

```text
ProtectedApp
└── PlayerDataProvider
    └── AppShell
        ├── /dashboard
        ├── /log
        ├── /progress
        ├── /announcements
        ├── /profile
        ├── /admin
        └── /future/:featureId
```

`AppShell` owns navigation and route framing. It does not calculate points, goals or progression.

## Data flow

```text
Firestore factual entries
        ↓
entry repository subscription
        ↓
PlayerDataProvider
        ↓
route page orchestration
        ↓
points / statistics / progression services
        ↓
presentation components
```

One signed-in application session creates one shared entry subscription. Navigating between Dashboard, Log, Progress and Profile does not create parallel listeners.

## Domain boundaries

- `constants/` — category, goal, progression, navigation and content configuration.
- `services/entries/` — Firestore entry persistence and orchestration.
- `services/statistics/` — goals, totals and category contributions.
- `services/progression/` — bonuses, streaks, XP, achievements, records and timeline.
- `services/announcements/` — replaceable announcement data boundary.
- `context/PlayerDataProvider` — shared route-session data, not business logic.
- `components/layout/` — navigation and page framing.
- `pages/` — route-level orchestration.

## Persistence principle

Firestore stores factual activity and user-owned library data. Calculated points, goal bonuses, streaks, XP, records and timeline events remain derived until a documented aggregation/versioning strategy is required.

## Future requirements

- Secure admin claims and audit history.
- Persisted announcement repository.
- Paginated historical entry access.
- Immutable challenge ruleset snapshots for seasons.
- Server-side aggregation when scale requires it.
