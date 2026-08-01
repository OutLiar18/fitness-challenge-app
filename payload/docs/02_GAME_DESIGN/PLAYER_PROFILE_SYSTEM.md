# Champions Legacy Challenge — Player Profile System

Last updated: 1 August 2026  
Current release: v0.9.0

## Purpose

The player profile makes identity and personal growth visible without turning identity into a public comparison tool.

## Implemented profile identity

`/profile` allows the signed-in player to view:

- display name;
- email;
- approved Legacy Avatar;
- role;
- team assignment;
- joined date;
- level and title;
- total points;
- total entries;
- longest streak.

Players may edit only their display name and approved avatar. Email, role, team, ownership and join date remain protected.

## Legacy Avatars

The app includes a curated local catalogue. Firestore stores only an approved `avatarId`, avoiding media-storage costs, arbitrary external URLs, privacy problems and image moderation.

Custom uploads remain deferred until storage, consent, moderation and cost rules are designed.

## Progress route

`/progress` displays:

- experience points and level progress;
- current and longest streak;
- shield status;
- completed daily and weekly goals;
- perfect days and weeks;
- achievements;
- personal records;
- chronological progression timeline;
- level titles.

## Trusted role presentation

Profiles may display Player, League Administrator or Platform Administrator. Role labels communicate responsibility but do not award points, experience or achievements.

Only a trusted administrative process may change roles.

## Data principles

- Profiles store identity and account facts.
- Progress remains derived from factual entries.
- Experience points and competitive points remain separate.
- Future public profiles require explicit privacy controls.
- Team and league identity must not expose private activity details by default.
