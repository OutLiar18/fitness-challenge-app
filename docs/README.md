# Champions Legacy Challenge Documentation

This folder contains the permanent documentation for the Champions Legacy Challenge project.

The documentation is designed to serve three purposes:

1. Preserve important project knowledge.
2. Guide development decisions.
3. Allow future ChatGPT conversations or developers to continue the project without relying on previous chat history.

---

# Documentation Principles

Each piece of information should have one authoritative home.

Documents should avoid repeating detailed information already defined elsewhere.

When documents overlap, the most specialised document should be treated as the source of truth.

Examples:

- `CHALLENGE_RULES.md` defines what activities qualify.
- `POINTS_SYSTEM.md` defines how activities are scored.
- `CURRENT_STATE.md` defines what is implemented.
- `ROADMAP.md` defines what is planned.
- `CHANGELOG.md` defines what has been completed historically.

---

# Documentation Structure

## `00_PROJECT`

Defines the permanent identity, vision and principles of Champions Legacy.

These documents should change rarely.

| Document | Purpose |
|---|---|
| `VISION.md` | Defines the long-term vision of the platform. |
| `CORE_PRINCIPLES.md` | Defines the project’s non-negotiable principles. |
| `PRODUCT_IDENTITY.md` | Defines what Champions Legacy is and how it should feel. |
| `GLOSSARY.md` | Defines important project terminology. |
| `DOCUMENTATION_RULES.md` | Defines how documentation should be maintained. |

---

## `01_CURRENT_DEVELOPMENT`

Contains the current development position of the project.

These documents are updated frequently.

| Document | Purpose |
|---|---|
| `CURRENT_CONTEXT.md` | Provides a concise briefing of the active development situation. |
| `CURRENT_STATE.md` | Defines what is currently implemented in the application. |
| `ROADMAP.md` | Defines planned future work. |
| `ACTIVE_MIGRATIONS.md` | Tracks temporary architectural migrations. |
| `KNOWN_ISSUES.md` | Tracks current bugs and technical debt. |
| `NEXT_SESSION.md` | Defines the exact starting point for the next development session. |

---

## `02_GAME_DESIGN`

Contains challenge rules, scoring systems, progression and future product systems.

| Document | Purpose |
|---|---|
| `CHALLENGE_RULES.md` | Official challenge rules and qualification requirements. |
| `POINTS_SYSTEM.md` | Official scoring rules and point calculations. |
| `PROGRESSION_SYSTEM.md` | XP, levels, ranks, titles and long-term progression. |
| `LEAGUE_SYSTEM.md` | League Mode, seasons, teams and competition rules. |
| `ACHIEVEMENTS_AND_REWARDS.md` | Achievements, milestones, trophies and cosmetic rewards. |
| `MOTIVATION_AND_PSYCHOLOGY.md` | Emotional and behavioural design principles. |
| `USER_ROLES.md` | Participant, administrator and future system roles. |

### `ideas`

Stores unimplemented ideas without interrupting current development.

| Document | Purpose |
|---|---|
| `IDEA_INBOX.md` | Captures new ideas immediately. |
| `PLANNED_IDEAS.md` | Contains reviewed ideas expected to be implemented. |
| `EXPERIMENTAL_IDEAS.md` | Contains ideas that require further design or testing. |
| `REJECTED_OR_DEFERRED.md` | Records rejected or postponed ideas and the reasons why. |

---

## `03_ARCHITECTURE`

Defines how the application is technically structured.

| Document | Purpose |
|---|---|
| `ARCHITECTURE_OVERVIEW.md` | High-level architecture and system flow. |
| `DATA_MODEL.md` | Defines core application entities and relationships. |
| `FIRESTORE_STRUCTURE.md` | Defines collections, documents and stored fields. |
| `SERVICE_ARCHITECTURE.md` | Defines service responsibilities and boundaries. |
| `COMPONENT_ARCHITECTURE.md` | Defines React component responsibilities and layers. |
| `CONFIGURATION_SYSTEM.md` | Defines configuration-driven behaviour. |
| `LIBRARY_SYSTEM.md` | Defines reusable libraries such as books and exercises. |
| `SECURITY_MODEL.md` | Defines ownership, permissions and privacy rules. |

### `decisions`

Contains Architecture Decision Records.

Each major architectural decision should have its own permanent ADR file.

