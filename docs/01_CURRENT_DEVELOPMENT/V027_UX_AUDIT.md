# Champions Legacy Challenge — v0.27 UX / Accessibility / Performance Audit

Date: 11 August 2026
Checkpoint: 27A
Baseline repository commit: `fc3a93d1b2702ab8672ce89ec9966024564c9282`
Production release tag: `v0.26.0` → `c057fca0598fe4a07ff101ea13808f1da8918aa8`

## Purpose

This checkpoint inventories the existing application before visual or interaction changes.
It is intentionally non-functional: no gameplay, Firestore, scoring, permissions or production
Firebase state is changed.

The audit uses the project UX principles: simplicity, clarity, consistency, efficiency,
feedback, focus, learnability, forgiveness and trust. Accessibility priorities include
readability, non-colour-only communication, visible keyboard focus, touch usability,
screen-reader labelling, reduced motion and responsive behaviour.

## Executive summary

The application already has strong foundations: route-level lazy loading, a reusable shell,
workspace tabs, shared buttons/cards/forms, skip navigation, visible focus styles, reduced-motion
handling and explicit ARIA usage.

v0.27 should therefore be a **focused refinement**, not a redesign-from-zero.

The highest-value work is:
1. lock the design-system/brand foundation and shell;
2. polish the repeated Dashboard → Log Activity → Journal loop;
3. simplify dense Progress/Analytics/Profile/Inbox experiences;
4. restructure the very large Houses and Seasons workspaces by task;
5. standardize Admin/reference surfaces;
6. finish with performance and full device/accessibility acceptance.

## Baseline inventory

- Protected/public route declarations found: **24**
- Lazy page modules found: **18**
- JSX files scanned: **86**
- CSS files scanned: **49**
- Global CSS media queries: **102**
- Reduced-motion declarations: **8**
- `:focus-visible` selectors: **13**
- ARIA label occurrences: **71**
- Dialog-role occurrences: **2**
- `.sr-only` definitions/usages in CSS: **1**
- Native `window.confirm` flows: **8**
- CSS font-size declarations below 12px: **90**
- CSS font-size declarations below 11px: **29**
- Hard-coded hexadecimal colour declarations: **91**
- JSX files with likely clickable non-button elements: **0**
- JSX files with at least one button missing explicit `type`: **0**
- JSX files with an `img` missing explicit `alt` in static scan: **0**

## Core shell

- `AppShell.jsx`: **497 lines**
- `AppShell.css`: **810 lines**
- `index.css`: **471 lines**
- Current primary token: `#3157d5`
- Current page background token: `#f3f6fb`
- Current dark page background token is defined through the OS dark-mode media query.

The shell already includes:
- skip-to-main-content navigation;
- desktop and mobile navigation;
- route-top scroll reset;
- More-menu dialog semantics;
- keyboard Escape handling;
- Tab focus trapping and focus restoration;
- unread/review badges;
- player status summaries.

The shell should be refined rather than replaced.

## Route/page complexity

| Page | JSX lines | CSS lines | Total | Media queries | Workspace tabs | Native confirms |
|---|---:|---:|---:|---:|---:|---:|
| Houses | 1423 | 454 | 1877 | 8 | 1 | 3 |
| Seasons | 1276 | 184 | 1460 | 5 | 2 | 2 |
| Admin | 213 | 988 | 1201 | 7 | 1 | 0 |
| Rulebook | 373 | 595 | 968 | 4 | 0 | 0 |
| Progress | 476 | 471 | 947 | 3 | 1 | 0 |
| PointsGuide | 354 | 576 | 930 | 3 | 1 | 0 |
| Help | 573 | 237 | 810 | 2 | 1 | 0 |
| Profile | 423 | 350 | 773 | 3 | 1 | 0 |
| Inbox | 400 | 220 | 620 | 2 | 0 | 0 |
| PocketWeek | 404 | 34 | 438 | 2 | 1 | 0 |
| Analytics | 294 | 102 | 396 | 2 | 1 | 0 |
| ActivityLog | 264 | 43 | 307 | 2 | 1 | 1 |
| LegacyCoach | 225 | 33 | 258 | 2 | 1 | 0 |
| FutureFeature | 76 | 99 | 175 | 1 | 0 | 0 |
| Signup | 98 | 0 | 98 | 0 | 0 | 0 |
| Login | 90 | 0 | 90 | 0 | 0 | 0 |
| Dashboard | 57 | 28 | 85 | 1 | 0 | 0 |
| NotFound | 21 | 31 | 52 | 0 | 0 | 0 |

