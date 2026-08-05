# Trusted Account Deletion Operations

Last updated: 5 August 2026

## Boundary

This runbook is for a Platform Administrator using the private local Firebase Admin SDK credential. Never upload, commit, paste or share the service-account JSON file.

Default credential location used during project setup:

```text
C:\Users\Kylep\firebase-private\champions-legacy-admin.json
```

Default report directory:

```text
C:\Users\Kylep\firebase-private\champions-legacy-account-deletion-reports
```

## Configure one PowerShell session

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Kylep\firebase-private\champions-legacy-admin.json"
cd C:\Users\Kylep\fitness-tracker
```

## List requests

```powershell
npm run account:deletion:list
```

This is read-only.

## Run a dry audit

```powershell
npm run account:deletion:audit
```

Choose the request number. The command reads Authentication and Firestore, calculates a stable anonymous identity, checks the seven-day window and safety blockers, and writes a private local JSON report. It changes nothing.

A dry audit may exit with code `2` when the request is not yet eligible. That is a safety result, not data corruption.

## Process an eligible request

Only after reviewing the dry-run report:

```powershell
npm run account:deletion:process
```

The command:

1. repeats the dry audit;
2. requires `DELETE <CODE>`;
3. records the operating Platform Administrator;
4. refreshes the live request and data plan;
5. starts an immutable execution record;
6. disables the Authentication user and revokes refresh tokens;
7. deletes eligible private records;
8. anonymises shared history;
9. deletes the Authentication user;
10. creates a completion receipt and audit event.

## Failure and recovery

A partial failure records `failed` status and the execution ID. Correct the underlying operational problem, run another dry audit, then run the process command again. The tool is designed to tolerate records already removed or anonymised during the earlier attempt.

Never manually mark a request completed. Never delete the execution or receipt records.

## After the operation

```powershell
Remove-Item Env:GOOGLE_APPLICATION_CREDENTIALS
```

Confirm in Administration that the request is completed, verify that the former player appears anonymously in preserved shared history, and retain the local completion report in the private folder.

## Incident response

If the credential is exposed, revoke/delete the service-account key in Firebase/Google Cloud immediately, create a replacement, update the private file and review administrator audit activity.
