# Champions Legacy Challenge — Testing Guide

Last updated: 3 August 2026

## Domain suite

```powershell
npm test
```

v0.14.0 target: **61 passing tests**.

Coverage includes scoring, goals, progression, Rulebook/Points Guide, C.H.A.O.S. balance, House identity, election outcomes, roster identifiers, Pocket windows/redemption, historical House standings and season honours.

The Rules regression suite also verifies the live Coach preference path, denial of the retired Coach path, current-House Captain appointments and atomic Pocket redemption without exceeding Rules evaluation limits.

Rules fixtures must seed the same denormalised snapshots used by production documents. When a helper wraps document data as `{ id, data }`, membership fixtures must read House identity from `data`; a fixture that stores `Unassigned` while a contribution stores the real House name is intentionally rejected by the security model.

## Firestore Rules suite

```powershell
npm run test:rules
```

v0.14.0 target: **25 passing tests**.

Expected `PERMISSION_DENIED` logs are produced by deliberate forbidden-action tests. The final pass/fail count is authoritative.

## Full checks

```powershell
npm run check
npm run check:release
```

Java 21 is required for the Emulator Suite. Do not deploy Rules after a failed emulator run.
