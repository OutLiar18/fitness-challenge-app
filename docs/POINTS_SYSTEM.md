# 🏆 Champions Legacy Challenge

# Points System

Version: 2.0

---

# Purpose

This document defines the official points system for Champions Legacy Challenge.

It is intended to be the single source of truth for:

- Participants
- Administrators
- Developers
- Future versions of the application

The purpose of the points system is to reward discipline, consistency and balanced self-improvement while discouraging unhealthy behaviour motivated purely by earning points.

This document defines **how points are calculated**, while the Challenge Rules define **what activities qualify for the challenge**.

---

# Relationship to Other Documentation

This document should always be read alongside:

- PROJECT_BIBLE.md
- ARCHITECTURE.md
- CHALLENGE_RULES.md

Responsibilities are intentionally separated.

| Document        | Responsibility                         |
| --------------- | -------------------------------------- |
| Challenge Rules | Defines what participants may do       |
| Points System   | Defines how activities are rewarded    |
| Architecture    | Defines how the software is structured |

---

# Core Philosophy

Champions Legacy is built around one central belief:

> **Consistency beats perfection.**

The points system rewards:

- Consistency
- Discipline
- Effort
- Long-term growth
- Balanced self-improvement

The challenge is **not** designed to reward only athletic ability.

A participant who consistently improves multiple areas of life should remain competitive with someone who specialises in only one category.

The goal is sustainable personal development rather than maximising daily points through unhealthy behaviour.

---

# Design Principles

The points engine follows several non-negotiable design principles.

## 1. Store Facts Only

Firestore stores factual information only.

Examples include:

- Water consumed
- Fruit servings
- Reading duration
- Running distance
- Workout exercises
- Workout repetitions
- Workout duration
- Hold duration
- Cardio activity
- Cardio duration
- Skill development duration

Firestore must never permanently store:

- Points
- Effective Repetitions
- Difficulty multipliers
- Balance bonuses
- Daily totals
- Rankings
- Achievement calculations

All calculated values must always be derived dynamically.

---

## 2. Statistics Never Stop

Statistics represent historical facts.

They should always continue increasing regardless of point limits.

Examples:

A participant drinks:

18 litres of water

Statistics

18 litres

Points

Maximum water score

This principle applies to every category.

---

## 3. Points Eventually Stop

Every category has a maximum obtainable daily score.

This prevents unhealthy behaviour motivated purely by point farming.

Examples include:

- Drinking excessive water
- Running dangerous distances daily
- Walking unreasonable numbers of steps
- Reading purely for points
- Excessive workout volume

Additional effort continues contributing to statistics even after the point cap has been reached.

---

## 4. Configuration Over Code

Categories should define their own scoring configuration.

The points engine should interpret configuration rather than rely on hard-coded category logic wherever practical.

Future categories should require configuration changes rather than architectural changes.

---

## 5. Deterministic

The same input should always produce the same output.

Point calculations must never rely upon randomness.

---

## 6. Transparent

Participants should always be able to understand how their score was calculated.

Although the application may internally use:

- Difficulty multipliers
- Effective repetitions
- Hold conversions
- Bonus systems

The resulting calculations should remain deterministic and explainable.

---

## 7. Extensible

Future additions should integrate into the existing architecture without requiring significant redesign.

Examples include:

- New categories
- Exercise libraries
- Cardio libraries
- Achievement rewards
- Seasonal events
- Community challenges

---

# Core Architecture

The points engine follows the existing Champions Legacy architecture.

Categories remain the single source of truth.

Firestore remains a factual datastore.

Business logic belongs inside the PointsService.

Statistics continue consuming the PointsService where appropriate.

Components should never calculate points.

Application layers should remain clearly separated.

```
User Entry
      │
      ▼
Firestore (Facts Only)
      │
      ▼
PointsService
      │
      ▼
StatisticsService
      │
      ▼
Dashboard / Journal / Analytics
```

---

# Statistics vs Points

One of the most important principles within Champions Legacy is the separation of statistics from points.

Statistics represent everything the participant has accomplished.

