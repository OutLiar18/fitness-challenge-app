# Champions Legacy

# Points System

Version: 3.0

---

# Purpose

The Points System defines how Champions Legacy recognises meaningful effort.

Rather than simply assigning numbers to activities, the system provides a consistent, fair and extensible framework that rewards positive habits while supporting the broader goals of the platform.

The Points System exists to:

- Reward consistency over perfection.
- Encourage balanced self-improvement.
- Recognise increased challenge without discouraging beginners.
- Provide meaningful progression.
- Supply data to the wider Champions Legacy ecosystem.

The Points System is one component of the Champions Legacy Scoring Engine.

It works alongside the Statistics, Progression, Achievement and League systems to transform everyday actions into long-term growth.

---

# Relationship to Other Documentation

This document explains **how activities are evaluated**.

It should be read alongside:

- GAME_DESIGN_OVERVIEW.md
- CHALLENGE_RULES.md
- PROGRESSION_SYSTEM.md
- LEAGUE_SYSTEM.md
- ACHIEVEMENTS_AND_REWARDS.md
- CONFIGURATION_SYSTEM.md
- CATEGORY_CONFIGURATIONS.md

Responsibilities remain intentionally separated.

| Document | Responsibility |
|----------|----------------|
| Challenge Rules | Defines what activities are allowed. |
| Points System | Defines how activities are evaluated. |
| Progression System | Defines how earned XP contributes to player growth. |
| League System | Defines seasonal competition. |
| Category Configurations | Defines balancing values used by the scoring engine. |
| Configuration System | Defines how configuration is structured within the application. |

The Points System explains the philosophy and mechanics of scoring rather than individual balancing values.

---

# Design Philosophy

Champions Legacy is built upon a simple belief:

> **Consistency beats perfection.**

The Points System exists to encourage people to build sustainable habits rather than chase numbers.

A participant who improves consistently across many areas of life should remain competitive with someone who excels in only one discipline.

Difficulty should be recognised.

Consistency should remain the greatest contributor to long-term success.

The purpose of scoring is not to determine who is the strongest, fastest or smartest.

Its purpose is to motivate continuous self-improvement.

---

# Core Principles

The Points System is built around several non-negotiable principles.

## Consistency Over Talent

Natural ability should never outweigh disciplined effort.

The system rewards showing up repeatedly rather than occasional extraordinary performances.

---

## Reward Progress, Not Perfection

Missing a day should never make continued participation feel pointless.

The system should always encourage players to continue moving forward.

---

## Fair Over Perfect

Human effort cannot be measured perfectly.

Instead of attempting mathematical perfection, the Points System aims to provide a fair, transparent and motivating approximation of effort.

---

## Encourage Balance

Champions Legacy promotes improvement across multiple aspects of life.

The scoring system should naturally encourage balanced development without forcing every player into identical routines.

---

## Simplicity For Players

Recording progress should remain simple.

Players should not need to understand scoring formulas in order to participate.

The application performs the calculations automatically.

---

## Depth For Enthusiasts

Although everyday use should remain simple, curious players should be able to explore the deeper mechanics behind the scoring engine.

Concepts such as Effective Repetitions and Difficulty Multipliers should be available to those who wish to understand them without becoming barriers to participation.

---

## Built For Growth

The Points System should support future expansion without requiring major redesign.

New activities, categories and scoring methods should integrate naturally into the existing architecture.

---

# How the Engine Thinks

Every recorded activity follows the same conceptual process.

Rather than creating unique scoring logic for every category, the scoring engine applies a shared pipeline.

```
Recorded Activity
        │
        ▼
Validation
        │
        ▼
Category Configuration
        │
        ▼
Scoring Model
        │
        ▼
Category Adjustments
        │
        ▼
Points Awarded
        │
        ├──► Statistics
        ├──► XP
        ├──► Achievements
        ├──► Streaks
        ├──► League Progress
        └──► Team Progress
```

The user performs a single action.

The application updates every affected system automatically.

This shared pipeline keeps behaviour consistent across every category within Champions Legacy.

---

# Facts vs Calculations

One of the most important architectural principles within Champions Legacy is the separation of recorded facts from calculated values.

## Facts

Facts represent information directly recorded by the user.

