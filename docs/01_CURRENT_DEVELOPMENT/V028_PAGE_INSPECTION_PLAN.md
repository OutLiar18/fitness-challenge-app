# Champions Legacy Challenge - v0.28.0 Page Inspection and Change Plan

Date: 12 August 2026
Status: Active
Purpose: owner-led page-by-page inspection and change pass

## Scope

v0.28.0 is the owner/design review pass across the live application experience.

This version is for:
- inspecting every major page/workspace in the app;
- recording what feels confusing, missing, weak or visually inconsistent;
- deciding which changes should be made before external friend feedback;
- grouping accepted changes into sensible implementation checkpoints;
- improving the product without yet performing the full complete-season rehearsal.

This version is not for:
- the complete league-season rehearsal;
- major synthetic-season acceptance work;
- a release-candidate hardening pass;
- a v1.0 declaration.

The complete season rehearsal is deferred to v0.30.0.

## Inspection principles

For every page/workspace, inspect:
- clarity of purpose;
- visual hierarchy and first impression;
- navigation and discoverability;
- wording, labels and help text;
- information density;
- empty/loading/error states;
- responsiveness and touch friendliness;
- color/contrast/theme consistency;
- admin/operator usability where relevant;
- whether any function is missing, misleading or too slow/confusing.

## Suggested review order

### 1. Global shell and shared UX
- top navigation;
- page switching behavior;
- same-page tab behavior;
- dialogs, confirmations and destructive actions;
- light/dark theme consistency;
- spacing, cards, headings, empty states and global polish.

### 2. Authentication
- sign in;
- sign up;
- forgot/reset flows;
- auth messaging and branding.

### 3. Dashboard / Home
- welcome card;
- daily progress;
- shortcuts;
- surface priority;
- first-glance usefulness.

### 4. Log Activity
- category selection;
- data entry flow;
- validation feedback;
- submission confidence;
- mobile usability.

### 5. Journal / history surfaces
- readability;
- filtering;
- correction clarity;
- audit visibility.

### 6. Progress
- goals;
- streaks;
- records;
- progress explanation.

### 7. Analytics
- chart usefulness;
- stat relevance;
- readability and hierarchy;
- what feels missing.

### 8. Profile
- player identity;
- MBTI profile;
- settings and personal context;
- anything confusing or unfinished.

### 9. Houses
- House overview;
- membership clarity;
- leadership clarity;
- House standings/history;
- theme and immersion.

### 10. Seasons
- season overview;
- lifecycle clarity;
- standings/publication views;
- administrative flow;
- anything unclear about state or timing.

### 11. Admin / trusted workflows
- evidence review;
- corrections;
- bonus administration;
- deletion/admin safeguards;
- clarity for Platform vs League Administrator roles.

### 12. Rules / points / reference pages
- Rules readability;
- points explanation;
- power-play clarity;
- whether help/reference pages answer common questions.

## How to capture findings

For each page:
- list issues;
- mark each as visual, wording, workflow, functional or polish;
- indicate whether the change is mandatory, recommended or optional;
- group related changes before implementation.

## Expected downstream flow

- v0.28.0: owner page inspection + accepted changes.
- v0.29.0: friend/external feedback pass and resulting changes.
- v0.30.0: complete league-season rehearsal.
- v0.31.0: cleanup, polish and hardening after rehearsal.

## First inspection pause — 28C

Reviewed and captured:
- Global/shared brand and theme interaction direction;
- Home / Dashboard;
- Navigation;
- Log Activity;
- Progress.

Detailed findings: `V028_INSPECTION_FINDINGS.md`.

The inspection is paused here while 28D1 and 28D2 implement the accepted changes. After
those changes are reviewed, continue with Seasons, Houses, Inbox, Analytics, Pocket
Week, Legacy Coach, Challenge Rulebook, Points Guide, Help/Privacy, Administration and
Profile.
