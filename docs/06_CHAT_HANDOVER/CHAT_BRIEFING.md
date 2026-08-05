# Champions Legacy Challenge — Chat Briefing

<!-- RELEASE_STATUS: DEPLOYED -->
Current source: v0.21.0  
Current production: v0.21.0  
Status: Verified and deployed; release commit pending; pre-v1.0

## Product identity

The official name is **Champions Legacy Challenge**. It is a React + Vite + Firebase application hosted at `https://champions-legacy-challenge.web.app`.

## Working style

Kyle is learning React/Firebase. Give two or three practical steps at a time, use complete replacement files for substantial manual changes, keep documentation inside the main updater and never declare/tag v1.0 without explicit approval.

Release workflow:

1. apply one updater;
2. run release gates;
3. review output;
4. deploy;
5. run included finaliser;
6. commit.

Never run `npm audit fix --force` for the known React Router RSC-mode advisory.

## Current candidate — v0.21.0

Trusted Standings and Season Reconciliation:

- pure trusted season audit and deterministic fingerprint;
- standings and honours rebuilt from frozen rules, memberships and immutable contributions;
- evidence, correction and contribution integrity diagnostics;
- comparison with the latest published snapshot;
- free local Firebase Admin SDK dry run;
- explicit guarded trusted publication;
- immutable trusted snapshot, run and audit records;
- idempotence for an unchanged trusted fingerprint;
- trusted status and commands in the Season Command Centre;
- client read boundary for authorised operators and no client writes;
- no Cloud Functions, billing plan or automatic schedule.

A service-account JSON file is required only for real trusted operation and must remain outside the project.

## Verification target

Packaging:

- 104 domain tests pass;
- JavaScript syntax and local-import audits pass;
- credentials, reports, dependencies, builds and logs are excluded.

Windows gates still required:

- `npm install` and lockfile refresh;
- clean ESLint;
- 104 domain tests;
- successful Vite build;
- 46 Firestore Rules tests using Java 21;
- v0.21.0 release-readiness on Hosting target `app`;
- npm audit review without a forced breaking fix.

## Core product rules

- Points and Experience Points are separate.
- Consistency matters more than athletic ability.
- Running qualifies at at least 3 km and at most 11:00 per kilometre.
- Qualifying Running earns immediate Cardio and proof-dependent Running season points.
- Steps season points remain pending until proof.
- WhatsApp proof is external; the app stores no media.
- Teams are retired; Houses exist only inside a season.
- Historical House attribution never changes after roster movement or correction.
- Players see the latest published snapshot; authorised operators see live operations.
- The existing 10:00 fallback requires an administrator session; v0.21.0 does not replace it with scheduling.
- Undefined legacy twists remain inactive.

## Next action

Apply the v0.21.0 updater to the committed v0.20.0 source and run the Windows release gates. Do not run the production reconciliation command before release deployment and secure credential setup.
