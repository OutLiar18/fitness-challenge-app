# Champions Legacy Challenge — Service Architecture

Last updated: 1 August 2026  
Current release: v0.9.0

## Entries

- `entryRepository` owns Firestore entry reads and writes.
- `entryManager` orchestrates normalisation, validation, saving and suggestion creation.
- `normalizer` converts form input into factual entry data.

## Points and statistics

- Points services calculate explainable activity scores.
- Running eligibility is central and never removes Cardio credit.
- Statistics consume the same category and goal configuration.
- Player-facing measurement names are produced by `displayFormatters`, not recreated in components.

## Progression

- `goalBonusService`
- `streakService`
- `xpService`
- `achievementService`
- `personalRecordService`
- `timelineService`
- `progressionService` aggregate facade

Progression remains derived from entries and versioned configuration.

## Profiles

- `profileService` normalises and validates editable identity values.
- `userRepository` owns profile subscription and constrained update writes.
- Legacy Avatars are local application resources referenced by identifier.

## Announcements

- `announcementModel` owns pure normalisation, validation, sorting, merging and filtering.
- `announcementService` owns published Firestore subscriptions, bundled fallback merging and player read-state writes.
- `AnnouncementProvider` exposes one shared live announcement state to protected routes.

## Administration

- `announcementAdminService` owns announcement creation, editing, publishing, archiving and bundled-history import.
- `moderationService` owns suggestion subscriptions and audited review decisions.
- `userAdminService` owns audited trusted-role and team changes.
- `auditService` creates audit writes and subscribes to immutable history.
- `useAdminData` composes the live administration subscriptions.

Privileged services use Firestore batches so the business change and audit event commit together.

## Shared application data

`PlayerDataProvider` exposes:

- authenticated user and token claims;
- live profile;
- owner-scoped entries;
- derived progression summary;
- Platform Administrator status;
- loading and recoverable error state.

Contexts expose state and orchestration boundaries. They do not contain scoring formulas.

## Future service requirements

- A global-library publishing service for approved suggestions.
- Paginated administration repositories.
- Versioned challenge-configuration publishing.
- League- and team-scoped permission services.
- Browser-level error monitoring and telemetry with privacy controls.
