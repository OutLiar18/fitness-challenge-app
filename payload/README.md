# Champions Legacy Challenge

Champions Legacy Challenge is a gamified personal-development platform built with React, Vite, Firebase Authentication and Cloud Firestore.

Current version: **0.7.1**

## Current experience

- Persistent labelled desktop navigation.
- Compact tablet icon rail.
- Mobile status header and bottom tab navigation.
- Dedicated Dashboard overview.
- Dedicated Log & Journal workspace.
- Progress page with goals, streaks, XP, levels, achievements, personal records and a chronological timeline.
- Announcements and Profile pages.
- Secure non-operational Admin foundation.
- Future previews for Teams, Leagues and Legacy Coach.
- Daily motivational content, side quests and optional harmless easter eggs.
- One shared owner-scoped Firestore subscription and progression summary across protected routes.
- Twenty-six automated domain and architecture tests.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run dev
```

Restore the real Firebase values inside `.env`. Never commit `.env`.

## Verification

Before committing or releasing:

```powershell
npm run check
npm audit
```

Do not run `npm audit fix --force` without reviewing the dependency consequences.

## Main routes

- `/dashboard` — overview, goals, score and momentum.
- `/log` — category logging and date-based journal.
- `/progress` — progression, records, achievements and timeline.
- `/announcements` — release and challenge notices.
- `/profile` — player identity and account overview.
- `/admin` — non-operational secure admin foundation.
- `/future/teams`, `/future/leagues`, `/future/coach` — future-module previews.

Project documentation lives in `docs/` and is part of the software.
