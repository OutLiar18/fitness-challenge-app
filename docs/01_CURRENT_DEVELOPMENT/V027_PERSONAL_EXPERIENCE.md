# Champions Legacy Challenge — v0.27 Personal Experience

Date: 11 August 2026
Checkpoint: 27D

## Purpose

27D polishes Progress, Analytics, Profile, Inbox and Legacy Coach.

It changes presentation, navigation state and accessibility only. It does not change
statistics, progression formulas, MBTI profile definitions, announcements,
notifications, coaching recommendations, scoring, Firestore Rules or production
Firebase state.

## Consistent workspace navigation

Progress, Analytics, Profile and Legacy Coach now persist their active workspace in
the URL, matching the pattern already used by Log/Journal and Inbox.

This means:
- direct links can open a specific section;
- refresh preserves the section;
- browser navigation behaves predictably;
- invalid section values safely fall back to each page's normal default.

Analytics also stores non-default analysis windows through the `weeks` query
parameter.

## Progress

- keeps the existing loading state;
- raises small status/summary text for readability;
- gives Personal Records a useful empty state with a direct Log activity action;
- keeps all XP, streak, achievement, record and timeline calculations unchanged.

## Analytics

- adds a page-level loading state;
- preserves the selected analysis window in the URL;
- replaces the weekly chart's single `role="img"` wrapper with labelled list/listitem
  semantics so visible numeric/date data remains available to assistive technology;
- gives the 28-day consistency grid list/listitem semantics;
- marks the purely visual heatmap legend as decorative;
- provides a clear no-activity state and direct Log activity action;
- keeps the existing analytics model and all calculated values unchanged.

## Profile

- adds a page-level loading state;
- stores Overview / Personalise / Protections in the URL;
- makes the Choose Legacy Profile action navigate through the same workspace model;
- focuses validation/save errors so keyboard and screen-reader users encounter them
  immediately;
- exposes form busy state while saving;
- keeps profile persistence, MBTI selection and account/competition data unchanged.

## Inbox

The bespoke two-button tab implementation is replaced with the existing shared
WorkspaceTabs / WorkspacePanel component.

This adds:
- Arrow-key, Home and End navigation;
- correct roving tab focus;
- the existing mobile select fallback;
- shared visual behavior with the rest of v0.27.

Existing URL state, read/unread operations, announcements, private notifications and
Platform Administrator bonus-review attention remain unchanged.

## Legacy Coach

- stores Recommendations / Evidence / Preferences in the URL;
- disables preference controls while a save is in progress;
- exposes form busy state;
- provides a clear state when coaching is enabled but no recommendation currently
  needs attention;
- keeps recommendation generation, evidence and preference persistence unchanged.

## Verification

- persistent 27D regression coverage;
- complete `npm run check` application gate;
- canonical Firestore Rules SHA verification before and after;
- no Firebase deployment.
