# Champions Legacy Challenge — User Roles

Last updated: 3 August 2026

## Purpose

Roles control trusted responsibilities. They never change activity points, goal bonuses, experience points, achievements or season contribution formulas.

## Player

Identifier: `user`

A Player may manage their profile identity, factual entries, personal library, announcement reads, Legacy Coach preferences and season registrations. During a House season, a Player may store and redeem their own Pocket Week activities, vote once in their current House’s weekly leadership election and view the standings and private notifications available to them.

A Player may not change their own trusted role, rewrite another player’s activity, review suggestions, manage another account, alter completed season contributions or assign themselves to a House.

## League Administrator

Identifier: `leagueAdmin`

A League Administrator may:

- create a season Draft with a frozen supported ruleset;
- become an explicitly assigned administrator of that season;
- create themed Houses for the assigned season;
- open Registration and activate C.H.A.O.S.;
- open and resolve weekly House leadership elections;
- complete permitted weekly House roster swaps;
- move the assigned season through Registration, Active, Completed and Archived stages;
- create the matching season-scoped audit events.

A League Administrator may not:

- administer a season to which they are not assigned;
- manage platform announcements, users, global libraries or client error reports;
- grant trusted roles;
- modify frozen scoring rules after creation;
- rewrite historical House contributions;
- receive competitive advantages.

## Platform Administrator

Identifier: `admin`

A Platform Administrator may perform platform administration, including announcements, moderation, global library releases, trusted user-role management, audit review, error resolution and all season operations.

Platform Administrators may not change their own role through the client, delete immutable audit history, permanently assign a player to a global team or receive competitive advantages.

## House Captain

House Captain is a weekly season role, not a trusted platform role.

The Captain is normally determined by the highest valid vote total after a complete 24-hour House ballot. The Captain may open the next eligible weekly ballot, appoint one additional Vice-Captain and participate in the House’s permitted weekly roster swap.

Captain authority ends or changes when the next weekly election is finalised, the player changes House or the season ends.

## Primary Vice-Captain

The primary Vice-Captain is normally the player with the second-highest valid vote total after the weekly ballot.

The primary Vice-Captain may open the next eligible ballot and participate in the House’s permitted weekly roster swap. They remain the primary Vice-Captain for that week even when the Captain appoints one additional Vice-Captain.

## Additional Vice-Captain

The current Captain may appoint one additional current House member as a second Vice-Captain for the week.

This appointment does not replace the elected primary Vice-Captain and is reset when the next weekly leadership election is finalised.

## Authorization source

Platform authority comes from a trusted Firebase custom claim or protected Firestore profile role. League operations additionally require explicit assignment in the season document. House leadership comes from the current season’s protected House document. Player placement comes from the current season membership document and never from a permanent profile field.

## Principle

Authority must be narrow, visible, auditable, temporary where appropriate and unrelated to score.
