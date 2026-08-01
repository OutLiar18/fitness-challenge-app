# Champions Legacy Challenge — Library System

Last updated: 1 August 2026

## Library layers

### Built-in global libraries

Source-controlled definitions for Fruit, Exercise, Cardio and Skill options. These provide a reliable baseline and ship with the application.

### Published global libraries

Firestore documents in `publishedLibraryItems` created through versioned Platform Administrator releases. Supported types are Exercise, Cardio and Skill.

### Personal library

Player-owned Reading items and usage history under `users/{userId}/library`.

### Suggestions

Player-proposed Exercise, Cardio and Skill definitions. Suggestions are factual review requests and are separate from published global content.

## Suggestion lifecycle

```text
pending → approved → published
        ↘ rejected
```

- Approval records moderation suitability.
- Publication requires a separate versioned library release.
- Rejection requires respectful feedback.
- Published items may later be archived.

## Versioned publication

A Platform Administrator selects up to eight approved unpublished suggestions, supplies a semantic version and release notes, and commits one audited Firestore batch containing:

- a `libraryReleases` document;
- one `publishedLibraryItems` document per item;
- publication metadata on each source suggestion;
- immutable audit events.

## Runtime consumption

`GlobalLibraryProvider` subscribes only to published items. Forms merge those items with the source-controlled baseline.

When a player selects a published item:

- the entry records `source: "published"`;
- the published definition is embedded in the factual entry;
- scoring and validation use the embedded definition;
- later archiving does not alter historical scoring.

## Name conflicts

Published content cannot silently override a built-in item with the same name. Conflicts must be resolved during moderation or through a future deliberate migration.