Accepted ADRs should not be rewritten casually.

If a decision changes, create a new ADR and mark the previous decision as superseded.

---

## `04_DEVELOPMENT`

Defines how the project should be developed and maintained.

| Document | Purpose |
|---|---|
| `DEVELOPMENT_PLAYBOOK.md` | Defines the standard development workflow. |
| `CODING_STANDARDS.md` | Defines coding and naming standards. |
| `TESTING_GUIDE.md` | Defines manual and future automated testing expectations. |
| `GIT_WORKFLOW.md` | Defines commit, branch and version-control practices. |
| `RELEASE_PROCESS.md` | Defines how versions are completed and released. |
| `DOCUMENT_UPDATE_CHECKLIST.md` | Defines which documents must be updated after each type of change. |

---

## `05_DESIGN`

Defines the visual and interaction design of the application.

| Document | Purpose |
|---|---|
| `DESIGN_LANGUAGE.md` | Defines the visual identity and design system. |
| `UX_PRINCIPLES.md` | Defines user-experience rules and interaction priorities. |
| `ACCESSIBILITY.md` | Defines accessibility expectations. |
| `COMPONENT_PATTERNS.md` | Defines reusable UI patterns. |
| `CONTENT_AND_TONE.md` | Defines wording, humour, feedback and application voice. |

---

## `06_CHAT_HANDOVER`

Contains documentation specifically designed to continue development across ChatGPT conversations.

| Document | Purpose |
|---|---|
| `START_NEW_CHAT_PROMPT.txt` | Initial prompt used when opening a new project chat. |
| `CHAT_BRIEFING.md` | Stable instructions about the user, project and preferred workflow. |
| `FILE_LOADING_GUIDE.md` | Defines which documents a new chat should read for each task. |
| `RECENT_SESSION_SUMMARY.md` | Summarises the latest meaningful development work. |

---

## `07_HISTORY`

Contains completed and inactive historical records.

| Location | Purpose |
|---|---|
| `CHANGELOG.md` | Concise history of completed changes. |
| `releases/` | Detailed release notes for completed versions. |
| `archive/superseded-documents/` | Old documents replaced by newer documentation. |
| `archive/abandoned-designs/` | Designs deliberately abandoned. |
| `archive/old-migrations/` | Completed or abandoned migration records. |

Historical records should not be silently deleted.

---

# Source-of-Truth Guide

Use the following document depending on the question.

| Question | Source of Truth |
|---|---|
| What is Champions Legacy trying to become? | `00_PROJECT/VISION.md` |
| What principles must the project follow? | `00_PROJECT/CORE_PRINCIPLES.md` |
| What are we working on right now? | `01_CURRENT_DEVELOPMENT/CURRENT_CONTEXT.md` |
| What currently works? | `01_CURRENT_DEVELOPMENT/CURRENT_STATE.md` |
| What are we building later? | `01_CURRENT_DEVELOPMENT/ROADMAP.md` |
| What qualifies for the challenge? | `02_GAME_DESIGN/CHALLENGE_RULES.md` |
| How are points calculated? | `02_GAME_DESIGN/POINTS_SYSTEM.md` |
| How does progression work? | `02_GAME_DESIGN/PROGRESSION_SYSTEM.md` |
| How is the software structured? | `03_ARCHITECTURE/ARCHITECTURE_OVERVIEW.md` |
| Why was an architectural decision made? | `03_ARCHITECTURE/decisions/` |
| How should code be written? | `04_DEVELOPMENT/CODING_STANDARDS.md` |
| How should the application look and feel? | `05_DESIGN/DESIGN_LANGUAGE.md` |
| Where should a new idea be stored? | `02_GAME_DESIGN/ideas/IDEA_INBOX.md` |
| What should the next chat do first? | `01_CURRENT_DEVELOPMENT/NEXT_SESSION.md` |

---

# Recommended Reading Order for a New Chat

For general development continuation:

1. `README.md`
2. `06_CHAT_HANDOVER/CHAT_BRIEFING.md`
3. `01_CURRENT_DEVELOPMENT/CURRENT_CONTEXT.md`
4. `01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
5. `01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`
6. Only the specialised documents relevant to the current task

A new chat should not need to read every document before beginning work.

---

# Important Rule

Documentation is part of the product.

A feature is not complete until the relevant documentation accurately reflects the implementation.