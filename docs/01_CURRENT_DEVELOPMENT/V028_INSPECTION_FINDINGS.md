# Champions Legacy Challenge - v0.28.0 Inspection Findings

Date: 17 August 2026
Status: Home, Navigation, Log Activity and Progress review captured
Production baseline: v0.27.0
Development branch: development/v0.28.0

## Inspection status

The owner-led inspection is intentionally paused after:
- Global / shared UX
- Home / Dashboard
- Navigation
- Log Activity
- Progress

The following major areas remain for later inspection:
- Seasons
- Houses
- Inbox
- Analytics
- Pocket Week
- Legacy Coach
- Challenge Rulebook
- Points Guide
- Help / Privacy
- Administration
- Profile

The current findings should be implemented and reviewed before continuing the remaining
page-by-page inspection so the review backlog does not become unnecessarily large.

## Global / brand / theme findings

### Deferred brand identity work
- The final Champions Legacy logo is still undecided.
- When the final MBTI identity artwork system exists, the app logo treatment and browser
  tab/favicon may adapt to the player's selected Legacy Profile.
- Do not lock final logo/favicon artwork during the current implementation pass.

### App title treatment
- Display the product name as `CHAMPIONS LEGACY CHALLENGE`.
- Explore theme-colouring `CHAMPIONS` and `CHALLENGE` while preserving readable contrast.
- Keep the title legible in every supported theme.

### Theme-reactive interaction language
- Buttons, segmented controls and workspace tabs should look obviously interactive.
- Add consistent outline/hover/focus/pressed treatment.
- A restrained theme-aware glow may be used where it improves affordance without turning
  the UI into visual noise.
- The same interaction language should be reusable throughout later v0.28 page changes.

### Theme-reactive icons
- Continue the planned neutral SVG/currentColor/CSS-variable/mask direction.
- Do not recolour semantic success/error states, House identity, achievement rarity or
  fixed MBTI identity artwork simply to match the UI theme.

## Home / Dashboard findings

### Champion Transmission
Remove the secondary copy beginning:

`Record the work, learn from the day and keep becoming...`

Champion Transmission should become the clear motivational focal point rather than
competing with another paragraph.

Remove the visible wording `Another transmission` from the transmission-cycle action.
Keep the control/button itself, with an accessible label if its visual treatment becomes
icon-only.

Increase the quote/transmission text size and explore a tasteful theme-aware colour or
accent treatment while retaining strong contrast.

### MBTI-aware Champion Transmission
Plan an optional MBTI-aware message layer:
- different message pools may emphasize motivational styles likely to resonate with
  different Legacy Profiles;
- MBTI must remain a preference cue, not a deterministic statement about a person;
- generic Champion Transmissions should remain available as fallback;
- avoid patronising or stereotyping language.

This can be implemented as reusable message metadata rather than hard-coded page logic.

### Dashboard Legacy Profile avatar
Fix the Home/Dashboard player portrait/avatar so the currently selected MBTI Legacy
Profile identity is reflected consistently.

The existing profile fallback behavior should remain safe for players who have not
selected an MBTI identity.

### Quick Actions
Replace the plain left-side arrows with a stronger action affordance.

Preferred direction:
- theme-reactive icon or compact crest;
- clear hover/focus movement or elevation;
- retain straightforward scanning and touch targets;
- avoid decorative complexity that makes the action harder to recognise.

### Today's Goals Daily / Weekly controls
The Daily and Weekly selectors do not currently read clearly enough as interactive
controls.

Improve:
- outline/border treatment;
- active state;
- hover/focus state;
- optional restrained theme glow;
- mobile/touch clarity.

### Personal Progression
The current Experience Points display does not immediately communicate progress toward
the next level.

Show progression visually without adding unnecessary copy, for example:
- incomplete horizontal progress bar;
- progress ring;
- percentage or equivalent compact progress cue.

The player should understand at a glance that this is progress toward the next level.

## Navigation findings

