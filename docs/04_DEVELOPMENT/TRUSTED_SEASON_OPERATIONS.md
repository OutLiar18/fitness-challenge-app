# Trusted Season Operations

<!-- RELEASE_STATUS: DEPLOYED -->
Version introduced: 0.21.0

## One-time credential setup

The trusted command requires a private Firebase service-account JSON file. Download it only through the Firebase/Google Cloud administration interface and store it outside the project, for example:

```text
C:\Users\Kylep\firebase-private\champions-legacy-admin.json
```

Never upload, commit, email or place this file inside `fitness-tracker`.

For the current PowerShell session:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Kylep\firebase-private\champions-legacy-admin.json"
```

Alternatively, pass the path for one command:

```powershell
npm run season:reconcile -- --credentials "C:\Users\Kylep\firebase-private\champions-legacy-admin.json"
```

## Dry run

```powershell
cd C:\Users\Kylep\fitness-tracker
npm run season:reconcile
```

Choose the season number. The command prints a summary and writes a detailed report under `trusted-reports`. No Firebase competition data changes.

Useful options:

```powershell
npm run season:reconcile -- --list
npm run season:reconcile -- --league SEASON_DOCUMENT_ID
```

A dry run exits with code 2 when blocking findings exist. This is an intentional safety signal.

## Publish

After reviewing a clean dry-run report:

```powershell
npm run season:reconcile:publish
```

Choose the season, type `PUBLISH` when prompted and select the Platform Administrator recorded as publisher. A clean result publishes a new immutable trusted snapshot. An unchanged trusted fingerprint is treated as already current.

Direct selection is supported:

```powershell
npm run season:reconcile:publish -- --league SEASON_DOCUMENT_ID --actor ADMIN_USER_ID
```

Do not use `--yes` during normal manual operation. It exists only for controlled future automation.

## Findings workflow

When publication is blocked:

1. keep the generated JSON report;
2. inspect the finding codes and document IDs;
3. use the Entry Integrity, evidence or season administration workflow to resolve the factual problem;
4. rerun the dry run;
5. publish only after blocking findings reach zero.

Do not edit Firestore records directly to make the report pass.

## Security checklist

- Keep the JSON key outside the repository.
- Confirm `.gitignore` includes service-account and trusted-report patterns.
- Never paste private-key contents into chat, logs or screenshots.
- Revoke and replace the key immediately if it is exposed.
- Use the production project ID only for deliberate production reconciliation.

## Release boundary

The release gates do not execute the production reconciliation command. They verify its source, pure model tests, client Rules boundary and package configuration. The first real dry run should happen only after v0.21.0 is deployed and the credential has been configured safely.
