# Champions Legacy Challenge — Known Issues

## Operational boundaries

- Weekly Power Play selection remains administrator-driven; there is no background scheduler.
- Some trusted operations require a private Admin SDK credential kept outside the repository.
- Historical season rulesets intentionally preserve their original behavior rather than being silently upgraded.

## Engineering

- Firebase is intentionally split into several vendor chunks; bundle size should be watched but is not currently a release blocker.
- Firestore emulator negative-security tests may log expected permission errors while the suite still passes.
- Dependency advisories must be reviewed deliberately; do not use forced audit upgrades as a shortcut.

Add issues here only when they remain current and actionable. Historical resolved issues belong in Git/release history, not this file.
