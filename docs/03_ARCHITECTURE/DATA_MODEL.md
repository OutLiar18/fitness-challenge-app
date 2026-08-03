# Champions Legacy Challenge — Data Model

Last updated: 3 August 2026  
Current release target: v0.16.0

## Principle

Store factual activity, trusted decisions and immutable competitive snapshots. Derive presentation and progress.

## Core entities

- Player profile.
- Challenge entry.
- Personal/shared library definitions.
- Announcement/read record.
- Client error report.
- Immutable audit event.

## Season competition entities

- **League/season** — identity, theme, lifecycle, dates, House count, Pocket window, frozen rules, administrators and participant count.
- **League membership** — player identity, status and current House assignment.
- **House** — season identity, emblem, accent, Captain, Vice-Captains and last election.
- **Leadership election/vote** — weekly 24-hour ballot and one private vote per member.
- **Roster swap/lock** — one atomic balanced move and one weekly lock per participating House.
- **Pocket activity** — private zero-point reserve and remaining balance.
- **Pocket redemption** — immutable receipt linking reserve, target day and challenge entry.
- **League contribution** — immutable entry/category/date/point/rules/Historical-House snapshot.
- **Player notification** — private assignment, ballot, leadership, roster and Pocket event.

## Historical stability

- Published activity definitions are copied into entries.
- Season rules are frozen in the league document.
- Every contribution copies House identity at earning time.
- A roster move changes membership only; earlier contributions remain unchanged.
- Completed and archived competitive history cannot be deleted.
