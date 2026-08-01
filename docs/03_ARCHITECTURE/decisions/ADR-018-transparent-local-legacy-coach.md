# ADR-018 — Transparent Local Legacy Coach

Date: 1 August 2026  
Status: Accepted

## Context

Players want useful guidance, but an opaque external model would introduce cost, privacy, unpredictability and potentially unsafe health claims before the product has established a clear coaching boundary.

## Decision

Implement Legacy Coach as deterministic local rules operating on the current and previous seven-day factual entry periods. Persist only owner-private enabled, tone and focus preferences. Every recommendation must expose its action, reason and evidence.

## Consequences

- No external API or subscription cost.
- Player data remains within the existing Firebase/client boundary.
- Recommendations are testable and explainable.
- Guidance is intentionally limited and non-diagnostic.
- Future intelligence may expand the rules but must preserve user control and evidence.
