# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: DEPLOYED -->
Version: 0.24.0
Production version: 0.24.0
Last updated: 9 August 2026
Status: Verified production release; pre-v1.0

## Product state

Champions Legacy Challenge is live on Firebase Hosting with the v0.24.0 frontend and the byte-verified v0.24.0 Firestore Rules active in production.

The platform combines factual personal tracking, progression, season-scoped Houses, themed Power Plays, WhatsApp evidence, audited corrections, controlled published standings, trusted reconciliation, trusted account deletion and the v4 House Movement foundation.

## v0.24.0 systems now in production

### House Movement v4

- New seasons use `season-houses-v4`.
- Weekly roster swaps persist a one-week post-move rest window.
- A player cannot be moved again during the following movement period.
- Initial C.H.A.O.S. assignment does not count as a move.
- Same-week repeat movement, House weekly locks and captain/vice-captain protection remain enforced.
- Platform Administrators may override only the active rest restriction and must provide a factual reason.

### Assignment history

- C.H.A.O.S. and weekly moves create immutable House-assignment history.
- Historical House attribution cannot be rewritten by later movement.
- Assignment history participates in trusted account-deletion anonymisation where required.

### Composition privacy and weekly balance

- Season members may optionally self-declare one of the frozen `season-composition-v1` responses.
- Exact responses remain private to the owner and authorised administrators.
- `prefer-not-to-say` remains private and is excluded from disclosed-composition percentages.
- `house-balance-v1` creates immutable weekly public/private snapshots.
- Public summaries suppress composition when a House has fewer than three disclosed responses.
- Exact counts remain administrator-only.
- House balance is informational and `scoringEnabled` remains false.

### Power Plays and existing competition systems

- Themed no-repeat Power Plays remain active and compatible with v4 seasons.
- Existing evidence, corrections, standings, honours, Pocket Week and trusted reconciliation behaviour is preserved.
- Evidence decisions remain Platform Administrator-only; League Administrators retain only their permitted read/operational access.

## Production verification

- Deployed source commit: `b5e7c083c0ba7730f21b8a92b30530f3ebb8374c`.
- 131/131 domain tests passed.
- 79/79 Firestore Rules tests passed.
- Complete Rules suite contained zero `maximum of 1000 expressions` evaluator-limit messages at the final freeze.
- Frozen Rules SHA-256: `2ab1e569f4699e0018f3c5b7e5225a9fb42d65b835215fc9b8917ab21c701573`.
- Active production Ruleset: `projects/fitnesschallengeapp-9e87f/rulesets/45a2ef28-df8b-4751-bbd2-dfed2c45a109`.
- Remote Rules source matched the frozen local source byte-for-byte at 3,501 lines / 160,395 bytes.
- Hosting target `app` deployed 66 files to `champions-legacy-challenge`.
- Live `index.html` and all 17 referenced assets matched the verified build byte-for-byte.
- SPA fallback and configured Hosting headers passed live verification.
- Production read-only navigation smoke and a reversible profile-write smoke both passed.

## Operational boundaries

- Development-repository production deployment scripts remain intentionally blocked.
- Future production changes require a new reviewed release scope rather than reusing the v0.24 activation runners.
- No fake activity entry was created during production smoke validation.
- Firebase Storage remains unused.
- Full final cross-device, keyboard, screen-reader, dark-mode and visual review remains scheduled for the dedicated polish release.
- Do not call or tag v1.0 without explicit approval.

## Immediate next step

Begin v0.25.0 design work for Five Fires and the remaining competition decisions. Do not change production while that design is unresolved.
