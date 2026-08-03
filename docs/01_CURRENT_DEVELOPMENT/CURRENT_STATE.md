# Champions Legacy Challenge — Current State

Version: 0.16.0  
Production version: 0.16.0  
Last updated: 3 August 2026  
Status: Verified and deployed; documentation synchronisation and commit pending; pre-v1.0

## Product state

Champions Legacy Challenge combines factual personal tracking, progression and season-scoped competition. Permanent global Teams remain retired. Houses belong to one season, and contribution snapshots preserve the House represented when points were earned.

v0.16.0 keeps all v0.15.0 data and security contracts intact while reducing visual density across the application.

## Delivered in v0.16.0

### Shared progressive-disclosure workspace

- Added `WorkspaceTabs` and `WorkspacePanel` as the single reusable route-section pattern.
- Desktop tabs include icons, labels, supporting descriptions and optional counts/status badges.
- At 760 pixels and below, the same sections become a labelled native select control.
- Desktop tabs support Arrow keys, Home and End in addition to normal click, Tab and focus behaviour.
- Reduced-motion preferences remove the panel entrance animation.
- Pure workspace helpers safely resolve unavailable sections and keyboard movement.

### Page refinement

- **Progress:** Overview is the calm default; Achievements, Records, Timeline and Level Journey are selectable sections.
- **Activity Log:** logging and Journal are separate workspaces without changing date/category behaviour.
- **Analytics:** summary cards remain visible while Trends, Consistency, Category Balance and Insights are separated.
- **Profile:** identity remains immediate; Overview, Personalise and Protections are separated.
- **Legacy Coach:** weekly metrics remain visible; Recommendations, Evidence and Preferences are separated.
- **Points Guide:** Activity Scoring, Bonuses and Difficulty, Season Scoring and Formula Reference are separated.
- **Seasons:** browsing, joining and creation are separated; selected-season Overview, Standings and Honours are separated.
- **Houses:** overview, roster, leadership, weekly roster turn and pre-season management are separated. C.H.A.O.S. remains discoverable from Overview.
- **Pocket Week:** Store Activity, Your Pocket and How It Works are separated according to the current season phase.
- **Administration:** seven operational areas use the shared full-width workspace rather than a second internal sidebar.

### Deliberate non-changes

- Dashboard remains direct because its purpose is current status and next action.
- Inbox retains its purpose-built public/private message tabs.
- Rulebook retains native disclosure sections.
- Authentication, error and future-feature pages remain simple.
- No scoring, progression, Firestore collection, Security Rule or season-history logic changed.

## Verified release state

- `npm install` completed successfully.
- ESLint passed without warnings.
- 68 of 68 domain tests passed.
- The Vite production build passed with 264 modules transformed.
- 25 of 25 Firestore Security Rules tests passed.
- Expected `PERMISSION_DENIED` logs came from negative Rules tests and did not indicate failures.
- Release-readiness verified v0.16.0 on branded Hosting target `app`.
- Firebase Hosting deployed 60 frontend files successfully to `https://champions-legacy-challenge.web.app`.
- Firestore Rules were unchanged and did not require redeployment.

## Existing complete systems

Authentication, profiles, Legacy Avatars, ten activity categories, Points Engine v2, local-date Journal, goals, bonuses, streaks, shields, Experience Points, levels, achievements, records, timeline, Personal Analytics, trusted administration, moderation, versioned shared libraries, Inbox, Rulebook, Points Guide, error monitoring, Firebase Hosting, transparent Legacy Coach, season Houses, C.H.A.O.S., leadership voting, balanced roster swaps, Pocket Week, private notifications, dual standings and season honours.

## Known limitations

- Full functional, responsive, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage by product-owner decision.
- Power Plays, Diamonds, the complete Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive.
- Trusted server-side contribution recalculation is required before prize-bearing competition.
- Account deletion, personal-data export, privacy/support content and first-use onboarding remain pre-v1.0 work.
- Personal history still uses a complete user subscription; pagination remains a controlled scale improvement.
- The production build reports a non-blocking Firebase vendor chunk warning.
- `npm audit` reports two high-severity React Router advisories for React Server Components mode. This client-rendered Vite app does not use that mode; do not force a breaking downgrade.

## Immediate next step

Synchronise these deployment records and commit v0.16.0. After that, choose one scoped pre-v1.0 phase rather than mixing unrelated systems. No v1.0 tag or declaration is permitted without explicit approval.
