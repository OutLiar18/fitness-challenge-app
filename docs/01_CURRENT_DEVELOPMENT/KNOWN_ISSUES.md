# Champions Legacy — Known Issues

Last updated: 30 July 2026

This file contains active problems and release risks only. Future features belong in the Roadmap.

## Release blockers

### Manual Firebase QA is outstanding

The complete create/read/delete flow, personal library updates and suggestion writes must be tested against the intended Firebase development project after installing dependencies on the target computer.

### Firestore rules require deployment

`firestore.rules` is included but local source files do not protect a remote database until the rules are deployed.

### Automated coverage is intentionally limited

Six domain smoke tests protect the highest-risk scoring, statistics, validation and date behaviours. Component, repository and Firebase emulator tests are not yet configured.

## Active product limitations

### Suggestions cannot yet be moderated

Custom Exercise, Cardio and Skill suggestions are persisted with `pending` status, but no administrator review interface exists.

### Entries cannot be edited

A user can create and delete eligible entries. Editing a saved entry is intentionally deferred until audit and recalculation behaviour is designed.

### Historical access is basic

The journal supports daily navigation and a date picker, but not a month calendar, search or filters.

## Maintainability watchlist

### Exercise library size

The exercise configuration is intentionally centralised but large. It should eventually be split by category with a generated combined export, without changing its public service API.

### No pagination yet

The current real-time entry subscription loads all entries for a user. This is acceptable for early testing but should be replaced by paginated history queries before long-term production use.

## Recently resolved

- Running/Cardio point breakdown duplication.
- Missing cross-category Cardio statistics.
- Legacy Upper Body exercise scoring metadata.
- Custom exercise scoring.
- Duplicate exercise option service.
- Journal date timezone drift.
- Read-only history delete controls.
- Selector folder/import migration.
- Invalid nested interactive selector controls.
- Missing custom Cardio validation.
