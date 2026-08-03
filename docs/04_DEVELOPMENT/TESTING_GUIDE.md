# Champions Legacy Challenge — Testing Guide

Last updated: 3 August 2026

## Domain suite

```powershell
npm test
```

v0.15.0 target: **66 passing tests**.

Coverage includes scoring, goals, progression, navigation information architecture, Inbox-related announcement helpers, Rulebook/Points Guide, season lifecycle, C.H.A.O.S. balance and readiness, House identity, elections, roster identifiers, Pocket redemption, standings, honours and personal Analytics.

Analytics tests verify local-date weekly grouping, Running/Cardio cross-category breakdowns, the fixed 28-day consistency window and safe range fallback.

## Firestore Rules suite

```powershell
npm run test:rules
```

Target: **25 passing tests**. Expected `PERMISSION_DENIED` logs are deliberate forbidden-action tests; the final pass/fail count is authoritative.

## Full checks

```powershell
npm run check
npm run check:release
```

Java 21 is required for the Emulator Suite. Do not deploy after any failed gate and do not use `npm audit fix --force`.
