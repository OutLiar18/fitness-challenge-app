# Trusted Season Reconciliation

<!-- RELEASE_STATUS: DEPLOYED -->
Version introduced: 0.21.0  
Status: Verified production deployment; Windows verification and production deployment pending

## Purpose

Prize-bearing standings must be reproducible from the season's frozen rules and immutable records. Trusted reconciliation gives Platform Administrators a separate calculation path that does not depend on an open browser session or mutable client state.

The free-first implementation runs manually on a trusted administrator computer. It does not require Cloud Functions, a Blaze billing plan or a background scheduler.

## Sources of truth

A reconciliation reads:

- the selected season and its frozen ruleset;
- season memberships and historical House snapshots;
- immutable `leagueContributions`;
- referenced challenge entries when still available;
- evidence claims and decisions;
- entry-correction records;
- existing published leaderboard snapshots.

Standings and honours are recalculated through the same pure league model used by the application. The trusted tool does not invent a second scoring system.

## Safe dry run

`npm run season:reconcile` is the default operating mode.

It:

1. selects a season;
2. loads the immutable season records;
3. recalculates individual and House standings;
4. checks evidence, correction and contribution relationships;
5. compares the result with the latest published snapshot;
6. writes a portable JSON report to the ignored `trusted-reports/` folder.

A dry run does not create, update or delete Firebase competition records.

## Publication

`npm run season:reconcile:publish` performs the same audit and then asks for an explicit `PUBLISH` confirmation.

Publication is blocked when the audit contains a blocking integrity issue. A successful publication creates:

- one immutable `leagueLeaderboardSnapshots` record with `publicationType: trusted-local`;
- one immutable `seasonTrustedRuns` summary;
- one immutable `auditEvents` record;
- one forward update to the season's published-snapshot pointer and revision.

The snapshot includes a deterministic fingerprint of the frozen season identity, memberships and immutable contributions. If the currently published trusted snapshot already has the same fingerprint, the command reports that it is current instead of creating a duplicate publication.

## Integrity findings

Blocking findings include:

- contributions assigned to the wrong season or outside its dates;
- invalid points, dates, users or score categories;
- missing evidence claims or decisions linked from a contribution;
- verified proof without its released contribution;
- point-changing decisions without a contribution;
- correction contributions without their correction record;
- completed corrections missing a reversal, replacement contribution or replacement entry.

A missing source entry is a warning rather than an automatic failure because historical competition contributions are intentionally immutable and may outlive private player data.

## Visibility

- Platform Administrators and administrators assigned to the season may read trusted-run summaries in the Season Command Centre.
- Players do not receive access to trusted operational findings.
- No browser client may create or modify `seasonTrustedRuns`.
- The Firebase Admin SDK command performs elevated writes outside client Security Rules.

## Operating boundary

- The tool is manual and therefore cannot guarantee a 10:00 publication.
- A private service-account key is required once and must stay outside the repository.
- The command does not repair records automatically; blocking findings must be investigated through the existing audited workflows.
- It does not execute account deletion or anonymisation.
- It does not change scoring, evidence policy, corrections, House attribution or season rules.
