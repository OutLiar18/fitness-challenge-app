# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: VERIFIED_PRODUCTION -->
Source version: 0.28.0 development
Production version: 0.27.0
Last updated: 18 August 2026
Status: v0.28 page inspection and change pass active; full season rehearsal deferred to v0.30.0

## Production baseline

v0.27.0 is live and verified on Firebase Hosting. The exact deployed/tagged source is `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`; live/local `index.html` SHA-256 is `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`; Firestore Rules were not redeployed and remain SHA-256 `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`. Production release evidence is recorded in `docs/07_HISTORY/V0270_PRODUCTION_RELEASE.md`.

## v0.25.0 development scope

The competition roadmap has been simplified. Five Fires and Buddy Bonuses are removed. v0.25.0 is focused on existing-app correctness, MBTI-based player profiles, safe administrator deletion/recovery semantics and League Season bonus-point administration.

### Checkpoint 25A — existing-app correctness foundations — complete
- route/navigation changes return the page to the top;
- `Log activity` no longer receives a permanent green accent when inactive;
- the shell lifetime score is explicitly labelled `total points`;
- Champion Transmission is integrated into the welcome area with a prominent message-cycle action;
- the motivational library is expanded;
- the redundant four-stat Dashboard summary is removed;
- the Profile PageHeader no longer renders a redundant identity icon block;
- all touched layouts retain responsive breakpoints.

### Checkpoint 25B — MBTI Legacy Profiles — complete
- 16 local MBTI-based Legacy Profiles replace generic avatar selection as the primary player identity experience;
- players may select a known type directly;
- unsure players may take a 12-question quick estimate using three questions per E/I, S/N, T/F and J/P dimension;
- the estimate shows answer leans and suggests a type, but the player must choose the final profile;
- players may open the current 16Personalities free test externally and return to select their result;
- profile guidance includes strengths, watch-outs, Challenge approaches and potentially complementary profiles with explicit non-deterministic wording;
- only optional `mbtiType` is added to the player document; questions, scoring, guidance and emblem artwork remain local frontend code;
- legacy avatar data remains available for backwards compatibility until a player chooses an MBTI profile;
- responsive layouts are included for profile selection and the quick-test flow.

25B changes Firestore Rules only to permit and validate the optional player-owned `mbtiType` field. It does not change scoring, league permissions, evidence authority, House history or production Firebase state.

### Checkpoint 25C — safe deletion/recovery — complete
- only Platform Administrators receive browser hard-delete controls;
- an empty House may be deleted only inside an unused zero-participant draft season;
- an unused draft season deletion atomically removes its draft Houses and invitation record and creates an immutable audit event;
- League Administrators cannot hard-delete Houses or seasons;
- registration, active, completed and archived seasons remain protected historical structures;
- player Authentication deletion stays in the trusted Admin SDK workflow and preserves/anonymises competition facts where required.

### Checkpoint 25D — League Season bonus points — complete
- Platform Administrators can award directly with a mandatory reason;
- League Administrators can submit scoped requests only, with Platform review required before standings change;
- pending League Administrator requests surface as Platform Admin Inbox attention and in the season review workspace;
- every awarded point is written through the immutable contribution ledger and credited equally to the player and the House captured at award/approval time;
- League Season bonus points bypass ordinary activity caps, participation bonuses and Power Play multipliers and do not create category champion titles;
- corrections are separate positive/negative adjustments that preserve the original award's House attribution.

### Checkpoint 25R — release-readiness freeze — complete
- the completed 25A–25D application source is frozen at commit `0f5b715e4888d12ddc53ede334a9cfe13c5e2048`;
- the v0.25 release verifier now requires 148 application tests and 94 Firestore Rules tests;
- all application/Rules source outside release documentation and the verifier must remain identical to the frozen 25D baseline;
- production deploy scripts remain blocked and 25R performs no Firebase activation.

### Production activation — complete
- exact deployed application source: `1e11f5ff8ca5af7e9d758f62b9d377e1c6ddd94d`;
- active Cloud Firestore Ruleset: `projects/fitnesschallengeapp-9e87f/rulesets/9e476b71-9b9b-4b05-bedd-5bc3b1932d2d`;
- canonical local and active Rules SHA-256: `17217b471feb4f7e2db3df72b9456cc64e1451eb2c529228490b6ef8e47f376e`;
- Firebase Hosting target `app` released 66 files to `champions-legacy-challenge`;
- live `index.html` SHA-256 `e40e19fbf102ab066a4394604d8c108f437d85032e8aafbb8be5d0f75c06571a` matched the frozen build;
- 16 referenced live assets matched the frozen build and 10/10 critical SPA routes passed;
- logged-in manual production smoke passed on 10 August 2026 with no unnecessary competition test data created.

