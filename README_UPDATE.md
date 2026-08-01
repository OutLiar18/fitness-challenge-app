# Champions Legacy Challenge v0.7.1 Updater

This patch rebuilds the application navigation and responsive shell.

## What changes

- Persistent labelled desktop rail.
- Compact icon-only tablet rail.
- Mobile status header and edge-to-edge bottom tabs.
- Responsive More popover and mobile bottom sheet.
- Player streak, level and point status in the shell.
- Swipeable category selection on mobile.
- Compact small-screen forms and statistics.
- One shared progression summary in `PlayerDataProvider`.
- Official Champions Legacy Challenge branding.
- Documentation and version alignment.

## Apply

Extract this ZIP outside the project folder. Open PowerShell in the extracted updater folder and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_UPDATE.ps1
```

The default project path is:

```text
C:\Users\Kylep\fitness-tracker
```

The updater creates a source backup and preserves `.env`, `.git`, `node_modules` and `dist`.

## Verify

```powershell
cd C:\Users\Kylep\fitness-tracker
npm install
npm run check
npm audit
npm run dev
```

Test at desktop width, tablet width and 320 px mobile width. Do not run `npm audit fix --force`.
