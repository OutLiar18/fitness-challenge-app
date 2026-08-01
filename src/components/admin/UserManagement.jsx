import { useMemo, useState } from "react";

import { USER_ROLES, getRoleLabel } from "../../constants/admin";
import { updateUserAdministration } from "../../services/admin/userAdminService";
import { formatNumber } from "../../utils/displayFormatters";
import LegacyAvatar from "../profile/LegacyAvatar";

function UserAccessRow({ player, actorId, notify }) {
  const [role, setRole] = useState(player.role || "user");
  const [team, setTeam] = useState(player.team || "");
  const [saving, setSaving] = useState(false);
  const isCurrentAdministrator = player.id === actorId;
  const changed = role !== (player.role || "user") || team !== (player.team || "");

  async function save() {
    setSaving(true);

    try {
      await updateUserAdministration({
        targetUser: player,
        role,
        team,
        actorId,
      });
      notify(`Trusted access was updated for ${player.displayName || player.email}.`);
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

      <label>
        <span>Team assignment</span>
        <input
          value={team}
          maxLength={80}
          disabled={isCurrentAdministrator}
          onChange={(event) => setTeam(event.target.value)}
          placeholder="No team assigned"
        />
      </label>

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

export default function UserManagement({ users, actorId, notify }) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = useMemo(
    () =>
      users.filter((player) => {
        const haystack = [
          player.displayName,
          player.fullName,
          player.email,
          player.team,
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
            Administrative roles represent responsibility, not status. Every role change is recorded in the audit history.
          </p>
        </div>
        <strong>{formatNumber(users.length, { whole: true })} registered players</strong>
      </div>

      <label className="admin-search card">
        <span>Search players</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email, team or role"
        />
      </label>

      <div className="user-access-list card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">No players match your search.</div>
        ) : (
          filteredUsers.map((player) => (
            <UserAccessRow
              key={`${player.id}-${player.role}-${player.team}`}
              player={player}
              actorId={actorId}
              notify={notify}
            />
          ))
        )}
      </div>
    </section>
  );
}