### v0.26.0 — security and operational hardening

#### Checkpoint 26A — security baseline
- create `development/v0.26.0` from finalised v0.25 `main`;
- preserve v0.25.0 as the production baseline;
- inventory administrator authority and role sources without changing them;
- inventory public/private Firestore reads and retain the deny-all fallback;
- record Rules size/complexity signals before simplification;
- check whether App Check/client attestation is integrated, but do not enable enforcement yet;
- capture dependency advisories and outdated-package information without automatic fixes;
- review trusted account-deletion/recovery safeguards and partial-failure exposure;
- inventory Hosting security headers and deployment protections;
- run the existing application + Firestore Rules gates;
- perform no Firebase deployment.

#### Checkpoint 26B — canonical Platform Administrator authority
- Firestore `users/{uid}.role == "admin"` is the single Platform Administrator authority source;
- stale or legacy Firebase Auth `admin:true` custom claims do not grant Platform Administrator access;
- client UI gating uses the same trusted profile-role contract as Firestore Rules;
- the full Rules suite exercises profile-role administration without relying on an admin custom claim;
- audited Platform Administrator role changes remain supported for other users;
- self-role changes remain denied;
- existing v0.25 production remains unchanged until a later dedicated v0.26 release activation.

#### Checkpoint 26C — League Administrator scope contract
- global `leagueAdmin` profile status remains a bounded bootstrap capability for creating a new league and its matching invite;
- the creator must become the new league's sole initial administrator;
- existing-league operational authority remains scoped through that league's `administratorIds`;
- a global League Administrator cannot read another administrator's private draft solely because of the global role;
- a global League Administrator cannot self-assign into another league;
- Firestore Rules are unchanged from 26B and the canonical 26B Rules hash remains frozen locally;
- no Firebase deployment.

#### Checkpoint 26D — development dependency advisory remediation
- production dependency vulnerabilities remain at zero;
- compatible remediation was generated outside the real repository with `npm audit fix --package-lock-only` and no `--force`;
- direct dependency specifications remain unchanged;
- the candidate lockfile was installed/tested from scratch in a detached worktree before acceptance;
- 1 of 7 development/tooling advisories were cleared; 6 lower-severity advisories remain documented;
- Firestore Rules remain unchanged from 26B/26C;
- no Firebase deployment.

#### Deferred infrastructure — App Check/CSP
- App Check enforcement and an explicit CSP are not required for the current friends-scale challenge;
- the 26E research remains available in Git history if the app later becomes public at materially larger scale;
- active App Check/CSP readiness tooling is removed in 26I;
- existing low-cost Hosting security headers remain in place;
- no Firebase deployment.

#### Checkpoint 26F — trusted account-deletion interruption recovery
- every new trusted deletion writes a private local recovery plan before Firebase mutation begins;
- the recovery plan freezes the exact planned document path/mode set, original fingerprint, identities, counts and league participant decrements;
- the execution record stores the recovery-plan version, SHA-256, operation count, phase and batch progress;
- a processing/failed execution can resume only when the original recovery plan validates against the request and execution record;
- already-deleted records and same-execution anonymised records are replay-safe;
- missing anonymisation targets or records stamped by another execution fail closed;
- Auth disable/token revocation remain before Firestore mutation and Auth deletion remains after Firestore completion;
- no trusted deletion is executed by the checkpoint runner;
- Firestore Rules remain unchanged;
- no Firebase deployment.

#### Deferred infrastructure — advanced Firestore disaster recovery
- Google Cloud CLI/IAM/PITR/backup-schedule inventory and automated restore planning are deferred until scale or real operational need justifies them;
- the 26G research remains recoverable from Git history;
- active Firestore recovery planner/test tooling is removed in 26I;
- account-deletion recovery remains because account deletion is a real app workflow;
- no restore, backup configuration change or Firebase deployment.

#### Checkpoint 26I — practical security + Rules simplification
- remove redundant explicit deny blocks for retired permanent Teams; the recursive deny-all fallback continues to reject those paths;
- fully retire the old evidence-reviewer collection from client Rules, also relying on recursive deny-all;
- replace two one-line league-read aliases with the existing league-scoped administrator helper;
- remove active App Check/CSP readiness and advanced Firestore recovery-planner artifacts from the working repo;
- preserve Platform Admin authority, League Admin scoping, evidence decisions, Houses, movement/rest, Power Plays, bonus points and trusted account-deletion safety;
- run the complete application and Firestore Rules regression gates;
- perform no Firebase deployment.

