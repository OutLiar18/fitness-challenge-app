# Champions Legacy Challenge — Known Issues

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 5 August 2026

## Trusted deletion boundaries

- Deletion processing is manual; there is no automatic seven-day scheduler.
- A private service-account key must be protected outside the repository. Exposure requires immediate revocation and replacement.
- Dry-run and completion reports remain local and private.
- Broad Firestore scans are acceptable for current pre-v1.0 volume but must be reviewed before very large seasons.
- Formal legal/privacy review and a confirmed support contact remain required before public launch.

## Packaging environment

- The restricted packaging registry cannot install the complete dependency tree.
- Windows `npm install`, ESLint, Vite build and Firestore Emulator results are authoritative.
- 108 domain tests and syntax/import audits pass in packaging.

## Existing non-blocking issues

- `npm audit` reports eight advisories: six moderate and two high. Available forced fixes are breaking. Do not run `npm audit fix` or `npm audit fix --force` during this release.
- The Firebase vendor chunk exceeds Vite's 500 kB warning threshold after minification.
- Full final cross-device, keyboard, screen-reader, dark-mode and accessibility review remains deferred.
- Large-season query scaling may need further optimisation as real data volume grows.
