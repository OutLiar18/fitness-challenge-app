# Champions Legacy Challenge v0.8.0 Updater

## What this release adds

- Twelve built-in Legacy Avatars.
- Persistent avatar and display-name editing.
- No image upload and no Firebase Storage dependency.
- Real-time profile updates across protected pages.
- Announcement filters and unread-only mode.
- Per-user browser read status.
- Desktop and mobile unread badges.
- Constrained Firestore profile-update rules.
- Twenty-nine automated tests.

## Apply

Extract this updater outside the project folder.

Open PowerShell inside the extracted updater folder:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_UPDATE.ps1
```

The default project path is:

```text
C:\Users\Kylep\fitness-tracker
```

## Verify and deploy

```powershell
cd C:\Users\Kylep\fitness-tracker
npm install
npm run check
npm audit
npx firebase-tools deploy --only firestore:rules --project fitnesschallengeapp-9e87f
npm run dev
```

Do not run `npm audit fix --force`.

Profile editing will fail with a permission error until the updated Firestore rules are deployed.

## Commit

```powershell
git add -A
git commit -m "feat: add Legacy Avatars and announcement status"
git tag v0.8.0
```
