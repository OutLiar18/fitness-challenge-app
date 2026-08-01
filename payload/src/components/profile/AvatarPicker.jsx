import { LEGACY_AVATARS } from "../../constants/avatars";
import LegacyAvatar from "./LegacyAvatar";
import "./AvatarPicker.css";

export default function AvatarPicker({ value, onChange, disabled = false }) {
  return (
    <fieldset className="avatar-picker" disabled={disabled}>
      <legend>Choose your Legacy Avatar</legend>
      <p>
        These avatars are built into Champions Legacy Challenge. No image upload or
        paid media storage is required.
      </p>

      <div className="avatar-picker__grid">
        {LEGACY_AVATARS.map((avatar) => {
          const selected = avatar.id === value;

          return (
            <label
              className={`avatar-picker__option${
                selected ? " avatar-picker__option--selected" : ""
              }`}
              key={avatar.id}
            >
              <input
                type="radio"
                name="legacyAvatar"
                value={avatar.id}
                checked={selected}
                onChange={() => onChange(avatar.id)}
              />

              <LegacyAvatar avatarId={avatar.id} size="large" decorative />

              <span className="avatar-picker__copy">
                <strong>{avatar.name}</strong>
                <small>{avatar.description}</small>
              </span>

              <span className="avatar-picker__check" aria-hidden="true">
                {selected ? "✓" : ""}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