Examples include:

- Water consumed
- Fruit servings
- Reading duration
- Running distance
- Exercise repetitions
- Exercise weight
- Hold duration
- Cardio duration
- Skill practice time

Facts are permanent.

Once recorded, they become part of the user's history.

---

## Calculations

Calculations are derived from recorded facts.

Examples include:

- Points
- XP
- Effective Repetitions
- Difficulty Adjustments
- Daily Totals
- Leaderboard Rankings
- Achievement Progress
- Streak Status

Calculated values should never become the primary source of truth.

Instead, they are produced whenever required by the application.

This separation keeps the platform flexible, maintainable and resilient to future balancing changes.

---

# Statistics, Points and XP

Although closely related, Statistics, Points and XP serve different purposes.

## Statistics

Statistics answer the question:

> **"What have I accomplished?"**

Statistics preserve everything a player has done.

Examples include:

- Total kilometres run
- Total books read
- Total water consumed
- Total repetitions completed
- Total workouts performed

Statistics never stop increasing.

---

## Points

Points answer the question:

> **"How valuable was today's effort?"**

Points provide immediate feedback and support:

- Daily motivation
- League competition
- Team contribution
- Leaderboards

Points exist to encourage healthy behaviour rather than measure personal worth.

---

## XP

XP answers the question:

> **"How much have I grown?"**

XP contributes toward long-term progression.

Unlike daily points, XP represents a player's continuing journey through Champions Legacy.

Progression, titles and levels are defined separately within the Progression System.

---

# Shared Philosophy

Every activity recorded within Champions Legacy should strengthen multiple systems simultaneously.

One workout should:

- Improve statistics.
- Award points.
- Grant XP.
- Advance achievements.
- Contribute to league standings.
- Update streaks.
- Record personal history.

The player performs one action.

Champions Legacy handles the rest.

---

# Guiding Principle

The purpose of the Points System is not to reward those who can do the most.

It is to encourage people to keep doing what matters.

Every point awarded should reinforce the philosophy that meaningful change is built through small actions performed consistently over time.

---

# Scoring Models

Rather than creating unique scoring logic for every activity, Champions Legacy groups activities into a small number of reusable scoring models.

Each category declares which scoring model it uses.

The Points System applies the appropriate calculations automatically.

This approach keeps the scoring engine simple, scalable and easy to maintain.

---

# Why Scoring Models Exist

Many activities share common characteristics.

For example:

- Water and Fruit both measure quantities.
- Reading and Skill Development both measure time.
- Running and future endurance activities measure distance.
- Strength training measures effort through repetitions.

Rather than creating custom logic for every category, similar activities share the same underlying model.

This allows future categories to be introduced with minimal development effort.

---

# Quantity Model

The Quantity Model rewards activities measured by accumulating units.

Examples include:

- Water
- Fruit
- Steps
- Future nutrition categories

Quantity-based activities typically define:

- Measurement unit
- Daily goal
- Point progression
- Maximum daily contribution (if applicable)

The scoring engine interprets these values through the category configuration.

The Points System itself contains no category-specific values.

---

# Duration Model

The Duration Model rewards activities based on time spent performing a meaningful task.

Examples include:

- Reading
- Skill Development
- Meditation
- Language Learning
- Future educational activities

Longer participation generally results in greater rewards.

However, scoring curves should encourage sustainable habits rather than excessive daily volume.

---

# Distance Model

The Distance Model rewards activities measured by distance travelled.

Examples include:

- Running
- Cycling
- Swimming
- Rowing
- Hiking

Distance remains the primary contributor to scoring.

Future category-specific adjustments may recognise additional factors where appropriate.

The model remains flexible enough to support future endurance activities without requiring architectural changes.

---

# Exercise Model

The Exercise Model differs from every other scoring model.

Rather than measuring distance, duration or quantity, it estimates physical workload.

This model introduces concepts such as:

- Raw Repetitions
- Effective Repetitions
- Difficulty Multipliers
- Static Exercise Conversion

These concepts allow the system to recognise more challenging exercises while maintaining fairness across all experience levels.

The Exercise Model is described in detail later within this document.

---

# Hybrid Model

Some future activities may combine multiple measurement methods.

Examples might include:

