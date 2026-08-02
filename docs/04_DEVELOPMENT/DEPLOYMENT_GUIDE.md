# Champions Legacy Challenge — Deployment Guide

Last updated: 1 August 2026

## Hosting

The static Vite application is hosted on Firebase Hosting target `app`, mapped to:

`https://champions-legacy-challenge.web.app`

Firestore, Authentication and Hosting remain in project `fitnesschallengeapp-9e87f`.

## Prerequisites

- Firebase project access and CLI authentication.
- Java 21 for the Firestore Emulator.
- Correct local `.env` values.
- Accurate v0.12.0 league-capacity fields for any existing league documents.
- Passing release checks.

## Local verification

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

## Rules deployment

```powershell
npm run deploy:rules
```

Deploy Rules after completing the league-capacity migration check.

## Preview and live Hosting

```powershell
npm run deploy:preview
npm run deploy:hosting
```

Both commands target the branded `app` site. The preview expires after seven days; the Hosting command publishes only the frontend.

## Combined deployment

```powershell
npm run deploy:production
```

This verifies and then deploys Rules plus `hosting:app`. Do not use it until the release is approved for that environment.

## Hosting behaviour

- `dist` is the public directory.
- All application routes rewrite to `index.html`.
- Fingerprinted assets receive long immutable caching.
- Security headers prevent MIME sniffing and framing and disable camera, microphone and geolocation permissions.
- Production chunk-preload failures receive one guarded reload to recover an old open tab after deployment.

## Rollback

- Restore a previous Firebase Hosting release from Hosting history.
- Restore Firestore Rules from Git and redeploy them.
- Never remove factual player entries during a frontend rollback.
- Completed league contributions remain historical records even when a recent source entry is later deleted.
