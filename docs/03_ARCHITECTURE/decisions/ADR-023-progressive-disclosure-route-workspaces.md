# ADR-023 — Progressive Disclosure for Dense Route Workspaces

Status: Accepted  
Date: 3 August 2026

## Context

As tracking, progression, analytics and season operations matured, several pages displayed every section in one long stack. The information was correct but the visual hierarchy weakened: achievements, timeline, records, forms, standings and administrator controls competed for attention even when the player needed only one of them.

Page-specific accordions or unrelated local tab implementations would reduce density but create inconsistent interaction, keyboard behaviour and mobile handling.

## Decision

1. Introduce one shared `WorkspaceTabs` and `WorkspacePanel` pattern for dense route-level sections.
2. Keep page identity, key summaries and the most frequent decision visible before the section switcher.
3. Render one major workspace at a time. Choose a calm, useful default rather than opening the densest section.
4. Use an accessible tablist on desktop and a labelled native select on small screens.
5. Support Arrow keys, Home and End, visible focus and reduced motion.
6. Keep section metadata declarative and resolve dynamic role/phase availability through pure UI helpers.
7. Do not use tabs merely to decorate short pages. Dashboard, authentication and simple status pages remain direct; Rulebook retains disclosure controls and Inbox retains its specialised communications tabs.
8. Presentation reorganisation must not move domain calculations into components or change data/security contracts.

## Consequences

- Dense pages gain breathing room and clearer visual priority.
- Players see fewer competing actions without losing functionality.
- Mobile uses a robust native control instead of squeezed horizontal tabs.
- The same interaction and accessibility behaviour can be tested once and reused.
- Deep sections are no longer all visible on first load, so labels and descriptions must clearly communicate where content lives.
- Manual integrated visual/accessibility review remains required before v1.0.

## Relationship to earlier decisions

This extends ADR-010 and ADR-022. The application shell decides which route a player enters; ADR-023 decides how dense content within that route is progressively disclosed.
