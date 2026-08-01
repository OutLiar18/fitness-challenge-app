# Champions Legacy Challenge — Component Architecture

Last updated: 1 August 2026  
Current release: v0.10.0

## Layout

- `AppShell` — adaptive protected application frame.
- `PageHeader` — consistent page identity and actions.
- `PageLoader` — route and authentication loading state.

Desktop uses a labelled navigation rail, tablet uses an icon rail and mobile uses a status header plus bottom navigation.

## Route pages

- `Dashboard` — overview and next actions.
- `ActivityLog` — category selection, entry form and Journal orchestration.
- `Progress` — progression, timeline, records and achievements.
- `Announcements` — published announcements and cross-device read state.
- `Profile` — identity editing and account overview.
- `Admin` — trusted operational workspace.
- `FutureFeature` — structured preview for future modules.

Route pages may compose hooks and services. They must not contain scoring formulas or bypass service validation.

## Administration components

- `AdminOverview` — operational counts and status.
- `AnnouncementManager` — draft, publish, edit, archive and import workflows.
- `SuggestionModeration` — pending, approved and rejected review queues.
- `LibraryPublisher` — selection, versioned release, published item and archive workflows.
- `UserManagement` — paginated role and team administration for other users.
- `ErrorReports` — paginated sanitised client-failure review and resolution.
- `AuditLog` — paginated immutable privileged history.

## Presentation language

- Body text uses the professional body typeface.
- Page and section headings use the display typeface.
- Quotations and important reflective copy may use the accent serif typeface.
- Strong weight identifies actions and results.
- Italics identify deliberate reflective emphasis.
- Underlining is reserved for links and rare explicit emphasis.
- Components use `displayFormatters` for player-facing values.

## Rules

- No component queries Firestore directly.
- No component duplicates points, goals, streak or progression rules.
- Privileged controls may render only for trusted administrators, but Firestore rules remain authoritative.
- Empty, loading, error and success states must be clear and recoverable.
- Humour must remain optional, respectful and secondary to the task.
