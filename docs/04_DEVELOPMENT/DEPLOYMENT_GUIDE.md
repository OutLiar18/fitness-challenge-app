# Champions Legacy Challenge — Deployment Guide

## Hosting

Production target: `app`  
Site: `champions-legacy-challenge`  
URL: `https://champions-legacy-challenge.web.app`

## Prerequisites

- Node/npm installed.
- Firebase CLI available through project scripts.
- Java 21 for Rules tests.
- Correct Firebase project mapping in `.firebaserc`.
- Local `.env` preserved outside update packages.

## Verification

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

## v0.18.0 deployment

Evidence document shapes and Rules change together. After all gates pass:

```powershell
npm run deploy:production
```

This reruns release-readiness and deploys `firestore:rules,hosting:app` together.

## Included documentation finalisation

After Firebase reports a successful Rules and Hosting deployment, run `FINALISE_RELEASE.ps1` from the extracted main updater. It calls the in-repository finalisation script, changes candidate release records to deployed records and is idempotent.

Do not create or download a separate documentation-sync package.

## Rollback

Firebase Hosting versions can be rolled back independently, but v0.18.0 frontend and Rules should remain aligned. Preserve the pre-update timestamped backup created by `APPLY_UPDATE.ps1` until the release is verified and committed.

## v0.20.0 deployment note

This release changes Firestore Security Rules. After `npm run check:release` passes, deploy Rules and Hosting together with `npm run deploy:production`. Do not use the Hosting-only command for this release.

## Trusted operations are not a deployed backend

<!-- RELEASE_STATUS: DEPLOYED -->

v0.21.0 deploys the browser UI and Firestore Rules only. `scripts/trusted-season-reconcile.mjs` stays in the source repository and runs manually from the trusted administrator computer. No function, scheduler or credential is uploaded by `npm run deploy:production`.

## v0.22.0 release note

Deploy Firestore Rules and Hosting together. Do not run a real account deletion as part of release verification. Configure trusted credentials only from the private operations runbook after deployment/finalisation when an actual eligible request exists.

## v0.23.0 release note

The release changes Firestore Rules and Hosting, so use `npm run deploy:production` only after 120 domain tests, 51 Rules tests, lint, build and release-readiness pass. No Power Play data migration is required. Do not use a production season to test locked correction behaviour.
