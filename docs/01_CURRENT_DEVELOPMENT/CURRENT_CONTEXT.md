# Champions Legacy Challenge — Current Context

<!-- RELEASE_STATUS: DEPLOYED -->
**v0.19.0 — Season Command Centre** is verified and deployed to production.

## Why this phase exists

v0.18.0 introduced evidence queues, reviewer assignments, live administrator standings and immutable player snapshots. Those systems work, but season operators still need a single place to see what requires attention next.

## Candidate behaviour

- One command centre appears inside eligible v2 seasons.
- Next actions are derived from current season status, House readiness, ballots, proof workload and publication state.
- Decision history and snapshot history remain immutable and visible in operational order.
- Downloaded reports contain only records already visible to the current role.
- No WhatsApp media is stored or exported.
- No scoring or Security Rule change is included.

## Verification target

- 85 domain tests.
- 39 unchanged Firestore Security Rules tests.
- Clean ESLint and Vite build.
- Release-readiness for v0.19.0 on Hosting target `app`.

Do not deploy or commit until Windows verification passes. Do not run `npm audit fix --force`. Do not call or tag v1.0.
