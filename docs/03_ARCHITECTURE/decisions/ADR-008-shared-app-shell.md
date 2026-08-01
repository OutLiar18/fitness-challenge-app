# ADR-008 — Shared Protected App Shell

Status: Accepted
Date: 1 August 2026

## Context

The v0.6 application repeated route headers and placed logging, journal and overview content on one Dashboard route. Navigation expansion would have increased duplication and screen overload.

## Decision

All protected routes render beneath `ProtectedApp`, `PlayerDataProvider` and `AppShell`.

The shell owns responsive navigation, route framing, sign-out access and application-level data errors. Route pages own only their feature orchestration.

## Consequences

- Navigation remains consistent across routes.
- Logging can move to a focused page without duplicating headers.
- Future pages can join the same structure.
- The shell must remain free of scoring and progression calculations.
