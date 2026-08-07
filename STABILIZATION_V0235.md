# v0.23.5 Stable Recovery

This source is built from the verified v0.23.0 release. It is not built from the mixed folder or any v0.24 rescue candidate.

## What is included

- v0.23 Power Plays and season-houses-v3.
- v0.23 Firestore Rules, unchanged.
- Existing v0.23 House roster swaps.
- All other verified v0.23 functionality.

## What is deliberately excluded

- v0.24 season-houses-v4.
- One-week post-move rest lock.
- Composition profiles.
- Weekly House-balance public/private snapshots.
- House Movement services/tests and their Rules expansion.

## Safe release order

1. `npm install`
2. `npm run check:release`
3. `npm run deploy:production`
4. Manually verify the live site.
5. `npm run finalise:release`

The production deploy script runs Firestore Rules first. Hosting does not deploy if the Rules command fails.
