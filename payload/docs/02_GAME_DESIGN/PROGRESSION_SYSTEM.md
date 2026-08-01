# Champions Legacy

# Progression System

Version: 4.0
Implemented release: 0.6.0

---

# Purpose

Personal Progression represents long-term commitment. It is separate from competitive Points and is derived from the same factual activity entries.

Points answer:

> How did this activity contribute to competition?

XP answers:

> How consistently have I invested in becoming better?

The player records one activity. Champions Legacy derives every affected system.

---

# Implemented Progression Pipeline

```text
Factual Entries
    ├── Activity Points
    ├── Daily and Weekly Goals
    │      ├── Goal Bonus Points
    │      └── Goal XP
    ├── Daily Consistency Streak
    │      ├── Streak Shield
    │      ├── Milestone Points
    │      └── Milestone XP
    ├── Personal XP and Level
    ├── Achievements
    └── Personal Records
```

No duplicate activity entry is created.

---

# Daily Consistency Streak

## Successful Day

A successful day is a local calendar day on which at least one daily goal is completed.

Simply opening the app or recording an entry below every daily goal does not advance the streak.

The current day remains pending until it ends. It does not break an existing streak while the player still has time to complete a goal.

## Streak Count

- A successful day adds one.
- A protected missed day preserves the streak but adds zero.
- An unprotected missed day resets the current streak.
- Longest Streak records the greatest successful-day count reached.

## Streak Shield

The shield provides forgiving recovery without making consistency meaningless.

- Earn one shield after seven successful streak days.
- Bank a maximum of one shield.
- One missed day automatically consumes it.
- The protected day does not increase the streak.
- A second missed day without a shield resets the streak.
- After a reset, shield progress begins again.

This rule prevents one difficult day from erasing months of progress while still rewarding regular effort.

---

# Streak Milestones

Streak milestone rewards are granted only the first time the player's lifetime Longest Streak reaches each threshold.

| Streak | Bonus Points | XP |
|-------:|-------------:|---:|
| 3 days | 1 | 5 |
| 7 days | 3 | 15 |
| 14 days | 5 | 25 |
| 30 days | 10 | 50 |
| 60 days | 15 | 75 |
| 100 days | 25 | 125 |
| 180 days | 40 | 200 |
| 365 days | 75 | 375 |

The rewards remain deliberately moderate. The main value is recognition, not an overwhelming competitive advantage.

---

# Goal Completion Rewards

## Competitive Bonus Points

| Event | Points |
|-------|-------:|
| Complete one daily goal | 1 |
| Complete all daily goals | 3 additional |
| Complete one weekly goal | 2 |
| Complete all weekly goals | 8 additional |

These bonuses encourage breadth and consistency. They are included in Total Points but are not assigned to a Top Category.

## XP Rewards

| Event | XP |
|-------|---:|
| Participate in one unique category on a day | 2 |
| Complete one daily goal | 5 |
| Complete all daily goals | 10 additional |
| Complete one weekly goal | 8 |
| Complete all weekly goals | 25 additional |

Participation XP is awarded once per category per local day, preventing repeated split entries from farming XP.

---

# Levels

Personal Levels are derived from lifetime XP.

- Level 1 begins at 0 XP.
- Moving from Level 1 to Level 2 requires 100 XP.
- Each later level requires 25 more XP than the previous level.

Examples:

| Current Level | XP needed for next level |
|--------------:|-------------------------:|
| 1 | 100 |
| 2 | 125 |
| 3 | 150 |
| 4 | 175 |
| 5 | 200 |

Levels do not decay over time or reset between challenges. Corrections to editable factual entries may recalculate recent progression because derived data must remain truthful.

## Level Titles

| Minimum Level | Title |
|--------------:|-------|
| 1 | Beginning the Journey |
| 5 | Building Momentum |
| 10 | Dedicated |
| 20 | Champion |
| 35 | Legacy Builder |
| 50 | Living Legend |

Titles provide identity and recognition, not scoring multipliers.

---

# Implemented Achievements

- First Step — first activity.
- Goal Getter — first completed daily goal.
- Perfect Day — all daily goals completed.
- Perfect Week — all weekly goals completed.
- Spark — 3-day streak.
- Momentum — 7-day streak.
- Committed — 14-day streak.
- Unshakeable — 30-day streak.
- Momentum Builder — Level 5.
- Dedicated — Level 10.

Achievements are permanent recognition derived from factual history. They currently provide no additional competitive bonus beyond the explicit goal and streak rewards above.

---

# Personal Records

The current progression summary derives:

- Current streak.
- Longest streak.
- Successful days.
- Completed daily goals.
- Completed weekly goals.
- Perfect days.
- Perfect weeks.

Future personal records will extend the same service layer for running, reading, workouts and category mastery.

---

# Data and Architecture Rules

- Firestore stores factual entries.
- Goal, streak, XP, level and achievement values are derived.
- Progression formulas live in central configuration and pure services.
- React components display summaries and never own progression rules.
- Local calendar dates must remain local and must never shift through UTC conversion.
- Derived events expose goal and progression ruleset identifiers. Future leagues must persist immutable snapshots rather than silently applying new balance values to completed seasons.

---

# Guiding Principle

Progression should make consistency visible without turning one missed day into failure.
