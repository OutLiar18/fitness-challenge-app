# Champions Legacy

Champions Legacy is a configuration-driven personal-development platform built with React, Vite, Firebase Authentication and Cloud Firestore.

Current version: **0.6.0**

## Current capabilities

- Email/password authentication and protected routes.
- Ten factual activity categories.
- Real-time Firestore journal entries.
- Local-calendar-safe date navigation.
- Points Engine v2 with Effective Repetitions and moderate difficulty multipliers.
- Running/Cardio cross-category scoring and statistics.
- Daily and weekly goal dashboards.
- Moderate goal-completion and mission bonus points.
- Forgiving consistency streaks with an earned streak shield.
- Personal XP, levels, titles, streak milestones and achievements.
- Responsive light/dark interface and keyboard-accessible selectors.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run dev
```

Restore the real Firebase values inside `.env`. Never commit `.env`.

## Quality commands

```powershell
npm run lint
npm test
npm run build
npm run check
npm audit
```

Do not run `npm audit fix --force` without reviewing dependency consequences.

## Firebase rules

```powershell
npx firebase-tools deploy --only firestore:rules --project fitnesschallengeapp-9e87f
```

Rules must be deployed deliberately because CLI deployment replaces the active rules for the selected project.

## Architecture

```text
Configuration
    ↓
Pure domain services
(points, goals, progression, statistics, validation, dates)
    ↓
Repositories and orchestration
    ↓
Hooks and components
    ↓
Pages
```

Firestore stores factual user activity. Points, goal progress, streaks, XP, levels and achievements are derived centrally from those facts.

Read `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`, `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`, and `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md` before continuing development.