### Desktop stat labels
Shorten:
- `day streak` -> `streak`
- `level` -> `level`
- `total points` -> `points`

Explore theme-aware stat text/accent colour while retaining accessible contrast.

### Mobile navigation
Review the current mobile destination set.

Houses and Seasons are currently missing from the mobile navigation experience. Restore
important competition access without simply overcrowding the mobile bar.

Acceptable patterns include:
- a carefully chosen expanded set if it remains usable;
- a compact `More`/competition destination;
- another accessible mobile navigation pattern.

The final choice should prioritize discoverability, touch size and low cognitive load.

## Log Activity findings

### Today / Yesterday selection
Players should be able to choose the challenge date directly from the Log Activity
workspace.

For the current product rule, provide a simple choice:
- Today
- Yesterday

The player should not need to visit Journal merely to change the date being logged.

Use the existing challenge-date services and local calendar semantics rather than
inventing a second date model.

### Honesty reminder
Add a short funny, slightly provocative reminder near the top of the Log Activity
experience.

Intent:
- encourage factual logging;
- remind players that uncertain entries should be confirmed with an administrator;
- playful rather than accusatory;
- concise enough not to become repetitive friction.

Avoid language that directly labels the player dishonest.

### Action Centre layout
Move the visible `1 / 2 / 3` step indicator inside the Action Centre visual
container/outline so the workflow reads as one cleaner composition.

### Replace weak explanatory copy
Replace:

`Record the facts once, then let Champions Legacy Challenge calculate points, goals,
experience points and progress centrally.`

with shorter, more energetic Champions Legacy copy.

Preferred tone:
- direct;
- confident;
- factual;
- less corporate;
- still explains that the player logs facts and the app handles scoring.

### Mobile
The current mobile Log Activity experience appears clean. Preserve that quality and run
a responsive verification after the desktop changes.

## Progress findings

### Desktop layout cleanup
The desktop Progress page currently feels untidy.

Fix:
- overlapping text;
- tab borders/alignment;
- spacing and hierarchy;
- selected/hover/focus tab treatment;
- responsive transition from desktop to mobile.

Do not regress the mobile layout, which currently appears acceptable.

## Achievement expansion

### Core rule
Achievements must remain straightforward to track and award from existing or sensibly
derivable data.

Do not add novelty achievements that require invasive analytics or complicated event
instrumentation solely for a joke.

### Visible and hidden achievements
Support both:
- visible achievements with explicit requirements;
- hidden achievements that reveal themselves when earned.

Hidden achievements should remain fair and reproducible.

### Category-specific ladders
Every activity category should receive a meaningful milestone ladder.

Running example:
- first 1 km;
- 3 km;
- 5 km;
- 10 km;
- 15 km;
- 20 km;
- half marathon;
- marathon;
- ultra-marathon milestone(s).

Other categories should receive equivalent milestones based on their natural units and
behavior rather than copying running distances mechanically.

### Easter eggs
Funny/easter-egg achievements are welcome when they are easy and reliable to track.

Example idea:
- triggering/reading many validation errors in Log Activity.

Only implement an idea like this if the required event is already safely observable or
can be made observable with trivial low-risk state. Otherwise omit it.

### Achievement XP
Every achievement should award Experience Points based on difficulty.

Difficulty tiers should be explicit/configured so the XP system remains maintainable.

## Levels and Experience Points

### Long-term progression target
Expand the level system substantially.

Requirements:
- progressively increasing XP required for each new level;
- highest level should represent roughly ten years of genuine consistent use;
- one impressive single activity should never instantly trivialize the long-term level
  journey;
- an ultra-marathon should provide a major achievement reward but should not itself grant
  anything close to maximum level.

The user's "ultra-marathon roughly halfway" statement is a balancing intuition rather
than a literal single-event requirement. The final curve should protect long-term
progression while still making exceptional accomplishments feel meaningful.

### Level titles
Every level or level band should have fun, intelligently escalating titles.

