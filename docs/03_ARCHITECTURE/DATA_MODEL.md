# Champions Legacy

# Data Model

---

# Purpose

This document defines the core entities that make up Champions Legacy and the relationships between them.

It describes the business concepts of the platform rather than how those concepts are stored in the database.

Every feature, service and user interaction should ultimately operate on one or more of these entities.

The data model serves as the conceptual foundation for the entire platform.

---

# Design Principles

The data model follows several guiding principles.

- Each entity represents a real concept within Champions Legacy.
- Each entity has a single, clearly defined responsibility.
- Relationships between entities should be simple and predictable.
- Storage implementation should not influence the design of the model.
- Entities should remain stable even if technology changes.

---

# Core Entity Overview

The platform is built around the following primary entities.

```
User
│
├── Profile
├── Personal Progress
├── League Progress
├── Library
├── Entries
├── Journal
├── Achievements
└── Statistics

League
│
├── Seasons
├── Teams
├── Members
└── Leaderboards

Challenge
│
├── Categories
├── Rules
├── Scoring
└── Activities
```

---

# Entity Definitions

## User

### Purpose

Represents a person using Champions Legacy.

The User is the central entity of the platform.

Almost every other entity belongs to, references or interacts with a User.

### Responsibilities

- Own personal data
- Record activities
- Participate in leagues
- Earn achievements
- Build progression
- Maintain libraries
- Write journal entries

### Relationships

Owns:

- Profile
- Entries
- Journal
- Library
- Personal Progress
- Statistics

Participates in:

- Teams
- Leagues
- Challenges

---

## Profile

### Purpose

Stores information that identifies and personalises a user's experience.

### Responsibilities

- Display name
- Avatar
- Preferences
- Settings
- Personalisation

---

## Entry

### Purpose

Represents a single recorded activity.

Entries are the primary source of progression within Champions Legacy.

Every tracked action eventually becomes an Entry.

### Examples

- Water intake
- Reading session
- Workout
- Run
- Skill practice
- Daily steps

### Relationships

Belongs to:

- User

References:

- Category

May reference:

- Library Item

Contributes to:

- Statistics
- XP
- Points
- Achievements
- Timeline

---

## Category

### Purpose

Defines the type of activity an Entry represents.

Categories determine:

- validation
- scoring
- statistics
- presentation
- forms

Examples include:

- Water
- Reading
- Running
- Upper Body
- Lower Body
- Core
- Skill Development

Categories are configuration-driven rather than hard-coded wherever possible.

---

## Library Item

### Purpose

Represents a reusable object owned by a user.

Library Items reduce repetitive data entry.

### Examples

Current:

- Books
- Exercises

Future:

- Meals
- Recipes
- Running Routes
- Skills
- Supplements

Library Items may be referenced by Entries.

---

## Journal

### Purpose

Stores personal reflections.

Journal entries provide qualitative context alongside quantitative progress.

Journal entries do not directly affect progression but strengthen reflection.

---

## Personal Progress

### Purpose

Represents permanent lifelong progression.

Never resets.

Examples include:

- Lifetime XP
- Lifetime Level
- Lifetime Statistics
- Titles
- Personal Bests

---

## League Progress

### Purpose

Represents seasonal competitive progression.

League Progress resets at the end of each season.

Examples include:

- League XP
- League Rank
- Team Contribution
- Seasonal Achievements

---

## Achievement

### Purpose

Represents permanent recognition for significant accomplishments.

Achievements encourage long-term motivation.

Examples:

- First Workout
- Read 100 Books
- 365 Day Streak

Achievements should never expire.

---

## Statistic

### Purpose

Represents calculated information derived from Entries.

Statistics are generated rather than manually entered.

Examples include:

- Total Water
- Total Distance
- Workout Count
- Reading Hours
- Average Daily Score

---

## Team

### Purpose

Represents a group of Users working together.

Teams participate within Leagues and Challenges.

---

## League

### Purpose

Represents a structured competitive environment.

A League contains:

- Seasons
- Teams
- Leaderboards
- Rules
- Awards

---

## Season

### Purpose

Represents a fixed competitive period.

Each season has:

- start date
- end date
- leaderboard
- awards

League Progress belongs to a Season.

---

## Challenge

### Purpose

Represents a structured event with defined rules.

Challenges determine:

- eligible activities
- scoring rules
- participants
- duration

Challenges may exist independently or inside a League.

---

# Entity Relationships

```
User
│
├── owns Profile
├── owns Entries
├── owns Journal
├── owns Library
├── owns Personal Progress
├── owns Statistics
├── earns Achievements
│
├── joins Team
│
└── participates in League
        │
        └── contains Seasons
                │
                └── contains Challenges

Entry
│
├── belongs to User
├── belongs to Category
├── may reference Library Item
│
├── generates Statistics
├── awards XP
├── awards Points
└── contributes to Achievements
```

---

# Design Rules

Every new feature should either:

- introduce a new entity,

or

- extend an existing entity.

Creating duplicate entities should be avoided.

Business concepts should remain independent from storage implementation.

---

# Future Expansion

The model is intentionally designed to support future systems including:

- AI Coach
- Meal Tracking
- Sleep Tracking
- Budget Tracking
- Habit Analysis
- Friends
- Clubs
- Mentorship
- Marketplace
- API Integrations

These future systems should extend the existing model wherever possible rather than introducing parallel structures.

---

# Out of Scope

This document does not define:

- Firestore collections
- Document IDs
- Field names
- Indexes
- Security rules
- React components
- Service implementations

Those topics are covered by their respective architecture documents.