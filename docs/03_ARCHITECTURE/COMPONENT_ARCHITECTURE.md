# Champions Legacy Challenge — Component Architecture

Current release target: v0.17.0  
Current production: v0.16.0

## Protected application shell

`ProtectedApp` composes the authenticated providers, then wraps `AppShell` with `OnboardingGate`. The gate renders the normal application underneath an accessible modal only when a loaded profile explicitly has onboarding version `0`.

## Route-level workspaces

- `Dashboard.jsx` — current status and focused next actions.
- `ActivityLog.jsx` — logging and Journal workspaces.
- `Progress.jsx` — overview, achievements, records, timeline and level journey.
- `Analytics.jsx` — trends, consistency, category balance and insights.
- `Inbox.jsx` — public announcements and private notifications.
- `Profile.jsx` — identity, personalisation and protections.
- `Help.jsx` — getting started, data explanation, privacy boundaries and account tools.
- `Seasons.jsx`, `Houses.jsx`, `PocketWeek.jsx` — season participation and operations.
- `Admin.jsx` — progressive-disclosure operational console including account requests.

## Shared disclosure pattern

`WorkspaceTabs` provides labelled desktop tabs, a native small-screen selector, keyboard movement and one visible panel. It is used only where content represents peer workspaces; it is not added to simple pages merely for decoration.

## Onboarding

`OnboardingGate` owns step state, focus containment, body scroll lock, progress indication and completion feedback. It writes only onboarding fields through `onboardingService` and cannot change scoring or membership.

## Help and account tools

`Help` keeps explanatory content and account actions in separate workspaces. Export and deletion-request controls use explicit busy, success and error states. The deletion confirmation states that the action creates a request rather than immediate erasure.

## Administration

`AccountDeletionRequests` presents filtered request cards. The component calls an administrative service that writes the acknowledgement and audit event atomically. The UI never exposes a false “deleted” state.

## Navigation

Help & Privacy appears under More/Support rather than primary navigation. Desktop Profile remains available through the player identity footer; mobile Profile remains inside More. This preserves a focused primary path.
