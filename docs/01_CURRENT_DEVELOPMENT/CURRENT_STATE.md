# Champions Legacy Challenge — Current State

Version: 0.11.0  
Last updated: 1 August 2026  
Status: Pre-1.0 community and coaching foundation implemented; local verification required

## Product state

Champions Legacy Challenge now has complete personal tracking, progression, communication, administration, team, seasonal league and transparent coaching foundations. v0.11.0 remains deliberately pre-1.0 so all systems can be tested together and changed after user review.

## Implemented in v0.11.0

### Teams

- A player may belong to one persistent team at a time.
- Captains create a team with a local emblem, description, motto and eight-character invitation code.
- Players join through the invitation code without uploading or hosting team media.
- The roster displays each member’s current weekly factual activity points, active days, entry count and streak.
- Captains may edit team identity and atomically transfer captaincy.
- Non-captains may leave without affecting personal history.
- Team progress is accountability information, not a separate scoring engine.

### Leagues

- League Administrators and Platform Administrators may create seasonal leagues.
- Leagues move forward through Draft, Registration, Active, Completed and Archived stages.
- Every league freezes the `consistency-v1` ruleset and `points-v2` scoring-engine version.
- A player joins during Registration and records no duplicate activity.
- The same factual entry creates an immutable league contribution snapshot while a league is Active.
- Daily activity contribution is capped at 20 points and each active day earns a five-point participation bonus.
- Player and team standings are derived from contribution snapshots.
- League creation and lifecycle changes are audited.

### Legacy Coach

- Guidance is generated locally without an external artificial-intelligence service or subscription cost.
- The Coach compares the current seven-day period with the previous seven days.
- Every recommendation includes an action, evidence and an explanation.
- Players control whether guidance is enabled, its tone and its focus.
- Coach preferences are private owner-scoped Firestore data.
- The Coach does not diagnose health conditions or alter points, goals or league standings.

## Existing complete systems

- Authentication, ten factual activity categories and local-calendar-safe Journal.
- Explainable scoring, Running/Cardio rules and effective repetitions.
- Goals, moderate bonuses, streaks, shield, experience points, levels, achievements and records.
- Responsive navigation, profiles, built-in avatars and announcement read status.
- Audited administration, moderation, versioned shared libraries and client error reporting.
- Firestore Emulator tests and Firebase Hosting preview configuration.

## Verification targets

- Domain tests: **44**.
- Firestore Rules emulator tests: **12**.
- ESLint and production build must pass on the Windows development computer.
- `npm run check:release` must pass before deployment is accepted.

## Known limitations

- v0.11.0 is not approved as v1.0.
- Team weekly snapshots are friendly accountability data derived and submitted by each member’s client; they are not suitable for prize competition.
- League contribution facts are protected and tied to an entry, membership and frozen rules version, but authoritative server-side recalculation is deferred.
- A captain must transfer captaincy before leaving; team deletion is intentionally unavailable.
- League invitations are access codes, not high-security secrets.
- League archive privacy controls and seasonal awards remain deferred.
- Legacy Coach is deterministic guidance, not medical or professional advice.
- Historical entry pagination and server-side administrative search remain future scale work.

## Immediate next step

Apply the v0.11.0 update, run all local and emulator checks, deploy updated Firestore Rules, and test the Teams, Leagues and Legacy Coach workflows in development. Do not declare v1.0 or begin final review until these systems are stable.
