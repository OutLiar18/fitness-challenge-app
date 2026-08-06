import {
  POWER_PLAY_CATEGORY_IDS,
  POWER_PLAY_CATEGORY_TEMPLATES,
  POWER_PLAY_MAX_DESCRIPTION_LENGTH,
  POWER_PLAY_MAX_NAME_LENGTH,
  POWER_PLAY_MAX_POOL_SIZE,
  POWER_PLAY_MIN_DESCRIPTION_LENGTH,
  POWER_PLAY_MIN_NAME_LENGTH,
  POWER_PLAY_MULTIPLIERS,
  POWER_PLAY_POLICY_VERSION,
} from "../../constants/powerPlays";
import {
  addDays,
  getLocalDateKey,
  normalizeChallengeDate,
} from "../dateService";

function cleanText(value, maximumLength) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maximumLength);
}

function slug(value) {
  return cleanText(value, 120)
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 44);
}

function stableStringHash(value) {
  let hash = 2166136261;
  String(value ?? "").split("").forEach((character) => {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  });
  return hash >>> 0;
}

function uniqueCategories(categories = []) {
  return [...new Set(categories)].filter((category) =>
    POWER_PLAY_CATEGORY_IDS.includes(category),
  );
}

export function createPowerPlayId({ sourceType = "custom", baseCategory = "", name = "" } = {}) {
  if (sourceType === "base" && POWER_PLAY_CATEGORY_IDS.includes(baseCategory)) {
    return `base-${baseCategory}`;
  }
  const stem = slug(name) || "custom-power-play";
  return `custom-${stem}-${stableStringHash(`${name}:${Date.now()}`).toString(36).slice(0, 6)}`;
}

export function createBasePowerPlayPool(theme = "Season") {
  const cleanTheme = cleanText(theme, 80) || "Season";
  return POWER_PLAY_CATEGORY_TEMPLATES.map((template, index) => ({
    id: `base-${template.id}`,
    sourceType: "base",
    baseCategory: template.id,
    name: `${cleanTheme}: ${template.fallbackTitle}`,
    normalizedName: `${cleanTheme}: ${template.fallbackTitle}`.toLocaleLowerCase(),
    description: `A theme-ready ${template.label} Power Play. Rename it to fit ${cleanTheme} before registration opens.`,
    multiplier: 2,
    categories: [template.id],
    enabled: true,
    themeNameConfirmed: false,
    sortOrder: index + 1,
  }));
}

export function createPowerPlayDefinitionMap(powerPlays = []) {
  return Object.fromEntries(
    powerPlays.map((item) => [
      item.id,
      {
        id: item.id,
        name: item.name,
        multiplier: Number(item.multiplier),
        categories: [...(item.categories ?? [])],
        enabled: item.enabled !== false,
        themeNameConfirmed: item.themeNameConfirmed === true,
      },
    ]),
  );
}

export function createDefaultPowerPlayPolicy(theme = "Season") {
  const powerPlays = createBasePowerPlayPool(theme);
  return {
    version: POWER_PLAY_POLICY_VERSION,
    selectionMode: "random-without-replacement",
    durationMode: "season-relative-week",
    activityPointsOnly: true,
    evidenceBonusExcluded: true,
    goalAndProgressionBonusesExcluded: true,
    multiplierOptions: [...POWER_PLAY_MULTIPLIERS],
    noRepeatWithinSeason: true,
    baseCategoryCount: POWER_PLAY_CATEGORY_TEMPLATES.length,
    powerPlays,
    powerPlayDefinitions: createPowerPlayDefinitionMap(powerPlays),
  };
}

