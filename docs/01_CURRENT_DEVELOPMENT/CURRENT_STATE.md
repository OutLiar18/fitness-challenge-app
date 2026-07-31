# Champions Legacy — Current State

Version: 0.5.0
Last updated: 30 July 2026
Status: Active development; core platform stabilised

## Product state

Champions Legacy has a functional, responsive core loop:

```text
Choose category → record factual activity → validate → save once →
derive points/statistics/goals → review in journal
```

The current release is suitable for controlled manual testing. Advanced progression and social systems remain future work.

## Implemented systems

### Authentication and profiles — Complete

- Email/password registration and sign-in.
- Protected dashboard route.
- Firestore profile creation.
- Account cleanup when profile creation fails.
- Friendly authentication errors and loading states.

### Challenge entries — Complete for v0.5

- Real-time owner-scoped Firestore entries.
- Create and delete workflows.
- Today/yesterday editing rule.
- Local-date-safe challenge dates.
- Normalisation and category-aware validation.
- One entry can contribute to multiple derived systems without duplicate documents.

### Categories and forms — Complete for v0.5

- Water
- Fruit
- Reading
- Running
- Upper Body
- Lower Body
- Core
- Cardio
- Skill Development
- Steps

Forms support global libraries, a personal reading library, custom suggestions, dynamic workout exercises and per-set details.

### Points Engine v2 — Complete

- Configuration-driven category scoring.
- Structured point breakdowns.
- Difficulty multipliers.
- Effective Repetitions.
- Static hold conversion.
- Custom exercise scoring.
- Running awards Running points and an intentional Cardio bonus.
- Point calculations remain derived from factual entry data.

### Statistics and goals — Complete for v0.5

- Total and daily points.
- Total and daily entry counts.
- Daily goal progress.
- Mission progress.
- Top categories.
- Cross-category contributions: Running duration contributes to Cardio statistics and Cardio’s daily goal.

### Journal — Complete for v0.5

- Previous/next date navigation.
- Native date picker.
- Today shortcut.
- Loading and empty states.
- Read-only historical days.
- Rich category-specific entry summaries.
- Explainable point breakdowns.

### Libraries and suggestions — Functional

- Global Fruit, Exercise, Cardio and Skill libraries.
- User-owned Reading library with usage ranking.
- Custom Exercise suggestions.
- Custom Cardio and Skill suggestions.
- Moderation interface is not yet implemented.

### UI and accessibility — Stabilised

- Responsive light/dark design system.
- Consistent cards, forms, buttons, alerts and empty states.
- Accessible searchable selectors.
- Keyboard navigation and visible focus states.
- Live-region notifications.
- Reduced-motion support.
- Application error boundary.

### Security — Implemented locally

- Owner-based Firestore rules are included in `firestore.rules`.
- Rules must be deployed to the Firebase project before production use.
- Real credentials remain in `.env`, which is ignored and excluded from handovers.

## Architecture snapshot

```text
Configuration and libraries
          ↓
Pure domain services
(points, statistics, validation, dates)
          ↓
Firestore repositories and orchestration
          ↓
Hooks and reusable components
          ↓
Route-level pages
```

Firestore stores facts. Derived values are recalculated by services.

## Intentionally out of scope

- Image uploads and proof submissions.
- Firebase Storage usage.
- Entry editing after save.
- Admin/moderation dashboard.
- XP, levels, streaks, achievements and leagues.
- Social/team systems.
- Advanced analytics and charts.

## Verification status

- ESLint: passing.
- Production build: requires a fresh platform-correct `npm install` before verification.
- Automated domain smoke tests: passing (six tests).
- Manual Firebase workflow testing: still required before release.

## Immediate next step

Complete the v0.5 manual QA checklist, deploy Firestore rules to the development project and expand the automated domain suite as defects are found.
