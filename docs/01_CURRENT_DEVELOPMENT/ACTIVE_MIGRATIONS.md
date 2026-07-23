# Champions Legacy

# Active Migrations

---

# Purpose

This document tracks architectural migrations currently taking place within Champions Legacy.

A migration represents the replacement of an existing implementation with a newer architecture.

Once completed, migrations should be removed from this document and recorded in the project history.

---

# Migration Status

Current Phase:

🚧 Active Migrations

The goal is to complete all major architectural migrations before introducing new gameplay systems.

---

# Exercise Library Migration

Status:

🚧 In Progress

Objective:

Replace legacy exercise handling with the Resource Library architecture.

Completed:

- Exercise Library
- Difficulty Library
- Exercise Option Service
- Initial WorkoutForm integration

Remaining:

- Complete workout migration.
- Remove legacy exercise logic.
- Verify statistics.
- Remove duplicate option systems.

Priority:

High

---

# Points Engine v2

Status:

🚧 In Progress

Objective:

Replace legacy scoring with the new configuration-driven Points Service.

Completed:

- Centralised Points Service.
- Category score configuration.
- Statistics integration.

Remaining:

- Difficulty multipliers.
- Effective repetitions.
- Workout scoring.
- Cardio calculations.
- Manual bonus support.

Priority:

High

---

# Validation Migration

Status:

🚧 In Progress

Objective:

Standardise validation across every dynamic form.

Remaining:

- Remove legacy validation.
- Verify required fields.
- Standardise error messages.
- Ensure consistent behaviour across categories.

Priority:

High

---

# Documentation Migration

Status:

🚧 In Progress

Objective:

Replace legacy documentation with the new structured documentation system.

Completed:

- Project documentation redesign.
- Architecture documentation.
- Current Development documentation.

Remaining:

- Game Design.
- Development Guides.
- Design documentation.
- Chat Handover.
- Historical migration.

Priority:

Medium

---

# Migration Rules

Before closing a migration:

- Legacy implementation must be removed.
- Documentation must be updated.
- Statistics must be verified.
- Related services must be tested.
- Duplicate code must be eliminated.

A migration is not complete until the old implementation has been removed.

---

# Completed Migrations

Completed migrations should be moved to the project history and removed from this document.

This document should only contain migrations that are currently active.

---

# Guiding Principle

Finish migrations completely.

Avoid leaving permanent hybrid implementations within the codebase.