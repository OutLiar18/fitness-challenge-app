# Champions Legacy Challenge — Deployment Guide

Last updated: 1 August 2026

## Hosting choice

v0.11.0 is configured for Firebase Hosting because the application is a static Vite single-page application already using Firebase Authentication and Cloud Firestore.

The existing Netlify `_redirects` file may remain for compatibility, but Firebase Hosting is the documented pre-1.0 preview path.

## Prerequisites

- Firebase project access.
- Firebase CLI authentication.
- Java for the Firestore Emulator.
- Correct `.env` values.
- Passing release checks.

## Local verification

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

## Firestore Rules deployment

```powershell
npm run deploy:rules
```

Deploy rules before testing new library-publishing or error-reporting workflows.

## Preview channel

```powershell
npm run deploy:preview
```

The preview expires after seven days. Use it for user review, responsive testing and release-candidate defect discovery.

## Hosting production deployment

```powershell
npm run deploy:hosting
```

This deploys the built static application but not Firestore Rules.

## Combined deployment

```powershell
npm run deploy:production
```

This runs release verification, Security Rules tests and then deploys both Firestore Rules and Hosting. Do not run it until the current release candidate has been approved for that environment.

## Hosting behavior

- `dist` is the public directory.
- All routes rewrite to `index.html` for React Router.
- Fingerprinted static assets use long immutable caching.
- Security headers prevent MIME sniffing and framing and disable camera, microphone and geolocation permissions.

## Rollback

- Firebase Hosting release history can restore a previous Hosting version.
- Firestore Rules should be restored from Git and redeployed.
- Do not delete factual player entries during a frontend rollback.
- Global library items can be archived; historical entries retain embedded definitions.
