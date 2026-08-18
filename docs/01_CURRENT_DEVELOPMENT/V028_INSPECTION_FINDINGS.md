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

Owner visual/responsive acceptance is still required.

### Checkpoint 28D2 - Progression expansion
Implement:
- Progress desktop layout cleanup;
- reusable achievement definition structure for expanded ladders;
- visible/hidden achievement support;
- category-specific milestone families;
- difficulty-scaled achievement XP;
- expanded progressively harder level curve;
- roughly ten-year consistency target for maximum level;
- scalable level titles;
- in-progress-first achievement presentation;
- completed achievement section/filter/collapse;
- responsive verification.

## Acceptance boundary before inspection resumes

The remaining page inspection should resume only after 28D1 and 28D2 have been
implemented, tested and manually reviewed enough that the current review backlog feels
under control.
