# ADR-022 — Consolidated Navigation, Inbox and Derived Analytics

Status: Accepted  
Date: 3 August 2026

## Context

As season features grew, the desktop sidebar became crowded. Profile appeared both as a route and as the clickable player identity. Announcements and private Notifications occupied separate destinations even though players understood both as incoming communication. The product also lacked a dedicated personal trend view.

## Decision

1. Group desktop navigation into Journey, Competition and Communications.
2. Keep Profile in the desktop player-identity panel and expose it in More on mobile; do not duplicate it in desktop primary navigation.
3. Present public announcements and owner-scoped notifications in one tabbed Inbox while retaining their separate providers, Firestore documents and Security Rules.
4. Place secondary reflection/reference tools in More and keep mobile to four direct tabs plus More.
5. Add personal Analytics as a pure derived service and route. It must reuse factual entries and the existing point breakdown, persist nothing and never affect Points or Experience Points.
6. Keep redirects for retired route names so old bookmarks and notification links continue to work.
7. Expose C.H.A.O.S. readiness through a pure season-domain helper and a visible prerequisite checklist.

## Consequences

- Navigation is calmer without hiding important workspaces.
- Communication has one discoverable entry point without weakening privacy.
- Analytics can evolve without creating a second scoring engine or migration.
- Old links remain safe while source names reflect current product language.
- C.H.A.O.S. no longer appears missing during Draft.

## Supersedes

This refines and supersedes the route organisation described by ADR-010 while preserving its adaptive desktop/tablet/mobile shell decision.