Titles should feel increasingly prestigious without becoming absurd too early.

### Progress ordering
Prioritize:
1. active/in-progress achievements;
2. available achievements;
3. completed achievements.

Completed achievements may live in:
- a separate section;
- collapsed section;
- filter;
- lower page region.

Do not let already-completed items dominate the player's current goals.

## Implementation grouping

### Checkpoint 28D1 - shared interaction + Home + Navigation + Log Activity - IMPLEMENTED / OWNER REVIEW PENDING
Implement:
- reusable interactive button/tab treatment;
- all-caps brand title treatment;
- Home Champion Transmission cleanup;
- larger/theme-aware transmission presentation;
- Dashboard MBTI avatar correction;
- improved Quick Actions affordance;
- clearer Daily/Weekly controls;
- clearer Personal Progression visual;
- shortened desktop navigation stats;
- mobile Houses/Seasons navigation solution;
- Today/Yesterday logging selector;
- honesty reminder;
- Action Centre step-indicator cleanup;
- stronger Log Activity explanatory copy;
- responsive verification.

Implemented outcome:
- package version is 0.28.0;
- reusable theme-neutral currentColor SVG icons are available for high-frequency UI;
- Champion Transmission is simplified, larger and gently MBTI-aware without deterministic personality claims;
- Dashboard uses the MBTI-aware PlayerAvatar;
- Quick Actions, goal-period controls and XP progress have clearer affordances;
- desktop/mobile shell changes and direct mobile competition access are implemented;
- Log Activity now supports direct Today/Yesterday selection and the accepted Action Centre/copy cleanup;
- owner review then refined that layout: Today/Yesterday are compact controls inside the Choose your focus / Log an activity card header, while the Keep the legend real honesty reminder replaces the page-header explanatory copy.

Explicitly deferred:
- final logo artwork;
- final MBTI-dependent favicon/logo assets.

Owner review continued through 28D1A and the implementation was accepted before moving to 28D2.

### Checkpoint 28D2 - Progression expansion - IMPLEMENTED / ACCEPTED
Implemented:
- Progress desktop workspace tabs use explicit five/three/two-column layouts before the existing mobile select;
- 86 deterministic achievements are defined through reusable metadata and metric types;
- 10 achievements are hidden until earned;
- every achievement awards configured personal XP through Starter/Bronze/Silver/Gold/Epic/Legendary tiers, with bounded exceptional rewards for marathon/ultra milestones;
- every activity category has a natural milestone ladder, with a separate completed-books ladder for Reading;
- Running milestones include 1 km through marathon plus 50 km and hidden 100 km ultra distances;
- only the next visible locked achievement in each family is surfaced, ordered with active/in-progress goals first;
- completed achievements are kept in a collapsed section;
- achievement XP feeds personal level progression and timeline events but never competitive points;
- Level 100 begins at 354,420 lifetime XP and is explicitly capped;
- title bands scale from Initiate through Living Legend;
- detailed balance and milestone configuration is recorded in `V028_PROGRESSION_EXPANSION.md`;
- responsive/mobile quality remains part of owner acceptance.

### 28D2A / 28D2B owner-review refinement — ACCEPTED
- Progress introduction copy is now more motivational and the redundant Analytics shortcut is removed;
- the public Progress UI does not reveal the maximum level or future locked level-title milestones;
- the current level uses a circular percentage ring that must remain circular and scale cleanly at every supported width;
- desktop workspace tabs retain their icon and title only; descriptions and numeric badges are intentionally omitted;
- the tab layout steps down before mobile, where the existing labelled select remains authoritative;
- shared narrow-mobile shell spacing and safe-area handling receive a bounded responsive polish rather than broad page redesign.

