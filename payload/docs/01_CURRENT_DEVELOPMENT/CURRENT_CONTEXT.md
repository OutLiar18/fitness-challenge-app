# Champions Legacy Challenge — Current Context

## Current development phase

Profile and Announcements Foundation — v0.8.0

## Current priorities

- Verify secure profile editing and local Legacy Avatars.
- Deploy the updated Firestore profile rules.
- Verify announcement read state and navigation badges.
- Preserve the existing scoring and progression architecture.

## Architectural direction

- Store an approved `avatarId`, never image bytes or arbitrary URLs.
- Allow only narrowly defined profile identity changes from the client.
- Keep announcement content behind a replaceable service boundary.
- Treat read status as a convenience preference until cross-device notifications are designed.

## Following phase

After v0.8.0 verification, begin secure administration design: trusted roles, announcement publishing, suggestion moderation and immutable audit history.
