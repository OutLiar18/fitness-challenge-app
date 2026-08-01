# ADR-011 — Local Legacy Avatars and Constrained Profile Updates

Status: Accepted
Date: 1 August 2026

## Context

Champions Legacy Challenge needs expressive player avatars without requiring user-uploaded media, Cloud Storage billing or an unsafe general profile-write permission.

## Decision

The application ships a curated Legacy Avatar catalogue as local React/CSS artwork. Firestore stores only the selected `avatarId` string.

Players may update only:

- `displayName`
- `avatarId`
- `profileUpdatedAt`

Firestore rules verify the exact changed fields, display-name length, approved avatar identifiers and timestamp type. Identity, email, role, team, join date and account ownership remain immutable from the client.

Announcement read status is initially stored per user in browser local storage. Announcement content continues through the replaceable announcement service boundary.

## Consequences

- No Firebase Storage bucket or external avatar service is required.
- Avatar rendering is fast, predictable and available offline with the application shell.
- Existing users receive the default avatar until they select another.
- Read status does not yet synchronise between devices.
- Custom photo uploads remain a future feature requiring explicit storage, moderation, privacy and cost decisions.
