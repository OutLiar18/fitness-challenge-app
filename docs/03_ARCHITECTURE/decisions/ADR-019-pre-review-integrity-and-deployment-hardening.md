# ADR-019 — Pre-review Integrity and Deployment Hardening

Date: 1 August 2026  
Status: Accepted

## Context

The personal, administration, team, league and coaching systems were functionally complete, but integrated use exposed risks that normal visual review would not reliably detect: stale scoped subscription data, prior-week team totals, enumerable invite collections, uncapped league registration, completed-season history coupled to personal deletion, mismatched Platform Administrator controls and stale deployed chunks.

## Decision

Before the full product review:

- key provider state by authenticated user and active scope;
- normalize team snapshots against the current week;
- enforce team and league capacity in transactions;
- allow invite document lookup by known code while denying collection listing;
- preserve completed/archived league contributions permanently;
- validate recent category-shaped activity writes in Firestore Rules;
- align Platform Administrator UI controls with Rules authority;
- add accessible modal focus management and skip navigation;
- recover stale production chunks with a single guarded reload;
- verify version and branded Hosting target during release checks.

## Consequences

- More defects are prevented before manual review.
- Existing populated league documents require accurate participant count/limit fields before new Rules deploy.
- Friendly competition remains client-calculated and is still not prize-grade.
- The release advances to v0.12.0 but remains explicitly pre-v1.0.
