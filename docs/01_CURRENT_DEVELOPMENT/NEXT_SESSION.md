# Champions Legacy Challenge — Next Session

Version target: 0.13.1  
Objective: Verify the official Rulebook and Points Guide before the full review

## Before deploying Rules

The v0.13 feature itself adds no Firestore collections or Rules. However, if the v0.12 Rules have not yet been deployed, inspect every existing `leagues` document and confirm:

- `participantLimit` is the number `200`.
- `participantCount` equals the matching `leagueMemberships` count.

No league documents means no migration action.

## Required sequence

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
npm run deploy:hosting
npm run dev
```

Run `npm run deploy:rules` first only when the v0.12 hardened Rules are not already live.

Expected results:

- 54 domain tests pass.
- 15 Firestore Security Rules tests pass.
- ESLint passes.
- Production build passes.
- Release readiness confirms v0.13.1 and Hosting target `app`.

Do not run `npm audit fix --force`.

## Focused checks

### Rulebook

- `/rules` opens from desktop and mobile More navigation.
- Current rules are the default view.
- Search finds rules by text and 2025 rule number.
- Current, season and inactive filters remain distinct.
- Expand all, collapse all, jump links and browser back/forward work.
- Current goal values match Dashboard and Progress.
- Inactive legacy mechanics cannot be mistaken for active features.

### Points Guide

- Every activity category is selectable.
- Zero-point ranges and earning ranges match the live scoring engine.
- Running eligibility and automatic Cardio contribution are clear.
- Difficulty multipliers, visible goal bonuses and league scoring display correctly.
- Streak milestone and achievement rewards are not disclosed.

### Regression

- Activity scoring, Teams, Leagues, Legacy Coach, Announcements and Administration still work.
- Direct refreshes on `/rules` and `/points-guide` work on Firebase Hosting.
- Mobile layouts have no horizontal overflow.

## Release boundary

After verification, commit and tag v0.13.1. The next phase is the user’s full review and targeted corrections, still before v1.0.
