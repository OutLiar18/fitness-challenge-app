# Champions Legacy Challenge — Current State

Version: 0.9.0  
Last updated: 1 August 2026  
Status: Implementation complete; local build verification, administrator bootstrap and Firestore rules deployment required

## Product state

Champions Legacy Challenge now has a complete single-player tracking and progression foundation plus the first operational administration layer.

## Implemented in v0.9.0

### Live announcements

- Published announcements are read from Cloud Firestore.
- Bundled release notes remain available as a resilient fallback and import source.
- Players see published announcements only.
- Read status is stored under each player and synchronises across devices.
- Filters, unread counts, mark-read, mark-unread and mark-all-read remain available.

### Trusted administration

Platform Administrators can:

- create, edit, publish and archive announcements;
- import bundled release history into Firestore;
- review Exercise, Cardio and Skill suggestions;
- approve or reject suggestions with respectful feedback;
- manage another player’s trusted role and team assignment;
- inspect immutable audit history.

Ordinary players cannot promote themselves or access privileged data.

### Security and accountability

- Administrative access may come from a trusted Firebase custom claim or a profile role assigned through a trusted process.
- Every privileged announcement, moderation or role change is committed in the same Firestore batch as an audit event.
- Audit events cannot be edited or deleted by the client.
- Administrators cannot change their own trusted role from the application.
- Public announcement queries expose only published content.

### Wording and typography

- Central formatting expands player-facing measurements such as minutes, kilometres, millilitres, effective repetitions, points and experience points.
- Navigation and headings consistently use “Champions Legacy Challenge”.
- Operational text uses a clear professional typeface.
- Display headings use a stronger identity typeface.
- Quotations and milestone emphasis use a restrained decorative serif style.
- Bold, italic and underlined emphasis is used selectively rather than decoratively everywhere.

## Existing complete systems

- Firebase Authentication and protected routes.
- Ten factual activity categories and local-date-safe Journal.
- Explainable activity scoring and Running/Cardio rules.
- Daily and weekly goals with moderate bonuses.
- Streaks, shield, experience points, levels, achievements and personal records.
- Progress timeline and responsive application shell.
- Built-in Legacy Avatars and constrained profile editing.

## Verification status

- Automated domain and architecture tests: **33 passing** in the handover environment.
- Relative import and static source checks are required before packaging.
- Local ESLint and production build must run on the Windows development computer.
- Updated Firestore rules must compile and deploy before live administration is used.

## Known limitations

- The first Platform Administrator must be assigned outside the ordinary client application.
- Approved suggestions are marked as approved but are not yet automatically published into global libraries.
- User list and audit history are appropriate for the current scale but need pagination before large production usage.
- Historical activity subscriptions still load the player’s complete entry history.
- Custom avatar uploads remain intentionally unavailable.

## Immediate next step

Run the v0.9.0 verification sequence in `NEXT_SESSION.md`, bootstrap the first Platform Administrator, deploy the rules and manually verify each privileged workflow.
