# Champions Legacy Challenge — Error Monitoring

Last updated: 1 August 2026

## Purpose

Provide useful production failure evidence without adding a paid dependency or collecting unnecessary personal information during the pre-1.0 review period.

## Modes

Configure `VITE_ERROR_REPORTING_MODE`:

- `off`: no automatic console or Firestore reporting from the reporter.
- `console`: errors are logged locally only.
- `firestore`: errors are logged and sanitised reports are stored in `clientErrorReports` for authenticated players.

The default example configuration is `console`.

## Captured sources

- React error boundary.
- Global `window.error` events.
- Unhandled promise rejections.
- Explicit future calls to `reportClientError`.

## Stored fields

- Error name and truncated message.
- Truncated stack.
- Source and route.
- Application release version.
- Sanitised context summary.
- Browser user agent.
- Player identifier.
- Fingerprint, occurrence time and report time.
- Resolution status and administrator note.

## Privacy rules

Do not pass the following into error context:

- Passwords.
- Authentication tokens.
- Firebase configuration secrets.
- Full activity-form contents.
- Reflections or private journal text.
- Email bodies or private communication.

Reports are limited by Firestore Security Rules and visible only to Platform Administrators.

## Deduplication

The browser keeps a session-level fingerprint set. The same failure fingerprint is not repeatedly written during one page session.

## Administration

Platform Administrators can:

- Read paginated error reports.
- Filter open and resolved reports.
- Review technical stacks.
- Mark an open report resolved with a note.

Resolution and its note are linked to an immutable audit event.

## Limitations

This system is intentionally lightweight. It does not provide source-map symbolication, external alerts, session replay, performance tracing or automated issue grouping across releases.
