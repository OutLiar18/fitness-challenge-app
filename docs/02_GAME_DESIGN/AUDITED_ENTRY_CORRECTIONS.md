# Audited Entry Corrections

## Purpose

An activity can contain an honest factual mistake. Correcting that mistake must not erase the original record, silently move historical House points or bypass WhatsApp proof. Champions Legacy Challenge therefore uses immutable replacement entries rather than conventional editing.

## Authority

Only a Platform Administrator can complete a correction. Ordinary players can read their correction history but cannot create, update or delete correction records.

## Invariants

A correction must preserve:

- the player;
- activity category;
- original challenge date;
- historical House snapshot attached to existing competition records;
- every earlier entry version;
- every evidence decision and contribution already created.

A correction must include a human-readable reason of at least eight characters.

## Replacement chain

Each chain has one root entry. A correction creates:

1. a new immutable `challengeEntries` replacement;
2. an immutable `entryCorrections` record;
3. an `entryCorrectionHeads/{rootEntryId}` pointer to the current replacement;
4. an immutable audit event;
5. any required contribution reversals/replacements and proof-claim transitions.

The correction head is the only mutable part of the chain. It can move forward by exactly one sequence and cannot rewrite the root, player, category or original creation identity.

## Personal calculations

Goals, records, progression, analytics and personal statistics use only the current resolved entry in each chain. Earlier versions remain visible as preserved history. If a head is temporarily unavailable, the client resolves the newest readable immutable replacement and raises a warning instead of counting multiple versions.

## Season points

The app never edits an existing contribution. It calculates the source entry's current net activity contribution groups and creates negative `correction-reversal` records. It then creates positive `correction-replacement` records for the replacement's immediate points.

The original House identity stays on both reversal and replacement records, so a later roster move never reallocates the activity.

Evidence-bonus point groups are not silently recalculated by this workflow. Water and Fruit retain their one-per-day proof claim, which is linked to the replacement entry for traceability.

## Running

- A qualifying replacement run creates immediate Cardio points and a new pending Running proof claim.
- A non-qualifying replacement run creates only Cardio points.
- The earlier required proof claim becomes `superseded`.
- A verified earlier Running contribution is reversed through the normal immutable contribution mechanism.
- The replacement proof deadline inherits the original claim deadline when available; a correction does not grant a fresh proof window.

## Steps

Replacement Steps points remain pending until the replacement proof claim is verified. The earlier required proof claim becomes superseded.

## Water and Fruit

Normal activity points are reversed and replaced. The deterministic daily proof claim remains one claim per player, date and category. The replacement entry ID and correction ID are appended to that claim.

## Pocket Week boundary

Pocket redemption entries are immutable activation receipts tied to reserve quantities and redemption receipts. v0.20.0 can diagnose them but does not replace them through the standard correction workflow.

## Diagnostics

A correction may proceed only when the loaded chain has no blocking integrity error. Missing entries, orphaned contributions or broken proof links must be reconciled before another immutable replacement is created.

The Entry Integrity workspace checks for:

- missing current entries;
- correction-head mismatch;
- missing source or replacement entries;
- orphaned contributions or claims;
- missing superseding claims;
- missing entry-listed claims;
- correction sequence gaps.

Diagnostics never repair data automatically.

## Reporting

A targeted integrity report includes the chain, correction head, corrections, contributions, claims and diagnostics visible to the Platform Administrator. Firestore timestamps are serialised to ISO strings. No WhatsApp image or message content is stored or exported.
