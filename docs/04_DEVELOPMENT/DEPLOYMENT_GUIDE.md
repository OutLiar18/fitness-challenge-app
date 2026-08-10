# Champions Legacy Challenge — Deployment Guide

## Production identity

Firebase project: `fitnesschallengeapp-9e87f`
Hosting target: `app`
Hosting site: `champions-legacy-challenge`
Live URL: `https://champions-legacy-challenge.web.app`

## Prerequisites

- Node/npm installed.
- Java 21 available for Firestore Rules emulator tests.
- Correct Firebase project mapping in `.firebaserc`.
- Local production `.env` preserved outside updater packages.
- Firebase CLI authentication available only on the trusted deployment computer.

## Verification

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
```

Do not proceed when a release gate fails.

## Production safety model

The development repository intentionally blocks its generic production deployment scripts. Use only a reviewed release runner built for the exact scope required by the release.

Before any deployment, verify:

- exact source commit/version;
- clean or explicitly understood Git state;
- exact Rules/configuration hashes required by the release;
- Firebase project and Hosting target mapping;
- full release gate;
- production environment values when Hosting is being built.

Never combine an unrelated resource into a deployment for convenience.

## v0.24.0 reference deployment

v0.24.0 used:

- Checkpoint 9A: one `firestore:rules` production attempt only;
- remote read-only verification of the active Ruleset source;
- Checkpoint 9B: one `hosting:app` production attempt only;
- read-only live-site verification;
- Checkpoint 9C: minimal production smoke;
- Checkpoint 9D: documentation and Git finalisation with no Firebase command.

The v0.24.0 production evidence is recorded in `docs/07_HISTORY/V0240_PRODUCTION_RELEASE.md`.

## Failure handling

If a deployment command fails, do not automatically retry. Determine first whether Firebase created/released any new resource. If Hosting uploaded but live verification fails, inspect the live version before deciding on rollback or another deployment. If Rules deployment reports ambiguity, inspect the active Release/Ruleset before taking further action.

## Trusted operations

Trusted season reconciliation and account deletion require private Admin SDK credentials outside the repository. These are operational tools, not deployed backend services.

## Dependency safety

Do not run `npm audit fix --force` during deployment preparation. Dependency changes belong in a separately tested development release.
