export const DRAFT_DELETION_ACTIONS = Object.freeze({
  HOUSE: "house.draft-deleted",
  SEASON: "league.draft-deleted",
});

export function draftHouseDeletionAuditId(houseId) {
  return `draft-house-delete_${String(houseId ?? "").trim()}`;
}

export function draftSeasonDeletionAuditId(leagueId) {
  return `draft-season-delete_${String(leagueId ?? "").trim()}`;
}

export function canHardDeleteDraftSeason(league) {
  return Boolean(
    league?.id
      && league.mode === "season"
      && league.inviteCode
      && league.status === "draft"
      && Number(league.participantCount ?? 0) === 0
      && league.chaosStatus === "not-started"
      && !league.activatedAt
      && !league.completedAt
      && !league.archivedAt,
  );
}

export function canHardDeleteDraftHouse({ league, house, memberCount = 0 } = {}) {
  return Boolean(
    canHardDeleteDraftSeason(league)
      && house?.id
      && house.leagueId === league.id
      && Number(memberCount) === 0
      && !house.captainId
      && (house.viceCaptainIds ?? []).length === 0
      && !house.lastElectionId,
  );
}