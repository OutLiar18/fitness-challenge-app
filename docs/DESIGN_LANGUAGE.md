# 🏆 Champions Legacy Challenge

# Design Language

Version: 1.0

---

# Purpose

Champions Legacy should feel like a single, polished application regardless of how many features are added.

This document defines the visual identity, interaction patterns and user experience principles that every future screen should follow.

Whenever a new component is created, it should match this design language unless there is a strong reason not to.

---

# Core Personality

Champions Legacy should feel:

🏆 Encouraging

😊 Friendly

⚡ Fast

🎮 Rewarding

📈 Motivating

💪 Energetic

✨ Modern

The application should never feel:

❌ Clinical

❌ Complicated

❌ Corporate

❌ Overwhelming

❌ Punishing

---

# Design Principles

## Mobile First

The smallest supported smartphone is the primary design target.

Every layout should work comfortably on a small phone before being adapted for larger devices.

Expand layouts with media queries.

Never shrink desktop layouts.

---

## Thumb Friendly

Frequently used buttons should be easy to reach.

Large touch targets.

Comfortable spacing.

Minimal typing.

Search instead of scrolling.

---

## One Primary Action

Every screen should have one obvious action.

Examples:

Dashboard

→ Log today's progress

Statistics

→ Explore progress

Achievements

→ Celebrate milestones

Settings

→ Save changes

---

# Colour Philosophy

Colours should communicate meaning.

🟢 Success

Goal reached

🔵 Information

Progress

🟡 Warning

Attention needed

🔴 Error

Validation failures

🟣 Achievement

Rewards

Colours should support the content rather than dominate it.

---

# Typography

Use clear hierarchy.

Heading

Large

Bold

Easy to scan

Subheading

Medium

Supporting information

Body

Comfortable reading size

Buttons

Bold

Easy to tap

Avoid long paragraphs inside the application.

---

# Spacing

Use generous spacing.

The interface should breathe.

Recommended spacing scale

4px

8px

12px

16px

24px

32px

48px

Avoid random spacing values.

---

# Cards

Cards are the primary layout component.

Cards should contain:

Title

Supporting information

Primary action (optional)

Rounded corners.

Consistent padding.

Subtle shadows.

---

# Buttons

Buttons should feel consistent.

Primary

Filled

Most important action

Secondary

Outlined

Supporting action

Danger

Red

Delete

Disabled

Reduced opacity

Not clickable

---

# Forms

Forms should minimise effort.

Rules:

Show only relevant fields.

Clearly indicate required fields.

Clearly indicate optional fields.

Validate immediately where appropriate.

Avoid unnecessary typing.

Prefer dropdowns with search.

Support custom values where sensible.

---

# SmartSelect

SmartSelect is the preferred selection component.

Features:

Search while typing

Instant filtering

Keyboard friendly

Touch friendly

Supports custom values

Minimal scrolling

All future searchable selections should use SmartSelect.

---

# Feedback

The application should always respond to user actions.

Saving

Loading indicator

Success

Positive confirmation

Failure

Friendly explanation

Never leave users wondering if something happened.

---

# Validation

Validation should help rather than punish.

Messages should be:

Friendly

Short

Helpful

Examples

❌ "Water amount is required."

Better

🥤 "Even camels have to start somewhere. Add some water!"

Random humorous messages should occasionally appear.

---

# Progress

Progress should always be visible.

Examples:

Daily goals

Progress bars

Completion percentages

Streaks

XP

Achievements

Users should immediately understand how they are doing.

---

# Animations

Animations should support usability.

Recommended:

Fade

Slide

Scale

Progress fill

Avoid excessive animation.

Animation should never slow users down.

---

# Sound Effects (Future)

Sound should be optional.

Examples

Achievement unlocked

Button click

Daily goal completed

Streak increased

Hidden easter egg

Sounds should be satisfying without becoming annoying.

---

# Easter Eggs

Champions Legacy should contain hidden moments of delight.

Examples

Funny validation messages

Rare encouragements

Special milestone messages

Hidden achievements

Unexpected celebrations

These should reward curiosity and consistency.

---

# Dashboard Philosophy

The dashboard should answer three questions immediately.

1.

How am I doing today?

2.

What should I do next?

3.

What have I already achieved?

Users should never need to search for this information.

---

# Accessibility

Use sufficient colour contrast.

Never rely only on colour.

Large touch targets.

Readable fonts.

Keyboard accessibility where applicable.

Support screen readers where possible.

---

# Responsive Design

Development order

1.

Small phone

↓

2.

Large phone

↓

3.

Tablet

↓

4.

Desktop

Never design desktop first.

---

# Error Handling

Errors should feel supportive.

Bad

"Invalid input."

Better

"Looks like something is missing."

Provide guidance whenever possible.

---

# Empty States

Every empty screen should encourage action.

Example

No entries yet.

↓

Let's start your journey!

Record your first challenge.

---

# Loading States

Avoid blank screens.

Use:

Loading text

Skeleton cards (future)

Progress indicators

---

# Notifications (Future)

Notifications should motivate.

Examples

Daily reminder

Goal completed

Achievement unlocked

Streak saved

Weekly summary

Never spam users.

---

# Future UI Ideas

Achievement celebrations

Confetti

Haptic feedback (mobile)

Season themes

Holiday themes

Animated badges

Interactive charts

Custom profile themes

Daily motivational quotes

Dynamic backgrounds

Weather integration

---

# Golden Rule

Every screen should leave the user feeling slightly more motivated than they were before opening the app.

If a feature adds complexity without improving motivation, usability or scalability, it should be redesigned.

---

# End of Document