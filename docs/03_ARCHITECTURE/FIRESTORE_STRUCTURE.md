# Champions Legacy

# Firestore Structure

---

# Purpose

This document defines how the Champions Legacy data model is implemented within Firestore.

It describes the organisation of collections, ownership rules, document relationships and storage responsibilities.

This document is implementation-specific and may evolve as the platform grows.

---

# Design Principles

The Firestore structure follows these principles:

- Every user owns their own data.
- Data should be organised for predictable reads and writes.
- Frequently accessed data should be inexpensive to retrieve.
- Documents should remain reasonably small.
- Denormalisation is acceptable when it improves performance and simplicity.
- Business rules belong in services, not Firestore.

---

# Top-Level Collections

The application currently uses the following top-level collections.

```
users/
challengeEntries/

(planned)

leagues/
teams/
challenges/
announcements/
system/
```

---

# Collection Responsibilities

## users

### Purpose

Stores user accounts and permanent profile information.

Each authenticated user owns exactly one document.

### Responsibilities

- Profile
- Preferences
- Lifetime progression
- Statistics
- Settings
- Library

### Ownership

```
users/{userId}
```

Only the owning user may read or modify their personal document unless elevated permissions are introduced in the future.

---

## challengeEntries

### Purpose

Stores activity entries submitted by users.

Entries are immutable historical records whenever possible.

Each document represents a single recorded activity.

Examples include:

- Water
- Reading
- Running
- Workout
- Steps
- Skill Development

### Responsibilities

- Activity data
- Submission timestamp
- Calculated values
- Category-specific information

---

# User Subcollections

Each user document may contain subcollections for reusable personal resources.

Current structure:

```
users
└── {userId}
    └── library
```

---

## Library

### Purpose

Stores reusable user-owned items.

Current item types include:

- Books
- Exercises

Future item types may include:

- Meals
- Recipes
- Running Routes
- Skills
- Supplements

Each library item is reusable across multiple Entries.

---

# Relationships

```
User
│
├── owns Profile
├── owns Library
│
└── creates Entries

Entry
│
├── references Category
└── may reference Library Item
```

Firestore does not enforce relationships.

Services are responsible for maintaining referential integrity.

---

# Document Philosophy

Documents should represent complete business objects.

Avoid splitting small objects across multiple documents unnecessarily.

Keep related data together whenever practical.

Large historical datasets should be separated into dedicated collections.

---

# Derived Data

Some values should never be manually entered.

Instead they are calculated from Entries.

Examples include:

- XP
- Points
- Statistics
- Totals
- Streaks
- Achievement Progress

Derived values should always have a clear source.

---

# Ownership Rules

Every document should have a clear owner.

Examples:

| Document | Owner |
|----------|-------|
| User | User |
| Entry | User |
| Library Item | User |
| Journal Entry | User |
| Team | League |
| League | System |
| Challenge | League/System |

Ownership determines security rules.

---

# Current Collections

| Collection | Status |
|------------|--------|
| users | Implemented |
| challengeEntries | Implemented |
| users/{user}/library | Implemented |

---

# Planned Collections

Examples include:

```
leagues/

teams/

teamMembers/

journal/

achievements/

notifications/

leaderboards/

systemConfiguration/
```

Collection names may evolve as the platform develops.

---

# Data Lifecycle

Some data is permanent.

Examples:

- Profile
- Lifetime XP
- Achievements
- Library

Some data is seasonal.

Examples:

- League Rankings
- Team Scores
- Seasonal Awards

Some data is historical.

Examples:

- Entries
- Journals
- Activity Logs

Historical data should be preserved wherever practical.

---

# Firestore Responsibilities

Firestore is responsible for:

- Persistence
- Ownership
- Relationships
- Query performance

Firestore is **not** responsible for:

- Point calculations
- XP calculations
- Validation
- Business rules
- Permissions beyond ownership

These responsibilities belong to the service layer.

---

# Future Expansion

The Firestore structure should support:

- League Mode
- Team Mode
- AI Coach
- Notifications
- Social Features
- Personal Timeline
- Analytics
- API Integrations

Expansion should extend existing structures rather than duplicate them.

---

# Out of Scope

This document does not define:

- React components
- Services
- UI
- Point calculations
- XP calculations
- Security implementation details

Those topics are covered in their respective architecture documents.