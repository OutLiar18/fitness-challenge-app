# Champions Legacy Challenge — Firestore Structure

Last updated: 1 August 2026  
Current release: v0.9.0

## Design principles

- Store factual activity data.
- Derive scores and progression through versioned services.
- Give every document a clear owner or trusted authority.
- Use immutable history for activities and privileged audit events.
- Keep administrative writes atomic with their audit records.

## Implemented collections

### `users/{userId}`

Stores profile and trusted account metadata:

- identity fields;
- approved `avatarId`;
- `role` and `team`;
- joined and profile-update timestamps;
- administrative update metadata when applicable.

Owners may edit only approved identity fields. Platform Administrators may read profiles and update another user’s role/team through the audited workflow.

### `users/{userId}/library/{itemId}`

Stores reusable player-owned resources such as books.

### `users/{userId}/announcementReads/{announcementId}`

Stores cross-device announcement read status:

```text
announcementId
readAt
```

### `challengeEntries/{entryId}`

Stores one factual activity entry:

```text
userId
category
data
createdAt
challengeDate
```

One Running activity remains one document even though it contributes to Running and Cardio calculations.

### `exerciseSuggestions/{suggestionId}`

Stores custom Exercise proposals and review metadata.

### `librarySuggestions/{suggestionId}`

Stores custom Cardio and Skill proposals and review metadata.

### `announcements/{announcementId}`

Stores live announcement content:

```text
title
summary
body
type
icon
status
featured
version
createdAt
createdBy
updatedAt
updatedBy
publishedAt
lastAuditId
```

Public player queries must filter to `status == "published"`.

### `auditEvents/{auditId}`

Stores immutable privileged-operation history:

```text
actorId
action
entityType
entityId
summary
details
createdAt
```

## Derived values

The following remain derived and are not stored as mutable player totals:

- activity points;
- goal and streak bonus points;
- experience points;
- levels;
- streaks and shield status;
- achievements;
- personal records;
- progress timeline.

## Future collections

Potential future structures include:

```text
globalLibraries/
challengeConfigurations/
leagues/
teams/
teamMembers/
seasonSnapshots/
notifications/
```

These collections must not be activated until ownership, versioning, audit and query requirements are documented.