#### Checkpoint 26R — v0.26 release-readiness freeze
- freeze application/security source at completed 26I commit `909fe8938237c70b69aab1d72a2fef9ee2780e37`;
- pin Firestore Rules SHA-256 `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`;
- require the complete application/build gate and all 98 Firestore Rules tests;
- allow only release documentation and the release verifier to differ from 26I before activation;
- keep development deployment scripts blocked;
- perform no Firebase deployment.

#### v0.26.0 production activation — COMPLETE
- exact deployed/tagged commit: `c057fca0598fe4a07ff101ea13808f1da8918aa8`;
- Firestore Rules SHA-256: `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`;
- Firestore Rules deployment: successful;
- Hosting target `app` → site `champions-legacy-challenge`: successful;
- live verification: 10/10 SPA routes and 16/16 referenced assets matched the exact local build;
- working tree remained clean;
- advanced App Check/CSP and Google Cloud disaster-recovery infrastructure remain deferred until scale requires them.

### v0.27.0 — UX/accessibility/performance
#### Checkpoint 27A — full application audit — COMPLETE
- inventory route/page/component/CSS complexity without changing application behaviour;
- preserve route-level lazy loading and existing accessibility foundations;
- identify readability/design-system consistency as the first shared concern;
- prioritize the Dashboard → Log Activity → Journal loop before lower-frequency screens;
- identify Houses and Seasons as the largest presentation workspaces and plan task-focused decomposition;
- keep the Firebase vendor chunk warning for a focused 27G performance pass;
- record the complete prioritized plan in `V027_UX_AUDIT.md`;
- perform no Firebase deployment.

#### Checkpoint 27B — design system + application shell — COMPLETE
- advance the application package version to 0.27.0;
- replace the former blue-led token set with the approved black/charcoal + dark-blood-red Champions Legacy identity in both system light and dark modes;
- separate readable primary accents from primary control colours so dark-mode text and button contrast remain strong;
- standardise shared cards, buttons, form focus/help states, PageHeader and WorkspaceTabs;
- polish desktop sidebar, tablet rail, mobile header, bottom navigation and More surfaces without changing routing/role logic;
- raise the smallest primary shell/nav microcopy identified by 27A;
- preserve skip navigation, focus trapping/restoration, reduced-motion handling and route-level lazy loading;
- add persistent v0.27 design-system regression coverage;
- keep Firestore Rules byte-for-byte unchanged and perform no Firebase deployment.

#### Checkpoint 27C — Dashboard → Log Activity → Journal — COMPLETE
- prioritize daily/weekly goals before lower-frequency progression/insight content on Dashboard;
- expose a direct Dashboard → Journal quick action;
- persist Log/Journal workspace state in the URL for direct links, refresh and browser navigation;
- replace Activity Log browser `window.confirm` deletion with a reusable accessible alert dialog;
- move focus to entry validation errors when save validation fails;
- add a concise Choose → Record → Review guide without changing entry save/evidence behavior;
- add a Today empty-state Journal CTA back to Log Activity;
- replace implementation-oriented Journal pagination copy with player-facing guidance;
- strengthen touch/readability treatment for category selection, entry form, Journal navigation/history and editable entry actions;
- add persistent 27C core-journey regression coverage;
- keep Firestore Rules byte-for-byte unchanged and perform no Firebase deployment.

#### Checkpoint 27D — Progress / Analytics / Profile / Inbox / Legacy Coach — COMPLETE
- persist personal workspace sections in the URL for direct links, refresh and browser navigation;
- persist non-default Analytics range in the URL;
- add Analytics and Profile loading states using the shared PageLoader;
- replace Analytics weekly role="img" chart semantics with labelled list/listitem data so visible values remain accessible;
- give Analytics and Progress useful no-data/recovery states with direct Log activity actions;
- focus Profile save/validation errors and expose profile/coach saving state;
- replace bespoke Inbox tabs with the shared keyboard-accessible WorkspaceTabs/WorkspacePanel pattern while preserving read/unread and URL behavior;
- make Legacy Coach preference controls stable while saving and expose a clear zero-recommendation state;
- strengthen small-text/touch/readability treatment across all five pages;
- add persistent 27D regression coverage;
- keep Firestore Rules byte-for-byte unchanged and perform no Firebase deployment.

