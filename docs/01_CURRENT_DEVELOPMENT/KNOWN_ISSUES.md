# Champions Legacy Challenge — Known Issues

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 4 August 2026

## v0.18.0 candidate status

Packaging lint, 80 domain tests and the Windows Vite build pass. The first Rules run found two expression-budget failures; the candidate includes a targeted hotfix and awaits a clean 39-test rerun, release-readiness and production deployment.

## Rules evaluation budget

- The first v0.18.0 Windows Rules run hit Firestore's 1,000-expression evaluation limit in two valid atomic workflows.
- The candidate hotfix replaces broad OR validation with branch-directed ternaries, removes redundant full-policy validation from claim creation and fixes the Running proof test fixture to include the production `evidenceClaimIds` link.
- This remains a release blocker until all 39 Rules tests pass cleanly. Do not deploy the pre-hotfix Rules.

## Evidence operations

- The app stores no WhatsApp media. Administrators must visually compare external proof and record the message timestamp.
- The 10:00 leaderboard fallback is administrator-session based, not a guaranteed background job. Without an authorised session, the previous player snapshot remains visible.
- Evidence-linked entries are locked from ordinary deletion to preserve the verification chain. A complete audited factual-correction workflow is still required.
- Running and Steps Pocket redemption is disabled in new v2 seasons because proof cannot safely be attached to the reserved whole session.

## Existing technical limitations

- The Firebase vendor bundle remains above Vite's 500-kilobyte warning threshold. This is recorded as a future measured optimisation, not a release blocker.
- `npm audit` reports a React Router React Server Components advisory. The app does not use React Server Components, and the available forced remediation is breaking. Do not run `npm audit fix --force`.
- Personal history still subscribes to the complete signed-in user's entries. Pagination remains future work.
- Account deletion requires trusted operational handling outside the client.
- Prize-bearing competition should eventually use trusted server-side recalculation and scheduled publication.

## Review boundary

The complete functional, responsive, dark-mode, keyboard and accessibility review remains deferred until the final pre-v1.0 stage by user choice.
