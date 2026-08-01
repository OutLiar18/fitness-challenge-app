# Platform Administrator Bootstrap

Version: 0.10.0

## Purpose

The application deliberately provides no self-promotion flow. The first Platform Administrator must be assigned through a trusted Firebase process.

## Recommended development bootstrap

1. Sign in to the Firebase Console.
2. Open project `fitnesschallengeapp-9e87f`.
3. Open Firestore Database.
4. Open `users/{yourFirebaseUid}`.
5. Change `role` from `user` to `admin`.
6. Sign out of Champions Legacy Challenge and sign in again.
7. Confirm the Administration navigation item appears.

The Firebase Console is an operator tool and is not governed by the web client’s Firestore rules. Only trusted project owners should perform this step.

## Production direction

Before public production, prefer a controlled Firebase Admin SDK script or backend function that:

- verifies the operator;
- sets a custom claim such as `admin: true`;
- updates the matching profile role for presentation;
- records an operator audit event outside the ordinary client path.

Custom claim changes require a refreshed authentication token, normally obtained by signing out and signing in again or explicitly refreshing the token.

## Safety rules

- Never add a client button that promotes the signed-in player.
- Never rely only on whether the Administration page is visible.
- Never place service-account credentials in the frontend repository.
- Keep at least one trusted Platform Administrator account available.
