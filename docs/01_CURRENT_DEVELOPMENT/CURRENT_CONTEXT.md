# Champions Legacy Challenge — Current Context

Last updated: 2 August 2026

## Current development phase

**v0.13.1 — Rulebook and Points Reference**, still before v1.0.

The original 2025 challenge rules and points chart were reviewed. Current player references now reflect the app’s actual behaviour rather than copying obsolete submission processes or scoring tables.

## Current priorities

1. Apply the v0.13.1 updater, which includes the v0.12 hardening baseline.
2. Complete the existing-league `participantCount` and `participantLimit` check when applicable.
3. Verify 54 domain tests, 15 Firestore Rules tests, ESLint, production build and release readiness.
4. Deploy the branded Hosting target; Firestore Rules require deployment only when the v0.12 baseline has not yet been deployed.
5. Review `/rules` and `/points-guide` on mobile and desktop, then begin the broader product review.

## Guardrail

Do not create a v1.0 tag or final production declaration. Inactive 2025 mechanics must not be presented as live until their data model, permissions, administration and tests exist.
