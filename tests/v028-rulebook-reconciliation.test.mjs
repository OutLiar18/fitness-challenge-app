import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  RULEBOOK_SECTIONS,
  RULE_STATUSES,
} from "../src/constants/rulebook.js";
import {
  filterRulebookSections,
  numberRulebookSections,
} from "../src/services/rules/rulebookModel.js";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const constantsSource = read("src/constants/rulebook.js");
const pageSource = read("src/pages/Rulebook.jsx");
const cssSource = read("src/pages/Rulebook.css");

const allRules = RULEBOOK_SECTIONS.flatMap((section) => section.rules);
const ruleById = (id) => allRules.find((item) => item.id === id);

test("28D9 gives every rule a stable hierarchical number before filtering", () => {
  const numbered = numberRulebookSections(RULEBOOK_SECTIONS);
  assert.equal(numbered[0].number, "1");
  assert.equal(numbered[0].rules[0].number, "1.1");
  assert.equal(numbered[0].rules[2].number, "1.3");

  const byNumber = filterRulebookSections(RULEBOOK_SECTIONS, {
    query: "1.3",
    status: "all",
  });
  assert.deepEqual(
    byNumber.flatMap((section) => section.rules).map((item) => item.id),
    ["cheating-consequences"],
  );

  const seasonOnly = filterRulebookSections(RULEBOOK_SECTIONS, {
    status: RULE_STATUSES.SEASON,
  });
  const pocketWindow = seasonOnly
    .flatMap((section) => section.rules)
    .find((item) => item.id === "pocket-window");
  assert.match(pocketWindow.number, /^\d+\.\d+$/);
});

test("28D9 removes migration commentary and keeps only meaningful player-facing asides", () => {
  assert.doesNotMatch(pageSource, /Adapted from 2025|Added for the app|Why this changed/);
  assert.doesNotMatch(constantsSource, /\bnote\s*:/);
  assert.doesNotMatch(constantsSource, /This replaces the 2025|The app replaces the 2025|app equivalent of the original/);
  assert.equal(
    ruleById("no-excuses").aside,
    "This is a call to take responsibility, not permission to ignore illness, injury or genuine emergencies.",
  );
  assert.match(pageSource, /\(\{item\.aside\}\)/);
});

test("28D9 restores the original Prison Zebra cheating consequence requested by the owner", () => {
  assert.equal(
    ruleById("cheating-consequences").text,
    'If you are caught cheating, we will be disappointed. Your participation in this challenge will be terminated with immediate effect. You will be obligated to complete the "3 Stripes of a Prison Zebra Debacle".',
  );
});

test("28D9 reconciles the Rulebook with the active season evidence system", () => {
  const evidenceRuleIds = [
    "evidence-season-rule",
    "evidence-deadline",
    "running-proof-release",
    "steps-proof-hold",
    "water-fruit-photo-bonus",
    "administrator-verification",
  ];
  evidenceRuleIds.forEach((id) => {
    assert.equal(ruleById(id)?.status, RULE_STATUSES.SEASON, id);
  });

  assert.match(ruleById("evidence-season-rule").text, /verification code/i);
  assert.match(ruleById("evidence-season-rule").text, /WhatsApp/i);
  assert.match(ruleById("evidence-deadline").text, /24 hours/);
  assert.match(ruleById("running-proof-release").text, /Cardio points are released immediately/);
  assert.match(ruleById("steps-proof-hold").text, /wait for verified proof/);
  assert.match(ruleById("water-fruit-photo-bonus").text, /750 millilitres/);
  assert.match(ruleById("water-fruit-photo-bonus").text, /3 Fruit servings/);
  assert.match(ruleById("water-fruit-photo-bonus").text, /\+3 season points/);
  assert.match(ruleById("administrator-verification").text, /Only Platform Administrators/);
  assert.equal(ruleById("photo-bonus"), undefined);
});

test("28D9 documents current season caps, bonus scoring and Fruit competition limits", () => {
  assert.equal(ruleById("league-daily-scoring").status, RULE_STATUSES.SEASON);
  assert.match(ruleById("league-daily-scoring").text, /20 competitive activity points/);
  assert.match(ruleById("league-daily-scoring").text, /5-point participation bonus/);
  assert.match(ruleById("league-daily-scoring").text, /outside the daily activity cap/);

  assert.equal(ruleById("season-bonus-awards").status, RULE_STATUSES.SEASON);
  assert.match(ruleById("season-bonus-awards").text, /whole-number/);
  assert.match(ruleById("season-bonus-awards").text, /factual reason/);
  assert.match(ruleById("season-bonus-awards").text, /player and their House/);
  assert.match(ruleById("season-bonus-awards").text, /does not create a category championship title/);

  assert.equal(ruleById("fruit-season-cap").status, RULE_STATUSES.SEASON);
  assert.match(ruleById("fruit-season-cap").text, /five servings per player per day/);
});

test("28D9 adds current correction and roster-rest rules and removes unsupported learning exceptions", () => {
  assert.match(ruleById("entry-corrections").text, /immutable replacement/);
  assert.match(ruleById("entry-corrections").text, /category and challenge date stay fixed/);
  assert.match(ruleById("entry-corrections").text, /reason is required/);
  assert.match(ruleById("entry-corrections").text, /Pocket redemptions/);

  assert.equal(ruleById("post-move-rest").status, RULE_STATUSES.SEASON);
  assert.match(ruleById("post-move-rest").text, /following challenge week/);
  assert.match(ruleById("post-move-rest").text, /week after/);

  assert.equal(ruleById("primary-skill"), undefined);
  assert.doesNotMatch(ruleById("reading-work").text, /professional study/i);
});

test("28D9 reconciles inactive legacy mechanics without incorrectly retiring active photo proof", () => {
  assert.equal(ruleById("legacy-power-play").status, RULE_STATUSES.INACTIVE);
  assert.match(ruleById("legacy-power-play").text, /Player voting/);
  assert.match(ruleById("legacy-power-play").text, /40% individual-contribution penalty/);
  assert.match(ruleById("legacy-power-play").text, /2× or 3×/);

  assert.equal(ruleById("whatsapp-administration").status, RULE_STATUSES.INACTIVE);
  assert.match(ruleById("whatsapp-administration").text, /routine activity posting/i);
  assert.match(ruleById("whatsapp-administration").text, /evidence-delivery channel/i);
  assert.equal(ruleById("photo-bonus"), undefined);
});

test("28D9 makes the Rulebook denser without shrinking its interactive touch targets", () => {
  assert.match(pageSource, /import ThemeIcon/);
  assert.match(pageSource, /Rule \{item\.number\}/);
  assert.match(pageSource, /ThemeIcon name="rulebook"/);
  assert.match(pageSource, /RULEBOOK_SECTION_ICON_NAMES/);
  assert.match(pageSource, /PARTICULAR_ICON_NAMES/);
  assert.match(pageSource, /placeholder="Try .*1\.3/);
  assert.match(pageSource, /\{goal\.emoji\}/);

  assert.match(cssSource, /\.rule-item__number/);
  assert.match(cssSource, /\.rule-item__aside/);
  assert.doesNotMatch(cssSource, /\.rule-item__note/);
  assert.match(cssSource, /\.rule-item__text[\s\S]*font-size: 0\.92rem/);
  assert.match(cssSource, /\.rulebook-filter,[\s\S]*min-height: 46px/);
  assert.match(cssSource, /\.rulebook-search input[\s\S]*min-height: 46px/);
});
