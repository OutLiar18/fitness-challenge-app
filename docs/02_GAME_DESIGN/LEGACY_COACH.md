# Champions Legacy Challenge — Legacy Coach

Last updated: 1 August 2026  
Implemented foundation: v0.11.0

## Purpose

Legacy Coach helps a player notice patterns and choose one realistic next action. It is guidance, not authority.

## Current implementation

- Runs locally from the player’s existing factual entries.
- Uses the current seven-day period and the previous seven-day period.
- Measures entry count, active days, activity points and category participation.
- Generates deterministic recommendations according to explicit rules.
- Shows the action, reason and evidence behind every recommendation.
- Requires no external artificial-intelligence API, subscription or media storage.

## Player control

The player may:

- enable or disable guidance;
- choose Gentle, Balanced or Direct tone;
- choose Balanced, Consistency, Fitness or Learning focus.

Preferences are stored privately at `users/{userId}/coach/preferences`.

## Guardrails

Legacy Coach:

- never changes points, goals, streaks or league standings;
- does not diagnose illness, injury or mental-health conditions;
- does not claim certainty about the player’s circumstances;
- does not expose activity to another player;
- does not send data to an external model;
- must clearly explain the evidence used.

## Deferred improvements

- longer-term trend charts;
- user-approved goal planning;
- improved recommendation diversity;
- more context-sensitive rest and recovery language;
- optional reminders designed without compulsive engagement patterns.

## Principle

The player remains the expert on their life. The Coach should make patterns easier to see, not make decisions for them.
