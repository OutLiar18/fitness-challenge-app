# v0.28 Reviewed Surfaces + Seasons Polish

Status: implemented by Checkpoint 28D3; owner visual/responsive review pending.

## Purpose

28D3 applies the direct source-review recommendations that remained after the accepted
Home, Navigation, Log Activity and Progress work, then completes the first implementation
pass for Seasons.

This is presentation and information-hierarchy work. It does not change scoring,
competition authority, season lifecycle rules, evidence rules, Firestore Rules or
Firebase production state.

## Dashboard

The Dashboard Personal Progression card is intentionally a preview rather than a second
Progress page.

It now concentrates on:
- current level and title;
- current level XP fraction and percentage;
- XP remaining until the next level;
- current streak;
- the next available/in-progress achievement, or latest achievement as fallback;
- a single Open Progress action.

Longest streak, bonus-point duplication, streak-shield explanation and the miniature
achievement collection are removed from this preview because the dedicated Progress page
already owns that detail.

The Champion Transmission retains its content, but small-screen spacing is tightened.
Side Quest and Coach stay side-by-side through ordinary phone widths and collapse to one
column only on narrower phones.

## Navigation

Generic navigation stops relying on emoji as its visual system.

`ThemeIcon` now includes currentColor SVG symbols for ordinary application destinations
and actions, including Home, Seasons, Houses, Inbox, Analytics, Pocket Week, Legacy
Coach, Rulebook, Points Guide, Help, Administration, Profile, More and Sign out.

This does not recolour or replace:
- House identity art;
- MBTI Legacy Profile identity;
- achievement rarity/identity;
- semantic success/warning/error presentation.

The More menu is simplified into:
- Inbox and account on mobile;
- Tools;
- Reference and support;
- Operations for Platform Administrators.

Navigation routes and role authority do not change.

## Log Activity

Workspace navigation keeps the titles `Log activity` and `Journal` without descriptive
subtitles.

The Category picker no longer repeats the instruction to select a category because the
Action Centre 1/2/3 guide already explains the workflow. Today/Yesterday remains in the
category-picker header and the `Keep the legend real` message remains in the page header.

## Progress

The accepted Progress hero remains the only visual owner of the percentage to the next
level.

The Overview Experience card keeps:
- XP into the level / XP required for that level;
- the progress bar;
- XP remaining until the next level;
- the XP-source breakdown.

Duplicate percentage labels inside that card are removed.

The hidden level-cap and unlocked-title-only Level Journey remain unchanged.

## Seasons

### Arena tone

The Seasons header now reads:

> Enter the season. Climb the ranks, carry your House and make every week worthy of the
> legacy you leave behind.

The page is framed as seasonal competition rather than an administrative archive.

### Workspace navigation

Browse seasons, Join a season and Create season use icon + title only.

Season detail workspaces also use icon + title only. Numeric Standings badges and tab
subtitles are removed. `Evidence operations` is shortened to `Evidence`.

### Season roster

`Season archive` becomes `Season roster` because the list may contain draft,
registration, active, completed or archived seasons.

Each season card now shows:
- theme;
- season name;
- date range;
- season phase;
- membership state when applicable.

Active seasons receive a restrained live-state accent and the selected season retains the
primary selected treatment.

### Selected-season hero

The hero focuses on season identity, dates and high-level consequential actions.

Open Houses and Open Pocket move out of the hero into the season-context card. The hero
retains appropriate membership, invitation, lifecycle, draft-deletion and registration
withdrawal controls.

The malformed draft-deletion loading ellipsis is corrected.

### Role-aware season context

The CompetitionWorkspaceSummary no longer duplicates internal workspace-tab shortcuts.

For a registered player it prioritises:
- current House;
- individual rank when available;
- current season points when available;
- current weekly Power Play state.

For a season manager it prioritises:
- season phase;
- participant count;
- House count;
- current weekly Power Play state.

For a viewer it shows a concise season preview.

Open Houses and Open Pocket remain available here as external/contextual destinations.

### Live season-system cards

The four overview cards now communicate current state rather than only feature names:
- House/C.H.A.O.S. state;
- Pocket state and dates;
- current Power Play or its waiting/completed state;
- whether standings are available to the current viewer.

The grid is four columns on wide screens, two on medium screens and one on narrow mobile.

### Player-facing rules

`Frozen seasonal rules` and the raw ruleset version heading are replaced by `Season rules`
and `How this season scores`.

Ordinary players see the useful scoring facts, standings model and participant count.
Technical scoring-engine and rules-version identifiers are shown only to season managers.

## Deferred cleanup

The review also identified growing layered CSS in large files such as Progress and the
application shell. Broad CSS consolidation is deliberately deferred to v0.31.0 cleanup /
polish / hardening rather than mixed into this page-inspection checkpoint, where it would
create unnecessary regression risk.

Final logo/favicon and MBTI-dependent brand art remain deferred until those assets are
decided.

## Safety boundary

28D3:
- changes no competitive scoring rules;
- changes no achievement XP or level curve;
- changes no season lifecycle transition contract;
- changes no House movement/rest rules;
- changes no evidence authority;
- changes no Firestore Rules;
- performs no Firebase deployment;
- leaves the frozen v0.27.0 production tag untouched.
