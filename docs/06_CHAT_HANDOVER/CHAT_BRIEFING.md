# Champions Legacy Challenge — Chat Briefing

Current development: **v0.29.0**
Production: **v0.28.0**
Production URL: `https://champions-legacy-challenge.web.app`

## Current objective

Keep v0.29 focused on source cleanup, responsive/visual polish, maintainability and concrete owner-requested fixes. Do not require an external tester cycle or full season rehearsal before v1.0 unless the owner explicitly revives them.

## Important invariants

- Platform Administrators alone decide evidence claims.
- Running points require ≥3 km at ≤11:00 min/km; otherwise the run is stored and only its duration contributes to Cardio.
- Diamonds, player prices and the old Transfer Market are rejected.
- One-week post-move stability is authoritative.
- Do not change scoring, league authority or Firestore security as a side effect of polish work.

## Engineering workflow

Prefer grouped, risk-based changes. Run automated checks/builds at meaningful boundaries. Treat Firestore Rules changes separately and cautiously. Keep generated output, caches, logs and credentials out of source artifacts.
