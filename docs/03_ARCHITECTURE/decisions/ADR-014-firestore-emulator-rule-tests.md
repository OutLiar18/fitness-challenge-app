# ADR-014 — Firestore Emulator Security Rules Tests

Status: Accepted  
Date: 1 August 2026

## Context

Champions Legacy Challenge uses client-side Firebase SDKs. Firestore Security Rules are therefore a primary authorization and data-validation boundary. Manual Rules Playground checks are not enough for repeatable releases.

## Decision

Use the Firebase Local Emulator Suite and `@firebase/rules-unit-testing` for automated Security Rules tests.

- `firebase.json` declares the local rules file and Firestore Emulator port.
- Tests use mock authenticated and administrator contexts.
- Administrative batch workflows are tested with their audit records.
- Release verification runs domain tests separately from emulator tests so ordinary development remains fast.
- Rule changes require `npm run test:rules` before deployment.

## Consequences

- Java and Firebase CLI dependencies are required for release verification.
- Security regressions become reproducible.
- Tests never need to touch production Firestore data.
