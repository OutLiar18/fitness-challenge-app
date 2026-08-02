# Champions Legacy Challenge — Architecture Overview

Last updated: 1 August 2026  
Current release: v0.13.1

## Protected application tree

```text
PrivateRoute
└── PlayerDataProvider
    └── GlobalLibraryProvider
        └── AnnouncementProvider
            └── TeamProvider
                └── LeagueProvider
                    └── CoachProvider
                        └── AppShell
```

Providers key asynchronous state to the current user and scope so data from a previous account, team or trusted role is not exposed while subscriptions change.

## Routes

- `/dashboard` — overview and next actions.
- `/log` — factual activity entry and Journal.
- `/progress` — goals, progression, achievements, records and timeline.
- `/announcements` — published communication and read state.
- `/profile` — identity, team and account overview.
- `/teams` — creation, joining, roster and captain operations.
- `/leagues` — seasonal creation, registration, lifecycle and standings.
- `/coach` — transparent recommendations and private preferences.
- `/admin` — trusted platform operations.

## Core data flows

### Personal activity

```text
challengeEntries → statistics / points / progression → player pages
```

### Team accountability

```text
player entries + progression
        ↓ pure current-week snapshot
TeamProvider
        ↓ owner-scoped bounded update
team roster
```

### League contribution

```text
active membership + frozen league
        ↓
create activity entry
        ↓ one Firestore batch
challengeEntries/{entryId}
leagueContributions/{leagueId_entryId}
        ↓ pure consistency-v1 standings
```

Deleting a recent source entry removes active-league contributions only. Final season contributions remain historical records.

### Legacy Coach

```text
current and previous seven-day factual entries
        ↓ pure coachModel rules
summary + recommendations + evidence
```

No external model receives player data.

## Reliability boundaries

- Global monitoring installs once and handles React, browser, promise and stale-chunk failures.
- Stale chunk recovery reloads at most once per browser session guard.
- Firebase, React and remaining vendor dependencies are separated by Vite production chunk groups.
- Release verification checks version, required files, updater contamination and branded Hosting configuration.

## Persistence principle

Store factual activity, membership, frozen league configuration, immutable final contribution snapshots and trusted decisions. Derive personal progress, current-week team summaries, standings and Coach guidance.

## Security boundary

React controls presentation. Firestore Rules enforce identity, role, membership, shape, lifecycle, audit and historical integrity. High-stakes competition requires trusted backend score recalculation.
