# 🏆 Champions Legacy Challenge

# Project Bible

Version: 2.0

---

# 1. Vision

Champions Legacy Challenge is a mobile-first personal growth platform designed to help people build lasting habits through consistency.

Rather than focusing only on fitness, the application encourages users to improve multiple areas of their lives through exercise, reading, healthy living and skill development.

The goal is to make discipline enjoyable by combining progress tracking, gamification, thoughtful design and positive reinforcement.

Every feature should encourage users to become a little better than yesterday.

---

# 2. Mission Statement

Build an application that rewards consistency instead of perfection.

Champions Legacy should help users:

- Build healthy habits
- Stay accountable
- Learn continuously
- Improve physical fitness
- Develop useful skills
- Enjoy the journey

The application should never encourage unhealthy competition or perfectionism.

---

# 3. Core Values

## Growth

Small improvements every day create extraordinary long-term results.

---

## Consistency

Showing up every day is more valuable than occasional perfection.

---

## Accountability

Users should honestly record their progress.

The application should encourage honesty rather than punish mistakes.

---

## Simplicity

The interface should remain approachable for first-time users.

Power should come from good design rather than complexity.

---

## Flexibility

Challenge rules will evolve over time.

The application should adapt without requiring large code changes.

---

## Enjoyment

Building good habits should feel rewarding.

Small moments of delight should exist throughout the application.

---

# 4. Design Philosophy

Champions Legacy follows a mobile-first philosophy.

The smallest supported smartphone is considered the primary design target.

Desktop layouts are enhancements rather than the default experience.

The interface should prioritise:

- Large touch targets
- One-handed usage
- Minimal typing
- Fast interactions
- Clear navigation
- Immediate feedback
- Visible progress

Every screen should answer one simple question:

"What should I do next?"

---

# 5. Development Philosophy

The project follows several guiding principles.

## Configuration over Hardcoding

Application behaviour should come from configuration whenever possible.

Categories define:

- fields
- units
- daily goals
- score fields
- validation
- future scoring

Adding a new category should require little or no modification elsewhere.

---

## Reusable Components

Components should solve one problem well.

Avoid duplicate UI.

---

## Service Layer

Business logic belongs inside services.

Components should focus on rendering and user interaction.

---

## Utility Functions

Shared helper logic belongs inside utilities.

Avoid repeating calculations.

---

## Documentation First

Architecture decisions should always be documented.

Future ideas should be written down instead of remembered.

---

# 6. Technology Stack

Frontend

- React
- Vite

Backend

- Firebase Authentication
- Cloud Firestore

Hosting

- Netlify

Version Control

- Git
- GitHub

Future Technologies

- Progressive Web App
- Push Notifications
- Cloud Functions
- AI Features

---

# 7. Current Architecture

Authentication

↓

User Profile

↓

Dashboard

↓

Category Configuration

↓

Dynamic Form Engine

↓

Validation Service

↓

Entry Service

↓

Firestore

↓

Statistics Engine

↓

Achievements

↓

Leaderboards

↓

Analytics

---

# 8. Project Structure

src/

components/

pages/

services/

constants/

utils/

styles/

assets/

docs/

firebase.js

main.jsx

---

# 9. Coding Standards

The project follows these standards.

• Mobile-first

• Reusable components

• Configuration-driven architecture

• Single Responsibility Principle

• Keep components small

• Keep services focused

• Keep constants descriptive

• Avoid duplicate code

• Prefer readability over cleverness

• Write scalable solutions

---

# 10. Current Features

Completed

✅ Firebase Authentication

✅ User Profiles

✅ Login

✅ Signup

✅ Protected Routes

✅ Dashboard

✅ Dynamic Categories

✅ Dynamic Forms

✅ SmartSelect Component

✅ Dynamic Validation

✅ Funny Validation Messages

✅ Entry Saving

✅ Entry Deletion

✅ Statistics Service

✅ Configuration-Driven Categories

✅ Daily Goal Architecture

✅ Mobile-First Design

✅ Real-Time Firestore Updates

---

Current Version

Version 0.3 (In Development)

---

**END OF PART 1**
# 11. User Roles

## Participant

Every user is a Participant by default.

Participants can:

- Create entries
- View their own entries
- Delete their own entries
- Track daily progress
- View personal statistics
- Earn achievements
- Participate in leaderboards
- Complete daily challenges

Participants cannot edit or delete other users' data.

