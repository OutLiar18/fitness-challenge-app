# Champions Legacy Challenge

# Documentation Rules

---

# Purpose

This document defines how project documentation is organised and maintained.

The documentation is intended to become the permanent memory of the project.

It should be possible for a new developer—or a new ChatGPT conversation—to understand the project by reading the appropriate documents without relying on previous conversations.

---

# Core Principles

## Single Source of Truth

Every piece of information should have one authoritative location.

Avoid duplicating detailed information across multiple documents.

For example:

- Challenge rules belong in `CHALLENGE_RULES.md`
- Scoring belongs in `POINTS_SYSTEM.md`
- Current implementation belongs in `CURRENT_STATE.md`
- Future plans belong in `ROADMAP.md`

Other documents may reference these files but should not duplicate them.

---

## One Responsibility Per Document

Every document should answer one primary question.

Examples:

| Document | Primary Question |
|----------|------------------|
| VISION.md | What are we trying to build? |
| CURRENT_STATE.md | What currently exists? |
| ROADMAP.md | What are we planning to build? |
| CHANGELOG.md | What has already been completed? |
| POINTS_SYSTEM.md | How are points calculated? |

If a document starts answering multiple unrelated questions, it should probably be split.

---

## Permanent vs Living Documentation

Documentation falls into two categories.

### Permanent

Changes rarely.

Examples:

- Vision
- Core Principles
- Design Language
- Architecture Decisions

### Living

Updated frequently.

Examples:

- Current Context
- Current State
- Roadmap
- Known Issues
- Next Session

---

# Documentation Update Rules

## After Completing a Feature

Always consider updating:

- CURRENT_STATE.md
- CHANGELOG.md

If the feature changes future priorities:

- ROADMAP.md

---

## After Changing Architecture

Update:

- ARCHITECTURE_OVERVIEW.md

If the decision introduces a new long-term architectural principle:

- Add a new ADR.

---

## After Changing Challenge Rules

Update:

- CHALLENGE_RULES.md

---

## After Changing Scoring

Update:

- POINTS_SYSTEM.md

---

## After Discovering a Bug

Update:

- KNOWN_ISSUES.md

---

## Before Ending a Development Session

Update:

- CURRENT_CONTEXT.md
- NEXT_SESSION.md

These two files should make it possible to continue development immediately in a future session.

---

# Versioning Philosophy

Documentation versions are independent of application versions.

Minor wording improvements do not require version changes.

Major structural or conceptual changes should be reflected in the document history where appropriate.

Git history should remain the primary source of document version history.

---

# Naming Conventions

## Files

Use:

UPPERCASE_WITH_UNDERSCORES.md

Examples:

CURRENT_STATE.md

POINTS_SYSTEM.md

ROADMAP.md

---

## Folders

Use numbered folders for high-level organisation.

Example:

00_PROJECT

01_CURRENT_DEVELOPMENT

02_GAME_DESIGN

---

## Architecture Decision Records

Each Architecture Decision Record should have its own file.

Example:

ADR-001-categories-source-of-truth.md

ADR-002-firestore-facts-only.md

ADR-003-mobile-first.md

Accepted ADRs should not be rewritten.

If a decision changes, create a new ADR and mark the previous one as superseded.

---

# Chat Migration Philosophy

The documentation should minimise the amount of information that must be pasted into a new ChatGPT conversation.

Whenever possible:

- Load only the documents relevant to the current task.
- Avoid requiring the entire documentation set.
- Keep current-session information inside CURRENT_CONTEXT.md and NEXT_SESSION.md.

The goal is to make future development sessions efficient while preserving long-term project knowledge.

---

# Archive Policy

Old documentation should not be deleted immediately.

When documents are replaced:

1. Move them to the archive.
2. Confirm all useful information has been migrated.
3. Preserve historical reasoning where it may still be valuable.

---

# Guiding Principle

Documentation is part of the software.

A feature is not considered complete until the relevant documentation has been updated.

Good documentation reduces technical debt, improves collaboration and ensures the long-term maintainability of Champions Legacy Challenge.