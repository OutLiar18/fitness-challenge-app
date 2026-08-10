import { getMbtiProfileByType } from "../../constants/mbtiProfiles";
import "./MbtiProfileAvatar.css";

const SIZE_CLASS = {
  small: "mbti-avatar--small",
  medium: "mbti-avatar--medium",
  large: "mbti-avatar--large",
  hero: "mbti-avatar--hero",
};

export default function MbtiProfileAvatar({
  type,
  size = "medium",
  decorative = false,
  className = "",
}) {
  const profile = getMbtiProfileByType(type);
  if (!profile) return null;

  return (
    <span
      className={`mbti-avatar ${SIZE_CLASS[size] ?? SIZE_CLASS.medium} ${className}`.trim()}
      style={{
        "--mbti-primary": profile.primary,
        "--mbti-secondary": profile.secondary,
      }}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : `${profile.type} — ${profile.title}`}
      title={decorative ? undefined : `${profile.type} — ${profile.title}`}
    >
      <span className="mbti-avatar__halo" aria-hidden="true" />
      <span className="mbti-avatar__symbol" aria-hidden="true">{profile.symbol}</span>
      <span className="mbti-avatar__type" aria-hidden="true">{profile.type}</span>
    </span>
  );
}
