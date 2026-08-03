# ADR-021 — Season-scoped Houses, Historical Contributions and Pocket Week

Date: 3 August 2026  
Status: Accepted

## Context

The real challenge changes theme each season. Teams are temporary Houses inside that season, leadership changes weekly, players may move between Houses, and a seven-day pre-season Pocket allows factual activities to be stored for later use. Permanent global Teams could not represent these rules safely.

## Decision

- Retire permanent `teams`, `playerTeams` and `teamInvites`.
- Store current House assignment on each season membership.
- Copy House identity into every league contribution at earning time.
- Use seeded balanced C.H.A.O.S. for the opening roster.
- Use one private 24-hour leadership vote per House/week.
- Permit one balanced two-House roster swap per House/week.
- Store Pocket deposits as private zero-point reserves.
- Create Pocket redemption, challenge entry, House contribution and receipt atomically.
- Keep Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists inactive until confirmed.

## Consequences

- Historical House standings survive player movement accurately.
- The same player may have different House identities across seasons.
- Competition writes require more coordinated documents and Rules tests.
- Existing permanent-Team data cannot be converted automatically without season context.
- Ballot scheduling remains operator-triggered until a trusted scheduler exists.
