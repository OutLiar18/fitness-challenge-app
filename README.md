# Champions Legacy Challenge

<!-- RELEASE_STATUS: DEPLOYED -->
Source version: **0.24.0**
Production version: **0.24.0**
Status: **v0.24.0 verified, deployed and production-smoke-tested; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central explainable Points Engine.
- Goals, streaks, shields, Experience Points, achievements, records, timeline and Personal Analytics.
- Trusted administration, immutable audit history, moderation, shared libraries and first-party error reporting.
- Season-scoped Houses with C.H.A.O.S., leadership, Pocket Week, historical House attribution and themed no-repeat Power Plays.
- External WhatsApp proof, immutable published standings, audited factual corrections, trusted season reconciliation and trusted account deletion.
- `season-houses-v4` House Movement with one-week post-move rest, immutable assignment history, audited Platform Administrator rest correction, optional private composition profiles and privacy-safe weekly House-balance snapshots.

## v0.24.0 — House Movement and Weekly Balance

v0.24.0 completes the controlled House Movement rebuild that was deliberately excluded from the v0.23.5 stability checkpoint.

Key additions:

- one-week post-move roster stability for v4 seasons;
- initial C.H.A.O.S. assignment remains exempt from the movement rest rule;
- immutable House-assignment history for C.H.A.O.S. and weekly movement;
- Platform Administrator-only rest override with a factual audit reason;
- same-week movement, House locks and leadership protection remain non-bypassable;
- optional private season-composition responses with least-privilege access;
- `house-balance-v1` weekly public/private snapshots with three-response suppression;
- House balance remains informational only and has no scoring effect;
- Firestore Rules were compacted and routed so the complete maximum-shape Rules suite is evaluator-clean.

## Production verification

Production URL:

`https://champions-legacy-challenge.web.app`

Release evidence:

- deployed source commit: `b5e7c083c0ba7730f21b8a92b30530f3ebb8374c`;
- 131 domain tests passed;
- 79 Firestore Security Rules tests passed;
- frozen Rules: 3,501 lines / 160,395 bytes;
- frozen Rules SHA-256: `2ab1e569f4699e0018f3c5b7e5225a9fb42d65b835215fc9b8917ab21c701573`;
- active Ruleset: `projects/fitnesschallengeapp-9e87f/rulesets/45a2ef28-df8b-4751-bbd2-dfed2c45a109`;
- Hosting deployed 66 files to target `app`;
- live `index.html` SHA-256 matched the local production build: `32df0e0ee05ee5b61a31d51857fe4c0ed30fa99c583248438a37e692a0a51cdc`;
- all 17 referenced live assets, SPA fallback and configured headers were verified;
- read-only and controlled profile-write production smoke checks passed.

Detailed release evidence is recorded in `docs/07_HISTORY/V0240_PRODUCTION_RELEASE.md`.

## Local setup and verification

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
```

Production deployment scripts inside the development repository remain intentionally blocked. Production activation is performed only through reviewed, scope-specific release runners.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`
- `docs/07_HISTORY/V0240_PRODUCTION_RELEASE.md`

## Release boundary

v0.24.0 is **not** v1.0. Five Fires, the Buddy Bonus decision, late-season twists, security/operational hardening, full-product polish and the complete season rehearsal remain future pre-v1.0 work. Do not create or tag v1.0 without explicit approval.
