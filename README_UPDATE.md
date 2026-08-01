# Champions Legacy Challenge v0.9.0 Updater

## What this release adds

- Firestore-backed live announcements.
- Cross-device announcement read status.
- Operational Platform Administration workspace.
- Announcement drafting, publishing, editing, archiving and release-history import.
- Exercise, Cardio and Skill suggestion moderation.
- Trusted player-role and team management foundation.
- Immutable audit history for privileged changes.
- Complete player-facing measurement and reward wording.
- Proofread interface copy and refined typography hierarchy.
- Thirty-three automated tests.

## Apply

Extract this updater **outside** the project folder.

Open PowerShell inside the extracted updater folder:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_UPDATE.ps1
```

The default project path is:

```text
C:\Users\Kylep\fitness-tracker
```

The updater verifies that `.env` exists, creates a timestamped source backup and preserves `.env`, `.git` and `node_modules`.

## Verify and deploy

```powershell
cd C:\Users\Kylep\fitness-tracker
npm install
npm run check
npm audit
npx firebase-tools deploy --only firestore:rules --project fitnesschallengeapp-9e87f
```

Expect **33 passing tests**. Do not run `npm audit fix --force`.

## Bootstrap the first Platform Administrator

Follow:

```text
docs\01_CURRENT_DEVELOPMENT\ADMIN_BOOTSTRAP.md
```

For the current development project, use the Firebase Console to set your own user profile document’s `role` to `admin`, then sign out and sign in again.

## Manual verification

```powershell
npm run dev
```

Verify:

- ordinary players cannot access privileged data;
- live announcements publish and archive correctly;
- read status synchronises across browsers;
- moderation and role changes create audit records;
- player-facing measurements use complete words;
- desktop, tablet and 320-pixel mobile layouts remain readable.

## Commit

```powershell
git add -A
git commit -m "feat: add trusted administration and live announcements"
git tag v0.9.0
```
