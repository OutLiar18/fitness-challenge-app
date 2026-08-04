# ADR-027 — Audited Entry Corrections and Active History

Status: Accepted for v0.20.0 release candidate  
Date: 4 August 2026

## Context

Directly editing or deleting an activity can invalidate evidence decisions, House attribution, published standings and audit history. Evidence-linked entries are already immutable. The product also needs personal statistics to use corrected facts without double-counting preserved versions.

## Decision

Use immutable replacement entries plus two correction collections:

- `entryCorrections` stores each immutable correction transaction;
- `entryCorrectionHeads` stores the current entry ID for each correction root.

A Platform Administrator transaction creates the replacement, audit event, correction record, correction-head change, contribution reversals/replacements and proof-claim transitions. Ordinary players cannot write any correction document.

Personal read models resolve active history before deriving goals, records, progression or analytics. The raw immutable entries remain available for history and export.

## Security decision

Firestore Rules permit correction writes only to Platform Administrators and validate:

- fixed player/category/date and non-Pocket source;
- forward-only sequence;
- correction/replacement linkage;
- matching audit event;
- correction-specific contribution and evidence-claim links;
- owner-only reads plus Platform Administrator reads;
- no deletion of corrected source entries.

## Consequences

### Positive

- No silent history rewrite.
- Historical House attribution remains stable.
- Evidence decisions remain explainable.
- Current personal calculations use corrected facts.
- Integrity diagnostics can identify broken derived links.
- Personal export remains portable and auditable.

### Costs

- More documents are created per correction.
- The trusted client transaction is complex and must remain Rules-tested.
- Underlying owner history is still a live query; only rendering is paginated in this phase.
- Pocket redemption correction requires a separate reserve-aware design.

## Rejected alternatives

- Direct `challengeEntries` update: rejected because it destroys immutable facts.
- Deleting and recreating entries: rejected because it breaks proof and contribution links.
- Editing point totals: rejected because points must remain derived from factual activity.
- Automatic background repair: rejected because reconciliation requires human review and explicit audit.

## Future

Prize-bearing seasons should move correction execution and full recalculation to a trusted server/Admin SDK process. Whole-season reconciliation and reliable scheduled publication belong in the trusted operations phase.
