# Champions Legacy Challenge — Service Architecture

Last updated: 4 August 2026  
Current release target: v0.22.0

## Pure domain services

- Points services calculate factual activity points.
- Season models validate lifecycle, Houses, standings and honours.
- Evidence model normalises frozen policy, creates claim identities/codes, allocates immediate versus pending points, validates deadlines/reviewer permissions and determines the 10:00 fallback.
- Workspace and account models remain UI-independent.

## Firestore orchestration

- `entryRepository` builds atomic entry, contribution and evidence-claim writes.
- `evidenceService` subscribes to owner/scoped queues, manages reviewer assignments, creates transactional decisions and publishes snapshots.
- `seasonService` enforces v2 Pocket restrictions.
- Notification and audit services create consistent immutable records.

## Provider boundaries

- User evidence claims are subscribed for the signed-in player and merged into Journal presentation.
- Assigned reviewer categories determine evidence queue subscriptions.
- Player standings subscribe to the latest published snapshot; live contribution subscriptions remain administrative.

## Rule

Pages render model/service output. They must not reimplement points, deadline, reviewer, snapshot or House-attribution logic.

## v0.19 season operations services

- `seasonOperationsModel.js` contains pure workload, leadership, publication, action-plan and report-shape derivation.
- `seasonOperationsService.js` contains Firestore subscriptions for immutable evidence decisions and leaderboard snapshot history plus local report download.
- `SeasonCommandCentre.jsx` orchestrates subscriptions and presentation but does not calculate points or mutate season state.

## Entry correction services

- `entryHistoryModel` resolves raw immutable entries into active and superseded versions, builds a date index and paginates recorded-day summaries.
- `entryCorrectionModel` validates replacement invariants, calculates net contribution groups and produces targeted diagnostics.
- `entryCorrectionService` loads one integrity bundle and executes the Platform Administrator transaction that creates replacement, correction, audit, contribution and claim records.

Personal providers expose both `rawEntries` and resolved active `entries`. All existing progression/analytics consumers continue to read `entries`, so they automatically ignore superseded versions.

## Trusted season services — v0.21.0

<!-- RELEASE_STATUS: DEPLOYED -->

- `trustedSeasonModel.js` — pure canonicalisation, fingerprinting, integrity inspection, standings/honours recalculation, snapshot comparison and run-status summaries.
- `trusted-season-reconcile.mjs` — local Admin SDK orchestration, interactive selection, report writing and guarded publication.
- `seasonOperationsService.js` — authorised client subscription to immutable trusted-run summaries.
- `seasonOperationsModel.js` — Command Centre actions and trusted status derived from the latest published run.

## Trusted account deletion services

- `accountModel.js` owns lifecycle constants, timing, deterministic aliases and request defaults.
- `trustedDeletionModel.js` is the pure audit/anonymisation model.
- `trusted-account-delete.mjs` is the elevated local orchestrator for Auth and Firestore.
- Client request services remain limited to request, cancel, reopen and acknowledge operations.
- The trusted processor is deliberately not imported into the browser bundle.
