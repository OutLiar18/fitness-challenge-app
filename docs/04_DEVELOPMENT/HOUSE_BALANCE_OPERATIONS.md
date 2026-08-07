# Champions Legacy Challenge — House Movement and Balance Operations

Release: v0.24.0

## Normal roster turn

1. Open Houses and select the active season.
2. Open **Roster turn**.
3. Review each player’s eligibility explanation.
4. Select two different unlocked Houses and one eligible non-leader from each.
5. Confirm the balanced swap.
6. Verify both player notifications, both House locks, the swap record and two assignment-history records.

A moved player must show **Resting after last week’s move** during the following official week.

## Factual-correction override

Use only when a recorded operational mistake must be corrected.

1. Sign in as a Platform Administrator.
2. Select the two affected resting players.
3. Enter a specific reason describing the mistake.
4. Complete the audited correction.
5. Verify `house.roster-swap-overridden` in `auditEvents`.
6. Verify the swap and both history records contain the same reason and overridden player IDs.

Never use the override for an extra tactical move. It cannot bypass:

- a current-week move;
- a House’s current-week lock;
- active leadership protection;
- inactive membership;
- an unbalanced exchange.

## Composition response

Players manage their own optional answer in **Houses → Balance**.

- A player may save, replace or remove the response.
- House leaders must not be given individual response access.
- League/Platform Administrators should use individual responses only for the declared operational balancing purpose.
- Do not export exact responses into ordinary House reports.

## Preserve weekly balance

1. Confirm the season is active and the current roster is correct.
2. Open **Houses → Balance** as an authorised season administrator.
3. Review active player and response counts.
4. Select **Preserve weekly balance snapshot** once.
5. Verify the public and private records share the same ID, week, audit ID and calculation version.
6. Confirm the public view suppresses every House with fewer than three disclosed responses.

The operation is immutable and can run only once per official week. It does not change standings.

## Firestore collections

- `leagueRosterSwaps`
- `leagueRosterLocks`
- `leagueHouseAssignmentHistory`
- `leagueCompositionProfiles`
- `leagueHouseBalanceWeeks`
- `leagueHouseBalancePrivateWeeks`
- `auditEvents`
- `playerNotifications`

## Privacy and deletion

Trusted account deletion:

- deletes `leagueCompositionProfiles` for the player;
- anonymises `leagueHouseAssignmentHistory`;
- removes the deleted player’s exact composition value from private roster snapshots;
- preserves aggregate and historical competition facts under the Former Player identity.

## Release verification

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

Expected targets: 129 domain tests and 57 Firestore Rules tests. Use Java 21. Do not deploy if any gate fails. Never use `npm audit fix` or `npm audit fix --force` during this release.
