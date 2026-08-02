# Champions Legacy Challenge — Challenge Rules

Version: 4.0  
Current app rulebook: `2026-08-v1`

## Authoritative sources

The runtime source of truth is:

- `src/constants/rulebook.js` — versioned rule content and status.
- `src/constants/goals.js` — current daily and weekly goals.
- `/rules` — player-facing searchable presentation.

This document explains governance and source mapping. It must not duplicate every runtime rule table manually.

## 2025 source preservation

The 2025 Rule Book remains the historical source. Current rules retain its wording where that wording remains accurate. Each adapted runtime rule records a `legacyRule` reference so players can see its origin.

A change is permitted when:

- the app replaces a manual process;
- the old mechanic is not implemented;
- the wording conflicts with current scoring, safety, fairness or inclusivity;
- the rule contains a contradiction or factual defect;
- a necessary platform integrity or privacy rule did not exist in 2025.

## Rule statuses

### Current rule

Applies throughout the present platform experience.

### Season option

Applies only when an official league or announcement activates it before the relevant period.

### Not currently active

Retained for transparency but not enforced and awards no points.

## Major adaptations from 2025

- Weeks use Monday through Sunday rather than Tuesday through Monday.
- Direct app entries replace WhatsApp posting and manual administrator logging.
- Today and yesterday form the editable entry window.
- Core replaces the term Mid Body.
- Running still requires at least 3 kilometres and a pace of 11:00 per kilometre or faster for Running points.
- Running duration contributes to Cardio automatically.
- Workout scoring uses configured Effective Repetitions rather than one universal hold conversion.
- Teams are persistent and invitation based rather than randomly assigned Houses.
- Completed league history is immutable.
- Culinary fruit classification excludes avocado and resolves the contradiction in the 2025 list.
- Clear safety, privacy, account-security, respectful-conduct and bug-exploitation rules were added.

## Inactive legacy mechanics

The current app does not support:

- Pocket Week or banked activities;
- random six-House assignment;
- Power Play voting and multipliers;
- Diamonds, price tags or Transfer Market;
- Buddy Bonuses;
- photo-evidence bonuses;
- Five Fires side-quest points;
- WhatsApp-based proof and administration.

These features must not be described as active until they have a complete product design, data model, Security Rules, administration workflow and tests.

## Current goals

Goals are rendered directly from `GOAL_CONFIGURATIONS`; do not maintain a second hardcoded player table here. Running intentionally has no daily goal. Weeks use the player’s local Monday-to-Sunday calendar.

## Rule change governance

- Change `RULEBOOK_VERSION` when rule meaning changes.
- Add or update stable rule identifiers rather than relying on display order.
- Announce material changes before they affect an active season.
- Never rewrite the frozen scoring or rule history of a completed league.
- Add regression tests for status separation, identifiers, search and any derived goal content.
