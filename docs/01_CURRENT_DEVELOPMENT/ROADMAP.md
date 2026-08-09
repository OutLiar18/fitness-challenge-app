# Champions Legacy Challenge — Roadmap

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 9 August 2026

## Current production — v0.24.0

### House Movement and weekly balance

- `season-houses-v4` is live for newly created seasons;
- one-week post-move roster stability is persisted and enforced;
- initial C.H.A.O.S. assignment does not count as a move;
- immutable House-assignment history preserves movement facts;
- Platform Administrator-only rest correction requires a factual audit reason;
- same-week movement, House weekly locks and leadership protection remain non-bypassable;
- optional private season-composition responses support balancing without exposing individual responses;
- `house-balance-v1` publishes privacy-safe weekly summaries with three-response suppression;
- exact composition counts remain administrator-only;
- weekly balance remains informational only and cannot alter points or standings;
- themed no-repeat Power Plays remain integrated with v4 seasons;
- evaluator-aware Rules routing keeps the final 79-test Rules suite below the 1,000-expression ceiling.

Production activation and smoke validation completed on 9 August 2026. Detailed evidence is in `docs/07_HISTORY/V0240_PRODUCTION_RELEASE.md`.

## Remaining planned pre-v1.0 iterations

### v0.25.0 — Five Fires and remaining competition design

- define and implement Five Fires after a dedicated rules decision;
- decide Buddy Bonuses;
- establish a safe late-season twist framework;
- verify interactions with Power Plays, roster movement, evidence, standings and weekly House balance.

This may split into two releases if the final Five Fires design is substantial.

### v0.26.0 — Security and operational hardening

- administrator permission review;
- public/private read audit;
- dependency and Rules-warning review without breaking automatic fixes;
- trusted-tool recovery, backup and operational checks.

### v0.27.0 — Full application review and polish

- every page and workflow;
- mobile, tablet and desktop;
- keyboard, screen reader and focus management;
- dark mode, visual consistency, loading/empty/error states and performance.

### v0.28.0 — Complete season rehearsal

- registration, C.H.A.O.S., Houses and leadership;
- Pocket Week, evidence, corrections and roster changes;
- Power Plays and weekly balancing;
- trusted reconciliation, publication, honours and account deletion;
- recovery runbook and final release checklist.

Only after this may the project become a v1.0 candidate, and only with explicit approval.

## Confirmed inactive/rejected mechanics

- Diamonds, player prices and the old transfer-market model remain rejected because they encouraged imbalance, commoditised strong players and risked treating lower performers as disposable.
- Original one-player-per-House immunity is replaced by the one-week post-move stability rule.

## Confirmed but not yet designed

- Five Fires is intended for implementation.
- Buddy Bonuses and late-season twists remain decisions for later.
- Weekly composition balance is locked as `house-balance-v1`: total-variation distance against the season disclosed distribution, with three-response suppression and no scoring effect.