The two clearest structural hotspots are **Houses** and **Seasons**. Their size does not imply
incorrect code, but it strongly suggests that users are being asked to traverse many distinct
tasks inside single route modules. v0.27 should separate presentation/workspaces while leaving
services and competition rules intact.

## Build / bundle inventory

Built JS assets found: **41**
Built CSS assets found: **23**

Largest JavaScript assets:

| Asset | Size |
|---|---:|
| `firebase-vendor-BZlAYTzM.js` | 562.19 KiB |
| `react-vendor-3h4J9vI8.js` | 227.13 KiB |
| `index-BM5ykT6o.js` | 171.79 KiB |
| `Seasons-Bi6lq6S_.js` | 87.73 KiB |
| `points-BQrJT83_.js` | 61.54 KiB |
| `Admin-BSYszedt.js` | 59.54 KiB |
| `EntryForm-CRMOYVey.js` | 44.21 KiB |
| `Houses-DWSIK8XZ.js` | 38.98 KiB |

The existing route-level lazy imports should be preserved. Performance work should focus on
what is still eagerly pulled into shared/vendor chunks rather than undoing route splitting.

## Static accessibility notes

### Existing strengths
- global visible `:focus-visible` styling;
- reduced-motion handling;
- skip link and main landmark;
- explicit labels/ARIA throughout the shell and major workspaces;
- buttons are generally used for interactive cards and navigation actions;
- forms frequently pair `label htmlFor` with input IDs;
- progress uses semantic `role="progressbar"` and values;
- charts/heatmap elements include accessible descriptions.

### Review targets
- tiny navigation/status text should be raised where it drops below comfortable reading size;
- colour/status treatments must retain text/icon meaning;
- custom tab sets need keyboard behaviour and focus review on every route;
- native browser confirms should converge on one accessible app dialog;
- dense mobile forms need 44px+ practical touch targets and no horizontal clipping;
- visual charts should provide equivalent readable values, not tooltip-only meaning;
- manual screen-reader and keyboard acceptance is still required because static source analysis
  cannot prove runtime reading order or focus quality.

Static scan lists:
- clickable non-button candidates: none detected
- button-type candidates: none detected
- image-alt candidates: none detected

These are **review candidates, not automatic defects**.

## Prioritized v0.27 plan

| Priority | Area | Finding | Next action |
|---|---|---|---|
| P1 | Design system + visual identity | Global tokens currently use primary #3157d5 / page background #f3f6fb. v0.27 should settle the approved Champions Legacy palette, typography hierarchy and reusable surface/button/status tokens before page-by-page polish. | 27B: establish the v0.27 token/component foundation and apply it first to the shell. |
| P1 | Readability | 90 CSS font-size declarations resolve below 12px (29 below 11px). This conflicts with the accessibility goal of avoiding extremely small text and is especially relevant in navigation/status microcopy. | 27B: raise tiny shell/status text to a readable minimum and verify wrapping at 320px. |
| P1 | Competition workspaces | Houses (1423 JSX lines), Seasons (1276 JSX lines) are very large route components. This increases cognitive and responsive-layout risk even if functionality is correct. | 27E: split these pages by user task/workspace and make each state easier to scan without changing competition rules. |
| P1 | Destructive-action UX | 8 native window.confirm flow(s) remain. They work, but they are visually inconsistent and offer limited contextual/accessibility control. | Replace high-value destructive confirmations with one reusable accessible confirmation-dialog pattern. |
| P1 | Performance | Largest JS chunk is firebase-vendor-BZlAYTzM.js at 562.19 KiB. The release build warning is therefore still real. | 27G: reduce Firebase/vendor loading cost without compromising route-level lazy loading. |
| P1 | High-frequency player journey | Dashboard → Log Activity → Journal is the most frequently repeated product loop and should receive polish before lower-frequency administration/reference screens. | 27C: optimize hierarchy, touch targets, form flow, feedback and journal scanning across desktop/tablet/mobile. |
| P2 | Progress + reflection | Progress, Analytics, Profile, Inbox and Legacy Coach contain valuable information but can become dense. Preserve their data while reducing simultaneous visual competition. | 27D: improve information hierarchy, empty/loading states and chart/summary accessibility. |
| P2 | Administration + reference | Admin exposes nine tabbed workspaces, while Rulebook/Points/Help are content-heavy reference surfaces. They need consistency and scanability, but are lower-frequency than player logging. | 27F: standardize tables/lists/forms/dialogs and reference-page reading layouts. |
| P3 | Delight | Keep subtle Easter eggs and celebration, but only after clarity, accessibility and performance are stable. | Add restrained motion/micro-interactions with reduced-motion support. |