#### Checkpoint 27E — Houses / Seasons competition workspaces — COMPLETE
- persist selected House and House workspace state in the URL;
- persist Seasons Browse/Join/Create workspace and season-detail workspace in the URL;
- remove duplicate local season-detail tab state so URL presentation state is authoritative;
- extract House card/roster and season standings presentation from the oversized route modules;
- introduce a shared CompetitionWorkspaceSummary with role/context metrics and direct task shortcuts;
- replace remaining Houses/Seasons browser confirm/prompt flows with the accessible ConfirmDialog;
- retain typed `DELETE` confirmation for permanent unused draft-season deletion;
- strengthen competition metadata readability, 46px action targets and mobile action stacking;
- preserve C.H.A.O.S., leadership, movement/rest, assignment history, balance, Power Plays, evidence, bonuses, lifecycle, standings, honours and every Firestore Rules/service contract;
- add persistent 27E regression coverage;
- keep Firestore Rules byte-for-byte unchanged and perform no Firebase deployment.

#### Checkpoint 27F — Admin / Rulebook / Points Guide / Help / Pocket / future states — COMPLETE
- URL-back Platform Admin, Points Guide, Help and Pocket workspaces;
- URL-back Rulebook search text and non-default status filtering;
- add clear-filter recovery and current House terminology to Rulebook search;
- confirm audited trusted-role changes through the shared accessible ConfirmDialog while preserving authority/service semantics;
- focus Help restart/account-tool failures and expose account-tool busy state;
- strengthen dense admin controls, Rulebook/Points long-form readability, Pocket controls and support/reference microcopy/touch targets;
- make future-feature states explicitly Preview only with a Dashboard return path;
- add persistent 27F regression coverage;
- keep Firestore Rules byte-for-byte unchanged and perform no Firebase deployment.

#### Checkpoint 27G — automated performance + acceptance gate — COMPLETE
- partition the existing Firebase vendor manual group with a 360 KiB Rolldown max-size target rather than rewriting Firebase architecture;
- preserve Firebase modular imports and route-level React lazy loading;
- add `accept:v027` to the normal application check after the production build;
- fail the automated gate if any JavaScript chunk exceeds 500 KiB or the Firebase vendor group remains one monolithic chunk;
- verify the 320px global width floor, focus-visible, dark-mode and reduced-motion foundations;
- verify key light/dark text/control token pairs meet WCAG AA normal-text contrast;
- verify shell, WorkspaceTabs and ConfirmDialog keyboard/modal foundations;
- reject browser-native confirm/prompt flows in page/component JSX;
- generate an automated acceptance report from the actual production build;
- keep Firestore Rules byte-for-byte unchanged and perform no Firebase deployment.

#### 27G manual acceptance remediation — COMPLETE / ACCEPTED
- strengthen the shared light/dark palette from muted burgundy/pink-red to a higher-contrast saturated crimson + near-black Champions Legacy identity;
- replace the Dashboard Welcome Card's remaining legacy blue gradient and blue transmission surface with the crimson-black warrior treatment;
- replace the authentication hero's retired blue gradient with the same crimson-black warrior identity;
- replace Daily Progress's red-to-blue fill with a crimson-only progression treatment;
- preserve scroll position when only URL query-string workspace/tab state changes while retaining top reset for real pathname/page navigation;
- add regression coverage for the Welcome Card palette and same-page URL-tab scrolling contract;
- preserve scoring, competition, Firebase behavior and Firestore Rules;
- authenticated manual matrix accepted on 11 August 2026; 27G is complete.

#### Checkpoint 27R — release freeze — COMPLETE
- frozen accepted runtime/application source: `ad92777cfa86481002639297ce8c7dce69b0e269`;
- exact release/deployed commit: `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`;
- 188/188 application tests, production build, 27G acceptance and 27R verifier passed;
- Firestore Rules remained byte-for-byte unchanged at SHA-256 `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`.

#### v0.27.0 production activation — COMPLETE
- Hosting target `app` deployed successfully to `champions-legacy-challenge`;
- preview and live integrity verification both passed 10/10 SPA routes, 25/25 referenced assets and 4/4 security headers;
- live/local `index.html` SHA-256 matched `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`;
- Firestore Rules were not deployed;
- final local post-live verification passed with a clean tree;
- authenticated production smoke accepted on 12 August 2026;
- tag `v0.27.0` points to exact deployed commit `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`.

