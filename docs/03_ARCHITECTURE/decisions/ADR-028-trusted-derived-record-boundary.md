# ADR-028 — Trusted Derived-Record Boundary

**Status:** Accepted for v0.24 Checkpoint 8I  
**Date:** 9 August 2026

## Context

The v0.24 Ruleset still repeated source validation across records that are outputs of an already-authorised atomic workflow. Evidence decisions, correction transactions and leaderboard publication each produced secondary contribution, notification or snapshot records. Re-validating every copied field increased Rules source size, document reads and evaluator pressure without changing who was authorised to initiate the operation.

## Decision

Treat three record families as trusted derived records while preserving hard security boundaries:

1. **Evidence and correction contributions** remain immutable and must link to the authoritative evidence decision or correction, actor and bounded point delta. Player-originated activity contributions keep their existing strict entry/membership/season validation.
2. **Evidence notifications** remain bound to the claim owner, league and House. Deadline notices remain owner-created; evidence-decision notices remain Platform-Administrator-only.
3. **Leaderboard snapshots** remain immutable, audited and atomically linked to the league's latest-publication pointer. League Administrators retain publication authority.

Correction-created evidence claims may rely on the already-validated immutable correction record for source/replacement identity instead of re-reading the replacement entry a second time.

## Guardrails

- No ordinary player gains a new write path.
- Platform Administrator evidence authority is unchanged.
- League Administrator evidence decisions remain denied.
- Player activity contribution validation is unchanged.
- Evidence/correction contributions cannot detach from their authoritative record.
- Evidence notifications cannot target a different claim owner.
- A leaderboard snapshot cannot be created as a detached member-visible publication.
- Derived records remain immutable after creation.

## Consequence

The Ruleset becomes smaller and requires fewer repeated document reads on trusted output paths while preserving the competition-integrity boundaries that matter to untrusted clients.
