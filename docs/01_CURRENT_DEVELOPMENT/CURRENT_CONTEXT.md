# Champions Legacy Challenge — Current Context

<!-- RELEASE_STATUS: DEPLOYED -->
**v0.18.0 — External Evidence and Published Standings** is verified and deployed to production.

## Why this phase exists

Media uploads are deliberately excluded because of storage and cost barriers. Players submit pictures or screenshots in a WhatsApp group and include the in-app verification ID. The app records only structured administrator decisions.

## Core rules

- Running proof shows date, distance and duration; pace is calculated automatically.
- Qualifying Running points wait for proof; Running Cardio points remain immediate.
- Steps proof shows date, total daily steps and a recognisable app/device screen; Steps points wait for proof.
- Water: maximum three-point daily proof bonus after 750 photographed millilitres.
- Fruit: maximum three-point daily proof bonus after three photographed servings; normal Fruit points cap at five servings per day.
- Proof is due within 24 hours; late acceptance is Platform-Administrator-only with a reason.
- Player standings are published snapshots; administrators see live standings.
- Daily fallback publication is due at 10:00 Africa/Johannesburg but requires an authorised administrator session.

## Verification target

- 80 domain tests.
- 39 Firestore Security Rules tests.
- Candidate Rules expression-budget hotfix pending verification after the first run passed 37 of 39 tests.
- Clean ESLint and Vite build.
- Release-readiness for v0.18.0 on Hosting target `app`.

Do not deploy or commit until Windows verification passes. Do not run `npm audit fix --force`. Do not call or tag v1.0.
