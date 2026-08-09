# Champions Legacy Challenge — Current Context

<!-- RELEASE_STATUS: DEPLOYED -->
Current source: v0.24.0
Current production: v0.24.0
Last updated: 9 August 2026

v0.24.0 is complete in production.

Release closure:

- Checkpoint 8L froze the final evaluator-clean Firestore Rules candidate.
- Checkpoint 9A deployed Rules only and remotely verified the active Ruleset source byte-for-byte.
- Checkpoint 9B deployed Hosting only and verified the live index, referenced assets, SPA fallback and configured headers.
- Checkpoint 9C passed read-only production navigation and a reversible profile-write smoke test.
- Checkpoint 9D records the release and tags the exact deployed source commit.

Deployed source commit:

`b5e7c083c0ba7730f21b8a92b30530f3ebb8374c`

Frozen production Rules SHA-256:

`2ab1e569f4699e0018f3c5b7e5225a9fb42d65b835215fc9b8917ab21c701573`

Active Ruleset:

`projects/fitnesschallengeapp-9e87f/rulesets/45a2ef28-df8b-4751-bbd2-dfed2c45a109`

The next development target is v0.25.0. Five Fires is confirmed for design; Buddy Bonuses and late-season twists still require explicit product decisions. Do not deploy or modify production as part of design work.
