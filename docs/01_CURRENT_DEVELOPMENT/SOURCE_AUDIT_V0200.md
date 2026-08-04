# Source Audit — v0.20.0

Date: 4 August 2026  
Status: Packaging and Windows release verification complete; production deployed

## Baseline

The source was built from the committed and deployed v0.19.0 project archive supplied after release finalisation.

## Added source

- `src/services/entries/entryCorrectionModel.js`
- `src/services/entries/entryCorrectionService.js`
- `src/services/entries/entryHistoryModel.js`
- `src/components/admin/EntryIntegrityWorkspace.jsx`
- `src/components/admin/EntryIntegrityWorkspace.css`
- `tests/entry-corrections.test.mjs`
- canonical game-design document and ADR-027

## Modified systems

- challenge-entry creation/deletion metadata;
- active player-history provider;
- Journal recorded-day navigation;
- EntryCard correction visibility;
- Platform Administration navigation;
- evidence statuses and reviewer filtering;
- Season Command Centre evidence counts;
- personal JSON export schema;
- Firestore Security Rules and Rules tests;
- release scripts, announcements and documentation.

## Packaging checks

- 96 domain tests pass.
- All `.js` and `.mjs` files pass Node syntax checks.
- 210 JavaScript/JSX source modules have zero unresolved local imports.
- Zero source modules are unreferenced from the application graph.
- Bracket/brace/parenthesis balance checks pass for Firestore Rules.
- Updater and recovery source must contain byte-identical managed project files.

## Authoritative Windows release checks

- npm installation completed.
- ESLint passed.
- The Vite production build passed.
- All 44 Firestore Rules tests passed using Java 21.
- Release-readiness confirmed v0.20.0 and Hosting target `app`.
- npm audit was reviewed without a forced breaking fix.
