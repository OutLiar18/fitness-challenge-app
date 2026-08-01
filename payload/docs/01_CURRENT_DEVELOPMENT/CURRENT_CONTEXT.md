# Champions Legacy Challenge — Current Context

## Current development phase

Trusted Administration and Live Announcements — v0.9.0

## Current priorities

- Complete local lint, tests and production build.
- Bootstrap the first Platform Administrator through a trusted Firebase process.
- Deploy and verify the updated Firestore rules.
- Test live announcement publishing and cross-device read status.
- Test moderation, user-role changes and immutable audit events.

## Architectural direction

- Privileged actions must be enforced by Firestore rules, not hidden buttons alone.
- Every privileged write must create an immutable audit event in the same batch.
- Announcements use Firestore as the live source and bundled release notes as fallback history.
- Profiles store approved avatar identifiers, never uploaded media bytes or arbitrary URLs.
- Player-facing wording uses central formatters so abbreviated measurements cannot spread through UI components.
- Scoring and progression remain fully separate from administration and presentation.

## Following phase

After v0.9.0 release verification, complete global-library publishing for approved suggestions and design versioned challenge configuration before beginning live teams, leagues or competitive leaderboards.
