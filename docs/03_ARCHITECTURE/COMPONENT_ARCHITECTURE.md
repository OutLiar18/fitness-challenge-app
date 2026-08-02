# Champions Legacy Challenge — Component Architecture

Last updated: 1 August 2026  
Current release: v0.13.1

## Layout

`AppShell`, `PageHeader` and `PageLoader` provide the adaptive desktop, tablet and mobile frame.

## Route pages

- `Dashboard`, `ActivityLog`, `Progress`, `Announcements`, `Profile`.
- `Teams` — creation/join states and current team dashboard.
- `Leagues` — league library, creation/registration and selected league detail.
- `LegacyCoach` — summary, metrics, recommendations, evidence and preferences.
- `Admin` — trusted platform workspace.
- `FutureFeature` remains only for legacy preview URLs and is not primary navigation.

## Teams composition

- create form;
- join form;
- hero and invitation action;
- weekly summary;
- roster;
- captain editing and transfer controls.

## Leagues composition

- join form;
- administrator creation form;
- league browser;
- lifecycle controls;
- frozen-rules explanation;
- individual/team standings.

## Legacy Coach composition

- current-week summary;
- current-versus-previous metrics;
- recommendations with expandable reasons;
- evidence list;
- private preference controls;
- human-first guardrail.

## Presentation rules

- Complete player-facing words through `displayFormatters`.
- Display typography for headings, professional body type for operations and restrained serif accents for reflective quotations.
- Strong weight marks actions/results; italics mark reflection; underlining remains for links/active controls.
- Loading, empty, error and success states must remain clear.
- No page duplicates points, league formulas or security logic.

## v0.13.1 Reference System

- `Rulebook.jsx` renders dynamic goals, search/filter controls, jump navigation and accessible rule accordions.
- `PointsGuide.jsx` renders category selection, score ladders, formulas, difficulty, visible bonuses and league scoring.
- Both routes are lazy loaded and available from the shared More navigation.
- Page components receive generated models and do not own scoring rules.

