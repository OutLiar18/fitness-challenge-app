# Champions Legacy v0.6.0 Delivery Notes

## Included

- Central daily and weekly goals.
- Running eligibility with preserved Cardio credit.
- Moderate goal-completion and perfect-period bonus Points.
- Forgiving streaks with one earned shield.
- One-time streak milestone Points and XP.
- Personal XP, levels, titles, starter achievements and progress records.
- Ruleset identifiers on derived progression events.
- Hardened Firestore rules and obsolete-service cleanup.
- Eighteen automated domain tests.
- Updated product, architecture, current-state and release documentation.

## Recommended installation

Use the supplied update package and run `APPLY_UPDATE.ps1`. It preserves the existing real `.env`, Git history and audited `package-lock.json`.

After applying the update:

```powershell
npm install
npm run check
npm audit
npm run dev
```

Do not run `npm audit fix --force`.

## Verification completed in the handover environment

- Eighteen domain tests pass.
- All local JavaScript and JSX files pass a TypeScript syntax/transpile check.
- All relative source imports resolve.
- Obsolete conflicting services were removed.

The handover environment could not complete a fresh dependency installation because its internal npm mirror lacked one transitive ESLint package. Run ESLint and the Vite production build on the Windows development computer through `npm run check` before tagging the release.

## Suggested commit

```text
feat: add personal progression and streaks
```
