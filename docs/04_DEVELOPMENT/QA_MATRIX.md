# Champions Legacy Challenge — QA Matrix

Current release target: v0.17.0

## Automated release matrix

| Area | Required result |
|---|---|
| Domain services | 71 tests pass |
| Firestore Rules | 30 tests pass using Java 21 |
| Lint | No errors or warnings |
| Production build | Vite build passes |
| Release structure | v0.17.0, Hosting target `app`, required source present |
| Dependency review | Audit reviewed; no forced breaking fix |

## Final manual pre-v1.0 matrix

The product owner has deferred the complete manual matrix until the final pre-v1.0 stage. That review must cover:

- desktop, tablet and mobile layouts;
- light and dark appearance;
- keyboard-only operation, focus order/traps and reduced motion;
- new-account onboarding, skip, completion and replay;
- Help & Privacy wording and workspace behaviour;
- personal export success and unavailable-section messaging;
- deletion request, cancellation, reopen and administrator acknowledgement;
- existing activity, progression, Inbox, analytics and season workflows;
- screen-reader labels, alerts, dialogs and native selectors.

## Safety assertions

- Onboarding never changes score or membership.
- Export never writes a second copy to Firestore.
- Acknowledgement is never labelled completed deletion.
- Shared House history is not rewritten by profile or account-request changes.
