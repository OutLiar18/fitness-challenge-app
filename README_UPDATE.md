# Champions Legacy v0.7.0 Updater

This updater overlays the reviewed v0.7.0 source onto the existing project while preserving the local `.env`, Git history and installed dependencies.

## Apply the update

1. Extract this ZIP.
2. Open PowerShell inside the extracted folder.
3. Run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_UPDATE.ps1
```

The default project path is:

```text
C:\Users\Kylep\fitness-tracker
```

For another location:

```powershell
.\APPLY_UPDATE.ps1 -TargetPath "D:\path\to\fitness-tracker"
```

The script creates a timestamped source backup next to the project and stores a separate `.env.backup` inside it.

## Verify afterward

```powershell
cd C:\Users\Kylep\fitness-tracker
npm install
npm run check
npm audit
npm run dev
```

Expected application version: `0.7.0`.

Do not run `npm audit fix --force`.
