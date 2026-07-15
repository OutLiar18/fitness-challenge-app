# 🏆 Champions Legacy Challenge
# Project Handover
Version: 0.2.0

---

# Current Status

The project is fully functional.

Users can:

- Create an account
- Log in
- Log out
- Save challenge entries
- View their entries
- Delete their own entries

The application is deployed on Netlify and connected to Firebase.

---

# Current Tech Stack

Frontend
- React
- Vite

Backend
- Firebase Authentication
- Cloud Firestore
- (Future) Firebase Storage

Hosting
- Netlify

Repository
- GitHub

---

# Current Database

Collections

users

challengeEntries

---

users fields

uid

email

displayName

role

team

joinedAt

currentStreak

totalPoints

---

challengeEntries fields

userId

category

(created dynamically)

createdAt

---

Current Architecture

Authentication

↓

Dashboard

↓

Category Selection

↓

Dynamic Form

↓

Challenge Entry

↓

Firestore

---

Current Progress

Completed

✅ Authentication

✅ User Profiles

✅ Dashboard

✅ Dynamic Category System

✅ Dynamic Entry Forms

✅ Save Entries

✅ Delete Entries

✅ Firestore Integration

✅ GitHub

✅ Netlify

---

Current Priority

Build the complete proof upload system using Firebase Storage.

This system is required before the Admin Dashboard can be completed.

---

Next Planned Features

1. Image Uploads

2. Display Name support (replace email throughout the app)

3. Admin Role System

4. Admin Dashboard

5. Points Engine

6. Analytics

7. Leaderboards

8. Achievements

---

Challenge Philosophy

Champions Legacy Challenge is not only a fitness tracker.

It encourages

- Discipline
- Accountability
- Reading
- Skill Development
- Healthy Living
- Integrity
- Consistency

Every future feature should reinforce these principles.

---

Important Rules

Water

Optional photo.

Bonus points awarded for proof.

Fruit

Uses the culinary definition.

Tomatoes do not count.

Optional proof.

Maximum bonus equivalent to three fruits per day.

Running

Mandatory screenshot.

Requires admin approval.

Steps

Mandatory screenshot.

Workout Categories

No proof required.

Many exercise sub-types.

Need to prevent ambiguity such as one-sided exercises.

Reading

Reflection field required.

Skill

No description required.

Optional proof.

---

Future Admin Features

Admins should be able to

Approve submissions

Reject submissions

Award bonus points

Correct mistakes

Edit scores

Manage users

Review evidence

Search participants

View analytics

---

Development Preferences

The project owner prefers:

• Very small steps.

• Copy-paste instructions.

• Minimal theory.

• Every assistant response should end with a practical task.

• Build scalable systems rather than quick fixes.

• Record future ideas instead of interrupting the current task.

---

Important Future Ideas

Funny validation messages.

Hidden easter eggs.

Extensive analytics.

Dynamic points engine.

Configurable categories.

Configurable scoring.

Exercise library.

Fruit library.

Season support.

Achievements.

Badges.

Dark mode.

Push notifications.

AI coaching (future possibility).

---

Known Issues

Display name is not yet used throughout the application.

Image uploads have not yet been implemented.

Admin portal does not yet exist.

Points engine not yet implemented.

Some validation still needs improvement.

---

Current Goal

Build Version 0.3.

Primary objective:

Implement Firebase Storage image uploads as the foundation for proof submission and admin review.