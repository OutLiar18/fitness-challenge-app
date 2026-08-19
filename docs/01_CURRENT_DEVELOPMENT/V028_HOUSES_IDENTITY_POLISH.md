# Champions Legacy Challenge — v0.28.0 Houses Identity & Workspace Polish

Checkpoint: 28D4

## Purpose

28D4 completes the owner review of Houses with a faster, high-value polish pass. It
strengthens House allegiance and identity, expands visual choice substantially, and
makes the selected House colour theme the local visual language of the Houses route.

## House-local colour themes

The colour selected for a House now drives the Houses page while that House is selected.
This is deliberately scoped to the Houses route only.

The theme changes the local primary interaction colour, active workspace treatment,
focus treatment, glow, accent details and selected-House surfaces. Global application
theme settings are not changed and no other page inherits the House palette.

The curated colour library expands from 8 to 24 paired palettes:

Emerald, Jade, Viridian, Sapphire, Cobalt, Cerulean, Teal, Turquoise, Amethyst,
Violet, Indigo, Crimson, Scarlet, Ruby, Rose, Magenta, Sunstone, Amber, Gold,
Copper, Bronze, Slate, Obsidian and Frost.

Each colour includes a paired secondary tone used for gradients and identity details.

## Emblem library

The emblem library expands from 32 to 56 choices while keeping the existing identities
valid. New choices include Raven, Owl, Fox, Boar, Crocodile, Gorilla, Kraken, Bat, Ram,
Bull, Stallion, Spider, Trident, War Axe, War Hammer, Citadel, Fleur-de-lis, Sun, Star,
Frost, Tempest, Lotus, Skull and Feather.

## Page structure

- the House page introduction is shorter and identity-led;
- the unrelated Pocket Week header action is removed;
- the player's current House is sorted first and marked Your House;
- the selected House banner is strengthened with roster and leadership metadata;
- the shared context summary becomes role-aware and no longer duplicates navigation buttons;
- House workspace tabs use icon + title only;
- generic House workspace emoji are replaced with ThemeIcon symbols;
- roster leadership hierarchy uses currentColor crown/star icons;
- Historical Integrity uses plain-language competition wording;
- the malformed draft-House Working ellipsis is corrected;
- C.H.A.O.S. remains visually dramatic and functionally unchanged;
- desktop/tablet/mobile spacing, workspace gaps, House grids and identity forms are polished.

## Safety boundary

28D4 does not change:

- C.H.A.O.S. assignment logic;
- leadership vote rules;
- roster movement/rest rules;
- House scoring or historical allocation;
- composition/balance calculations;
- season lifecycle;
- Firestore Rules;
- Firebase deployment state.

The separate evidence-proof UX issue identified after the Seasons review remains a
follow-up item and is not mixed into this House checkpoint.
