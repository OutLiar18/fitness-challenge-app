# Champions Legacy Challenge

<!-- RELEASE_STATUS: VERIFIED_PRODUCTION -->
Source version: **0.27.0 release finalised**
Production version: **0.27.0**
Status: **v0.27.0 verified production release; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central explainable Points Engine.
- Goals, streaks, shields, Experience Points, achievements, records, timeline and Personal Analytics.
- Trusted administration, immutable audit history, moderation, shared libraries and first-party error reporting.
- Season-scoped Houses with C.H.A.O.S., leadership, Pocket Week, historical House attribution, themed no-repeat Power Plays and one-week post-move roster stability.
- External WhatsApp proof, immutable published standings, audited factual corrections, trusted season reconciliation and trusted account deletion.
- MBTI-based Legacy Profiles with a user-confirmed 12-question quick estimate.
- League Season bonus points with Platform Administrator authority and immutable historical House attribution.
- URL-backed workspaces, accessible application dialogs, responsive desktop/tablet/mobile layouts, light/dark themes and the crimson/black Champions Legacy visual system.

## v0.27.0 - UX, accessibility and performance

v0.27.0 completes the full-application UX/accessibility/performance pass.

Highlights:

- approved crimson + near-black Champions Legacy design system across light and dark modes;
- redesigned application shell across desktop, tablet and mobile;
- improved Dashboard -> Log Activity -> Journal journey;
- URL-backed state for major personal, competition, administration and reference workspaces;
- accessible in-app confirmation flows replacing browser-native confirm/prompt usage;
- improved loading, empty, error, keyboard, focus, touch-target and long-form readability treatment;
- focused Houses and Seasons competition workspaces without changing league/gameplay contracts;
- responsive/authenticated manual acceptance completed;
- Firebase vendor chunk splitting and persistent production-build acceptance checks;
- Firestore Rules unchanged from the verified v0.26.0 production baseline.

## Production verification

Production URL:

`https://champions-legacy-challenge.web.app`

Release evidence:

- exact deployed/tagged source: `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`;
- release tag: `v0.27.0`;
- final application gate: 188/188 tests;
- 27G automated acceptance: PASS;
- 27G authenticated manual acceptance: PASS;
- 27R release-readiness: PASS;
- Firebase Hosting preview verification: 10/10 SPA routes, 25/25 referenced assets and 4/4 configured security headers;
- Firebase Hosting live verification: 10/10 SPA routes, 25/25 referenced assets and 4/4 configured security headers;
- live/local `index.html` SHA-256: `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`;
- Firestore Rules were not redeployed;
- unchanged Firestore Rules SHA-256: `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`;
- authenticated production smoke: accepted on 12 August 2026.

Detailed release evidence is recorded in `docs/07_HISTORY/V0270_PRODUCTION_RELEASE.md`.

## Local setup and verification

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
```

Development-repository production deployment scripts remain intentionally blocked. Production activation is performed only through reviewed, scope-specific release runners.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`
- `docs/07_HISTORY/V0270_PRODUCTION_RELEASE.md`

## Release boundary

v0.27.0 is **not** v1.0. The next planned pre-v1.0 phase is v0.28.0 complete league-season rehearsal. Do not create or tag v1.0 without explicit approval.
