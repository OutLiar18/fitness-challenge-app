# v0.15.0 Source and Documentation Audit

Date: 3 August 2026

## Scope inspected

- Entire React source tree, route map, providers, hooks, services, configuration and tests.
- Firebase configuration, Firestore Rules, scripts and package metadata.
- Current-development, game-design, architecture, development, design, handover and history documentation.
- Static local import graph for source and stylesheet references.

## Removed or replaced

- Legacy route-level `Teams.jsx`/`Teams.css` names → `Houses.jsx`/`Houses.css`.
- Legacy route-level `Leagues.jsx`/`Leagues.css` names → `Seasons.jsx`/`Seasons.css`.
- Separate Announcements and Notifications route pages → one `Inbox.jsx`/`Inbox.css` presentation surface.
- Duplicate desktop Profile navigation item; the desktop player identity remains the Profile entry.
- Stale Netlify `public/_redirects`; Firebase Hosting is authoritative.
- Uploaded runtime/build artefacts from the clean handover: `node_modules`, `dist`, `.firebase`, debug logs and local environment secrets.

## Retained intentionally

- Announcement and Notification providers, models and services remain separate because public and private messages have different ownership and Security Rules.
- Internal `league` service/collection terminology remains where it represents the established data model; changing it would create unnecessary migration risk.
- Accepted and superseded ADRs remain as permanent historical reasoning.
- Existing Points, statistics, progression, entry, admin and season services remain because the import audit found active callers and no duplicate replacement.
- Legacy route redirects remain intentionally for bookmarks and stored notification links.

## Added

- Configuration-driven grouped navigation and focused mobile destinations.
- Unified Inbox route.
- Pure derived Personal Analytics service and route.
- Pure C.H.A.O.S. readiness helper and visible prerequisite checklist.
- Regression tests for navigation, analytics and C.H.A.O.S. readiness.
- ADR-022 and synchronised current/handover/release documentation.

## Static audit result

- Unresolved local imports: 0.
- Unreferenced source modules detected: 0.
- Unreferenced source stylesheets detected: 0.
- Domain tests in packaging environment: 66 passed.
- ESLint through the installed module: passed.

The Linux packaging environment could not install its native Vite/Rolldown dependency from the internal registry. The authoritative Windows release run subsequently completed successfully.

## Authoritative Windows verification

- `npm install`: passed.
- ESLint: passed without warnings.
- Domain suite: 66 of 66 passed.
- Vite production build: passed.
- Firestore Rules suite: 25 of 25 passed.
- Release-readiness: confirmed v0.15.0 and Hosting target `app`.
- `npm audit`: two high-severity React Router RSC advisories reviewed; no forced breaking fix applied.

## Deployment

- v0.15.0 frontend deployed successfully to `https://champions-legacy-challenge.web.app`.
- 58 Hosting files were released.
- Firestore Rules and collection shapes did not change in v0.15.0.
- Full manual integrated review remains deferred until the final pre-v1.0 stage by product-owner decision.
