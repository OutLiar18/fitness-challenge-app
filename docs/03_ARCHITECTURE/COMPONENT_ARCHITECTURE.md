# Champions Legacy

# Component Architecture

---

# Purpose

This document defines the architectural responsibilities of React components within Champions Legacy.

Components are responsible for presenting information, collecting user input and coordinating interactions with the service layer.

Business logic should remain outside of components wherever practical.

---

# Design Philosophy

Champions Legacy follows a layered component architecture.

```
Application
      │
      ▼
Pages
      │
      ▼
Feature Components
      │
      ▼
Shared Components
      │
      ▼
Primitive UI Components
```

Each layer has a clearly defined responsibility.

Higher layers compose lower layers.

Lower layers should never depend on higher layers.

---

# Component Design Principles

Components should:

- Have one clear responsibility.
- Be reusable whenever practical.
- Be predictable.
- Be easy to test.
- Keep business logic to a minimum.

Components should **not**:

- Calculate points.
- Calculate XP.
- Perform Firestore queries directly (where avoidable).
- Duplicate business logic.
- Know unnecessary implementation details.

---

# Application Layer

## Purpose

The root of the application.

Responsible for:

- Global providers.
- Routing.
- Authentication context.
- Theme management.
- Global state.

Examples include:

- App
- Router
- Providers

---

# Page Layer

## Purpose

Pages represent complete user screens.

Responsibilities:

- Arrange feature components.
- Load required data.
- Coordinate page-level interactions.

Examples include:

- Dashboard
- Journal
- Statistics
- Profile
- League
- Settings

Pages should contain very little business logic.

---

# Feature Components

## Purpose

Feature Components implement complete pieces of functionality.

Examples include:

- Entry Form
- Statistics Dashboard
- Journal Timeline
- Library Manager
- Leaderboard

Feature Components:

- coordinate UI behaviour
- communicate with services
- compose shared components

---

# Shared Components

## Purpose

Reusable interface components used throughout the application.

Examples include:

- Buttons
- Cards
- Dialogs
- Forms
- Search Select
- Library Select
- Navigation

Shared components should remain generic.

---

# Primitive Components

## Purpose

The smallest reusable building blocks.

Examples include:

- Text
- Icon
- Badge
- Divider
- Loading Spinner

Primitive components should have no knowledge of business concepts.

---

# Data Flow

Component communication should remain predictable.

```
User Action
      │
      ▼
Component
      │
      ▼
Service
      │
      ▼
Firestore
      │
      ▼
Service
      │
      ▼
Component
      │
      ▼
Updated UI
```

Business logic should remain inside the service layer.

---

# State Management

State should exist at the lowest reasonable level.

Guidelines:

- Local UI state belongs inside components.
- Shared application state belongs in context or future global state management.
- Persistent data belongs in Firestore.
- Derived data belongs in services.

Avoid unnecessary prop drilling.

---

# Component Relationships

```
Page
│
├── Feature Component
│       │
│       ├── Shared Component
│       │       │
│       │       └── Primitive Component
│       │
│       └── Shared Component
│
└── Feature Component
```

Components should compose rather than duplicate.

---

# Reusability

Before creating a new component, ask:

- Does something similar already exist?
- Can an existing component be extended?
- Is this specific to one feature or reusable elsewhere?

Reusability should never make components unnecessarily complex.

---

# Naming Guidelines

Component names should describe purpose rather than appearance.

Prefer:

- EntryForm
- LibrarySelect
- StatisticsCard
- ProgressSummary

Avoid names such as:

- BlueBox
- BigCard2
- LeftPanel

Names should describe responsibility.

---

# Future Expansion

The component architecture is designed to support:

- League Mode
- Team Dashboards
- AI Coach
- Community Features
- Mobile Applications

New features should compose existing components whenever practical.

---

# Out of Scope

This document does not define:

- Styling
- Business logic
- Firestore
- Routing configuration
- Service implementations

These concerns are documented elsewhere.