# Champions Legacy Challenge — Active Migrations

Last updated: 1 August 2026

## Current status

No incomplete source-code architecture migration is active.

## Controlled rollout

### Bundled announcements to Firestore

Status: Implementation complete; administrator import and live verification required.

Bundled announcements remain a fallback. A Platform Administrator can import them into the live `announcements` collection without duplicating existing identifiers.

### Announcement read status

Status: Migrates automatically.

Legacy browser-local read identifiers are copied to `users/{userId}/announcementReads` and then removed from local storage. Firestore becomes authoritative.

### Trusted administration

Status: Implementation complete; bootstrap and rules deployment required.

The first Platform Administrator must be assigned outside the client. Afterward, the in-app Administration workspace can manage other trusted roles while recording audit events.

## Migration closure rule

The v0.9 rollout is closed only when:

- all thirty-three tests, lint and production build pass;
- Firestore rules compile and deploy;
- the first Platform Administrator can open Administration;
- live announcements publish and archive correctly;
- cross-device read state is verified;
- moderation and role changes create immutable audit events;
- ordinary players cannot read drafts or privileged collections;
- documentation is committed with the implementation.
