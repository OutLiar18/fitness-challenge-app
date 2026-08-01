# Champions Legacy Challenge — Release Candidate Checklist

Version: 0.10.0  
Purpose: Provide evidence for a future v1.0 decision without declaring v1.0 complete

## Automated verification

- [ ] `npm install` completes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes 37 domain tests.
- [ ] `npm run build` succeeds.
- [ ] `npm run test:rules` passes 7 emulator tests.
- [ ] `npm run check:release` succeeds.
- [ ] `npm audit` is reviewed without forcing breaking dependency changes.

## Authentication and profile

- [ ] Register a test player.
- [ ] Profile document is created safely.
- [ ] Sign out and sign in.
- [ ] Protected redirects work.
- [ ] Display-name and Legacy Avatar changes persist.
- [ ] A player cannot modify their own trusted role.

## Activity tracking

- [ ] Every category accepts valid input.
- [ ] Invalid input produces useful wording.
- [ ] Entries appear in the Journal in real time.
- [ ] Today and yesterday remain editable.
- [ ] Older days remain read-only.
- [ ] Local calendar dates never shift.
- [ ] Deletion removes all derived progress.

## Scoring and progression

- [ ] Running under 3 kilometres earns no Running points but retains Cardio credit.
- [ ] Running slower than 11:00 per kilometre earns no Running points but retains Cardio credit.
- [ ] Qualifying Running earns both contributions from one Firestore entry.
- [ ] Effective repetitions and workout goals remain accurate.
- [ ] Daily and weekly goal bonuses remain moderate.
- [ ] Streak, shield, experience points, achievements and records remain consistent.

## Announcements and administration

- [ ] Ordinary players see only published announcements.
- [ ] Cross-device read status synchronises.
- [ ] Platform Administrator access is enforced by Firestore Rules.
- [ ] Announcement changes create audit records.
- [ ] Suggestion approval and rejection work.
- [ ] Role and team changes work for another player only.
- [ ] Audit records cannot be edited or deleted.

## Versioned global libraries

- [ ] Approved suggestions remain unpublished until deliberately released.
- [ ] A release requires a semantic version.
- [ ] A semantic release version cannot be published twice.
- [ ] No more than eight items can be published in one release.
- [ ] Published options appear live in the correct forms.
- [ ] Published definitions are stored with entries.
- [ ] Archiving affects future selection only.
- [ ] Release, item and suggestion publication audits exist.

## Error monitoring

- [ ] `console` mode logs without Firestore writes.
- [ ] `firestore` mode writes only for authenticated players.
- [ ] Duplicate reports are suppressed within a browser session.
- [ ] Reports contain no form values, credentials or tokens.
- [ ] Platform Administrators can resolve reports with notes.
- [ ] Resolution creates an audit record.
- [ ] Error context is restricted to a sanitised summary.

## Responsive and accessibility

- [ ] 320-pixel mobile layout.
- [ ] Typical mobile portrait and landscape.
- [ ] Tablet icon rail.
- [ ] Desktop labelled sidebar.
- [ ] Keyboard-only navigation and forms.
- [ ] Visible focus states.
- [ ] Light and dark operating-system themes.
- [ ] Reduced motion.
- [ ] Screen-reader labels for icon-only controls.

## Preview deployment

- [ ] `npm run deploy:preview` succeeds.
- [ ] Direct links to nested routes load correctly.
- [ ] Authentication works on the preview domain.
- [ ] Firestore requests use the intended Firebase project.
- [ ] Response headers are present.
- [ ] Static assets cache correctly.
- [ ] No unexpected console errors remain.

## User review

- [ ] Visual changes requested by the user are documented.
- [ ] Gameplay-rule changes are documented before implementation.
- [ ] Missing or confusing workflows are recorded.
- [ ] v1.0 scope is explicitly approved or deferred.

A completed checklist supports a v1.0 decision. It does not automatically create one.
