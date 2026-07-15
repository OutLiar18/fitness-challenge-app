# 🏆 Champions Legacy Challenge

# Architecture Decisions

Version: 1.0

---

# Purpose

This document records important architectural decisions made during the development of Champions Legacy Challenge.

Each decision explains:

- The problem
- The chosen solution
- Alternatives considered
- Why the decision was made
- Future implications

This helps future contributors (including future versions of ourselves) understand why the application is built the way it is.

---

# ADR-001

## Categories are the Single Source of Truth

### Status

Accepted

### Date

July 2026

### Problem

Many parts of the application need category information.

Examples include:

- Forms
- Validation
- Statistics
- Daily goals
- Units
- Score calculation
- Dashboard

Duplicating this information across multiple files would eventually cause inconsistencies.

### Decision

All category information is stored inside `categories.js`.

Every system reads from this configuration.

### Alternatives Considered

Separate files for:

- dailyGoals.js
- units.js
- validation.js
- scoreFields.js

### Why This Was Chosen

One configuration file reduces duplication.

Adding a category becomes significantly easier.

### Consequences

✅ Easier maintenance

✅ Fewer bugs

✅ Better scalability

---

# ADR-002

## Statistics Are Calculated Instead of Stored

### Status

Accepted

### Problem

Totals and points constantly change as challenge rules evolve.

Saving calculated values risks data becoming outdated.

### Decision

Entries store only facts.

Statistics are calculated whenever needed.

### Alternatives Considered

Store totals in Firestore.

### Why This Was Chosen

Historical data remains valid.

Rules can change without database migrations.

### Consequences

✅ Flexible

✅ Accurate

✅ Future proof

---

# ADR-003

## Mobile-First Development

### Status

Accepted

### Problem

Most participants will use the application on their phones.

Designing desktop-first usually creates poor mobile experiences.

### Decision

Every screen is designed for the smallest supported smartphone first.

Media queries progressively enhance larger devices.

### Alternatives Considered

Desktop-first

Responsive redesign afterwards

### Why This Was Chosen

Better usability.

Cleaner layouts.

Simpler CSS.

### Consequences

✅ Better accessibility

✅ Better touch interactions

---

# ADR-004

## Dynamic Form Engine

### Status

Accepted

### Problem

Creating a separate React form for every challenge category would result in duplicated code.

### Decision

Build one reusable EntryForm component driven entirely by category configuration.

### Alternatives Considered

One component per category.

### Why This Was Chosen

Far less duplicated code.

Much easier to maintain.

### Consequences

✅ New categories require minimal code.

---

# ADR-005

## SmartSelect Component

### Status

Accepted

### Problem

Long dropdown lists become frustrating on mobile devices.

### Decision

Create SmartSelect.

Features include:

- Search while typing
- Instant filtering
- Keyboard support
- Touch support
- Custom values

### Alternatives Considered

Native HTML select.

Autocomplete libraries.

### Why This Was Chosen

Better user experience.

Reusable everywhere.

### Consequences

✅ Faster data entry

✅ Less scrolling

---

# ADR-006

## Business Logic Lives in Services

### Status

Accepted

### Problem

React components become difficult to maintain when they contain business logic.

### Decision

Move calculations into dedicated services.

Examples:

- Entry Service
- Validation Service
- Statistics Service

### Alternatives Considered

Logic inside components.

### Why This Was Chosen

Cleaner architecture.

Better testing.

Reusable logic.

### Consequences

✅ Smaller components

✅ Easier debugging

---

# ADR-007

## Validation Is Configuration Driven

### Status

Accepted

### Problem

Every category has different validation requirements.

Hardcoding validation quickly becomes unmanageable.

### Decision

Validation reads directly from category definitions.

### Alternatives Considered

Manual validation per form.

### Why This Was Chosen

New categories inherit validation automatically.

### Consequences

✅ Less duplicated logic

---

# ADR-008

## Workouts Measure Repetitions

### Status

Accepted

### Problem

Workout categories contain many different exercises.

Users should not be forced to complete only one exercise to finish their daily goal.

### Decision

Daily progress is based on total repetitions across all exercises in the same category.

Example

30 Push-ups

+

20 Pull-ups

=

50 Upper Body reps

### Alternatives Considered

Track each exercise independently.

### Why This Was Chosen

More natural workouts.

Encourages exercise variety.

Simplifies progress tracking.

### Consequences

✅ Better user experience

✅ More flexibility

---

# ADR-009

## Humour Is Part of the User Experience

### Status

Accepted

### Problem

Validation errors and repetitive actions can make habit tracking feel boring.

### Decision

Include:

- Funny validation messages
- Easter eggs
- Encouraging feedback
- Rare surprise messages

### Alternatives Considered

Standard system messages.

### Why This Was Chosen

Makes the application memorable.

Encourages continued engagement.

### Consequences

✅ Higher enjoyment

✅ Stronger personality

---

# ADR-010

## Ideas Are Recorded, Not Built Immediately

### Status

Accepted

### Problem

New ideas appear constantly during development.

Implementing every idea immediately causes scope creep.

### Decision

Store ideas inside FUTURE_IDEAS.md.

Continue working on the current sprint.

### Alternatives Considered

Changing priorities whenever inspiration strikes.

### Why This Was Chosen

Keeps development focused.

Prevents unfinished features.

### Consequences

✅ Consistent progress

✅ Better planning

---

# Future Decisions

Future architecture changes should continue using this format.

Every significant decision should receive a new ADR.

---

# End of Document