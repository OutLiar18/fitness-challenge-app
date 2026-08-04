# Champions Legacy Challenge — Known Issues

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 4 August 2026

## v0.19.0 candidate status

Windows verification passed clean ESLint, 85 domain tests, the Vite production build, 39 Rules tests and release-readiness. Branded Firebase Hosting deployed successfully.

## Season operations

- The command centre is a derived operational view; it does not replace detailed controls in Houses or Evidence Operations.
- Snapshot publication remains administrator-session based. There is still no guaranteed background scheduler.
- Operations reports can contain private season administration data and should be handled as trusted operational exports.
- Category-reviewer reports are scoped to assigned evidence categories, but still contain shared season records the reviewer may already read as a member.

## Existing technical limitations

- The Firebase vendor bundle remains above Vite's 500-kilobyte warning threshold.
- `npm audit` reports the known React Router React Server Components advisory. The app does not use RSC mode, and forced remediation is breaking. Do not run `npm audit fix --force`.
- Personal history still subscribes to the complete signed-in user's entries; pagination remains future work.
- Account deletion still requires trusted operational execution outside the client.
- Prize-bearing competition should eventually use trusted server-side recalculation and scheduled publication.

## Review boundary

The complete functional, responsive, dark-mode, keyboard and accessibility review remains deferred until the final pre-v1.0 stage by user choice.
