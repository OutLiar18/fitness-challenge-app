# 🏆 Champions Legacy Challenge

# CHANGELOG

All notable changes to Champions Legacy Challenge are documented here.

This project loosely follows the **Keep a Changelog** format.

Only completed work belongs in this document.

Future plans belong in:

- ROADMAP.md

Current work belongs in:

- PROJECT_STATE.md

Current implementation belongs in:

- CURRENT_STATE.md

---

# Version 0.5.0 (Current Development)

## Added

### Documentation

- PROJECT_STATE.md introduced as the project's living development context.
- Expanded documentation workflow.
- Standardised documentation update process.

### Architecture

- Introduced Exercise Library architecture.
- Introduced Difficulty Library.
- Introduced ExerciseOptionService.
- Introduced migration architecture for exercise system.
- Standardised category naming toward camelCase.

### Points Engine

- Began migration to Points Engine v2.
- Introduced configurable point tables.
- Introduced difficulty multiplier architecture.
- Introduced Effective Rep calculation framework.
- Added support for future manual bonuses.
- Added support for future achievement rewards.

### Forms

- WorkoutForm now begins using ExerciseOptionService.
- Exercise selection now driven by Exercise Library.

---

## Changed

- Project focus shifted from feature development to architecture stabilisation.
- Exercise system migrated away from the legacy options architecture.
- Documentation expanded to support long-term maintenance.
- Project workflow now treats documentation as part of implementation.

---

## Fixed

- Category naming inconsistencies.
- Workout architecture wiring.
- Exercise selection architecture.
- Multiple service integration issues discovered during migration.

---

## Removed

- Continued removal of legacy options.js dependencies.
- Continued removal of duplicated exercise definitions.

---

# Version 0.4.0

## Added

### Architecture

- Configuration-driven category system.
- Categories as the single source of truth.
- Daily goal configuration.
- Goal type configuration.
- Centralised Points Service.
- Journal architecture.

### Components

- SmartSelect
- Welcome Card
- Statistics Card
- Category Grid
- Dynamic Entry Form
- Dynamic Entry Cards
- Journal component

### Services

- EntryService
- ValidationService
- StatisticsService
- PointsService

### Validation

- Dynamic validation
- Required field validation
- Number validation
- Validation message service
- Easter egg validation messages

### Dashboard

- Real-time Firestore updates
- Dynamic statistics
- Dynamic category rendering
- Journal extracted from Dashboard

### Forms

- Searchable dropdowns
- Keyboard navigation
- Custom values
- Dynamic rendering

### Data

Expanded datasets for:

- Fruit
- Exercises
- Cardio
- Skills

### Documentation

- PROJECT_BIBLE
- ROADMAP
- HANDOVER
- FUTURE_IDEAS
- ARCHITECTURE
- DESIGN_LANGUAGE

---

## Changed

- Adopted mobile-first philosophy.
- Categories now define goals.
- Statistics consume PointsService.
- Dashboard separated from Journal.
- Business logic further separated from UI.
- Improved project structure.

---

## Removed

- Firebase Storage integration.
- Image uploads.
- Photo proof workflow.
- Stored point values.
- Separate dailyGoals configuration.

Reason:

The application now stores only factual user data while calculating points dynamically.

---

# Version 0.3.0

## Added

- Dynamic category system
- Dynamic form engine
- User profiles
- Entry saving
- Entry deletion
- Firestore integration
- Dashboard
- Protected routes
- Firebase Authentication

---

# Version 0.2.0

## Added

- React + Vite project
- Firebase project
- Netlify deployment
- GitHub repository
- Initial project structure
- Login page
- Signup page
- Firestore setup

---

# Documentation Policy

This file records completed work only.

Every development session should update this document.

A development session is not complete until:

- CHANGELOG.md has been updated.
- CURRENT_STATE.md has been updated.
- PROJECT_STATE.md has been updated.

If architecture changes:

- ARCHITECTURE.md
- ARCHITECTURE_DECISIONS.md

must also be updated.

---

# End of Document