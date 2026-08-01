# Champions Legacy

# Security Model

---

# Purpose

This document defines the security philosophy and access model used throughout Champions Legacy.

Security exists to protect user data, preserve fair competition and ensure users only have access to information they are authorised to view or modify.

This document defines security responsibilities rather than implementation details.

---

# Security Philosophy

Champions Legacy follows the principle:

> Users own their own data.

Every document, service and feature should clearly define ownership before implementation begins.

Security should be enforced through multiple layers:

- Authentication
- Authorisation
- Firestore Rules
- Service Validation
- UI Permissions

No single layer should be trusted on its own.

---

# Design Principles

The security model follows these principles:

- Least privilege by default.
- Every document has a clear owner.
- Users may only modify their own data unless explicitly authorised.
- Business rules should never rely solely on the client.
- Sensitive operations should always be validated.

---

# User Ownership

Every user owns:

- Profile
- Entries
- Library
- Journal
- Personal Statistics
- Personal Progress
- Settings

Users should be able to:

- Read their own data.
- Modify their own data.
- Delete their own data where appropriate.

Users should never directly modify another user's personal data.

---

# Administrator Permissions

Administrators manage platform functionality rather than personal user information.

Typical permissions include:

- Create Challenges
- Configure Leagues
- Manage Teams
- Publish Announcements
- View Competition Statistics
- Moderate inappropriate content

Administrators should not receive unrestricted database access unless explicitly required.

---

# League Permissions

League management may allow authorised users to:

- Create seasons
- Manage participants
- Assign teams
- Publish leaderboards
- End seasons

League permissions should remain separate from platform administration.

---

# Service Responsibilities

Security checks should occur before business logic executes.

Services should validate:

- Ownership
- Permissions
- Data integrity
- Allowed operations

Services should never assume the client is trustworthy.

---

# Firestore Responsibilities

Firestore security rules are responsible for:

- Authentication checks
- Ownership validation
- Read permissions
- Write permissions

Firestore should not contain business logic.

---

# Client Responsibilities

The client application should:

- Hide unavailable actions.
- Display meaningful permission errors.
- Prevent accidental misuse.

Client-side checks improve user experience but do not replace server-side security.

---

# Future Security Features

Future versions may introduce:

- Moderators
- Team Captains
- League Organisers
- Public Profiles
- Shared Libraries
- Community Resources
- Role-Based Access Control (RBAC)

New roles should extend the existing permission model rather than replace it.

---

# Security Layers

```
User
    │
Authentication
    │
Authorisation
    │
Firestore Rules
    │
Business Services
    │
Stored Data
```

Every layer contributes to overall security.

---

# Guiding Principle

Security should protect users without creating unnecessary complexity.

Permissions should be predictable, consistent and easy to understand.