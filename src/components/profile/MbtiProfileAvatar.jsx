import { getMbtiEmblem } from "../../constants/mbtiEmblems";
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
  const emblem = getMbtiEmblem(type);

  if (!profile || !emblem) return null;

  const label = `${profile.mythicName} — ${profile.type} ${profile.title}`;

  return (
    <span
      className={`mbti-avatar ${SIZE_CLASS[size] ?? SIZE_CLASS.medium} ${className}`.trim()}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : label}
      title={decorative ? undefined : label}
    >
      <img src={emblem} alt="" aria-hidden="true" draggable="false" />
    </span>
  );
}
