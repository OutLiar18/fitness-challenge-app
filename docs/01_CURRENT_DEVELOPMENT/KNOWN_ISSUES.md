# Champions Legacy Challenge — Known Issues

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 5 August 2026

## Trusted operations boundaries

- Trusted reconciliation is manual and cannot guarantee publication at exactly 10:00 Johannesburg time.
- A private service-account key must be protected outside the repository. Exposure requires immediate revocation and replacement.
- Dry-run reports remain local and are not visible in the Command Centre; the Command Centre records successful trusted publications.
- Integrity findings are diagnostic. The command does not automatically repair malformed evidence, correction or contribution records.
- Account-deletion execution and completed-season anonymisation policy remain unimplemented.

## Dependency verification

- The packaging environment could not install `firebase-admin` from its restricted internal registry.
- The first Windows `npm install` must update the lockfile and is part of the authoritative release gates.
- 104 domain tests and static audits pass in packaging; Windows lint/build and 46 Rules tests remain required.

## Existing non-blocking issues

- npm audit reports two high React Router RSC-mode advisories. This client application does not use React Server Components; the available forced fix is breaking. Do not run `npm audit fix --force`.
- The Firebase vendor chunk exceeds Vite's 500 kB warning threshold after minification. The warning is known and non-blocking.
- Full final cross-device, keyboard, screen-reader, dark-mode and accessibility review remains deferred to the final pre-v1.0 phase.
- Personal history pagination and large-season query scaling may need further optimisation as real data volume grows.
