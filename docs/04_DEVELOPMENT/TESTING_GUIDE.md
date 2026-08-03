# Champions Legacy Challenge — Testing Guide

Last updated: 3 August 2026

## Domain suite

```powershell
npm test
```

v0.16.0 target: **68 passing tests**.

Coverage includes scoring, goals, progression, navigation information architecture, Inbox helpers, Rulebook/Points Guide, season lifecycle, C.H.A.O.S. balance and readiness, House identity, elections, roster identifiers, Pocket redemption, standings, honours, Personal Analytics and the shared workspace selection/keyboard model.

The workspace tests verify safe active-section fallback, wrapped Arrow-key movement and Home/End behaviour without depending on browser rendering.

## Firestore Rules suite

```powershell
npm run test:rules
```

Target: **25 passing tests**. v0.16.0 does not change Rules. Expected `PERMISSION_DENIED` logs are deliberate forbidden-action tests; the final pass/fail count is authoritative.

## Full checks

```powershell
npm run check
npm run check:release
npm audit
```

Java 21 is required for the Emulator Suite. Do not deploy after any failed gate and do not use `npm audit fix --force`.

## Packaging-environment limitation

The Linux handover environment can run ESLint and domain tests using the uploaded Windows dependency tree, but it cannot execute Vite because Rolldown requires a platform-specific Linux native binding. The Windows build remains the release authority.
