# Champions Legacy

# Component Patterns

Version: 2.0

---

# Purpose

This document defines the reusable interface patterns used throughout Champions Legacy.

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

They are part of a larger language that should feel familiar, predictable and cohesive throughout Champions Legacy.

---

# End of Document