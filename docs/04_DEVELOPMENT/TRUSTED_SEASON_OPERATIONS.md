# Trusted Season Operations

<!-- RELEASE_STATUS: DEPLOYED -->
Version introduced: 0.21.0

## One-time credential setup

The trusted command requires a private Firebase service-account JSON file. Store it outside the project, for example:

```text
C:\Users\Kylep\firebase-private\champions-legacy-admin.json
```

Never upload, commit, email or place this file inside `fitness-tracker`.

Set the credential for the current PowerShell session:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Kylep\firebase-private\champions-legacy-admin.json"
```

The environment variable lasts only for that PowerShell window. Set it again after opening a new window.

## Read-only connection test

```powershell
cd C:\Users\Kylep\fitness-tracker
npm run season:list
```

This lists season names, statuses and document IDs. It does not publish or modify Firebase data.

## Dry run

```powershell
cd C:\Users\Kylep\fitness-tracker
npm run season:reconcile
```

Choose the season number. The command prints a summary and writes a detailed report outside the repository under:

```text
C:\Users\Kylep\firebase-private\champions-legacy-trusted-reports
```

No Firebase competition data changes.

A dry run exits with code 2 when blocking findings exist. This is an intentional safety signal.

## Publish

After reviewing a clean dry-run report:

```powershell
npm run season:reconcile:publish
```

Choose the season, type `PUBLISH` when prompted and select the Platform Administrator recorded as publisher. A clean result publishes a new immutable trusted snapshot. An unchanged trusted fingerprint is treated as already current.

Do not use `--yes` during normal manual operation. It exists only for controlled future automation.

## Optional report location override

The default report directory is intentionally outside `fitness-tracker`. To use another private location for the current PowerShell session:

```powershell
$env:CHAMPIONS_LEGACY_REPORT_DIR="D:\Private\champions-legacy-reports"
```

The command also accepts `--report-dir <path>`. Never point it inside the repository.

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
- Keep service-account files and trusted reports outside the repository.
- Never paste private-key contents into chat, logs or screenshots.
- Revoke and replace the key immediately if it is exposed.
- Use the production project ID only for deliberate production reconciliation.

## Post-release loader correction

The trusted command imports the same extensionless source modules used by the Vite application. Local Node execution must therefore register `scripts/extension-loader.mjs` through `scripts/register-loader.mjs`. The `season:list`, `season:reconcile` and `season:reconcile:publish` package scripts include that loader.

## Post-release report-location correction

Trusted reconciliation reports must be written outside `fitness-tracker` so release-readiness checks and Git commits remain clean. The local command defaults to the private user folder and supports `CHAMPIONS_LEGACY_REPORT_DIR` or `--report-dir` for an explicit external location.
