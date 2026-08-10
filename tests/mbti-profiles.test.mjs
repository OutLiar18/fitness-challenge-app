import assert from "node:assert/strict";
import test from "node:test";

import {
  MBTI_PROFILES,
  MBTI_TYPES,
  getMbtiProfileByType,
  isValidMbtiType,
  normalizeMbtiType,
} from "../src/constants/mbtiProfiles.js";
import {
  MBTI_QUICK_QUESTIONS,
  scoreMbtiQuickTest,
} from "../src/services/profile/mbtiProfileModel.js";

test("MBTI Legacy Profiles cover exactly 16 unique type codes", () => {
  assert.equal(MBTI_TYPES.length, 16);
  assert.equal(MBTI_PROFILES.length, 16);
  assert.equal(new Set(MBTI_TYPES).size, 16);
  assert.deepEqual(
    [...MBTI_PROFILES.map((profile) => profile.type)].sort(),
    [...MBTI_TYPES].sort(),
  );
  assert.equal(MBTI_PROFILES.every((profile) => profile.strengths.length >= 3), true);
  assert.equal(MBTI_PROFILES.every((profile) => profile.thrive.length >= 3), true);
  assert.equal(MBTI_PROFILES.every((profile) => profile.connections.length >= 3), true);
  assert.equal(
    MBTI_PROFILES.every((profile) =>
      profile.connections.every((type) => MBTI_TYPES.includes(type) && type !== profile.type),
    ),
    true,
  );
});

test("MBTI type helpers normalise valid values and reject unknown types", () => {
  assert.equal(normalizeMbtiType(" intj "), "INTJ");
  assert.equal(isValidMbtiType("intj"), true);
  assert.equal(isValidMbtiType("ABCD"), false);
  assert.equal(getMbtiProfileByType(" enfp ")?.type, "ENFP");
  assert.equal(getMbtiProfileByType("unknown"), null);
});

test("the quick estimate contains three original questions per MBTI dimension", () => {
  assert.equal(MBTI_QUICK_QUESTIONS.length, 12);
  const counts = MBTI_QUICK_QUESTIONS.reduce((result, question) => {
    result[question.dimension] = (result[question.dimension] || 0) + 1;
    return result;
  }, {});
  assert.deepEqual(counts, { EI: 3, SN: 3, TF: 3, JP: 3 });
});

test("the quick estimate remains incomplete until all 12 answers exist", () => {
  const result = scoreMbtiQuickTest({ [MBTI_QUICK_QUESTIONS[0].id]: "a" });
  assert.equal(result.complete, false);
  assert.equal(result.answered, 1);
  assert.equal(result.type, "");
});

test("the quick estimate derives a valid four-letter suggestion and response leans", () => {
  const answers = Object.fromEntries(
    MBTI_QUICK_QUESTIONS.map((question) => [question.id, "a"]),
  );
  const result = scoreMbtiQuickTest(answers);
  assert.equal(result.complete, true);
  assert.equal(isValidMbtiType(result.type), true);
  assert.equal(result.profile?.type, result.type);
  assert.equal(result.dimensions.length, 4);
  assert.equal(
    result.dimensions.every((dimension) => dimension.firstPercent + dimension.secondPercent === 100),
    true,
  );
});
