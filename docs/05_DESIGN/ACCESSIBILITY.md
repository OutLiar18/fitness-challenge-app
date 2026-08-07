# Champions Legacy Challenge

## v0.17.0 onboarding and account tools

- The onboarding overlay uses `role="dialog"`, `aria-modal`, a labelled title/description, focus containment and body scroll lock.
- Progress is exposed as an ordered list with `aria-current="step"`.
- Every step remains operable by keyboard and respects reduced-motion styling.
- Help & Privacy uses the shared accessible workspace pattern and native form controls.
- Export/request feedback uses `role="status"` or `role="alert"` according to urgency.
- The deletion acknowledgement remains a native checkbox with visible explanatory text.


# Accessibility

Version: 2.0

---

# Purpose

Accessibility ensures that Champions Legacy Challenge is usable by the widest possible range of people.

Accessible design improves the experience for everyone—not only users with disabilities.

Every feature should be designed so that it remains understandable, usable and inclusive across different abilities, devices and environments.

---

# Philosophy

Accessibility is not an optional enhancement.

It is part of good design.

Interfaces should reduce unnecessary barriers and allow users to focus on improving themselves rather than overcoming usability problems.

Good accessibility benefits every player.

---

# Core Objectives

Accessibility aims to:

- Improve readability.
- Improve usability.
- Reduce user frustration.
- Support multiple input methods.
- Increase inclusivity.
- Create a more reliable user experience.

---

# General Principles

Every interface should strive to be:

- Understandable
- Perceivable
- Operable
- Consistent
- Forgiving

Accessibility should be considered from the beginning of development rather than added afterwards.

---

# Readability

Text should always be easy to read.

Guidelines include:

- Clear typography.
- Adequate line spacing.
- Appropriate font sizes.
- Sufficient colour contrast.
- Short paragraphs.
- Meaningful headings.

Avoid unnecessary jargon where simpler language communicates the same idea.

---

# Colour Usage

Colour should never be the only method of communicating information.

Examples:

Instead of using only red to indicate an error, include:

- An icon.
- A descriptive message.
- Clear supporting text.

Similarly, success should be communicated through both colour and wording.

---

# Contrast

Maintain sufficient contrast between:

- Text and background.
- Icons and background.
- Interactive elements.
- Status indicators.

Good contrast improves readability in all lighting conditions.

---

# Typography

Typography should prioritise clarity over decoration.

Avoid:

- Extremely small text.
- Difficult-to-read fonts.
- Excessive capitalisation.
- Long blocks of uninterrupted text.

Readable typography reduces fatigue.

---

# Navigation

Navigation should remain:

- Predictable.
- Consistent.
- Clearly labelled.

Users should always know:

- Where they are.
- Where they can go.
- How to return.

Navigation should never rely solely on memory.

---

# Keyboard Accessibility

Interactive elements should be usable without a mouse whenever practical.

Users should be able to:

- Navigate logically.
- Activate controls.
- Submit forms.
- Cancel actions.

Keyboard focus should always remain visible.

---

# Touch Targets

Interactive elements should be large enough to use comfortably on mobile devices.

Buttons, links and icons should provide sufficient spacing to reduce accidental taps.

---

# Forms

Forms should provide:

- Clear labels.
- Helpful placeholders where appropriate.
- Meaningful validation.
- Easy error recovery.

Required fields should be clearly indicated.

Users should never lose entered information unnecessarily.

---

# Error Messages

Errors should explain:

- What happened.
- Why it happened (when possible).
- How to fix it.

Avoid technical terminology.

Good example:

"Please enter a valid distance."

Poor example:

"Validation Error."

---

# Feedback

Every user action should receive appropriate feedback.

Examples include:

- Loading indicators.
- Success confirmations.
- Validation messages.
- Progress indicators.

Users should never wonder whether the application is responding.

---

# Motion

Animations should support understanding rather than decoration.

Motion should:

