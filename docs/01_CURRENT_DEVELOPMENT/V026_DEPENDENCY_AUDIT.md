# Champions Legacy Challenge — v0.26 Dependency Advisory Review

Checkpoint: 26D
Scope: development/tooling dependency advisories
Remediation method: npm-compatible lockfile remediation only; no `--force`; no direct dependency specification changes.

## Before remediation

- Production dependency vulnerabilities: **0** (critical 0, high 0, moderate 0, low 0, info 0)
- Full dependency-tree vulnerabilities: **7** (critical 0, high 1, moderate 6, low 0, info 0)

| Package | Severity | Relationship | Affected range | npm fix availability | Advisory / via | Installed node paths |
|---|---|---|---|---|---|---|
| nanoid | high | transitive | <3.3.17 | Compatible automatic fix | nanoid: custom generators can loop indefinitely when size is zero | node_modules/nanoid |
| @google-cloud/storage | moderate | transitive | 2.2.0 - 2.5.0 || >=5.19.0 | firebase-admin@10.3.0 (SemVer-major) | retry-request; teeny-request | node_modules/@google-cloud/storage |
| firebase-admin | moderate | direct | 7.0.0 - 8.2.0 || >=11.0.0 | firebase-admin@10.3.0 (SemVer-major) | @google-cloud/storage | node_modules/firebase-admin |
| gaxios | moderate | transitive | 6.4.0 - 6.7.1 | Compatible automatic fix | uuid | node_modules/gaxios |
| retry-request | moderate | transitive | 7.0.0 - 7.0.2 | firebase-admin@10.3.0 (SemVer-major) | teeny-request | node_modules/retry-request |
| teeny-request | moderate | transitive | 3.9.1 - 9.0.0 | firebase-admin@10.3.0 (SemVer-major) | uuid | node_modules/teeny-request |
| uuid | moderate | transitive | <11.1.1 | firebase-admin@10.3.0 (SemVer-major) | uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided | node_modules/uuid |

## Remediation controls

- The candidate was generated outside the real repository.
- `npm audit fix --package-lock-only` was used without `--force`.
- `package.json` remained byte-for-byte equivalent as parsed JSON.
- Root dependency and devDependency specifications in the lockfile remained unchanged.
- The candidate dependency tree was installed from scratch in a detached Git worktree.
- The full application regression gate and Firestore Rules emulator gate were required before the candidate lockfile could enter the real development branch.
- Production dependency audit had to remain at zero known vulnerabilities.

## After compatible lockfile remediation

- Production dependency vulnerabilities: **0** (critical 0, high 0, moderate 0, low 0, info 0)
- Full dependency-tree vulnerabilities: **6** (critical 0, high 0, moderate 6, low 0, info 0)

| Residual package | Severity | Relationship | Affected range | npm fix availability |
|---|---|---|---|---|
| @google-cloud/storage | moderate | transitive | 2.2.0 - 2.5.0 || >=5.19.0 | firebase-admin@10.3.0 (SemVer-major) |
| firebase-admin | moderate | direct | 7.0.0 - 8.2.0 || >=11.0.0 | firebase-admin@10.3.0 (SemVer-major) |
| gaxios | moderate | transitive | 6.4.0 - 6.7.1 | Compatible automatic fix |
| retry-request | moderate | transitive | 7.0.0 - 7.0.2 | firebase-admin@10.3.0 (SemVer-major) |
| teeny-request | moderate | transitive | 3.9.1 - 9.0.0 | firebase-admin@10.3.0 (SemVer-major) |
| uuid | moderate | transitive | <11.1.1 | firebase-admin@10.3.0 (SemVer-major) |

## Decision

The compatible remediation reduced the advisory count from 7 to 6. No high or critical advisory is permitted to remain in a successful 26D checkpoint; any residual lower-severity advisory remains explicitly documented for targeted follow-up.

The raw pre/post npm audit JSON and npm audit-fix dry-run output are retained outside the Git repository in the checkpoint audit-report folder.
