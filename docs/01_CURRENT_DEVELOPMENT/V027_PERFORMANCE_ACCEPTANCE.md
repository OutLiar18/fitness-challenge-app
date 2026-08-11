# Champions Legacy Challenge — v0.27 Performance & Acceptance

Date: 11 August 2026
Checkpoint: 27G

## Purpose

27G is the final quality checkpoint before the v0.27 release freeze.

It has two parts:

1. an automated performance/accessibility/responsive-foundation gate;
2. an authenticated manual visual acceptance pass.

The automated gate is committed first. 27G is not considered fully closed until the
manual pass is completed.

## Performance decision

The app already uses:
- Firebase's modular web SDK;
- a modern Vite/Rolldown bundle;
- route-level React lazy loading.

The remaining build warning came from the Vite configuration intentionally forcing
all Firebase SDK packages into one `firebase-vendor` manual group.

27G keeps that grouping but gives it a 360 KiB Rolldown `maxSize` target. This is a
low-risk partitioning change rather than a Firebase architecture rewrite. Total
Firebase functionality is unchanged.

Automated performance budget:
- no emitted JavaScript chunk above 500 KiB;
- the Firebase vendor group must be partitioned into at least two chunks;
- every Firebase vendor chunk must remain below 500 KiB.

## Persistent automated acceptance

`npm run check` now runs:

`lint → application tests → production build → accept:v027`

The final verifier checks:
- build chunk budget;
- Firebase partitioning;
- route-level lazy loading;
- 320px global width foundation;
- focus-visible styling;
- dark-mode token block;
- reduced-motion handling;
- key light/dark contrast token pairs at WCAG AA normal-text ratio;
- shell skip-link/dialog/Escape foundations;
- WorkspaceTabs keyboard/tab semantics;
- ConfirmDialog modal/focus/Escape foundations;
- absence of browser-native `window.confirm` / `window.prompt` in page/component JSX.

It also reports, without automatically classifying them as defects:
- very small remaining CSS font declarations;
- button tags that may lack explicit `type`;
- image tags that may lack `alt`.

These candidates still need contextual review because static regex cannot reliably
judge JSX semantics.

## Manual acceptance matrix

### Narrow mobile — 320px
Check at minimum:
- Dashboard;
- Log Activity + Journal;
- Progress / Analytics;
- Profile / Inbox / Legacy Coach;
- Houses;
- Seasons;
- Platform Admin;
- Rulebook / Points Guide;
- Pocket Week;
- Help.

Acceptance:
- no unintended horizontal page scroll;
- no clipped buttons, controls, text or dialogs;
- mobile navigation remains reachable;
- dense tables/cards stack or scroll within their own intended container;
- destructive confirmations fit and remain operable.

### Tablet — representative 768px
Prioritise:
- Log Activity;
- Houses;
- Seasons;
- Platform Admin;
- Rulebook;
- Points Guide.

Acceptance:
- tablet shell/rail does not cover content;
- two-column/grid layouts collapse at sensible points;
- WorkspaceTabs mobile/select behavior is understandable where used;
- forms and operational actions retain readable labels and touch targets.

### Desktop — representative 1366–1440px
Check all primary routes for:
- stable content width;
- clear hierarchy;
- no excessive empty/stretch space;
- consistent cards, PageHeaders, tabs, alerts and dialogs.

## Keyboard / assistive technology

Keyboard-only:
- use skip link;
- traverse shell and More menu;
- use WorkspaceTabs with Tab, Arrow keys, Home and End;
- open/close ConfirmDialog with keyboard;
- Escape dialogs;
- verify focus restoration;
- provoke at least one validation error and verify focus moves to it.

Screen-reader spot-check:
- page/main landmarks;
- PageHeader titles;
- tab labels and selected state;
- Analytics weekly/consistency values;
- form error summaries;
- ConfirmDialog title/description;
- loading/status messages.

## Theme / motion / state review

- light theme;
- dark theme;
- reduced-motion preference;
- representative loading states;
- empty states;
- validation/error states;
- destructive-action busy state.

## Release boundary

27G changes no scoring, competition, evidence, administrator authority, Firebase data
semantics or Firestore Rules. No Firebase deployment occurs.

After automated and manual 27G acceptance are both complete, proceed to 27R.

## Automated-gate remediation

The first automated 27G run confirmed the Firebase split and contrast budgets, then
exposed three remaining browser-native consequential actions. The shell skip-link
finding was a verifier false positive: the implemented contract already links to
`#main-content`, while the verifier was checking an obsolete CSS class name.

The remediation replaces:
- Entry Integrity immutable-correction `window.confirm` with ConfirmDialog;
- Library Publisher archive `window.confirm` with ConfirmDialog;
- Power Play pre-week redraw `window.prompt` with an explicit in-app reason form.

The underlying correction, archive and Power Play service calls and permissions are
unchanged.
