# Champions Legacy

# Configuration System

---

# Purpose

This document defines the configuration-driven architecture used throughout Champions Legacy.

Rather than hard-coding behaviour into components, the platform uses configuration objects to define categories, forms, validation, scoring and other dynamic behaviour.

This approach improves maintainability, scalability and consistency while reducing duplicated code.

---

# Philosophy

Champions Legacy follows the principle:

> **Data drives behaviour.**

Whenever practical, new functionality should be introduced through configuration rather than custom code.

Configuration allows the application to grow without requiring significant structural changes.

---

# Design Principles

The configuration system follows these principles:

- Configuration defines behaviour.
- Components render behaviour.
- Services execute behaviour.
- Firestore stores results.

Responsibilities should remain clearly separated.

---

# Current Configuration Domains

The platform currently uses configuration for:

- Categories
- Forms
- Validation
- Units
- Display Names
- Library Types

Future versions will expand this approach significantly.

---

# Category Configuration

Categories define the behaviour of tracked activities.

Examples include:

- Water
- Reading
- Running
- Upper Body
- Lower Body
- Core
- Cardio
- Skill Development
- Steps

Each category defines information such as:

- Display name
- Icon
- Colour
- Input fields
- Units
- Validation rules
- Statistics behaviour
- Scoring behaviour

Categories should be added through configuration whenever possible.

---

# Form Configuration

Forms should be generated from configuration rather than manually built.

Configuration determines:

- Required fields
- Optional fields
- Input types
- Labels
- Placeholders
- Default values

This allows new activity types to be introduced with minimal UI changes.

---

# Validation Configuration

Validation rules should be defined independently from components.

Examples include:

- Required fields
- Numeric ranges
- Maximum values
- Minimum values
- Allowed options

Validation should remain consistent across the application.

---

# Scoring Configuration

Scoring behaviour should be configurable.

Configuration may define:

- Base points
- Multipliers
- Effective reps
- Daily limits
- Bonus conditions

Business calculations remain the responsibility of the service layer.

Configuration defines the rules.

Services perform the calculations.

---

# Statistics Configuration

Each category should define how it contributes to statistics.

Examples include:

- Distance
- Duration
- Repetitions
- Volume
- Water
- Reading Time

This allows statistics to grow automatically as new categories are introduced.

---

# Library Configuration

Library-enabled categories should declare their reusable resources.

Examples:

Current:

- Books
- Exercises

Future:

- Meals
- Recipes
- Running Routes
- Skills

Components should not need to know which categories use libraries.

Configuration should define this.

---

# Display Configuration

Presentation details should be configurable.

Examples include:

- Icons
- Colours
- Labels
- Units
- Formatting

Separating presentation from logic improves consistency.

---

# Future Configuration Domains

Future systems may include configuration for:

- Achievements
- XP Levels
- Titles
- Leagues
- Teams
- Badges
- Notifications
- AI Coach
- Themes
- Permissions
- Challenges

Where practical, these systems should follow the same configuration philosophy.

---

# Benefits

A configuration-driven architecture provides several advantages:

- Less duplicated code.
- Faster feature development.
- Easier testing.
- Better consistency.
- Reduced maintenance.
- Greater scalability.

It also enables non-structural changes without requiring major code rewrites.

---

# Design Rules

Before introducing custom logic, ask:

- Can this behaviour be represented through configuration?
- Can an existing configuration be extended?
- Will this make future features easier to build?

Custom implementations should only be used when configuration cannot reasonably describe the required behaviour.

---

# Out of Scope

This document does not define:

- Firestore collections
- Component behaviour
- Business logic
- UI styling

These topics are covered elsewhere within the architecture documentation.