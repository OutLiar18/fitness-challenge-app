# Champions Legacy

# Service Architecture

---

# Purpose

This document defines the responsibilities of the service layer within Champions Legacy.

Services contain the business logic of the application.

They transform user actions into meaningful outcomes while keeping the user interface simple and the database independent of business rules.

Services should be reusable, predictable and independent wherever practical.

---

# Design Philosophy

The service layer acts as the bridge between the user interface and data storage.

```
User Interface
        │
        ▼
Business Services
        │
        ▼
Firestore
```

User interface components should request work.

Services should perform work.

Firestore should store results.

---

# Service Design Principles

Every service should have one clearly defined responsibility.

Services should:

- contain business logic
- validate inputs
- coordinate related operations
- calculate derived values
- communicate with Firestore

Services should not:

- render UI
- manage component state
- directly manipulate layouts
- contain presentation logic

---

# Service Domains

Rather than organising services by files, Champions Legacy organises them by responsibility.

---

# Entry Services

## Purpose

Responsible for recording and managing user activities.

### Responsibilities

- Create entries
- Update entries
- Delete entries
- Validate activity data
- Normalise activity data
- Calculate derived entry values

### Current Examples

- entryService
- validationService

---

# Progress Services

## Purpose

Responsible for calculating user progression.

### Responsibilities

- Points
- XP
- Levels
- Streaks
- Achievements
- Milestones

### Current Examples

- pointsService

### Planned

- xpService
- levelService
- achievementService
- streakService

---

# Statistics Services

## Purpose

Generate statistics from recorded entries.

### Responsibilities

- Totals
- Averages
- Trends
- Personal Bests
- Historical summaries

Statistics should always be derived from Entries whenever practical.

---

# Library Services

## Purpose

Manage reusable user-owned resources.

### Responsibilities

- Create library items
- Search libraries
- Prevent duplicates
- Track usage
- Provide autocomplete

### Current Examples

- libraryService

Future library types should reuse the same architecture.

---

# League Services

## Purpose

Manage competitive systems.

### Responsibilities

- Seasons
- Teams
- Rankings
- League progression
- Awards

These services are planned for future versions.

---

# Journal Services

## Purpose

Manage reflective content.

### Responsibilities

- Daily journals
- Timeline
- Reflection prompts
- Progress summaries

---

# Notification Services

## Purpose

Communicate important information to users.

Examples include:

- Achievement unlocked
- League started
- Reminder notifications
- Milestone reached

---

# Intelligence Services

## Purpose

Provide personalised recommendations.

Future responsibilities include:

- AI Coach
- Habit analysis
- Goal suggestions
- Personal insights
- Behaviour trends

---

# Authentication Services

## Purpose

Manage user identity.

Responsibilities include:

- Sign in
- Registration
- Session management
- Profile creation

Authentication should remain isolated from business logic.

---

# Service Relationships

```
Entry Service
        │
        ▼
Progress Service
        │
        ▼
Statistics Service
        │
        ▼
Achievement Service
```

Services should cooperate through clear interfaces rather than duplicating logic.

---

# Dependency Rules

Services may depend on:

- Configuration
- Firestore
- Other services (when appropriate)

Services should never depend on:

- React components
- Pages
- UI layouts

Business logic must remain independent of presentation.

---

# Error Handling

Services should return meaningful, predictable results.

Validation errors should be handled consistently.

Unexpected failures should be logged and surfaced in a user-friendly way.

---

# Future Expansion

As Champions Legacy grows, additional service domains may be introduced.

Examples include:

- Analytics Services
- Social Services
- Marketplace Services
- API Integration Services

New services should extend existing domains wherever possible rather than creating isolated logic.

---

# Out of Scope

This document does not define:

- Firestore collections
- React components
- UI behaviour
- Navigation
- Styling

These concerns are documented elsewhere within the architecture.