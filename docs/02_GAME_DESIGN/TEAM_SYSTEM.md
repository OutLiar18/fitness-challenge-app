# Champions Legacy Challenge — Team System

Last updated: 1 August 2026  
Implemented release: v0.11.0

## Purpose

Teams create identity, friendship and accountability without changing the player’s personal scoring rules.

## Implemented model

- A player belongs to no more than one team at a time.
- A team has one captain, a name, description, motto, local emblem and invitation code.
- Team emblems are bundled with the application; no media upload or storage bill is required.
- The 25-player member limit is transactionally enforced so simultaneous joins cannot exceed it.
- A roster shows each member’s current-week factual activity points, active days, entries and current streak.
- Team progress reuses the existing activity Points Engine. There is no second team scoring formula.

## Captain responsibilities

A captain may:

- share the team invitation code;
- edit the description, motto and emblem;
- transfer captaincy atomically to another member.

A captain may not leave until captaincy has been transferred. Team deletion and disbanding are deferred until a historical archive model exists.

## Member rights

A member may:

- view the team and roster;
- contribute automatically through ordinary factual activity entries;
- leave the team without losing personal history.

A member may not promote themselves or alter another member’s role.

## Fairness boundary

Weekly roster summaries are motivational accountability data. They are owner-derived client snapshots and must not be used for prizes or high-stakes competition. Seasonal league standings use separate immutable contribution snapshots.

## Principle

A strong team helps each member show up. It never replaces individual honesty or personal growth.
