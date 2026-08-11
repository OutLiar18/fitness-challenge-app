import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const houses = read("src/pages/Houses.jsx");
const seasons = read("src/pages/Seasons.jsx");
const confirmDialog = read("src/components/common/ConfirmDialog.jsx");
const houseRoster = read("src/components/seasons/HouseRosterWorkspace.jsx");
const standings = read("src/components/seasons/SeasonStandingsTable.jsx");
const summary = read("src/components/seasons/CompetitionWorkspaceSummary.jsx");

test("Houses persists selected House and task workspace in the URL", () => {
  assert.match(houses, /searchParams\.get\("house"\)/);
  assert.match(houses, /searchParams\.get\("tab"\)/);
  assert.match(houses, /function selectHouse/);
  assert.match(houses, /function setActiveTab/);
  assert.match(houses, /onSelect=\{\(\) => selectHouse\(house\.id\)\}/);
});

test("Seasons persists browse/join/create workspace and detail workspace in the URL", () => {
  assert.match(seasons, /searchParams\.get\("workspace"\)/);
  assert.match(seasons, /function setActivePageTab/);
  assert.match(seasons, /function setDetailTab/);
  assert.match(seasons, /onTabChange=\{setDetailTab\}/);
  assert.match(seasons, /requestedTab=\{searchParams\.get\("tab"\) \|\| ""\}/);
});

test("competition routes no longer use browser confirm or prompt dialogs", () => {
  assert.doesNotMatch(houses, /window\.confirm/);
  assert.doesNotMatch(houses, /window\.prompt/);
  assert.doesNotMatch(seasons, /window\.confirm/);
  assert.doesNotMatch(seasons, /window\.prompt/);
  assert.match(houses, /<ConfirmDialog/);
  assert.match(seasons, /<ConfirmDialog/);
});

test("typed draft-season deletion remains an explicit DELETE confirmation", () => {
  assert.match(confirmDialog, /confirmationPhrase/);
  assert.match(confirmDialog, /phrase\.trim\(\) === confirmationPhrase/);
  assert.match(confirmDialog, /disabled=\{loading \|\| !phraseMatches\}/);
  assert.doesNotMatch(confirmDialog, /if \(open\) setPhrase\(""\)/);
  assert.match(confirmDialog, /function handleCancel\(\)[\s\S]*setPhrase\(""\)/);
  assert.match(confirmDialog, /function handleConfirm\(\)[\s\S]*setPhrase\(""\)/);
  assert.match(seasons, /confirmationPhrase=\{pendingAction === "delete-draft" \? "DELETE" : ""\}/);
});

test("oversized competition routes extract roster and standings presentation", () => {
  assert.match(houses, /HouseRosterWorkspace/);
  assert.match(houseRoster, /export function HouseCard/);
  assert.match(houseRoster, /export function HouseRoster/);
  assert.match(seasons, /SeasonStandingsTable/);
  assert.match(standings, /export default function SeasonStandingsTable/);
  assert.doesNotMatch(seasons, /function StandingsTable/);
});

test("Houses and Seasons share a task-focused competition summary", () => {
  assert.match(houses, /<CompetitionWorkspaceSummary/);
  assert.match(seasons, /<CompetitionWorkspaceSummary/);
  assert.match(summary, /competition-summary__metrics/);
  assert.match(summary, /competition-summary__actions/);
});
