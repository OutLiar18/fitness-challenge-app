# Champions Legacy

Champions Legacy is a React and Firebase application that turns consistent daily actions into visible progress. It currently tracks water, fruit, reading, running, strength workouts, cardio, skill development and steps.

## Current release

**v0.5.0 — Platform Stabilisation**

This release consolidates the app around a configuration-driven category model, a single explainable points engine, accessible selectors, local-date-safe journal navigation and clear Firestore service boundaries.

## Core features

- Firebase Authentication with protected routes and user profiles.
- Real-time Firestore challenge entries.
- Ten configurable challenge categories.
- Searchable global libraries and a user-owned reading library.
- Dynamic workout sets with repetition and timed-hold exercises.
- Effective-repetition and difficulty-based workout scoring.
- Running points plus an intentional Cardio bonus from one stored entry.
- Daily goals, total statistics, top categories and date-based journal history.
- Responsive light/dark UI with keyboard and screen-reader support.
- Custom exercise, cardio and skill suggestions for later moderation.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add the Firebase web configuration values from your Firebase project.
5. Run `npm run dev`.

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows, copy the environment file manually instead of using `cp`.

## Firebase setup

Enable **Email/Password Authentication** and create a **Cloud Firestore** database. Deploy the included rules before using real accounts:

```bash
firebase deploy --only firestore:rules
```

The rules enforce owner-only access to profiles, personal libraries and challenge entries. Suggestions can be created and read by their submitter but cannot be self-approved.

## Quality checks

```bash
npm run lint
npm test
npm run build
```

`npm run check` runs linting, domain tests and the production build.

## Architecture

```text
src/
├── components/       Reusable interface components
├── constants/        Categories, libraries and balancing configuration
├── context/          Authentication context
├── hooks/            Reusable React state and subscriptions
├── pages/            Route-level screens
├── services/         Auth, entries, libraries, points, statistics and validation
└── utils/            Pure formatting and lookup helpers
```

Firestore stores user-entered facts. Points, goals and statistics are derived by services so future balancing changes do not require rewriting historical entries.

## Important project files

- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/01_CURRENT_DEVELOPMENT/ROADMAP.md`
- `docs/02_GAME_DESIGN/POINTS_SYSTEM.md`
- `docs/03_ARCHITECTURE/ARCHITECTURE_OVERVIEW.md`
- `docs/05_DESIGN/DESIGN_LANGUAGE.md`
- `OPTIMIZATION_SUMMARY.md`

## Deployment

The included `public/_redirects` file supports client-side routing on Netlify. Any static host must redirect unknown routes to `index.html`.
