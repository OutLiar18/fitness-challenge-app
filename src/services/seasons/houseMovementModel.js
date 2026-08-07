import {
  HOUSE_ROSTER_PLAYER_REST_WEEKS,
} from "../../constants/seasons";
import {
  addDays,
  getLocalDateKey,
  parseDateInputValue,
} from "../dateService";

/**
 * v0.24 checkpoints keep House-movement calculations as pure domain logic.
 * The v4 ruleset version is the frozen House Movement v1 contract; persistence is added only in later checkpoints.
 */
export function supportsHouseMovementV1(league) {
  // v0.24 keeps the security contract deliberately lean: the season ruleset
  // version itself freezes House Movement v1. No redundant nested policy map
  // is required inside the already-complex League document validator.
  return league?.rulesVersion === "season-houses-v4";
}

export function createHouseAssignmentHistoryId(sourceId, userId) {
  return `${sourceId}_${userId}`;
}

export function getRosterRestWindow(weekKey) {
  const start = parseDateInputValue(weekKey);
  if (!start) {
    return {
      lockThroughWeekKey: "",
      eligibleWeekKey: "",
      eligibleAgainAt: null,
    };
  }

  const lockThrough = addDays(start, 7 * HOUSE_ROSTER_PLAYER_REST_WEEKS);
  const eligible = addDays(start, 7 * (HOUSE_ROSTER_PLAYER_REST_WEEKS + 1));

  return {
    lockThroughWeekKey: getLocalDateKey(lockThrough),
    eligibleWeekKey: getLocalDateKey(eligible),
    eligibleAgainAt: eligible,
  };
}

export function getRosterMoveEligibility({
  league,
  membership,
  house,
  weekKey,
  houseLocked = false,
} = {}) {
  if (!membership || membership.status !== "active") {
    return {
      eligible: false,
      code: "inactive-membership",
      label: "Not an active season member",
      detail: "Only active season members can take part in a roster move.",
    };
  }

  if (!membership.currentHouseId || membership.currentHouseId !== house?.id) {
    return {
      eligible: false,
      code: "house-mismatch",
      label: "Not in this House",
      detail: "The player no longer belongs to the selected House.",
    };
  }

  if (
    membership.userId === house?.captainId
      || (house?.viceCaptainIds ?? []).includes(membership.userId)
  ) {
    return {
      eligible: false,
      code: "current-house-leader",
      label: "Current House leader",
      detail: "Leadership must be reassigned before this player can move.",
    };
  }

  if (houseLocked) {
    return {
      eligible: false,
      code: "house-used-weekly-move",
      label: "House already used its weekly move",
      detail: "This House cannot take part in another roster move this week.",
    };
  }

  if (membership.lastRosterWeekKey && membership.lastRosterWeekKey === weekKey) {
    return {
      eligible: false,
      code: "moved-this-week",
      label: "Moved this week",
      detail: "The player has already changed Houses during the current week.",
    };
  }

  if (
    supportsHouseMovementV1(league)
      && membership.rosterLockThroughWeekKey
      && weekKey
      && weekKey <= membership.rosterLockThroughWeekKey
  ) {
    return {
      eligible: false,
      code: "post-move-rest",
      label: "Resting after last week’s move",
      detail: membership.rosterEligibleWeekKey
        ? `Eligible again in the week beginning ${membership.rosterEligibleWeekKey}.`
        : "The one-week post-move rest period is still active.",
      overrideable: true,
    };
  }

  return {
    eligible: true,
    code: "eligible",
    label: "Eligible to move",
    detail: "This player may take part in the current week’s balanced swap.",
    overrideable: false,
  };
}
