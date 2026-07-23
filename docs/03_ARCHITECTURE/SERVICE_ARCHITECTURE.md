# Champions Legacy

# Service Architecture

---

# Purpose

This document defines the responsibilities and interactions of the service layer within Champions Legacy.

Services contain the application's business logic.

They transform user actions into meaningful outcomes while keeping the user interface simple and Firestore independent of business rules.

Services should be reusable, predictable, loosely coupled and focused on a single responsibility wherever practical.

---

# Design Philosophy

The service layer sits between the user interface and data storage.

```
User Interface
        │
        ▼
Business Services
        │
        ▼
Firestore
```

The responsibilities of each layer are intentionally separated.

The user interface requests work.

Services perform work.

Firestore stores facts.

---

# Core Principles

Services should:

- Contain business logic
- Validate inputs
- Coordinate related operations
- Calculate derived values
- Read and write Firestore data
- Reuse other services where appropriate

Services should not:

- Render UI
- Manage React component state
- Contain presentation logic
- Manipulate layouts
- Depend on pages or components

Business logic should remain independent of the user interface.

---

# Shared Tracking Engine

One of the defining principles of Champions Legacy is that users should only record an activity once.

The application is responsible for updating every affected system automatically.

For example:

```
Challenge Entry
        │
        ▼
Validation
        │
        ▼
Entry Stored
        │
        ▼
Points Updated
        │
        ▼
Statistics Updated
        │
        ▼
Achievements Checked
        │
        ▼
Streak Updated
        │
        ▼
League Progress Updated (if applicable)
        │
        ▼
Team Progress Updated (if applicable)
```

A single user action may affect multiple independent systems.

The user should never have to perform duplicate actions to keep different parts of the application synchronised.

---

# Service Domains

Services are organised by responsibility rather than file type.

---

# Entry Services

## Purpose

Manage user activity records.

### Responsibilities

- Create entries
- Update entries
- Delete entries
- Validate activity data
- Normalise activity data
- Store factual information

### Current Examples

- entryService
- validationService

---

# Progress Services

## Purpose

Calculate long-term progression.

### Responsibilities

- Points
- XP
- Levels
- Streaks
- Achievements
- Milestones

### Current

- pointsService

### Planned

- xpService
- levelService
- achievementService
- streakService

Progress services calculate rewards.

They should never overwrite the original activity data.

---

# Statistics Services

## Purpose

Generate analytical information from recorded entries.

### Responsibilities

- Totals
- Averages
- Trends
- Personal Bests
- Historical summaries

Statistics should be calculated from stored activity data wherever practical.

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

### Current

- libraryService

Future library types should reuse the same architecture.

---

# League Services

## Purpose

Manage seasonal competition.

### Responsibilities

- League membership
- Teams
- Rankings
- League progression
- Seasonal rewards
- League archives

League services operate independently of Personal Progress.

League participation contributes towards Personal Progress, but Personal Progress does not automatically contribute towards every league.

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

Communicate meaningful events.

Examples include:

- Achievement unlocked
- Milestone reached
- League started
- Reminder notifications
- Team updates

Notifications should celebrate progress without becoming intrusive.

---

# Intelligence Services

## Purpose

Provide personalised guidance.

Future responsibilities include:

- AI Coach
- Habit analysis
- Behaviour trends
- Goal recommendations
- Personal insights

These services should assist users rather than make decisions for them.

---

# Authentication Services

## Purpose

Manage user identity.

Responsibilities include:

- Registration
- Sign in
- Session management
- Profile creation

Authentication should remain isolated from application business logic.

---

# Service Relationships

Services should cooperate through clearly defined responsibilities.

```
Entry Service
        │
        ▼
Progress Services
        │
        ├─────────────► Statistics Services
        │
        ├─────────────► Achievement Services
        │
        ├─────────────► Streak Services
        │
        ├─────────────► League Services
        │
        └─────────────► Notification Services
```

Each service owns its own responsibility.

Services should communicate through well-defined interfaces rather than duplicating business logic.

---

# Dependency Rules

Services may depend on:

- Configuration
- Firestore
- Other services where appropriate

Services should never depend on:

- React components
- Pages
- Layouts
- Styling

Business rules should remain independent of presentation.

---

# Error Handling

Services should return predictable results.

Validation errors should be handled consistently.

Unexpected failures should be logged and presented to users in an understandable and friendly manner.

---

# Future Expansion

As Champions Legacy grows, additional service domains may be introduced.

Examples include:

- Analytics Services
- Social Services
- Marketplace Services
- External API Integration

New functionality should extend existing service domains wherever practical rather than introducing isolated business logic.

---

# Out of Scope

This document does not define:

- Firestore collections
- Data models
- React components
- UI behaviour
- Navigation
- Styling

These topics are documented elsewhere within the architecture.