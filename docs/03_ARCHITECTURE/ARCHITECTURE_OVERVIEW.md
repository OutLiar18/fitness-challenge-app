# Champions Legacy Challenge — Architecture Overview

Last updated: 4 August 2026  
Current release target: v0.23.0  
Current production: v0.20.0

## Layers

1. React route/component presentation.
2. Context/provider subscriptions for signed-in and season data.
3. Pure domain models for points, seasons, evidence, published standings and active entry history.
4. Firestore orchestration services and atomic write plans.
5. Firestore Security Rules as the client trust boundary.
6. Firebase Authentication and branded Hosting.

## v0.20.0 correction architecture

- `entryHistoryModel.js` resolves immutable raw entry versions into one active personal-history view while preserving the full correction chain.
- `entryCorrectionModel.js` owns correction invariants, replacement point allocation, contribution grouping and targeted integrity diagnostics.
- `entryCorrectionService.js` owns Platform Administrator search, integrity bundles and the atomic reversal-and-replacement transaction.
- `entryCorrectionHeads` stores one forward-only current-version pointer per correction root.
- `entryCorrections` stores immutable reasons, sequence, affected records and reconciliation metadata.
- `PlayerDataProvider` exposes active entries to goals, progression, analytics and records while retaining raw history for the Journal and export.
- `EntryIntegrityWorkspace` exposes correction and diagnostic operations only to Platform Administrators.
- Firestore Rules validate replacement entry shape, correction records, head progression, signed contribution reconciliation and evidence-claim supersession.

## Existing evidence and season architecture

- `evidenceModel.js` owns policy normalization, claim identities, verification codes, point allocation, deadlines, Platform Administrator authority and decision validation.
- `evidenceService.js` owns subscriptions, Platform Administrator-only transactional decisions, notifications and snapshot publication.
- `entryRepository.js` creates source entries, immediate contributions and evidence claims atomically.
- `leagueModel.js` calculates evidence-aware live standings and honours from immutable contributions.
- `SeasonCommandCentre` derives role-aware operational priorities without changing scoring or evidence authority.

## Current architectural decisions

ADR-021 through ADR-027 define the current season, information architecture, progressive disclosure, account-control, external-evidence, operations and correction foundations. Older Team ADRs remain historical and may be superseded.

## Privileged administrative writes

Platform-Admin-only evidence decisions and factual correction transactions use a trusted administrative transaction boundary. Firestore Rules continue to enforce role, identity, audit linkage, immutable history and status-transition invariants, while duplicated derived/presentation fields are validated by the application workflow rather than recomputed again inside Rules.

## Security and trust boundary

The current no-cost iteration performs constrained transactions from the client, but the client cannot grant authority. Rules validate document shape, atomic relationships, immutable history and role scope. Only Platform Administrators may create factual corrections. A future trusted backend remains recommended for prize-bearing competition, scheduled publication, whole-season reconciliation and destructive account operations.

## Scale guardrails

- Historical entries, contributions, decisions, correction records and published snapshots remain immutable.
- Correction heads are the only mutable correction pointer and move forward one sequence at a time.
- League Administrators may read managed-season evidence for operations; only Platform Administrators may make evidence decisions.
- Player standings read the latest published snapshot rather than all live contributions.
- Journal rendering is paginated by recorded day, although the underlying owner entry subscription still loads the full personal history.
- Whole-database reconciliation and trusted server recalculation remain future work.

## v0.21.0 trusted operations boundary

<!-- RELEASE_STATUS: DEPLOYED -->

The browser application remains a Firebase client governed by Security Rules. Prize-bearing season reconciliation now has a separate local Node.js Admin SDK boundary. The pure `trustedSeasonModel` is shared with domain tests; the CLI loads production records, writes local reports and performs elevated publication only after explicit confirmation. No credential enters the client bundle or repository.

## v0.23 Power Play slice

Power Plays follow the existing configuration → service → derived-view architecture.

- `src/constants/powerPlays.js` owns approved categories, multipliers and limits.
- `powerPlayModel.js` owns pure validation, week resolution, deterministic selection and multiplier application.
- `powerPlayService.js` owns audited Firestore transactions, notifications and role-scoped subscriptions.
- `PowerPlayWorkspace` provides draft configuration and weekly operations.
- `leagueModel.js`, honours, Command Centre and trusted reconciliation consume the same pure multiplier helper.
- Firestore Rules validate frozen definitions and no-repeat state; browser clients cannot invent alternate formulas.

## Checkpoint 8I derived-record compaction

Trusted administrative outputs now use a narrower Rules boundary. Evidence and correction contributions remain linked to their immutable decision/correction records; evidence notifications remain linked to the claim owner; and published leaderboard snapshots still require the atomic league publication pointer. This removes repeated reads and duplicated comparisons from derived records while leaving player-originated contribution validation unchanged.

## Checkpoint 8J trusted Platform operations

Administrative content and support workflows now share the trusted Platform Administrator boundary already used by evidence/correction administration. Browser services still build the complete validated payload, and Firestore Rules retain authorization, transition, actor/time, audit-link and immutability guarantees. Ordinary-player creation paths are not widened.
