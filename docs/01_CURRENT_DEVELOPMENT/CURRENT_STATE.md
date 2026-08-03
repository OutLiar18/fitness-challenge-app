# Champions Legacy Challenge — Current State

Version: 0.14.0  
Last updated: 3 August 2026  
Status: Deployed pre-v1.0 season competition foundation; final integrated review deferred

## Product state

The platform combines personal tracking and progression with season-scoped competition. Permanent global Teams are retired. Every House belongs to one themed season, and every contribution preserves the House represented when it was earned.

v0.14.0 is live at `https://champions-legacy-challenge.web.app`. The matching Firestore Rules are also live.

## Added in v0.14.0

### Season-scoped Houses

- Administrators create two to eight themed Houses inside a Draft season.
- A season requires all configured Houses and at least two registered players per House before C.H.A.O.S. can activate.
- C.H.A.O.S. uses a deterministic seeded shuffle to create balanced opening rosters.
- Houses are expected to be unassigned before activation; C.H.A.O.S. performs the opening assignment.
- Each assigned player receives a private notification.
- Houses use bundled emblems, accent colours, descriptions and mottos without media storage.
- Permanent global Team collections are retired and denied by Firestore Rules.

### Weekly House leadership

- One 24-hour ballot per House per Monday-through-Sunday challenge week.
- Every current House member may cast one private vote.
- Most votes appoint the Captain; second-most appoints the primary Vice-Captain.
- Ties, one-candidate results and empty ballots require League or Platform Administrator resolution after the full day closes.
- The elected Captain may appoint one additional Vice-Captain.
- Ballot opening and final results create private House notifications.

### Roster movement and historical integrity

- Each House may take part in one balanced player swap per week.
- Captains, Vice-Captains and trusted league administrators may complete an eligible swap.
- Current leaders must be replaced before moving.
- Both participating Houses receive a weekly transaction lock.
- Earlier House contributions remain with the previous House; only future contributions use the new House.

### Pocket Week

- Pocket Week is confirmed as one seven-calendar-day window immediately before the season begins.
- It is not a recurring weekly reserve window.
- Stored activities are private and worth zero points.
- Water, Fruit, Reading, Skill Development, Cardio and Steps support partial redemption.
- Running and workout activities redeem as complete stored sessions.
- Redemptions are atomic, final and traceable to the reserve, scored entry, House contribution and receipt.
- The transaction reloads the live season, membership and Pocket document before scoring.
- Partial amounts are canonicalised; whole-number categories reject fractional redemption and timed categories round consistently to the nearest second.
- Empty categories cannot be invented later and used balances cannot be restored.

### Seasons and honours

- Every season displays individual and House leaderboards.
- House standings aggregate historical contribution snapshots rather than current membership.
- Provisional and final Legacy Champion, category champions, House Champions and House of Champions are derived from season records.
- Ambiguous 2025 mechanics remain visible in the Rulebook but inactive.

### Interface and operations

- Dedicated `/pocket` and `/notifications` routes.
- Teams navigation is now Houses; Leagues navigation is now Seasons.
- Responsive House forge, C.H.A.O.S. console, leadership ballot, roster swap, Pocket wallet and dual standings.
- Release metadata, bundled announcements, error reports and library release defaults align with v0.14.0.

## Existing complete systems

Authentication, profiles, Legacy Avatars, ten activity categories, Points Engine v2, local-date Journal, goals, bonuses, streaks, shields, experience points, levels, achievements, records, timeline, live announcements, trusted administration, moderation, versioned shared libraries, Rulebook, Points Guide, error monitoring, Firebase Hosting and transparent Legacy Coach.

## Verification and deployment

The authoritative Windows verification for v0.14.0 is complete:

- ESLint passed with no warnings or errors.
- All **61 domain tests** passed.
- All **25 Firestore Security Rules tests** passed.
- The Vite production build passed.
- `npm run check:release` confirmed v0.14.0 and Firebase Hosting target `app`.
- `npm audit` still reports the known React Router advisory; do not run `npm audit fix --force`.

The required Firestore inspection was completed before deployment. Retired Team records and dummy pre-v0.14 league records were confirmed as test data and removed. Core `users`, `challengeEntries` and `auditEvents` data was preserved.

The cleaned v0.14.0 Firestore Rules compiled and deployed without warnings. A seven-day Hosting preview was deployed, followed by production Hosting. A production smoke test confirmed that a Platform Administrator can create a themed season and its season-scoped Houses.

The complete functional, mobile, visual and accessibility review is intentionally deferred until the final pre-v1.0 review stage.

## Known limitations

- This release is not approved as v1.0.
- Power Plays, Diamonds, the complete Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive.
- A weekly roster change is currently a balanced one-for-one swap between two Houses.
- There is no server scheduler; an authorised leader or administrator opens a ballot, and an administrator finalises it after 24 hours.
- Friendly competition remains client-calculated and requires trusted server recalculation before prizes or money.
- The C.H.A.O.S. console is currently hidden while a season remains Draft, which can obscure the registration prerequisite.
- Account deletion, personal-data export, privacy/support information and first-use onboarding remain pre-v1.0 work.

## Immediate next step

Commit the deployed v0.14.0 state. Then improve C.H.A.O.S. prerequisite visibility without weakening its lifecycle or minimum-player safeguards. Do not declare v1.0.
