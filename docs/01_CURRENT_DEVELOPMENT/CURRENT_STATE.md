# Champions Legacy Challenge — Current State

Version: 0.13.1  
Last updated: 2 August 2026  
Status: Pre-1.0 rule and scoring reference implemented; Windows verification and integrated review pending

## Product state

The pre-review platform now includes personal tracking, progression, communication, administration, Teams, seasonal Leagues, Legacy Coach, a searchable Challenge Rulebook and a public Points Guide.

## Added in v0.13.1

### Challenge Rulebook

- Protected `/rules` route available through the More menu and cross-linked from the Points Guide.
- Search, status filters, jump links and accessible accordion sections prevent a wall of text.
- Every rule has a stable identifier and may reference its 2025 source rule.
- Rules are separated into current platform rules, season options and inactive legacy mechanics.
- Current daily and weekly targets are rendered from `GOAL_CONFIGURATIONS`.
- The original challenge wording is retained where it remains accurate.
- App-specific integrity, privacy, account security, safety and league-history rules were added.
- Pocket Week, random Houses, Power Plays, Transfer Market, Buddy Bonuses, photo bonuses and Five Fires are clearly marked inactive rather than falsely promised.

### Points Guide

- Protected `/points-guide` route available through the More menu and Rulebook action.
- Category scoring ladders are generated from the actual Water, Steps, Reading, Skill, Cardio, Running and workout constants.
- Zero-point ranges are shown explicitly.
- Fruit uses the live five-points-per-whole-serving formula.
- Running eligibility, automatic Cardio contribution, difficulty multipliers, visible goal bonuses and league-day scoring are shown.
- Hidden progression surprises and non-competitive experience rewards are intentionally omitted.

### Architecture and quality

- Rulebook filtering and scoring-guide generation live outside React components.
- Navigation identifiers and reference routes are regression tested.
- Current release metadata, error reports, library publishing defaults and bundled announcements align with v0.13.1.

## Existing complete systems

- Authentication, profiles, Legacy Avatars and protected routes.
- Ten factual activity categories, central validation and local-calendar-safe Journal.
- Points Engine v2, Running/Cardio cross-contribution and Effective Repetitions.
- Goals, moderate bonuses, streaks, shields, experience points, levels, achievements, records and timeline.
- Live announcements, trusted administration, moderation, immutable audit events and versioned shared libraries.
- Teams, consistency-weighted Leagues and transparent local Legacy Coach.
- First-party error reporting and branded Firebase Hosting.
- v0.12 integrity, security, accessibility and recovery hardening.

## Verification targets

- Domain tests: **54**.
- Firestore Rules Emulator tests: **15**.
- ESLint and production build must pass on the Windows development computer.
- `npm run check:release` must confirm v0.13.1 and the branded Hosting target.

## Known limitations

- This release is not approved as v1.0.
- The app does not yet upload or adjudicate evidence.
- Legacy Pocket Week, Power Play, Transfer Market, Buddy Bonus and side-quest mechanics are inactive.
- Rules are bundled and versioned in source; administrator-authored season rule packs are future work.
- Teams and Leagues retain the trust and scale boundaries listed in `KNOWN_ISSUES.md`.
- Account deletion, personal-data export, privacy/support information and first-use onboarding remain pre-v1.0 work.

## Immediate next step

Apply v0.13.1, complete any outstanding v0.12 league-capacity migration check, run all automated verification, deploy Hosting, and then perform the user’s complete functional and visual review. Do not declare v1.0.
