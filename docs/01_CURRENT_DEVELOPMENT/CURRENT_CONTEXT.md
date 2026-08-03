# Current Context

Last updated: 3 August 2026

**v0.14.0 — Season Houses, C.H.A.O.S. and Pocket Week** is deployed to the branded Firebase Hosting site and remains before v1.0.

The central architecture decision is that Houses are not permanent global Teams. A House belongs to one season. Players register as individuals, C.H.A.O.S. creates the opening rosters, weekly leadership and roster changes operate inside that season, and contribution documents preserve the House represented at the time of earning.

Pocket Week is confirmed as one private seven-day pre-season reserve. It does not recur every challenge week. Deposits earn zero points; deliberate redemption during the Active season creates the scored entry and House contribution atomically.

The technical release gates and production smoke test pass. The full functional, responsive and accessibility review is intentionally deferred until the final pre-v1.0 stage.

The next small improvement is C.H.A.O.S. prerequisite visibility: activation remains Registration-only, but Draft administrators should not mistake the hidden console for a missing feature.

Unclear legacy mechanics are deliberately inactive. Never infer Power Play, Diamonds, player prices, Buddy Bonuses, Five Fires or late-season twists without explicit product decisions.
