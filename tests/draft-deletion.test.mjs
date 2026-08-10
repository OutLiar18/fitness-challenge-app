import assert from "node:assert/strict";
import test from "node:test";

import {
  DRAFT_DELETION_ACTIONS,
  canHardDeleteDraftHouse,
  canHardDeleteDraftSeason,
  draftHouseDeletionAuditId,
  draftSeasonDeletionAuditId,
} from "../src/services/seasons/draftDeletionModel.js";

const draftLeague = Object.freeze({
  id: "season-one",
  mode: "season",
  inviteCode: "SEASONAA",
  status: "draft",
  participantCount: 0,
  chaosStatus: "not-started",
  activatedAt: null,
  completedAt: null,
  archivedAt: null,
});

const draftHouse = Object.freeze({
  id: "house-one",
  leagueId: "season-one",
  captainId: "",
  viceCaptainIds: [],
  lastElectionId: "",
});

test("hard deletion is limited to unused draft seasons", () => {
  assert.equal(canHardDeleteDraftSeason(draftLeague), true);
  assert.equal(canHardDeleteDraftSeason({ ...draftLeague, status: "registration" }), false);
  assert.equal(canHardDeleteDraftSeason({ ...draftLeague, mode: "classic" }), false);
  assert.equal(canHardDeleteDraftSeason({ ...draftLeague, inviteCode: "" }), false);
  assert.equal(canHardDeleteDraftSeason({ ...draftLeague, participantCount: 1 }), false);
  assert.equal(canHardDeleteDraftSeason({ ...draftLeague, chaosStatus: "activated" }), false);
});

test("hard deletion is limited to empty unled Houses in the same unused draft", () => {
  assert.equal(canHardDeleteDraftHouse({ league: draftLeague, house: draftHouse, memberCount: 0 }), true);
  assert.equal(canHardDeleteDraftHouse({ league: draftLeague, house: draftHouse, memberCount: 1 }), false);
  assert.equal(canHardDeleteDraftHouse({
    league: draftLeague,
    house: { ...draftHouse, captainId: "player-one" },
    memberCount: 0,
  }), false);
  assert.equal(canHardDeleteDraftHouse({
    league: draftLeague,
    house: { ...draftHouse, leagueId: "another-season" },
    memberCount: 0,
  }), false);
});

test("draft deletion audit identifiers and actions remain deterministic", () => {
  assert.equal(draftHouseDeletionAuditId("house-one"), "draft-house-delete_house-one");
  assert.equal(draftSeasonDeletionAuditId("season-one"), "draft-season-delete_season-one");
  assert.equal(DRAFT_DELETION_ACTIONS.HOUSE, "house.draft-deleted");
  assert.equal(DRAFT_DELETION_ACTIONS.SEASON, "league.draft-deleted");
});