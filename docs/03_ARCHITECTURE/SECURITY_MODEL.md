# Champions Legacy Challenge — Security Model

Last updated: 1 August 2026

## Principles

- Firebase Authentication establishes identity.
- Firestore Security Rules enforce authorization and data shape.
- React visibility is not security.
- Ordinary players cannot grant themselves trusted roles.
- Privileged writes are audited in the same batch.
- Factual activity entries remain owner-scoped and immutable after creation.

## Trusted administration

Platform Administrator access may come from:

- a trusted Firebase custom claim; or
- a user profile role assigned through a trusted bootstrap or administrator process.

The client cannot self-promote. Administrators cannot change their own trusted role through the application.

## Versioned library security

- Players read only `published` global items and releases.
- Platform Administrators can read all publication states.
- Publishing requires an approved suggestion, a release and linked audit records.
- Archiving is the only supported published-item update.
- Published items cannot be deleted from the client.
- Releases are immutable.

## Error-report security

- Only authenticated players can create reports.
- The report `userId` must match `request.auth.uid`.
- Field lengths and status are constrained.
- Ordinary players cannot read the reports collection.
- Platform Administrators can read reports and resolve open reports with an audit event.
- Reports cannot be deleted from the client.

## Announcement security

- Ordinary players read published announcements only.
- Draft and archived announcements are administrator-only.
- Announcement writes require a linked audit event.

## Security testing

The Firestore Emulator and `@firebase/rules-unit-testing` verify high-risk access paths. Rule changes require emulator tests before deployment.