---

## Administrator

Administrators exist to maintain fairness rather than manually manage the challenge.

Administrators will eventually be able to:

- Manage users
- Review reports
- Edit challenge settings
- Configure categories
- Award bonus points
- View global analytics
- Reset seasons
- Manage leaderboards

The goal is to minimise repetitive administrative work through automation.

---

## Super Administrator (Future)

Reserved for project owners.

Can manage:

- Administrators
- System configuration
- Challenge seasons
- Global application settings

---

# 12. Data Philosophy

Entries should store facts.

They should never permanently store calculated information.

Example:

Store:

- Water consumed
- Distance run
- Reading minutes
- Exercise reps

Do NOT permanently store:

- Daily totals
- Weekly totals
- Points
- Achievements
- Rankings

Those values should always be calculated.

Benefits:

- Rules can change.
- Statistics remain accurate.
- No database migrations are required.
- Historical data remains valid.

---

# 13. Statistics Philosophy

Statistics should help users understand their habits.

The goal is not simply to display numbers.

Statistics should answer meaningful questions.

Examples:

- Am I improving?
- Which habits am I neglecting?
- What is my strongest habit?
- What should I focus on today?
- How consistent have I been?

Future statistics include:

- Daily totals
- Weekly summaries
- Monthly summaries
- Yearly summaries
- Personal bests
- Longest streak
- Favourite exercise
- Favourite fruit
- Favourite cardio activity
- Reading trends
- Workout volume
- Heatmaps
- Year in Review

---

# 14. Gamification Philosophy

Champions Legacy should motivate users through positive reinforcement.

Examples include:

- Daily goals
- Weekly goals
- Streaks
- Achievements
- Milestones
- XP
- Levels
- Titles
- Badges
- Leaderboards
- Seasonal events

Competition should encourage improvement rather than discourage beginners.

Consistency should always be rewarded more than perfection.

---

# 15. Current Challenge Rules

Current daily goals:

💧 Water

2000 ml

---

🍎 Fruit

3 servings

---

📚 Reading

30 minutes

---

🏃 Running

5 km

---

💪 Upper Body

50 reps

---

🦵 Lower Body

50 reps

---

🔥 Core

50 reps

---

🚴 Cardio

30 minutes

---

🎯 Skill Development

30 minutes

---

👣 Steps

10,000 steps

---

Future challenge rules should be configurable through category configuration rather than hardcoded values.

---

# 16. User Experience Philosophy

The application should feel encouraging.

Users should always know:

- what they have achieved
- what they should do next
- how close they are to today's goals

The application should never feel stressful.

Humour, encouragement and small celebrations should make using the application enjoyable.

Micro-interactions should reward progress without becoming distracting.

---

# 17. Development Workflow

When developing new features:

1. Design the architecture.

2. Update configuration if necessary.

3. Build reusable services.

4. Build reusable components.

5. Connect the UI.

6. Test manually.

7. Update documentation.

Future ideas should be recorded instead of interrupting development.

---

# 18. Documentation Standards

The project documentation consists of:

PROJECT_BIBLE.md

Defines philosophy, standards and architecture.

ROADMAP.md

Defines planned work.

CHANGELOG.md

Records completed work.

HANDOVER.md

Summarises the current development state.

FUTURE_IDEAS.md

Stores ideas for later versions.

DESIGN_LANGUAGE.md

Defines UI and UX standards.

Documentation is considered part of the project rather than an optional extra.

---

# 19. Long-Term Vision

Champions Legacy should become a polished production-quality application capable of supporting large personal development challenges.

The application should eventually include:

- Leaderboards
- Teams
- Seasons
- Achievements
- Analytics
- Personal insights
- AI coaching
- Offline support
- Progressive Web App functionality
- Wearable integrations
- Exportable reports

The application should also serve as a professional portfolio project demonstrating modern software engineering practices.

---

# 20. Non-Negotiable Principles

The following principles should guide every future decision.

✅ Mobile-first

✅ Configuration over hardcoding

✅ Reusable components

✅ Scalable architecture

✅ Clean code

✅ Readable code

✅ Small focused services

✅ Minimal duplicate logic

✅ Immediate user feedback

✅ Encourage consistency

✅ Celebrate progress

✅ Record ideas instead of forgetting them

✅ Build foundations before features

If a future feature conflicts with these principles, the feature should be redesigned rather than compromising the project's standards.

---

# End of Document