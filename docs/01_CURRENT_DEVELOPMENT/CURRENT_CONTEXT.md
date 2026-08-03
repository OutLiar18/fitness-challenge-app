# Current Context

Last updated: 3 August 2026

**v0.15.0 — Navigation, Inbox, Analytics and C.H.A.O.S. Readiness** is deployed to the branded Firebase Hosting site.

The release passed 66 domain tests, 25 Firestore Rules tests, clean ESLint, the Vite production build and release-readiness for Hosting target `app`. Firestore data shapes and Rules did not change in v0.15.0; the compatible season Rules deployed during v0.14.0 remain active.

The navigation now prioritises the player journey, competition and one communications Inbox. Desktop Profile duplication is removed. Public announcements and private notifications share one page but retain separate data/security boundaries.

Personal Analytics is derived entirely from factual entries and the existing Points Engine. It shows trends and consistency without creating new score fields or changing Points or Experience Points.

C.H.A.O.S. remains Registration-only, one-time and balanced. Administrators can see its prerequisites during Draft. Pocket Week remains one seven-day pre-season window.

The product owner deferred full manual functional, responsive, keyboard, visual, dark-mode and accessibility review until the final pre-v1.0 stage. Inactive mechanics must not be inferred: Power Plays, Diamonds, player prices, full Transfer Market, Buddy Bonuses, Five Fires and late-season twists await explicit product decisions.
