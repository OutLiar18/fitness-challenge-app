# Champions Legacy Challenge — QA Matrix

<!-- RELEASE_STATUS: DEPLOYED -->
Current release target: v0.23.0

| Area | Required verification |
|---|---|
| Domain | 120 tests pass |
| Security Rules | 51 tests pass on Firestore Emulator/Java 21 |
| Build | ESLint and Vite production build pass |
| Release structure | v0.23.0, Hosting target `app`, Power Play docs/services/tests/finaliser present |
| Compatibility | v1/v2 seasons unchanged; v3 only for new seasons |
| Draft pool | Ten base categories, unique confirmed names, controlled custom plays |
| Readiness | Enabled confirmed pool covers every official week |
| Selection | Random without replacement; selected IDs never return |
| Timing | Whole final calendar day active; future player visibility denied |
| Scoring | Activity date, before cap, activity only, same individual/House value |
| Evidence | Late proof uses activity week; evidence bonus excluded |
| Corrections | Pre-week reason; locked Platform Administrator audited replacement |
| Reconciliation | Frozen definitions, duplicates and used-state verified |
| Accessibility | Labels, keyboard controls, textual status and responsive workspace |
| Audit | Eight known advisories reviewed; no breaking auto-fix |

## Manual smoke path

1. Create a new v3 draft season with a theme.
2. Rename all ten base plays with unique theme-specific names.
3. Add a custom 3× multi-category play.
4. Confirm readiness blocks registration until the pool covers all weeks.
5. Open registration and verify the pool freezes.
6. Select a future week and verify players cannot see it early.
7. Start/reload into the week and verify player reveal.
8. Verify eligible activity points adjust while evidence/goal/progression bonuses do not.
9. Redraw a future week and confirm both old and new IDs are consumed.
10. Run trusted reconciliation and confirm clean Power Play integrity.
