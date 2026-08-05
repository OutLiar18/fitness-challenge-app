# ADR-028 — Free-First Trusted Season Reconciliation

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 5 August 2026  
Status: Accepted and deployed in v0.21.0

## Context

The client can calculate and publish season standings, but prize-bearing competition eventually needs an elevated process that can independently rebuild the result from immutable records. Reliable scheduled Cloud Functions would introduce billing configuration and operational complexity that the project owner does not want at this stage.

## Decision

Add a local Node.js Firebase Admin SDK command as the first trusted-operations boundary.

The command will:

- default to a read-only dry run;
- use the existing pure league calculation model;
- inspect contribution, evidence and correction integrity;
- create a deterministic source fingerprint;
- write local JSON reports outside Git;
- publish only after an explicit command and confirmation;
- publish forward-only immutable snapshot, run and audit records;
- remain idempotent when the current trusted fingerprint is unchanged.

The private service-account credential remains outside the repository. Cloud Functions and automatic scheduling are not part of this decision.

## Consequences

### Benefits

- No paid Firebase plan is required for this phase.
- The trusted calculation is separate from browser permissions and UI state.
- Dry runs are safe and reviewable.
- Published results are traceable to a stable fingerprint and audit record.
- Existing scoring and historical House attribution remain authoritative.

### Trade-offs

- An administrator must run the command manually.
- Daily publication is not guaranteed at an exact time.
- Service-account key handling becomes an operational security responsibility.
- The tool reports broken integrity but does not silently repair it.

## Security

- `seasonTrustedRuns` is read-only to authorised clients and unwritable by all client roles.
- Admin SDK credentials are ignored by repository patterns and must not be copied into the project.
- Publication records use immutable collections and a forward-only league pointer update.

## Revisit conditions

Reconsider this decision when automatic publication becomes essential, the project adopts a paid backend, service-account key management becomes too burdensome, or multiple trusted operators need centrally managed execution.