## Proposed checkpoints

### 27B — Design system + application shell
- approved black/dark-blood-red Champions Legacy visual direction;
- accessible colour tokens for light/dark surfaces and statuses;
- readable type scale and minimum microcopy sizes;
- consistent buttons/cards/forms/tabs/dialogs;
- desktop sidebar, mobile header and bottom navigation polish;
- shell spacing and content-width rules;
- confirmation-dialog primitive;
- no gameplay changes.

### 27C — Core player loop
- Dashboard;
- Log Activity/category selection/forms;
- Journal/date navigation;
- save/delete/evidence feedback;
- mobile thumb reach and keyboard flow;
- loading/empty/error states.

### 27D — Personal progress and communication
- Progress;
- Analytics;
- Profile / Legacy Profile;
- Inbox;
- Legacy Coach;
- visual hierarchy and accessible data presentation.

### 27E — Competition workspaces
- Houses;
- Seasons;
- split route presentation into task-focused components/workspaces;
- simplify information hierarchy;
- dedicated captain/vice-captain/admin states;
- preserve all competition services, data and Rules contracts.

### 27F — Admin, reference and support
- Platform Admin;
- Rulebook;
- Points Guide;
- Help;
- Pocket Week / future-feature states;
- standardize dense lists, forms, destructive actions and long-form reading layouts.

### 27G — Performance + full acceptance
- investigate Firebase vendor chunk;
- preserve route lazy loading;
- reduce avoidable shared imports;
- test 320px mobile, representative tablet and desktop;
- keyboard-only pass;
- screen-reader landmark/label/focus pass;
- light/dark contrast review;
- reduced-motion review;
- final loading/empty/error-state pass.

### 27R — Release freeze
- full application tests;
- Firestore Rules regression only if Rules were touched (they should not need to be);
- production build;
- responsive/accessibility acceptance;
- release verification and controlled activation.

## Explicit boundaries

v0.27 is a user-experience release. It should **not** reopen:
- App Check/CSP rollout;
- Google Cloud IAM/PITR/backup automation;
- competition rules;
- scoring architecture;
- Firestore permission redesign.

If a UX improvement requires changing gameplay/security semantics, stop and treat it as a
separate explicitly reviewed change.

## Manual visual acceptance checklist

Static analysis cannot judge final rendering. During 27B–27G, manually review each major route at:
- 320px mobile;
- ~768px tablet;
- ~1366px desktop.

For each route confirm:
- primary task is obvious within a few seconds;
- no horizontal scrolling;
- headings form a sensible hierarchy;
- body/microcopy remains readable;
- touch targets are comfortable;
- keyboard focus is visible and logical;
- menus/dialogs trap and restore focus correctly;
- colour is never the only status signal;
- empty/loading/error states explain what happens next;
- destructive actions are deliberate and recoverable where possible.

## 27A decision

**Proceed to 27B: Design system + application shell foundation.**

This creates the visual/accessibility primitives that every later route will reuse and avoids
polishing pages against a design system that is about to change.
