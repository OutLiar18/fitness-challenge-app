# Champions Legacy Challenge — v0.27 Design System Foundation

Date: 11 August 2026
Checkpoint: 27B

## Purpose

27B establishes the shared visual and accessibility foundation used by every later
v0.27 page checkpoint. It changes presentation only: no gameplay, scoring, league
logic, Firestore Rules, authentication authority or production Firebase state.

## Visual direction

Champions Legacy uses a disciplined warrior-inspired identity rather than a bright
multi-colour dashboard aesthetic.

Primary identity:
- black / charcoal foundations;
- dark blood red as the primary action and focus identity;
- restrained gold for achievement/status emphasis;
- warm neutral surfaces so long-form content remains readable;
- green, cyan and purple remain semantic secondary tones rather than brand competitors.

## Light tokens

- page: `#f3eff0`
- raised surface: `#ffffff`
- text: `#21181b`
- muted text: `#6d5b60`
- primary blood red: `#8f1d2c`
- primary control: `#8f1d2c`
- achievement accent: `#b88735`

## Dark tokens

- page: `#09090b`
- raised surface: `#17171a`
- text: `#f5eff1`
- muted text: `#c7b8bc`
- readable primary accent: `#e35a6b`
- primary control: `#a92337`
- achievement accent: `#e4b85f`

The dark theme separates the brighter readable accent from the darker button/control
red so white button labels retain strong contrast.

## Shared interaction rules

- standard buttons have a 46px minimum height;
- form inputs retain their existing 46px minimum;
- icon-only shared buttons increase from 42px to 46px;
- focus rings use a dedicated visible `--focus-ring` token;
- cards use lighter one-pixel structural borders plus shadow rather than heavy double borders;
- primary actions use dedicated control/on-primary tokens;
- navigation keeps semantic tones, but blood red owns the application identity.

## Shell readability

27A identified very small shell/status labels. 27B raises the main shell microcopy,
including:
- sidebar stat labels;
- nav badges and nav group headings;
- mobile header microcopy;
- mobile status chips;
- mobile bottom-nav labels;
- narrow 320–360px labels;
- mobile notification badges.

No shell routing, focus trapping, scroll reset, unread-count logic, player state or
administrator gating changes.

## Shared route primitives

27B visually standardises:
- `.card`;
- `.button` variants;
- form focus/help states;
- PageHeader;
- WorkspaceTabs;
- desktop sidebar;
- tablet rail;
- mobile header;
- mobile bottom navigation;
- More dialog surfaces.

## Deferred to usage checkpoints

27B deliberately does **not** add speculative unused components.

The reusable confirmation dialog will be introduced in 27C when native confirmation
flows are actually replaced in the core player journey. Page-specific layout changes
also stay in their dedicated 27C–27F checkpoints.

## Responsive boundary

Shared styles remain compatible with:
- 320px narrow mobile;
- normal mobile through 760px;
- tablet icon rail from 761px to 1100px;
- full desktop sidebar above 1100px.

27G remains the final dedicated cross-device/manual accessibility acceptance pass.

## Verification

27B adds a persistent design-system regression test and runs the complete application
gate (`npm run check`). Firestore Rules are hash-verified unchanged and the Rules
emulator suite is intentionally not repeated because 27B does not touch Rules or
security/data behavior.

Production remains v0.26.0. No Firebase deployment occurs.
