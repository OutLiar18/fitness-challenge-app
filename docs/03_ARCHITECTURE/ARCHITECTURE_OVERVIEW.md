# Champions Legacy Challenge — Architecture Overview

Last updated: 3 August 2026  
Current release: v0.14.0

```text
AuthProvider
└── ProtectedApp
    └── PlayerDataProvider
        └── LeagueProvider
            └── NotificationProvider
                └── AppShell
                    ├── Dashboard / Log / Progress
                    ├── Seasons / Houses / Pocket Week
                    ├── Notifications / Announcements / Profile
                    ├── Rulebook / Points Guide / Legacy Coach
                    └── Administration
```

## Boundaries

- Personal entries remain the factual source.
- LeagueProvider supplies visible seasons and the player’s memberships.
- House, election, roster and Pocket data subscribe only for the selected season/page.
- NotificationProvider owns private season notifications and unread count.
- Season domain calculations live outside React in `services/seasons` and `services/leagues`.
- Firestore Rules, not providers or components, are the authorization boundary.
