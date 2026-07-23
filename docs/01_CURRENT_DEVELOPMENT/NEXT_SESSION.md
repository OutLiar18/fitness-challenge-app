# Champions Legacy

# Next Session

---

# Purpose

This document records the recommended starting point for the next development session.

It should answer one question:

> "If development resumed right now, what should be worked on first?"

Only short-term priorities belong here.

---

# Current Focus

Platform Stabilisation

The current objective is to complete the architectural migration before introducing new features.

---

# Highest Priority

Complete the Exercise Library migration.

This includes:

- Finish workout migration
- Remove remaining legacy exercise logic
- Verify Exercise Option Service
- Remove duplicate option systems

---

# Secondary Priority

Complete Points Engine v2.

Remaining work:

- Difficulty multipliers
- Effective repetitions
- Workout scoring
- Cardio difficulty calculations

---

# Validation

Review every dynamic form to ensure:

- Validation is consistent
- Error handling is correct
- Messages are standardised
- Legacy validation has been removed

---

# Statistics Verification

Confirm that all statistics are generated through the Statistics Service and consume the latest Points Service calculations.

---

# Code Cleanup

After migration is complete:

- Remove unused files
- Remove deprecated services
- Remove duplicate architecture
- Simplify components where possible

---

# Documentation

After implementation:

- Update Current State
- Update Roadmap if required
- Update Changelog
- Remove resolved issues from Known Issues

Documentation should remain synchronised with the application.

---

# Success Criteria

The current stabilisation phase is complete when:

- Exercise Library migration is finished.
- Points Engine v2 is fully operational.
- Validation is consistent.
- Legacy architecture has been removed.
- Documentation accurately reflects the application.

---

# Guiding Principle

Complete and stabilise existing systems before introducing new functionality.