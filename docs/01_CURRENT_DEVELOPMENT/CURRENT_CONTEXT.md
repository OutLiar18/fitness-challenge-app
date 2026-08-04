# Current Context

Last updated: 4 August 2026

**v0.17.0 — Player Readiness and Account Control** is verified and deployed to production.

The release adds onboarding only for newly created profiles, while legacy profiles remain uninterrupted. Help & Privacy becomes the single route for getting started, understanding stored versus derived data, reviewing privacy boundaries, downloading personal data and requesting account deletion.

The export is generated on demand as JSON from account-owned Firestore records. Account deletion is intentionally represented as a reviewable request rather than a misleading browser-only erase. Players can request, cancel or reopen; Platform Administrators can acknowledge with an audit event. Final Authentication/data deletion remains a trusted operational process.

Security Rules now validate onboarding fields, account-request ownership and audited acknowledgement. Players may list their own private leadership votes and read their own sanitised error reports for export. No scoring, progression, Pocket, House allocation or season standings logic changed.

Authoritative Windows verification passed clean lint, 71 domain tests, the Vite production build, 30 Firestore Rules tests and release-readiness. Firestore Rules compiled and deployed successfully, and Firebase Hosting released 62 files to the branded production site. The full manual integrated review remains deferred until the final pre-v1.0 stage.
