# Champions Legacy Challenge — Firestore Structure

Last updated: 1 August 2026

## Collections

### `users/{userId}`

Profile identity, display name, avatar, trusted role and team assignment.

Subcollections:

- `library/{itemId}` — personal Reading library.
- `announcementReads/{announcementId}` — cross-device read state.

### `challengeEntries/{entryId}`

Owner-scoped factual activity entries. Derived score, goals and progression are not permanently stored.

### `announcements/{announcementId}`

Draft, published and archived live announcements.

### `exerciseSuggestions/{suggestionId}`

Exercise proposals with moderation and publication metadata.

### `librarySuggestions/{suggestionId}`

Cardio and Skill proposals with moderation and publication metadata.

### `publishedLibraryItems/{itemId}`

Versioned shared Exercise, Cardio or Skill definitions.

Important fields:

- `itemType`
- `name` and `normalizedName`
- `definition`
- `status`
- `libraryVersion`
- source suggestion and collection
- release identifier
- publication and archive timestamps
- audit identifier

### `libraryReleases/{releaseId}`

Immutable release records containing version, notes, item identifiers, item count, publisher and publication time.

### `clientErrorReports/{reportId}`

Sanitised authenticated-client failures with open/resolved status and administrator resolution metadata.

### `auditEvents/{auditId}`

Immutable privileged-change history.

## Data principles

- Store facts and trusted administrative decisions.
- Derive score and progression.
- Embed published activity definitions in entries for historical stability.
- Archive rather than delete published platform history.
- Paginate administrative collections that can grow without bound.
