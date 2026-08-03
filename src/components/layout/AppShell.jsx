import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  ADMIN_NAV_ITEM,
  SECONDARY_NAV_ITEMS,
  REFERENCE_NAV_ITEMS,
  MOBILE_NAV_ITEMS,
  PRIMARY_NAV_ITEMS,
  getNavigationItemByPath,
} from "../../constants/navigation";
import useAnnouncements from "../../hooks/useAnnouncements";
import usePlayerData from "../../hooks/usePlayerData";
import useNotifications from "../../hooks/useNotifications";
import { logoutUser } from "../../services/auth/authService";
import { formatRole } from "../../utils/displayFormatters";
import LegacyAvatar from "../profile/LegacyAvatar";
import "./AppShell.css";

const compactNumberFormatter = new Intl.NumberFormat(undefined, {
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
  dialogRef,
  isAdmin,
  displayName,
  avatarId,
  notificationUnreadCount,
  onNavigate,
  onLogout,
}) {
  return (
    <div
      ref={dialogRef}
      id="app-more-menu"
      className="app-more-panel"
      role="dialog"
      aria-modal="true"
      aria-label="More navigation"
      tabIndex={-1}
    >
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
        <p>Community and guidance</p>
        {SECONDARY_NAV_ITEMS.map((item) => (
          <NavigationLink
            key={item.id}
            item={item}
            badge={item.id === "notifications" && notificationUnreadCount > 0 ? notificationUnreadCount : undefined}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="app-more-panel__section">
        <p>Challenge reference</p>
        {REFERENCE_NAV_ITEMS.map((item) => (
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
  const {
    profile,
    user,
    progression,
    error,
    isPlatformAdmin,
  } = usePlayerData();
  const { unreadCount } = useAnnouncements();
  const { unreadCount: notificationUnreadCount } = useNotifications();
  const [moreOpen, setMoreOpen] = useState(false);
  const [brandClicks, setBrandClicks] = useState(0);
  const [secretMessage, setSecretMessage] = useState("");
  const dialogRef = useRef(null);
  const desktopMoreButtonRef = useRef(null);
  const mobileMoreButtonRef = useRef(null);
  const activeMoreButtonRef = useRef(null);

  const displayName = getDisplayName(profile, user);
  const activeItem = getNavigationItemByPath(location.pathname);
  const desktopMoreIsActive = Boolean(
    activeItem &&
      (activeItem.id === "admin" ||
        SECONDARY_NAV_ITEMS.some((item) => item.id === activeItem.id) ||
        REFERENCE_NAV_ITEMS.some((item) => item.id === activeItem.id)),
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
    if (!moreOpen) {
      return undefined;
    }

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = dialog?.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMoreOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const currentFocusable = [...dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )];

      if (currentFocusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      activeMoreButtonRef.current?.focus();
    };
  }, [moreOpen]);

  function closeMoreMenu() {
    setMoreOpen(false);
  }

  function toggleMoreMenu(trigger) {
    activeMoreButtonRef.current = trigger;
    setMoreOpen((current) => !current);
  }

  function handleBrandClick() {
    navigate("/dashboard");

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
        logoutError.message || "Sign-out failed. Please try again.",
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
      value: compactNumberFormatter.format(progression.score.totalPoints),
      label: "points",
    },
  ];

  return (
    <div className="app-shell">
      <a className="app-skip-link" href="#main-content">
        Skip to main content
      </a>

      <aside className="app-sidebar" aria-label="Application navigation">
        <button
          className="app-brand"
          type="button"
          onClick={handleBrandClick}
          aria-label="Go to the Champions Legacy Challenge dashboard"
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
              badge={
                item.id === "announcements" && unreadCount > 0
                  ? unreadCount
                  : undefined
              }
              onNavigate={closeMoreMenu}
            />
          ))}

          <button
            ref={desktopMoreButtonRef}
            className={`app-nav__link app-nav__link--more${
              moreOpen || desktopMoreIsActive
                ? " app-nav__link--active"
                : ""
            }`}
            type="button"
            aria-label={
              notificationUnreadCount > 0
                ? `More navigation, ${notificationUnreadCount} unread season ${notificationUnreadCount === 1 ? "notification" : "notifications"}`
                : "More navigation"
            }
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            aria-controls="app-more-menu"
            onClick={() => toggleMoreMenu(desktopMoreButtonRef.current)}
          >
            <span className="app-nav__icon" aria-hidden="true">
              •••
            </span>
            <span className="app-nav__label">More</span>
            {notificationUnreadCount > 0 && (
              <span className="app-nav__badge">
                {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
              </span>
            )}
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
              <small>{formatRole(profile?.role)}</small>
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
              aria-label="Go to the Champions Legacy Challenge dashboard"
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

        <main className="app-content" id="main-content" tabIndex={-1}>
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
          ref={mobileMoreButtonRef}
          className={`app-mobile-nav__link app-mobile-nav__more${
            moreOpen || mobileMoreIsActive
              ? " app-mobile-nav__link--active"
              : ""
          }`}
          type="button"
          aria-expanded={moreOpen}
          aria-haspopup="dialog"
          aria-controls="app-more-menu"
          onClick={() => toggleMoreMenu(mobileMoreButtonRef.current)}
        >
          <span className="app-mobile-nav__icon" aria-hidden="true">
            •••
            {notificationUnreadCount > 0 && (
              <span className="app-mobile-nav__badge">{notificationUnreadCount > 9 ? "9+" : notificationUnreadCount}</span>
            )}
          </span>
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
            dialogRef={dialogRef}
            isAdmin={isPlatformAdmin}
            displayName={displayName}
            avatarId={profile?.avatarId}
            notificationUnreadCount={notificationUnreadCount}
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
