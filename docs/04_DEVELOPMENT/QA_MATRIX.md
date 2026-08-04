# Champions Legacy Challenge — QA Matrix

Current release target: v0.18.0

## Automated release matrix

| Area | Required result |
|---|---|
| Lint | ESLint passes without warnings |
| Domain | 80 tests pass |
| Firestore Rules | 39 tests pass using Java 21 |
| Build | Vite production build succeeds |
| Release structure | v0.18.0, Hosting target `app`, required evidence/docs/finaliser present |
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
