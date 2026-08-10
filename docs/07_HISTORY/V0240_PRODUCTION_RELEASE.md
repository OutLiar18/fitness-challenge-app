# Champions Legacy Challenge — v0.24.0 Production Release Evidence

Date: 9 August 2026
Status: Verified production release
Firebase project: `fitnesschallengeapp-9e87f`
Hosting site: `champions-legacy-challenge`

## Release source

- Branch at deployment: `development/v0.24.0`.
- Exact deployed commit: `b5e7c083c0ba7730f21b8a92b30530f3ebb8374c`.
- Package version: `0.24.0`.
- Release tag: `v0.24.0` must point to the exact deployed commit above.
- The later documentation-only 9D finalisation commit is intentionally not the deployed-code tag target.

## Final automated gate

The final Windows release gate passed before both production activation stages:

- 131/131 domain tests;
- 79/79 Firestore Security Rules tests;
- zero failed/cancelled/skipped Rules tests;
- successful Vite production build;
- release-readiness verified Firebase project/Hosting mapping;
- final complete Rules suite contained zero `maximum of 1000 expressions` evaluator-limit messages.

Expected emulator `PERMISSION_DENIED` logs represented negative security assertions and were accepted only because every corresponding test passed.

## Checkpoint 9A — Firestore Rules production activation

Scope: Firestore Rules only. Hosting was not deployed.

Final frozen Rules:

- 3,501 lines;
- 160,395 bytes;
- SHA-256 `2ab1e569f4699e0018f3c5b7e5225a9fb42d65b835215fc9b8917ab21c701573`.

Firebase CLI 15.26.0 compiled, uploaded and released the Rules successfully.

Read-only remote verification then confirmed:

- active Release: `projects/fitnesschallengeapp-9e87f/releases/cloud.firestore`;
- active Ruleset: `projects/fitnesschallengeapp-9e87f/rulesets/45a2ef28-df8b-4751-bbd2-dfed2c45a109`;
- Release update time: `2026-08-09T14:44:51.133571Z`;
- remote Rules source: 3,501 lines / 160,395 bytes;
- remote SHA-256 exactly equals the frozen local SHA-256;
- runtime executable references the same active Ruleset.

The remote verifier used read-only GET requests only.

## Checkpoint 9B — Firebase Hosting production activation

Scope: Hosting target `app` only. Firestore Rules were not deployed.

The runner re-ran the complete release gate, validated the production `.env`, verified the built bundle referenced `fitnesschallengeapp-9e87f`, and deployed exactly once with Firebase CLI 15.26.0.

Hosting result:

- 66 files in `dist`;
- target `app`;
- site `champions-legacy-challenge`;
- live URL `https://champions-legacy-challenge.web.app`.

Read-only live verification confirmed:

- local `index.html` SHA-256: `32df0e0ee05ee5b61a31d51857fe4c0ed30fa99c583248438a37e692a0a51cdc`;
- remote `index.html` SHA-256: the same value;
- 17 referenced live assets matched local build bytes exactly;
- immutable cache policy passed;
- configured security headers passed;
- SPA fallback passed;
- brand title passed.

## Checkpoint 9C — production smoke validation

### 9C-1 read-only smoke

Passed manually:

- Dashboard;
- Activity Log;
- Houses / Seasons;
- Profile;
- sign-out and sign-in.

No visible production failure was observed.

### 9C-2 controlled write smoke

A profile display-name change was used instead of a challenge activity so no fake points, House contributions, evidence claims or immutable competition history would be created.

Passed manually:

1. temporary display-name change saved;
2. refresh confirmed persistence;
3. original display name restored;
4. second refresh confirmed restoration.

## Release conclusion

v0.24.0 is operational in production. The deployed frontend and active Firestore Rules are both tied to the verified v0.24.0 release baseline. Checkpoint 9D performs documentation/tag finalisation only and contains no Firebase deployment operation.
