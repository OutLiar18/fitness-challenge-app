# Champions Legacy Challenge

## Onboarding gate

Use a modal onboarding gate only when a loaded profile explicitly requires the current guide version. Render the protected application beneath it, trap focus within the dialog, prevent background scrolling and write only onboarding fields when completed or replayed.

## Account request card

Show status, player identity, request date, reason and the operational boundary. Administrator acknowledgement must be a single clear action; do not provide a misleading “delete account” client button. Requested, acknowledged and cancelled states require visibly distinct labels in addition to colour.

## Personal export action

Use one primary action with a busy state. Report partial exports honestly by listing unavailable sections in the generated file and displaying an informational status rather than claiming completeness.


# Component Patterns

Version: 2.0

---

# Purpose

This document defines the reusable interface patterns used throughout Champions Legacy Challenge.

Rather than documenting individual components, it establishes how groups of components should behave to create a consistent and predictable user experience.

---

# Philosophy

Users should never need to relearn the interface.

If two screens solve similar problems, they should use similar patterns.

Consistency reduces cognitive load and improves usability.

---

# Core Principles

Every component pattern should be:

- Predictable
- Reusable
- Consistent
- Accessible
- Responsive

---

# Cards

Cards are the primary method of grouping related information.

Cards should:

- Contain one primary purpose.
- Include clear spacing.
- Avoid unnecessary clutter.
- Support responsive layouts.

Examples:

- Challenge Cards
- Journal Entries
- Statistics Cards
- Achievement Cards

---

# Forms

Forms should:

- Follow a logical order.
- Group related fields.
- Display validation immediately.
- Minimise required input.

Users should always understand what information is required.

---

# Lists

Lists should:

- Be easy to scan.
- Support filtering where appropriate.
- Maintain consistent spacing.
- Display meaningful empty states.

---

# Navigation

Navigation should remain consistent throughout the application.

Users should always know:

- Current location.
- Previous location.
- Available destinations.

Navigation patterns should not change between screens.

---

# Statistics

Statistics should prioritise:

- Today's progress.
- Weekly progress.
- Personal improvement.
- Historical trends.

Avoid overwhelming users with excessive numbers.

---

# Progress Indicators

Progress should always communicate movement toward a goal.

Examples:

- Daily completion
- Weekly completion
- League progress
- Achievement progress
- Challenge streaks

Progress indicators should be easy to understand at a glance.

---

# Leaderboards

Leaderboards should:

- Highlight healthy competition.
- Encourage improvement.
- Avoid discouraging new users.

Personal ranking should always be easy to locate.

---

# Dialogs

Dialogs should:

- Explain why they appear.
- Present clear actions.
- Be dismissible where appropriate.

Use dialogs sparingly.

---

# Search

Search should:

- Be forgiving.
- Return relevant results.
- Support partial matches where practical.

---

# Filters

Filters should:

- Reduce complexity.
- Remember previous selections where appropriate.
- Never hide important information unexpectedly.

---

# Loading States

Loading states should reassure users.

Use:

- Skeleton screens
- Progress indicators
- Loading messages

Avoid blank screens.

---

# Empty States

Every empty state should provide:

- An explanation.
- A next step.
- Encouragement.

---

# Error States

Error screens should:

- Explain the issue.
- Suggest recovery.
- Avoid technical language.

---

# Responsive Behaviour

Patterns should adapt naturally across:

- Mobile
- Tablet
- Desktop

Layouts should remain familiar regardless of screen size.

---

# Future Components

Any new reusable interface pattern should follow the principles established in this document before being introduced into the application.

---

# Decision Checklist

Before introducing a new pattern ask:

Does a similar pattern already exist?

Is it consistent?

Will users recognise it immediately?

Can it be reused elsewhere?

Does it simplify the interface?

If the answer is "No", reconsider the design.

---

# Related Documentation

- UX_PRINCIPLES.md
- DESIGN_LANGUAGE.md
- CONTENT_AND_TONE.md
- ACCESSIBILITY.md

---

# Guiding Principle

Components are not individual pieces of the interface.

They are part of a larger language that should feel familiar, predictable and cohesive throughout Champions Legacy Challenge.

---

# End of Document
---

# v0.15 Patterns

## Grouped Navigation

Use labelled desktop groups, a focused mobile tab bar and one More surface for secondary tools. Do not duplicate destinations within the same viewport.

## Inbox

Public and private message types may share a tabbed workspace when their labels, unread counts and actions remain distinct. Presentation consolidation must not imply data or permission consolidation.

## Prerequisite Checklist

Show every condition, its current state and a recovery action. A disabled primary action must be accompanied by a plain-language explanation.

## Personal Analytics

Charts require text labels, tooltips or accessible names. Analytics should offer context and reflection without changing scoring or creating shame-based prompts.

---

# Route Workspace Switcher

Use `WorkspaceTabs` for major peer sections inside a dense route.

## Required structure

1. Page header.
2. Optional compact summary or selection control that applies to every section.
3. Workspace switcher.
4. One active `WorkspacePanel`.

## Metadata

Every tab requires:

- a stable identifier;
- a concise label;
- a meaningful icon used decoratively;
- a short description;
- an optional count or readiness badge.

Badges supplement the label; they never replace it.

## Behaviour

- The most useful calm section is active by default.
- Desktop uses the shared tablist and keyboard model.
- Small screens use the shared native select presentation.
- Dynamic tabs must resolve unavailable active identifiers safely.
- Critical actions hidden in another section require a visible callout or clear status link.
- Do not place a second route-navigation sidebar inside the page when the workspace switcher is sufficient.

## Avoid

- tabs for two tiny paragraphs;
- tabs whose labels are vague (`More`, `Other`, `Stuff`);
- using tabs as a substitute for a real workflow stepper;
- nested generic tablists;
- moving business logic into tab components;
- rendering scoring differently depending on the active section.
