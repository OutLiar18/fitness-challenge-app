# Champions Legacy Challenge — Current State

Version: 0.7.1
Last updated: 1 August 2026
Status: Responsive navigation polish implemented; local release verification required

## Product state

Champions Legacy Challenge supports a complete personal core loop across focused routes:

```text
Dashboard overview
      ↓
Log factual activity once
      ↓
Review the same day in the Journal
      ↓
Derive activity points, goal bonuses, streaks and XP
      ↓
Review records, achievements and timeline in Progress
```

## Implemented routes

- `/dashboard` — goals, score, progression summary, top categories, motivation and quick actions.
- `/log` — all category forms and the date-based journal.
- `/progress` — XP, levels, streaks, achievements, personal records and progress timeline.
- `/announcements` — structured release and challenge communications.
- `/profile` — player identity and progression snapshot.
- `/admin` — safe non-operational administration foundation.
- `/future/teams`, `/future/leagues`, `/future/coach` — product-direction previews.

## Adaptive application shell

- Persistent labelled left navigation on desktop.
- Compact icon rail on tablet widths.
- Mobile status header with streak, level and point summaries.
- Edge-to-edge mobile bottom navigation for Home, Log, Progress and News.
- Responsive More popover/bottom sheet for Profile, Admin and future modules.
- Route-aware active states and accessible labels.
- Full Champions Legacy Challenge branding.
- Small optional easter eggs that never block a task.

## Shared data and derived progression

`PlayerDataProvider` owns one profile load and one owner-scoped real-time entry subscription for the protected application. It also calculates one shared progression summary for the shell and route pages.

Firestore still stores facts. Points, goals, bonuses, streaks, XP, achievements, records and timeline events remain derived.

## Complete systems

- Firebase authentication and profiles.
- Ten activity categories.
- Create/delete entry workflow with today/yesterday access.
- Local-calendar-safe dates and read-only older history.
- Points Engine v2 and explainable breakdowns.
- Running/Cardio cross-contribution and Running eligibility rules.
- Daily and weekly goals with moderate bonuses.
- Forgiving streak, one shield, milestones, XP and levels.
- Starter achievements and factual personal records.
- Chronological progression timeline.
- Responsive light/dark design system.
- Static announcement source with a replaceable service boundary.

## Verification

- Automated tests: **26 passing** in the handover environment.
- JavaScript syntax validation: passing for non-JSX source and test files.
- Navigation and progression regression tests: passing.
- ESLint and production build: must be rerun on the developer computer because the sandbox package mirror could not provide one transitive ESLint package.

## Known limitations

- Progression still derives from the complete subscribed entry history.
- Announcement publishing is not connected to Firestore or admin actions.
- Admin actions require custom claims/server trust, Firestore enforcement and audit history.
- Future Teams, Leagues and Coach pages are previews only.
- Historical aggregation and pagination remain necessary before large-scale launch.
- React Router’s RSC-only advisory remains pending upstream; the application does not use RSC mode.

## Immediate next step

Apply the v0.7.1 responsive-navigation update, run `npm run check`, and test at 320 px, tablet and desktop widths before committing.
