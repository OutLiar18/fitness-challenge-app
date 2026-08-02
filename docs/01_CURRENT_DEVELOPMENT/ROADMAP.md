# Champions Legacy Challenge — Roadmap

Last updated: 2 August 2026

## Completed foundations

### Phase 1 — Core tracking

Authentication, profiles, factual entries, ten activity categories, validation, local dates, libraries, suggestions and Points Engine v2.

### Phase 2 — Personal progression

Goals, moderate bonuses, streak/shield, experience points, levels, achievements, records, timeline, responsive navigation and Legacy Avatars.

### Phase 3 — Administration and communication

Live announcements, trusted roles, moderation, audit history, versioned shared libraries, pagination and first-party error reporting.

### Phase 4 — Teams, Leagues and Legacy Coach

Persistent Teams, captain transfer, seasonal `consistency-v1` Leagues, entry-linked standings and transparent local coaching.

### Phase 5 — Pre-review hardening

v0.12.0 added entry-shape security, invite privacy, team-week integrity, transactional league capacity, permanent final standings, accessibility and branded deployment recovery.

### Phase 6 — Official player reference

Status: **Implemented in v0.13.1; Windows and integrated verification required**

- Searchable in-app Rulebook.
- Current, season-option and inactive-rule separation.
- Original 2025 rule-source mapping.
- Dynamic current goal table.
- Points Guide generated from live scoring constants.
- Explicit zero-point ranges, public formulas, difficulty multipliers and visible bonuses.
- Hidden progression rewards excluded from the guide.

## Remaining before v1.0

1. Pass v0.13.1 local, Emulator, Hosting and integrated checks.
2. Conduct the user’s complete mobile and desktop review.
3. Implement review corrections in one or more pre-1.0 releases.
4. Add account deletion, personal-data export, privacy/support information and first-use onboarding.
5. Complete final accessibility, performance, dependency and release-candidate QA.
6. Obtain explicit user approval before naming or tagging v1.0.

## Candidate future rule systems

These are not committed features until separately designed and approved:

- Evidence attachments and administrator adjudication.
- Administrator-authored season rule packs and effective dates.
- Pocket Week or activity banking.
- Power Play voting and category multipliers.
- Buddy Bonus group verification.
- Transfer-market game mechanics.
- Side quests, season awards and trophy-cabinet integration.

## Guardrails

- Runtime scoring constants, not documentation tables, remain the calculation source of truth.
- Public guides must be generated from those constants where practical.
- Inactive mechanics must never imply points or functionality.
- Never duplicate scoring in Teams, Leagues or UI components.
- Do not call the product v1.0 until explicitly approved.
