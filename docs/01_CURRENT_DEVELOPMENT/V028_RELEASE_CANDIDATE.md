# Champions Legacy Challenge — v0.28.0 Release Candidate Freeze

Checkpoint: 28R

## Status

v0.28.0 is owner-accepted and frozen as a release candidate.

Frozen application source:
`7fdfd149df8d9d9e09ddf05bddf1a24a9d1c99c8`

The 28R commit itself is documentation-only. It does not alter runtime source,
Firestore Rules, package dependencies, scoring, league mechanics, evidence
authority, account workflows, or production Firebase state.

## Accepted v0.28 scope

v0.28 completed the page-by-page inspection and change pass, including:
- Dashboard / Home and navigation;
- Progress and progression presentation;
- Seasons and competition workspaces;
- Houses identity and presentation;
- Inbox;
- Analytics;
- Pocket Week;
- Legacy Coach;
- Rulebook;
- Points Guide;
- Help & Privacy;
- Administration;
- Profile.

The owner also accepted the post-inspection Legacy Profile enhancement:
- 16 full-colour MBTI mythic identity emblems;
- official personality role labels used as reference titles;
- expanded strengths, watch-outs, symbolism and Challenge guidance;
- 16 app-wide MBTI presentation palettes;
- 64 tailored Champion Transmission messages;
- neutral crimson fallback when no MBTI is selected.

## Release evidence required by 28R

The freeze gate must verify:
- branch `development/v0.28.0`;
- exact frozen source commit before documentation patch:
  `7fdfd149df8d9d9e09ddf05bddf1a24a9d1c99c8`;
- package version `0.28.0`;
- full application suite: 298 / 298;
- production build: pass;
- retained v0.27 automated acceptance: pass;
- Firestore Rules SHA-256:
  `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`;
- exact documentation-only freeze boundary;
- no Firebase deployment;
- clean working tree after commit/push.

## Production boundary

Production remains v0.27.0 during 28R.

28R performs no Firebase Hosting deployment, no Firestore Rules deployment and
no production activation. Any production activation would require a separate,
explicitly reviewed process.

## Next version

After the 28R freeze is accepted, begin v0.29.0 from the frozen v0.28 release
line. v0.29 is reserved for external-tester feedback and changes rather than
another broad page redesign.