Points exist only as motivation.

Example

Daily Water

12,000 ml

Statistics

12,000 ml

Points

12

The same principle applies to:

- Fruit
- Reading
- Running
- Steps
- Cardio
- Skill Development
- Upper Body
- Lower Body
- Core

This allows participants to continue pursuing personal bests without encouraging unhealthy behaviour.

---

# Universal Scoring Engine

Every category follows the same general process.

```
Recorded Activity

↓

Validate Entry

↓

Category Calculation

↓

Category Score

↓

Bonuses

↓

Daily Score
```

Each category defines:

- Daily Goal
- Point Table
- Maximum Score
- Bonus Eligibility
- Statistics Behaviour

The point calculation engine interprets these rules dynamically.

---

# Category Structure

Every category should eventually define a standard configuration.

Conceptually, every category provides:

| Property                  | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| id                        | Unique identifier                        |
| dailyGoal                 | Daily completion target                  |
| unit                      | Display unit                             |
| scoreTable                | Base point brackets                      |
| maximumPoints             | Maximum obtainable base score            |
| supportsDifficulty        | Applies difficulty multipliers           |
| supportsVerificationBonus | Eligible for manual verification bonuses |
| supportsBalanceBonus      | Counts toward balance bonus              |
| statisticsContinue        | Statistics continue beyond point cap     |

Not every category requires every property.

This structure exists to keep the points engine generic and maintainable.

---

# Water

## Daily Goal

2000 ml

---

## Purpose

Encourage proper hydration while discouraging dangerous overconsumption.

---

## Base Point Table

| Water Consumed | Points |
| -------------- | -----: |
| 0–499 ml       |      0 |
| 500–999 ml     |      1 |
| 1000–1499 ml   |      2 |
| 1500–1999 ml   |      3 |
| 2000–2499 ml   |      5 |
| 2500–2999 ml   |      6 |
| 3000–3999 ml   |      7 |
| 4000–4999 ml   |      8 |
| 5000–6999 ml   |      9 |
| 7000–9999 ml   |     10 |
| 10000+ ml      |     12 |

---

## Verification Bonus

Water photo verification is performed manually by an administrator.

Each verified submission awards:

+1 point

Maximum:

+3 points per day

---

## Maximum Daily Score

15 Points

---

## Statistics

Water statistics continue increasing without limit.

Only points are capped.

---

# Fruit

## Daily Goal

3 servings

---

## Purpose

Encourage daily fruit consumption without rewarding excessive intake.

---

## Base Point Table

| Fruit Servings | Points |
| -------------- | -----: |
| 0              |      0 |
| 1              |      1 |
| 2              |      2 |
| 3 or more      |      3 |

---

## Verification Bonus

Verified fruit photos award:

+1 point

Maximum:

+3 points per day

---

## Maximum Daily Score

6 Points

---

## Statistics

Fruit statistics continue increasing indefinitely.

Only the first three servings contribute toward daily challenge completion.

---

# Reading

## Daily Goal

30 minutes

---

## Purpose

Encourage continuous learning rather than merely counting pages.

Reading duration determines base points.

Reflection requirements are defined separately within the Challenge Rules.

---

## Base Point Table

| Minutes | Points |
| ------- | -----: |
| 0–9     |      0 |
| 10–14   |      1 |
| 15–19   |      2 |
| 20–29   |      3 |
| 30–44   |      6 |
| 45–59   |      8 |
| 60–89   |     10 |
| 90–119  |     12 |
| 120–179 |     15 |
| 180–239 |     18 |
| 240–359 |     22 |
| 360+    |     25 |

---

## Book Completion Bonus

Awarded manually by an administrator.

+15 Points

Granted once for each completed book.

---

## Maximum Daily Score

40 Points

---

## Statistics

Reading statistics continue increasing indefinitely.

Lifetime reading remains independent from daily point limits.

---

# Skill Development

## Daily Goal

30 minutes

---

## Purpose

Reward deliberate practice and continuous learning.

Skill Development intentionally shares the same progression curve as Reading.

---

## Base Point Table