export function normalizePowerPlayInput(input = {}, existingPowerPlays = []) {
  const sourceType = input.sourceType === "base" ? "base" : "custom";
  const baseCategory = POWER_PLAY_CATEGORY_IDS.includes(input.baseCategory)
    ? input.baseCategory
    : "";
  const categories = uniqueCategories(
    sourceType === "base" && baseCategory
      ? [baseCategory]
      : input.categories,
  );
  const multiplier = POWER_PLAY_MULTIPLIERS.includes(Number(input.multiplier))
    ? Number(input.multiplier)
    : 2;
  const name = cleanText(input.name, POWER_PLAY_MAX_NAME_LENGTH);
  const normalizedName = name.toLocaleLowerCase();
  const value = {
    id: cleanText(input.id, 80) || createPowerPlayId({ sourceType, baseCategory, name }),
    sourceType,
    baseCategory,
    name,
    normalizedName,
    description: cleanText(input.description, POWER_PLAY_MAX_DESCRIPTION_LENGTH),
    multiplier,
    categories,
    enabled: input.enabled !== false,
    themeNameConfirmed: input.themeNameConfirmed === true,
    sortOrder: Number.isFinite(Number(input.sortOrder))
      ? Number(input.sortOrder)
      : existingPowerPlays.length + 1,
  };

  const errors = [];
  if (value.name.length < POWER_PLAY_MIN_NAME_LENGTH) {
    errors.push(`Power Play names need at least ${POWER_PLAY_MIN_NAME_LENGTH} characters.`);
  }
  if (value.description.length < POWER_PLAY_MIN_DESCRIPTION_LENGTH) {
    errors.push(`Describe the Power Play in at least ${POWER_PLAY_MIN_DESCRIPTION_LENGTH} characters.`);
  }
  if (value.categories.length === 0) {
    errors.push("Choose at least one activity category.");
  }
  if (sourceType === "base" && (!baseCategory || value.categories[0] !== baseCategory)) {
    errors.push("A base Power Play must keep its assigned activity category.");
  }
  if (
    existingPowerPlays.some(
      (item) => item.id !== value.id && String(item.normalizedName || item.name).toLocaleLowerCase() === normalizedName,
    )
  ) {
    errors.push("Every Power Play name must be unique within the season.");
  }
  if (existingPowerPlays.length >= POWER_PLAY_MAX_POOL_SIZE && !existingPowerPlays.some((item) => item.id === value.id)) {
    errors.push(`A season may contain at most ${POWER_PLAY_MAX_POOL_SIZE} Power Plays.`);
  }

  return { valid: errors.length === 0, errors, value };
}

export function getSeasonPowerPlayWeeks(league = {}) {
  const startDate = normalizeChallengeDate(league.startDate);
  const endDate = normalizeChallengeDate(league.endDate);
  if (!startDate || !endDate || endDate < startDate) return [];

  const weeks = [];
  let index = 0;
  let currentStart = startDate;
  while (currentStart <= endDate) {
    const naturalEnd = addDays(currentStart, 6);
    const currentEnd = naturalEnd > endDate ? endDate : naturalEnd;
    const weekIndex = index + 1;
    weeks.push({
      leagueId: league.id || "",
      weekIndex,
      weekKey: `week-${String(weekIndex).padStart(2, "0")}`,
      startDate: currentStart,
      endDate: currentEnd,
      startDateKey: getLocalDateKey(currentStart),
      endDateKey: getLocalDateKey(currentEnd),
      partial: currentEnd < naturalEnd,
    });
    index += 1;
    currentStart = addDays(currentStart, 7);
  }
  return weeks;
}

export function getPowerPlayWeekForDate(league, value) {
  const date = normalizeChallengeDate(value);
  if (!date) return null;
  return getSeasonPowerPlayWeeks(league).find(
    (week) => date >= week.startDate && date <= week.endDate,
  ) ?? null;
}


export function getPowerPlayWeekTiming(week, referenceDate = new Date()) {
  const currentDate = normalizeChallengeDate(referenceDate);
  const startDate = normalizeChallengeDate(week?.startDate);
  const endDate = normalizeChallengeDate(week?.endDate);
  if (!currentDate || !startDate || !endDate) {
    return { started: false, ended: false, currentDate, startDate, endDate };
  }
  return {
    started: currentDate >= startDate,
    ended: currentDate > endDate,
    currentDate,
    startDate,
    endDate,
  };
}

export function createPowerPlayWeekId(leagueId, weekKey) {
  return `${leagueId}_${weekKey}`;
}

