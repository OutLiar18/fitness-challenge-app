# ADR-016 — Persistent Team Membership

Date: 1 August 2026  
Status: Superseded by ADR-021

## Context

Teams require fast membership lookup, narrow captain authority and protection against a player joining multiple teams. Storing only an array inside a team would make owner queries, role transfer and Security Rules fragile.

## Decision

Use four coordinated documents:

- `teams/{teamId}` for team identity and captain;
- `teams/{teamId}/members/{userId}` for roster state;
- `playerTeams/{userId}` as the one-team pointer;
- `teamInvites/{code}` for joining.

Creation, joining, leaving and captain transfer use atomic batches. Team weekly progress reuses factual personal entries and central point calculation.

## Consequences

- One-team membership is efficient and enforceable.
- Captain transfer can be validated through `getAfter` across all affected documents.
- The duplicated membership pointer requires atomic consistency.
- Team weekly summaries remain friendly client-derived accountability data, not high-stakes score authority.

## Supersession

v0.14.0 established that Houses belong to one league season and permanent global Teams do not match the product rules. The collections described above are retired and denied by current Firestore Rules. ADR-021 is the active decision.
