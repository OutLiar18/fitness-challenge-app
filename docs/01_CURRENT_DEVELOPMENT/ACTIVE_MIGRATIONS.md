# Champions Legacy Challenge — Active Migrations

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 5 August 2026

## v0.21.0 trusted operations

Status: Implementation, Windows verification and production deployment complete; release commit pending

No bulk Firestore data migration is required.

New records appear only after a successful trusted publication:

- `seasonTrustedRuns/{runId}` — immutable operational summary readable by Platform and season administrators;
- trusted fields on a new `leagueLeaderboardSnapshots` record;
- one immutable `auditEvents` publication record.

The existing league document advances only its published-snapshot pointer, revision and standard audit metadata.

## Dependency installation

`firebase-admin` is a new development dependency used only by the local Node.js command. The first Windows `npm install` must refresh `package-lock.json` before release gates are considered authoritative.

## Credential setup

No credential is included in the updater. After deployment, the administrator performs the one-time setup in `docs/04_DEVELOPMENT/TRUSTED_SEASON_OPERATIONS.md`. The private JSON file stays outside the project.

## Compatibility

- Existing v1 and v2 season records remain readable.
- Existing manual and administrator-session fallback snapshots remain valid.
- Players continue to read the season's current published snapshot.
- No scoring, evidence, correction or House-assignment document is rewritten merely to support v0.21.0.
