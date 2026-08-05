# Champions Legacy Challenge — Testing Guide

Current release target: v0.21.0  
Current production: v0.21.0

## Standard release commands

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

The Firestore Emulator requires Java 21.

## v0.21.0 expected baseline

- 104 domain tests.
- 46 Firestore Security Rules tests.
- Clean ESLint.
- Successful Vite production build.
- Release-readiness confirmed for v0.21.0 and Hosting target `app`.

## Correction domain coverage

`tests/entry-corrections.test.mjs` covers:

- active-version resolution through a correction head;
- safe fallback when a head target is delayed or missing;
- seven-recorded-day Journal pagination;
- net contribution grouping and replacement allocation;
- qualifying and nonqualifying Running correction outcomes;
- immutable category/date/identity invariants;
- mandatory correction reasons;
- Pocket redemption exclusion;
- healthy and broken-chain diagnostics.

## Correction Rules coverage

The Rules suite adds positive and negative assertions for:

- Platform Administrator correction creation;
- ordinary-player correction denial;
- owner read-only correction history;
- corrected-source deletion denial;
- one full qualifying Running correction batch with signed point reversal, replacement contribution and proof-claim supersession.

`PERMISSION_DENIED` output is expected for negative assertions. Judge success by the final test counts and process exit code.

## Preserved evidence and season coverage

The suite continues to cover account boundaries, season creation, Houses, C.H.A.O.S., leadership, roster swaps, Pocket Week, evidence claim creation, assigned review, late proof, atomic contribution release, reviewer query scope and published-snapshot privacy.

## Firestore evaluation-budget regression

The v0.18.0 Windows run exposed Firestore's 1,000-expression ceiling in valid multi-write operations. Keep these positive regressions passing:

- an authorised Platform Administrator can atomically create a draft season, its closed invite and matching audit event;
- a qualifying v2 Running entry can atomically create the factual entry, immediate Cardio contribution and pending proof claim;
- a qualifying Running correction can atomically create its replacement, correction records, contribution reconciliation and proof transition.

Rules should dispatch only the relevant validation branch. `maximum of 1000 expressions` must not appear for a valid positive workflow.

## Release rules

- Do not deploy when lint, domain, build, Rules or readiness fails.
- Do not use `npm audit fix --force`.
- Because v0.20.0 changes Firestore Rules, deploy Rules and Hosting together with `npm run deploy:production`.
- Run the included finaliser only after successful production deployment.
- Do not create a v1.0 tag without explicit approval.

## v0.21.0 trusted season coverage

<!-- RELEASE_STATUS: DEPLOYED -->

Domain tests cover deterministic fingerprints, publishable audits, snapshot comparison, broken evidence links, missing released contributions, incomplete corrections, stale run summaries and Command Centre actions. Firestore Rules tests confirm authorised trusted-run reads and deny every client write. The production Admin SDK command is not executed by release tests.
