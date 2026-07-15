# 🏆 Champions Legacy Challenge
## Project Bible
Version: 1.0

---

# 1. Vision

Champions Legacy Challenge is a gamified personal development platform.

The purpose of the application is not simply to track exercise, but to encourage participants to become better versions of themselves through consistency, accountability, honesty, discipline and continuous self-improvement.

Unlike traditional fitness apps, Champions Legacy combines physical health, education, skill development and lifestyle habits into one unified challenge.

The application should always prioritize long-term growth over short-term point accumulation.

---

# 2. Core Principles

Every feature added to the application should support one or more of these principles.

## Growth

Encourage continuous improvement.

## Consistency

Reward showing up every day.

## Accountability

Participants should honestly report their activities.

Proof systems exist to increase fairness rather than create punishment.

## Simplicity

The application should be simple enough for new users while still being powerful enough for administrators.

## Flexibility

Challenge rules will evolve over time.

The application should allow categories, exercises and scoring to be modified without changing source code whenever possible.

---

# 3. Project Goals

Create a challenge platform that can manage hundreds of participants.

Reduce admin workload.

Provide meaningful statistics.

Encourage healthy habits.

Provide a fun experience.

Create an application worthy of production use.

Serve as a professional software portfolio project.

---

# 4. Current Technology

Frontend

React

Build Tool

Vite

Database

Cloud Firestore

Authentication

Firebase Authentication

Hosting

Netlify

Version Control

Git + GitHub

---

# 5. Current Architecture

Authentication

↓

User Profile

↓

Dashboard

↓

Category System

↓

Dynamic Form Engine

↓

Challenge Entry

↓

Points Engine

↓

Admin Review

↓

Analytics

---

# 6. Current Features

Completed

✓ Firebase Authentication

✓ Login

✓ Signup

✓ Protected Routes

✓ Dashboard

✓ GitHub Repository

✓ Netlify Deployment

✓ Firebase Integration

✓ Dynamic Categories

✓ Dynamic Entry Forms

✓ Entry Saving

✓ Entry Listing

✓ Delete Entries

✓ User Profiles

Currently In Progress

Dynamic Form Expansion

---

# 7. Planned Architecture

Users

↓

Entries

↓

Evidence

↓

Admin Review

↓

Points

↓

Leaderboards

↓

Analytics

↓

Achievements

---

# 8. User Roles

Participant

Default role.

Can:

Create entries

View own history

View own statistics

Upload evidence

View leaderboard

Administrator

Can:

Approve evidence

Reject evidence

Award bonus points

Edit scores

Correct mistakes

Review submissions

Manage users

View global analytics

Modify challenge settings

Future

Super Admin

Reserved.

---

# 9. Dynamic Category System

The application uses one dynamic form engine.

Every category describes its own fields.

This allows new categories to be added without writing new forms.

---

# 10. Dynamic Entry System

Entries do not share identical structures.

Example

Fruit

fruitType

quantity

photo

Reading

book

minutes

reflection

Running

distance

time

proof

The application saves whatever fields belong to the selected category.

---

# 11. Points Philosophy

Entries should never permanently store calculated points.

Entries store facts.

The points engine calculates scores.

Benefits

Challenge rules can change.

Historical data remains valid.

No mass database updates required.

---

# 12. Proof Philosophy

Proof exists to improve fairness.

Proof is never intended to punish honest participants.

Evidence may be

Photo

Screenshot

Video (future)

---

# 13. Admin Philosophy

Administrators should review evidence rather than manually calculate everything.

The application should automate repetitive tasks.

Admins should only intervene where human judgement is required.

---

# 14. Statistics Philosophy

Participants should be able to discover patterns.

Examples

Most eaten fruit

Books completed

Reading minutes

Favourite exercise

Running distance

Workout totals

Current streak

Longest streak

Community statistics should also exist.

---

# 15. Future Features

Leaderboards

Achievements

Badges

Daily Missions

Weekly Challenges

Teams

Houses

Season Statistics

Notifications

Push Notifications

AI Coaching

Meal Tracking

Exercise Library

Fruit Library

Charts

Export Reports

Mobile Optimisation

Dark Mode

Offline Mode

---

# 16. Development Standards

Prefer reusable components.

Avoid duplicated code.

Prefer configuration over hardcoding.

Write scalable solutions.

Design mobile-first.

Keep admin workload minimal.

---

# 17. Current Folder Structure

src/

components/

pages/

context/

routes/

constants/

utils/

public/

docs/

---

# 18. Completed Milestones

Authentication

Firebase

GitHub

Netlify

Dashboard

Dynamic Categories

Dynamic Forms

User Profiles

Entry Saving

Real-time Updates

---

# 19. Immediate Roadmap

Complete User Profiles

Exercise Library

Fruit Library

Reading System

Running System

Evidence Uploads

Points Engine

Admin Dashboard

Analytics Dashboard

Leaderboards

Achievements

---

# 20. Long-Term Goal

Champions Legacy Challenge should become a polished production-quality application that can realistically host large community challenges while showcasing professional software engineering practices.

Every future feature should support that goal.