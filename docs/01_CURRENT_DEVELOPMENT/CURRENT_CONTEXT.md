# Champions Legacy Challenge — Current Context

<!-- RELEASE_STATUS: DEPLOYED -->
**v0.21.0 — Trusted Standings and Season Reconciliation** is the current source candidate. Production is v0.21.0.

## Why this phase exists

Client transactions preserve competition records, but prize-bearing standings need an independent process that can rebuild results from immutable sources and expose broken evidence or correction links before publication. The project owner requested a free and simple approach, so this phase uses a manual local Admin SDK command rather than paid Cloud Functions.

## Candidate behaviour

- Dry run reads one selected season and writes only a local report.
- Existing pure league models recalculate standings and honours.
- Integrity checks cover contributions, evidence claims/decisions and correction chains.
- A stable fingerprint represents the frozen season inputs.
- Publication requires an explicit command and confirmation.
- Publication creates forward-only immutable records and is idempotent for an unchanged fingerprint.
- Authorised operators see the latest trusted publication summary in the Command Centre.

## Trust boundary

The browser remains governed by Firestore Security Rules and cannot write trusted-run records. Elevated publication happens only through a private service-account credential on a trusted administrator computer. That credential is not part of the source archive and must never be committed.
