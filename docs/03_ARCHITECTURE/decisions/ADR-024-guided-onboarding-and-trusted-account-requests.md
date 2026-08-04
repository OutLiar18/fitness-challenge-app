# ADR-024 — Guided onboarding and trusted account requests

Status: Accepted  
Date: 4 August 2026

## Context

The product needs a clearer first-use experience, plain-language privacy guidance, a player-readable data export and an account-deletion path before v1.0. A browser-only Firebase client cannot safely erase Authentication, private records and shared season history in one trusted atomic operation.

## Decision

1. New profiles start with `onboardingVersion: 0`; a four-step accessible guide appears after sign-in.
2. Legacy profiles without an onboarding field are not interrupted. Players can replay the guide from Help & Privacy.
3. Help & Privacy is the single player-facing location for getting-started guidance, data explanations, privacy boundaries and account tools.
4. Personal export is generated on demand from account-owned Firestore records readable by the signed-in player. It is a portable JSON file and does not create a second stored copy.
5. Account deletion is represented by one `accountDeletionRequests/{userId}` document. Players may request, cancel or reopen it. Platform Administrators may acknowledge it only with an audit event.
6. Acknowledgement is not deletion. Final Firebase Authentication and eligible-record removal remains a trusted operational process until a server-side deletion worker exists.
7. Completed shared season history must not be silently rewritten during account closure.

## Consequences

- New users receive a focused introduction without disturbing existing players.
- Players gain transparent data access and a reviewable deletion path.
- Security Rules gain narrowly scoped onboarding and request validation.
- Platform Administrators receive an auditable request queue.
- Automatic self-service deletion remains deferred and must not be implied by the UI.
