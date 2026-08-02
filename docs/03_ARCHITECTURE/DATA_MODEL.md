# Champions Legacy Challenge — Data Model

Last updated: 1 August 2026  
Current release: v0.13.1

## Principle

Store facts and trusted decisions. Derive progress and presentation.

## Core entities

- **Player profile** — permanent identity and trusted role metadata.
- **Challenge entry** — owner, category, category-shaped factual data, server creation time and local challenge date.
- **Personal/shared library records** — reusable definitions with versioned publication history.
- **Announcement/read record** — platform communication and private read state.
- **Client error report** — sanitised authenticated failure and resolution state.
- **Audit event** — immutable privileged-operation record.

## Team entities

- **Team** — identity, local emblem, captain, member count and invite code.
- **Team member** — identity snapshot, role and current-week accountability snapshot.
- **Player team pointer** — one active team per player.
- **Team invitation** — known-code lookup; not listable.

Stale weekly member values are normalised to zero when their `weeklyKey` is not the current week.

## League entities

- **League** — identity, mode, lifecycle, dates, frozen rules, administrators, participant count/limit and access code.
- **Membership** — season identity/team snapshot and status.
- **Contribution** — immutable entry-linked identity/category/date/point/rules snapshot.
- **Invitation** — known-code registration state; not listable.

Registration count and membership changes are paired transactionally. Active contributions follow recent source-entry deletion; completed/archived contributions remain permanent.

## Coach entity

`users/{userId}/coach/preferences` stores only enabled state, tone, focus and server update timestamp. Recommendations are derived and not persisted.

## Derived systems

- personal points, goals, bonuses, streaks, experience, achievements, records and timeline;
- current-week team summaries;
- league player and team standings;
- Legacy Coach comparisons, recommendations and evidence.

## Historical stability

- Published activity definitions are copied into entries.
- League rules are frozen in the league document.
- League identity and activity points are copied into contributions.
- Completed seasonal history is not silently recalculated or deleted.
