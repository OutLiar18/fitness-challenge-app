# Champions Legacy Challenge — v0.28.0 Pocket Week Polish

Checkpoint: 28D7

## Review outcome

Pocket Week already has the important functional foundation: URL-backed season/tab
state, a season-relative seven-day Pocket window, zero-point storage before the
season, partial/whole redemption during the active season, and immutable use of the
existing Pocket domain/service layer.

The v0.28 pass therefore stays focused on clarity, professional icon consistency and
removing unrelated presentation clutter.

## Changes

- Analytics is recorded as owner-accepted and the inspection advances to Pocket Week;
- PageHeader and WorkspaceTabs use the shared Phosphor-backed ThemeIcon language;
- tab labels become the shorter `Store`, `Pocket` and `How it works`;
- the unrelated `View Houses` header action is removed;
- category artwork remains data-driven from the existing category metadata;
- the Pocket-card fallback, empty-state marker and guide principles use professional
  ThemeIcon presentation rather than raw emoji/text glyphs;
- the storage notice removes decorative suitcase emoji while preserving the integrity
  warning;
- the unrelated zebra easter-egg card is removed;
- small CSS changes align guide and empty-state icons with the current design system;
- URL state, season phase logic, storage, activation and point behaviour remain
  unchanged.

## Safety boundary

28D7 does not change:

- Pocket Week dates or the seven-day window;
- store/redeem domain calculations;
- point values;
- allowed redemption quantities;
- season lifecycle;
- House or competition mechanics;
- Firestore reads/writes or Rules;
- Firebase deployment state.

Broad historical CSS consolidation remains deferred to v0.31.
