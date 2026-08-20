# Champions Legacy Challenge — v0.28.0 Administration Polish

Checkpoint: 28D12

## Review outcome

Administration already has strong operational foundations: Platform Administrator
authority is derived from the trusted profile role, workspace selection is URL-backed,
trusted-role changes use ConfirmDialog, account deletion remains a trusted workflow,
entry corrections are immutable, and user/audit/error lists use bounded pagination.

The v0.28 review found three high-value presentation/clarity issues:

1. ordinary Administration chrome still used operating-system emoji across the route,
   overview, announcement editor, library publishing, audit history and entry
   integrity;
2. the Overview described the paged user list as total "registered players" and
   administrators even though `useAdminData` initially loads only a page;
3. asynchronous top-level administrative data errors were announced but did not
   receive focus.

## Changes

- Help & Privacy is recorded as owner-accepted;
- the nine Administration workspace tabs use shared ThemeIcon symbols;
- PageHeader and restricted-access presentation use ThemeIcon;
- top-level data-load errors gain a focus target and move focus when new load errors
  appear;
- workspace descriptions are shortened for a denser nine-tab operator surface;
- Overview becomes attention-first: pending suggestions, open errors and active
  deletion requests appear before publication/inventory counts;
- paginated user/admin metrics are explicitly labelled as **loaded** counts rather
  than total registered-player counts;
- Overview, Announcement Studio, Library Releases, Audit History and Entry Integrity
  ordinary chrome use ThemeIcon;
- announcement icons remain announcement content and activity/library type symbols
  remain identity/data presentation rather than being globally recoloured;
- existing 46px admin touch-target overrides remain intact;
- a small existing indentation defect in `requestCorrection` is corrected.

## Safety boundary

28D12 does not change:

- Platform Administrator authority;
- League Administrator authority;
- Firestore Rules;
- announcement validation/publishing;
- suggestion moderation;
- library publishing/archive mechanics;
- user-role service semantics;
- error resolution;
- account deletion;
- entry correction/reconciliation mechanics;
- audit immutability;
- pagination behavior;
- Firebase deployment state.

Broad Admin CSS consolidation remains deferred to v0.31.
