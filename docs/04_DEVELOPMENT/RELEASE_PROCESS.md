# Champions Legacy Challenge — Release Process

## Standard sequence

1. Apply one main update package containing source, tests and documentation.
2. Run Windows release gates.
3. Resolve failures before deployment.
4. Deploy the required Hosting/Rules scope.
5. Run the included release finaliser.
6. Review `git status`, commit and confirm a clean working tree.

## Commands

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
npm run deploy:production
```

After successful deployment, from the extracted updater:

```powershell
.\FINALISE_RELEASE.ps1
```

## Documentation rule

Documentation is part of the software release. All planned documentation changes must ship inside the main updater. Candidate/deployed status differences are handled by the included finaliser, not by a later separate archive.

## v0.18.0 boundary

Deploy Firestore Rules and Hosting together because evidence, contribution, snapshot and permission shapes changed. Do not deploy or finalise when any release gate fails.

## Pre-v1.0 boundary

v0.18.0 remains pre-v1.0. Do not create a v1.0 tag until explicit approval follows the final functional, visual, responsive, accessibility and operational review.

## Audit safety

Do not run `npm audit fix --force`. Record known non-applicable or breaking advisories and upgrade deliberately in a tested release.

## v0.20.0 finalisation

The authoritative gates are 96 domain tests, 44 Firestore Rules tests, clean ESLint/build, v0.20.0 release-readiness and npm audit review. Deploy with `npm run deploy:production`, run the updater's `FINALISE_RELEASE.ps1`, then commit. Do not generate a separate documentation archive.
