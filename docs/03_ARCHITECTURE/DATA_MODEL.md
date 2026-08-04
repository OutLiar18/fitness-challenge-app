# Champions Legacy Challenge — Data Model

Last updated: 4 August 2026  
Current release target: v0.18.0  
Current production: v0.17.0

## Principle

Store factual activity, trusted decisions and immutable competitive snapshots. Derive presentation, progress and live standings.

## Player and activity entities

- **Player profile** — identity, trusted role, avatar and onboarding state.
- **Challenge entry** — factual category data, challenge date and optional `evidenceClaimIds`.
- **Account deletion request** — requested, acknowledged or cancelled state.
- **Personal/shared library definitions**, announcement reads, Coach preferences and sanitised error reports.

## Season competition entities

- **League/season** — identity, lifecycle, dates, Houses, frozen ruleset/evidence policy and latest snapshot pointer.
- **League membership** — current House assignment and player presentation snapshot.
- **House**, leadership election/vote, roster swap/lock, Pocket activity/redemption.
- **League contribution** — immutable points and historical House attribution, optionally linked to evidence claim/decision.
- **Player notification** — private season, evidence and account communication.

## Evidence entities

- **Evidence claim** — source user, season, category, date, verification code, deadline, pending/bonus points, House snapshot and current status.
- **Evidence reviewer assignment** — one document per season/user with one or more assigned categories.
- **Evidence decision** — immutable accept, reject, late-accept or reversal record with actor, timestamp, quantity, reason and point delta.
- **Leaderboard snapshot** — immutable publication revision containing player/House standings and honours.

Water and Fruit use one daily claim per category. Running and Steps use one claim per entry.

## Historical stability

- Published activity definitions are copied into entries.
- Season rules and evidence policy are frozen.
- Claim and contribution documents copy House identity at activity time.
- Roster movement affects only future activity.
- Decisions and snapshots are appended, not edited.
- Evidence-linked entries are locked from ordinary deletion.
- Completed and archived competitive history cannot be deleted by the client.

## v0.19 derived season operations model

The Season Command Centre is a read model only. It combines existing league, House, membership, election, evidence, reviewer, contribution and snapshot documents in memory. No `seasonCommandCentres` collection exists. Downloaded reports serialize the currently visible records locally and are not persisted.
