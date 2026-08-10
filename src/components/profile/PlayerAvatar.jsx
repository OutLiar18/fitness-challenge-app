import { isValidMbtiType } from "../../constants/mbtiProfiles";
import LegacyAvatar from "./LegacyAvatar";
import MbtiProfileAvatar from "./MbtiProfileAvatar";

export default function PlayerAvatar({ profile, size = "medium", decorative = false, className = "" }) {
  if (isValidMbtiType(profile?.mbtiType)) {
    return <MbtiProfileAvatar type={profile.mbtiType} size={size} decorative={decorative} className={className} />;
  }

  return <LegacyAvatar avatarId={profile?.avatarId} size={size} decorative={decorative} className={className} />;
}
