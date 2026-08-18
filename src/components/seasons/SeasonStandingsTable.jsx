import LegacyAvatar from "../profile/LegacyAvatar";
import { getHouseEmblem } from "../../constants/seasons";
import { formatPoints, pluralize } from "../../utils/displayFormatters";

export default function SeasonStandingsTable({
  rows,
  kind,
  highlightPlayerId = "",
  highlightHouseName = "",
}) {
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        No scoring activity has reached this table yet.
      </div>
    );
  }

  const houseTable = kind === "house";
  return (
    <div
      className="standings-table"
      role="list"
      aria-label={`${kind} standings`}
    >
      {rows.map((row) => {
        const highlighted = houseTable
          ? Boolean(highlightHouseName && row.houseName === highlightHouseName)
          : Boolean(highlightPlayerId && row.userId === highlightPlayerId);
        const podium = Number(row.rank) <= 3;

        return (
          <article
            className={`standings-row${highlighted ? " standings-row--highlight" : ""}${podium ? " standings-row--podium" : ""}`}
            role="listitem"
            aria-current={highlighted ? "true" : undefined}
            key={houseTable ? row.houseId || row.houseName : row.userId}
          >
            <strong className="standings-rank">{row.rank}</strong>
            {houseTable ? (
              <span className="standings-house-emblem" aria-hidden="true">
                {getHouseEmblem(row.houseEmblemId).symbol}
              </span>
            ) : (
              <LegacyAvatar avatarId={row.avatarId} size="small" decorative />
            )}
            <div className="standings-identity">
              <strong>{houseTable ? row.houseName : row.displayName}</strong>
              <span>
                {houseTable
                  ? `${row.memberCount} contributing ${pluralize(row.memberCount, "player", "players")} · ${row.activeDays} combined active days`
                  : `${row.activeDays} active ${pluralize(row.activeDays, "day", "days")} · ${row.houseName}`}
              </span>
            </div>
            <strong className="standings-score">
              {formatPoints(row.totalPoints)}
            </strong>
          </article>
        );
      })}
    </div>
  );
}
