# Champions Legacy Challenge — Data Model

Last updated: 4 August 2026  
Current release target: v0.17.0  
Current production: v0.16.0

## Principle

Store factual activity, trusted decisions, request state and immutable competitive snapshots. Derive presentation and progress.

## Player and account entities

- **Player profile** — identity, trusted role, local avatar and versioned onboarding state.
- **Challenge entry** — factual category data and selected challenge date.
- **Personal/shared library definitions** — reusable activity definitions and moderation history.
- **Announcement read record** — private per-player read state.
- **Coach preferences** — private optional recommendation settings.
- **Account deletion request** — one document per player with `requested`, `acknowledged` or `cancelled` status.
- **Client error report** — sanitised first-party diagnostic record.
- **Immutable audit event** — trusted administrative action history.

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

## Onboarding compatibility

New profiles store `onboardingVersion`, `onboardingCompletedAt` and `onboardingUpdatedAt`. Legacy profiles without these fields are treated as already onboarded so no bulk migration or forced interruption is required. Replaying the guide adds the fields through a constrained owner update.

## Personal export

The export is a generated JSON representation, not a Firestore entity. Firestore timestamps are serialised to ISO strings. Any section that cannot be read is listed in export metadata instead of being silently omitted.

## Historical stability

- Published activity definitions are copied into entries.
- Season rules are frozen in the league document.
- Every contribution copies House identity at earning time.
- A roster move changes membership only; earlier contributions remain unchanged.
- Account-request state does not rewrite entries or shared competition history.
- Completed and archived competitive history cannot be deleted by the client.
