# Champions Legacy Challenge — Data Model

Last updated: 1 August 2026  
Current release: v0.11.0

## Principle

Store facts and trusted decisions. Derive progress and presentation.

## Existing core entities

- **Player profile** — permanent identity and trusted role metadata.
- **Challenge entry** — immutable owner, category, factual data, creation time and local challenge date.
- **Personal library item** — owner-scoped reusable content.
- **Suggestion** — proposed library definition and moderation/publication history.
- **Published library item/release** — versioned shared definition and immutable release history.
- **Announcement/read record** — platform communication and private read state.
- **Client error report** — sanitised authenticated failure and resolution state.
- **Audit event** — immutable privileged-operation record.

## Team entities

### Team

Stores name, normalized name, description, motto, local emblem identifier, status, captain, invitation code and timestamps.

### Team member

Stored under the team and contains user identity snapshot, team role, join data and the member’s current weekly accountability snapshot.

### Player team pointer

`playerTeams/{userId}` enforces one active team per player and provides fast profile/navigation lookup.

### Team invitation

Maps an eight-character access code to an active team identity.

## League entities

### League

Stores identity, type, mode, lifecycle status, season dates, frozen rules version/ruleset, assigned administrator identifiers, access code and audited lifecycle timestamps.

### League membership

Stores the player and team identity snapshot used for the season, participation role, lifecycle status and registration metadata.

### League contribution

An immutable snapshot linked to one challenge entry and one active league. It stores identity snapshot, category, challenge date, activity-point snapshot and rules version.

### League invitation

Controls whether the access code accepts registration.

## Coach entity

`users/{userId}/coach/preferences` stores only enabled state, tone, focus and server update timestamp. Recommendations are never persisted; they are derived from the player’s entries.

## Derived systems

- personal points, goals, bonuses, streaks, experience, achievements, records and timeline;
- team weekly summaries;
- league player and team standings;
- Legacy Coach comparisons, recommendations and evidence.

## Historical stability

- Published activity definitions are copied into entries.
- League rules are frozen in the league document.
- League identity and activity points are copied into contribution documents.
- Completed history is archived rather than silently recalculated under new rules.
