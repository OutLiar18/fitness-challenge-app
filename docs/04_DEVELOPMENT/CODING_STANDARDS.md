# Champions Legacy

# Coding Standards

Version: 2.0

---

# Purpose

This document defines the coding standards used throughout Champions Legacy.

Consistent code is easier to understand, maintain and extend.

These standards apply to all future development.

---

# Philosophy

Code is read far more often than it is written.

Prioritise clarity over cleverness.

---

# Core Principles

Code should be:

- Readable
- Consistent
- Modular
- Reusable
- Predictable
- Well documented

---

# Naming Conventions

Names should clearly describe purpose.

Avoid abbreviations unless universally understood.

Prefer:

UserProfile

calculatePoints()

runningEntries

Avoid:

Data1

Temp

Stuff

value2

---

# File Naming

Use consistent naming throughout the project.

Examples:

pointsService.js

JournalCard.jsx

usePlayerProfile.js

Avoid inconsistent naming styles.

---

# Folder Structure

Files should belong in logical locations.

Avoid creating unnecessary folders.

Group by feature rather than file type whenever practical.

---

# Components

Components should:

- Have one responsibility.
- Be reusable.
- Remain small.
- Receive data through props.
- Avoid unnecessary internal logic.

---

# Services

Business logic belongs in services.

Services should:

- Be reusable.
- Avoid UI logic.
- Be independent of components.

---

# Configuration

Values that may change should live in configuration files rather than being hardcoded.

Examples include:

- Point values
- Limits
- Thresholds
- Feature flags

---

# Functions

Functions should:

- Perform one task.
- Have descriptive names.
- Minimise side effects.
- Return predictable results.

Prefer several small functions over one large function.

---

# Comments

Code should explain itself whenever possible.

Comments should explain:

Why

not

What

Avoid obvious comments.

---

# Error Handling

Errors should:

- Be handled gracefully.
- Provide useful messages.
- Never expose sensitive information.
- Avoid crashing the application unnecessarily.

---

# Duplication

Avoid duplicate logic.

If similar code appears multiple times, consider extracting it into a reusable function or service.

---

# Imports

Keep imports organised.

Remove unused imports before committing.

Avoid circular dependencies.

---

# Formatting

Formatting should remain consistent throughout the project.

Consistency is more important than personal preference.

---

# Performance

Optimise only when necessary.

Prefer readable code unless profiling demonstrates a measurable performance issue.

---

# Technical Debt

Temporary solutions should:

- Be documented.
- Be intentional.
- Be revisited.

Technical debt should never accumulate silently.

---

# Code Reviews

Before considering code complete, ask:

Is this understandable?

Can this be simplified?

Is it reusable?

Does it follow project conventions?

Would another developer immediately understand it?

---

# Guiding Principle

Write code that your future self will thank you for.

---

# Related Documentation

- DEVELOPMENT_OVERVIEW.md
- DEVELOPMENT_PLAYBOOK.md
- GIT_WORKFLOW.md
- TESTING_GUIDE.md

---

# End of Document