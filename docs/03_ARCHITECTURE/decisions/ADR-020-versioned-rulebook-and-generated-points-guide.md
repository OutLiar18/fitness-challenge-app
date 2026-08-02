# ADR-020 — Versioned Rulebook and Generated Points Guide

Status: Accepted  
Date: 2 August 2026

## Context

The original challenge rules and points guidance existed as external 2025 PDF documents. Manual copying would create three risks: obsolete manual processes appearing active, scoring tables drifting from the engine, and players facing an inaccessible wall of text.

## Decision

- Store rule content in a versioned configuration with stable identifiers, legacy source references and explicit current/season/inactive status.
- Render goals from the live goal configuration.
- Generate public point ranges from the live scoring constants and category calculation rules.
- Keep filtering and guide generation in domain services rather than React components.
- Expose both references as protected lazy routes in the shared navigation shell.
- Omit discovery-oriented progression rewards from the public repeatable-scoring guide.

## Consequences

### Positive

- Players can search and understand rules without reading a 14-page document.
- Unsupported legacy mechanics cannot be confused with live functionality.
- Point-table balancing automatically reaches the public guide.
- Historical source wording remains traceable.
- Routes remain lightweight and testable.

### Trade-offs

- Rules are still released with application code rather than authored in Firestore.
- Season options may require organiser processes not yet automated.
- Material rule changes require a new rulebook version and release review.

## Guardrails

- Runtime constants and services remain the scoring authority.
- A completed league retains its frozen ruleset.
- Inactive rules must explicitly say they award no points or are unsupported.
- New rule-management administration requires a separate ADR and Security Rules design.
