# Champions Legacy Challenge — v0.28.0 Legacy Coach Polish

Checkpoint: 28D8

## Review outcome

Legacy Coach already has a strong product boundary: recommendations are optional,
based on the player's own factual recent activity, expose a reason, preserve URL-backed
workspace state, and explicitly avoid diagnosis, certainty or external AI-service
claims.

The v0.28 pass therefore focuses on visual consistency, concise navigation and one
small language bug rather than changing recommendation logic.

## Changes

- Pocket Week is recorded as owner-accepted and the inspection advances to Legacy Coach;
- PageHeader, WorkspaceTabs, hero, zero-recommendation state, evidence list and
  human-first guardrail use the shared Phosphor-backed ThemeIcon language;
- workspace descriptions are shortened without changing the three-section structure;
- the weekly hero keeps the same factual summary and metrics but uses a professional
  compass icon instead of emoji;
- recommendation count copy now handles singular/plural correctly;
- `Save coach preferences` is shortened to `Save preferences`;
- evidence and human-first copy remain explicit and unchanged in meaning;
- URL state, preference persistence and recommendation generation remain unchanged.

## Safety boundary

28D8 does not change:

- coach recommendation calculations;
- the current/previous seven-day comparison windows;
- recommendation evidence;
- preference values or defaults;
- Points, Experience Points, goals or league standings;
- Firestore Rules;
- Firebase deployment state.

Broad historical CSS consolidation remains deferred to v0.31.
