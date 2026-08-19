import ThemeIcon from "../common/ThemeIcon";
import HouseEmblem from "./HouseEmblem";
import LegacyAvatar from "../profile/LegacyAvatar";
import {
  getHouseThemeStyle,
} from "../../constants/seasons";
import { pluralize } from "../../utils/displayFormatters";

export function HouseCard({
  house,
  members,
  selected,
  current = false,
  onSelect,
}) {
  const captain = members.find((member) => member.userId === house.captainId);
  const viceCaptains = (house.viceCaptainIds ?? [])
    .map((id) => members.find((member) => member.userId === id))
    .filter(Boolean);

  const classes = [
    "season-house-card",
    selected ? "season-house-card--selected" : "",
    current ? "season-house-card--current" : "",
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      style={getHouseThemeStyle(house)}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="season-house-card__emblem" aria-hidden="true">
        <HouseEmblem id={house.emblemId} size={38} />
      </span>
      <span className="season-house-card__copy">
        <span className="season-house-card__title">
          <strong>{house.name}</strong>
          {current && <b>Your House</b>}
        </span>
        <em>“{house.motto}”</em>
        <small>
          {members.length} {pluralize(members.length, "member", "members")}
        </small>
      </span>
      <span className="season-house-card__leadership">
        {captain ? `Captain: ${captain.displayName}` : "Captain pending"}
        {viceCaptains.length > 0
          && ` · ${viceCaptains.length} vice ${pluralize(viceCaptains.length, "captain", "captains")}`}
      </span>
    </button>
  );
}

export function HouseRoster({ house, members }) {
  const leadership = new Set([
    house.captainId,
    ...(house.viceCaptainIds ?? []),
  ]);

  const sorted = [...members].sort((first, second) => {
    const firstRank = first.userId === house.captainId
      ? 0
      : leadership.has(first.userId) ? 1 : 2;
    const secondRank = second.userId === house.captainId
      ? 0
      : leadership.has(second.userId) ? 1 : 2;
    return firstRank - secondRank
      || first.displayName.localeCompare(second.displayName);
  });

  return (
    <section className="house-roster card" style={getHouseThemeStyle(house)}>
      <div className="community-section-heading">
        <div>
          <p className="section-kicker">Current roster</p>
          <h2>{house.name}</h2>
        </div>
        <span>
          {members.length} {pluralize(members.length, "player", "players")}
        </span>
      </div>

      <div className="house-roster__list">
        {sorted.map((member) => {
          const captain = member.userId === house.captainId;
          const viceCaptain = house.viceCaptainIds?.includes(member.userId);
          const label = captain
            ? "House captain"
            : viceCaptain ? "Vice-captain" : "House member";

          return (
            <article
              className={
                captain
                  ? "house-member house-member--captain"
                  : viceCaptain
                    ? "house-member house-member--vice"
                    : "house-member"
              }
              key={member.userId}
            >
              <LegacyAvatar avatarId={member.avatarId} size="small" decorative />
              <div>
                <strong>{member.displayName}</strong>
                <span>{label}</span>
              </div>
              {leadership.has(member.userId) && (
                <span className="house-member__crest" aria-label={label}>
                  <ThemeIcon name={captain ? "crown" : "star"} size={18} />
                </span>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
