# Recent Session Summary — v0.22.0

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 5 August 2026

v0.21.0 trusted season reconciliation was deployed, finalised and committed. The private Admin SDK key was configured outside the repository, a successful read-only season dry audit was completed, and local reports were moved outside the repository.

The user approved the v0.22.0 deletion policy:

- seven days after acknowledgement before processing;
- preserve shared competition history under an anonymous identity;
- allow a completely fresh registration with no restored history.

The v0.22.0 candidate adds the complete trusted deletion lifecycle, local dry-audit/processing commands, Firestore Rules, tests, docs and release tooling. Packaging verifies 108 domain tests. Windows must still run installation, lint, build, 47 Rules tests and release-readiness before deployment.

Do not process a real account deletion during release verification. Do not tag v1.0.
