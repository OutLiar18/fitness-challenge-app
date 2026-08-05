# ADR-029 — Trusted Account Deletion and Anonymised Shared History

Status: Accepted  
Date: 5 August 2026

## Context

The client-side request workflow could not safely delete Firebase Authentication or reconcile identity across private and shared Firestore records. Completely deleting shared season records would rewrite other players' standings and House history, while retaining names and emails would fail the approved privacy goal.

## Decision

Use a free-first local Firebase Admin SDK command with a seven-day cancellation window.

- The browser may request, cancel and display status.
- A Platform Administrator acknowledges the request.
- Trusted processing is blocked until seven full days after acknowledgement.
- Private account records and Authentication are removed.
- Shared competition records retain their factual values but replace identity with a deterministic Former Player alias.
- The last Platform Administrator is protected.
- Processing requires explicit confirmation, a final live refresh, resumable execution records and an immutable completion receipt.
- A future account is a new identity and is not reconnected to anonymised history.

## Consequences

### Positive

- Shared standings and honours remain historically truthful.
- Names, email addresses and active account access are removed from preserved history.
- No paid backend or Cloud Functions are required.
- Dry-run reports and explicit confirmation reduce irreversible mistakes.
- Failed operations have a defined recovery path.

### Costs and limitations

- Operations are manual.
- A private elevated credential must be protected.
- The deterministic alias is stable across records, so authorised administrators can see that records belong to the same former account.
- Formal legal/privacy review remains required before a public real-world launch.

## Supersedes and extends

Extends ADR-024, which introduced guided onboarding, personal export and trusted account requests but deliberately deferred irreversible deletion.
