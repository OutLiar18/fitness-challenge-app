# Champions Legacy Challenge — Chat Briefing

Last updated: 3 August 2026

## Current implemented state — v0.14.0

Champions Legacy Challenge is a React/Vite/Firebase application hosted at `https://champions-legacy-challenge.web.app`.

v0.14.0 replaces permanent global Teams with season-scoped Houses. Administrators create a themed season and Houses; players register as individuals; C.H.A.O.S. creates balanced opening rosters; Houses elect weekly leadership; one balanced roster swap per House/week preserves historical contributions; and Pocket Week provides private zero-point reserves that players deliberately activate during the season.

Pocket Week is confirmed as one seven-day window immediately before the season. It is not recurring.

Both individual and House leaderboards exist. House totals are calculated from the House snapshot stored on each contribution, not current membership.

Windows verification is complete: clean ESLint, 61 domain tests, 25 Firestore Rules tests, production build and release-readiness all pass. Retired Team and dummy pre-v0.14 league test data was removed after inspection. The final Rules compiled without warnings and deployed successfully. Hosting preview and production Hosting are deployed. A production smoke test confirmed season and House creation.

The complete functional, responsive and accessibility review is intentionally deferred until the final pre-v1.0 stage. The release remains pre-v1.0.

The next identified UX issue is C.H.A.O.S. discoverability. Activation correctly requires Registration, every configured House and at least two registered players per House, but the current console is hidden during Draft and can appear to be missing.

Do not invent Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires or late-season twists. Read `RECENT_SESSION_SUMMARY.md`, `CURRENT_STATE.md`, `ACTIVE_MIGRATIONS.md` and ADR-021 before changing competition code.