- Obstacle races
- Adventure events
- Multi-stage competitions
- Community challenges

Hybrid models combine multiple scoring models while preserving the same core philosophy.

The scoring engine should remain flexible enough to support these combinations without introducing entirely new architectural patterns.

---

# Model Selection

Every category defines its scoring model through configuration.

Examples include:

| Category | Scoring Model |
|----------|---------------|
| Water | Quantity |
| Fruit | Quantity |
| Reading | Duration |
| Skill Development | Duration |
| Running | Distance |
| Upper Body | Exercise |
| Lower Body | Exercise |
| Core | Exercise |

Future categories simply select the most appropriate model.

The scoring engine automatically applies the correct calculations.

---

# Category Configuration

Each category provides configuration describing how it should be evaluated.

Typical configuration may include:

- Identifier
- Display Name
- Measurement Unit
- Scoring Model
- Daily Goal
- Point Progression
- XP Progression
- Difficulty Support
- Statistics Behaviour
- Visibility Rules

The exact configuration structure is defined separately within:

**CATEGORY_CONFIGURATIONS.md**

This separation allows balancing changes without modifying the core Points System.

---

# Category Independence

Every category should remain independent.

Adding, removing or rebalancing one category should not require changes to unrelated categories.

This makes the scoring engine:

- Easier to maintain
- Easier to balance
- Easier to expand
- Easier to test

As Champions Legacy grows, categories should evolve through configuration rather than new business logic.

---

# Consistent Evaluation

Although different categories use different scoring models, every category follows the same guiding principles.

Every category should:

- Reward meaningful effort.
- Encourage consistency.
- Support long-term habit formation.
- Integrate naturally with progression.
- Produce explainable results.
- Remain fair across different skill levels.

Consistency in philosophy is more important than consistency in mathematical formulas.

---

# Looking Ahead

Most categories can be evaluated using one of the scoring models described above.

Exercise-based categories require additional mechanics in order to estimate workload fairly.

The following section introduces the concepts of:

- Raw Repetitions
- Effective Repetitions
- Difficulty Multipliers
- Static Exercise Conversion

Together, these form the Exercise Scoring Engine.

---

# Exercise Scoring Engine

Exercise-based activities differ fundamentally from every other scoring model.

While Quantity, Duration and Distance models measure objective values directly, exercise-based activities attempt to estimate physical workload.

The Exercise Scoring Engine exists to reward increased difficulty without allowing advanced athletes to dominate purely through exercise selection.

Its purpose is not to perfectly measure effort.

Its purpose is to estimate effort fairly and consistently.

---

# Design Philosophy

Exercise scoring should reward:

- Consistency
- Total work performed
- Progressive overload
- Exercise difficulty
- Skill progression

However, increased difficulty should never outweigh regular participation.

A beginner performing push-ups consistently should remain competitive with an advanced athlete performing elite movements.

Difficulty should reward courage.

Consistency should reward commitment.

---

# Raw Repetitions

Raw Repetitions represent exactly what the player performed.

Examples include:

- 25 Push-ups
- 12 Pull-ups
- 40 Squats
- 15 Bench Press Repetitions

Raw Repetitions are factual data.

They should always be preserved exactly as recorded.

Statistics, journals and personal records always use Raw Repetitions.

---

# Effective Repetitions

Effective Repetitions represent estimated workload after considering exercise difficulty.

They are calculated dynamically during scoring.

They are never permanently stored.

Conceptually:

```
Raw Repetitions
        │
        ▼
Difficulty Adjustment
        │
        ▼
Effective Repetitions
```

Effective Repetitions exist only during score calculation.

Once scoring has completed, they are discarded.

---

# Why Effective Repetitions Exist

Without Effective Repetitions, two exercises with vastly different difficulty would receive identical scores.

For example:

- 20 Push-ups
- 20 One-Arm Push-ups

Although both contain twenty repetitions, the physical demands are significantly different.

Effective Repetitions acknowledge this increased challenge while keeping the adjustment intentionally modest.

They provide recognition rather than domination.

---

# Difficulty Multipliers

Every exercise belongs to a predefined difficulty tier.

Each tier applies a multiplier during Effective Repetition calculation.

Difficulty should influence scoring.

