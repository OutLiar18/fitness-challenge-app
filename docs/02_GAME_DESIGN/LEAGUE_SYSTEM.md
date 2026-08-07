# Champions Legacy Challenge — Season League System

Last updated: 5 August 2026

## Purpose

A season provides a fresh, time-bounded competition with individual and House recognition while permanent personal progress continues separately.

## Lifecycle

`Draft → Registration → Active → Completed → Archived`

Each transition is forward-only and audited. A season freezes its dates, theme, Houses, scoring rules, Pocket window, evidence policy, Power Play policy and publication settings before competition begins.

## Frozen rulesets

- v1 seasons retain the original season/Houses behaviour.
- v2 seasons use `points-v2`, `season-houses-v2` and `whatsapp-proof-v1`.
- New v3 seasons use `points-v3`, `season-houses-v3`, `whatsapp-proof-v1` and `power-play-v1`.
- Existing seasons never silently upgrade.

## Contributions and House history

Every contribution stores the player, category, challenge date, rules version and House identity at earning time. Roster movement affects future contributions only. Evidence review after a move still releases points to the original House.

## Evidence-aware scoring

- Qualifying Running holds Running points for proof but releases Cardio immediately.
- Steps holds all Steps points for proof.
- Water and Fruit normal points remain immediate; accepted daily proof can add one configured evidence bonus.
- Evidence releases and reversals are separate immutable contribution records.

## Power Play-aware scoring

v3 seasons resolve the official Power Play from each contribution's challenge date and score category. The adjusted activity point value drives both individual and historical House totals. Evidence bonuses and progression rewards are not multiplied. Weekly assignment history and no-repeat state are part of trusted reconciliation.

## Standings views

Authorised administrators may inspect live contribution-derived standings. Players read the latest immutable `leagueLeaderboardSnapshots` record. A corrected publication creates a later revision; previous snapshots remain preserved.

## Publication modes

- manual administrator publication;
- corrected replacement revision;
- administrator-session fallback at or after 10:00 Africa/Johannesburg.

The fallback is not a background scheduler and requires an authorised administrator session.

## Season honours

Season honours derive from the authoritative contribution stream after evidence, corrections and Power Play adjustment. Completed results remain immutable except through explicit audited correction records.

## Season Command Centre

The role-aware Command Centre derives next actions across Houses, C.H.A.O.S., leadership, evidence, Power Plays, trusted reconciliation and publication. It stores no alternate score.
