# Champions Legacy — Current Context

Version target: 0.7.0
Date: 1 August 2026
Phase: Navigation and Experience Foundation

## Current objective

Verify and release the new multi-route application experience without changing established scoring or progression rules.

## Recently completed

- Shared protected app shell.
- Single player-data provider across routes.
- Dedicated Log & Journal page.
- Dashboard converted into an overview.
- Progress timeline added.
- Announcements and Profile pages.
- Safe Admin and future-module scaffolds.
- Route-level lazy loading.
- Motivation library and subtle easter eggs.
- Unused code and temporary root documents removed.

## Architectural direction

- One Firestore subscription per signed-in app session.
- Business logic remains in services.
- Route pages orchestrate; components present.
- Navigation configuration is central.
- Future modules receive structure without simulated functionality.
- Humour must remain optional, respectful and non-blocking.

## Current priority

1. Run the full local check.
2. Test navigation and the Log & Journal workflow.
3. Verify mobile layouts.
4. Commit and tag v0.7.0.
5. Plan secure administration and persisted announcements before building leagues.
