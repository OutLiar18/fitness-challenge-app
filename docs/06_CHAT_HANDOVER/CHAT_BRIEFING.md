# Champions Legacy Challenge — Chat Briefing

<!-- RELEASE_STATUS: DEPLOYED -->
Current source: v0.23.0  
Current production: v0.23.0  
Official name: Champions Legacy Challenge  
Production URL: https://champions-legacy-challenge.web.app

## Immediate workflow

Apply one main updater → verify on Windows → deploy Firestore Rules and Hosting → run the included release finaliser → commit. Do not create a separate docs-only archive. Never declare or tag v1.0 without explicit approval.

## v0.23.0 candidate

Themed Power Plays are implemented for new `season-houses-v3` seasons:

- ten base category plays;
- unique theme-specific names, for example **Release the Kraken** for mythological Water;
- custom 2×/3× one- or multi-category plays;
- one official week per assignment;
- random selection without replacement;
- every selected/redrawn/corrected-away ID remains consumed for the season;
- activity-date multiplier, before activity cap;
- evidence/progression bonus exclusions;
- individual, House, honours, Command Centre and trusted-reconciliation integration.

Expected Windows gates: 120 domain tests, 51 Rules tests, clean lint/build and v0.23.0 release-readiness.

## Locked future decisions

- v0.24: one-week post-move roster lock and weekly composition-balance foundation.
- Diamonds/player prices/transfer market rejected.
- Five Fires intended but still needs rules.
- Buddy Bonuses and late twists later.
- Weekly gender-composition balancing is required but formula/privacy details remain to be locked.

## Known boundaries

- Existing v1/v2 seasons remain Power Play-disabled.
- No background scheduler.
- Player may refresh at the start of a new official week.
- Eight known dependency advisories; never run automatic/forced audit fix during release.
- Keep private Admin SDK credentials and reports outside the repository.
