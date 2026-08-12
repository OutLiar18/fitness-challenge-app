# Champions Legacy Challenge - v0.27.0 Production Release

Date: 12 August 2026
Release stage: VERIFIED PRODUCTION
Production version: v0.27.0

## Exact deployed source

`701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`

Release tag `v0.27.0` is pinned to that exact deployed commit. The later documentation-only finalisation commit is intentionally not the tag target.

Accepted 27G runtime baseline:

`ad92777cfa86481002639297ce8c7dce69b0e269`

## Release gate

- Full application regression: **188/188 application tests**.
- Production build: PASS.
- 27G automated acceptance: PASS.
- 27G manual authenticated visual acceptance: PASS.
- 27R release-readiness: PASS.
- Authenticated production smoke: PASS / accepted 12 August 2026.

## Hosting activation

Firebase project: `fitnesschallengeapp-9e87f`

Hosting target/site: `app` -> `champions-legacy-challenge`

Live URL:

`https://champions-legacy-challenge.web.app`

The frozen build was verified on a short-lived preview channel before live activation.

Preview and live verification each passed:

- 10/10 SPA routes;
- 25/25 assets referenced by `index.html`;
- 4/4 configured Hosting security headers;
- exact `index.html` SHA-256 `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`.

## Firestore Rules

Firestore Rules were not changed or redeployed by v0.27.0.

Canonical unchanged SHA-256:

`35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`

## Release conclusion

v0.27.0 is verified in production. Development-repository deployment scripts remain blocked. Further application changes belong to a later development version, beginning with the planned v0.28.0 complete league-season rehearsal.

Detailed production evidence is archived in `docs/07_HISTORY/V0270_PRODUCTION_RELEASE.md`.
