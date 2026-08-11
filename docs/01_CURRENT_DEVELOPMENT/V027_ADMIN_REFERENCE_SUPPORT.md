# Champions Legacy Challenge — v0.27 Admin, Reference and Support

Date: 11 August 2026
Checkpoint: 27F

## Purpose

27F completes the broad page-polish portion of v0.27 across Platform Admin,
Rulebook, Points Guide, Help & Privacy, Pocket Week and future-feature preview states.

This checkpoint changes presentation and URL presentation state only. Administrator
authority, scoring models, Rulebook content models, Pocket storage/redemption rules,
account-deletion semantics, Firestore Rules and production Firebase state remain
unchanged.

## Platform Admin

- the active administration workspace is URL-backed through `tab`;
- refresh/direct links/browser navigation preserve the selected admin section;
- changing another player's trusted role now requires the shared accessible
  ConfirmDialog before the existing audited role-update service runs;
- self-role changes remain disabled;
- admin filters/forms/lists receive stronger 46px touch targets, readable metadata and
  mobile stacking;
- no administrator authority or audit service changes.

## Rulebook

- search text is URL-backed through `q`;
- non-default rule status is URL-backed through `status`;
- empty search results include a direct clear-filters action;
- the search placeholder uses current House terminology rather than retired Team
  terminology;
- long-form rule text receives a more comfortable reading measure/line height;
- small status/reference labels are raised.

The rule data, statuses, filtering model and version remain unchanged.

## Points Guide

- active section is URL-backed through `tab`;
- non-default activity category is URL-backed through `category`;
- category buttons, score ladders and formula layouts receive responsive/readability
  improvements;
- all scoring ladders, formulas, bonuses and season scoring continue to come from the
  existing points-guide model.

## Help & Privacy

- the active support section is URL-backed;
- onboarding restart failures and account-tool errors receive focus;
- account export/deletion tools expose busy state;
- explanatory copy gets a consistent long-form line height;
- account-deletion request/acknowledgement/cancellation semantics remain unchanged.

## Pocket Week

- Store / Wallet / Guide presentation state becomes URL-backed;
- changing season clears stale Pocket tab state safely;
- Pocket phase/status metadata and controls receive the shared readability/touch floor;
- storage, zero-point reserve behavior and in-season redemption remain unchanged.

## Future feature states

Future-feature previews now state `Preview only` explicitly and provide both a
Dashboard return action and the existing Log Activity action. No planned feature is
made operational by this checkpoint.

## Verification

- persistent 27F regression coverage;
- complete `npm run check` application gate;
- canonical Firestore Rules SHA verification before and after;
- no Firebase deployment.

27G remains the dedicated performance and manual cross-device/accessibility acceptance
checkpoint.
