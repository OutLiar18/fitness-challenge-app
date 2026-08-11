# Champions Legacy Challenge — v0.27 Competition Workspaces

Date: 11 August 2026
Checkpoint: 27E

## Purpose

27E restructures the presentation of Houses and Seasons without redesigning the
competition.

Every existing House/Season service and data contract remains authoritative:
C.H.A.O.S., leadership elections, captain appointments, weekly roster movement,
one-week post-move stability, immutable House assignment history, privacy-safe
balance snapshots, Power Plays, evidence operations, bonus contributions, standings,
honours and lifecycle transitions are unchanged.

## Task-focused navigation

### Houses
The selected season remains in `league`. The selected House now persists in `house`
and the active House workspace persists in `tab`.

This makes roster, leadership, history, balance, roster-turn and management views:
- directly linkable;
- refresh-safe;
- browser-navigation friendly;
- consistent with the v0.27 workspace model.

### Seasons
The top-level Browse / Join / Create workspace now persists in `workspace`.
The selected season remains in `league`, and the selected detail workspace remains
in `tab`.

The season-detail route no longer owns a second local tab state. The URL is the
single presentation-state source.

## Presentation decomposition

Two self-contained presentation sections are moved out of the oversized route files:
- House cards and House roster → `HouseRosterWorkspace.jsx`;
- individual/House standings rows → `SeasonStandingsTable.jsx`.

A new shared `CompetitionWorkspaceSummary` provides a concise role/context view for
both Houses and Seasons, with direct actions to the most relevant task workspaces.

No service calls or competition calculations move into these presentation components.

## Destructive and consequential actions

The remaining browser `window.confirm` / `window.prompt` flows in Houses and Seasons
are replaced with the shared accessible ConfirmDialog.

This covers:
- weekly roster swap;
- draft House deletion;
- one-time C.H.A.O.S. activation;
- season lifecycle transition;
- registration withdrawal;
- unused draft season deletion.

Permanent draft-season deletion still requires the user to type exactly `DELETE`.
ConfirmDialog now supports an optional typed confirmation phrase while retaining:
- alertdialog semantics;
- Escape handling;
- focus trap/restoration;
- safe Cancel-first focus;
- disabled controls during work.

## Responsive/readability pass

Competition cards, status labels, roster metadata, standings rows and operational
buttons receive the shared v0.27 readability/touch floor. Mobile action groups stack
instead of compressing destructive/administrative controls.

## Verification

- persistent 27E regression coverage;
- complete `npm run check` gate;
- canonical Firestore Rules SHA verification before and after;
- no Firebase deployment.
