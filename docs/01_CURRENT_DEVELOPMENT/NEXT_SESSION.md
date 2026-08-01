# Champions Legacy Challenge — Next Session

Version target: 0.10.0  
Objective: Verify the pre-1.0 release candidate and collect user-requested changes

## Required sequence

1. Confirm `.env` exists and remains ignored by Git.
2. Run `npm install` to install Firebase Emulator testing dependencies.
3. Run `npm run check`; expect **37 passing domain tests**.
4. Run `npm run test:rules`; expect **7 passing Firestore Rules tests**.
5. Run `npm run check:release`.
6. Run `npm audit`; do not use `--force`.
7. Deploy Firestore Rules to `fitnesschallengeapp-9e87f`.
8. Create a temporary Hosting preview channel.
9. Complete the release-candidate checklist.
10. Record desired changes before any v1.0 decision.

## Commands

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
npm run deploy:rules
npm run deploy:preview
```

## Shared-library checks

- Approve a new Exercise, Cardio activity or Skill suggestion.
- Confirm approval alone does not publish it.
- Select the approved suggestion in Library Releases.
- Publish it under version `0.10.0` with release notes.
- Confirm it appears in the correct player selector without refreshing.
- Save an entry using the published item.
- Confirm scoring, goals and Journal details remain correct.
- Archive the item.
- Confirm it disappears from future selection while the historical entry still displays and scores correctly.

## Error-report checks

- Set `VITE_ERROR_REPORTING_MODE=firestore` in the local `.env`.
- Trigger a harmless test error in development only.
- Confirm a sanitised report appears in Administration.
- Resolve it with a note.
- Confirm an immutable audit record is created.
- Return the mode to the desired production setting.

## Pagination checks

- Confirm Players and Roles loads the first page.
- Confirm Load More appends records without duplicates.
- Confirm Audit History and Error Reports use the same pattern.
- Confirm searches accurately describe that they search loaded records.

## Release boundary

Do not create a `v1.0.0` tag. A suitable commit is:

```powershell
git add -A
git commit -m "feat: harden pre-release administration and deployment"
git tag v0.10.0
```
