# ADR-026 — Season Command Centre and Role-scoped Reports

Status: Accepted  
Date: 4 August 2026

## Context

Season operations are distributed across Seasons, Houses and Evidence Operations. The underlying records are intentionally immutable and permission-scoped, but administrators need a practical way to identify the next required action without manually reconciling several screens.

## Decision

Add a derived Season Command Centre for configured v2 seasons.

The command centre reads existing Firestore records through existing Security Rules and computes operational summaries in pure client-side models. It introduces no stored command-centre document and no alternate scoring state.

Allow a local JSON operations report generated from the records visible to the current role. Category reviewers receive only assigned evidence categories; Platform and season administrators receive the full managed-season view.

## Consequences

### Positive

- Administrators see the season's operational health in one place.
- Next actions remain explainable and linked to the authoritative detailed workspace.
- Immutable evidence and snapshot histories are easier to audit.
- Reports support handover and reconciliation without new backend cost.
- No migration, collection or Security Rule change is required.

### Trade-offs

- The command centre opens several live subscriptions while its workspace is active.
- The report is a client-generated operational export, not a trusted server attestation.
- Sensitive operational exports must be handled responsibly by administrators.
- True scheduled publication and trusted recalculation remain future backend work.

## Alternatives rejected

- Store a mutable command-centre summary document: rejected because it could drift from source records.
- Add direct point-edit controls: rejected because it breaks provenance.
- Expose live operational data to ordinary players: rejected because player standings are deliberately snapshot-controlled.
- Claim the command centre is a scheduler: rejected because it runs only in an authorised client session.
