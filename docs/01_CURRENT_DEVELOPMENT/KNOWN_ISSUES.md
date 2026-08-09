# Champions Legacy Challenge — Known Issues

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 9 August 2026

## v0.24.0 operational boundaries

- Weekly Power Play selection remains administrator-driven; there is no background scheduler.
- Player listeners attach to official weeks that have started when the Seasons page loads. A refresh at a week boundary may be required for the newest started week to appear immediately.
- Existing historical season rulesets intentionally retain their own behaviour rather than being silently upgraded to v4.
- Platform Administrator movement-rest override cannot bypass same-week repeat movement, House weekly locks or captain/vice-captain protection.
- House-balance composition summaries are intentionally suppressed when a House has fewer than three disclosed responses.
- House balance is informational only and does not change points, standings or Power Play scoring.

## Build output

- The Firebase vendor chunk may exceed 500 kB after minification. This remains a non-blocking performance optimisation item for the dedicated polish release.
- Expected emulator `PERMISSION_DENIED` output represents negative security assertions when the Rules suite ultimately passes.

## Dependency policy

Review dependency advisories deliberately. Do not run `npm audit fix --force` as a release shortcut because suggested changes may be breaking or unrelated to the Vite SPA runtime.

## Trusted operations

- Season reconciliation and account deletion require the private Admin SDK key outside the repository.
- Local trusted-operation reports must remain outside the repository.
- No Cloud Functions, paid plan or automatic trusted scheduler is used.

## Deferred final review

Full manual cross-device, keyboard, screen-reader, dark-mode, visual and accessibility review remains scheduled for the final pre-v1.0 polish iteration.
