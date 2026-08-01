# ADR-017 — Immutable Consistency-Weighted Leagues

Date: 1 August 2026  
Status: Accepted

## Context

Seasonal competition must reward consistency, avoid duplicate activity logging and prevent historical standings from changing when personal scoring rules evolve.

## Decision

Each league freezes `consistency-v1` and `points-v2` at creation. During an active season, an activity entry and its league contribution snapshot are created in one batch. Standings cap each player’s raw daily contribution at 20 points and add a five-point participation bonus for an active day.

League lifecycle moves forward only: Draft, Registration, Active, Completed, Archived. Creation and transitions require immutable audit events.

## Consequences

- One factual activity updates personal and league experiences.
- Seasonal standings remain stable under future rules changes.
- Daily caps limit one-day domination and participation rewards showing up.
- The browser still calculates entry activity points; a trusted backend is required before prize-bearing competition.
