# Champions Legacy Challenge — Roadmap

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 7 August 2026

## Current production — v0.22.0

Trusted account deletion and anonymised shared history are deployed.

## Current production — v0.23.0

### Themed Power Plays

- ten base category plays;
- theme-specific unique names;
- custom controlled 2×/3× multi-category plays;
- one official weekly selection;
- random selection without replacement;
- no reuse anywhere in the same season;
- activity-date scoring and proof-release compatibility;
- individual/House/honours/reconciliation integration;
- audited redraw and correction operations.

## Current stabilization candidate — v0.23.5

- preserve the deployed v0.23 Power Play and season-houses-v3 contract;
- keep the verified v0.23 Firestore Rules unchanged;
- remove/defer the unfinished v0.24 House Movement Rules expansion;
- deploy Rules first and Hosting second so an incompatible frontend cannot overtake production Rules.

## Remaining planned pre-v1.0 iterations

### v0.24.0 — Weekly roster stability and composition-balance foundation (deferred for Rules redesign)

- a player newly moved to a House cannot be moved again during the following weekly movement period;
- initial C.H.A.O.S. assignment does not count as a move;
- audited emergency correction path;
- minimum-data, self-declared composition foundation;
- transparent weekly House-level balancing design that does not reduce individual earned points.

### v0.25.0 — Five Fires and remaining competition design

- define and implement Five Fires after a dedicated rules decision;
- decide Buddy Bonuses;
- establish a safe late-season twist framework;
- verify interactions with Power Plays, roster movement and weekly House scoring.

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

- Diamonds, player prices and the transfer market remain rejected because they encouraged imbalance, commoditised strong players and risked treating lower performers as disposable.
- Original one-player-per-House immunity is replaced by the one-week post-move stability rule.

## Confirmed but not yet designed

- Five Fires is intended for implementation.
- Buddy Bonuses and late-season twists remain decisions for later.
- Weekly gender-composition balance is required, but its exact transparent House-level formula still needs to be locked.
