import {
  DEFAULT_LEAGUE_RULESET,
  LEAGUE_MODES,
  LEAGUE_STATUSES,
  LEAGUE_TYPES,
} from "../../constants/leagues";
import {
  SEASON_HOUSE_LIMITS,
} from "../../constants/seasons";
import { validateEvidencePolicy } from "../evidence/evidenceModel";
import { addDays, getLocalDateKey, normalizeChallengeDate } from "../dateService";

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
    : "season";
  const houseCount = Number(input.houseCount ?? 6);
  const pocketStartDate = startDate ? addDays(startDate, -7) : null;
  const pocketEndDate = startDate ? addDays(startDate, -1) : null;
  const evidenceValidation = validateEvidencePolicy(input.evidencePolicy ?? {});
  const value = {
    name: cleanText(input.name, 70),
    description: cleanText(input.description, 400),
    theme: cleanText(input.theme, 80),
    type,
    mode,
    houseCount,
    pocketEnabled: input.pocketEnabled !== false,
    pocketStartDate,
    pocketEndDate,
    startDate,
    endDate,
    ruleset: {
      ...DEFAULT_LEAGUE_RULESET,
      modules: { ...DEFAULT_LEAGUE_RULESET.modules },
      evidencePolicy: evidenceValidation.value,
    },
  };
  const errors = [...evidenceValidation.errors];

  if (value.name.length < 4) {
    errors.push("League name must contain at least 4 characters.");
  }

  if (value.description.length < 15) {
    errors.push("Explain the purpose of this league.");
  }

  if (value.theme.length < 3) {
    errors.push("Add a season theme, such as South African Animals or Predators.");
  }

  if (
    mode === "season" &&
    (!Number.isInteger(houseCount) ||
      houseCount < SEASON_HOUSE_LIMITS.minimum ||
      houseCount > SEASON_HOUSE_LIMITS.maximum)
  ) {
    errors.push(`Choose between ${SEASON_HOUSE_LIMITS.minimum} and ${SEASON_HOUSE_LIMITS.maximum} Houses.`);
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

export function canManageLeague(league, userId, isPlatformAdmin = false) {
  return Boolean(
    isPlatformAdmin ||
      (userId && league?.administratorIds?.includes(userId)),
  );
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
  const playerDays = new Map();
  const housePlayerDays = new Map();
  const includedCategories = new Set(ruleset.includedCategories ?? []);

  contributions.forEach((contribution) => {
    const scoreCategory = contribution.scoreCategory || contribution.category;
    if (!includedCategories.has(scoreCategory)) return;

    const dateKey = getContributionDateKey(contribution);
    const userId = contribution.userId;
    if (!dateKey || !userId) return;

    const points = Number(contribution.activityPoints ?? 0);
    if (!Number.isFinite(points)) return;

    const pointGroup = contribution.pointGroup === "evidenceBonus"
      ? "evidenceBonus"
      : "activity";
    const playerKey = `${userId}:${dateKey}`;
    const playerDay = playerDays.get(playerKey) ?? createContributionDay({
      userId,
      dateKey,
    });
    addContributionToDay(playerDay, {
      ...contribution,
      scoreCategory,
      pointGroup,
      points,
    });
    playerDays.set(playerKey, playerDay);

    const houseId = contribution.houseId || contribution.teamId || "";
    const houseName = contribution.houseName || contribution.teamName || "Unassigned";
    const houseEmblemId = contribution.houseEmblemId || "springbok";
    const houseKey = `${houseId || `unassigned:${userId}`}:${userId}:${dateKey}`;
    const houseDay = housePlayerDays.get(houseKey) ?? createContributionDay({
      houseId,
      houseName,
      houseEmblemId,
      userId,
      dateKey,
    });
    addContributionToDay(houseDay, {
      ...contribution,
      scoreCategory,
      pointGroup,
      points,
    });
    housePlayerDays.set(houseKey, houseDay);
  });

  const activityCap = Number(ruleset.dailyActivityCap ?? 20);
  const participationBonus = Number(ruleset.dailyParticipationBonus ?? 5);
  const fruitServingCap = Number(ruleset.evidencePolicy?.fruitDailyServingCap ?? 5);
  const fruitPointCap = Math.max(0, fruitServingCap * 5);
  const playerRows = new Map();

  playerDays.forEach((day) => {
    const totals = finalizeContributionDay(day, {
      activityCap,
      participationBonus,
      fruitPointCap,
    });
    if (totals.totalPoints <= 0) return;

    const member = memberMap.get(day.userId) ?? {};
    const row = playerRows.get(day.userId) ?? createPlayerStanding(member, day.userId);
    row.activityPoints += totals.activityPoints;
    row.consistencyPoints += totals.consistencyPoints;
    row.evidenceBonusPoints += totals.evidenceBonusPoints;
    row.activeDays += totals.activeDay ? 1 : 0;
    row.entriesRecorded += day.entryIds.size;
    row.totalPoints = row.activityPoints + row.consistencyPoints + row.evidenceBonusPoints;
    playerRows.set(day.userId, row);
  });

  memberships.forEach((member) => {
    if (!playerRows.has(member.userId)) {
      playerRows.set(member.userId, createPlayerStanding(member, member.userId));
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

  const houseRows = new Map();
  housePlayerDays.forEach((day) => {
    const totals = finalizeContributionDay(day, {
      activityCap,
      participationBonus,
      fruitPointCap,
    });
    if (totals.totalPoints <= 0) return;

    const houseKey = day.houseId || `unassigned:${day.userId}`;
    const row = houseRows.get(houseKey) ?? {
      houseId: day.houseId,
      houseName: day.houseName,
      houseEmblemId: day.houseEmblemId,
      teamId: day.houseId,
      teamName: day.houseName,
      totalPoints: 0,
      activityPoints: 0,
      consistencyPoints: 0,
      evidenceBonusPoints: 0,
      activeDays: 0,
      contributingPlayerIds: new Set(),
    };
    row.activityPoints += totals.activityPoints;
    row.consistencyPoints += totals.consistencyPoints;
    row.evidenceBonusPoints += totals.evidenceBonusPoints;
    row.totalPoints += totals.totalPoints;
    row.activeDays += totals.activeDay ? 1 : 0;
    row.contributingPlayerIds.add(day.userId);
    houseRows.set(houseKey, row);
  });

  const houses = [...houseRows.values()]
    .map((row) => ({
      ...row,
      memberCount: row.contributingPlayerIds.size,
      contributingPlayerIds: undefined,
    }))
    .sort(
      (first, second) =>
        second.totalPoints - first.totalPoints ||
        second.activeDays - first.activeDays ||
        first.houseName.localeCompare(second.houseName),
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));

  return { players, houses, teams: houses };
}

function createContributionDay(identity = {}) {
  return {
    ...identity,
    categoryPoints: new Map(),
    evidenceBonusPoints: 0,
    entryIds: new Set(),
  };
}

function addContributionToDay(day, contribution) {
  if (contribution.pointGroup === "evidenceBonus") {
    day.evidenceBonusPoints += contribution.points;
  } else {
    day.categoryPoints.set(
      contribution.scoreCategory,
      (day.categoryPoints.get(contribution.scoreCategory) ?? 0) + contribution.points,
    );
  }
  if (contribution.entryId) day.entryIds.add(contribution.entryId);
}

function finalizeContributionDay(day, {
  activityCap,
  participationBonus,
  fruitPointCap,
}) {
  let rawActivityPoints = 0;
  day.categoryPoints.forEach((points, category) => {
    const nonNegative = Math.max(0, Number(points) || 0);
    rawActivityPoints += category === "fruit"
      ? Math.min(fruitPointCap, nonNegative)
      : nonNegative;
  });
  const activityPoints = Math.min(activityCap, rawActivityPoints);
  const activeDay = activityPoints > 0;
  const consistencyPoints = activeDay ? participationBonus : 0;
  const evidenceBonusPoints = Math.max(0, Number(day.evidenceBonusPoints) || 0);
  return {
    activityPoints,
    consistencyPoints,
    evidenceBonusPoints,
    activeDay,
    totalPoints: activityPoints + consistencyPoints + evidenceBonusPoints,
  };
}

function createPlayerStanding(member = {}, userId = "") {
  const houseId = member.currentHouseId || member.houseId || member.teamId || "";
  const houseName = member.currentHouseName || member.houseName || member.teamName || "Unassigned";
  return {
    userId,
    displayName: member.displayName || "Champion",
    avatarId: member.avatarId || "legacy-trophy",
    houseId,
    houseName,
    houseEmblemId: member.currentHouseEmblemId || member.houseEmblemId || "springbok",
    teamId: houseId,
    teamName: houseName,
    activityPoints: 0,
    consistencyPoints: 0,
    evidenceBonusPoints: 0,
    totalPoints: 0,
    activeDays: 0,
    entriesRecorded: 0,
  };
}

export function isEntryWithinLeague(entry, league) {
  const entryDate = normalizeChallengeDate(entry?.challengeDate);
  const startDate = normalizeChallengeDate(league?.startDate);
  const endDate = normalizeChallengeDate(league?.endDate);

  return Boolean(entryDate && startDate && endDate && entryDate >= startDate && entryDate <= endDate);
}

const SEASON_HONOUR_CATEGORIES = Object.freeze([
  { id: "running", title: "Running Champion" },
  { id: "cardio", title: "Cardiovascular Exercise Champion" },
  { id: "reading", title: "Reading Champion" },
  { id: "upperBody", title: "Upper Body Workout Champion" },
  { id: "core", title: "Core Workout Champion" },
  { id: "lowerBody", title: "Lower Body Workout Champion" },
  { id: "water", title: "Water Intake Champion" },
  { id: "fruit", title: "Fresh Fruit Consumption Champion" },
  { id: "steps", title: "Step Count Champion" },
  { id: "skill", title: "New Skill Champion" },
]);

function getMemberIdentity(memberMap, userId) {
  const member = memberMap.get(userId) ?? {};
  return {
    userId,
    displayName: member.displayName || "Champion",
    avatarId: member.avatarId || "legacy-trophy",
  };
}

function rankCategoryContributors(contributions, category, memberMap, ruleset) {
  const dailyRows = new Map();
  contributions.forEach((contribution) => {
    const scoreCategory = contribution.scoreCategory || contribution.category;
    if (scoreCategory !== category || !contribution.userId) return;
    const dateKey = getContributionDateKey(contribution);
    if (!dateKey) return;
    const key = `${contribution.userId}:${dateKey}`;
    const row = dailyRows.get(key) ?? {
      userId: contribution.userId,
      dateKey,
      points: 0,
      entryIds: new Set(),
    };
    row.points += Number(contribution.activityPoints ?? 0);
    if (contribution.entryId) row.entryIds.add(contribution.entryId);
    dailyRows.set(key, row);
  });

  const rows = new Map();
  const fruitPointCap = Number(ruleset.evidencePolicy?.fruitDailyServingCap ?? 5) * 5;
  dailyRows.forEach((day) => {
    const row = rows.get(day.userId) ?? {
      ...getMemberIdentity(memberMap, day.userId),
      points: 0,
      entries: 0,
    };
    const points = Math.max(0, Number(day.points) || 0);
    row.points += category === "fruit" ? Math.min(fruitPointCap, points) : points;
    row.entries += day.entryIds.size;
    rows.set(day.userId, row);
  });

  return [...rows.values()].sort(
    (first, second) =>
      second.points - first.points ||
      second.entries - first.entries ||
      first.displayName.localeCompare(second.displayName),
  );
}

function rankHouseContributors(contributions, memberships, ruleset) {
  const memberMap = new Map(memberships.map((member) => [member.userId, member]));
  const days = new Map();

  contributions.forEach((contribution) => {
    const dateKey = getContributionDateKey(contribution);
    const houseId = contribution.houseId || contribution.teamId || "";
    if (!dateKey || !houseId || !contribution.userId) return;
    const scoreCategory = contribution.scoreCategory || contribution.category;
    const key = `${houseId}:${contribution.userId}:${dateKey}`;
    const day = days.get(key) ?? createContributionDay({
      houseId,
      houseName: contribution.houseName || contribution.teamName || "House",
      houseEmblemId: contribution.houseEmblemId || "springbok",
      userId: contribution.userId,
      dateKey,
    });
    addContributionToDay(day, {
      ...contribution,
      scoreCategory,
      pointGroup: contribution.pointGroup === "evidenceBonus" ? "evidenceBonus" : "activity",
      points: Number(contribution.activityPoints ?? 0),
    });
    days.set(key, day);
  });

  const rows = new Map();
  const activityCap = Number(ruleset.dailyActivityCap ?? 20);
  const participationBonus = Number(ruleset.dailyParticipationBonus ?? 5);
  const fruitPointCap = Number(ruleset.evidencePolicy?.fruitDailyServingCap ?? 5) * 5;
  days.forEach((day) => {
    const totals = finalizeContributionDay(day, {
      activityCap,
      participationBonus,
      fruitPointCap,
    });
    if (totals.totalPoints <= 0) return;
    const key = `${day.houseId}:${day.userId}`;
    const row = rows.get(key) ?? {
      houseId: day.houseId,
      houseName: day.houseName,
      houseEmblemId: day.houseEmblemId,
      ...getMemberIdentity(memberMap, day.userId),
      totalPoints: 0,
      activeDays: 0,
    };
    row.totalPoints += totals.totalPoints;
    row.activeDays += totals.activeDay ? 1 : 0;
    rows.set(key, row);
  });

  const byHouse = new Map();
  rows.forEach((row) => {
    const list = byHouse.get(row.houseId) ?? [];
    list.push(row);
    byHouse.set(row.houseId, list);
  });

  return [...byHouse.values()]
    .map((rowsForHouse) => [...rowsForHouse].sort(
      (first, second) =>
        second.totalPoints - first.totalPoints ||
        second.activeDays - first.activeDays ||
        first.displayName.localeCompare(second.displayName),
    )[0])
    .filter(Boolean)
    .sort((first, second) => first.houseName.localeCompare(second.houseName));
}

export function calculateSeasonHonours(
  contributions = [],
  memberships = [],
  ruleset = DEFAULT_LEAGUE_RULESET,
) {
  const standings = calculateLeagueStandings(contributions, memberships, ruleset);
  const memberMap = new Map(memberships.map((member) => [member.userId, member]));
  const awardedPlayerIds = new Set();
  const individual = [];

  const legacyChampion = standings.players[0];
  if (legacyChampion && legacyChampion.totalPoints > 0) {
    individual.push({
      id: "legacy",
      title: "Legacy Champion",
      ...getMemberIdentity(memberMap, legacyChampion.userId),
      points: legacyChampion.totalPoints,
    });
    awardedPlayerIds.add(legacyChampion.userId);
  }

  SEASON_HONOUR_CATEGORIES.forEach((honour) => {
    const ranked = rankCategoryContributors(contributions, honour.id, memberMap, ruleset);
    const winner = ranked.find((candidate) => candidate.points > 0 && !awardedPlayerIds.has(candidate.userId));
    if (!winner) return;
    individual.push({ id: honour.id, title: honour.title, ...winner });
    awardedPlayerIds.add(winner.userId);
  });

  return {
    individual,
    houseChampions: rankHouseContributors(contributions, memberships, ruleset),
    houseOfChampions: standings.houses[0] ?? null,
  };
}
