# Champions Legacy Challenge — Architecture Overview

Last updated: 4 August 2026  
Current release target: v0.18.0  
Current production: v0.17.0

## Layers

1. React route/component presentation.
2. Context/provider subscriptions for signed-in and season data.
3. Pure domain models for points, seasons, evidence and published standings.
4. Firestore orchestration services and atomic write plans.
5. Firestore Security Rules as the client trust boundary.
6. Firebase Authentication and branded Hosting.

## v0.18.0 evidence architecture

- `evidenceModel.js` owns policy normalization, claim identities, verification codes, point allocation, deadlines, permissions and decision validation.
- `evidenceService.js` owns subscriptions, assignments, transactional decisions, notifications and snapshot publication.
- `entryRepository.js` creates source entries, immediate contributions and evidence claims atomically.
- `leagueModel.js` calculates evidence-aware live standings and honours from immutable contributions.
- `EvidenceWorkspace` exposes scoped queues, assignments and publication controls.
- Firestore Rules enforce entry/claim linkage, reviewer scope, atomic evidence decisions and snapshot immutability.

## Current architectural decisions

ADR-021 through ADR-025 define the current season, information architecture, progressive disclosure, account-control and external-evidence foundations. Older Team ADRs remain historical and may be superseded.

## Security and trust boundary

The client derives calculations for the current private challenge iteration, but it cannot grant authority. Rules validate document shape, atomic relationships and role scope. External WhatsApp media is outside app storage and cannot be treated as a Firestore security guarantee.

## Scale guardrails

- Historical contribution and snapshot records are immutable.
- Category reviewers subscribe only to assigned queues.
- Player standings read one latest published snapshot rather than all live contributions.
- Personal entry pagination and trusted server recalculation remain future work.
