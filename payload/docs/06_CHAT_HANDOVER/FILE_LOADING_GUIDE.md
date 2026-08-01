# Champions Legacy

# File Loading Guide

Version: 2.0

---

# Purpose

The Champions Legacy documentation has been divided into specialised sections to improve organisation and reduce unnecessary context.

This guide explains which documentation should be loaded for different development tasks.

The goal is to load **only the documents required** for the current task while still providing enough context to make good engineering decisions.

---

# General Rule

Do **not** load the entire documentation repository unless specifically requested.

Instead:

1. Read `CHAT_BRIEFING.md`
2. Read `RECENT_SESSION_SUMMARY.md`
3. Determine the current task.
4. Load only the relevant documentation listed below.

---

# Always Load First

Regardless of the task, always begin with:

```
06_CHAT_HANDOVER/
├── CHAT_BRIEFING.md
├── RECENT_SESSION_SUMMARY.md
```

These documents provide the current project context and latest progress.

---

# Starting a New Development Session

Load:

```
01_CURRENT_DEVELOPMENT/
├── CURRENT_STATE.md
├── NEXT_SESSION.md
├── KNOWN_ISSUES.md

06_CHAT_HANDOVER/
├── CHAT_BRIEFING.md
├── RECENT_SESSION_SUMMARY.md
```

Purpose:

- Understand current progress.
- Identify active priorities.
- Avoid repeating completed work.

---

# Building a New Feature

Load:

```
02_GAME_DESIGN/
├── GAME_DESIGN_OVERVIEW.md

03_ARCHITECTURE/
├── ARCHITECTURE_OVERVIEW.md

04_DEVELOPMENT/
├── DEVELOPMENT_PLAYBOOK.md

01_CURRENT_DEVELOPMENT/
├── CURRENT_STATE.md
├── NEXT_SESSION.md
```

Purpose:

- Understand the feature.
- Maintain architecture.
- Follow development workflow.

---

# Implementing Gameplay Changes

Load:

```
02_GAME_DESIGN/
```

Specifically:

- Challenge Rules
- Points System
- Progression System
- League System
- Achievements
- Player Profile System

Purpose:

Gameplay documentation is the authoritative source for game mechanics.

---

# Working on React Components

Load:

```
03_ARCHITECTURE/
├── COMPONENT_ARCHITECTURE.md

05_DESIGN/
├── COMPONENT_PATTERNS.md
├── UX_PRINCIPLES.md

04_DEVELOPMENT/
├── CODING_STANDARDS.md
```

Purpose:

Ensure UI remains modular and visually consistent.

---

# UI / UX Improvements

Load:

```
05_DESIGN/
├── UX_PRINCIPLES.md
├── DESIGN_LANGUAGE.md
├── CONTENT_AND_TONE.md
├── COMPONENT_PATTERNS.md
├── ACCESSIBILITY.md
```

Purpose:

Maintain a consistent visual and user experience.

---

# Database Changes

Load:

```
03_ARCHITECTURE/
├── DATA_MODEL.md
├── FIRESTORE_STRUCTURE.md
├── SECURITY_MODEL.md
```

Purpose:

Protect data integrity and future scalability.

---

# Authentication

Load:

```
03_ARCHITECTURE/
├── SECURITY_MODEL.md

01_CURRENT_DEVELOPMENT/
├── CURRENT_STATE.md
```

Purpose:

Maintain existing authentication architecture.

---

# Points System Changes

Load:

```
02_GAME_DESIGN/
├── POINTS_SYSTEM.md

03_ARCHITECTURE/
├── CONFIGURATION_SYSTEM.md
```

Purpose:

Ensure scoring remains configurable and maintainable.

---

# Statistics & Analytics

Load:

```
02_GAME_DESIGN/
├── PLAYER_PROFILE_SYSTEM.md

03_ARCHITECTURE/
├── DATA_MODEL.md

01_CURRENT_DEVELOPMENT/
├── CURRENT_STATE.md
```

Purpose:

Preserve long-term analytics capabilities.

---

# Admin Features

Load:

```
02_GAME_DESIGN/
├── USER_ROLES.md

03_ARCHITECTURE/
├── SECURITY_MODEL.md
├── SERVICE_ARCHITECTURE.md
```

Purpose:

Maintain future admin scalability.

---

# Bug Fixes

Load:

```
01_CURRENT_DEVELOPMENT/
├── KNOWN_ISSUES.md

03_ARCHITECTURE/
├── ARCHITECTURE_OVERVIEW.md

04_DEVELOPMENT/
├── TESTING_GUIDE.md
```

Purpose:

Understand the issue before modifying implementation.

---

# Refactoring

Load:

```
03_ARCHITECTURE/

04_DEVELOPMENT/
├── CODING_STANDARDS.md
├── DEVELOPMENT_PLAYBOOK.md
```

Purpose:

Ensure improvements align with the project's architecture.

---

# Documentation Updates

Load:

```
04_DEVELOPMENT/
├── DOCUMENT_UPDATE_CHECKLIST.md
```

Purpose:

Determine which documentation requires updating.

---

# Preparing a Release

Load:

```
04_DEVELOPMENT/
├── RELEASE_PROCESS.md

07_HISTORY/
├── CHANGELOG.md
├── RELEASE_NOTES.md
```

Purpose:

Ensure releases remain well documented.

---

# Reviewing the Entire Project

Load the documentation in this order:

```
00_PROJECT

↓

01_CURRENT_DEVELOPMENT

↓

02_GAME_DESIGN

↓

03_ARCHITECTURE

↓

04_DEVELOPMENT

↓

05_DESIGN

↓

06_CHAT_HANDOVER

↓

07_HISTORY
```

Purpose:

Develop a complete understanding of Champions Legacy.

---

# If Unsure

When uncertain which documents are required:

1. Load the smallest relevant set.
2. Begin implementation.
3. Load additional documents only if needed.

Avoid unnecessary context.

---

# Guiding Principle

Load only the knowledge required to solve the current problem.

Smaller, focused context produces faster, more accurate and more maintainable development decisions.

---

# End of Document