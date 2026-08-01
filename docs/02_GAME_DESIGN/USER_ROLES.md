# Champions Legacy Challenge — User Roles

Last updated: 1 August 2026

## Purpose

Roles control trusted platform responsibilities. They do not change activity scoring, goal bonuses, experience points or personal progression.

## Player

Identifier: `user`

A Player may:

- manage their own approved profile identity fields;
- create and delete their own permitted activity entries;
- manage their personal library;
- submit Exercise, Cardio and Skill suggestions;
- read published announcements;
- manage their own announcement read status.

A Player may not:

- change their own role or team;
- read draft or archived announcements;
- review suggestions;
- read other player profiles;
- read audit history;
- perform administrative writes.

## League Administrator

Identifier: `leagueAdmin`

This role is reserved for future league-scoped authority. Version 0.10.0 stores and presents the role but grants no additional Firestore permissions yet.

Future permissions must be scoped to explicit league membership and must never inherit full platform authority automatically.

## Platform Administrator

Identifier: `admin`

A Platform Administrator may:

- read player profiles for administration;
- create, edit, publish and archive announcements;
- review pending suggestions;
- update another player’s trusted role and team assignment;
- read immutable audit history.

Platform Administrators may not:

- change their own trusted role through the client;
- delete activity history, announcements or audit records;
- edit an already reviewed suggestion;
- bypass the required audit event for privileged writes.

## Authorization source

Platform Administrator authorization is accepted when either:

- the Firebase authentication token contains a trusted `admin: true` custom claim; or
- the authenticated player’s Firestore profile has `role: "admin"`, assigned through an already trusted process.

The ordinary web client cannot create its own administrator role.

## Separation from competition

Administrative authority provides no competitive advantage:

- no extra activity points;
- no extra goal bonuses;
- no experience-point multiplier;
- no automatic achievements;
- no leaderboard privilege.

## Guiding principle

Authority must be narrow, visible, auditable and unrelated to athletic ability or competitive score.
