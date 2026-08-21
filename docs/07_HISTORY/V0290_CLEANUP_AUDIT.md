# v0.29.0 Cleanup and Visual Hardening Audit

Date: 21 August 2026

## Scope

Broad source cleanup and visual-polish pass performed from the verified v0.28 production baseline on the v0.29 development line. Gameplay, scoring, league authority and Firestore security contracts were intentionally preserved.

## Repository cleanup

Removed from the clean source package:

- generated `dist/`;
- `.firebase/` cache;
- local `.env`;
- Firebase / Firestore debug logs;
- embedded `.git` history from the distributable source archive;
- obsolete root stabilization note;
- obsolete v0.24 checkpoint matrix/script;
- unused historical release/security scripts;
- completed version-specific audit/checkpoint notes from `01_CURRENT_DEVELOPMENT`.

Proven unreachable source removed:

- `AvatarPicker` component and CSS;
- `MotivationCard` component and CSS;
- `StatsCard` component and CSS;
- `StatItem` component and CSS;
- unused `dashboardStats.js`.

## Test and tooling cleanup

- Replaced the v0.27-specific `accept:v027` hook with version-neutral `quality:ui`.
- Added automatic application-test discovery while keeping Firestore Rules tests isolated behind the emulator command.
- Modernized structural tests that were asserting old checkpoint comments or hard-coded colour literals instead of current behavior.
- Added v0.29 cleanup/polish regression coverage.
- Simplified release-readiness to current v0.29 invariants without forcing historical release-gate assumptions.

## Visual polish

Shared theme presentation now drives more of the visual hierarchy:

- accent-bright and accent-soft tokens;
- theme-aware heading accents;
- theme-aware text links;
- global section-kicker styling;
- richer page-header edge/ambient accents;
- themed sidebar depth;
- themed secondary background glow;
- theme-aware Daily Progress gradient;
- Legacy Coach ambient accent derived from the active palette.

The existing semantic success, warning and danger colours remain independent from MBTI theme identity.

Responsive cleanup includes consolidation of the duplicate Welcome Card 620px breakpoint and shared small-screen card/stack spacing improvements.

## Verification performed in the cleanup environment

- Application tests: **302 / 302 PASS**.
- Release-readiness: **PASS**.
- Node syntax checks: **204 files, 0 failures**.
- Missing relative imports: **0**.
- CSS brace-balance failures: **0**.
- Generated/local debris in cleaned tree: **0**.
- Firestore Rules canonical SHA-256: `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e` — unchanged.

A full Vite build and ESLint run still require installed npm dependencies (`npm ci`) on the development machine.
