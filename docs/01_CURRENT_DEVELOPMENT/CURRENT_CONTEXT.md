# Champions Legacy Challenge — Current Context

## Release position

v0.29.0 is verified production and release-finalised.

- Deployed/tagged source: `d34065b5352fff6c2e13941fcc2f566ce519c926`
- Live index SHA-256: `400b029c799d0c323c87589151b53556ec795e5de2ee3594864cc2420d91962d`
- Application gate: 302 / 302 PASS
- UI Quality: PASS
- Release Readiness: PASS
- Firestore Rules: unchanged; no Rules deployment

## Current focus — v0.30.0

Work continues on `development/v0.30.0`.

Primary objectives:

1. Investigate the poor mobile Lighthouse Performance and Best Practices scores reported after v0.29.
2. Make targeted, evidence-based performance / best-practices fixes without changing accepted gameplay as a side effect.
3. Complete any final owner-requested visual, responsive or code-hardening polish needed before a v1.0 decision.
4. Preserve Platform-Administrator-only evidence decisions, the one-week post-move stability rule, current scoring and the frozen Firestore Rules boundary unless a separate explicit change is approved.

## Scope boundary

Do not reopen v0.29 for Lighthouse work. Treat any new implementation from this point as v0.30 unless the owner explicitly changes the roadmap. External tester rounds and a full season rehearsal are not required gates before v1.0.
