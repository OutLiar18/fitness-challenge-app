# Champions Legacy Challenge â€” v0.28.0 Seasons Workspace Cleanup

Checkpoint: 28D3A
Status: Implemented / owner review pending

## Purpose

28D3A is the deeper owner-review pass for Seasons after the first 28D3 visual pass.
The owner created a season and found that Browse plus the created-season workspaces
were still too dense. This checkpoint restructures presentation without changing
competition rules, lifecycle authority, scoring, evidence authority or Firestore Rules.

## Player flow

The Seasons route now follows one clear path:

1. Browse / Join / Create
2. Choose a season
3. Enter a focused season view
4. Use that season's Overview / Command Centre / Power Plays / Standings / Honours / Evidence workspaces
5. Return with Back to seasons

Browse no longer auto-opens the first membership or season below the browser.

## Browse

- seasons are grouped into Live now, Upcoming and Completed seasons;
- season cards remain concise and keep theme, dates, phase and membership;
- choosing a season replaces the browser with a focused detail workspace;
- the top-level Browse / Join / Create switcher is hidden while a season is open.

## Overview

The always-visible CompetitionWorkspaceSummary is removed from Seasons.
Role-aware metrics move into a single Season at a glance section inside Overview.
House and Pocket shortcuts live there instead of before every detail tab.

## Command Centre

The command centre remains the administrator's attention screen:

- health, metrics and required actions stay immediately visible;
- Bonus Points moves into a labelled disclosure;
- trusted reconciliation, evidence/leadership summaries, decision history, snapshot history and report notes move into an Integrity tools and history disclosure;
- no authority or trusted-operation behaviour changes.

## Power Plays

Draft setup no longer renders every full editor at once.

- the pool is shown as a compact list;
- one Power Play can be expanded for editing at a time;
- new custom plays open directly in the editor;
- the weekly schedule remains visible;
- players who cannot manage the season continue seeing the current play and schedule only.

## Standings

Individual and House standings use one in-tab switch rather than two full tables stacked
one after the other. The current player and current House receive a restrained highlight,
and podium rows receive a visual class without changing ranking logic.

## Honours

Individual and House honours are visually separated.
Final seasons receive a stronger final-state treatment.
The prestige-order explanation moves behind an informational disclosure.

## Evidence

Evidence remains the working screen:

- publication controls receive visual priority, including a due state;
- queue/review remains the primary two-column working area;
- the WhatsApp/media boundary moves into a compact How evidence review works disclosure;
- Command Centre only summarises deeper evidence/history information.

## Create Season

The existing form fields and saved data are unchanged, but the form now presents a
clear four-stage roadmap:

1. Season foundations
2. Competition format
3. Evidence policy
4. Review and create

## Icon language

Season workspace navigation uses the shared currentColor ThemeIcon system rather than
generic emoji. House emblems, player avatars and identity artwork remain unchanged.

## Safety boundary

28D3A does not change:

- activity scoring;
- daily caps;
- Power Play multipliers or no-repeat logic;
- House movement rules;
- C.H.A.O.S.;
- evidence-decision authority;
- leaderboard publication rules;
- season lifecycle transitions;
- Firestore Rules;
- Firebase deployment state.

Broad layered CSS consolidation remains deferred to v0.31.0.
