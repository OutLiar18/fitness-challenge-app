# Champions Legacy Challenge — Service Architecture

Last updated: 1 August 2026
Current release: v0.7.0

## Core service layers

### Entries

- `entryRepository` owns Firestore reads/writes.
- `entryManager` orchestrates normalisation, validation, saving and suggestions.
- `normalizer` converts form input into factual entry data.

### Points

- Category and workout point services calculate explainable activity scores.
- Running eligibility is central and does not remove Cardio credit.

### Statistics and goals

- Date filters preserve local calendar semantics.
- Goal calculation consumes central goal configuration.
- Running contributes duration to Cardio without creating another entry.

### Progression

- `goalBonusService`
- `streakService`
- `xpService`
- `achievementService`
- `personalRecordService`
- `timelineService`
- `progressionService` as the aggregate facade

All progression remains derived from entries and versioned configuration.

### Announcements

`announcementService` currently returns release-bundled announcements. The page depends on this service boundary so a future Firestore repository can replace the source without changing presentation components.

## Shared data access

`PlayerDataProvider` invokes `useDashboardData` once for the protected app session. It exposes:

- authenticated user;
- profile;
- owner-scoped entries;
- loading state;
- recoverable error state.

This context is an application data boundary, not a place for business rules.

## Future service requirements

- Admin repositories must require server-trusted authorization.
- Announcement writes need validation and audit records.
- Historical entry pagination must preserve existing domain service inputs.
- Competitive snapshots must record ruleset versions and immutable results.
