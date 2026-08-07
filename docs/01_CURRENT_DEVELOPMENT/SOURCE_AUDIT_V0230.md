# Source Audit — v0.23.0

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 5 August 2026

## Scope audited

- Power Play constants, pure model, Firestore service and season workspace.
- Season v3 creation, registration freeze, standings, honours and Command Centre integration.
- Evidence publication and trusted reconciliation use of activity-date assignments.
- Firestore Rules for pool changes, weekly assignment reads/writes and client immutability.
- Trusted account-deletion coverage for Power Play records.
- Rulebook, Points Guide, announcements, documentation and release tooling.

## Findings

- Ten base category definitions are generated for every new v3 draft season.
- Enabled names are normalised and required to be unique and theme-confirmed.
- The frozen `powerPlayDefinitions` map prevents assignment facts from drifting after registration.
- Used IDs are append-only and selections are random without replacement.
- Redrawn and corrected-away plays remain used and cannot return later in the season.
- Activity points are multiplied before ordinary league caps; evidence bonuses and progression rewards remain excluded.
- Running/Cardio dual contributions resolve their own score category correctly.
- Existing v1/v2 seasons remain compatible and disabled.
- Trusted season fingerprints include weekly assignments and reject duplicates, broken definitions and state mismatch.
- Player listeners expose only started official weeks.

## Verified release evidence

- 120 domain tests passed.
- 51 Firestore Rules tests passed on the authoritative Windows emulator run using Java 21.
- All JavaScript/JSX/MJS files pass static syntax parsing.
- Local relative imports resolve.
- No Firebase Admin credential or trusted report is included in the release archives.

## Pre-deployment verification corrections

- Removed effect-driven local state resets from the Power Play workspace and season detail tabs so React 19 lint rules are satisfied without cascading renders.
- Stabilised the empty Power Play collection used by memo dependencies.
- Kept draft-season creation below Firestore's 1,000-expression evaluation limit by using compact draft guards, while preserving complete Power Play policy and initial-state validation before registration and on every pool update.

- Replaced the Power Play final-day assertion's fixed UTC timestamps with dates derived from the official local week boundary. This keeps the test valid in Johannesburg and other runtime time zones without changing production week logic.

## Release closure

Windows dependency installation, ESLint, Vite build, Firestore Rules emulator tests, release-readiness and npm audit passed. Firestore Rules and Hosting were deployed, both hotfixes were included, the release was finalised and committed without a v1.0 tag.
