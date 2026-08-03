# Champions Legacy Challenge — Architecture Overview

Current release target: v0.15.0

## Layers

```text
Configuration and factual Firestore documents
                    ↓
Pure domain services
(points, statistics, progression, seasons, analytics, dates, validation)
                    ↓
Repositories and Firestore orchestration
                    ↓
Providers and hooks
                    ↓
Reusable components and route workspaces
```

Firestore stores facts, trusted roles, immutable audits and season snapshots. Derived personal analytics, standings, goals and progression are calculated by services.

## v0.15 decisions

- Navigation information architecture is configuration-driven through `constants/navigation.js`.
- Public announcements and private notifications are combined only at the Inbox presentation layer.
- Analytics has no Firestore collection and no alternate scoring implementation.
- C.H.A.O.S. readiness is a pure season-domain calculation reused by UI and tests.
- Legacy route redirects preserve bookmarks while current route and file names use Seasons, Houses and Inbox.

## Security and history

Season contributions store House identity at earning time. Roster changes affect future contributions only. Firestore Rules remain the authority for ownership, role, shape and atomic-operation boundaries.

## Scale guardrails

The current client architecture is suitable for controlled pre-v1.0 use. Before prize-bearing or significantly larger seasons, add trusted server recalculation, background operations and paginated history rather than duplicating logic in UI code.
