# Champions Legacy Challenge — Season Command Centre

Version: 1.0  
Introduced: v0.19.0  
Last updated: 4 August 2026

## Purpose

The command centre gives authorised season operators one calm view of what requires attention next. It does not create a second administration system or alternate score. It summarises the existing season, House, leadership, evidence and publication records.

## Eligible users

- Platform Administrators see the complete season operations view.
- Season managers see the complete season operations view for seasons they manage.
- Assigned category reviewers see an operations view whose evidence claims and decisions are limited to their assigned categories.
- Ordinary players do not receive the command centre.
- Legacy `season-houses-v1` seasons do not receive the v2 evidence command centre.

## Operational summary

The command centre derives:

- registered, active, assigned and unassigned player counts;
- configured versus expected House count;
- C.H.A.O.S. readiness and completed prerequisites;
- current-week open, closed and finalised leadership ballots;
- open, expired, accepted, rejected and reversed evidence claims;
- assigned reviewer count per evidence category;
- current leaderboard revision, publication due state and snapshot history;
- immutable evidence decision history and net point movement.

## Next-action guidance

Actions are ordered from most urgent to least urgent. Examples include:

- create missing Houses before registration;
- activate C.H.A.O.S. when every prerequisite is complete;
- finalise closed 24-hour leadership ballots;
- review expired or open proof;
- publish the daily or final player-facing snapshot;
- review final honours before archiving.

The guidance links to the existing detailed workspace. It never performs a destructive or scoring action automatically.

## Operations report

Authorised users may download a portable JSON report containing the records visible to their role:

- report metadata and generation time;
- season and command-centre summary;
- Houses and memberships;
- evidence claims and immutable decisions;
- reviewer assignments;
- leaderboard snapshot history.

The report is generated in the browser and is not uploaded or saved to Firestore. It contains no WhatsApp media or message contents. Administrators should treat it as private operational data.

## Non-goals

The command centre does not:

- edit points;
- correct factual entries;
- publish a snapshot automatically merely by viewing the summary;
- replace Houses or Evidence Operations;
- add a background scheduler;
- activate Power Plays, Diamonds, Transfer Market or undefined twists.
