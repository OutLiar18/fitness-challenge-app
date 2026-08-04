# Champions Legacy Challenge — Active Migrations

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 4 August 2026

## v0.20.0 correction collections and compatibility

Status: Implementation, Windows verification and production deployment complete; release commit pending

No bulk data migration is required.

New documents are created only when a Platform Administrator performs a factual correction:

- `entryCorrectionHeads/{rootEntryId}` — mutable pointer to the current immutable entry version;
- `entryCorrections/{correctionId}` — immutable audit and reconciliation record.

Existing entries remain valid without correction metadata. New ordinary and Pocket entries write empty correction defaults. Existing proof claims remain valid; correction-specific fields use safe empty defaults until a claim is superseded or linked to a correction.

## Runtime read-model migration

- Player subscriptions now include correction heads and correction records owned by the signed-in player.
- The active-history resolver filters superseded entry versions from goals, progression, analytics and records.
- Personal export schema advances from 1 to 2 and includes correction history.
- No existing Firestore document needs to be rewritten merely to support v0.20.0.

## Deployment dependency

Firestore Security Rules change in this release. After all release gates pass, deploy Rules and Hosting together with:

```powershell
npm run deploy:production
```

## Release completion workflow

1. Apply the main updater.
2. Run `npm install`, `npm run check`, `npm run test:rules`, `npm run check:release` and `npm audit`.
3. After approval, run `npm run deploy:production`.
4. Run the included `FINALISE_RELEASE.ps1`.
5. Commit the finalised source and documentation.

No separate documentation package is required.
