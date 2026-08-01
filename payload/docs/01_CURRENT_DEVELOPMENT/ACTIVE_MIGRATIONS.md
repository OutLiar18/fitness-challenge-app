# Champions Legacy Challenge — Active Migrations

Last updated: 1 August 2026

## Current status

No incomplete high-risk architecture migration is active.

## Controlled rollout

### Profile identity fields

Status: Implementation complete; Firestore rules deployment and live verification required.

Existing user profiles may not yet contain `avatarId` or `profileUpdatedAt`. The client safely falls back to the default avatar. The first successful profile save adds the new fields without rewriting protected account data.

### Announcement read status

Status: Complete as a browser-local preference.

Cross-device synchronisation is deferred until the notification and preference data model is designed.

## Migration closure rule

The v0.8 rollout is closed only when:

- updated Firestore rules compile and deploy;
- an existing profile can select and retain an avatar;
- role/email/team fields remain unchanged;
- announcement badges survive a browser refresh;
- lint, tests and production build pass;
- documentation is committed with the implementation.
