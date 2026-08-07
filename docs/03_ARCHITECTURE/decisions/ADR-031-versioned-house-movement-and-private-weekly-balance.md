# ADR-031 — Versioned House Movement and Private Weekly Balance

Status: Accepted  
Date: 6 August 2026  
Release: v0.24.0

## Context

The existing season system already preserved historical House contributions and atomically completed one balanced weekly swap. It did not prevent the same player from being moved in consecutive weeks, explain player eligibility before submission, preserve a dedicated assignment timeline or provide a privacy-safe composition-balancing foundation.

Composition data is sensitive. Storing it on the permanent user profile or exposing individual answers to House leaders would create unnecessary privacy risk. Awarding balance points before the formula had been rehearsed would also risk distorted standings.

## Decision

1. New seasons use `season-houses-v4` and freeze `house-movement-v1` into their ruleset.
2. A player moved in week N is locked through week N+1 and becomes eligible in week N+2.
3. C.H.A.O.S. opening assignment does not count as a move.
4. Current-week movement, House weekly locks and leadership protection remain non-bypassable.
5. Only a Platform Administrator may override the post-move rest to correct a factual or operational mistake, with an immutable written audit trail.
6. Current assignment remains on `leagueMemberships`; immutable assignment events are written to `leagueHouseAssignmentHistory`.
7. Optional composition responses are stored separately in `leagueCompositionProfiles`, scoped by league and player.
8. Public weekly summaries and private exact snapshots are separated into `leagueHouseBalanceWeeks` and `leagueHouseBalancePrivateWeeks`.
9. Public composition requires a minimum disclosure group of three.
10. `house-balance-v1` is informational and has `scoringEnabled: false`.

## Consequences

### Positive

- Players cannot be repeatedly traded from week to week.
- Eligibility is explainable in the interface and enforced by Rules.
- Historical assignments become auditable without slowing current roster reads.
- Private responses remain isolated from permanent identity data.
- Public House summaries protect small groups.
- The calculation can be rehearsed before any future scoring decision.
- Existing v1–v3 seasons remain historically stable.

### Costs

- New Firestore collections and Rules require broader operational testing.
- C.H.A.O.S. now approaches the 500-write batch limit at the 160-player cap because each assignment also writes immutable history.
- Trusted account deletion must delete composition profiles and anonymise shared movement/private snapshot records.
- Administrators must deliberately preserve the weekly balance snapshot; there is no paid background scheduler.

## Rejected alternatives

- Permanent profile gender field: rejected because the response is season-specific and unnecessarily sensitive.
- House-leader access to individual answers: rejected because aggregate information is sufficient for the balancing purpose.
- Immediate House points for composition: rejected until full-season rehearsal proves the formula fair and understandable.
- Unrestricted League Administrator override: rejected because an emergency correction must not become an extra strategic transfer.
- Rewriting membership history in place: rejected because current state and permanent history serve different purposes.
