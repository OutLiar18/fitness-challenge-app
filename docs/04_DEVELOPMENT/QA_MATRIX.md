# Champions Legacy Challenge — QA Matrix

Current release target: v0.21.0

## Automated release matrix

| Area | Required result |
|---|---|
| Lint | ESLint passes without warnings |
| Domain | 104 tests pass |
| Firestore Rules | 46 tests pass using Java 21 |
| Build | Vite production build succeeds |
| Release structure | v0.21.0, Hosting target `app`, trusted operations/docs/finaliser present |
| Static audit | no unresolved local imports or unintended unreferenced source/styles |

## Evidence-specific assertions

- Season evidence policy requires explicit confirmation.
- Running Cardio is immediate and Running points are proof-gated.
- Steps points cannot bypass proof.
- Water/Fruit bonuses are once daily and outside normal activity cap.
- Fruit normal scoring caps at five servings per day.
- Claim IDs link to source entries.
- Unassigned reviewers and unassigned Season Administrators cannot decide evidence.
- Assigned reviewers cannot read other category queues.
- Late proof is Platform-Administrator-only.
- Decisions/releases/reversals are atomic.
- v2 players read published snapshots but not another player's live contribution stream.
- Snapshots are immutable.

## Final manual pre-v1.0 matrix

- Desktop, tablet and mobile route flows.
- Light/dark mode and responsive workspaces.
- Keyboard, screen reader, focus and reduced motion.
- Full season rehearsal with multiple player/reviewer/admin accounts.
- WhatsApp ID matching, deadline, correction and snapshot operations.
- Operational recovery and privacy wording.

## Safety assertions

No media upload, no direct point editing, no silent evidence mutation, no false scheduler claim, no undefined mechanic activation and no v1.0 tag.

## v0.20.0 correction matrix

- Search by entry ID and verification ID.
- Correct ordinary, qualifying Running, non-qualifying Running, Steps, Water and Fruit entries.
- Confirm category/date/House attribution cannot change.
- Confirm old entry and proof remain visible but inactive/superseded.
- Confirm personal goals, records, analytics and progression use only the replacement.
- Confirm reversal/replacement points net correctly for administrators.
- Confirm ordinary players cannot write correction documents.
- Confirm Journal recorded-day pagination and keyboard focus.
- Confirm integrity JSON uses ISO timestamps and excludes WhatsApp media.
- Confirm Pocket entries are diagnosed but correction submission is unavailable.
## v0.21.0 trusted reconciliation matrix

- Fingerprint remains stable when Firestore source order changes.
- Complete immutable records produce a publishable audit.
- Missing evidence, decision, correction and replacement links block publication.
- Matching snapshots are recognised without duplicate publication intent.
- Platform/season administrators can read trusted-run summaries; ordinary players cannot.
- No client role can create or mutate trusted-run records.
- Dry-run operation changes no Firebase competition state.
- Service-account credentials and reports remain outside source control.