### v0.28.0 — page inspection and change pass
#### Checkpoint 28A — initial rehearsal contract — COMPLETE / DEFERRED
- the original 28A planning work was documentation-only and changed no application behavior;
- that rehearsal scope is no longer active v0.28 work;
- the full rehearsal plan is moved forward to `V030_REHEARSAL_PLAN.md`.

#### Checkpoint 28B — scope reset to page inspection — COMPLETE
- confirms that v0.28.0 is the owner-led page-by-page inspection and change pass;
- creates `V028_PAGE_INSPECTION_PLAN.md` as the active working checklist;
- defers the complete league-season rehearsal to v0.30.0;
- places friend/external feedback work in v0.29.0;
- places cleanup/polish/hardening work in v0.31.0;
- keeps Firestore Rules, Firebase deployment surface and application runtime behavior unchanged.

#### Checkpoint 28C — first page inspection findings capture — COMPLETE
- pause the inspection after Global/Home/Navigation/Log Activity/Progress to avoid building an oversized backlog;
- record the detailed owner-requested changes in `V028_INSPECTION_FINDINGS.md`;
- preserve the theme-reactive asset rule and future MBTI-dependent brand treatment;
- define 28D1 for shared interaction/Home/Navigation/Log Activity;
- define 28D2 for Progress cleanup plus achievements/levels expansion;
- keep final logo/favicon artwork deferred until the logo/identity assets are decided;
- keep Firestore Rules and production Firebase untouched.

#### Checkpoint 28D1 — shared interaction + Home + Navigation + Log Activity — IMPLEMENTED
- package version advances to 0.28.0;
- reusable currentColor SVG icons begin the theme-reactive UI asset foundation;
- shared buttons and high-frequency controls gain clearer theme-aware hover/focus affordance;
- Dashboard Champion Transmission becomes the sole hero motivation, uses larger quote treatment and an icon-only cycle control;
- Champion Transmission now uses the selected MBTI type as a gentle preference cue for deterministic rotation and profile-specific side quests, while retaining generic fallback;
- Dashboard identity now uses the MBTI-aware PlayerAvatar;
- Quick Actions replace character arrows with reusable vector symbols;
- Daily/Weekly goal controls are visually stronger;
- Dashboard XP progress now shows a clear fraction and percentage;
- desktop shell labels shorten to Streak / Level / Points and the brand is rendered as CHAMPIONS LEGACY CHALLENGE with theme accents;
- mobile navigation exposes Seasons and Houses directly while Inbox remains available through More with attention state;
- Log Activity exposes Today/Yesterday directly, moves the 1/2/3 guide into Action Centre, adds an honesty reminder and stronger explanatory copy;
- 28D1A owner-review correction moves the compact Today/Yesterday controls into the Choose your focus / Log an activity card header and promotes the honesty reminder into the page header, removing the redundant standalone toolbar;
- final logo artwork and MBTI-dependent favicon/logo remain deferred;
- Firestore Rules are unchanged and no Firebase deployment occurs.

#### Checkpoint 28D2 — Progress and progression expansion — IMPLEMENTED / ACCEPTED
- Progress desktop workspace tabs now use deliberate wide/medium layouts before the existing mobile select takes over;
- the achievement catalogue expands to 86 deterministic milestones with 10 hidden achievements;
- every achievement has an explicit requirement, difficulty tier and XP reward;
- Water, Fruit, Reading, completed books, Running, Upper Body, Lower Body, Core, Cardio, Skill Development and Steps all have natural milestone ladders;
- Running includes 1/3/5/10/15/20 km, half marathon, marathon, 50 km ultra and a hidden 100 km milestone;
- only the next visible locked milestone per family is shown, with in-progress milestones first;
- completed achievements live in a collapsed section so they do not dominate current goals;
- achievement XP is personal progression only and never changes competitive points;
- the level system expands to a capped Level 100 curve requiring 354,420 lifetime XP to begin Level 100;
- title bands scale from Initiate through Living Legend;
- the progression timeline surfaces achievement XP and derived level-ups;
- detailed configuration is recorded in `V028_PROGRESSION_EXPANSION.md`;
- Firestore Rules remain unchanged and no Firebase deployment occurs.

