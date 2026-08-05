# Source Audit — v0.22.0

Date: 5 August 2026  
Scope: Trusted account deletion and anonymised shared history

## Audited changes

- Account request schema version 2 with a seven-day policy and processing metadata.
- Player and administrator status UI for requested, acknowledged, processing, failed, completed and cancelled states.
- Pure deletion-audit model with deterministic aliases, eligibility checks, final-administrator protection and stable fingerprints.
- Local Firebase Admin SDK tool for list, dry audit and confirmed processing.
- Private-record deletion and shared-record anonymisation plan.
- Administrator-only execution and receipt collections.
- Trusted season reconciliation tolerance for intentionally removed private correction entries.
- Personal export schema version 3 and updated privacy wording.
- Firestore Rules and emulator tests for the expanded request lifecycle and trusted-only records.

## Safety conclusions

- No client role can write trusted execution or receipt records.
- Dry audit is the default.
- The tool refreshes data before irreversible processing.
- Credentials and local reports are excluded from the repository and release archives.
- Shared scoring values are preserved; identity only is anonymised.
- Fresh registration is not connected to old history.

## Packaging verification

The packaging environment verified 108 domain tests and JavaScript syntax/import structure. Windows remains authoritative for ESLint, Vite build, Firestore Emulator tests and release-readiness because the packaging registry cannot install the complete dependency tree.
