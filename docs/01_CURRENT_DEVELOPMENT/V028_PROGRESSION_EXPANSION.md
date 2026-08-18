# Champions Legacy Challenge - v0.28 Progression Expansion

Status: implemented by Checkpoint 28D2; owner visual/responsive review pending.

## Purpose

Checkpoint 28D2 turns the Progress page into a long-term personal progression system
without changing competitive points.

The design keeps three concepts separate:

1. competitive points decide Challenge/season standings;
2. Experience Points represent personal progression;
3. achievements are factual milestones that award Experience Points only.

## Achievement catalogue

The catalogue contains 86 deterministic achievements.

Every achievement has:
- a stable ID;
- a family;
- a visible requirement when it is not hidden;
- an explicit difficulty tier;
- a configured XP reward;
- a reproducible metric;
- progress toward the next visible milestone;
- a derived earned date when unlocked.

Difficulty tiers:
- Starter: 25 XP
- Bronze: 50 XP
- Silver: 125 XP
- Gold: 300 XP
- Epic: 750 XP
- Legendary: 2,000 XP

Exceptional accomplishments may override the normal tier reward while retaining the
tier. Marathon distance awards 1,500 XP, 50 km ultra distance awards 3,000 XP and the
hidden 100 km running achievement awards 7,000 XP.

The complete catalogue contains 53,675 XP of possible achievement rewards. Achievement
XP never changes competitive points.

## Milestone families

General progression:
- first activity;
- first daily goal;
- perfect day;
- perfect week;
- streaks from 3 through 365 days;
- level milestones from 5 through 100.

Water:
- 2 L
- 25 L
- 100 L
- 500 L
- 2,000 L
- hidden 5,000 L

Fruit:
- 3
- 50
- 250
- 1,000
- 3,000
- hidden 7,500 servings

Reading time:
- 1 hour
- 10 hours
- 50 hours
- 250 hours
- 1,000 hours
- hidden 2,500 hours

Completed books:
- 1
- 10
- 50
- 100

Running uses single-run distance:
- 1 km
- 3 km
- 5 km
- 10 km
- 15 km
- 20 km
- half marathon (21.1 km)
- marathon (42.2 km)
- 50 km ultra
- hidden 100 km ultra

Upper Body, Lower Body and Core each use cumulative Effective Repetitions:
- 50
- 500
- 2,500
- 10,000
- 50,000
- hidden 150,000

Cardio:
- 15 minutes
- 5 hours
- 25 hours
- 100 hours
- 500 hours
- hidden 1,500 hours

Skill Development:
- 15 minutes
- 5 hours
- 25 hours
- 100 hours
- 500 hours
- hidden 1,500 hours

Steps:
- 10,000
- 100,000
- 500,000
- 2,000,000
- 10,000,000
- hidden 30,000,000

Running minutes continue to contribute to Cardio achievement totals in the same way
Running already contributes to Cardio statistics.

## Hidden achievements

Locked hidden achievements do not expose their name or requirement in the next-challenge
list. The Progress page only tells the player how many hidden achievements remain.

When a hidden achievement is earned, it becomes visible in the completed collection.

No error-message tracking, invasive analytics or novelty telemetry was added for hidden
achievements.

## Achievement presentation

The page shows only the next visible locked milestone from each achievement family.

Order:
1. in-progress next milestones;
2. available next milestones with no progress yet;
3. hidden-achievement count;
4. completed achievements in a collapsed details section.

This prevents dozens of completed or far-future achievements from dominating the page.

## Level curve

Maximum level: 100.

XP required to advance from the current level:

`150 + 70 * (level - 1)`

Level 100 begins at exactly 354,420 lifetime XP.

The curve is intentionally designed around the existing participation, goal, weekly and
streak XP rates plus the achievement catalogue so the highest level represents roughly a
decade-scale consistency target rather than one spectacular activity.

XP may continue accumulating after Level 100, but the displayed level remains capped.

## Level title bands

- Level 1 - Initiate
- Level 5 - Momentum Seeker
- Level 10 - Disciplined Challenger
- Level 15 - Iron Habit
- Level 20 - Proven Competitor
- Level 25 - Relentless Builder
- Level 30 - Vanguard
- Level 35 - Standard Bearer
- Level 40 - Battle Tested
- Level 45 - Legacy Forger
- Level 50 - Champion
- Level 55 - Elite Champion
- Level 60 - Master of Momentum
- Level 65 - Unbroken
- Level 70 - Paragon
- Level 75 - Grandmaster
- Level 80 - Titan of Discipline
- Level 85 - Mythic Competitor
- Level 90 - Legacy Warden
- Level 95 - Immortal Standard
- Level 100 - Living Legend

## Progress UI cleanup

Desktop Progress workspace tabs use a deliberate five-column layout when space allows,
then transition to three and two columns before the existing mobile select control takes
over.

Tab descriptions may wrap instead of colliding with badges.

Achievement cards show:
- title;
- difficulty;
- requirement;
- completion percentage;
- progress bar;
- XP reward.

The Overview XP breakdown now includes Achievement Experience.

The Level Journey shows the lifetime XP threshold for each title band.

## Safety boundary

28D2:
- does not alter competitive point scoring;
- does not alter season/House mechanics;
- does not alter evidence authority;
- does not alter Firestore Rules;
- does not deploy Firebase;
- keeps v0.27.0 production frozen.
