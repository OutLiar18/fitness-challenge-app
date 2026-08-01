import assert from "node:assert/strict";
import test from "node:test";

import { ANNOUNCEMENTS } from "../src/constants/announcements.js";
import {
  DEFAULT_AVATAR_ID,
  LEGACY_AVATARS,
  getAvatarById,
  isValidAvatarId,
} from "../src/constants/avatars.js";
import {
  filterAnnouncements,
  getAnnouncementTypes,
  getUnreadAnnouncements,
  normalizeAnnouncement,
  sortAnnouncementsNewestFirst,
} from "../src/services/announcements/announcementModel.js";
import {
  normalizeProfileUpdate,
  validateProfileUpdate,
} from "../src/services/profile/profileService.js";

test("Legacy Avatar identifiers remain unique and the default is valid", () => {
  const ids = LEGACY_AVATARS.map((avatar) => avatar.id);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(LEGACY_AVATARS.length >= 10, true);
  assert.equal(isValidAvatarId(DEFAULT_AVATAR_ID), true);
  assert.equal(getAvatarById("unknown-avatar").id, DEFAULT_AVATAR_ID);
});

test("Profile updates normalise display names and reject invalid values", () => {
  const valid = validateProfileUpdate({
    displayName: "  Kyle   Champion  ",
    avatarId: "storm-runner",
  });

  assert.equal(valid.valid, true);
  assert.equal(valid.value.displayName, "Kyle Champion");
  assert.equal(valid.value.avatarId, "storm-runner");

  const invalid = validateProfileUpdate({
    displayName: "K",
    avatarId: "made-up-avatar",
  });

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.length, 2);
  assert.equal(normalizeProfileUpdate(invalid.value).avatarId, DEFAULT_AVATAR_ID);
});

test("Announcement helpers sort, filter and calculate unread status", () => {
  const announcements = sortAnnouncementsNewestFirst(
    ANNOUNCEMENTS.map((announcement) =>
      normalizeAnnouncement({
        ...announcement,
        status: "published",
        publishedAt: announcement.publishedAt,
        source: "bundled",
      }),
    ),
  );

  assert.ok(announcements[0].publishedAt >= announcements[1].publishedAt);
  assert.equal(getAnnouncementTypes(announcements).includes("release"), true);

  const readIds = [announcements[0].id];
  const unread = getUnreadAnnouncements(announcements, readIds);

  assert.equal(unread.length, announcements.length - 1);
  assert.equal(unread.some((item) => item.id === announcements[0].id), false);

  const releases = filterAnnouncements(announcements, {
    type: "release",
    unreadOnly: true,
    readIds,
  });

  assert.equal(releases.every((item) => item.type === "release"), true);
  assert.equal(releases.some((item) => item.id === announcements[0].id), false);
});
