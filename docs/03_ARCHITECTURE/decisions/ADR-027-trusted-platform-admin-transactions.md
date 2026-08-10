# ADR-027 — Trusted Platform Administrator Transaction Boundary

Status: Accepted
Date: 9 August 2026
Release target: v0.24.0

## Context

Firestore Security Rules had grown to nearly 4,000 lines and repeatedly approached evaluator and production deployment limits. The heaviest areas were privileged evidence decisions and factual entry-correction transactions. These writes were already restricted to Platform Administrators, but Rules also re-derived many copied scoring, House and presentation fields already calculated by the application transaction.

## Decision

Treat Platform-Admin-only evidence decisions and correction reconciliation as trusted administrative transactions.

Firestore Rules must still enforce:

- Platform Administrator authority.
- Immutable decision, contribution and correction records.
- Evidence decision linkage to the stored claim.
- Allowed evidence status transitions and bounded point deltas.
- Correction source/replacement player, category and challenge-date identity.
- Forward-only correction sequencing.
- Matching immutable audit records for factual corrections.
- Player and League Administrator denial for privileged decision/correction writes.

Rules do not need to independently re-derive every duplicated display, House or calculation field written by the authorised Platform Administrator workflow.

## Consequences

- Player-originated evidence claim creation remains strictly validated and unchanged.
- League Administrators retain read-only evidence access but no evidence-decision authority.
- The browser Platform Administrator workflow remains responsible for calculating internally consistent duplicated fields.
- A compromised Platform Administrator account remains a high-privilege security event, as it already was; audit and immutable history remain mandatory controls.
- The Rules source and evaluator workload are reduced, improving deployability and maintainability.
- A future server-side Admin SDK workflow may further harden privileged operations without restoring client Rules complexity.
