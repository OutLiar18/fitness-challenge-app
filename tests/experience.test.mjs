import assert from "node:assert/strict";
import test from "node:test";

import { getDailyMotivation, getMotivationCount } from "../src/constants/motivation.js";
import {
  ADMIN_NAV_ITEM,
  FUTURE_NAV_ITEMS,
  MOBILE_NAV_ITEMS,
  PRIMARY_NAV_ITEMS,
  REFERENCE_NAV_ITEMS,
  getNavigationItemByPath,
} from "../src/constants/navigation.js";

test("Navigation paths and identifiers remain unique", () => {
  const items = [
    ...PRIMARY_NAV_ITEMS,
    ...FUTURE_NAV_ITEMS,
    ...REFERENCE_NAV_ITEMS,
    ADMIN_NAV_ITEM,
  ];
  const ids = items.map((item) => item.id);
  const paths = items.map((item) => item.to);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(getNavigationItemByPath("/log?category=water")?.id, "log");
  assert.equal(getNavigationItemByPath("/progress")?.id, "progress");
  assert.equal(getNavigationItemByPath("/teams")?.id, "teams");
  assert.equal(getNavigationItemByPath("/leagues")?.id, "leagues");
  assert.equal(getNavigationItemByPath("/coach")?.id, "coach");
});

test("Mobile navigation is a valid subset of primary navigation", () => {
  const primaryIds = new Set(PRIMARY_NAV_ITEMS.map((item) => item.id));

  assert.equal(MOBILE_NAV_ITEMS.length, 4);
  assert.ok(MOBILE_NAV_ITEMS.every((item) => primaryIds.has(item.id)));
  assert.ok(MOBILE_NAV_ITEMS.some((item) => item.id === "log"));
  assert.equal(MOBILE_NAV_ITEMS.some((item) => item.id === "profile"), false);
});

test("Every season and coaching navigation item remains clearly described", () => {
  FUTURE_NAV_ITEMS.forEach((item) => {
    assert.ok(item.label);
    assert.ok(item.description.length >= 20);
    assert.ok(item.to.startsWith("/"));
  });

  assert.ok(FUTURE_NAV_ITEMS.some((item) => item.id === "leagues"));
  assert.ok(FUTURE_NAV_ITEMS.some((item) => item.id === "teams"));
  assert.ok(FUTURE_NAV_ITEMS.some((item) => item.id === "pocket"));
  assert.ok(FUTURE_NAV_ITEMS.some((item) => item.id === "notifications"));
});

test("Daily motivation is deterministic and can be shuffled", () => {
  const date = new Date(2026, 7, 1, 12);
  const first = getDailyMotivation(date, "player-1", 0);
  const repeated = getDailyMotivation(date, "player-1", 0);
  const shuffled = getDailyMotivation(date, "player-1", 1);

  assert.deepEqual(first, repeated);
  assert.equal(getMotivationCount() >= 8, true);
  assert.notEqual(first.index, shuffled.index);
});
