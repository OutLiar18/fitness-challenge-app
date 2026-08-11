# Champions Legacy Challenge — v0.26.0 Release Candidate

Date: 11 August 2026
Release stage: 26R
Production baseline: v0.25.0

## Frozen source

The v0.26.0 release candidate is frozen from completed Checkpoint 26I:

`909fe8938237c70b69aab1d72a2fef9ee2780e37`

Only release documentation and `scripts/release-readiness.mjs` may differ from
that source before production activation.

## Firestore Rules

Canonical candidate SHA-256:

`35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`

Static line metric at 26I: 3,875.

The complete Rules emulator suite contains 98 tests.

## Practical v0.26 release scope

v0.26 keeps the controls that matter at the application's current scale:

- canonical Firestore-profile Platform Administrator authority;
- league-scoped League Administrator operations after league bootstrap;
- Platform Administrator-only evidence decisions;
- recursive deny-all Firestore fallback;
- House movement/rest and immutable historical attribution;
- Power Play protection;
- League Season bonus audit/ledger protection;
- trusted account-deletion recovery hardened for interruption;
- zero known production npm dependency advisories at the measured 26D checkpoint;
- existing Firebase Hosting security headers.

Advanced App Check/CSP enforcement and project-level Google Cloud disaster
recovery remain deferred until scale/risk justifies them.

## Release gate

The release gate runs:

1. lint;
2. complete application tests;
3. production build;
4. all 98 Firestore Rules emulator tests;
5. v0.26 frozen-source/release-structure verification.

The existing large Firebase vendor chunk warning remains non-blocking and is
scheduled for v0.27 performance work.

## Production boundary

Development deployment scripts remain blocked.

26R performs **NO FIREBASE DEPLOYMENT**.

After 26R passes and is pushed, production activation must use a separate reviewed
runner pinned to the exact 26R commit and candidate Rules SHA.
