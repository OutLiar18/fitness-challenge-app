# Champions Legacy Challenge — Active Migrations

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 4 August 2026

## v0.18.0 external-evidence ruleset

Status: Implementation, Windows verification and production deployment complete; release commit pending

- New seasons freeze `season-houses-v2` with `whatsapp-proof-v1` evidence settings.
- New collections appear only when used: `seasonEvidenceClaims`, `seasonEvidenceDecisions`, `leagueEvidenceReviewers` and `leagueLeaderboardSnapshots`.
- `challengeEntries` may carry `evidenceClaimIds` so verification IDs cannot become detached from source facts.
- New evidence-linked entries are not ordinarily deletable from the client.
- `leagueContributions` may include `evidenceClaimId`, `evidenceDecisionId` and `pointGroup: evidenceBonus`.
- League documents may store the latest published snapshot pointer, publication date and revision.

## Compatibility

No bulk migration is required.

- Existing v1 seasons remain readable and keep their original live-standing behaviour.
- Existing entries without `evidenceClaimIds` remain compatible.
- Existing contributions and House snapshots are untouched.
- v2 season creation requires explicit evidence-policy confirmation.
- v2 Pocket redemption blocks Running and Steps to prevent proof bypass.

## Deployment dependency

Firestore Rules and the v0.18.0 frontend must deploy together after all 39 Rules tests pass. Deploying only one side may cause permission or shape mismatches.

## Release completion workflow

1. Apply the main updater.
2. Run `npm install`, `npm run check`, `npm run test:rules`, `npm run check:release` and `npm audit`.
3. After approval, run `npm run deploy:production`.
4. Run the included `FINALISE_RELEASE.ps1` from the extracted updater.
5. Commit the finalised source and documentation.

No separate documentation package is required.
