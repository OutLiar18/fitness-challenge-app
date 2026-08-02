# Champions Legacy Challenge — Recent Session Summary

Date: 2 August 2026  
Release target: v0.13.1 Rulebook and Points Reference

## User direction

The user supplied the original 2025 14-page Rule Book and one-page Points Guidelines. They requested accessible in-app references, preservation of original wording where appropriate, clear handling of unsupported mechanics, and no v1.0 declaration.

## Implemented

- Searchable `/rules` page with status filters, accordion sections, jump navigation and dynamic current goals.
- Stable rule identifiers and 2025 rule-number source references.
- Current, season-option and inactive legacy classifications.
- Added platform integrity, privacy, safety, respectful-conduct and account-security rules.
- Marked Pocket Week, Houses, Power Plays, Transfer Market, Buddy Bonus, photo bonuses, WhatsApp administration and Five Fires inactive.
- Added `/points-guide` with category selector, visual scoring ladders, zero-point ranges, public formulas, difficulty scale, visible goal bonuses and league scoring.
- Generated the guide from live Points Engine constants rather than copying the obsolete 2025 table.
- Added navigation, announcement, release metadata, ADR-020 and regression coverage.

## Verification targets

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

Expected:

- 54 domain tests.
- 15 Firestore Rules tests.
- ESLint and production build pass.
- Release readiness confirms v0.13.1 and Hosting target `app`.

## Important boundary

The new pages do not add Firestore collections or permissions. Existing v0.12 league-capacity migration and Rules deployment requirements still apply when that baseline has not already been deployed.

## Next action

Apply v0.13.1, run verification, deploy the branded Hosting build and begin the user’s complete review. Do not create v1.0.
