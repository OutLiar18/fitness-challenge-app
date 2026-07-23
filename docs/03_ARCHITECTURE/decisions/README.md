# Champions Legacy

# Architecture Decisions

---

# Purpose

This document records the most important architectural decisions behind Champions Legacy.

It exists to explain why the application is structured the way it is and to prevent future changes from accidentally undoing important design choices.

Only decisions that affect multiple systems or create long-term constraints belong here.

---

# Decision 1: Categories Are the Single Source of Truth

## Decision

Category configuration defines shared category information such as:

- Names
- Fields
- Units
- Daily goals
- Goal types
- Validation rules
- Scoring references

Forms, services and UI components should read from this configuration instead of maintaining separate copies.

## Reason

Duplicating category information across the application would create inconsistencies and make new categories harder to add.

## Result

- Less duplicated code
- More consistent behaviour
- Easier category expansion
- Simpler maintenance

---

# Decision 2: Firestore Stores Facts Only

## Decision

Firestore stores factual user data such as:

- Category
- Amount
- Quantity
- Duration
- Distance
- Exercise
- Sets
- Repetitions
- Date
- Notes

Derived values should normally not be stored.

Examples of derived values include:

- Points
- Statistics
- Progress
- Completion percentages
- Achievements

## Reason

Scoring and progression rules may change over time.

Keeping the original facts allows the application to recalculate results without rewriting historical entries.

## Result

- Historical data remains usable
- Scoring rules can evolve
- Fewer data migrations
- More reliable analytics

---

# Decision 3: Points and Statistics Are Separate Systems

## Decision

Points and statistics must remain separate.

The Points Service calculates rewards.

The Statistics Service reports factual activity and progress.

Statistics may use point results for display where required, but it should not own the scoring rules.

## Reason

Points are a motivational system and may be rebalanced.

Statistics should remain stable and factual even when scoring changes.

## Result

- Scoring can be adjusted safely
- Analytics remain reliable
- Services have clearer responsibilities
- Less coupling between systems

---

# Decision 4: Business Logic Belongs in Services

## Decision

Business logic should be implemented in services rather than React components.

Components should mainly:

- Display information
- Collect user input
- Handle interaction
- Call services
- Present results

## Reason

Components become difficult to understand and reuse when calculations, validation and data rules are embedded inside them.

## Result

- Smaller components
- Reusable logic
- Easier testing
- Easier debugging
- Cleaner architecture

---

# Decision 5: Behaviour Is Configuration-Driven

## Decision

Where practical, behaviour should be controlled through configuration rather than repeated hardcoded conditions.

This applies to systems such as:

- Categories
- Forms
- Validation
- Daily goals
- Point rules
- Exercise definitions
- Difficulty levels

## Reason

Configuration allows systems to expand without rewriting the same business logic.

## Result

- Faster feature expansion
- Reduced duplication
- More consistent behaviour
- Easier balancing and maintenance

---

# Decision 6: Forms Are Generated Dynamically

## Decision

Challenge entry forms should be generated from category configuration wherever possible.

Specialised forms should only be used when a category genuinely requires unique behaviour.

## Reason

Creating a separate form for every category would duplicate validation, field rendering and submission logic.

## Result

- Consistent forms
- Less repeated code
- Easier category creation
- Lower maintenance effort

---

# Decision 7: Workout Progress Uses Effective Repetitions

## Decision

Workout progress and scoring may account for:

- Sets
- Repetitions
- Exercise difficulty
- Static-hold conversions
- Effective repetitions

Different exercises may contribute differently, but difficulty differences should remain moderate so that users are rewarded without less advanced players being discouraged.

## Reason

Raw repetitions alone do not always represent comparable effort.

The system must reward harder exercises while still prioritising consistency and personal improvement.

## Result

- More balanced workout scoring
- Greater exercise variety
- Fairer comparison of effort
- Support for future exercise expansion

---

# Decision 8: Mobile-First Development

## Decision

Every feature should be designed for the smallest supported smartphone before being expanded for larger screens.

## Reason

Most users are expected to interact with the application on mobile devices.

## Result

- Better touch interaction
- Simpler layouts
- Improved accessibility
- More reliable responsive design

---

# Decision 9: Image Proof Is Excluded From the Current Version

## Decision

The current application does not use:

- Firebase Storage
- Image uploads
- Photo proof submissions

## Reason

The application should remain functional within Firebase's free tier and avoid unnecessary storage costs and complexity.

## Result

- Lower operating cost
- Simpler infrastructure
- No dependency on uploaded evidence
- Proof features may return in a future paid or expanded version

---

# Changing a Decision

A decision should only be changed when:

- The current approach is preventing development.
- The project's requirements have materially changed.
- A better solution provides clear long-term value.
- The consequences have been considered.

When a decision changes, update this document and the relevant architecture documentation.

---

# End of Document