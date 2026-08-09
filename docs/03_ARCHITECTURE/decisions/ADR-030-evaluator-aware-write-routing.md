# ADR-030 — Evaluator-Aware Write Routing

Status: Accepted for v0.24.0 Checkpoint 8K

## Context

The v0.24 Rules suite could pass while some expected-denial paths still logged Firestore's 1,000-expression evaluator ceiling. The remaining messages were concentrated at two broad `allow update` OR-chains: league updates and Power Play week updates. Each operation-specific validator was already restrictive, but a denied request could force the evaluator through several unrelated expensive branches.

## Decision

Route the request before invoking the expensive validator.

- League updates inspect `request.resource.data.diff(resource.data).affectedKeys()` and select exactly one operation family: participant count, lifecycle status, C.H.A.O.S., leaderboard publication, Power Play policy, or Power Play state.
- Participant-count updates retain their existing registration/member-transaction validator. Every other league-update family still requires league-administrator authority before its original validator runs.
- Mixed-operation writes remain denied because the selected validator still restricts its complete affected-key set with `hasOnly(...)`.
- Power Play week updates use the existing official-week boundary: before `startDate` they can only enter redraw validation; at or after `startDate` they can only enter Platform Administrator correction validation.
- Account deletion request creation and reopening reuse one requested-state validator. The create key whitelist, reopen affected-key whitelist, ownership checks, seven-day policy, timestamps and empty processing/completion state remain unchanged.

## Consequences

The accepted write contracts do not broaden. Evaluation work is concentrated on the validator relevant to the attempted operation, reducing the risk that a denial succeeds only because unrelated OR branches exhaust the evaluator. The complete Rules-suite emulator log becomes a release gate: any `maximum of 1000 expressions` message fails Checkpoint 8K.