It should never determine victory on its own.

Difficulty multipliers should remain conservative so that consistency remains the strongest contributor to long-term success.

Exact multiplier values are maintained within the category configuration rather than this document.

---

# Difficulty Philosophy

Difficulty is inherently subjective.

Different people experience the same exercise differently.

For this reason, Champions Legacy does not attempt to perfectly measure human effort.

Instead, the scoring engine provides a fair approximation that recognises increased challenge without pretending to calculate exact physiological workload.

The goal is motivation.

Not scientific precision.

---

# Static Exercise Conversion

Static exercises cannot be measured using repetitions.

Instead, they are converted into Effective Repetitions through predefined conversion rules.

Examples include:

- Planks
- L-Sits
- Front Lever Holds
- Planche Holds
- Wall Sits

Each static exercise defines:

- Difficulty Tier
- Conversion Ratio

For example:

```
30 Seconds
        │
        ▼
Conversion Ratio
        │
        ▼
Effective Repetitions
```

The scoring engine treats converted repetitions exactly the same as dynamic repetitions.

This allows static and dynamic exercises to contribute toward a single workload estimate.

---

# Mixed Exercise Sessions

Many workouts combine multiple movement types.

For example:

- Push-ups
- Pull-ups
- Plank
- Handstand Hold

Rather than scoring each exercise independently, the Exercise Scoring Engine combines all calculated Effective Repetitions into a single workload for that category.

This encourages varied training while keeping calculations consistent.

---

# Weighted Exercises

Additional resistance may be recorded for statistics and personal progress.

Examples include:

- Weighted Pull-ups
- Bench Press
- Squats
- Deadlifts

Weight contributes valuable analytical information such as:

- Personal Records
- Strength Progress
- Historical Trends

Weight does not currently influence point calculations.

Separating strength tracking from scoring keeps competition fair across participants with different training backgrounds and available equipment.

Future versions may introduce strength-based achievements without affecting the core scoring engine.

---

# Exercise Metadata

Every exercise should define metadata rather than scoring rules.

Typical metadata includes:

- Name
- Category
- Movement Type
- Difficulty Tier
- Dynamic or Static
- Conversion Ratio (if applicable)

Exercises should never define point values.

Their responsibility is to describe themselves.

The scoring engine determines how that information is interpreted.

---

# Exercise Library

The Exercise Library serves as the single source of truth for exercise definitions.

It allows the scoring engine, statistics system, achievements and future features to share consistent exercise information.

Adding a new exercise should normally require only:

- Creating the exercise definition.
- Assigning its metadata.
- Selecting the appropriate difficulty tier.

The scoring engine should require little or no modification.

---

# Future Expansion

The Exercise Scoring Engine has been designed to support future growth.

Potential additions include:

- Assisted movements
- Resistance band exercises
- Gym machines
- Olympic lifting
- Gymnastics skills
- Mobility exercises
- Rehabilitation exercises
- Adaptive fitness movements

These additions should integrate through metadata and configuration rather than new scoring algorithms.

---

# Guiding Principle

The Exercise Scoring Engine does not attempt to answer:

> "Which athlete worked the hardest?"

Instead, it asks:

> "Did this activity represent meaningful effort worthy of recognition?"

If the answer is yes, the engine should reward it fairly, consistently and transparently.

---

# Configuration and Architecture

The Points System has been designed around configuration rather than hardcoded behaviour.

The scoring engine should understand **how to evaluate activities**, while category configuration defines **what values are used**.

This separation allows Champions Legacy to grow without continually modifying the underlying scoring engine.

---

# Configuration Over Code

One of the guiding principles of Champions Legacy is that balancing should not require rewriting business logic.

Whenever practical, changes should be made through configuration rather than source code.

Examples include:

- Daily goals
- Scoring values
- XP rewards
- Difficulty tiers
- Exercise metadata
- Category visibility
- Validation limits

This allows the application to evolve while keeping the core engine stable.

---

# Category Configuration

Every activity category should define a standard configuration.

Typical properties include:

- Identifier
- Display Name
- Description
- Measurement Unit
- Scoring Model
- Daily Goal
- Point Progression
- XP Progression
- Difficulty Support
- Statistics Behaviour
- Visibility Rules

