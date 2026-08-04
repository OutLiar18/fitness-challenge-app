# Champions Legacy Challenge — Service Architecture

Last updated: 4 August 2026  
Current release target: v0.18.0

## Pure domain services

- Points services calculate factual activity points.
- Season models validate lifecycle, Houses, standings and honours.
- Evidence model normalises frozen policy, creates claim identities/codes, allocates immediate versus pending points, validates deadlines/reviewer permissions and determines the 10:00 fallback.
- Workspace and account models remain UI-independent.

## Firestore orchestration

- `entryRepository` builds atomic entry, contribution and evidence-claim writes.
- `evidenceService` subscribes to owner/scoped queues, manages reviewer assignments, creates transactional decisions and publishes snapshots.
- `seasonService` enforces v2 Pocket restrictions.
- Notification and audit services create consistent immutable records.

## Provider boundaries

- User evidence claims are subscribed for the signed-in player and merged into Journal presentation.
- Assigned reviewer categories determine evidence queue subscriptions.
- Player standings subscribe to the latest published snapshot; live contribution subscriptions remain administrative.

## Rule

Pages render model/service output. They must not reimplement points, deadline, reviewer, snapshot or House-attribution logic.
