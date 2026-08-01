# ADR-010 — Adaptive Navigation Shell

Status: Accepted
Date: 1 August 2026

## Context

The first v0.7 shell used one collapsible desktop sidebar, a mobile drawer and a floating bottom bar. The structure worked, but it asked users to manage navigation state and did not use the available space consistently across desktop, tablet and mobile devices.

Champions Legacy Challenge needs many present and future routes without allowing navigation to overwhelm the activity and progression workflows.

## Decision

The protected application uses three intentionally different navigation structures:

- Desktop uses a persistent labelled left rail.
- Tablet uses a persistent icon-only rail with accessible labels and tooltips.
- Mobile uses a compact status header and an edge-to-edge bottom tab bar.

Secondary, administrative and future modules live behind one More menu. The More menu is a desktop popover and a mobile bottom sheet.

The shell may display progression values, but those values must be calculated once by `PlayerDataProvider`; the shell must not implement or duplicate progression rules.

## Consequences

- Core routes remain one tap or click away at every supported width.
- Mobile does not depend on a hidden drawer for routine navigation.
- Future routes can be added without continually expanding the mobile tab bar.
- Desktop navigation remains visible and predictable without a collapse preference.
- Responsive behaviour is implemented primarily with CSS breakpoints rather than JavaScript viewport state.
- The full product name, Champions Legacy Challenge, is the official application brand.
