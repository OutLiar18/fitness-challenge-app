# Champions Legacy Challenge — Current Context

<!-- RELEASE_STATUS: DEPLOYED -->
**v0.20.0 — Audited Factual Corrections and History Resilience** is verified and deployed to production.

## Why this phase exists

Entries can be factually wrong even when the original logging action was honest. Direct editing would destroy evidence history, alter past House attribution and make published competition records difficult to audit. Direct deletion is already blocked for evidence-linked records. The product therefore needs a replacement-and-reconciliation workflow rather than a conventional edit button.

## Candidate behaviour

- Platform Administrator searches for an entry or verification ID.
- The current active entry and all preserved versions are resolved.
- The administrator changes only factual activity fields and supplies a reason.
- One transaction creates the replacement entry, correction record, correction head, audit event, contribution reversals/replacements and proof-claim transitions.
- Players' personal calculations use the replacement while the full chain remains visible.
- Journal history is paginated by recorded date.
- Diagnostics report broken links but never repair data automatically.

## Trust boundary

This is an audited Platform Administrator operation implemented with Firestore transactions and Security Rules. It does not provide arbitrary point fields or editable competition totals. A future trusted backend remains recommended for prize-bearing seasons and large-scale automated reconciliation.
