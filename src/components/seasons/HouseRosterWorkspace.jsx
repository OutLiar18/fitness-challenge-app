import LegacyAvatar from "../profile/LegacyAvatar";
import { getHouseAccent, getHouseEmblem } from "../../constants/seasons";
import { pluralize } from "../../utils/displayFormatters";

export function HouseCard({ house, members, selected, onSelect }) {
  const emblem = getHouseEmblem(house.emblemId);
  const accent = getHouseAccent(house.accentId);
  const captain = members.find((member) => member.userId === house.captainId);
  const viceCaptains = (house.viceCaptainIds ?? [])
    .map((id) => members.find((member) => member.userId === id))
    .filter(Boolean);

  return (
    <button
      type="button"
      className={selected ? "season-house-card season-house-card--selected" : "season-house-card"}
      style={{ "--house-accent": accent.value }}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="season-house-card__emblem" aria-hidden="true">{emblem.symbol}</span>
      <span className="season-house-card__copy">
        <strong>{house.name}</strong>
        <em>“{house.motto}”</em>
        <small>{members.length} {pluralize(members.length, "member", "members")}</small>
      </span>
      <span className="season-house-card__leadership">
        {captain ? `Captain: ${captain.displayName}` : "Captain pending"}
        {viceCaptains.length > 0 && ` · ${viceCaptains.length} vice ${pluralize(viceCaptains.length, "captain", "captains")}`}
      </span>
    </button>
  );
}

export function HouseRoster({ house, members }) {
  const leadership = new Set([house.captainId, ...(house.viceCaptainIds ?? [])]);
  const sorted = [...members].sort((first, second) => {
    const firstRank = first.userId === house.captainId ? 0 : leadership.has(first.userId) ? 1 : 2;
    const secondRank = second.userId === house.captainId ? 0 : leadership.has(second.userId) ? 1 : 2;
    return firstRank - secondRank || first.displayName.localeCompare(second.displayName);
  });

  return (
    <section className="house-roster card">
      <div className="community-section-heading">
        <div><p className="section-kicker">Current roster</p><h2>{house.name}</h2></div>
        <span>{members.length} {pluralize(members.length, "player", "players")}</span>
      </div>
      <div className="house-roster__list">
        {sorted.map((member) => {
          const label = member.userId === house.captainId
            ? "House captain"
            : house.viceCaptainIds?.includes(member.userId)
              ? "Vice-captain"
              : "House member";

          return (
            <article className="house-member" key={member.userId}>
              <LegacyAvatar avatarId={member.avatarId} size="small" decorative />
              <div><strong>{member.displayName}</strong><span>{label}</span></div>
              {leadership.has(member.userId) && (
                <span className="house-member__crest" aria-label={label}>
                  {member.userId === house.captainId ? "👑" : "⭐"}
                </span>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