Skill Development uses the same point table as Reading.

---

## Bonuses

No completion bonus currently exists.

Future achievement rewards may apply separately.

---

## Maximum Daily Score

25 Points

---

## Statistics

Skill Development statistics continue indefinitely.

---

# Steps

## Daily Goal

10,000 steps

---

## Purpose

Encourage general daily movement while discouraging unhealthy step farming.

---

## Base Point Table

| Steps       | Points |
| ----------- | -----: |
| 0–2999      |      0 |
| 3000–4999   |      1 |
| 5000–7999   |      2 |
| 8000–9999   |      3 |
| 10000–11999 |      5 |
| 12000–14999 |      6 |
| 15000–17999 |      7 |
| 18000–19999 |      8 |
| 20000–24999 |      9 |
| 25000–29999 |     10 |
| 30000–39999 |     12 |
| 40000–49999 |     14 |
| 50000–59999 |     16 |
| 60000–69999 |     18 |
| 70000+      |     20 |

---

## Maximum Daily Score

20 Points

---

## Statistics

Step statistics never stop increasing.

---

# Running

## Daily Goal

5 km

---

## Purpose

Reward cardiovascular endurance while recognising exceptional performances beyond the daily goal.

Running pace is recorded for statistics and analytics.

Distance determines points.

---

## Base Point Table

| Distance    | Points |
| ----------- | -----: |
| 0–2.99 km   |      0 |
| 3–4.99 km   |      8 |
| 5–7.99 km   |     18 |
| 8–9.99 km   |     22 |
| 10–11.99 km |     26 |
| 12–14.99 km |     30 |
| 15–17.99 km |     34 |
| 18–20.99 km |     38 |
| 21–24.99 km |     42 |
| 25–29.99 km |     46 |
| 30–39.99 km |     50 |
| 40–49.99 km |     55 |
| 50–59.99 km |     60 |
| 60+ km      |     65 |

---

## Maximum Daily Score

65 Points

---

## Statistics

Running statistics continue indefinitely.

Examples include:

- Total distance
- Total running time
- Fastest pace
- Longest run
- Lifetime kilometres

These statistics remain independent from daily point limits.

---

# End of Part 1

Part 2 defines:

- Workout Engine
- Effective Repetitions
- Difficulty Tiers
- Static Hold Conversions
- Cardio Engine
- Manual Bonuses
- Balance Bonus

# Workout Engine

Workout categories are fundamentally different from the other challenge categories.

Where most categories measure:

- Distance
- Duration
- Servings
- Quantity

Workout categories measure **effort**.

The points system therefore introduces the concept of **Effective Repetitions**.

This allows difficult exercises to receive a modest reward without allowing advanced athletes to dominate purely because of exercise selection.

---

# Workout Categories

The Workout Engine currently applies to:

- 💪 Upper Body
- 🦵 Lower Body
- 🔥 Core

Each category shares the same calculation engine.

Only the recorded exercises differ.

---

# Core Philosophy

Workout points should reward:

- Consistency
- Total work performed
- Exercise difficulty
- Progressive overload

Workout points should **not** encourage participants to avoid easier exercises entirely.

Difficulty bonuses therefore remain intentionally modest.

---

# Raw Repetitions

Participants always record their actual repetitions.

Examples

20 Push-ups

15 Pull-ups

30 Squats

12 Bench Press

Statistics always use these raw repetitions.

Raw repetitions are never modified.

---

# Effective Repetitions

Effective Repetitions are calculated dynamically during point calculation.

They represent the adjusted workload after exercise difficulty has been considered.

They are never stored.

They only exist during calculation.

Formula

```
Effective Reps

=

Raw Reps

×

Difficulty Multiplier
```

---

# Why Effective Repetitions Exist

Without Effective Repetitions:

50 Push-ups

and

50 One Arm Push-ups

would receive exactly the same score.

That fails to recognise increased difficulty.

However,

difficulty should never outweigh consistency.

Therefore the multipliers remain deliberately conservative.

---

# Difficulty Tiers

