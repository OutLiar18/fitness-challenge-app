# Champions Legacy Challenge — v0.23.5 Stability Source Audit

Date: 7 August 2026  
Status: Candidate

## Baseline

v0.23.5 is derived from the verified/deployed v0.23.0 source, not from the mixed or v0.24 rescue trees.

## Intentionally preserved

- `season-houses-v3` and Power Play v1 behaviour.
- Existing v0.23 House roster movement.
- All v0.23 evidence, correction, reconciliation, account-deletion and administration behaviour.
- The exact v0.23 Firestore Rules and Rules tests.

## Intentionally absent

- `src/services/seasons/houseMovementModel.js`
- `src/services/seasons/houseMovementService.js`
- `tests/house-movement.test.mjs`
- `season-houses-v4`
- House composition profiles
- weekly House-balance public/private collections
- v0.24 roster rest-lock fields and Rules

## Baseline hashes

- `firestore.rules`: `260fc21d98dc39412c814eff97719621a01bbe691d4c8bf7d016280698b1efb4`
- `tests/firestore.rules.test.mjs`: `7af40d7560f5dc207ffe755bf7236a21ea8c8aff832463de456f4d42dcb1d079`

The release-readiness script verifies both hashes before deployment.
