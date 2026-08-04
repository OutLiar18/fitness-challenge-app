# Champions Legacy Challenge — Chat Briefing

Last updated: 4 August 2026

## Release state

- Current source and production: v0.17.0 — Player Readiness and Account Control.
- Status: automated verification and production deployment complete; documentation sync and release commit pending; pre-v1.0.
- Never declare or tag v1.0 without explicit product-owner approval.

## v0.17.0 scope

- Versioned four-step onboarding for new profiles.
- Legacy profiles remain uninterrupted; guide can be replayed.
- Help & Privacy route under More.
- On-demand account-readable JSON export.
- Player deletion request/cancel/reopen lifecycle.
- Platform Administrator request queue and audited acknowledgement.
- Own private votes and sanitised own error reports readable for export.
- No scoring, Experience Points, Pocket, roster or historical House changes.

## Required next commands

Apply the v0.17.0 deployment documentation sync, then commit:

```powershell
cd C:\Users\Kylep\fitness-tracker
git status
git add -A
git commit -m "release: deploy v0.17.0 player readiness and account control"
git status
```

Release evidence: 71 domain tests, 30 Rules tests, clean lint/build, v0.17.0 release-readiness, successful Firestore Rules deployment and 62 Hosting files released.

Do not run `npm audit fix --force`.

## Core product rules

- Store factual activity and derive scoring.
- Points and Experience Points remain separate.
- Running earns Running points only at 3 km or more and 11:00 minutes per kilometre or faster; its duration still contributes to Cardio.
- Houses are season-scoped and contributions preserve earning-time House identity.
- Pocket Week is one seven-day pre-season window.
- Do not invent inactive mechanics.
- Account-request acknowledgement is not deletion.

## Working style

The user is learning React/Firebase. Keep instructions practical and limited to two or three actions. For substantial changes, provide a complete updater and recovery source package. Documentation changes are part of the release.
