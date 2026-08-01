# Champions Legacy Challenge — User Roles

Last updated: 1 August 2026

## Purpose

Roles control trusted responsibilities. They never change activity points, goal bonuses, experience points, achievements or league contribution formulas.

## Player

Identifier: `user`

A Player may manage their profile identity, factual entries, personal library, announcement reads, Coach preferences, team membership and league registrations. Players may submit activity-library suggestions and view published content.

A Player may not change their own trusted role, review suggestions, manage another account, create league audit authority or alter league contribution snapshots.

## League Administrator

Identifier: `leagueAdmin`

A League Administrator may:

- create a league Draft with a frozen supported ruleset;
- become an explicitly assigned administrator of that league;
- move that assigned league forward through Registration, Active, Completed and Archived stages;
- create the matching league-scoped audit events.

A League Administrator may not:

- administer a league to which they are not assigned;
- manage platform announcements, users, global libraries or client error reports;
- grant roles;
- modify league rules after creation;
- receive competitive advantages.

## Platform Administrator

Identifier: `admin`

A Platform Administrator may perform platform administration, including announcements, moderation, global library releases, user role/team metadata, audit review, error resolution and all league operations.

Platform Administrators may not change their own role through the client, delete immutable audit history or receive competitive advantages.

## Team Captain

Team captain is a team membership role, not a trusted platform role. It grants narrow authority over one team’s identity and captain transfer. It does not grant league or platform administration.

## Authorization source

Platform authority comes from a trusted Firebase custom claim or protected Firestore profile role. League operations additionally require explicit assignment in the league document. Team captain authority comes from the team and membership documents.

## Principle

Authority must be narrow, visible, auditable and unrelated to score.
