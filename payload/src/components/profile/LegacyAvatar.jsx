import { getAvatarById } from "../../constants/avatars";
import "./LegacyAvatar.css";

const SIZE_CLASS = {
  small: "legacy-avatar--small",
  medium: "legacy-avatar--medium",
  large: "legacy-avatar--large",
  hero: "legacy-avatar--hero",
};

export default function LegacyAvatar({
  avatarId,
  size = "medium",
  label,
  decorative = false,
  className = "",
}) {
  const avatar = getAvatarById(avatarId);
  const accessibleLabel = label || avatar.name;

  return (
    <span
      className={`legacy-avatar ${SIZE_CLASS[size] ?? SIZE_CLASS.medium} ${className}`.trim()}
      style={{
        "--avatar-primary": avatar.primary,
        "--avatar-secondary": avatar.secondary,
      }}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : accessibleLabel}
      title={decorative ? undefined : accessibleLabel}
    >
      <span className="legacy-avatar__shine" aria-hidden="true" />
      <span className="legacy-avatar__symbol" aria-hidden="true">
        {avatar.symbol}
      </span>
    </span>
  );
}
