import {
  DEFAULT_TEAM_EMBLEM_ID,
  TEAM_MEMBER_LIMIT,
  isValidTeamEmblemId,
} from "../../constants/teams";
import { getLocalDateKey, getWeekStart } from "../dateService";
import { calculateEntryPoints } from "../points";
import { getEntryDate } from "../progression/helpers";

const TEAM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function cleanText(value, maximumLength = 120) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maximumLength);
}

function toNonNegativeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

export function createTeamInviteCode(random = Math.random) {
  return Array.from({ length: 8 }, () => {
    const index = Math.floor(random() * TEAM_CODE_ALPHABET.length);
    return TEAM_CODE_ALPHABET[index];
  }).join("");
}

export function normalizeTeamCode(value) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-HJ-NP-Z2-9]/g, "")
    .slice(0, 8);
}

export function validateTeamInput(input = {}) {
  const value = {
    name: cleanText(input.name, 48),
    description: cleanText(input.description, 240),
    motto: cleanText(input.motto, 90),
    emblemId: isValidTeamEmblemId(input.emblemId)
      ? input.emblemId
      : DEFAULT_TEAM_EMBLEM_ID,
  };
  const errors = [];

  if (value.name.length < 3) {
    errors.push("Team name must contain at least 3 characters.");
  }

  if (value.description.length < 10) {
    errors.push("Describe what your team is building together.");
  }

  if (value.motto.length < 3) {
    errors.push("Add a short team motto.");
  }

  return { valid: errors.length === 0, errors, value };
}

export function getTeamWeekKey(referenceDate = new Date()) {
  return getLocalDateKey(getWeekStart(referenceDate));
}

export function calculateTeamMemberSnapshot(
  entries = [],
  progression = {},
  referenceDate = new Date(),
) {
  const weekKey = getTeamWeekKey(referenceDate);
  const weekEntries = entries.filter((entry) => {
    const entryWeekKey = getTeamWeekKey(getEntryDate(entry));
    return entryWeekKey === weekKey;
  });
  const activeDays = new Set(
    weekEntries.map((entry) => getLocalDateKey(getEntryDate(entry))).filter(Boolean),
  ).size;

  return {
    weeklyKey: weekKey,
    weeklyPoints: weekEntries.reduce(
      (total, entry) => total + calculateEntryPoints(entry),
      0,
    ),
    activeDays,
    entriesRecorded: weekEntries.length,
    currentStreak: Number(progression?.streak?.currentStreak ?? 0),
  };
}

export function getCurrentTeamMemberSnapshot(
  member = {},
  referenceDate = new Date(),
) {
  const currentWeekKey = getTeamWeekKey(referenceDate);
  const isCurrentWeek = member.weeklyKey === currentWeekKey;

  return {
    ...member,
    weeklyKey: currentWeekKey,
    weeklyPoints: isCurrentWeek
      ? toNonNegativeNumber(member.weeklyPoints)
      : 0,
    activeDays: isCurrentWeek
      ? Math.round(toNonNegativeNumber(member.activeDays))
      : 0,
    entriesRecorded: isCurrentWeek
      ? Math.round(toNonNegativeNumber(member.entriesRecorded))
      : 0,
  };
}

export function getTeamSummary(members = [], referenceDate = new Date()) {
  const currentWeekMembers = members.map((member) =>
    getCurrentTeamMemberSnapshot(member, referenceDate),
  );

  return {
    memberCount: members.length,
    weeklyPoints: currentWeekMembers.reduce(
      (total, member) => total + member.weeklyPoints,
      0,
    ),
    activeDays: currentWeekMembers.reduce(
      (total, member) => total + member.activeDays,
      0,
    ),
    entriesRecorded: currentWeekMembers.reduce(
      (total, member) => total + member.entriesRecorded,
      0,
    ),
    remainingPlaces: Math.max(0, TEAM_MEMBER_LIMIT - members.length),
  };
}
