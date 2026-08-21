# Champions Legacy Challenge

Champions Legacy Challenge is a gamified personal-development and fitness tracker built with React, Vite and Firebase. It rewards consistent factual progress across fitness, movement, reading, nutrition and skill development while supporting season-based individual and House competition.

## Current status

- Development line: **v0.30.0**
- Production: **v0.29.0**
- Production URL: `https://champions-legacy-challenge.web.app`
- v0.29 deployed/tagged source: `d34065b5352fff6c2e13941fcc2f566ce519c926`
- Firestore Rules canonical SHA-256: `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`

The current v0.30 line is the final mobile-quality and release-hardening pass before a v1.0 decision, focused on Lighthouse Performance / Best Practices plus any owner-requested polish or fixes.

## Core product

- Daily and weekly goals with factual activity logging.
- Progression, XP, achievements, streaks, records and timeline history.
- Season-scoped individual and House competition.
- Captain / vice-captain House management and audited roster movement.
- Platform-Administrator-only evidence decisions.
- Rulebook and Points Guide driven from application configuration.
- Optional Legacy Coach guidance based on the player’s own activity.
- MBTI Legacy Profiles with 16 mythic identities and global theme palettes.
- Responsive desktop, tablet and mobile application shell.
- Light/dark presentation with theme-aware colour accents and accessible semantic status colours.

## Local development

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run lint
npm test
npm run build
npm run quality:ui
npm run check
```

`npm run check` runs lint, the automated test suite, a production build and the version-neutral UI quality check. Firestore Rules tests remain a separate emulator-backed command because they require Firebase tooling.

## Safety boundaries

- Do not deploy Firestore Rules casually; treat Rules changes as isolated security work.
- Do not use force pushes as routine release workflow.
- Keep Admin SDK credentials, `.env` files, Firebase caches, generated build output and debug logs outside source archives.
- Evidence approval/rejection authority belongs to Platform Administrators only.
- Existing scoring and season rules should not change as a side effect of visual or maintenance work.

## Documentation

Start with:

1. `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
2. `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
3. `docs/01_CURRENT_DEVELOPMENT/CURRENT_CONTEXT.md`
4. `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`
5. The relevant game-design or architecture document for the task.

Historical release evidence lives in `docs/07_HISTORY/`.