### Checkpoint 28D3 - reviewed surfaces + Seasons polish - IMPLEMENTED / OWNER REVIEW PENDING
- Dashboard Progression is intentionally reduced to level/title, XP progress, current streak and one featured achievement;
- Champion Transmission remains intact while its ordinary-phone layout is less vertically wasteful;
- generic navigation moves to reusable currentColor SVG symbols and More-menu groups are simplified without changing routes or authority;
- Log Activity workspace and category instructions are de-duplicated while its accepted 1/2/3 flow, honesty message and Today/Yesterday controls remain;
- the accepted Progress hero owns the next-level percentage and the Overview Experience card no longer repeats it;
- Seasons uses stronger competition-focused copy, icon + title workspace tabs, a Season roster with dates/status/membership, cleaner hero actions and role-aware player/manager/viewer context;
- current House/rank/points/Power Play state is prioritised for participants, while managers retain operational context;
- season overview cards expose current House/Pocket/Power Play/Standings state;
- raw scoring-engine and rules-version identifiers are hidden from ordinary players but remain available to season managers;
- malformed draft-deletion ellipsis is corrected;
- detailed scope is recorded in `V028_REVIEWED_SURFACES_SEASONS_POLISH.md`;
- broad layered CSS consolidation remains deferred to v0.31.0.

### Checkpoint 28D3A - Seasons workspace cleanup - IMPLEMENTED / OWNER REVIEW PENDING
- the first 28D3 Seasons pass was reopened after a real draft season exposed excessive Browse/detail density;
- Browse is now a selection surface and a chosen season becomes a focused workspace;
- Command Centre, Power Plays and Evidence use progressive disclosure instead of rendering every operational surface at once;
- Standings uses an Individual/Houses switch and Honours separates award families;
- Create Season receives a four-stage visual roadmap without data-model changes;
- all competition rules, evidence authority, lifecycle semantics and Firestore Rules remain unchanged;
- Houses stays paused until Seasons receives explicit owner acceptance.

### Checkpoint 28D4 - Houses identity & workspace polish - IMPLEMENTED / OWNER REVIEW PENDING
- 24 paired House colour palettes replace the former 8-colour library;
- 56 emblems expand seasonal identity choice;
- selecting a House applies its palette only inside the Houses route;
- the player's House is prioritised, selected identity is stronger and leadership presentation is clearer;
- House workspace tabs use icon + title only;
- context copy, historical wording, spacing and responsive structure are cleaned up;
- C.H.A.O.S., House movement, leadership, scoring, balance and Rules behaviour remain unchanged;
- minor cosmetic perfection is intentionally deferred to v0.31 so the remaining page inspection can move faster.

## Acceptance boundary before inspection resumes

28D1 and 28D2 are implemented and owner-accepted. 28D3 must now receive its
visual/responsive owner review; once accepted, the remaining page inspection resumes
with Houses.

### Checkpoint 28D4A - portable House emblems - IMPLEMENTED / OWNER REVIEW PENDING
- owner review found some emoji-based House emblems broken or invisible;
- all 56 visible emblems now use deterministic app-owned currentColor SVG artwork;
- stored House emblem IDs remain unchanged and require no migration;
- final acceptance needs only a fast scan of the emblem picker/preview/banner.

### Checkpoint 28D4B - professional icon system - IMPLEMENTED / OWNER REVIEW PENDING
- temporary hand-authored House SVGs were visually rejected during owner review;
- Phosphor React 2.1.10 is now the professional icon source for the shared ThemeIcon API and all 56 House emblem IDs;
- House emblems use duotone currentColor rendering so identity palettes remain intact;
- stored House identity data and all competition behaviour remain unchanged.

### Checkpoint 28D4C - full-colour House emblems - IMPLEMENTED / OWNER REVIEW PENDING
- owner review rejected both temporary hand-drawn line emblems and monochrome Phosphor House symbols;
- House emblems now use locally bundled, naturally coloured Microsoft Fluent Emoji 3D PNG artwork;
- House palette identity is expressed by the surrounding crest/frame/halo instead of recolouring the emblem pixels;
- Phosphor remains the ordinary UI icon system;
- stored House identity and all competition behaviour remain unchanged.
