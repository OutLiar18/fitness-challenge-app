# Champions Legacy Challenge — Next Session

Version target: 0.7.1
Objective: Verify adaptive responsive navigation and branding

## Required sequence

1. Confirm `.env` remains present and ignored.
2. Run `npm install`.
3. Run `npm run check`.
4. Run `npm audit`; do not use `--force`.
5. Run `npm run dev`.

## Responsive checks

### Desktop — 1200 px and wider

- A persistent labelled left rail remains visible.
- Home, Log Activity, Progress, Announcements and Profile are immediately accessible.
- More opens the future-module popover.
- Player status shows current streak, level and points.
- No page content sits beneath the rail.

### Tablet — 761 px to 1100 px

- Navigation changes to an icon-only rail.
- Every icon retains an accessible label and tooltip.
- The More popover opens to the right of the rail.
- Dashboard, Progress and Log layouts do not overflow horizontally.

### Mobile — 320 px to 760 px

- The desktop rail is absent.
- The sticky header shows the full Champions Legacy Challenge name, current page and player status.
- The bottom bar contains Home, Log, Progress, News and More.
- More opens as a bottom sheet and provides Profile, future modules and Sign Out.
- Category logging uses a horizontally scrollable category selector.
- Forms, journal controls and progress cards remain usable at 320 px.
- Bottom navigation does not cover page actions or toast messages.

## Regression checks

- Route active states remain correct.
- Existing entries and progression values match v0.7.0.
- Sign out works from More.
- Goal cards still deep-link to the selected category.
- Keyboard focus remains visible.
- Reduced-motion and dark operating-system themes remain usable.

## Release

After all checks pass:

```powershell
git add -A
git commit -m "feat: polish responsive navigation and branding"
git tag v0.7.1
```
