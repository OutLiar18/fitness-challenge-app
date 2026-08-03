# Champions Legacy Challenge — Current State

Version: 0.15.0  
Last updated: 3 August 2026  
Status: Deployed to production; pre-v1.0; final integrated review deferred

## Product state

Champions Legacy Challenge combines factual personal tracking, progression and season-scoped competition. Permanent global Teams remain retired. Houses belong to one season, and contribution snapshots preserve the House represented when points were earned.

The v0.15.0 frontend is live at `https://champions-legacy-challenge.web.app`. The release passed all automated Windows gates before deployment. It did not change Firestore collection shapes or Security Rules, so the compatible v0.14.0 season Rules remain active.

## Added in v0.15.0

### Calmer adaptive navigation

- Desktop navigation is grouped into **Your journey**, **Competition** and **Communications**.
- Profile is no longer duplicated in the desktop route list; the player identity panel remains the single desktop Profile entry.
- Mobile keeps four focused tabs—Home, Log, Progress and Inbox—plus More.
- Analytics, Pocket Week, Legacy Coach, reference pages and Administration live in the focused More menu.
- Old route bookmarks for Teams, Leagues, Announcements and Notifications redirect safely to Houses, Seasons or Inbox while preserving relevant query parameters.

### Unified Inbox

- Public announcements and private season notifications share one communications workspace.
- Tabs, unread totals and the shell badge make the distinction clear.
- The underlying announcement and private-notification collections, providers and security rules remain separate because they have different audiences and trust boundaries.

### Personal Analytics

- Weekly activity trend across 4, 8, 12 or 26 weeks.
- Latest 28-day consistency view.
- Category balance, strongest recent day, average points per active day and recent momentum.
- Transparent observations rather than prescriptive or shaming judgements.
- Analytics reuse factual entries and `getEntryPointBreakdown`; Running continues to contribute correctly to Running and Cardio without duplicating scoring in UI code.
- Analytics never change competitive Points or Experience Points.

### Visible C.H.A.O.S. readiness

- Administrators can see C.H.A.O.S. during Draft and Registration instead of mistaking a hidden panel for a missing feature.
- The panel explains season status, configured Houses, registered-player minimum and one-time activation.
- Activation remains restricted to Registration, requires every configured House, and requires at least two registered players per House in total.
- Houses do not need assigned players beforehand because C.H.A.O.S. creates the opening roster.

### Cleanup

- Route-level components now use current product names: `Seasons.jsx`, `Houses.jsx`, `Inbox.jsx` and `Analytics.jsx`.
- Separate Announcements and Notifications pages and obsolete Teams/Leagues page names were removed.
- The stale Netlify `_redirects` file was removed; Firebase Hosting is the only current hosting platform.
- Accepted and superseded ADRs remain as historical records rather than being deleted.

## Verified release result

- 66 of 66 domain tests passed.
- 25 of 25 Firestore Rules tests passed.
- ESLint passed without warnings.
- Vite production build passed.
- Release-readiness confirmed version 0.15.0 and Hosting target `app`.
- Production Hosting deployed successfully with 58 files.
- The known Firebase vendor chunk warning is non-blocking and remains a later optimisation item.
- `npm audit` still reports two high-severity React Router RSC advisories. RSC mode is not used; do not run `npm audit fix --force`.

## Existing complete systems

Authentication, profiles, Legacy Avatars, ten activity categories, Points Engine v2, local-date Journal, goals, bonuses, streaks, shields, Experience Points, levels, achievements, records, timeline, trusted administration, moderation, versioned shared libraries, Rulebook, Points Guide, error monitoring, Firebase Hosting, transparent Legacy Coach, season Houses, C.H.A.O.S., leadership voting, balanced roster swaps, Pocket Week, private notifications, dual standings and season honours.

## Known limitations

- Full functional, responsive, keyboard, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage by product-owner decision.
- Power Plays, Diamonds, the complete Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive.
- Trusted server-side contribution recalculation is still required before prize-bearing competition.
- Account deletion, personal-data export, privacy/support content and first-use onboarding remain pre-v1.0 work.
- Personal history still uses a complete user subscription; pagination remains a controlled scale improvement.

## Immediate next step

Synchronise these deployment records, commit v0.15.0, and then choose the next pre-v1.0 foundation release. The safest next scope is onboarding, privacy/support, account export/deletion and history/performance work because those do not require inventing unconfirmed competition mechanics.
