# Champions Legacy Challenge — Testing Guide

Last updated: 1 August 2026

## Test layers

### Domain tests

Run:

```powershell
npm test
```

Target for v0.10.0: **37 passing tests**.

Coverage includes:

- Running eligibility and Cardio cross-contribution.
- Workout effective repetitions.
- Daily and weekly goals and bonuses.
- Streaks, shields, experience points, achievements and records.
- Timeline and navigation integrity.
- Profiles and announcements.
- Administration models, complete measurement wording, versioned library definitions and error-report sanitization.

### Firestore Security Rules tests

Run:

```powershell
npm run test:rules
```

Target for v0.10.0: **7 passing tests**.

Coverage includes:

- Published-versus-archived global library reads.
- Self-role-change denial.
- Authenticated sanitised error-report creation.
- Audited administrator library publication.
- Draft-announcement privacy.
- Audited error-report resolution.
- Immutable global-library release history.

The Firebase CLI launches and shuts down the Firestore Emulator automatically.

### Lint and build

```powershell
npm run lint
npm run build
```

### Standard check

```powershell
npm run check
```

Runs ESLint, domain tests and the production build.

### Release check

```powershell
npm run check:release
```

Runs the standard check, Firestore Rules tests and release-structure verification.

## Defect rule

For each verified logic or security defect:

1. Reproduce it.
2. Add a failing regression test where practical.
3. Apply the smallest maintainable fix.
4. Run the relevant focused test.
5. Run `npm run check`.
6. Run `npm run test:rules` for any Security Rules or privileged-write change.
7. Update documentation.
