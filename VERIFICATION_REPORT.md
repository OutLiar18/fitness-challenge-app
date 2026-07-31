# Champions Legacy v0.6.0 Verification Report

Date: 31 July 2026

## Passed

- 18/18 automated domain tests.
- JavaScript and JSX syntax/transpile validation.
- Relative import-resolution scan: no missing source imports.
- Running qualification and Cardio contribution regression tests.
- Independent workout daily and weekly goal tests.
- Daily and weekly completion-bonus tests.
- Streak start, reset, shield and milestone tests.
- XP, level and achievement separation tests.
- Future-dated entry exclusion test.

## Required locally

Run on the Windows development computer after applying the update:

```powershell
npm install
npm run check
npm audit
npm run dev
```

The full local check remains the release gate because this handover environment could not install one transitive ESLint package from its internal mirror.
