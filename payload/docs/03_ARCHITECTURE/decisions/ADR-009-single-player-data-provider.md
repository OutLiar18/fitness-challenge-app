# ADR-009 — Single Player Data Provider per App Session

Status: Accepted
Date: 1 August 2026

## Context

Dashboard and Progress each called `useDashboardData`, creating separate profile reads and real-time entry subscriptions when routes evolved.

## Decision

`PlayerDataProvider` owns the player profile load and owner-scoped entry subscription for the protected application session. Route pages consume `usePlayerData`.

## Consequences

- Route changes do not create duplicate listeners.
- Pages share one consistent snapshot.
- Domain calculations remain page/service responsibilities.
- Future pagination can be introduced behind the provider/repository boundary.
