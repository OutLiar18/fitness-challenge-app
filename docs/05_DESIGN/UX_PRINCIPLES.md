# Champions Legacy Challenge

## v0.17.0 guidance and account-control principles

- Introduce the product in four short stages instead of presenting every feature at once.
- Never force legacy players through new onboarding merely because a field is absent.
- Place Help & Privacy under More so primary navigation remains focused.
- Explain stored facts, derived results and trusted operational boundaries in plain language.
- Use explicit busy, success and error states for export and account requests.
- Never label a request acknowledgement as completed deletion.
- Destructive-looking actions require a visible acknowledgement checkbox and clear consequences.


# UX Principles

Version: 2.0

---

# Purpose

The User Experience (UX) Principles define how Champions Legacy Challenge should feel to use.

These principles guide every design decision, interaction and workflow to ensure the application remains intuitive, motivating and enjoyable.

While features determine what users can do, UX determines how they experience doing it.

---

# Philosophy

Champions Legacy Challenge exists to help people become better than they were yesterday.

The interface should support that mission by reducing friction, encouraging consistency and allowing players to focus on self-improvement rather than learning the application.

Good UX is almost invisible.

---

# Core Objectives

The user experience should:

- Be simple to understand.
- Minimise unnecessary effort.
- Encourage positive habits.
- Reinforce consistency.
- Build confidence.
- Feel rewarding without becoming distracting.

---

# Core Principles

## Simplicity

Every screen should present only the information necessary for the current task.

Remove anything that distracts from the user's objective.

---

## Clarity

Users should immediately understand:

- Where they are.
- What they can do.
- What happens next.

Interfaces should never require guesswork.

---

## Consistency

The same actions should always behave the same way.

Buttons, navigation, forms and feedback should remain predictable throughout the application.

Consistency reduces cognitive load.

---

## Efficiency

Frequent tasks should require as few interactions as possible.

Examples include:

- Logging challenge entries.
- Viewing statistics.
- Checking progress.
- Navigating between days.

---

## Feedback

Every user action should receive an appropriate response.

Examples include:

- Loading indicators.
- Success confirmations.
- Validation messages.
- Error messages.
- Progress updates.

Feedback should reassure users that the application is responding.

---

## Motivation

Champions Legacy Challenge rewards effort rather than perfection.

The interface should celebrate consistency, progress and improvement without creating unhealthy pressure.

Positive reinforcement should feel genuine rather than excessive.

---

## Focus

The application should help users focus on one task at a time.

Avoid presenting too many competing actions on a single screen.

---

## Learnability

New users should be able to understand the application quickly.

Experienced users should become increasingly efficient over time.

---

## Forgiveness

Users should be able to recover easily from mistakes.

Examples include:

- Confirmation before destructive actions.
- Helpful validation messages.
- Opportunities to correct input.

---

## Trust

The application should always feel reliable.

Data should appear accurate.

Actions should behave predictably.

Unexpected behaviour reduces user confidence.

---

# Navigation Principles

Navigation should be:

- Predictable
- Consistent
- Minimal
- Easy to remember

Users should never become lost within the application.

---

# Information Hierarchy

Information should be displayed according to importance.

General priority:

1. Primary actions
2. Current progress
3. Personal statistics
4. Secondary actions
5. Supporting information

Decorative elements should never compete with meaningful content.

---

# Reducing Cognitive Load

Every screen should minimise unnecessary thinking.

Avoid:

- Excessive options.
- Long paragraphs.
- Technical language.
- Hidden actions.
- Inconsistent layouts.

Simple interfaces encourage continued engagement.

---

# Emotional Experience

Champions Legacy Challenge should feel:

- Encouraging
- Calm
- Professional
- Rewarding
- Trustworthy

It should never feel:

- Punishing
- Chaotic
- Overwhelming
- Manipulative

---

# Decision Checklist

Before implementing a feature, ask:

Does this reduce effort?

Does this improve clarity?

Does this support consistency?

Does this motivate users?

Does this make the application easier to use?

If the answer is "No", reconsider the design.

---

# Related Documentation

- DESIGN_LANGUAGE.md
- CONTENT_AND_TONE.md
- COMPONENT_PATTERNS.md
- ACCESSIBILITY.md

---

# Guiding Principle

A great user experience allows players to focus on improving themselves—not figuring out how the application works.

---

# End of Document
---

# v0.15 Information Architecture Addendum

- Frequent actions remain directly reachable; lower-frequency tools live in a predictable More menu.
- One concept should have one obvious destination. Profile is not duplicated on desktop, and incoming communication begins at Inbox.
- Prerequisites should remain visible before an action becomes available. Disabled actions must explain what is missing.
- Analytics should support reflection, not pressure. It describes patterns and never invents targets or negative comparisons.

---

# Progressive Disclosure on Dense Pages

When a route contains several complete tasks or bodies of reference information, show one major workspace at a time.

Use route-workspace tabs when:

- sections are peers rather than sequential steps;
- each section can stand alone;
- showing all sections makes the page feel long or action-heavy;
- the player may revisit different sections repeatedly.

Use native disclosure (`details`) when:

- the content is reference material inside one larger task;
- multiple answers may reasonably remain open;
- the user benefits from scanning headings in one document.

Keep content direct when:

- the page has one clear task;
- hiding information would add a click without reducing meaningful complexity;
- the page is already short and calm.

The primary status and next action must remain discoverable. A section may be hidden by default, but its label and any critical readiness state must not disappear.
