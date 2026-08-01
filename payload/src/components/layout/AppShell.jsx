import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import LegacyAvatar from "../profile/LegacyAvatar";

import {
  ADMIN_NAV_ITEM,
  FUTURE_NAV_ITEMS,
  MOBILE_NAV_ITEMS,
  PRIMARY_NAV_ITEMS,
  getNavigationItemByPath,
} from "../../constants/navigation";
import useAnnouncements from "../../hooks/useAnnouncements";
import usePlayerData from "../../hooks/usePlayerData";
import { logoutUser } from "../../services/auth/authService";
import "./AppShell.css";

const numberFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

function getDisplayName(profile, user) {
  return (
    profile?.displayName ||
    profile?.fullName ||
    user?.displayName ||
    user?.email ||
    "Champion"
  );
}

function NavigationLink({ item, compact = false, onNavigate, badge }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `app-nav__link app-nav__link--${item.tone || "blue"}${
          isActive ? " app-nav__link--active" : ""
        }${item.accent ? " app-nav__link--accent" : ""}`
      }
      aria-label={compact ? item.label : undefined}
      title={compact ? item.description : undefined}
      onClick={onNavigate}
    >
      <span className="app-nav__icon" aria-hidden="true">
        {item.icon}
      </span>

      {!compact && <span className="app-nav__label">{item.label}</span>}

      {!compact && (badge ?? item.badge) && (
        <span className="app-nav__badge">{badge ?? item.badge}</span>
      )}
    </NavLink>
  );
}

