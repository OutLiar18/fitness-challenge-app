# ADR-015 — First-Party Error Monitoring and Firebase Hosting

Status: Accepted for pre-1.0 review  
Date: 1 August 2026

## Context

The application needs production failure evidence and a repeatable preview-deployment path without prematurely adding paid services or declaring v1.0.

## Decision

### Error monitoring

Use an environment-controlled first-party reporter:

- `off`, `console` or `firestore` mode.
- Firestore writes only for authenticated players.
- Reports are sanitised, truncated and deduplicated per browser session.
- Platform Administrators review and resolve reports.
- Resolution creates an audit event.

### Hosting

Use Firebase Hosting as the documented preview path for the static Vite single-page application.

- Host `dist`.
- Rewrite all routes to `index.html`.
- Apply immutable caching to fingerprinted assets.
- Apply basic security response headers.
- Use expiring preview channels before an approved deployment.

## Consequences

- No additional paid monitoring provider is required for the release-candidate phase.
- The first-party reporter does not provide advanced symbolication or alerting.
- Firebase Hosting and Firestore remain under one project and CLI workflow.
- Netlify compatibility may remain but is not the primary documented release path.
