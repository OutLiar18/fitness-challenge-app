# Champions Legacy v0.5 Optimisation Summary

Date: 30 July 2026

## Completed

### Scoring and statistics

- Replaced duplicated point calculations with one structured point-breakdown path.
- Fixed the previous Running breakdown double-count risk.
- Running now intentionally contributes Running points, Cardio bonus points, Running statistics and Cardio-duration statistics from one Firestore entry.
- Added category-aware point labels and clear journal breakdowns.
- Completed workout difficulty multipliers, static-hold conversion and Effective Repetitions.
- Fixed legacy Upper Body exercises that omitted `exerciseType` by normalising library definitions in one service.
- Enabled custom workout exercises to score from their proposed difficulty tier.

### Architecture

- Separated authentication, user, entry, library, points, statistics and validation responsibilities.
- Removed direct Firestore logic from page components.
- Added dedicated auth and dashboard hooks.
- Centralised workout category constants and category lookups.
- Consolidated duplicate exercise option logic into `exerciseLibraryService`.
- Removed unused legacy files and broken duplicate services.
- Added an application error boundary.
- Added generic Cardio and Skill suggestion persistence alongside exercise suggestions.

### Data integrity and security

- Normalised challenge dates at local noon and removed UTC date-input drift.
- Preserved a successful challenge entry when a non-critical library update fails.
- Added owner-based Firestore rules and Firebase configuration.
- Added account cleanup if profile creation fails after Authentication registration.
- Made unused Firebase configuration values optional.
- Added `.env.example`; the real `.env` is excluded from the delivery archive.

### UI and accessibility

- Introduced a responsive design-token system with dark-mode support.
- Rebuilt authentication, dashboard, forms, selectors, journal, entry cards and toasts.
- Removed invalid nested interactive controls from multi-select fields.
- Added combobox/listbox semantics, keyboard navigation, visible focus states and live-region feedback.
- Added read-only journal behaviour for locked dates.
- Added loading, empty and error states.
- Replaced inline component styling with reusable CSS.
- Added a Champions Legacy favicon and deployment redirect.

### Validation

- Standardised form validation.
- Added missing custom Cardio group and difficulty checks.
- Corrected custom workout difficulty to support all five tiers.
- Kept optional post-save tasks separate from the primary entry transaction.

## Removed legacy files

- `TimeDurationPicker.jsx` and its CSS
- old Easter egg placeholders
- obsolete Cardio points configuration
- duplicate `exerciseOptionService`
- obsolete monolithic statistics service
- unused migration service
- obsolete units helper

## Verification

- ESLint passes with no errors or warnings.
- Six automated domain tests pass for Running/Cardio scoring, cross-category statistics, legacy and custom workout scoring, Cardio validation and local date handling.
- JSX and module syntax are parsed by ESLint across the complete source tree.
- A production Vite build could not be executed inside the Linux sandbox because the uploaded archive contained Windows-only native Rolldown binaries. The delivery archive excludes `node_modules`; running `npm install` on the target computer installs the correct platform package before `npm run build`.