Every exercise belongs to one of four difficulty tiers.

These tiers are defined within the exercise library.

| Tier | Multiplier |
|------|-----------:|
| Tier 1 | 1.00 |
| Tier 2 | 1.10 |
| Tier 3 | 1.20 |
| Tier 4 | 1.35 |

Tier assignments should be reviewed periodically as the exercise library expands.

---

# Tier Philosophy

## Tier 1

Standard movements.

Examples

- Push-ups
- Bodyweight Squats
- Lunges
- Bench Press
- Machine Press
- Machine Rows

---

## Tier 2

Intermediate movements requiring additional strength or stability.

Examples

- Archer Push-ups
- Bulgarian Split Squats
- Weighted Pull-ups
- Ring Rows

---

## Tier 3

Advanced movements requiring significant strength or control.

Examples

- Muscle Ups
- Handstand Push-ups
- Pistol Squats
- Front Lever Rows

---

## Tier 4

Elite movements requiring exceptional skill.

Examples

- One Arm Pull-ups
- Planche Push-ups
- One Arm Handstand Push-ups

Tier 4 should remain intentionally small.

---

# Workout Point Table

Once Effective Repetitions have been calculated, every workout category uses the same point table.

| Effective Repetitions | Points |
|----------------------:|-------:|
| 10–30 | 1 |
| 31–50 | 2 |
| 51–75 | 3 |
| 76–100 | 4 |
| 101–120 | 5 |
| 121–150 | 6 |
| 151–180 | 7 |
| 181–200 | 8 |
| 201–230 | 9 |
| 231–250 | 10 |
| 251–350 | 14 |
| 351–500 | 18 |
| 501+ | 22 |

---

# Maximum Workout Score

Maximum Daily Score

22 Points

per workout category.

Statistics continue increasing beyond this limit.

---

# Multiple Exercises

Workout categories combine all exercises performed during the day.

Example

Upper Body

40 Push-ups

20 Pull-ups

15 Bench Press

↓

Total Effective Repetitions

↓

Single point calculation

The participant receives one Upper Body score.

Not one score per exercise.

---

# Weighted Exercises

Weight is recorded for analytics.

Weight does **not** currently influence points.

Reasons

- Simpler calculations
- Fair comparison between participants
- Easier balancing

Future versions may introduce optional strength achievements.

---

# Static Holds

Static exercises cannot be measured using repetitions.

Instead,

they are converted into Effective Repetitions.

---

# Hold Conversion

Each static exercise defines

- Difficulty Tier
- Seconds required for one Effective Rep

Example

Plank

30 seconds

↓

1 Effective Rep

Front Lever

10 seconds

↓

1 Effective Rep

The exact conversion values are maintained by the exercise library.

The points engine simply consumes these values.

---

# Mixed Workouts

Dynamic and static exercises may be combined.

Example

50 Push-ups

+

60 second Plank

↓

Effective Repetitions

↓

Workout Points

This allows static exercises to integrate seamlessly.

---

# Exercise Library

Every exercise should eventually define:

- Name
- Category
- Difficulty Tier
- Static or Dynamic
- Hold Conversion (if required)

No point values belong inside the exercise library.

The exercise library only supplies metadata.

---

# Cardio Engine

Cardio uses a different calculation model from workouts.

Duration determines the base score.

Difficulty adjusts the final result.

---

# Base Point Table

| Minutes | Points |
|---------|-------:|
| 0–14 | 0 |
| 15–29 | 2 |
| 30–44 | 6 |
| 45–59 | 8 |
| 60–89 | 10 |
| 90–119 | 12 |
| 120–179 | 15 |
| 180–239 | 18 |
| 240–359 | 22 |
| 360+ | 25 |

---

# Cardio Difficulty

Each cardio activity belongs to one of four tiers.

| Tier | Multiplier |
|------|-----------:|
| Tier 1 | 1.00 |
| Tier 2 | 1.10 |
| Tier 3 | 1.20 |
| Tier 4 | 1.35 |

Final Cardio Score

```
Base Points

×

Difficulty Multiplier

↓

Round to nearest whole number
```

