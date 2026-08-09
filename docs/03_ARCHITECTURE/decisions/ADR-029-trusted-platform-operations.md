# ADR-029 — Trusted Platform Operations Boundary

**Status:** Accepted for v0.24.0 Checkpoint 8J  
**Date:** 9 August 2026

## Context

Champions Legacy Challenge already treats Platform-Administrator-only evidence and factual-correction transactions as trusted administrative writes while retaining hard authorization, audit, identity and immutability boundaries. Several older operational workflows still duplicated service-layer content validation inside Firestore Rules even though only a Platform Administrator can perform the mutation.

The duplicated validation increased Rules source and compiled complexity without protecting against an untrusted player write path.

## Decision

Apply the trusted Platform Administrator boundary to:

- announcement create/update;
- exercise/library suggestion review and publication;
- shared-library item publish/archive and release publication;
- client-error report resolution;
- account-deletion request acknowledgement.

Rules continue to enforce:

- Platform Administrator authority at the collection match;
- allowed state transitions and restricted changed-field sets where a record is updated;
- actor and server-time ownership;
- matching immutable `auditEvents` records;
- immutable published history where already required;
- public/read visibility rules.

Player-originated suggestion creation, client-error report creation, and account-deletion request/create/cancel/reopen validation are unchanged.

## Consequences

- No ordinary player receives a new write path.
- Administrative payload quality remains enforced by the existing service/domain models before the transaction is written.
- A compromised Platform Administrator account is still constrained by role, transition and audit requirements, but Rules no longer duplicate every presentation-length check for that trusted actor.
- The Firestore Ruleset becomes smaller and evaluates fewer redundant expressions.
