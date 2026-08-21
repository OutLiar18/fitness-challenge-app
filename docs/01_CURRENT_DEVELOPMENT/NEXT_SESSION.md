# Champions Legacy Challenge — Next Session

Continue on `development/v0.30.0`.

## First priorities

1. Capture a clean mobile Lighthouse baseline without changing production.
2. Audit Performance and Best Practices findings, identify the specific causes, and fix only verified issues.
3. Address any remaining owner-requested responsive, visual or code-hardening polish.
4. Re-run the relevant automated checks and production build after each meaningful grouped change.

## Safety

- No Firebase deployment during ordinary v0.30 development.
- Firestore Rules remain unchanged unless handled as a separate security checkpoint.
- Do not alter accepted scoring, evidence authority or House-movement rules as collateral cleanup.
- Production remains v0.29.0 until a later explicit release decision.