---

# Cardio Philosophy

Longer duration remains the primary contributor.

Difficulty provides a modest bonus.

Examples

30 minutes Walking *(not currently allowed by challenge rules)*

↓

Tier 1

↓

6 Points

30 minutes Swimming

↓

Tier 3

↓

7 Points

The bonus recognises increased effort while ensuring consistency remains more valuable.

---

# Manual Bonus System

Certain rewards cannot be calculated automatically.

These bonuses are awarded manually by an administrator.

Examples

- Fruit photo verification
- Water photo verification
- Book completion
- Exceptional achievement

Manual bonuses remain completely separate from category calculations.

---

# Balance Bonus

The Balance Bonus rewards participants for improving multiple areas of life.

It is awarded once per day.

| Completed Categories | Bonus |
|---------------------:|------:|
| 3 | +3 |
| 5 | +8 |
| 7 | +15 |
| 10 | +30 |

This encourages balanced development rather than specialising in only one category.

---

# Daily Score Formula

The complete daily score follows the same structure every day.

```
Category Scores

+

Balance Bonus

+

Manual Bonuses

+

Future Achievement Bonuses

=

Daily Score
```

Each component remains independent.

This separation keeps calculations transparent, maintainable and easy to extend.

---

# End of Part 2

Part 3 defines:

- Achievement Points
- Anti-Abuse Rules
- Transparency
- Implementation Notes
- Future Expansion
- Worked Examples
- Version History

# Achievement Points

The daily points system rewards consistent effort.

Achievement Points reward significant milestones.

Unlike daily points, Achievement Points are generally awarded once.

Examples include:

- First Pull-up
- First Muscle-up
- First Handstand
- First Marathon
- First Half Marathon
- First 100 km Run
- First 100 Books Read
- First 365 Day Streak
- First Planche
- First Front Lever
- First One Arm Push-up
- First One Arm Pull-up

Achievement rewards are independent of daily category scoring.

---

# Achievement Philosophy

Achievements exist to celebrate personal milestones.

They should encourage participants to:

- Try new things
- Improve difficult skills
- Build consistency
- Pursue long-term goals

Achievements should never replace daily discipline.

Daily consistency should remain the largest contributor to long-term progression.

---

# Future Achievement Categories

Future versions may include achievements for:

## Fitness

- Strength
- Endurance
- Mobility
- Flexibility
- Calisthenics
- Running

---

## Learning

- Reading milestones
- Skill development milestones
- Programming
- Languages
- Music
- Art

---

## Consistency

- Daily streaks
- Weekly streaks
- Monthly streaks
- Perfect weeks
- Perfect months

---

## Legacy

- Lifetime water consumed
- Lifetime distance run
- Lifetime steps
- Lifetime books completed
- Lifetime workout repetitions

---

# Anti-Abuse Rules

The points system has been intentionally designed to discourage unhealthy behaviour.

Participants should never feel encouraged to sacrifice their health in pursuit of additional points.

---

## Daily Point Caps

Every category has a maximum obtainable score.

Statistics continue increasing.

Points eventually stop.

Examples include:

- Water
- Reading
- Running
- Steps
- Cardio
- Skill Development
- Workout categories

---

## Duplicate Entries

Future versions may automatically detect:

- Duplicate submissions
- Impossible activity combinations
- Unrealistic values
- Suspicious patterns

Administrators retain final discretion.

---

## Manual Verification

Certain bonuses require administrator approval.

Examples include:

- Fruit photo bonuses
- Water photo bonuses
- Book completion bonuses
- Exceptional achievement rewards

These bonuses are intentionally excluded from automatic point calculations.

---

## Fair Competition

Champions Legacy is not intended to reward:

- Dangerous behaviour
- Excessive volume
- Artificial point farming
- Exploiting software bugs

Participants are encouraged to compete with themselves rather than other people.

---

# Transparency

Every score within Champions Legacy should be explainable.

Participants should always be able to understand:

- Why points were awarded
- How bonus points were earned
- Why a category stopped awarding points
- How Effective Repetitions were calculated
- Why Balance Bonuses were received