The exact configuration format is defined separately within:

**CATEGORY_CONFIGURATIONS.md**

The Points System consumes this configuration rather than defining it.

---

# Metadata Libraries

The scoring engine relies on multiple metadata libraries.

These libraries provide information about activities without containing scoring logic.

Examples include:

- Exercise Library
- Cardio Library
- Skill Library
- Achievement Library
- Category Library

Each library acts as the single source of truth for its respective domain.

---

# Library Responsibilities

Libraries describe activities.

They do not determine rewards.

For example, an Exercise Library may define:

- Exercise Name
- Category
- Movement Type
- Difficulty Tier
- Static or Dynamic
- Conversion Ratio

The scoring engine determines how this information contributes to scoring.

Keeping metadata separate from calculations improves consistency throughout the application.

---

# Shared Scoring Engine

Every activity recorded within Champions Legacy should pass through the same scoring engine.

Rather than creating separate systems for each category, all activities follow the same processing pipeline.

```
Recorded Activity
        │
        ▼
Validation
        │
        ▼
Category Configuration
        │
        ▼
Scoring Model
        │
        ▼
Scoring Adjustments
        │
        ▼
Points Awarded
        │
        ├──► Statistics
        ├──► XP
        ├──► Achievements
        ├──► Streaks
        ├──► League Progress
        └──► Team Progress
```

A single activity should automatically update every connected system.

---

# Hidden Complexity

Champions Legacy embraces the principle of progressive complexity.

For most players, recording progress should remain simple.

Users should not need to understand:

- Effective Repetitions
- Difficulty Multipliers
- Conversion Ratios
- Scoring Models

They simply record their activities.

The application performs the calculations automatically.

More experienced or curious users may choose to explore the underlying mechanics.

The system should reward curiosity without requiring it.

---

# Transparency

Although internal calculations may become increasingly sophisticated, the results should always remain explainable.

Players should always be able to understand:

- Why points were awarded.
- Why an activity earned more or fewer points.
- How a daily score was calculated.
- Why a milestone or achievement was unlocked.

Transparency builds trust.

Complexity should exist within the engine, not within the user experience.

---

# Anti-Abuse Philosophy

Rather than attempting to detect every possible exploit, Champions Legacy is designed to minimise the incentive to abuse the system.

The healthiest behaviour should naturally become the most rewarding behaviour.

The scoring engine should discourage:

- Artificial point farming.
- Duplicate submissions.
- Impossible activity values.
- Automated submissions.
- Exploiting software defects.

Whenever possible, abuse should be prevented through thoughtful system design rather than manual intervention.

---

# Fair Competition

Competition should inspire improvement rather than unhealthy behaviour.

Players should never feel encouraged to:

- Overtrain.
- Ignore recovery.
- Consume unhealthy amounts of food or water.
- Perform unsafe exercise volumes.
- Prioritise points over wellbeing.

The scoring system should consistently reinforce sustainable habits.

---

# Developer Responsibilities

The architectural boundaries of the Points System should remain clearly defined.

## Points Service

Responsible for:

- Interpreting category configuration.
- Applying scoring models.
- Calculating points.
- Calculating XP.
- Returning scoring results.

The Points Service should remain the only component responsible for scoring calculations.

---

## Statistics Service

Responsible for:

- Lifetime statistics.
- Personal records.
- Historical summaries.
- Analytical reporting.

Statistics should consume factual data rather than calculated scores wherever practical.

---

## Progression Service

Responsible for:

- Player levels.
- XP accumulation.
- Prestige.
- Titles.

Progression consumes scoring results but does not calculate them.

---

## Achievement Service

Responsible for:

- Tracking achievement criteria.
- Unlocking achievements.
- Awarding cosmetic recognition.

Achievements consume scoring events rather than modifying them.

---

## User Interface

User interface components should never calculate points.

Their responsibilities are limited to:

- Recording activities.
- Displaying results.
- Explaining outcomes.

Business logic belongs within the application's service layer.

---

# Future-Proof Architecture

The scoring engine should continue supporting future additions such as:

- New activity categories.
- Seasonal modifiers.
- Community events.
- AI coaching.
- Adaptive challenges.
- Accessibility features.
- New progression systems.

