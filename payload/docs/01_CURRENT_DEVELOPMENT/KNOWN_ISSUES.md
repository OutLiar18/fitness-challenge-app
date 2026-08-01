# Champions Legacy Challenge — Known Issues

Last updated: 1 August 2026

## Open

### Full-history activity subscription

The signed-in application subscribes to the player’s complete entry history. This is acceptable at the current scale but requires windowing, historical aggregates and pagination before large production usage.

### Administrative query pagination

The Administration workspace currently listens to all users and suggestions and limits audit history to the latest one hundred events. Add explicit pagination before large-scale deployment.

### Approved suggestion publication

Suggestion review records an approved or rejected decision, but approved definitions are not yet copied into versioned global libraries. This remains the next administration feature.

### First administrator bootstrap

The first Platform Administrator must be assigned through the Firebase Console or a trusted Firebase Admin SDK process. This is intentional and documented in `ADMIN_BOOTSTRAP.md`.

### Firestore emulator tests

Domain tests cover pure rules and formatting logic, but automated security-rule tests still need the Firebase Emulator Suite.

### React Router audit advisory

The remaining advisory affects React Router Server Components mode. Champions Legacy Challenge does not use that mode. Do not apply a forced downgrade without reviewing routing consequences.

### Custom avatars

Custom image uploads remain intentionally unavailable. The built-in Legacy Avatar catalogue avoids storage cost, privacy concerns and media moderation requirements.

## Closed in v0.9.0

- Release-bundled announcements as the only announcement source.
- Browser-only announcement read state.
- Non-operational Administration page.
- Missing suggestion moderation workflow.
- Missing privileged role-management foundation.
- Missing immutable administrative audit history.
- Inconsistent player-facing measurement abbreviations.
