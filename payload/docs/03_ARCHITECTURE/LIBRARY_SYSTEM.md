# Champions Legacy

# Library System

---

# Purpose

The Resource Library System provides reusable, user-owned resources that can be referenced by multiple entries throughout Champions Legacy.

Rather than repeatedly entering the same information, users create resources once and reuse them whenever needed.

The library system reduces repetitive data entry, improves consistency and enables richer long-term analytics.

---

# Philosophy

The Resource Library is built on one simple principle:

> **Create once. Reuse forever.**

Whenever a user repeatedly enters the same information, that information is a candidate for the library system.

Libraries should minimise repetitive work while keeping entries quick and enjoyable.

---

# Design Principles

The library system follows these principles:

- Resources belong to individual users.
- Resources are reusable.
- Resources remain independent from entries.
- Entries reference resources rather than duplicating them.
- Resources evolve over time without affecting historical records.

---

# Core Architecture

```
User
│
└── Library
        │
        ├── Books
        ├── Exercises
        ├── Meals
        ├── Recipes
        ├── Running Routes
        ├── Skills
        └── Future Resources
```

Each library type follows the same architectural principles.

---

# Current Resource Types

## Books

Used by:

- Reading Entries

Typical information:

- Title
- Author
- Total Pages
- Usage Count

Purpose:

Prevent users from repeatedly entering book information.

---

## Exercises

Used by:

- Workout Entries

Typical information:

- Exercise Name
- Category
- Equipment
- Muscle Groups

Purpose:

Standardise exercise names and improve statistics.

---

# Planned Resource Types

Future library types may include:

- Meals
- Recipes
- Running Routes
- Skills
- Supplements
- Equipment
- Training Programs
- Meditation Sessions
- Stretching Routines

New resource types should reuse the existing library architecture wherever possible.

---

# Resource Lifecycle

Every resource follows the same lifecycle.

```
Create
    ↓
Search
    ↓
Select
    ↓
Reference
    ↓
Track Usage
    ↓
Update
```

Resources should become more valuable the more frequently they are used.

---

# Relationship with Entries

Entries never become the library item.

Entries reference the library item.

Example:

```
Book
│
├── Reading Entry
├── Reading Entry
├── Reading Entry
└── Reading Entry
```

This allows:

- Usage tracking
- Better statistics
- Less duplicated data
- Easier editing

Historical entries should preserve any values that must remain historically accurate.

---

# Search Experience

The library should provide:

- Instant search
- Autocomplete
- Duplicate prevention
- Recently used items
- Frequently used items

The goal is to minimise typing.

---

# Usage Tracking

Every resource may track usage information.

Examples include:

- Usage Count
- Last Used
- First Created
- Most Recent Activity

These metrics improve future recommendations and analytics.

---

# Ownership

Every resource belongs to exactly one user.

Users cannot modify another user's personal library unless future sharing features are introduced.

---

# Future Extensions

The Resource Library is designed to support:

- Favourites
- Collections
- Tags
- Sharing
- Import / Export
- Community Templates
- AI Suggestions
- Smart Recommendations

These features should extend the existing architecture rather than replace it.

---

# Design Rules

Before creating a new data structure, ask:

- Will users enter this repeatedly?
- Can it be reused?
- Will it improve statistics?
- Will it reduce typing?

If the answer is yes, the data likely belongs in the Resource Library.

---

# Out of Scope

This document does not define:

- Firestore implementation
- UI components
- Search algorithms
- Service implementation

Those concerns are documented elsewhere.