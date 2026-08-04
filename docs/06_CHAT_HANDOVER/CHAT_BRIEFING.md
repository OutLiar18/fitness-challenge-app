# Champions Legacy Challenge — Chat Briefing

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 4 August 2026

## Release state

- Current source and production: v0.19.0 — Season Command Centre.
- Windows verification passed 85 domain tests, 39 Rules tests, clean lint/build and release-readiness.
- Branded Firebase Hosting deployed successfully.
- Release commit remains pending.
- Never call or tag v1.0 without explicit approval.

## v0.19.0 scope

- Role-aware command centre inside configured v2 seasons.
- Derived next actions for Houses, C.H.A.O.S., leadership, evidence and publication.
- Evidence workload by category and reviewer coverage.
- Immutable evidence decision history and leaderboard snapshot history.
- Downloadable role-scoped JSON operations report.
- No media, scoring, collection or Firestore Rules change.

## Required next commands

```powershell
cd C:\Users\Kylep\fitness-tracker
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

Expected: 85 domain and 39 Rules tests. Do not run `npm audit fix --force`. After approval, deploy Hosting only, run the included finaliser and commit.

## Packaging preference

All documentation is included in the main updater. Never issue a separate post-deployment documentation archive.
