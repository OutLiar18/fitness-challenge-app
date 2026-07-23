# Champions Legacy

# Git Workflow

Version: 2.0

---

# Purpose

This document defines the Git workflow used throughout Champions Legacy.

A consistent version control strategy improves collaboration, simplifies debugging and creates a reliable history of the project's evolution.

Even when working as a solo developer, following a structured Git workflow helps maintain discipline and prepares the project for future contributors.

---

# Philosophy

Git is more than a backup system.

It is the historical record of how Champions Legacy has evolved.

Every commit should tell part of that story.

---

# Core Objectives

The Git Workflow aims to:

- Maintain a clean project history.
- Reduce merge conflicts.
- Simplify debugging.
- Support future collaboration.
- Ensure every release is traceable.

---

# Repository Principles

The repository should always remain in a working state.

Avoid committing code that is:

- Broken
- Incomplete
- Untested
- Experimental
- Unrelated to the current change

---

# Branch Strategy

Development should follow a simple branching model.

## Main

The `main` branch always represents the latest stable version of Champions Legacy.

Only tested and completed work should reach this branch.

---

## Feature Branches

Whenever practical, new features should be developed in dedicated feature branches.

Example:

feature/journal-history

feature/profile-redesign

feature/league-system

Feature branches should focus on one feature or improvement.

---

## Bug Fix Branches

Bug fixes should remain isolated from unrelated work.

Example:

fix/journal-validation

fix/profile-loading

---

# Commit Philosophy

Commits should represent logical units of work.

Avoid combining unrelated changes into a single commit.

A commit should answer the question:

"What changed?"

---

# Commit Messages

Commit messages should be short, descriptive and action-oriented.

Examples:

Add journal history navigation

Improve leaderboard performance

Fix profile statistics calculation

Update challenge documentation

Avoid vague messages such as:

Update

Changes

Fix stuff

Misc

---

# Commit Frequency

Commit regularly throughout development.

Frequent commits provide:

- Better history.
- Easier debugging.
- Simpler rollbacks.

Avoid making one extremely large commit at the end of development.

---

# Pull Requests

If collaboration is introduced in future, every Pull Request should include:

- Summary
- Reason for change
- Testing completed
- Documentation updated

---

# Merge Guidelines

Before merging:

- Review the implementation.
- Resolve conflicts.
- Verify testing.
- Confirm documentation updates.
- Ensure the application builds successfully.

---

# Version Tags

Major project milestones should be tagged.

Examples:

v0.5

v0.6

v1.0

Tags provide permanent reference points within project history.

---

# Rollbacks

If an issue is discovered after merging:

- Identify the responsible commit.
- Revert only the affected changes.
- Preserve unrelated work.

Rollbacks should be documented where appropriate.

---

# Large Refactors

Large refactoring work should:

- Be planned.
- Be documented.
- Be broken into manageable commits.

Avoid combining refactoring with new feature development.

---

# Documentation Updates

Whenever code changes affect documentation, update the relevant documents before completing the work.

Refer to the Document Update Checklist.

---

# Guiding Principles

Before committing, ask:

Does this commit have one clear purpose?

Can another developer understand what changed?

Does the repository remain stable?

Has related documentation been updated?

Would I be comfortable reverting only this commit?

If the answer to any question is "No", reconsider the commit.

---

# Related Documentation

- DEVELOPMENT_OVERVIEW.md
- DEVELOPMENT_PLAYBOOK.md
- CODING_STANDARDS.md
- DOCUMENT_UPDATE_CHECKLIST.md
- RELEASE_PROCESS.md

---

# Guiding Principle

A clean Git history is an investment in the future.

Every commit should make the project easier to understand, maintain and improve.

---

# End of Document