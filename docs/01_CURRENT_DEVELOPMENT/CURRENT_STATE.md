# Champions Legacy — Current State

Version: 0.6.0
Last updated: 31 July 2026
Status: Personal progression foundation implemented; local verification required

## Product state

Champions Legacy now supports the complete personal core loop:

```text
Record factual activity
        ↓
Validate and save once
        ↓
Derive activity points and cross-category contributions
        ↓
Calculate daily/weekly goals and moderate bonuses
        ↓
Update streaks, XP, levels and achievements
        ↓
Review progress in the dashboard and journal
```

## Complete systems

### Authentication and profiles

- Email/password registration and sign-in.
- Protected dashboard route.
- Firestore profile creation.
- Account cleanup when profile creation fails.
- Friendly authentication feedback.

### Entries and journal

- Ten categories.
- Owner-scoped real-time Firestore entries.
- Create and delete workflows.
- Today/yesterday editing rule.
- Older dates read-only.
- Local-calendar-safe challenge dates.
- Rich journal summaries and explainable entry point breakdowns.

### Points Engine v2

- Central category scoring.
- Effective Repetitions.
- Static-hold conversion.
- Five moderate difficulty tiers.
- Custom workout scoring.
- One Running entry awards Running and Cardio contributions.
- Running points require at least 3 km at 11:00/km or faster.
- Ineligible runs remain recorded and retain Cardio points/statistics.

### Daily and weekly goals

Daily goals:

- Water: 2,000 ml.
- Fruit: 3 servings.
- Reading: 60 minutes.
- Upper Body: 50 Effective Repetitions.
- Lower Body: 50 Effective Repetitions.
- Core: 50 Effective Repetitions.
- Cardio: 15 minutes.
- Skill Development: 15 minutes.
- Steps: 10,000.

Weekly goals run Monday through Sunday:

- Water: 15,000 ml.
- Fruit: 21 servings.
- Reading: 450 minutes.
- Running: 5 km and at least one run.
- Upper Body: 400 Effective Repetitions.
- Lower Body: 400 Effective Repetitions.
- Core: 400 Effective Repetitions.
- Cardio: 150 minutes.
- Skill Development: 150 minutes.
- Steps: 90,000.

Running has no daily goal. Running duration contributes to Cardio goals.

### Bonus points

- Each daily goal: +1 point.
- Complete every daily goal: +3 additional points.
- Each weekly goal: +2 points.
- Complete every weekly goal: +8 additional points.
- Streak milestone bonuses are small, one-time lifetime rewards.

Goal and streak bonuses are included in total points but are not assigned to Top Categories.

### Personal progression

- A successful streak day requires at least one completed daily goal.
- One streak shield is earned after seven successful days.
- A shield protects one missed day without increasing the streak.
- Maximum one shield may be banked.
- Current and longest streaks are calculated.
- Streak milestones award moderate points and XP once per lifetime threshold.
- XP remains separate from competitive points.
- Personal levels, titles and next-level progress are derived.
- Ten starter achievements are implemented.
- Personal records include streaks, completed goals and perfect days/weeks.

### Architecture and security

- Goals have one source of truth in `src/constants/goals.js`.
- Progression values live in `src/constants/progression.js`.
- Components do not own scoring or progression calculations.
- Firestore continues to store facts rather than calculated progression.
- Saved challenge entries are immutable.
- Firestore rules prevent profile role escalation and entry updates.

## Verification

- Automated tests: 18 passing in the handover environment.
- Local ESLint and production build: must be rerun after a fresh `npm install` on the developer computer.
- Firestore rules: previously deployed for v0.5.1; redeploy only if the local file differs from the deployed project.

## Known limitations

- Progression currently derives from the complete subscribed entry history.
- Goal and progression events carry ruleset identifiers; immutable persisted snapshots are still required before competitive seasons can freeze results.
- Full achievement browsing and a dedicated profile route are not yet implemented.
- React Router's RSC-only audit advisory remains pending upstream resolution; the application does not use RSC mode.
- The production bundle still warrants later route-level code splitting.

## Immediate next step

Run `npm install` and `npm run check` on Windows, inspect the dashboard manually, then commit v0.6.0. Fix only verified defects before beginning the dedicated profile and achievement-library screens.
