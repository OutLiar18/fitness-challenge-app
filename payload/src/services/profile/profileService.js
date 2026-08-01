import {
  DEFAULT_AVATAR_ID,
  isValidAvatarId,
} from "../../constants/avatars";

export const PROFILE_LIMITS = Object.freeze({
  displayNameMin: 2,
  displayNameMax: 40,
});

export function normalizeProfileUpdate(input = {}) {
  return {
    displayName: String(input.displayName ?? "")
      .trim()
      .replace(/\s+/g, " "),
    avatarId: isValidAvatarId(input.avatarId)
      ? input.avatarId
      : DEFAULT_AVATAR_ID,
  };
}

export function validateProfileUpdate(input = {}) {
  const normalized = normalizeProfileUpdate(input);
  const errors = [];

  if (normalized.displayName.length < PROFILE_LIMITS.displayNameMin) {
    errors.push("Display name must contain at least 2 characters.");
  }

  if (normalized.displayName.length > PROFILE_LIMITS.displayNameMax) {
    errors.push("Display name cannot exceed 40 characters.");
  }

  if (!isValidAvatarId(input.avatarId)) {
    errors.push("Choose a valid Legacy Avatar.");
  }

  return {
    valid: errors.length === 0,
    errors,
    value: normalized,
  };
}
