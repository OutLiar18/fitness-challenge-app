import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const seasons = read("src/pages/Seasons.jsx");
const seasonsCss = read("src/pages/Seasons.css");
const commandCentre = read("src/components/seasons/SeasonCommandCentre.jsx");
const commandCentreCss = read("src/components/seasons/SeasonCommandCentre.css");
const powerPlays = read("src/components/seasons/PowerPlayWorkspace.jsx");
const powerPlayCss = read("src/components/seasons/PowerPlayWorkspace.css");
const evidence = read("src/components/seasons/EvidenceWorkspace.jsx");
const evidenceCss = read("src/components/seasons/EvidenceWorkspace.css");
const standings = read("src/components/seasons/SeasonStandingsTable.jsx");
const themeIcon = read("src/components/common/ThemeIcon.jsx");

test("28D3A keeps Browse focused on choosing a season", () => {
  assert.match(seasons, /const selectedId = leagues\.some\(\(league\) => league\.id === requestedId\)[\s\S]*\? requestedId[\s\S]*: ""/);
  assert.match(seasons, /const seasonGroups = \[/);
  assert.match(seasons, /Live now/);
  assert.match(seasons, /Upcoming/);
  assert.match(seasons, /Completed seasons/);
  assert.match(seasons, /Back to seasons/);
  assert.doesNotMatch(seasons, /const fallbackId = memberships\[0\]/);
});

test("28D3A removes the always-on competition summary from season detail", () => {
  assert.doesNotMatch(seasons, /CompetitionWorkspaceSummary/);
  assert.match(seasons, /Season at a glance/);
  assert.match(seasonsCss, /\.season-at-glance/);
});

test("28D3A uses ThemeIcon symbols for season workspace navigation", () => {
  for (const icon of ["compass", "command", "power", "standings", "trophy", "evidence", "ticket", "back"]) {
    assert.match(themeIcon, new RegExp(`${icon}:`));
  }
  assert.match(seasons, /<ThemeIcon name="compass" \/>/);
  assert.match(seasons, /<ThemeIcon name="command" \/>/);
  assert.match(seasons, /<ThemeIcon name="power" \/>/);
});

test("28D3A turns Standings into one focused leaderboard at a time", () => {
  assert.match(seasons, /standingsView/);
  assert.match(seasons, /Individual/);
  assert.match(seasons, /Houses/);
  assert.match(standings, /highlightPlayerId/);
  assert.match(standings, /standings-row--highlight/);
  assert.match(standings, /standings-row--podium/);
});

test("28D3A keeps Command Centre attention-first", () => {
  assert.match(commandCentre, /Bonus points and adjustments/);
  assert.match(commandCentre, /Integrity tools and history/);
  assert.match(commandCentre, /season-ops-disclosure/);
  assert.match(commandCentreCss, /\.season-ops-disclosure/);
});

test("28D3A edits only one Power Play at a time during setup", () => {
  assert.match(powerPlays, /editingPowerPlayId/);
  assert.match(powerPlays, /editingPowerPlay/);
  assert.match(powerPlays, /power-play-editor-list/);
  assert.doesNotMatch(powerPlays, /<div className="power-play-editor-grid">/);
  assert.match(powerPlayCss, /\.power-play-editor-list/);
});

test("28D3A makes Evidence a working queue with publication priority", () => {
  assert.match(evidence, /evidence-snapshot--due/);
  assert.match(evidence, /How evidence review works/);
  assert.match(evidenceCss, /\.evidence-snapshot \{[\s\S]*order: -3/);
  assert.match(evidenceCss, /\.evidence-boundary/);
});

test("28D3A clarifies season creation and honours without changing rules", () => {
  assert.match(seasons, /Season foundations/);
  assert.match(seasons, /Competition format/);
  assert.match(seasons, /Evidence policy/);
  assert.match(seasons, /Review and create/);
  assert.match(seasons, /Individual honours/);
  assert.match(seasons, /House honours/);
  assert.match(seasons, /How individual honours are assigned/);
});
