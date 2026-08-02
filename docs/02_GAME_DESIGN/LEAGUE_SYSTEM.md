# Champions Legacy Challenge — League System

Last updated: 1 August 2026  
Implemented foundation: v0.11.0

## Purpose

Leagues provide time-limited, friendly competition while personal progress remains permanent. Every season begins from zero and rewards consistent participation more than one exceptional burst.

## Shared activity model

Players record an activity once. During an active league, the same atomic write creates:

```text
Challenge Entry
├── Personal points, goals and progression
└── Immutable league contribution snapshot
```

No duplicate league logging is required.

## Lifecycle

A league moves forward one audited stage at a time:

1. **Draft** — name, description, dates, mode and rules are created.
2. **Registration** — the access code opens and players may join or withdraw.
3. **Active** — registered memberships become active and qualifying entries contribute.
4. **Completed** — scoring closes and memberships become completed.
5. **Archived** — the season becomes historical and remains read-only.

Stages cannot be skipped or reversed.

## Frozen rules

Every league created from v0.11.0 onward stores `consistency-v1`:

- scoring engine: `points-v2`;
- included categories: all ten factual activity categories;
- maximum raw activity contribution per player per calendar day: 20 points;
- participation bonus per active calendar day: 5 points.

The ruleset and version are copied into the league document and may not change during the season.

## Standings

For each player and calendar day:

1. Sum immutable entry contribution points.
2. Cap the raw daily activity contribution at 20 points.
3. Add the five-point participation bonus.
4. Sum all league days for player standings.
5. Group player totals by the team snapshot captured at registration for team standings.

This makes steady participation competitive without making difficulty or natural athletic ability overwhelmingly valuable.

## League modes

- **Individual** — player ranking is primary.
- **Team** — individual contributions are grouped by the registered team snapshot.

Both views may be displayed so individual effort remains visible.

## Authority

League Administrators and Platform Administrators may create leagues. Only an explicitly assigned league administrator or Platform Administrator may move that league through its lifecycle. Every creation and lifecycle change requires an audit event.

Administrative authority does not grant points or standings advantages.

## Integrity boundary

Security Rules require a contribution to match:

- the authenticated player;
- an active membership;
- an active league;
- the player identity and team snapshot stored in membership;
- the category and date of an entry written in the same database state;
- the frozen rules version.

The client still calculates category points. Before leagues support prizes or high-stakes competition, a trusted backend must recalculate contributions authoritatively.

## Deferred league features

- seasonal achievements and awards;
- evidence and dispute review;
- privacy controls for archived seasons;
- server-authoritative scoring;
- configurable future rulesets;
- historical league trophy-cabinet presentation.

## Principle

Winning a season is temporary. The honest habits built during it become part of the player’s permanent legacy.