#### Checkpoint 28D2A / 28D2B — Progress owner-review refinements — IMPLEMENTED / ACCEPTED
- 28D2A replaces the weak Progress introduction, removes the Analytics shortcut, keeps the level cap undisclosed and limits Level Journey to already-unlocked titles;
- 28D2B fixes the circular current-level indicator so it stays square and scales through desktop, tablet and narrow mobile widths;
- desktop Progress tabs now retain their icons and visible titles only — Overview, Achievements, Records, Timeline and Level Journey — without descriptions or count badges;
- the Progress tab grid steps from five columns to three and then two before the existing mobile select takes over;
- narrow mobile shell padding, navigation labels and safe-area handling receive a bounded shared polish without changing navigation destinations;
- Firestore Rules remain unchanged and no Firebase deployment occurs.

#### Checkpoint 28D3 — reviewed surfaces + Seasons polish — IMPLEMENTED / OWNER REVIEW PENDING
- Dashboard Personal Progression is reduced to a focused level/streak/next-achievement preview rather than duplicating the Progress page;
- Champion Transmission keeps its content while ordinary phone widths retain the compact two-column Side Quest / Coach layout;
- generic navigation uses reusable currentColor SVG symbols and the More menu is simplified into clearer task groups;
- Log Activity keeps its titles, Today/Yesterday selector and honesty message while removing duplicate instructional subtitles;
- the accepted Progress hero is the sole visual owner of next-level percentage, while the Overview keeps XP amounts and breakdowns;
- Seasons is reframed as the competition arena with stronger copy, cleaner icon + title tabs, a truthful Season roster, richer season cards, role-aware competition context and live system-state cards;
- ordinary players no longer see raw scoring/rules version identifiers; managers retain that diagnostic detail;
- broad layered-CSS consolidation remains explicitly deferred to v0.31.0;
- detailed scope is recorded in `V028_REVIEWED_SURFACES_SEASONS_POLISH.md`;
- Firestore Rules remain unchanged and no Firebase deployment occurs.

#### Checkpoint 28D3A — Seasons workspace cleanup — IMPLEMENTED / OWNER REVIEW PENDING
- Browse no longer auto-opens a season or stacks a full season workspace underneath the roster;
- choosing a season enters a focused detail view with a Back to seasons control;
- Overview owns one Season at a glance summary instead of the always-visible CompetitionWorkspaceSummary;
- Command Centre keeps health, metrics and required actions visible while secondary tools/history use progressive disclosure;
- Power Play setup uses a compact list with one editor open at a time;
- Standings switches between Individual and Houses instead of stacking both leaderboards;
- Honours separates Individual and House presentation and hides assignment detail behind disclosure;
- Evidence prioritises publication/working queue and collapses explanatory boundary copy;
- Create Season presents a four-stage visual roadmap without changing saved data;
- shared ThemeIcon gains season-workspace symbols;
- detailed scope is recorded in `V028_SEASONS_WORKSPACE_CLEANUP.md`;
- Firestore Rules remain unchanged and no Firebase deployment occurs.

#### Checkpoint 28D4 — Houses identity & workspace polish — IMPLEMENTED / OWNER REVIEW PENDING
- House colours expand from 8 to 24 paired palettes;
- House emblems expand from 32 to 56 curated choices;
- the selected House colour becomes a Houses-route-only theme and never changes the global application theme;
- the player's current House is sorted first and clearly marked;
- House cards, the selected banner and the roster have stronger identity and leadership hierarchy;
- workspace tabs use icon + title only and generic operational emoji are replaced with ThemeIcon symbols;
- House context is role-aware and duplicate summary navigation actions are removed;
- Historical Integrity copy is simplified and the malformed draft-House loading ellipsis is corrected;
- layout, spacing and responsive transitions are polished without changing House mechanics;
- C.H.A.O.S., leadership, roster movement/rest, scoring, balance logic and Firestore Rules remain unchanged;
- the evidence-proof UX follow-up remains separate and is not mixed into this checkpoint;
- detailed scope is recorded in `V028_HOUSES_IDENTITY_POLISH.md`;
- no Firebase deployment occurs.

#### Checkpoint 28D4A — portable House emblems — IMPLEMENTED / OWNER REVIEW PENDING
- all 56 House emblem IDs now render through app-owned currentColor inline SVG artwork;
- visible House identity no longer depends on operating-system emoji glyph support;
- stored emblem IDs and House documents remain unchanged, so no migration is required;
- House palette colours naturally tint the vector artwork;
- competition mechanics, House rules, Firestore Rules and deployment state remain unchanged;
- detailed scope is recorded in `V028_PORTABLE_HOUSE_EMBLEMS.md`.

### Next action
Perform one fast visual pass over the full House emblem picker and selected House banner. If all emblems render, accept Houses and continue immediately to Inbox. Minor icon-art refinement can wait for v0.31.
