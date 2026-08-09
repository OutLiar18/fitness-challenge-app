# Champions Legacy Challenge — Season Command Centre

Version: 1.0  
Introduced: v0.19.0  
Last updated: 4 August 2026

## Purpose

The command centre gives authorised season operators one calm view of what requires attention next. It does not create a second administration system or alternate score. It summarises the existing season, House, leadership, evidence and publication records.

## Eligible users

- Platform Administrators see the complete season operations view.
- Season managers see the complete season operations view for seasons they manage.
- League Administrators retain the full managed-season operations view, but evidence decisions remain Platform Administrator-only.
- Ordinary players do not receive the command centre.
- Legacy `season-houses-v1` seasons do not receive the v2 evidence command centre.

## Operational summary

The command centre derives:

- registered, active, assigned and unassigned player counts;
- configured versus expected House count;
- C.H.A.O.S. readiness and completed prerequisites;
- current-week open, closed and finalised leadership ballots;
- open, expired, accepted, rejected and reversed evidence claims;
- Platform Administrator evidence-decision boundary per category;
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
- leaderboard snapshot history.

The report is generated in the browser and is not uploaded or saved to Firestore. It contains no WhatsApp media or message contents. Administrators should treat it as private operational data.

## Non-goals

The command centre does not:

- edit points;
- correct factual entries;
- publish a snapshot automatically merely by viewing the summary;
- replace Houses or Evidence Operations;
- add a background scheduler;
- activate Diamonds, the Transfer Market or undefined twists.

## Trusted publication status — v0.21.0

<!-- RELEASE_STATUS: DEPLOYED -->

Platform and season administrators receive a free trusted-operations section showing the latest successful trusted publication, fingerprint, blocking/warning counts and snapshot ID. The section exposes the dry-run and publication commands but does not execute elevated operations in the browser. A missing or stale trusted publication becomes a Command Centre action.

## v0.23 Power Play operations

For a configured v3 season, the command centre now includes Power Play readiness and weekly status.

- During Draft, registration is blocked until all ten base categories are enabled, every enabled name is unique and theme-confirmed, and the unused pool covers every official week.
- During Registration or Active status, a missing current-week assignment becomes a prioritised action.
- The summary shows the current or scheduled play, selected-week count and used IDs.
- Contribution totals reflect Power Play-adjusted competitive activity value.
- Detailed pool editing, selection, redraw and correction remain in the Seasons Power Plays workspace.

The command centre does not invent a second Power Play record or select plays automatically.
