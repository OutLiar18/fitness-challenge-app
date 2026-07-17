# 🏆 Champions Legacy Challenge

# Changelog

All notable changes to Champions Legacy Challenge are documented here.

The project follows a simplified version of the Keep a Changelog format.

---

# Version 0.3.0 (Current Development)

## Added

### Architecture

- Configuration-driven category system
- Categories as the single source of truth
- Daily goal configuration
- Goal type configuration
- Score field configuration
- Centralized Points Engine
- Journal architecture

### Components

- SmartSelect component
- Welcome Card
- Statistics Card
- Category Grid
- Dynamic Entry Form
- Dynamic Entry Cards
- Journal component

### Services

- Entry Service
- Validation Service
- Statistics Service
- Points Service

### Validation

- Dynamic validation
- Required field validation
- Number validation
- Funny validation messages
- Random easter egg messages

### Dashboard

- Real-time Firestore updates
- Dynamic statistics
- Dynamic category rendering
- Journal extracted from Dashboard

### Forms

- Searchable dropdowns
- Keyboard navigation for SmartSelect
- Custom values
- Dynamic field rendering

### Data

Expanded SmartSelect datasets including:

- Fruit
- Exercises
- Cardio Activities
- Skills

### Documentation

- Project Bible
- Roadmap
- Handover
- Future Ideas

---

## Changed

- Mobile-first development philosophy adopted.
- Categories now define daily goals.
- Categories now define score fields.
- Statistics now calculate points through the Points Service.
- Dashboard no longer renders entries directly.
- Entry history moved into the Journal component.
- Removed unnecessary `scoreField` values from workout categories.
- Fixed Cardio and Skill category configuration.
- Business logic further separated from presentation.
- Improved project documentation.
- Improved project structure.

---

## Removed

- Firebase Storage integration.
- Image upload requirements.
- Photo proof fields.
- Proof upload workflow.
- Separate `dailyGoals.js` configuration.
- Dependency on stored entry points.

Reason:

The application now calculates all points from entry facts, making the Points Engine the single source of truth while remaining compatible with Firebase's free tier.

---

# Version 0.2.0

## Added

- Dynamic category system
- Dynamic form engine
- User profile creation
- Entry saving
- Entry deletion
- Firestore integration
- Dashboard
- Protected routes
- Firebase Authentication

---

# Version 0.1.0

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

# Upcoming

Planned for Version 0.4

- Journal date navigation
- Calendar picker
- Locked history
- Today's Challenge
- Progress bars
- Daily completion tracking
- Streak system
- XP
- Achievements

---

# Notes

This changelog tracks completed work only.

Ideas that are not yet scheduled belong in:

- FUTURE_IDEAS.md

Planned work belongs in:

- ROADMAP.md

---

# End of Document
