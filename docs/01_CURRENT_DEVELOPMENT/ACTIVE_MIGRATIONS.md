# Champions Legacy Challenge — Active Migrations

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 5 August 2026

## v0.23.0 Power Plays

Status: Implementation, Windows verification and production deployment complete; release commit pending.

No bulk migration is required.

- Existing `season-houses-v1` and `season-houses-v2` seasons remain unchanged and Power Play-disabled.
- Newly created seasons use `season-houses-v3` and include a draft Power Play pool.
- Draft v3 seasons may edit theme names, descriptions, enabled state and custom controlled definitions.
- Registration freezes the Power Play policy, including the canonical `powerPlayDefinitions` map.
- Weekly assignment documents are created only when an authorised operator selects a week.

## New records

- `leaguePowerPlayWeeks/{leagueId}_{weekKey}` — immutable factual weekly selection with permitted audited redraw/correction fields.
- `leagues/{leagueId}.powerPlayState` — used-ID and selection-sequence summary used to enforce no-repeat selection.
- `leagues/{leagueId}.ruleset.powerPlayPolicy` — frozen pool and canonical definition map.

## Compatibility

- Existing activity and contribution documents are unchanged.
- Standings derive Power Play multipliers at read/reconciliation time using contribution challenge dates and immutable assignments.
- Running and Steps proof released later uses the Power Play from the original activity week.
- Trusted reconciliation fingerprints include the weekly assignment ledger.
