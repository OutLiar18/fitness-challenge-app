# ADR-025 — External Evidence and Published Daily Standings

> **Superseded in v0.24 Checkpoint 8G:** category-reviewer assignments are retired. Only Platform Administrators may make evidence decisions; League Administrators retain read-only evidence operations visibility and leaderboard publication responsibilities.


Status: Accepted  
Date: 4 August 2026

## Context

The challenge requires proof for Running and Steps and limited photo bonuses for Water and Fruit. In-app media storage would introduce a monetary and operational barrier. Live player leaderboards could also encourage tactical score watching and unfair advantage seeking.

## Decision

Use an external WhatsApp group for media and store only structured evidence metadata in Firestore.

Each eligible activity or daily bonus claim receives a human-readable verification ID. Players include the ID with WhatsApp proof. Authorised reviewers search the in-app queue, record the WhatsApp submission timestamp and create an immutable decision.

Use two standings surfaces:

- live contribution-derived standings for authorised administrators and evidence operations;
- immutable published daily snapshots for players.

At 10:00 Africa/Johannesburg, the first authorised administrator session may publish the fallback snapshot when none exists for the date. This is explicitly not a trusted background scheduler.

## Consequences

### Positive

- No media-storage cost or upload complexity.
- Proof decisions remain traceable and auditable.
- Category reviewers receive least-privilege access.
- Running Cardio remains fair while Running points are proof-gated.
- Historical House attribution is preserved.
- Players cannot tactically react to every live score change.
- Snapshot corrections preserve publication history.

### Trade-offs

- WhatsApp media lifecycle is outside app control.
- Administrators manually record submission timestamps and quantities.
- The 10:00 fallback depends on an administrator session.
- Evidence-linked entries are locked from ordinary deletion until an audited correction workflow exists.
- Running and Steps Pocket redemption is disabled in v2.

## Security model

- Players create only claims linked to their own newly created entries.
- Claim IDs must appear on the source entry.
- Platform Administrators review all categories and alone accept late proof.
- Assigned reviewers read and decide only assigned categories.
- Season Administrators manage assignments/publication but do not automatically decide proof.
- Decisions, audit events and released/reversal contributions are atomic and immutable.
- Players may read their own claims and published snapshots, not another player's live contribution stream.

## Alternatives rejected

- In-app media uploads: rejected for current cost/storage constraints.
- Manual direct point editing: rejected because it obscures provenance.
- Live player leaderboards: rejected because they invite tactical gaming.
- Claiming automatic daily publication without a scheduler: rejected as dishonest.
- Approving every activity manually: rejected as unnecessary administration.

## Future evolution

A trusted scheduled function may publish snapshots and a trusted recalculation service may reconcile prize-bearing seasons. Those services should append compatible records rather than rewrite historical decisions.
