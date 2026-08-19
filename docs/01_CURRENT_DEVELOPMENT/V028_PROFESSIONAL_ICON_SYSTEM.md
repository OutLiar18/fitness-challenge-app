# Champions Legacy Challenge — v0.28.0 Professional Icon System

Checkpoint: 28D4B

## Decision

The hand-authored SVG path library is replaced by the official Phosphor React icon
package pinned at `2.1.10`.

This is intentionally one visual family rather than several unrelated packs. The result
is a consistent icon language across navigation, actions, competition workspaces and
House identity while keeping the app's existing `ThemeIcon` and `HouseEmblem`
interfaces stable.

## Shared UI icons

`ThemeIcon` remains the reusable application wrapper, but its 34 existing semantic keys
now resolve to Phosphor icons. Existing callers do not need to change.

Examples:

- Home → HouseSimple
- Seasons → ShieldCheckered
- Houses → CastleTurret
- Inbox → BellRinging
- Analytics → ChartBar
- Legacy Coach → Sparkle
- Rulebook → BookOpenText
- Administration → GearSix
- Power Plays → Lightning
- Standings → Ranking
- Evidence → SealCheck
- Leadership → Crown / StarFour
- Roster → UsersThree

Ordinary UI icons use regular weight by default and bold weight where the previous
wrapper requested a heavier stroke.

## House emblems

All 56 stored House `emblemId` values remain unchanged. `HouseEmblem` now maps those
stable identities to a curated Phosphor icon. The visual treatment defaults to
Phosphor's duotone weight, which gives the emblem picker, previews, cards and selected
House banner more depth than the temporary hand-drawn line set.

Every emblem continues to use `currentColor`, so the selected House palette remains the
source of truth for emblem colour.

The mapping deliberately includes direct matches where available and heraldic/symbolic
interpretations where the general-purpose pack has no exact animal silhouette.

## Dependency and performance

`@phosphor-icons/react` is pinned exactly at `2.1.10`. Imports use the
package's individual `/dist/csr/<Icon>` paths rather than the broad package entry point
so Vite only needs the icon modules actually used by the application.

## Safety boundary

28D4B does not change:

- House IDs or stored emblem IDs;
- House colour palettes;
- season/House competition mechanics;
- scoring;
- C.H.A.O.S.;
- leadership or roster movement;
- Firestore Rules;
- Firebase deployment state.
