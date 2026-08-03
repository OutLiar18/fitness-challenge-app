# Current Context

Last updated: 3 August 2026

**v0.16.0 — Progressive Disclosure and Page Breathing Room** is verified and deployed to production.

Dense route-level pages now use a shared accessible workspace pattern. Desktop presents labelled tabs with descriptions and optional counts; small screens use a native section selector. Only the active section is rendered, while page identity, key summaries and primary actions remain visible.

Progress defaults to Overview and places Achievements, Records, Timeline and Level Journey behind deliberate selection. Similar refinement is applied to Activity Log, Analytics, Profile, Legacy Coach, Points Guide, Seasons, Houses, Pocket Week and Administration. Inbox already used an appropriate tabbed pattern, Rulebook already used disclosure controls, and Dashboard remains intentionally direct.

The work is presentation-only. It does not alter scoring, Firestore shapes, Security Rules, season history or Pocket Week. C.H.A.O.S. remains visible through an overview status callout and a dedicated management workspace.

Authoritative Windows verification passed clean lint, 68 domain tests, the production build, 25 Rules tests and release-readiness. Firebase Hosting released 60 files to the branded production site. Firestore Rules were unchanged. The full manual integrated review remains deferred until the final pre-v1.0 stage.
