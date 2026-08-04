# Champions Legacy Challenge — Testing Guide

Current release target: v0.18.0

## Standard release commands

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

The Firestore Emulator requires Java 21.

## v0.18.0 expected baseline

- 80 domain tests.
- 39 Firestore Security Rules tests.
- Clean ESLint.
- Successful Vite production build.
- Release-readiness confirmed for 0.18.0 and Hosting target `app`.

## Evidence domain coverage

- frozen policy normalization and explicit confirmation;
- stable verification IDs;
- Running immediate/pending allocation;
- nonqualifying Running behaviour;
- Steps proof gate;
- daily Water/Fruit claims and bonus thresholds;
- deadline/late-exception logic;
- reviewer category scope;
- Johannesburg publication due time;
- Fruit cap and evidence-bonus cap separation.

## Rules coverage

The Rules suite includes existing account/season/Pocket protections plus evidence claim creation, assigned review, rejection, late proof, atomic contribution release, reviewer query scope and player snapshot privacy/immutability.

`PERMISSION_DENIED` output is expected for negative assertions. Judge success by the final test counts and process exit code.

## v0.18.0 Rules evaluation-budget regression

The first Windows run exposed Firestore's 1,000-expression ceiling in valid multi-write operations. The candidate hotfix must preserve these two regressions:

- an authorised Platform Administrator can atomically create a draft season, its closed invite and matching audit event;
- a qualifying v2 Running entry can atomically create the factual entry, immediate Cardio contribution and pending proof claim.

Rules should dispatch only the relevant validation branch. A passing negative assertion may still print `PERMISSION_DENIED`, but `maximum of 1000 expressions` must not appear for a valid positive workflow.

## Release rules

- Do not deploy when lint, domain, build, Rules or readiness fails.
- Do not use `npm audit fix --force`.
- Deploy Rules and Hosting together for v0.18.0.
- Run the included finaliser only after successful production deployment.
