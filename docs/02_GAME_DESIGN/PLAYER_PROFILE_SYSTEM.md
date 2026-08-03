# Champions Legacy Challenge — Player Profile System

Last updated: 1 August 2026  
Current release: v0.14.0

## Purpose

The profile makes identity and personal growth visible without turning private activity into an uncontrolled public comparison system.

## Profile identity

`/profile` displays the player’s display name, email, Legacy Avatar, trusted role, joined date, progression summary and current season/House memberships.

Players may edit only display name and an approved local avatar. Email, role, ownership and join date remain protected.

## Legacy Avatars

Only an approved `avatarId` is stored. The artwork is bundled locally, avoiding uploaded-media cost, arbitrary external URLs and image moderation.

## Season and House identity

House identity comes from `leagueMemberships/{leagueId_userId}` and is scoped to one season. It is never a freely editable profile field. Moving Houses changes only current membership and future contributions; previous House snapshots remain historical.

## Legacy Coach preferences

Private settings live at `users/{userId}/coach/preferences` and control enabled state, tone and focus. They do not change scoring or expose recommendations publicly.

## Trusted role presentation

Profiles may display Player, League Administrator or Platform Administrator. House Captain and Vice-Captain are presented within the season House experience and remain separate from trusted platform roles.

## Data principles

- Store identity and membership facts.
- Derive progress from factual entries.
- Keep competitive points separate from experience points.
- Require explicit privacy design before public activity or league-history profiles.
- Do not make custom image uploads available until storage, consent, moderation and cost rules exist.
