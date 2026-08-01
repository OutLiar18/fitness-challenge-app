# ADR-013 — Versioned Global Libraries

Status: Accepted  
Date: 1 August 2026

## Context

Players can suggest new Exercises, Cardio activities and Skills. Approval alone is insufficient for a shared platform library because published definitions affect future activity entry, scoring metadata and analytics.

## Decision

Separate moderation from publication.

1. A suggestion is created as `pending`.
2. A Platform Administrator approves or rejects it.
3. Approved suggestions remain unpublished until selected for a library release.
4. A release has a semantic version, notes and an immutable release document.
5. Published items live in `publishedLibraryItems` and appear in player selectors.
6. Entries using published items embed the published definition snapshot.
7. Archiving removes an item from future selection without altering historical entries.
8. Publication, item creation and suggestion publication each create audit events in the same Firestore batch.

A release is limited to eight items so Firestore Rules document-access limits remain safely below the batch maximum when audit validation is included.

## Consequences

### Benefits

- Approval and publication are deliberate separate responsibilities.
- Historical scoring does not change when a library item is later archived.
- Community content has traceable origin and version.
- Player forms receive new options without a frontend deployment.

### Costs

- Built-in source-controlled and Firestore-published libraries coexist.
- Platform Administrators must maintain release notes and versions.
- Conflicting names must be rejected rather than silently overriding built-in content.
