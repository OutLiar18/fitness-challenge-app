# Champions Legacy

# Category, Goal and Progression Configuration

Version: 4.0
Implemented release: 0.7.0

---

# Purpose

This document records the current balancing values consumed by the configuration-driven domain services.

Authoritative implementation files:

- `src/constants/categories.js` — category identity, forms and statistical contribution metadata.
- `src/constants/goals.js` — daily and weekly goals.
- `src/constants/points/` — activity point tables and workout scoring.
- `src/constants/progression.js` — goal bonuses, streak milestones, XP and levels.

Do not duplicate these values inside React components.

---

# Daily and Weekly Goals

| Category | Daily | Weekly | Unit |
|----------|------:|-------:|------|
| Water | 2,000 | 15,000 | ml |
| Fruit | 3 | 21 | servings |
| Reading | 60 | 450 | minutes |
| Running | — | 5 | km |
| Upper Body | 50 | 400 | Effective Repetitions |
| Lower Body | 50 | 400 | Effective Repetitions |
| Core | 50 | 400 | Effective Repetitions |
| Cardio | 15 | 150 | minutes |
| Skill Development | 15 | 150 | minutes |
| Steps | 10,000 | 90,000 | steps |

Running's weekly goal also requires at least one Running entry. Weeks use local Monday–Sunday boundaries.

Running duration contributes to Cardio totals.

---

# Running Eligibility

| Property | Value |
|----------|-------|
| Minimum distance for Running points | 3 km |
| Slowest eligible pace | 11:00/km |
| Ineligible run stored | Yes |
| Ineligible run contributes Running distance | Yes |
| Ineligible run contributes Cardio duration/points | Yes |
| Firestore documents per run | One |

---

# Workout Difficulty

Difficulty remains intentionally moderate.

| Tier | Multiplier |
|-----:|-----------:|
| 1 | 1.00 |
| 2 | 1.10 |
| 3 | 1.20 |
| 4 | 1.35 |
| 5 | 1.50 |

Workout goal progress and scoring use Effective Repetitions. Static holds are converted through centrally defined exercise metadata.

---

# Goal Bonus Points

| Completion | Points |
|------------|-------:|
| Daily goal | 1 |
| Daily mission | 3 |
| Weekly goal | 2 |
| Weekly mission | 8 |

The mission bonus is additional to individual goal bonuses.

---

# Streak Configuration

| Property | Value |
|----------|-------|
| Successful day | At least one daily goal completed |
| Shield earn interval | 7 successful days |
| Maximum banked shields | 1 |
| Protected missed day adds to streak | No |
| Second unprotected miss | Resets current streak |

## Streak Milestones

| Days | Points | XP |
|-----:|-------:|---:|
| 3 | 1 | 5 |
| 7 | 3 | 15 |
| 14 | 5 | 25 |
| 30 | 10 | 50 |
| 60 | 15 | 75 |
| 100 | 25 | 125 |
| 180 | 40 | 200 |
| 365 | 75 | 375 |

Milestone rewards are earned only when Longest Streak first reaches the threshold.

---

# XP Configuration

| Event | XP |
|-------|---:|
| Unique category participation per day | 2 |
| Daily goal | 5 |
| Daily mission | 10 |
| Weekly goal | 8 |
| Weekly mission | 25 |

## Level Curve

- Level 1 → 2: 100 XP.
- Each following level requires 25 more XP than the previous level.
- Levels do not reset between challenges.

## Titles

| Minimum Level | Title |
|--------------:|-------|
| 1 | Beginning the Journey |
| 5 | Building Momentum |
| 10 | Dedicated |
| 20 | Champion |
| 35 | Legacy Builder |
| 50 | Living Legend |

---

# Change Control

Balancing changes require:

1. Update central configuration.
2. Add or update domain tests.
3. Update Points, Challenge Rules and Progression documentation.
4. Re-run lint, tests and production build.
5. Consider historical recalculation and future league ruleset versioning.
