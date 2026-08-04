# Champions Legacy Challenge — Season League System

Last updated: 4 August 2026

## Purpose

A season provides a fresh, time-bounded competition with individual and House recognition while permanent personal progress continues separately.

## Lifecycle

`Draft → Registration → Active → Completed → Archived`

Each transition is forward-only and audited. A season freezes its dates, theme, Houses, scoring rules, Pocket window, evidence policy and publication settings before competition begins.

## Frozen rules

New v2 seasons use:

- `points-v2` for factual activity calculation;
- `season-houses-v2` for competition and evidence integration;
- `whatsapp-proof-v1` for external evidence;
- one pre-season seven-day Pocket Week;
- the season's configured Fruit cap, evidence thresholds, deadlines and publication time.

Existing v1 seasons retain their historical behaviour.

## Contributions and House history

Every contribution stores the player, category, challenge date, rules version and House identity at earning time. Roster movement affects future contributions only. Evidence review after a move still releases points to the original House.

## Evidence-aware scoring

- Qualifying Running holds Running points for proof but releases Cardio immediately.
- Steps holds all Steps points for proof.
- Water and Fruit normal points remain immediate; accepted daily proof can add one configured evidence bonus.
- Evidence releases and reversals are separate immutable contribution records.

## Standings views

### Live administrator standings

Authorised administrators and evidence operators may inspect the latest contribution stream for operations and review.

### Published player standings

Players read the latest immutable `leagueLeaderboardSnapshots` record rather than live contributions. A corrected publication creates a new revision. The previous snapshot persists when no new one is published.

## Publication modes

- manual administrator publication;
- corrected replacement revision;
- administrator-session fallback at or after the configured time, currently 10:00 Africa/Johannesburg.

The fallback is not a background scheduler and requires an authorised administrator session.

## Season honours

Season honours are derived from the authoritative contribution stream and may be copied into a published snapshot. Completed season results remain immutable.

## Trust boundary

Client-side calculation supports the current private challenge iteration. Prize-bearing or public competition should eventually add trusted server-side recalculation, reliable scheduling and reconciliation without rewriting historical contribution records.
