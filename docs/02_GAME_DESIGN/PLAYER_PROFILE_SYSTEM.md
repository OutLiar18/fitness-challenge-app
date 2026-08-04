# Champions Legacy Challenge — Player Profile System

Last updated: 4 August 2026

## Purpose

A player profile provides a stable identity, safe personalisation, trusted role context and versioned onboarding state. It must not become an alternate source for points, House history or achievements.

## Profile fields

- Firebase user ID and email.
- First name, last name, full name and display name.
- Local Legacy Avatar identifier.
- Trusted platform role.
- Legacy `team` compatibility field while permanent Teams remain retired.
- Joined timestamp.
- Onboarding version and completion/update timestamps.
- Profile update timestamp.

## Player-controlled fields

Players may update only:

- display name;
- avatar identifier;
- constrained onboarding state through the guide/replay service.

They cannot self-assign administrative roles, season membership, House leadership or competitive history.

## Onboarding behaviour

- New profiles start at version `0` and receive the guided introduction after sign-in.
- Completion or Skip stores the current version and timestamps.
- Legacy profiles without the fields are considered already onboarded.
- Replay resets only onboarding fields and does not change entries, points, progression or memberships.

## Profile protections

The Profile protections workspace links to Help & Privacy for data explanations, personal export and account requests. Account closure is not represented as an immediate profile delete because trusted Authentication and shared-history operations are required.

## Identity in season history

Memberships and contributions snapshot display name, avatar and House identity where needed. Later profile changes do not rewrite historical competition facts.
