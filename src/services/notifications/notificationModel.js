export const PLAYER_NOTIFICATION_TYPES = Object.freeze({
  CHAOS_ASSIGNMENT: "chaos-assignment",
  LEADERSHIP_VOTE_OPEN: "leadership-vote-open",
  LEADERSHIP_RESULT: "leadership-result",
  ROSTER_SWAP: "roster-swap",
  POCKET_REDEEMED: "pocket-redeemed",
  SEASON_NOTICE: "season-notice",
  EVIDENCE_ACCEPTED: "evidence-accepted",
  EVIDENCE_REJECTED: "evidence-rejected",
  EVIDENCE_BONUS_AWARDED: "evidence-bonus-awarded",
  EVIDENCE_DECISION_REVERSED: "evidence-decision-reversed",
  EVIDENCE_DEADLINE_MISSED: "evidence-deadline-missed",
});

export function sortNotificationsNewestFirst(items = []) {
  return [...items].sort((first, second) => {
    const firstTime = first.createdAt?.toMillis?.() ?? new Date(first.createdAt ?? 0).getTime();
    const secondTime = second.createdAt?.toMillis?.() ?? new Date(second.createdAt ?? 0).getTime();
    return secondTime - firstTime;
  });
}

export function getUnreadNotifications(items = []) {
  return items.filter((item) => !item.readAt);
}
