# Champions Legacy Challenge — Component Architecture

Last updated: 4 August 2026  
Current release target: v0.20.0

## Protected application shell

Adaptive navigation, profile entry, Inbox, Help & Privacy and role-aware destinations remain shared through the protected shell.

## Route-level workspaces

Dense routes use `WorkspaceTabs` on desktop and a native section selector on mobile. Progress, Activity, Analytics, Profile, Coach, Points Guide, Seasons, Houses, Pocket Week and Administration expose only the selected workspace.

## Evidence components

- `EvidenceWorkspace` lives inside the Seasons route and is available only when the selected v2 season and current role allow it.
- The queue supports verification-code/player search, category/status filtering and status explanations.
- Decision controls are disabled for unassigned Season Administrators even when they may manage reviewer assignments or publish snapshots.
- Player-facing evidence status lives in `EntryCard` and the Journal rather than a second duplicate activity list.
- Copy controls expose only the verification ID, not private profile information.

## Administration

Account requests, moderation, shared libraries, errors and audit history remain in the Administration route. Season evidence operations remain season-scoped inside Seasons to preserve context.

## Accessibility

Evidence statuses use text and tone together, IDs are copyable with feedback, forms retain native controls, workspaces preserve keyboard behaviour and no function depends only on colour.

## Entry Integrity workspace

`EntryIntegrityWorkspace` is a Platform Administration tab. It reuses category-specific `EntryForm` components for factual fields, displays targeted diagnostics and immutable chain history, requires a correction reason and exports a portable integrity report. `EntryCard` exposes correction history to the player without offering edit controls.
