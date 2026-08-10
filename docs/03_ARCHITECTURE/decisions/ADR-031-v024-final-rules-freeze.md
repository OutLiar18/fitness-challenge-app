# ADR-031 — v0.24 Final Rules Freeze

Status: Accepted for v0.24.0 Checkpoint 8L

## Context

Checkpoint 8K changes evaluation order so the complete Firestore Rules test suite can run without any `maximum of 1000 expressions` evaluator-limit message. Further Rules rewriting after that point would add release risk without a demonstrated authorization, evaluator or source-size need.

## Decision

Freeze the Checkpoint 8K Firestore Rules byte-for-byte for the remainder of the v0.24 release sequence.

Checkpoint 8L therefore makes no Firestore Rules authorization change. It strengthens the release gate instead:

- the frozen Rules SHA-256 and source metrics must match the evaluator-clean Checkpoint 8K candidate;
- all 79 Firestore Rules tests must pass;
- the complete Rules-suite emulator log must contain zero 1,000-expression evaluator-limit messages;
- representative maximum-scale House, balance, movement, lifecycle, Power Play, evidence, correction and trusted Platform-operation probes must pass without evaluator-limit messages;
- package version, Firebase production mapping, blocked deploy scripts and frozen critical source hashes must remain unchanged;
- no Firebase deployment command is executed by the checkpoint.

## Consequences

Checkpoint 8L is the final local hardening checkpoint in the v0.24 8-series. Passing it establishes the exact local release candidate for the later Rules-only production activation sequence. Any subsequent Rules edit invalidates this freeze and requires the full 8L gate to be rerun before production deployment.
