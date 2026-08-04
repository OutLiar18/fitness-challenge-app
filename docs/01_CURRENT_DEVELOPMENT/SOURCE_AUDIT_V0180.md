# Source Audit — v0.18.0

Date: 4 August 2026

## Baseline

Reviewed the clean v0.17.0 source before adding the external WhatsApp evidence and published-standings phase. No `.env`, Git metadata, build output or Firebase cache is included in release archives.

## Implemented source

- evidence constants, pure model and Firestore service;
- season Evidence Operations workspace and styles;
- entry/Journal verification-ID presentation;
- evidence-aware contribution planning and standings;
- reviewer assignment, notifications and snapshot publication;
- v2 Rules validation and Pocket restrictions;
- domain and Firestore Rules coverage;
- canonical game-design, architecture, QA, release and handover documentation;
- in-repository and updater release finalisation scripts.

## Cleanup and reachability

The release audit completed with:

- unresolved local imports: **0**;
- JavaScript/JSX syntax errors: **0** through ESLint;
- unreferenced source modules: **0**;
- unreferenced stylesheets: **0**;
- forbidden updater nesting and retired permanent-Team modules;
- source/updater payload parity;
- archive exclusion of `.env`, `.git`, `node_modules`, `dist`, `.firebase` and logs.
- clean source payload: **365 project files** before archive wrapping.
- recovery source and updater payload: **365 byte-identical project files**.

## Verification state

- ESLint passes in the packaging environment.
- 80 of 80 domain tests pass in the packaging environment.
- Vite cannot be treated as authoritative in the packaging environment when the uploaded dependency tree contains Windows-only Rolldown native bindings.
- The Windows Vite build passed.
- The first Windows Rules run passed 37 of 39 tests and identified two expression-budget failures in valid atomic workflows.
- The candidate hotfix uses branch-directed validation, removes redundant claim-time policy revalidation and corrects the Running proof fixture.
- A clean 39-test Rules rerun and release-readiness remain authoritative and pending.

## Historical records retained

Accepted and superseded ADRs, changelog history and version history are retained intentionally. They are documentation records, not redundant runtime code.

## Release conclusion

The source is suitable for the v0.18.0 Windows release gates. It must not be deployed or committed as a completed release until those gates pass and the included finaliser records successful deployment.
