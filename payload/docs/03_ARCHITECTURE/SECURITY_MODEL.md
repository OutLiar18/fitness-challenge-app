# Champions Legacy Challenge — Security Model

Last updated: 1 August 2026  
Current release: v0.9.0

## Security boundaries

Champions Legacy Challenge uses three complementary boundaries:

1. Firebase Authentication identifies the signed-in account.
2. Firestore Security Rules authorize every client read and write.
3. React route and navigation checks improve user experience but are never treated as the security boundary.

## Player ownership

- A player may read their own profile, entries, personal library and announcement read documents.
- Challenge entries are immutable after creation and may only be deleted by their owner.
- Profile editing is restricted to `displayName`, `avatarId` and `profileUpdatedAt`.
- Email, role, team, ownership and join date cannot be changed by the owning player.

## Platform Administrator authorization

`isPlatformAdmin()` accepts either:

- a trusted Firebase custom claim `admin == true`; or
- the authenticated user profile role `admin`.

The first administrator must be bootstrapped through the Firebase Console or Firebase Admin SDK. No ordinary client flow can promote the signed-in user.

## Privileged write pattern

Every privileged write uses a Firestore batch containing:

- the business-object change; and
- a new immutable document in `auditEvents`.

The changed document stores `lastAuditId`. Rules use `getAfter()` to verify that the matching audit event exists in the same atomic request and identifies:

- the authenticated actor;
- the entity type;
- the entity identifier;
- the current server request time.

## Announcements

Ordinary signed-in players may read only documents where `status == "published"`.

Platform Administrators may:

- create announcements;
- edit announcements;
- transition drafts or archived messages to published;
- archive published messages.

Announcements cannot be deleted by the client. Creation and update require matching audit events.

## Suggestion moderation

- Players may create only pending suggestions they own.
- Players may read their own suggestions.
- Platform Administrators may read all suggestions.
- Only a pending suggestion may transition to `approved` or `rejected`.
- Rejection requires a reason of at least four characters.
- Review metadata and an audit identifier are required.
- Reviewed suggestions cannot be reviewed again from the client.

## User administration

A Platform Administrator may update another user’s:

- `role`;
- `team`;
- administrative timestamp and actor fields;
- audit identifier.

The administrator may not use this client workflow on their own account. Profile ownership and account identity fields remain unchanged.

## Audit history

Audit events:

- are readable only by Platform Administrators;
- may be created only by Platform Administrators;
- must identify actor, action, entity and summary;
- cannot be updated or deleted by the client.

## Announcement read state

Each player owns:

```text
users/{userId}/announcementReads/{announcementId}
```

The document identifier and stored `announcementId` must match. The server controls `readAt`.

## Secrets

- Firebase web configuration remains in `.env` and is not an administrative secret.
- Service-account credentials and Firebase Admin SDK credentials must never enter the frontend repository.
- `.env` must remain ignored by Git.

## Remaining security work

- Add Firestore Emulator Suite rule tests.
- Add backend-supported operator bootstrap for production.
- Add scoped league permissions before activating League Administrators.
- Add rate limits or backend moderation controls if public scale requires them.
