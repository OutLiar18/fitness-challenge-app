# Champions Legacy Challenge

Champions Legacy Challenge is a gamified personal-development platform built with React, Vite, Firebase Authentication and Cloud Firestore.

Current version: **0.9.0**

## Current experience

- Adaptive desktop, tablet and mobile navigation.
- Dedicated Dashboard, Log & Journal, Progress, Announcements and Profile workspaces.
- Ten factual activity categories with explainable scoring.
- Daily and weekly goals with moderate completion bonuses.
- Streaks, an earned streak shield, experience points, levels, achievements, personal records and a chronological timeline.
- Built-in Legacy Avatars without paid media storage.
- Firestore-backed announcements with cross-device read status.
- Secure Platform Administration for announcement publishing, suggestion review, trusted role management and immutable audit history.
- Central player-facing formatters that use complete measurement names rather than unexplained abbreviations.
- Professional body typography, distinctive display headings and restrained decorative emphasis for quotations and milestone content.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run dev
```

Restore the real Firebase values inside `.env`. Never commit `.env`.

## Required verification

Before committing or releasing:

```powershell
npm run check
npm audit
```

Do not run `npm audit fix --force` without reviewing the dependency consequences.

## Firebase deployment

Version 0.9.0 changes Firestore permissions and introduces live administration collections. Deploy the rules after local verification:

```powershell
npx firebase-tools deploy --only firestore:rules --project fitnesschallengeapp-9e87f
```

The first Platform Administrator must be assigned through a trusted Firebase Console or Firebase Admin SDK process. Ordinary players cannot promote themselves.

## Main routes

- `/dashboard` — overview, goals, score and momentum.
- `/log` — category logging and date-based journal.
- `/progress` — progression, records, achievements and timeline.
- `/announcements` — live platform announcements and read status.
- `/profile` — player identity and account overview.
- `/admin` — trusted announcement, moderation, role and audit tools.
- `/future/teams`, `/future/leagues`, `/future/coach` — future-module previews.

Project documentation lives in `docs/` and is part of the software.
