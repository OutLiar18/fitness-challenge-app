# Champions Legacy Challenge — User Roles

Last updated: 4 August 2026

## Principle

Roles grant the minimum authority needed for a task. Client navigation may hide unavailable controls, but Firestore Rules are the actual authority.

## Player

A Player can:

- manage their constrained profile and onboarding state;
- record and delete eligible recent personal activity;
- view their progress, analytics, Inbox and account-owned records;
- join open seasons through a known invitation code;
- participate in House ballots when eligible;
- use Pocket Week and other confirmed season actions;
- download personal data;
- submit, cancel or reopen their own account-deletion request.

A Player cannot grant themselves a trusted role, assign Houses, acknowledge account requests or rewrite shared competition history.

## House Captain and Vice-Captain

These are season-scoped leadership responsibilities, not platform roles. Confirmed leaders may perform the House actions allowed by current season rules, including the constrained weekly roster mechanism and their own ballot communication. Authority ends with the season or leadership change.

## League Administrator

A League Administrator manages only assigned seasons and may perform authorised lifecycle, House, election and roster operations. This role does not grant platform-wide user-role management or account-request access.

## Platform Administrator

A Platform Administrator may:

- manage trusted user roles;
- publish announcements and shared library releases;
- moderate suggestions and resolve client error reports;
- create/manage seasons and perform authorised competition operations;
- read immutable audit history;
- list and acknowledge account-deletion requests with an audit event.

Acknowledging a request confirms receipt only. It does not constitute complete deletion.

## Trusted deletion operator

This is a deferred operational capability rather than a current client role. A future trusted server/Admin SDK process must handle Authentication deletion, eligible private-record removal, shared-history treatment and completion evidence.

## Audit rule

Privileged changes that alter trusted authority, published content, competition lifecycle or account-request state must produce a matching immutable audit event where specified by Firestore Rules.
