# Champions Legacy Challenge — Service Architecture

Last updated: 1 August 2026

## Layers

```text
Configuration
    ↓
Pure domain models and validators
    ↓
Firestore repositories and audited services
    ↓
Providers and hooks
    ↓
Route pages and reusable components
```

## Team services

- `teamModel.js` — code normalization, validation and weekly snapshots.
- `teamService.js` — subscriptions, create/join/edit/leave and atomic captain transfer.
- `TeamProvider.jsx` — current membership, team, roster and bounded weekly synchronization.

## League services

- `leagueModel.js` — input validation, lifecycle, date checks and consistency standings.
- `leagueService.js` — visible/managed subscriptions, audited creation/transitions and registration.
- `LeagueProvider.jsx` — league library, player memberships and manager capability.
- `entryRepository.js` — creates contribution snapshots with source entries and deletes only the authenticated player’s active-league snapshots when a recent entry is removed.

## Coach services

- `coachModel.js` — pure period comparison, recommendation selection and evidence.
- `coachService.js` — private preference subscription and persistence.
- `CoachProvider.jsx` — combines preferences with shared player entries.

## Existing services

Points, statistics, progression, announcements, shared libraries, administration and monitoring remain separate domain boundaries.

## Guardrails

- Pure models do not import Firebase.
- Firestore services do not render UI.
- Components do not contain scoring or authorization formulas.
- Team summaries reuse central point calculation.
- League rules are frozen and standings use snapshots.
- Privileged writes and audit events commit atomically.
- Coach recommendations remain explainable and optional.

## v0.13.1 Reference System

- `rulebookModel.js` performs status/search filtering and summary calculations.
- `pointsGuideModel.js` transforms live scoring constants into complete player-facing ranges.
- `categoryPoints.js` exports the Fruit per-serving value used by both calculation and guide generation.
- No Firestore service is required because both references are bundled, read-only and release-versioned.

