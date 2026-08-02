# Champions Legacy Challenge — Known Issues

Last updated: 2 August 2026

## Rule and evidence boundaries

- Rules are bundled with the application. Platform Administrators cannot yet publish a complete versioned season rule pack from the admin interface.
- The app does not upload, store or adjudicate screenshots, GPS files or other evidence.
- Pocket Week, Power Play, Transfer Market, Buddy Bonus, photo bonuses and Five Fires are historical ideas only and award no points.
- Season-option rules depend on an official announcement and organiser process; not every option has dedicated automation.

## Competition trust boundaries

### Friendly team summaries

Team roster progress is derived from factual entries but submitted by each authenticated client. It is suitable for accountability and encouragement, not prize-bearing competition.

### League score authority

Rules bind contributions to an active league, membership and frozen rule version. A trusted backend is still required before prizes or money are attached.

## Product lifecycle gaps

- Team disbanding and archived team history are not yet available.
- Invitation codes are bearer codes, not passwords.
- League archive privacy controls, seasonal awards and trophy-cabinet integration are deferred.
- Account deletion, personal-data export, privacy/support content and first-use onboarding remain pre-v1.0 requirements.

## Scale and operations

- PlayerDataProvider subscribes to the player’s complete activity history.
- Administrative search covers loaded pages rather than the full database.
- Client error reporting lacks source-map symbolication, session replay and external alerts.
- The first Platform Administrator still requires trusted bootstrap.
- League lifecycle batches support a maximum of 200 participants by design.

## Dependency advisory

A React Router advisory may remain in `npm audit`. Review the affected runtime mode before changing major versions. Do not run `npm audit fix --force`.

## Defect handling

Record verified defects here, add regression coverage where practical, and remove them only after tests, build and the relevant workflow pass.
