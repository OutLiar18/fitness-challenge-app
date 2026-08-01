# Champions Legacy Challenge — Architecture Overview

Last updated: 1 August 2026  
Current release: v0.11.0

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

The protected providers reuse one authenticated player session and expose route-level state without placing scoring formulas in React components.

## Routes

- `/dashboard` — overview and next actions.
- `/log` — factual activity entry and Journal.
- `/progress` — goals, progression, achievements, records and timeline.
- `/announcements` — published communication and read state.
- `/profile` — identity, live team and account overview.
- `/teams` — team creation, joining, roster and captain operations.
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
        ↓ pure weekly snapshot
TeamProvider
        ↓ owner-scoped member update
team roster
```

Team snapshots reuse the central Points Engine and do not become personal score authority.

### League contribution

```text
active memberships + frozen league document
        ↓
create activity entry
        ↓ one Firestore batch
challengeEntries/{entryId}
leagueContributions/{leagueId_entryId}
        ↓ pure consistency-v1 standings
player and team ranking
```

Deleting the source entry removes linked contribution documents in the same batch.

### Legacy Coach

```text
current and previous seven-day factual entries
        ↓ pure coachModel rules
summary + recommendations + evidence
```

No external model or API receives player data.

## Domain boundaries

- `services/teams/teamModel.js` — pure validation and weekly team snapshots.
- `services/teams/teamService.js` — team Firestore subscriptions and atomic membership operations.
- `services/leagues/leagueModel.js` — pure lifecycle, validation and standings.
- `services/leagues/leagueService.js` — league subscriptions, audited lifecycle and registrations.
- `services/coach/coachModel.js` — deterministic guidance and evidence.
- `services/coach/coachService.js` — owner-scoped preference persistence.
- `services/entries/entryRepository.js` — atomic entry and league-contribution persistence.

## Persistence principle

Store factual activity, membership, frozen league configuration, immutable contribution snapshots and trusted decisions. Derive personal progress, team summaries, league standings and Coach guidance.

## Security boundary

React controls presentation. Firestore Rules enforce identity, role, membership, data shape, lifecycle, audit and immutability. Any future high-stakes competition requires trusted server-side score recalculation.
