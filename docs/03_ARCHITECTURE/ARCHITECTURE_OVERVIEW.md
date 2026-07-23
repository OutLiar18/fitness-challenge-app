# Champions Legacy

# Architecture Overview

---

# Purpose

This document provides a high-level overview of the Champions Legacy architecture.

It explains how the major architectural systems work together while referring detailed implementation to the specialised architecture documents.

This document should be read first by anyone seeking a technical understanding of the platform.

---

# Architecture Philosophy

Champions Legacy is designed around one guiding principle:

> Clear separation of responsibilities.

Every architectural layer has a specific purpose.

Each layer depends only on the layers beneath it.

Business concepts remain independent from implementation details wherever possible.

---

# Architectural Layers

```
Vision
    │
Product Identity
    │
Core Principles
    │
Mission
    │
Business Model
    │
Configuration
    │
Services
    │
Firestore
    │
React Components
    │
User
```

Every technical decision should ultimately support the product vision.

---

# Core Architecture

The platform consists of the following major systems.

## Data Model

Defines the business concepts used throughout Champions Legacy.

See:

- DATA_MODEL.md

---

## Firestore Structure

Defines how business concepts are stored.

See:

- FIRESTORE_STRUCTURE.md

---

## Service Architecture

Contains the business logic of the platform.

See:

- SERVICE_ARCHITECTURE.md

---

## Component Architecture

Defines how the user interface is organised.

See:

- COMPONENT_ARCHITECTURE.md

---

## Configuration System

Defines behaviour through configuration rather than hard-coded logic.

See:

- CONFIGURATION_SYSTEM.md

---

## Resource Library

Provides reusable user-owned resources across multiple entries.

See:

- LIBRARY_SYSTEM.md

---

## Security Model

Defines ownership, permissions and access control.

See:

- SECURITY_MODEL.md

---

# Request Flow

Most user interactions follow the same path.

```
User
    │
Page
    │
Feature Component
    │
Shared Component
    │
Service
    │
Configuration
    │
Firestore
    │
Service
    │
Component
    │
Updated Interface
```

This predictable flow keeps responsibilities well separated.

---

# Architectural Principles

Champions Legacy follows these principles.

## Configuration Over Customisation

Whenever practical, behaviour should be driven through configuration.

---

## Business Logic Belongs in Services

Components should focus on presentation.

Services should perform calculations.

---

## Firestore Stores Data

Firestore stores information.

It should not contain business rules.

---

## Components Present Information

React components should remain focused on user interaction.

---

## Entities Represent Real Concepts

The data model should describe business concepts rather than implementation details.

---

## Reuse Before Rebuild

Existing architecture should be extended wherever possible.

Duplicated systems should be avoided.

---

# Future Evolution

The architecture is designed to support future systems including:

- AI Coach
- League Mode
- Team Challenges
- Community Features
- Notifications
- Advanced Analytics
- Mobile Applications
- API Integrations

Future systems should integrate with the existing architecture rather than introducing parallel implementations.

---

# Architecture Summary

Champions Legacy is built around seven architectural pillars.

- Data Model
- Firestore Structure
- Service Architecture
- Component Architecture
- Configuration System
- Resource Library
- Security Model

Together these systems create a scalable, maintainable and extensible platform capable of supporting long-term product growth.

---

# Guiding Principle

Architecture should make future development easier.

Every new feature should fit naturally into the existing architecture with minimal duplication and clear responsibilities.