# Champions Legacy Challenge — Chat Briefing

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 4 August 2026

## Release state

- Current source candidate: v0.18.0 — External Evidence and Published Standings.
- Current production: v0.17.0.
- Packaging lint, 80 domain tests and the Windows Vite build pass.
- The first Windows Rules run exposed Firestore's 1,000-expression evaluation limit in two valid atomic workflows.
- The candidate now includes a Rules evaluation-budget hotfix and corrected Running proof fixture; 39 Rules tests and release-readiness must be rerun before deployment.
- Never call or tag v1.0 without explicit approval.

## v0.18.0 scope

- No in-app media uploads; proof is sent through WhatsApp.
- Verification IDs link WhatsApp proof to entries/daily claims.
- Running points and Steps points are proof-gated; Running Cardio remains immediate.
- Water/Fruit may receive one configured three-point daily proof bonus.
- Fruit activity is capped at five servings/day in v2 seasons.
- Category reviewers are least-privilege; Platform Admin reviews all and handles late exceptions.
- Decisions use immutable audit/reversal contributions.
- Administrators see live standings; players see immutable published snapshots.
- The 10:00 Johannesburg fallback requires an authorised administrator session.
- Existing v1 seasons remain compatible; v2 blocks Running/Steps Pocket redemption.

## Required next commands

```powershell
cd C:\Users\Kylep\fitness-tracker
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

Expected after the included hotfix: 80 domain and 39 Rules tests. Do not run `npm audit fix --force`. Do not deploy until the rerun output is reviewed.

## Packaging preference

All documentation is included in the main updater. After later successful deployment, use the included `FINALISE_RELEASE.ps1`; never issue a separate documentation sync.
