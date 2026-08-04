# Recent Session Summary

Date: 4 August 2026

v0.16.0 was verified, deployed, documented and committed. v0.17.0 Player Readiness and Account Control has now passed automated verification and been deployed to production.

## Implemented

- Added versioned onboarding fields to new profile creation.
- Added an accessible four-step onboarding overlay after sign-in.
- Preserved compatibility for existing profiles without onboarding fields.
- Added Help & Privacy with getting-started, data, privacy and account workspaces.
- Added personal JSON export of account-owned readable records.
- Added deletion request submission, cancellation and reopen.
- Added an administrator request queue with audited acknowledgement.
- Extended Rules so players can export their own private votes and sanitised error reports.
- Added ADR-024 and `ACCOUNT_AND_PRIVACY.md`.

## Verification completed in packaging environment

- 71 domain tests passed.
- JS/JSX syntax parsing passed.
- Relative import-resolution audit passed.
- Authoritative Windows ESLint, Vite build, 30 Rules tests, release-readiness and audit review remain required.

## Next action

Apply the v0.17.0 deployment documentation sync, then commit with a clean working tree. Production and Firestore Rules are already aligned at v0.17.0.

## Boundaries

The client records and acknowledges deletion requests but does not perform final Firebase Authentication/data deletion. Full manual product review remains deferred until the final pre-v1.0 stage.
