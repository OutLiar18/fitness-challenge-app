# Champions Legacy

# Known Issues

---

# Purpose

This document tracks known issues, technical debt and incomplete functionality within Champions Legacy.

Issues should be removed once resolved.

This document should only contain active issues affecting development.

---

# Current Status

Last Updated:

v0.5 (Development)

Current Focus:

Platform Stabilisation

---

# Critical Issues

## Workout Migration

Status:

🚧 In Progress

Description:

Workout functionality is currently split between the legacy implementation and the new Exercise Library architecture.

Impact:

- Duplicate logic
- Increased maintenance
- Inconsistent scoring

Priority:

High

---

## Points Engine v2

Status:

🚧 In Progress

Description:

Workout scoring has not yet fully migrated to the new Points Engine.

Remaining work includes:

- Difficulty multipliers
- Effective repetitions
- Cardio difficulty calculations

Priority:

High

---

## Validation Consistency

Status:

🚧 In Progress

Description:

Some forms still rely on legacy validation behaviour following the dynamic form migration.

Priority:

High

---

# Medium Priority Issues

## Journal Navigation

Status:

Not Started

Missing features:

- Previous day navigation
- Next day navigation
- Calendar picker
- Calendar view

---

## Dashboard Polish

Status:

Ongoing

Remaining work:

- Responsive improvements
- Visual consistency
- Spacing adjustments

---

## Legacy Architecture

Description:

Several legacy components and helper functions remain in the project.

These should be removed once their replacements are verified.

---

# Low Priority Issues

## Admin Dashboard

Status:

Not Started

Reason:

Scheduled for a future development phase.

---

# Technical Debt

Current technical debt includes:

- Legacy workout architecture
- Temporary migration code
- Duplicate option systems
- Incomplete service migration

Technical debt should be reduced continuously during development rather than postponed indefinitely.

---

# Recently Resolved

Move completed issues to the changelog before removing them from this document.

This document should only contain active issues.

---

# Guiding Principle

Known Issues should represent problems that currently exist.

Future ideas and planned features belong in the Roadmap instead.