Future features should integrate with the existing architecture rather than replacing it.

The engine should remain stable while the platform continues to evolve.

---

# Guiding Principle

Good architecture allows the application to grow without becoming more complicated.

Every new category, activity or feature should feel like another piece added to the same machine—not an entirely new machine.

---

# Future Expansion

The Points System has been designed to support future growth without requiring fundamental architectural changes.

Potential future additions include:

- New activity categories
- Seasonal scoring modifiers
- Community events
- Limited-time challenges
- AI-assisted coaching
- Adaptive difficulty
- Accessibility scoring options
- Organisation-specific scoring profiles
- Wellness programs
- Educational pathways

Future additions should consume the existing scoring engine rather than replace it.

The engine should remain stable while the platform continues to evolve.

---

# Worked Examples

The following examples demonstrate how the scoring engine behaves conceptually.

Exact balancing values are defined separately within:

**CATEGORY_CONFIGURATIONS.md**

---

## Example 1 — Quantity Model

A player records water consumption.

```
Water Recorded
        │
        ▼
Validation
        │
        ▼
Quantity Model
        │
        ▼
Points
        │
        ├──► Statistics
        ├──► XP
        └──► League Progress
```

The recorded water contributes to multiple systems simultaneously.

---

## Example 2 — Duration Model

A player completes a reading session.

```
Reading Session
        │
        ▼
Duration Model
        │
        ▼
Points Awarded
        │
        ├──► Reading Statistics
        ├──► XP
        ├──► Achievements
        └──► Daily Progress
```

Reading contributes to long-term development beyond the immediate point reward.

---

## Example 3 — Distance Model

A player completes a run.

```
Distance Recorded
        │
        ▼
Distance Model
        │
        ▼
Points
        │
        ├──► Running Statistics
        ├──► Personal Records
        ├──► League Progress
        └──► XP
```

The scoring engine rewards meaningful effort while preserving detailed historical statistics.

---

## Example 4 — Exercise Model

A player performs an Upper Body workout.

```
Workout Recorded
        │
        ▼
Raw Repetitions
        │
        ▼
Difficulty Adjustment
        │
        ▼
Effective Repetitions
        │
        ▼
Exercise Model
        │
        ▼
Points
```

Statistics continue storing the original repetitions exactly as recorded.

Effective Repetitions exist only during score calculation.

---

## Example 5 — Static Exercise

A player performs a Front Lever Hold.

```
Hold Duration
        │
        ▼
Static Conversion
        │
        ▼
Effective Repetitions
        │
        ▼
Exercise Model
        │
        ▼
Points
```

Static and dynamic exercises integrate into the same scoring engine through conversion rather than separate algorithms.

---

## Example 6 — One Activity, Many Systems

A player completes a workout.

The player performs one action.

Champions Legacy automatically updates:

- Statistics
- Points
- XP
- Achievements
- Streaks
- League Progress
- Team Progress
- Personal History

The application performs the bookkeeping.

The player simply focuses on becoming better than yesterday.

---

# Relationship to Other Systems

The Points System supports every major progression mechanic within Champions Legacy.

It provides scoring data to:

- Progression System
- League System
- Achievement System
- Statistics System
- Player Profile System
- Journal System
- Dashboard
- Analytics
- Future AI Coach

The Points System should remain independent while supplying information to each of these systems.

---

# Guiding Principles

Before introducing a new scoring feature, ask:

- Does it encourage consistency?
- Does it reward meaningful effort?
- Does it promote balanced self-improvement?
- Does it remain fair across different ability levels?
- Does it discourage unhealthy behaviour?
- Does it remain understandable to players?
- Can it be implemented through configuration rather than new business logic?

If the answer to any question is no, the feature should be reconsidered.

---

# Closing Statement

The purpose of the Champions Legacy Points System is not to determine who is the strongest, fastest or smartest.

It exists to recognise meaningful effort, reward consistency and encourage lifelong self-improvement.

Every activity recorded should contribute to something greater than a daily score.

It should become another step in a player's journey.

Another memory.

Another achievement.

Another chapter in their legacy.

Every calculation should help answer one question:

> **"Did I become better than yesterday?"**

Because numbers fade.

Habits endure.

And habits become legacy.

---

# End of Document