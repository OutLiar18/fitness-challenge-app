# Champions Legacy

# Category Configurations

Version: 1.0

---

# Purpose

This document defines the configurable values used by the Champions Legacy Points System.

Unlike the Points System, which explains the philosophy and mechanics of scoring, this document contains the current balancing values used by the Scoring Engine.

These values may change over time as the platform evolves.

Changes to this document should not require architectural changes to the scoring engine.

---

# Relationship to Other Documentation

This document should be read alongside:

- POINTS_SYSTEM.md
- CONFIGURATION_SYSTEM.md
- LIBRARY_SYSTEM.md
- CHALLENGE_RULES.md

Responsibilities remain intentionally separated.

| Document | Responsibility |
|----------|----------------|
| Points System | Explains how scoring works. |
| Category Configurations | Defines current balancing values. |
| Configuration System | Explains how configuration is consumed. |
| Library System | Defines metadata libraries. |
| Challenge Rules | Defines permitted activities. |

---

# Configuration Philosophy

Every activity category should be configurable rather than hardcoded.

Categories should define:

- Identity
- Display information
- Scoring behaviour
- Validation rules
- XP rewards
- Statistics behaviour

The scoring engine interprets this configuration dynamically.

---

# Standard Category Structure

Every category should conceptually define:

| Property | Purpose |
|----------|---------|
| id | Unique identifier |
| displayName | Player-facing name |
| unit | Measurement unit |
| scoringModel | Quantity, Duration, Distance or Exercise |
| dailyGoal | Target for daily completion |
| pointProgression | Point calculation configuration |
| xpProgression | XP calculation configuration |
| validation | Accepted value limits |
| statistics | Statistics behaviour |
| supportsDifficulty | Whether difficulty applies |
| visibility | UI visibility |

Not every category requires every property.

---

# Quantity Categories

## Water

### General

| Property | Value |
|----------|-------|
| ID | water |
| Model | Quantity |
| Unit | ml |
| Daily Goal | 2000 ml |

### Validation

| Property | Value |
|----------|-------|
| Minimum | 0 ml |
| Maximum Entry | TBD |
| Negative Values | Not Allowed |

### Statistics

- Lifetime Water
- Monthly Water
- Daily Water

---

## Fruit

### General

| Property | Value |
|----------|-------|
| ID | fruit |
| Model | Quantity |
| Unit | Servings |
| Daily Goal | 3 |

### Statistics

- Lifetime Servings
- Favourite Fruit
- Daily Fruit

---

## Steps

### General

| Property | Value |
|----------|-------|
| ID | steps |
| Model | Quantity |
| Unit | Steps |
| Daily Goal | 10,000 |

### Statistics

- Lifetime Steps
- Monthly Steps
- Longest Walking Day

---

# Duration Categories

## Reading

### General

| Property | Value |
|----------|-------|
| ID | reading |
| Model | Duration |
| Unit | Minutes |
| Daily Goal | 30 |

---

## Skill Development

### General

| Property | Value |
|----------|-------|
| ID | skill |
| Model | Duration |
| Unit | Minutes |
| Daily Goal | 30 |

---

## Cardio

### General

| Property | Value |
|----------|-------|
| ID | cardio |
| Model | Duration |
| Unit | Minutes |
| Daily Goal | 30 |

Supports Difficulty:

✅ Yes

---

# Distance Categories

## Running

### General

| Property | Value |
|----------|-------|
| ID | running |
| Model | Distance |
| Unit | Kilometres |
| Daily Goal | 5 km |

Additional Statistics

- Pace
- Fastest Run
- Longest Run

---

# Exercise Categories

The following categories all use the Exercise Scoring Model.

- Upper Body
- Lower Body
- Core

---

## Upper Body

| Property | Value |
|----------|-------|
| Model | Exercise |
| Difficulty | Enabled |
| Static Conversion | Enabled |

---

## Lower Body

| Property | Value |
|----------|-------|
| Model | Exercise |
| Difficulty | Enabled |
| Static Conversion | Enabled |

---

## Core

| Property | Value |
|----------|-------|
| Model | Exercise |
| Difficulty | Enabled |
| Static Conversion | Enabled |

---

# Difficulty Multipliers

Exercise difficulty is intentionally conservative.

| Tier | Description | Multiplier |
|------|-------------|-----------:|
| 1 | Beginner / Standard | 1.00 |
| 2 | Intermediate | 1.10 |
| 3 | Advanced | 1.20 |
| 4 | Elite | 1.35 |

These values should only change after significant testing.

---

# Static Exercise Conversion

Static exercises define:

- Conversion Ratio
- Difficulty Tier

Examples

| Exercise | Seconds per Effective Rep |
|----------|--------------------------:|
| Plank | TBD |
| Front Lever | TBD |
| Planche | TBD |
| Wall Sit | TBD |

Conversion values should be reviewed periodically.

---

# XP Progression

Every category defines how XP is awarded.

XP progression may differ from Point progression.

This allows long-term progression to evolve independently from competitive balancing.

---

# Validation Rules

Every category should define:

- Minimum Value
- Maximum Value
- Accepted Units
- Decimal Support
- Manual Entry Rules

Validation should prevent impossible or unsafe values.

---

# Statistics Behaviour

Every category defines which statistics should update.

Examples include:

- Lifetime
- Monthly
- Weekly
- Daily
- Personal Records

Statistics continue increasing regardless of point balancing.

---

# Future Expansion

Future categories should only require configuration.

Potential additions include:

- Sleep
- Nutrition
- Meditation
- Cycling
- Swimming
- Stretching
- Journaling
- Budgeting

The scoring engine should not require modification.

---

# Guiding Principle

Configuration should define values.

The scoring engine should define behaviour.

Keeping these responsibilities separate allows Champions Legacy to evolve without becoming increasingly complex.

---

# End of Document