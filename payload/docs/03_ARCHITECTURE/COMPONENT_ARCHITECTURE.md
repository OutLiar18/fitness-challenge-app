# Champions Legacy Challenge — Component Architecture

Last updated: 1 August 2026
Current release: v0.7.0

## Layout components

- `AppShell` — responsive protected application frame.
- `PageHeader` — consistent route heading and actions.
- `PageLoader` — route and authentication loading state.

The desktop shell uses a collapsible sidebar. Mobile uses a drawer and bottom navigation. Both consume central navigation configuration.

## Route pages

- `Dashboard` — overview only.
- `ActivityLog` — category selection, entry form and journal orchestration.
- `Progress` — progression presentation and timeline.
- `Announcements` — announcement presentation.
- `Profile` — player/account overview.
- `Admin` — non-operational security-aware scaffold.
- `FutureFeature` — reusable preview page for planned modules.

Route pages may compose services and hooks. They must not contain scoring formulas.

## Dashboard components

- `WelcomeCard`
- `QuickActions`
- `StatsCard`
- `ProgressionCard`
- `MotivationCard`
- `DailyProgress`
- `DailyGoals`
- `TopCategories`

## Logging components

- `CategoryGrid`
- `EntryForm`
- category-specific form components
- `Journal`
- `EntryCard`

Logging and Journal remain on the same route because date selection affects both entry permissions and history review.

## Progression components

- `ProgressionCard` — compact Dashboard summary.
- `ProgressTimeline` — chronological derived events.
- Progress route sections for XP, streak, goals, records, achievements and titles.

## Rules

- Similar UI problems should reuse existing patterns.
- Components receive calculated data through props or route context.
- No component may query Firestore directly.
- Navigation items are configured centrally.
- Unfinished future pages must identify themselves as previews and expose no fake actions.
