# Champions Legacy Challenge — Architecture Overview

Current release target: v0.17.0  
Current production: v0.16.0

## Layers

```text
Configuration and factual Firestore documents
                    ↓
Pure domain services
(points, statistics, progression, seasons, analytics, account models, dates, validation)
                    ↓
Repositories and Firestore orchestration
                    ↓
Providers and hooks
                    ↓
Reusable components, guided overlays and route workspaces
```

Firestore stores factual activity, trusted roles, immutable audits, season snapshots and explicit account-request state. Points, goals, Experience Points, analytics and other presentation summaries remain derived.

## Current architectural decisions

- Navigation is configuration-driven through `constants/navigation.js`.
- Public announcements and private notifications meet only in the Inbox presentation layer; their data and permissions remain separate.
- Dense pages use the shared `WorkspaceTabs` progressive-disclosure pattern.
- New-player onboarding is a protected-app overlay driven by a versioned profile field, not a separate copy of the product.
- Help & Privacy is the single player-facing route for guidance, data explanations, export and account requests.
- Personal export is generated on demand from account-owned records and is never stored back into Firestore.
- Account deletion is a trusted request lifecycle. The browser does not pretend to perform complete Authentication and data removal.
- Historical House contribution snapshots remain immutable when rosters or account state change.

## Security and trust boundary

React controls presentation only. Firebase Authentication establishes identity and Firestore Rules enforce ownership, role, shape, atomic relationships and historical immutability. Administrator acknowledgement of an account request requires a matching immutable audit event.

The client does not run trusted bulk deletion or the complete Points Engine inside Security Rules. Prize-bearing competition and final account erasure require trusted server/Admin SDK operations.

## Scale guardrails

The current architecture supports controlled pre-v1.0 use. Before broad public or prize-bearing operation, add paginated history, measured bundle optimisation, server-authoritative contribution recalculation, a trusted account-deletion worker and operational recovery procedures rather than duplicating logic in UI code.