function ShellStat({ icon, value, label }) {
  return (
    <span className="app-shell-stat" title={label}>
      <span aria-hidden="true">{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </span>
  );
}

function MoreMenu({
  isAdmin,
  displayName,
  avatarId,
  onNavigate,
  onLogout,
}) {
  return (
    <div className="app-more-panel" role="dialog" aria-label="More navigation">
      <div className="app-more-panel__header">
        <LegacyAvatar avatarId={avatarId} size="medium" decorative />

        <div>
          <strong>{displayName}</strong>
          <small>Choose the next chapter</small>
        </div>
      </div>

      <div className="app-more-panel__section">
        <p>Account</p>
        <NavigationLink
          item={PRIMARY_NAV_ITEMS.find((item) => item.id === "profile")}
          onNavigate={onNavigate}
        />

        {isAdmin && (
          <NavigationLink item={ADMIN_NAV_ITEM} onNavigate={onNavigate} />
        )}
      </div>

      <div className="app-more-panel__section">
        <p>Coming next</p>
        {FUTURE_NAV_ITEMS.map((item) => (
          <NavigationLink key={item.id} item={item} onNavigate={onNavigate} />
        ))}
      </div>

      <button
        className="app-more-panel__logout"
        type="button"
        onClick={onLogout}
      >
        <span aria-hidden="true">↪</span>
        Sign out
      </button>
    </div>
  );
}

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, progression, error } = usePlayerData();
  const { unreadCount } = useAnnouncements();
  const [moreOpen, setMoreOpen] = useState(false);
  const [brandClicks, setBrandClicks] = useState(0);
  const [secretMessage, setSecretMessage] = useState("");

  const displayName = getDisplayName(profile, user);
  const activeItem = getNavigationItemByPath(location.pathname);
  const isAdmin = profile?.role === "admin";
  const desktopMoreIsActive = Boolean(
    activeItem &&
      (activeItem.id === "admin" ||
        FUTURE_NAV_ITEMS.some((item) => item.id === activeItem.id)),
  );
  const mobileMoreIsActive = Boolean(
    activeItem &&
      !MOBILE_NAV_ITEMS.some((item) => item.id === activeItem.id),
  );

  useEffect(() => {
    if (!secretMessage) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setSecretMessage(""), 4200);
    return () => window.clearTimeout(timeout);
  }, [secretMessage]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMoreOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function closeMoreMenu() {
    setMoreOpen(false);
  }

  function handleBrandClick() {
    const nextClicks = brandClicks + 1;
    setBrandClicks(nextClicks);

    if (nextClicks >= 5) {
      setBrandClicks(0);
      setSecretMessage(
        "🏆 Trophy inspection complete. It remains suspiciously shiny.",
      );
    }
  }

  async function handleLogout() {
    closeMoreMenu();

    try {
      await logoutUser();
      navigate("/", { replace: true });
    } catch (logoutError) {
      console.error(logoutError);
      setSecretMessage(
        logoutError.message || "The exit door got confused. Please try again.",
      );
    }
  }

  const shellStats = [
    {
      id: "streak",
      icon: "🔥",
      value: progression.streak.currentStreak,
      label: "day streak",
    },
    {
      id: "level",
      icon: "⚡",
      value: progression.xp.level,
      label: "level",
    },
    {
      id: "points",
      icon: "⭐",
      value: numberFormatter.format(progression.score.totalPoints),
      label: "points",
    },
  ];

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Application navigation">
        <button
          className="app-brand"
          type="button"
          onClick={handleBrandClick}
          aria-label="Champions Legacy Challenge. Click repeatedly for absolutely no reason."
        >
          <span className="app-brand__mark" aria-hidden="true">
            🏆
          </span>

          <span className="app-brand__copy">
            <strong>Champions Legacy</strong>
            <small>Challenge</small>
          </span>
        </button>

        <div className="app-sidebar__stats" aria-label="Player status">
          {shellStats.map((stat) => (
            <ShellStat key={stat.id} {...stat} />
          ))}
        </div>

        <nav className="app-nav" aria-label="Primary navigation">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavigationLink
              key={item.id}
              item={item}
              badge={item.id === "announcements" && unreadCount > 0 ? unreadCount : undefined}
              onNavigate={closeMoreMenu}
            />
          ))}

          <button
            className={`app-nav__link app-nav__link--more${
              moreOpen || desktopMoreIsActive ? " app-nav__link--active" : ""
            }`}
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            onClick={() => setMoreOpen((current) => !current)}
          >
            <span className="app-nav__icon" aria-hidden="true">
              •••
            </span>
            <span className="app-nav__label">More</span>
          </button>
        </nav>

        <div className="app-sidebar__footer">
          <NavLink
            className="app-player"
            to="/profile"
            aria-label={`Open ${displayName}'s profile`}
            onClick={closeMoreMenu}
          >
            <LegacyAvatar
              avatarId={profile?.avatarId}
              size="small"
              decorative
            />

            <span className="app-player__copy">
              <strong>{displayName}</strong>
              <small>{profile?.role || "Player"}</small>
            </span>
          </NavLink>
        </div>
      </aside>

      <div className="app-shell__stage">
        <header className="app-mobile-header">
          <div className="app-mobile-header__identity">
            <button
              className="app-mobile-header__brand"
              type="button"
              onClick={handleBrandClick}
              aria-label="Champions Legacy Challenge"
            >
              <span aria-hidden="true">🏆</span>
            </button>

            <div>
              <small>Champions Legacy Challenge</small>
              <strong>{activeItem?.label || "Your journey"}</strong>
            </div>
          </div>

          <div className="app-mobile-header__stats" aria-label="Player status">
            {shellStats.map((stat) => (
              <span key={stat.id} title={stat.label}>
                <span aria-hidden="true">{stat.icon}</span>
                <strong>{stat.value}</strong>
              </span>
            ))}
          </div>
        </header>

        <main className="app-content" id="main-content">
          {error && (
            <div
              className="inline-alert inline-alert--danger app-content__error"
              role="alert"
            >
              {error}
            </div>
          )}

          <Outlet />
        </main>
      </div>

      <nav className="app-mobile-nav" aria-label="Primary mobile navigation">
        {MOBILE_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `app-mobile-nav__link app-mobile-nav__link--${item.tone}${
                isActive ? " app-mobile-nav__link--active" : ""
              }`
            }
            aria-label={
              item.id === "announcements" && unreadCount > 0
                ? `${item.label}, ${unreadCount} unread`
                : item.label
            }
            onClick={closeMoreMenu}
          >
            <span className="app-mobile-nav__icon" aria-hidden="true">
              {item.icon}
              {item.id === "announcements" && unreadCount > 0 && (
                <span className="app-mobile-nav__badge">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
            <small>{item.shortLabel}</small>
          </NavLink>
        ))}

        <button
          className={`app-mobile-nav__link app-mobile-nav__more${
            moreOpen || mobileMoreIsActive ? " app-mobile-nav__link--active" : ""
          }`}
          type="button"
          aria-expanded={moreOpen}
          aria-haspopup="dialog"
          onClick={() => setMoreOpen((current) => !current)}
        >
          <span aria-hidden="true">•••</span>
          <small>More</small>
        </button>
      </nav>

      {moreOpen && (
        <>
          <button
            className="app-more-scrim"
            type="button"
            aria-label="Close more menu"
            onClick={closeMoreMenu}
          />

          <MoreMenu
            isAdmin={isAdmin}
            displayName={displayName}
            avatarId={profile?.avatarId}
            onNavigate={closeMoreMenu}
            onLogout={handleLogout}
          />
        </>
      )}

      {secretMessage && (
        <div className="app-secret-toast" role="status">
          {secretMessage}
        </div>
      )}
    </div>
  );
}
