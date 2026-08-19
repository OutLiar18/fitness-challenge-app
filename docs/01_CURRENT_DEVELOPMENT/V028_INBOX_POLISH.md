# Champions Legacy Challenge — v0.28.0 Inbox Polish

Checkpoint: 28D5

## Review outcome

Inbox already had the important functional foundations from v0.27: URL-backed
Updates/Private workspaces, keyboard-accessible shared WorkspaceTabs, read/unread
state, announcement filtering, private season notifications and Platform bonus-review
attention.

The v0.28 pass therefore stays deliberately small and presentation-focused.

## Changes

- ordinary Inbox emoji chrome is replaced with the shared Phosphor-backed `ThemeIcon`;
- announcement types use a stable semantic icon mapping instead of raw emoji glyphs;
- filter chips keep plain readable labels rather than mixing text and emoji;
- the redundant page-level attention summary card is removed because the tab badges
  already communicate attention;
- the duplicate Private summary card is removed so private notices start closer to the
  actual work;
- the header copy is shortened and the active-workspace action becomes `Mark all read`;
- private unread markers become CSS-rendered status dots rather than text glyphs;
- vague links become `Review in Seasons` and `View details`;
- private empty-state copy is shorter and more literal;
- existing URL, read/unread, bonus-review, announcement and notification behaviour is
  preserved.

## Safety boundary

28D5 does not change:

- announcement or notification data models;
- Firestore reads/writes or Rules;
- Platform Administrator bonus-review authority;
- season scoring or bonus semantics;
- notification creation behaviour;
- routes;
- Firebase deployment state.

Minor historical Inbox CSS consolidation beyond the touched dead summary selectors
remains appropriate for v0.31 rather than this accelerated page-inspection pass.
