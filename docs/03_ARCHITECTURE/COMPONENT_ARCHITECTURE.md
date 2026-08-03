# Champions Legacy Challenge — Component Architecture

Last updated: 3 August 2026  
Current release: v0.14.0

## Season pages

- `Leagues.jsx` — season creation, registration, lifecycle, dual standings and honours.
- `Teams.jsx` — House forge, C.H.A.O.S., roster, weekly ballot, Vice-Captain appointment and roster swap.
- `PocketWeek.jsx` — zero-point deposit workflow and controlled redemption wallet.
- `Notifications.jsx` — private season event inbox.

## Shared support

- `LeagueProvider.jsx` — visible seasons and player membership subscriptions.
- `NotificationProvider.jsx` — notification subscription, unread count and read actions.
- `CategoryGrid` and `EntryForm` accept configuration so Pocket deposits reuse factual category forms without creating points.

## Removed

Permanent `TeamProvider`, Team context, Team hook, Team constants and Team services were removed in v0.14.0.
