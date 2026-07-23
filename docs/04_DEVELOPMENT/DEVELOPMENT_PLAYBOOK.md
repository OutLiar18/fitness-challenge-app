# Champions Legacy

# Development Playbook

Version: 2.0

---

# Purpose

The Development Playbook defines the standard workflow for implementing new features within Champions Legacy.

Its purpose is to ensure that every feature is developed consistently, documented thoroughly and integrated without introducing unnecessary technical debt.

This playbook should be followed regardless of the size of the feature.

---

# Philosophy

Good software is built through a repeatable process.

Skipping planning or documentation may save time in the short term, but usually increases complexity later.

Every feature should progress through the same lifecycle.

---

# Development Lifecycle

Every feature should follow these stages.

1. Idea
2. Planning
3. Game Design
4. Architecture
5. Development
6. Testing
7. Documentation
8. Review
9. Release

No stage should be skipped without good reason.

---

# Stage 1 — Idea

Every feature begins as an idea.

Questions to ask include:

- What problem does this solve?
- Does it align with the Champions Legacy philosophy?
- Is this solving a real player need?

Ideas should be recorded before implementation begins.

---

# Stage 2 — Planning

Before writing code:

- Define the scope.
- Identify affected systems.
- Consider edge cases.
- Estimate complexity.
- Identify dependencies.

Large features should be broken into smaller milestones.

---

# Stage 3 — Game Design

If the feature changes gameplay, determine:

- Player experience
- Rules
- Progression impact
- Motivation impact
- Balance considerations

Game Design decisions should be documented before implementation.

---

# Stage 4 — Architecture

Determine:

- Which services are affected.
- Which components are required.
- Data model changes.
- Firestore changes.
- Configuration updates.

Architecture should remain modular.

---

# Stage 5 — Development

Implementation should follow:

- Coding Standards
- Existing architecture
- Existing naming conventions

During development:

- Keep commits focused.
- Avoid unnecessary complexity.
- Prefer reusable solutions.

---

# Stage 6 — Testing

Before completion:

- Test expected behaviour.
- Test invalid input.
- Test edge cases.
- Test regression scenarios.
- Verify mobile responsiveness.

No feature is complete until tested.

---

# Stage 7 — Documentation

Implementation and documentation should be completed together.

Review:

- Current Development
- Architecture
- Game Design
- README
- Changelog

Documentation is part of the feature.

---

# Stage 8 — Review

Before release ask:

Does it work?

Is it understandable?

Can it be simplified?

Does it follow project standards?

Will Future You understand it?

---

# Stage 9 — Release

After approval:

- Merge changes.
- Tag version if required.
- Update release documentation.
- Archive completed work.

---

# Feature Checklist

Every feature should satisfy the following.

□ Solves a real problem

□ Fits project philosophy

□ Matches architecture

□ Uses existing patterns

□ Tested thoroughly

□ Documentation updated

□ Ready for release

---

# Common Mistakes

Avoid:

- Building before planning.
- Writing undocumented code.
- Duplicating existing functionality.
- Ignoring edge cases.
- Creating unnecessary abstractions.
- Leaving TODOs indefinitely.

---

# Guiding Principle

Slow, consistent development produces better software than rushed implementation.

---

# Related Documentation

- DEVELOPMENT_OVERVIEW.md
- CODING_STANDARDS.md
- TESTING_GUIDE.md
- RELEASE_PROCESS.md

---

# End of Document