export function getPowerPlayReadiness({ league, powerPlays = [] } = {}) {
  const weeks = getSeasonPowerPlayWeeks(league);
  const enabled = powerPlays.filter((item) => item.enabled !== false);
  const selectable = enabled.filter((item) => item.themeNameConfirmed === true);
  const baseByCategory = new Map(
    powerPlays
      .filter((item) => item.sourceType === "base")
      .map((item) => [item.baseCategory, item]),
  );
  const normalizedNames = enabled.map((item) =>
    String(item.normalizedName || item.name || "").toLocaleLowerCase(),
  );
  const uniqueNames = new Set(normalizedNames.filter(Boolean));
  const checks = [
    {
      id: "base-categories",
      complete: POWER_PLAY_CATEGORY_IDS.every((category) => {
        const item = baseByCategory.get(category);
        return Boolean(item && item.enabled !== false);
      }),
      label: "Ten base categories are enabled",
      detail: "Each activity category needs one enabled base Power Play.",
    },
    {
      id: "theme-names",
      complete: enabled.length > 0 && enabled.every((item) => item.themeNameConfirmed === true),
      label: "Theme names confirmed",
      detail: "Rename and confirm every enabled base or custom Power Play so it belongs to this season theme.",
    },
    {
      id: "unique-names",
      complete: uniqueNames.size === normalizedNames.length && normalizedNames.length > 0,
      label: "Names are unique",
      detail: "No two enabled Power Plays may share the same name.",
    },
    {
      id: "enough-plays",
      complete: selectable.length >= weeks.length,
      label: "No-repeat pool covers the season",
      detail: `${weeks.length} official season ${weeks.length === 1 ? "week requires" : "weeks require"} at least ${weeks.length} enabled unique ${weeks.length === 1 ? "Power Play" : "Power Plays"}.`,
    },
  ];
  return {
    ready: checks.every((check) => check.complete),
    checks,
    weeks,
    enabledCount: selectable.length,
    configuredEnabledCount: enabled.length,
    requiredCount: weeks.length,
  };
}

export function chooseRandomPowerPlay({ leagueId, weekKey, sequence = 1, eligiblePowerPlays = [] } = {}) {
  const candidates = [...eligiblePowerPlays]
    .filter((item) => item.enabled !== false)
    .sort((first, second) => String(first.id).localeCompare(String(second.id)));
  if (candidates.length === 0) return null;
  const seed = stableStringHash(`${leagueId}:${weekKey}:${sequence}:${candidates.map((item) => item.id).join("|")}`);
  return candidates[seed % candidates.length];
}

export function resolvePowerPlayForContribution({ contribution, league, ruleset, assignments = [] } = {}) {
  const activeRuleset = ruleset ?? league?.ruleset;
  if (activeRuleset?.modules?.powerPlay !== true) return null;
  if ((contribution?.pointGroup || "activity") !== "activity") return null;
  const challengeDate = normalizeChallengeDate(contribution?.challengeDate);
  if (!challengeDate) return null;
  const assignment = assignments.find((item) => {
    if (league?.id && item.leagueId && item.leagueId !== league.id) return false;
    const startDate = normalizeChallengeDate(item.startDate);
    const endDate = normalizeChallengeDate(item.endDate);
    return Boolean(startDate && endDate && challengeDate >= startDate && challengeDate <= endDate);
  });
  if (!assignment?.powerPlayId) return null;
  const powerPlay = (activeRuleset?.powerPlayPolicy?.powerPlays ?? []).find(
    (item) => item.id === assignment.powerPlayId,
  );
  if (!powerPlay || powerPlay.enabled === false) return null;
  const category = contribution.scoreCategory || contribution.category;
  if (!powerPlay.categories?.includes(category)) return null;
  return {
    ...powerPlay,
    weekKey: assignment.weekKey || "",
    weekIndex: Number(assignment.weekIndex ?? 0),
    assignmentId: assignment.id || createPowerPlayWeekId(assignment.leagueId || league?.id || "", assignment.weekKey || "week"),
  };
}

export function getPowerPlayMultiplierForContribution(options = {}) {
  return resolvePowerPlayForContribution(options)?.multiplier ?? 1;
}

export function applyPowerPlayToContributionPoints({ contribution, league, ruleset, assignments = [] } = {}) {
  const basePoints = Number(contribution?.activityPoints ?? 0);
  if (!Number.isFinite(basePoints)) return 0;
  const multiplier = getPowerPlayMultiplierForContribution({ contribution, league, ruleset, assignments });
  return Math.round(basePoints * multiplier * 100) / 100;
}

export function summarizeCurrentPowerPlay({ league, assignments = [], referenceDate = new Date() } = {}) {
  const week = getPowerPlayWeekForDate(league, referenceDate);
  if (!week) {
    return {
      status: "outside-season",
      week: null,
      assignment: null,
      powerPlay: null,
    };
  }
  const assignment = assignments.find((item) => item.weekKey === week.weekKey) ?? null;
  const powerPlay = assignment
    ? (league.ruleset?.powerPlayPolicy?.powerPlays ?? []).find((item) => item.id === assignment.powerPlayId) ?? null
    : null;
  const { started, ended } = getPowerPlayWeekTiming(week, referenceDate);
  return {
    status: ended ? "completed" : assignment ? (started ? "active" : "scheduled") : (started ? "missing" : "unselected"),
    week,
    assignment,
    powerPlay,
  };
}
