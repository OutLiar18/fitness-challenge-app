# Champions Legacy Challenge — v0.26 Security Baseline

Date: 10 August 2026
Checkpoint: 26A
Production baseline: v0.25.0
Development branch: `development/v0.26.0`

## Purpose

26A records the security and operational posture before remediation. It is intentionally discovery-only: no Firestore Security Rules policy change, no Firebase App Check enforcement, no dependency auto-fix, no production deployment.

## Verified positive foundations

- Firestore Rules use `rules_version = '2'` and finish with a recursive deny-all fallback.
- Player profile reads are limited to the profile owner or a Platform Administrator.
- Client-owned profile updates cannot modify the trusted `role` field.
- Audit events are Platform-Administrator-readable, create-bound to scoped validation and client-immutable after creation.
- Challenge-entry reads are limited to the entry owner or Platform Administrator.
- League invitation enumeration is denied while direct signed-in lookup remains supported.
- Development production-deploy scripts remain intentionally blocked.
- Trusted account deletion uses the Admin SDK, requires private credentials, defaults to dry audit and requires the seven-day post-acknowledgement waiting period before irreversible processing.
- The existing production release has a separately verified Firestore Rules hash and dedicated deployment process.

## Findings requiring v0.26 review

### 1. Platform Administrator authority has two accepted sources

Current Rules accept Platform Administrator authority when either:
- the Firebase Authentication token has the custom `admin` claim; or
- the caller's Firestore user profile has `role == "admin"`.

This is not automatically a vulnerability: ordinary users cannot change their role, and administrator role changes are audit-bound. v0.26 should decide whether dual-source authority is intentional long-term architecture or whether one source should become canonical.

### 2. League-operator authority includes a global profile role

A Firestore user profile with `role == "leagueAdmin"` satisfies the global league-operator helper used by some league-creation paths. v0.26 should verify that global League Administrator status is intentional and that league-scoped authority is used everywhere else that should be scoped.

### 3. Firestore Rules complexity is high

The shipped v0.25 Rules file is several thousand lines and includes extensive cross-document validation with `get`, `exists`, `getAfter` and `existsAfter`. This is a strength for integrity but raises maintainability, access-call-limit and regression-risk concerns. Simplification must preserve behaviour and the emulator test contract.

### 4. App Check is not integrated in the current web bootstrap

The current Firebase bootstrap initializes Auth and Firestore but not Firebase App Check. App Check is a separate abuse-resistance layer; it does not replace Authentication or Security Rules. Any rollout must first support production web attestation and safe localhost/CI debugging, then monitor metrics before enforcement.

### 5. Hosting headers have useful baseline protections but no explicit CSP

Current Hosting configuration sets:
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

There is no explicit Content-Security-Policy header in `firebase.json`. v0.26 should inventory required Firebase/Auth/resource origins before adding a CSP so authentication or assets are not broken.

### 6. Trusted account deletion is resumable but multi-phase

The trusted account-deletion processor disables/revokes Auth, performs Firestore changes in batches and deletes the Auth user before writing the final completion receipt/audit. It records processing/failed state for recovery, but a process interruption can leave a partially completed operation. v0.26 should exercise dry-run/recovery cases and document exact operator recovery steps before changing this implementation.

### 7. Dependency state must be measured on the developer machine

The repository pins current dependency ranges through the lockfile, but advisory state changes over time. 26A captures both production-only and full-tree `npm audit` results plus `npm outdated` without using `npm audit fix`.

## Explicit non-actions in 26A

- no Firestore Rules policy change;
- no App Check registration or enforcement;
- no CSP deployment;
- no role migration;
- no dependency upgrades or `npm audit fix`;
- no trusted deletion execution;
- no Firebase deployment;
- no production data mutation.

## 26A exit criteria

- development branch/version established;
- static security baseline scanner passes;
- existing application gate passes;
- existing Firestore Rules emulator gate passes;
- dependency audit summaries captured outside the repository;
- repository contains only reviewed 26A version/docs/scanner changes;
- checkpoint committed and pushed to `development/v0.26.0`.

## 26B resolution — canonical Platform Administrator authority

26A identified two simultaneous Platform Administrator authority sources: Firebase Auth `admin:true` and Firestore `users/{uid}.role == "admin"`. The application also managed trusted roles by writing the Firestore profile, which meant the two sources could diverge.

26B resolves that ambiguity by making the trusted Firestore profile role canonical for Platform Administrator access across both Firestore Rules and client UI gating.

Security consequences:
- a claim-only session is not a Platform Administrator;
- the normal Rules administrator test context carries no admin custom claim, so existing privileged Rules tests prove profile-role authority directly;
- an audited profile demotion removes Platform Administrator authority even if the user's ID token still carries a stale `admin:true` custom claim;
- ordinary users still cannot change their own trusted role;
- Platform Administrators still cannot change their own trusted role through the client role-management path;
- role changes remain audit-bound.

Canonical local Firestore Rules SHA-256 after 26B: `4740edd168e495a70ac8a6252bb57c3986d30995b5372198c357adaa859f6b84`.

This is a local development Rules change only. Production v0.25.0 Rules remain unchanged until a dedicated v0.26 release activation.
