# ADR-012 — Audited Client Administration

Status: Accepted  
Date: 1 August 2026

## Context

Champions Legacy Challenge needs operational announcement publishing, suggestion moderation and trusted role management before teams and leagues can safely launch. Hiding buttons in React is not authorization, and privileged changes must remain accountable.

## Decision

- Firestore Security Rules are the authoritative client authorization layer.
- Platform Administrator access may come from a trusted Firebase custom claim or a trusted profile role.
- The first administrator is bootstrapped outside the ordinary client.
- Every privileged client write must include an immutable audit event in the same Firestore batch.
- The changed document stores the audit identifier.
- Rules use `getAfter()` to verify the corresponding audit event within the atomic request.
- Administrators cannot change their own trusted role through the application.
- Announcements are archived rather than deleted.
- Audit events are never editable or deletable from the client.

## Consequences

### Positive

- Privileged changes are enforced and traceable.
- Business changes cannot commit without their audit record.
- The architecture supports operational administration without introducing an insecure hidden-button model.
- Future server-side administration can preserve the same data contracts.

### Trade-offs

- The first administrator requires a trusted bootstrap step.
- Firestore rules are more complex and need emulator tests.
- Client-managed administration remains inappropriate for secrets or high-risk billing operations.
- Large user and audit datasets will require pagination.

## Supersession rule

A future backend-only administration model may supersede the write path, but it must preserve immutable audit history and narrow permissions.