The application should avoid hidden calculations whenever possible.

Transparency builds trust.

---

# Developer Implementation Notes

The following architectural principles should always be respected.

---

## Categories remain configuration-driven

New categories should be added primarily through configuration.

Business logic should remain generic wherever practical.

---

## Points belong inside PointsService

Components should never calculate points.

Pages should never calculate points.

Forms should never calculate points.

Only the PointsService should determine category scores.

---

## Statistics belong inside StatisticsService

Statistics should consume the PointsService when necessary.

Statistics should remain independent from user interface components.

---

## Firestore stores facts only

Firestore should only ever contain factual information.

Never permanently store:

- Daily scores
- Effective Repetitions
- Bonus calculations
- Rankings
- Leaderboard positions

Everything should be recalculated whenever required.

---

## Exercise Library

Exercises should define metadata only.

Examples include:

- Name
- Category
- Difficulty Tier
- Static or Dynamic
- Hold Conversion

Exercises should never define point values.

Point calculations remain the responsibility of the Points Engine.

---

## Future Libraries

The same architecture should eventually support:

- Exercise Library
- Cardio Library
- Skill Library
- Achievement Library
- Quote Library
- Easter Egg Library

Every library should provide configuration rather than business logic.

---

# Future Expansion

The points engine has been intentionally designed for future growth.

Potential future additions include:

- Prestige System
- XP
- Levels
- Titles
- Seasonal Challenges
- Community Challenges
- Random Events
- Daily Quests
- Weekly Quests
- Mystery Rewards

These systems should consume the Points Engine rather than replace it.

---

# Worked Examples

## Example 1

Water

Recorded

2500 ml

Statistics

2500 ml

Points

6

---

## Example 2

Water

Recorded

18 litres

Statistics

18 litres

Points

12

The participant continues improving statistics without earning unlimited points.

---

## Example 3

Reading

Recorded

95 minutes

Statistics

95 minutes

Points

12

Reflection

Required separately by the Challenge Rules.

---

## Example 4

Running

Recorded

12 km

Statistics

12 km

Points

30

Pace

Recorded for analytics only.

Pace does not currently influence points.

---

## Example 5

Upper Body

Exercises

40 Push-ups

30 Pull-ups

20 Bench Press

↓

Raw Repetitions

90

↓

Difficulty Multipliers Applied

↓

Effective Repetitions

104

↓

Workout Score

5 Points

Statistics continue recording:

- 40 Push-ups
- 30 Pull-ups
- 20 Bench Press

---

## Example 6

Balance Bonus

Completed Categories

✅ Water

✅ Fruit

✅ Reading

✅ Running

✅ Upper Body

Completed

5 Categories

↓

Balance Bonus

+8

---

## Example 7

Perfect Day

Completed Categories

All 10

↓

Balance Bonus

+30

↓

Maximum possible daily score depends on category totals and administrator bonuses.

---

# Future Revisions

As Champions Legacy evolves, this document may be updated.

Examples include:

- New categories
- New point tables
- Additional bonus systems
- Revised exercise tiers
- New cardio activities
- New achievement systems

Historical entries should remain valid wherever possible.

Changes should preserve backwards compatibility whenever practical.

---

# Version History

## Version 1.0

Initial scoring concept.

---

## Version 2.0

Major redesign.

Introduced:

- Dynamic point tables
- Effective Repetitions
- Difficulty multipliers
- Cardio difficulty
- Balance Bonus
- Manual bonus architecture
- Statistics vs Points separation
- Anti-abuse philosophy
- Configuration-driven architecture
- Future achievement support

---

# Closing Statement

The Champions Legacy Points System exists to reward discipline rather than perfection.

It recognises effort without encouraging obsession.

It celebrates consistency while leaving room for exceptional achievement.

Every calculation should reinforce the central philosophy of Champions Legacy:

> **Become better than yesterday.**

The strongest legacy is not built through a single extraordinary day.

It is built through thousands of disciplined choices made consistently over time.

---

# End of Document