# Champions Legacy Challenge — Active Migrations

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 4 August 2026

## v0.19.0 season operations read model

Status: Implementation, Windows verification and Hosting deployment complete; release commit pending

No data migration is required.

- The command centre derives its state from existing `leagues`, `leagueHouses`, `leagueMemberships`, `leadershipElections`, `seasonEvidenceClaims`, `seasonEvidenceDecisions`, `leagueEvidenceReviewers`, `leagueContributions` and `leagueLeaderboardSnapshots` records.
- No record is rewritten merely to appear in the command centre.
- Operations reports are generated in the browser and downloaded locally; they are not stored in Firebase.
- Existing v1 seasons remain readable and do not receive the v2 evidence command centre.

## Deployment dependency

Firestore Rules are unchanged. After all release gates pass, deploy Hosting only with `npm run deploy:hosting`.

## Release completion workflow

1. Apply the main updater.
2. Run `npm install`, `npm run check`, `npm run test:rules`, `npm run check:release` and `npm audit`.
3. After approval, run `npm run deploy:hosting`.
4. Run the included `FINALISE_RELEASE.ps1`.
5. Commit the finalised source and documentation.

No separate documentation package is required.
