# Champions Legacy Challenge — v0.28.0 Analytics Polish

Checkpoint: 28D6

## Review outcome

Analytics already has strong functional foundations from v0.27: URL-backed range and
workspace state, a real loading state, semantic list/listitem chart data, a fixed
28-day consistency view, category balance and explainable insight generation.

The v0.28 pass therefore focuses on hierarchy, icon consistency and one misleading
empty-state presentation issue rather than changing any analytics calculation.

## Changes

- Inbox is recorded as owner-accepted and the inspection advances to Analytics;
- the page title is shortened from `Personal analytics` to `Analytics`;
- the redundant `Back to progress` header action is removed because Analytics is a
  first-class navigation destination;
- the page header, workspace tabs, summary metrics, no-data state, insight cards and
  integrity note now use the shared Phosphor-backed `ThemeIcon` language;
- category identity remains data-driven from the existing category metadata rather than
  inventing a second category-icon registry in Analytics;
- the tab label `Category balance` becomes the shorter `Categories`;
- the Trends workspace now renders either its recovery state or its weekly chart, not
  both at the same time when the selected window contains no activity;
- the integrity card uses player-facing wording while keeping its explainability
  promise;
- existing URL range/tab state, 28-day consistency logic, chart accessibility and all
  analytics calculations remain unchanged.

## Safety boundary

28D6 does not change:

- analytics model calculations;
- point calculation or Running/Cardio breakdowns;
- activity data;
- goals, Experience Points or competition scoring;
- routes;
- Firestore reads/writes or Rules;
- Firebase deployment state.

Broad historical Analytics CSS consolidation remains deferred to v0.31.
