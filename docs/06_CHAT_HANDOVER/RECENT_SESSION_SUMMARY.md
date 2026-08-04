# Champions Legacy Challenge — Recent Session Summary

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 4 August 2026

v0.17.0 was verified, deployed, documented and committed. The user then defined the WhatsApp evidence and daily player-leaderboard rules in detail.

## Confirmed evidence rules

- No media uploads or storage.
- Players log first and send WhatsApp proof with a verification ID within 24 hours.
- Running proof shows date, distance and duration; pace is automatic.
- Qualifying Running points wait for proof; Cardio remains immediate.
- Steps points wait for proof; proof shows date, total and recognisable app/device.
- Water: one three-point bonus/day after 750 photographed millilitres.
- Fruit: one three-point bonus/day after three photographed servings; normal points cap at five servings/day.
- Platform Admin reviews all; assigned category reviewers have scoped authority.
- Late proof is Platform-Administrator-only with a reason.
- Corrections use reversal and replacement.
- Evidence points stay with the House captured at activity time.

## Leaderboard rules

- Administrators see live standings.
- Players see the latest published immutable snapshot.
- Manual and corrected publication are allowed.
- 10:00 Africa/Johannesburg fallback is administrator-session based; previous snapshot persists otherwise.

## Candidate implementation

v0.18.0 source, UI, services, tests and Firestore Rules implement the above. Packaging lint, 80 domain tests and the Windows build pass.

The first Windows Rules run passed 37 of 39 tests. Two valid batched workflows hit Firestore's 1,000-expression evaluation ceiling: season draft creation and qualifying Running with immediate Cardio plus a pending proof claim. The candidate hotfix now:
- uses branch-directed Rules evaluation instead of evaluating unrelated alternatives;
- avoids revalidating the entire already-frozen evidence policy for every claim;
- keeps evidence/activity contribution validation on separate paths;
- corrects the Running Rules fixture so the entry contains its claim ID, matching production code.

The 39 Rules tests and release-readiness must be rerun before deployment.

The main updater includes documentation and `FINALISE_RELEASE.ps1`. No separate documentation archive should be created.
