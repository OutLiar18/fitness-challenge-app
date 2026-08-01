# Champions Legacy Challenge — Known Issues

Last updated: 1 August 2026

## Open

### Full-history subscription

The signed-in application subscribes to the player’s complete entry history. This is acceptable for the current development scale but requires windowing and pagination before large datasets.

### Production bundle verification

Route-level lazy loading is implemented in v0.7.0. The production build must be run locally to confirm the final chunk distribution because the sandbox package mirror could not complete dependency installation.

### React Router audit advisory

The remaining advisory affects React Router RSC mode. Champions Legacy Challenge does not use RSC mode. Do not apply a forced downgrade without reviewing routing consequences.

### Admin and announcements are foundations

Announcements are currently release-bundled. Admin routes perform no privileged writes. Secure publishing requires server-trusted roles, Firestore enforcement and audit history.

## Closed in v0.7.0

- Dashboard overcrowding from logging and journal controls.
- Duplicate Firestore listeners across Dashboard and Progress routes.
- Missing shared responsive navigation.
- Missing dedicated Profile, Announcements and future-module structure.
- Missing chronological progression timeline.
- Unreachable legacy source files and temporary root delivery documents.


## v0.8 identity and announcements

- Announcement read state is local to the current browser and does not synchronise between devices.
- Custom avatar uploads are intentionally unavailable; only the approved local catalogue is supported.
- Existing users display the default avatar until they save a profile selection.
