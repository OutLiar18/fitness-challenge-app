# Champions Legacy Challenge — House Movement and Weekly Balance

Version: 1.0  
Application release: v0.24.0  
Status: Frozen for `season-houses-v4`

## Purpose

This document defines the weekly House movement stability rule, immutable assignment history, emergency correction boundary, optional season composition response and non-scoring weekly balance calculation.

## Core principles

- Earlier House contributions remain with the House represented when the activity occurred.
- Moving Houses changes future representation only.
- A roster mechanism must not repeatedly move the same player before they can settle into a House.
- Competition information must never expose a player’s private identity response unnecessarily.
- Weekly balance informs administrators; it does not alter points in v0.24.0.

## Normal weekly roster move

- The existing roster mechanism remains a balanced one-for-one swap between two Houses.
- Each participating House may complete one roster move per official Monday-to-Sunday week.
- Captains, Vice-Captains and authorised administrators may operate the normal mechanism according to existing permissions.
- A current Captain or Vice-Captain must be replaced before moving.
- Both participating Houses receive an immutable weekly lock after the swap.

## One-week player rest

A player moved during week N:

- is recorded as moved during week N;
- cannot move again during week N+1;
- becomes eligible again in week N+2.

The membership stores:

- `lastRosterSwapId`;
- `lastRosterWeekKey`;
- `rosterLockThroughWeekKey`;
- `rosterEligibleWeekKey`.

The opening C.H.A.O.S. assignment is not a roster move and does not start the player rest period.

## Eligibility explanations

The interface explains eligibility before a swap is submitted. Supported outcomes include:

- Eligible to move.
- Moved this week.
- Resting after last week’s move.
- Current House leader.
- House already used its weekly move.
- Not an active season member.
- No longer part of the selected House.

The same restrictions are enforced by Firestore Security Rules. Interface feedback is not treated as the security boundary.

## Platform Administrator factual correction

The one-week player rest may be overridden only when all of the following are true:

- the operator is a Platform Administrator;
- at least one selected player is currently in the post-move rest period;
- the current-week House and player locks still remain non-bypassable;
- no current House leader is moved;
- a written factual or operational correction reason of at least 12 characters is supplied;
- the complete swap remains balanced and both Houses receive the normal weekly lock.

The override is not an extra strategic transfer. League Administrators and House leaders cannot use it.

The immutable records preserve:

- the restriction overridden;
- affected player identifiers;
- previous House assignments;
- previous roster week and lock fields;
- new House assignments;
- new lock and eligibility dates;
- operator;
- reason;
- audit identifier.

## Immutable House assignment history

`leagueHouseAssignmentHistory` records every v4 assignment created by:

- opening C.H.A.O.S.;
- a normal weekly roster swap;
- an audited Platform Administrator correction.

History records cannot be updated or deleted by client applications. The current membership document remains the efficient current-state record; assignment history remains the permanent timeline.

Account deletion replaces the player identity in shared history with the stable Former Player identity. Competition facts remain intact.

## Optional season composition response

Composition information is:

- optional;
- self-declared;
- scoped to one season;
- removable by the player;
- excluded from the permanent player profile;
- readable only by the player, Platform Administrators and authorised season administrators where operationally necessary.

Available responses are:

- Woman.
- Man.
- Non-binary or another identity.
- Prefer not to say.

House leaders and ordinary players cannot read another player’s response.

A deleted account’s private response is deleted rather than anonymised.

## Weekly House balance calculation

An authorised season administrator may preserve one snapshot per official week during an active v4 season.

The calculation uses:

- the active membership roster at calculation time;
- current House assignment;
- House roster size;
- available private composition responses;
- the active season-wide disclosed composition distribution;
- calculation version `house-balance-v1`.

Each House is compared with the active season distribution rather than an assumed 50/50 target.

The snapshot reports:

- active-player count;
- response, disclosed and undisclosed counts;
- largest House-size difference;
- visible House composition distributions;
- total-variation deviation from the season distribution;
- a transparent status: Balanced, Review suggested, Attention needed or Insufficient data.

## Privacy protection

- At least three disclosed responses are required before a House distribution is shown.
- If the complete season has fewer than three disclosed responses, season composition is also hidden.
- “Prefer not to say” and no response remain undisclosed for composition calculation.
- Public weekly records contain privacy-safe aggregate summaries only.
- Exact counts and the calculation roster snapshot are stored separately and are readable only by authorised administrators.
- Small-group suppression is never bypassed merely because a player is a House leader.

## Scoring boundary

Weekly House balance is informational in v0.24.0.

It does not:

- award House points;
- award individual points;
- reduce earned points;
- multiply Power Plays;
- change Experience Points;
- alter evidence decisions;
- rewrite historical contributions.

A future scoring effect would require a separate explicit rules decision, new ruleset version, tests and documentation.

## Compatibility

- Newly created seasons use `season-houses-v4`.
- Existing v1, v2 and v3 seasons retain their frozen historical rules.
- Existing Power Play behaviour remains active in v4.
- No active historical season is silently migrated.

## Related documentation

- `LEAGUE_SYSTEM.md`
- `TEAM_SYSTEM.md`
- `ACCOUNT_AND_PRIVACY.md`
- `POWER_PLAYS.md`
- `ADR-031-versioned-house-movement-and-private-weekly-balance.md`
- `HOUSE_BALANCE_OPERATIONS.md`
