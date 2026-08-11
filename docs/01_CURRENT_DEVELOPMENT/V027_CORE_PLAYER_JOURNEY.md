# Champions Legacy Challenge — v0.27 Core Player Journey

Date: 11 August 2026
Checkpoint: 27C

## Purpose

27C polishes the most frequently repeated player journey:
Dashboard → Log Activity → Journal.

The checkpoint changes navigation and presentation only. It does not change scoring,
goal calculation, evidence policy, entry persistence semantics, Firestore Rules,
competition rules or production Firebase state.

## Dashboard

- Quick actions continue to put Log Activity first.
- The third quick action becomes a direct Journal route instead of another general
  destination.
- Daily/weekly goals move ahead of progression and analytical insight so the player
  sees the next actionable targets before lower-frequency reflection information.
- Existing goal calculations and click-through category behavior remain unchanged.

## Log Activity

- Log / Journal workspace state becomes URL-backed through `?tab=journal`.
- Refresh, direct links and browser navigation now preserve the selected workspace.
- A compact three-step guide communicates Choose → Record → Review.
- Category selection remains the same horizontal mobile / grid desktop control.
- Entry save logic, validation services, proof claim creation and toast feedback remain
  unchanged.

## Validation

When entry validation fails, the error summary receives programmatic focus. This makes
the validation result immediately discoverable for keyboard and screen-reader users.

## Delete confirmation

The native browser `window.confirm` flow is removed from Activity Log.

A reusable app confirmation dialog now provides:
- `role="alertdialog"`;
- modal semantics;
- Escape cancellation;
- Tab focus trapping;
- initial focus on the safe Cancel action;
- focus restoration when the trigger still exists;
- disabled controls while deletion is running;
- backdrop cancellation only while idle;
- mobile bottom-sheet-style layout.

The underlying `deleteEntry` service and editability/locking rules do not change.

## Journal

- Dashboard can deep-link directly to Journal.
- Empty Today state contains a clear Log activity action.
- Technical pagination implementation copy is replaced with player-facing guidance.
- Date navigation controls and history-day cards receive stronger touch/readability
  treatment.
- Entry cards receive small readability improvements; evidence/correction content and
  point breakdown logic remain unchanged.

## Responsive boundary

27C styles explicitly support narrow mobile, normal mobile/tablet and desktop.
27G remains the final manual cross-device/accessibility acceptance gate.

## Verification

- persistent 27C regression tests;
- complete `npm run check` application gate;
- canonical Firestore Rules SHA verification before and after;
- no Firebase deployment.
