# Champions Legacy Challenge — Data Model

Last updated: 1 August 2026  
Current release: v0.9.0

## Principle

Store facts and trusted decisions. Derive progress.

## Core entities

### Player profile

Permanent identity and trusted account metadata:

- Firebase user identifier;
- first, last, full and display names;
- email;
- approved Legacy Avatar identifier;
- role and team;
- joined and profile-update timestamps;
- audited administrative update metadata where applicable.

### Challenge entry

One immutable factual activity record containing:

- owner;
- category;
- category-specific factual data;
- creation timestamp;
- local-calendar challenge date.

### Personal library item

A reusable player-owned resource, currently used primarily for Reading.

### Suggestion

A proposed Exercise, Cardio activity or Skill definition with:

- submitting player;
- originating activity entry;
- proposed definition;
- pending, approved or rejected state;
- reviewer and feedback metadata;
- audit identifier after review.

### Announcement

A live platform message with content, type, status, authorship, publication date and audit identifier.

### Announcement read record

A player-owned marker that an announcement has been read.

### Audit event

An immutable record of a privileged operation containing actor, action, entity, summary, details and server timestamp.

## Derived systems

The following are recalculated from factual entries and versioned configuration:

- activity points;
- daily and weekly goal progress;
- goal and mission bonus points;
- streaks and shield state;
- experience points and levels;
- achievements;
- personal records;
- progress timeline.

## Relationships

```text
Player
├── owns Profile
├── owns Library Items
├── owns Announcement Read Records
├── creates Challenge Entries
└── submits Suggestions

Platform Administrator
├── manages Announcements
├── reviews Suggestions
├── manages another Player's trusted role/team
└── creates immutable Audit Events with each privileged action
```

## Versioning requirement

Future global libraries, challenges, leagues and seasons must record the configuration version used to produce competitive results. Historical results may not silently change when current rules change.