- Be subtle.
- Be brief.
- Never block interaction.

Where practical, users should be able to reduce unnecessary animations.

---

# Responsive Design

Champions Legacy Challenge should provide a consistent experience across:

- Mobile phones.
- Tablets.
- Desktop browsers.

Layouts should adapt gracefully to different screen sizes without hiding important functionality.

---

# Screen Readers

Whenever practical:

- Buttons should have meaningful labels.
- Icons should include descriptive alternatives.
- Forms should be properly labelled.
- Interactive elements should communicate their purpose.

Accessibility should not depend on visual interpretation alone.

---

# Cognitive Accessibility

Interfaces should minimise unnecessary mental effort.

Avoid:

- Complex navigation.
- Hidden actions.
- Overloaded screens.
- Inconsistent terminology.
- Excessive choices.

Simple experiences encourage long-term engagement.

---

# Inclusive Design

Design decisions should consider users with:

- Temporary injuries.
- Permanent disabilities.
- Colour vision deficiencies.
- Limited technical experience.
- Different ages.
- Different devices.
- Different environments.

Inclusive design benefits everyone.

---

# Accessibility Checklist

Before releasing a feature, confirm:

□ Text is readable.

□ Colour is not the only indicator.

□ Contrast is sufficient.

□ Navigation is predictable.

□ Forms provide clear guidance.

□ Error messages are helpful.

□ Mobile usability verified.

□ Interactive elements are appropriately sized.

□ Feedback is provided for user actions.

---

# Future Improvements

As Champions Legacy Challenge grows, accessibility efforts may expand to include:

- Full WCAG compliance.
- Improved screen reader support.
- Reduced motion settings.
- High contrast themes.
- Larger text options.
- Enhanced keyboard navigation.

Accessibility should continue evolving alongside the application.

---

# Decision Checklist

Before approving a design, ask:

Can users understand this immediately?

Can users recover from mistakes?

Does colour communicate alongside text?

Will this work on mobile?

Would this remain usable for someone with limited vision, dexterity or technical experience?

If the answer to any question is "No", reconsider the design.

---

# Related Documentation

- UX_PRINCIPLES.md
- DESIGN_LANGUAGE.md
- CONTENT_AND_TONE.md
- COMPONENT_PATTERNS.md

---

# Guiding Principle

Accessibility is not about designing for a few people.

It is about removing unnecessary barriers so that every player has the opportunity to become better than they were yesterday.

---

# End of Document
---

# v0.15 Accessibility Addendum

- Group labels and active navigation state must be exposed in text, not colour alone.
- Inbox tabs remain keyboard-operable and preserve visible focus.
- Analytics charts provide accessible names and textual values; heatmap intensity is never the only source of information.
- C.H.A.O.S. completion states include symbols and full wording.

---

# Route Workspace Accessibility

The shared workspace pattern must preserve the following:

- Desktop tabs use `role="tablist"`, `role="tab"` and `role="tabpanel"` relationships.
- The selected tab exposes `aria-selected="true"` and remains in the normal Tab sequence.
- Arrow Left/Right and Arrow Up/Down move between tabs; Home and End jump to the first and last tab.
- Focus moves with keyboard selection and remains visibly styled.
- Mobile uses a visible label and native `<select>` rather than a custom listbox.
- Icons are decorative; labels and descriptions carry the meaning.
- Count/status badges are never the only communication of state.
- Panel entrance motion is removed under `prefers-reduced-motion: reduce`.
- Dynamic role or season-phase changes must fall back to an available section rather than leaving an empty page.

## v0.19 command-centre accessibility

- Health states include icon, heading and explanatory text; colour is supplementary.
- Next actions remain normal links or buttons with visible focus.
- Evidence and snapshot histories use semantic lists and readable timestamps.
- Metric grids collapse without horizontal scrolling.
- Report download exposes a clear busy state and success/error feedback.
- No automatic focus movement or time-based action is introduced.
