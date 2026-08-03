import { useMemo, useState } from "react";

import { USER_ROLES, getRoleLabel } from "../../constants/admin";
import { updateUserAdministration } from "../../services/admin/userAdminService";
import { formatNumber } from "../../utils/displayFormatters";
import LegacyAvatar from "../profile/LegacyAvatar";

function UserAccessRow({ player, actorId, notify, onUpdated }) {
  const [role, setRole] = useState(player.role || "user");
  const [saving, setSaving] = useState(false);
  const isCurrentAdministrator = player.id === actorId;
  const changed = role !== (player.role || "user");

  async function save() {
    setSaving(true);

    try {
      await updateUserAdministration({
        targetUser: player,
        role,
        actorId,
      });
      notify(`Trusted access was updated for ${player.displayName || player.email}.`);
      onUpdated?.(player.id, { role });
    } catch (error) {
      notify(error.message || "The player account could not be updated.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="user-access-row">
      <div className="user-access-row__identity">
        <LegacyAvatar avatarId={player.avatarId} size="small" decorative />
        <div>
          <strong>{player.displayName || player.fullName || "Unnamed player"}</strong>
          <small>{player.email || player.id}</small>
        </div>
      </div>

      <label>
        <span>Trusted role</span>
        <select
          value={role}
          disabled={isCurrentAdministrator}
          onChange={(event) => setRole(event.target.value)}
        >
          {USER_ROLES.map((roleOption) => (
            <option key={roleOption.id} value={roleOption.id}>
              {roleOption.label}
            </option>
          ))}
        </select>
      </label>

      <div className="user-access-row__scope">
        <span>Season membership</span>
        <small>
          House placement is managed inside each season and cannot be assigned
          permanently from a player profile.
        </small>
      </div>

      <div className="user-access-row__action">
        <span className={`status-pill status-pill--${player.role === "admin" ? "published" : "draft"}`}>
          {getRoleLabel(player.role)}
        </span>
        <button
          className="button button--primary"
          type="button"
          disabled={saving || !changed || isCurrentAdministrator}
          onClick={save}
        >
          {saving ? "Saving…" : "Save access"}
        </button>
      </div>
    </article>
  );
}

export default function UserManagement({
  users,
  actorId,
  notify,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  onUpdated,
}) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = useMemo(
    () =>
      users.filter((player) => {
        const haystack = [
          player.displayName,
          player.fullName,
          player.email,
          getRoleLabel(player.role),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return !normalizedSearch || haystack.includes(normalizedSearch);
      }),
    [normalizedSearch, users],
  );

  return (
    <section className="admin-users">
      <div className="admin-section-heading">
        <div>
          <p className="section-kicker">Trusted access</p>
          <h2>Player and role management</h2>
          <p>
            Administrative roles represent responsibility, not status. Every
            role change is recorded in the audit history. Seasonal House
            membership remains inside the relevant season.
          </p>
        </div>
        <strong>{formatNumber(users.length, { whole: true })} loaded players</strong>
      </div>

      <label className="admin-search card">
        <span>Search loaded players</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or role"
        />
      </label>

      <div className="user-access-list card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">No players match your search.</div>
        ) : (
          filteredUsers.map((player) => (
            <UserAccessRow
              key={`${player.id}-${player.role}`}
              player={player}
              actorId={actorId}
              notify={notify}
              onUpdated={onUpdated}
            />
          ))
        )}
      </div>

      {hasMore && (
        <button
          className="button button--secondary admin-load-more"
          type="button"
          disabled={loadingMore}
          onClick={onLoadMore}
        >
          {loadingMore ? "Loading more players…" : "Load more players"}
        </button>
      )}
    </section>
  );
}
