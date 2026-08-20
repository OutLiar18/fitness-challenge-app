# v0.28 Checkpoint 28D14 — MBTI Themes & Champion Transmission

Checkpoint: 28D14

## Purpose

Extend the owner-accepted 28D13 Legacy Profile system into app-wide presentation and motivation without changing the persisted player contract, gameplay, authority, scoring, Firestore Rules or production Firebase state.

## Decisions

- `profile.mbtiType` remains the only persisted MBTI selection.
- Every valid MBTI type receives one curated global palette.
- The palette changes brand atmosphere: page/surface tint, primary/control colour, accent, borders, focus and glow.
- Success, warning and danger remain semantic colours and are not personality-coloured.
- The default Champions Legacy crimson theme remains the fallback when no valid MBTI is selected.
- Champion Transmission uses a four-message type-specific bank plus the already accepted type-specific Challenge approaches.
- The selected official role title, mythic identity and defining quality are exposed to the Dashboard hero.
- All tailored copy is original Champions Legacy copy. Official 16Personalities names remain reference labels only.

## Research boundary

Colour/personality research supports associations between personality traits and colour preference, including evidence that extraversion can relate to preference for higher chroma. It does not support deterministic claims that a specific MBTI type must prefer one hue. The palettes are therefore design interpretations based on the accepted Legacy Profile traits, mythic symbolism and accessibility requirements rather than claims of psychological certainty.

Reference background:
- 16Personalities personality type framework: https://www.16personalities.com/personality-types
- Jue & Ha (2022), *Exploring the relationships between personality and color preferences*, Frontiers in Psychology 13:1065372.
- Wilms & Oberfeld (2018), *Extraversion predicts a preference for high-chroma colors*, Personality and Individual Differences 127, 133–138.

## Theme architecture

`MbtiThemeBridge` lives inside `PlayerDataProvider`, reads the existing profile, and applies four identity colour primitives to the document root. Shared CSS derives the complete light/dark application palette from those primitives. Removing or changing the MBTI selection clears/replaces the root values immediately.

This keeps all existing components theme-reactive through the shared CSS variables instead of introducing per-page MBTI conditionals.

## Champion Transmission

The existing deterministic daily selection remains. A player with a valid MBTI receives:
- a type-specific quote;
- type-specific coach language;
- a side quest from that type's accepted `thrive` guidance;
- official role title and Champions Legacy mythic identity metadata.

Players without a valid selection continue to receive the existing neutral library.

## Safety / unchanged boundaries

- Firestore Rules: unchanged.
- Firebase deployment: none.
- No data migration.
- No scoring, goals, XP, achievements, House, season, evidence, account or authority changes.
- Existing light/dark operating-system preference remains respected.
- Status colours remain semantic.
- Primary button and dark accent contrast are regression-tested for all 16 palettes.
