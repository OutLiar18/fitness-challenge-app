# Champions Legacy Challenge — Player Profile System

Last updated: 1 August 2026  
Current release: v0.11.0

## Purpose

The profile makes identity and personal growth visible without turning private activity into an uncontrolled public comparison system.

## Profile identity

`/profile` displays the player’s display name, email, Legacy Avatar, trusted role, live team, joined date, level, title, points, entries and longest streak.

Players may edit only display name and an approved local avatar. Email, role, ownership and join date remain protected.

## Legacy Avatars

Only an approved `avatarId` is stored. The artwork is bundled locally, avoiding uploaded-media cost, arbitrary external URLs and image moderation.

## Team identity

The live team comes from `playerTeams/{userId}` rather than a freely editable profile string. Team name and emblem may appear in team and league experiences. Leaving a team never changes historical league snapshots.

## Legacy Coach preferences

Private settings live at `users/{userId}/coach/preferences` and control enabled state, tone and focus. They do not change scoring or expose recommendations publicly.

## Trusted role presentation

Profiles may display Player, League Administrator or Platform Administrator. Team captain is presented within the team experience and remains separate from trusted platform roles.

## Data principles

- Store identity and membership facts.
- Derive progress from factual entries.
- Keep competitive points separate from experience points.
- Require explicit privacy design before public activity or league-history profiles.
- Do not make custom image uploads available until storage, consent, moderation and cost rules exist.
