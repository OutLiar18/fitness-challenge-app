# Champions Legacy — Player Profile System

Last updated: 1 August 2026
Current release: v0.7.0

## Purpose

The player profile makes personal growth visible without turning identity into a public comparison tool.

## Implemented

### Profile route

`/profile` displays:

- display name;
- email;
- role;
- team placeholder;
- joined date;
- level and title;
- total points;
- entry count;
- longest streak.

Profile editing is intentionally deferred until secure validation and update rules are designed.

### Progress route

`/progress` displays:

- XP and level progress;
- current and longest streak;
- shield status;
- completed daily and weekly goals;
- perfect days and weeks;
- achievements;
- personal records;
- chronological progression timeline;
- level titles.

### Dashboard summary

The Dashboard shows a compact progression card and links to the full Progress route.

## Data principles

- Profiles store identity/account facts.
- Progress is derived from factual entries.
- XP and Points remain separate.
- Future public profiles require privacy controls.
- Team and league identity must not expose private activity details by default.
