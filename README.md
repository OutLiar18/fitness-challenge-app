# Champions Legacy Challenge

Version: **0.10.0**  
Status: **Pre-1.0 release hardening**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase email-and-password authentication and protected routes.
- Ten configurable activity categories.
- Explainable activity points, Running/Cardio cross-contribution and effective repetitions.
- Daily and weekly goals with moderate completion bonuses.
- Streaks, an earned shield, experience points, levels, achievements and personal records.
- Responsive desktop, tablet and mobile navigation.
- Built-in Legacy Avatars and constrained profile editing.
- Live announcements with cross-device read status.
- Trusted, audited administration.
- Versioned publishing of approved community suggestions into shared global libraries.
- Optional first-party client error reporting.
- Automated domain tests and Firestore Emulator Security Rules tests.
- Firebase Hosting preview and production deployment configuration.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run dev
```

Add the real Firebase web configuration to `.env` before starting the app.

## Verification commands

```powershell
npm run check
npm run test:rules
npm run check:release
npm audit
```

- `npm run check` runs ESLint, the domain test suite and a production build.
- `npm run test:rules` starts the Firestore Emulator, runs Security Rules tests and shuts the emulator down.
- `npm run check:release` performs both checks and verifies release structure.
- Do not run `npm audit fix --force` without reviewing dependency consequences.

The Firestore Emulator requires Java. The release scripts invoke the Firebase CLI through `npx firebase-tools`, while `npm install` adds the Security Rules testing package.

## Deployment preparation

Create a seven-day preview channel:

```powershell
npm run deploy:preview
```

Deploy Firestore Rules only:

```powershell
npm run deploy:rules
```

After the release-candidate checklist has passed, deploy Hosting only:

```powershell
npm run deploy:hosting
```

The combined production command is intentionally explicit:

```powershell
npm run deploy:production
```

Do not use the production command until the user has reviewed v0.10.0 and approved the final v1.0 scope.

## Production error reporting

Set one of the following in `.env`:

```text
VITE_ERROR_REPORTING_MODE=off
VITE_ERROR_REPORTING_MODE=console
VITE_ERROR_REPORTING_MODE=firestore
```

`firestore` stores sanitised reports from authenticated players in `clientErrorReports`. Platform Administrators can review and resolve them from Administration. Full form values, passwords and Firebase credentials are never intentionally included.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`
- `docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md`

## Release boundary

v0.10.0 is **not** v1.0. It prepares the application for user review, defect correction, preview deployment and final release decisions.
