# Champions Legacy Challenge — Service Architecture

Last updated: 3 August 2026  
Current release: v0.14.0

## Season domain

- `seasonModel.js` — invitation codes, House validation, deterministic C.H.A.O.S., week keys, election outcomes, swap identifiers and Pocket transformations.
- `seasonService.js` — House writes, C.H.A.O.S., ballots, leadership, swaps, Pocket deposits/redemptions and private notifications.
- `leagueModel.js` — season validation, permissions, individual/House standings and honours.
- `leagueService.js` — creation, registration, lifecycle, subscriptions and entry contexts.

## Notification domain

- `notificationModel.js` — types, ordering and unread selection.
- `notificationService.js` — owner-scoped real-time reads and read-state writes.

## Entry integration

The entry repository writes one factual challenge entry and an eligible contribution per Active season. The contribution snapshots the current House. Deletion removes only Active activity-source contributions; completed history and Pocket redemptions remain permanent.
