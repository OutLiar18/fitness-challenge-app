# Champions Legacy Challenge — QA Matrix

Last updated: 1 August 2026

## Browsers

Test the latest stable versions available on the development devices:

- Google Chrome.
- Microsoft Edge.
- Firefox.
- Safari when access to an Apple device is available.

## Viewports

- 320 × 568 mobile minimum.
- Common Android portrait.
- Mobile landscape.
- Tablet portrait and landscape.
- 1366 × 768 desktop.
- 1920 × 1080 desktop.

## Themes and input

- Light operating-system theme.
- Dark operating-system theme.
- Reduced motion.
- Keyboard only.
- Mouse.
- Touch simulation and real touch device where available.

## Core workflows

For each supported browser and at least one mobile and desktop viewport:

- Register, sign in, sign out and protected redirect.
- Change profile name and Legacy Avatar.
- Navigate every primary route.
- Create and delete an activity entry.
- Browse Journal dates.
- Switch Daily and Weekly goals.
- Open Progress and Announcements.
- Mark announcements read and unread.

## High-risk workflows

Run on Chrome desktop and one mobile device:

- Running eligibility boundaries.
- Effective repetitions and workout goals.
- Streak and shield dates.
- Admin announcement publication.
- Suggestion approval and rejection.
- Global library release and archive.
- Role and team update.
- Error-report creation and resolution.
- Paginated load-more controls.

## Evidence

Record:

- Browser and viewport.
- Test date.
- Passed workflow.
- Screenshot for visual defects.
- Console output for runtime defects.
- Firestore document path for data defects.
- Regression-test addition for each fixed logic defect.
