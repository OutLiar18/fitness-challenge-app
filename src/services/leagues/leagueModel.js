import {
  DEFAULT_LEAGUE_RULESET,
  LEAGUE_MODES,
  LEAGUE_STATUSES,
  LEAGUE_TYPES,
} from "../../constants/leagues";
import { getLocalDateKey, normalizeChallengeDate } from "../dateService";

const LEAGUE_TRANSITIONS = Object.freeze({
  [LEAGUE_STATUSES.DRAFT]: [LEAGUE_STATUSES.REGISTRATION],
  [LEAGUE_STATUSES.REGISTRATION]: [LEAGUE_STATUSES.ACTIVE],
  [LEAGUE_STATUSES.ACTIVE]: [LEAGUE_STATUSES.COMPLETED],
  [LEAGUE_STATUSES.COMPLETED]: [LEAGUE_STATUSES.ARCHIVED],
  [LEAGUE_STATUSES.ARCHIVED]: [],
});

function cleanText(value, maximumLength = 240) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maximumLength);
}

export function validateLeagueInput(input = {}) {
  const startDate = normalizeChallengeDate(input.startDate);
  const endDate = normalizeChallengeDate(input.endDate);
  const type = LEAGUE_TYPES.includes(input.type) ? input.type : LEAGUE_TYPES[0];
  const mode = LEAGUE_MODES.some((item) => item.id === input.mode)
    ? input.mode
    : "individual";
  const value = {
    name: cleanText(input.name, 70),
    description: cleanText(input.description, 400),
    type,
    mode,
    startDate,
    endDate,
    ruleset: { ...DEFAULT_LEAGUE_RULESET },
  };
  const errors = [];

  if (value.name.length < 4) {
    errors.push("League name must contain at least 4 characters.");
  }

  if (value.description.length < 15) {
    errors.push("Explain the purpose of this league.");
  }

  if (!startDate || !endDate) {
    errors.push("Choose valid league dates.");
  } else if (endDate <= startDate) {
    errors.push("The league end date must be after its start date.");
  }

  return { valid: errors.length === 0, errors, value };
}

export function canTransitionLeague(currentStatus, nextStatus) {
  return LEAGUE_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;
}

export function getLeagueStatusLabel(status) {
  return {
    draft: "Draft",
    registration: "Registration open",
    active: "Active season",
    completed: "Completed",
    archived: "Archived",
  }[status] ?? "Unknown";
}

function getContributionDateKey(contribution) {
  return getLocalDateKey(contribution?.challengeDate);
}

export function calculateLeagueStandings(
  contributions = [],
  memberships = [],
  ruleset = DEFAULT_LEAGUE_RULESET,
) {
  const memberMap = new Map(memberships.map((member) => [member.userId, member]));
  const byPlayerAndDay = new Map();

  contributions.forEach((contribution) => {
    if (!ruleset.includedCategories.includes(contribution.category)) {
      return;
    }

    const dateKey = getContributionDateKey(contribution);
    if (!dateKey || !contribution.userId) {
      return;
    }

    const key = `${contribution.userId}:${dateKey}`;
    const current = byPlayerAndDay.get(key) ?? {
      userId: contribution.userId,
      dateKey,
      activityPoints: 0,
      entryCount: 0,
    };

    current.activityPoints += Math.max(0, Number(contribution.activityPoints ?? 0));
    current.entryCount += 1;
    byPlayerAndDay.set(key, current);
  });

  const playerRows = new Map();

  byPlayerAndDay.forEach((day) => {
    const member = memberMap.get(day.userId) ?? {};
    const row = playerRows.get(day.userId) ?? {
      userId: day.userId,
      displayName: member.displayName || "Champion",
      avatarId: member.avatarId || "legacy-trophy",
      teamId: member.teamId || "",
      teamName: member.teamName || "Independent",
      activityPoints: 0,
      consistencyPoints: 0,
      totalPoints: 0,
      activeDays: 0,
      entriesRecorded: 0,
    };

    row.activityPoints += Math.min(
      Number(ruleset.dailyActivityCap ?? 20),
      day.activityPoints,
    );
    row.consistencyPoints += Number(ruleset.dailyParticipationBonus ?? 5);
    row.activeDays += 1;
    row.entriesRecorded += day.entryCount;
    row.totalPoints = row.activityPoints + row.consistencyPoints;
    playerRows.set(day.userId, row);
  });

  memberships.forEach((member) => {
    if (!playerRows.has(member.userId)) {
      playerRows.set(member.userId, {
        userId: member.userId,
        displayName: member.displayName || "Champion",
        avatarId: member.avatarId || "legacy-trophy",
        teamId: member.teamId || "",
        teamName: member.teamName || "Independent",
        activityPoints: 0,
        consistencyPoints: 0,
        totalPoints: 0,
        activeDays: 0,
        entriesRecorded: 0,
      });
    }
  });

  const players = [...playerRows.values()]
    .sort(
      (first, second) =>
        second.totalPoints - first.totalPoints ||
        second.activeDays - first.activeDays ||
        first.displayName.localeCompare(second.displayName),
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const teamRows = new Map();
  players.forEach((player) => {
    const teamKey = player.teamId || `independent:${player.userId}`;
    const row = teamRows.get(teamKey) ?? {
      teamId: player.teamId,
      teamName: player.teamName,
      totalPoints: 0,
      activeDays: 0,
      memberCount: 0,
    };
    row.totalPoints += player.totalPoints;
    row.activeDays += player.activeDays;
    row.memberCount += 1;
    teamRows.set(teamKey, row);
  });

  const teams = [...teamRows.values()]
    .sort(
      (first, second) =>
        second.totalPoints - first.totalPoints ||
        second.activeDays - first.activeDays ||
        first.teamName.localeCompare(second.teamName),
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));

  return { players, teams };
}

export function isEntryWithinLeague(entry, league) {
  const entryDate = normalizeChallengeDate(entry?.challengeDate);
  const startDate = normalizeChallengeDate(league?.startDate);
  const endDate = normalizeChallengeDate(league?.endDate);

  return Boolean(entryDate && startDate && endDate && entryDate >= startDate && entryDate <= endDate);
}
