import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  ADMIN_NAV_ITEM,
  FUTURE_NAV_ITEMS,
  MOBILE_NAV_ITEMS,
  PRIMARY_NAV_ITEMS,
  getNavigationItemByPath,
} from "../../constants/navigation";
import usePlayerData from "../../hooks/usePlayerData";
import { logoutUser } from "../../services/auth/authService";
import "./AppShell.css";

const SIDEBAR_STORAGE_KEY = "champions-legacy-sidebar-collapsed";

function getInitialCollapsedState() {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getDisplayName(profile, user) {
  return (
    profile?.displayName ||
    profile?.fullName ||
    user?.displayName ||
    user?.email ||
    "Champion"
  );
}

function getInitials(displayName) {
  const words = String(displayName)
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase()).join("") || "CL";
}

function NavigationLink({ item, collapsed = false, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `app-nav__link${isActive ? " app-nav__link--active" : ""}${
          item.accent ? " app-nav__link--accent" : ""
        }`
      }
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.description : undefined}
      onClick={onNavigate}
    >
      <span className="app-nav__icon" aria-hidden="true">
        {item.icon}
      </span>

      {!collapsed && (
        <span className="app-nav__copy">
          <span>{item.label}</span>
          <small>{item.description}</small>
        </span>
      )}

      {!collapsed && item.badge && (
        <span className="app-nav__badge">{item.badge}</span>
      )}
    </NavLink>
  );
}

function NavigationSection({
  label,
  items,
  collapsed,
  onNavigate,
}) {
  return (
    <section className="app-nav__section" aria-label={label}>
      {!collapsed && <p className="app-nav__section-label">{label}</p>}
      <div className="app-nav__list">
        {items.map((item) => (
          <NavigationLink
            key={item.id}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, error } = usePlayerData();
  const [collapsed, setCollapsed] = useState(getInitialCollapsedState);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia("(max-width: 940px)").matches,
  );
  const [brandClicks, setBrandClicks] = useState(0);
  const [secretMessage, setSecretMessage] = useState("");

  const displayName = getDisplayName(profile, user);
  const initials = getInitials(displayName);
  const activeItem = getNavigationItemByPath(location.pathname);
  const isAdmin = profile?.role === "admin";
  const navigationCollapsed = collapsed && !isMobile;

  const navigationItems = useMemo(
    () => (isAdmin ? [...PRIMARY_NAV_ITEMS, ADMIN_NAV_ITEM] : PRIMARY_NAV_ITEMS),
    [isAdmin],
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 940px)");
    const handleChange = (event) => setIsMobile(event.matches);

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    } catch {
      // The navigation still works when local storage is unavailable.
    }
  }, [collapsed]);

  useEffect(() => {
    if (!secretMessage) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setSecretMessage(""), 4200);
    return () => window.clearTimeout(timeout);
  }, [secretMessage]);

  function handleBrandClick() {
    const nextClicks = brandClicks + 1;
    setBrandClicks(nextClicks);

    if (nextClicks >= 5) {
      setBrandClicks(0);
      setSecretMessage(
        "🏆 Extremely Suspicious Trophy Inspection complete. Result: still shiny.",
      );
    }
  }

  async function handleLogout() {
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

  return (
    <div className={`app-shell${navigationCollapsed ? " app-shell--collapsed" : ""}`}>
      <aside
        className={`app-sidebar${mobileOpen ? " app-sidebar--open" : ""}`}
        aria-label="Application navigation"
      >
        <div className="app-sidebar__top">
          <button
            className="app-brand"
            type="button"
            onClick={handleBrandClick}
            aria-label="Champions Legacy. Click repeatedly for absolutely no reason."
          >
            <span className="app-brand__mark" aria-hidden="true">
              🏆
            </span>
            {!navigationCollapsed && (
              <span className="app-brand__copy">
                <strong>Champions Legacy</strong>
                <small>Better than yesterday</small>
              </span>
            )}
          </button>

          <button
            className="app-sidebar__collapse"
            type="button"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={() => setCollapsed((current) => !current)}
          >
            <span aria-hidden="true">{collapsed ? "›" : "‹"}</span>
          </button>
        </div>

        <nav className="app-nav">
          <NavigationSection
            label="Navigate"
            items={navigationItems}
            collapsed={navigationCollapsed}
            onNavigate={() => setMobileOpen(false)}
          />

          <NavigationSection
            label="Next chapter"
            items={FUTURE_NAV_ITEMS}
            collapsed={navigationCollapsed}
            onNavigate={() => setMobileOpen(false)}
          />
        </nav>

        <div className="app-sidebar__footer">
          <NavLink
            className="app-player"
            to="/profile"
            aria-label={`Open ${displayName}'s profile`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="app-player__avatar" aria-hidden="true">
              {initials}
            </span>

            {!navigationCollapsed && (
              <span className="app-player__copy">
                <strong>{displayName}</strong>
                <small>{profile?.role || "Player"}</small>
              </span>
            )}
          </NavLink>

          <button
            className="app-sidebar__logout"
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
          >
            <span aria-hidden="true">↪</span>
            {!navigationCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="app-shell__scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="app-shell__stage">
        <header className="app-mobile-header">
          <button
            className="app-mobile-header__menu"
            type="button"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <span aria-hidden="true">☰</span>
          </button>

          <div>
            <small>Champions Legacy</small>
            <strong>{activeItem?.label || "Your journey"}</strong>
          </div>

          <NavLink
            className="app-mobile-header__avatar"
            to="/profile"
            aria-label="Open profile"
          >
            {initials}
          </NavLink>
        </header>

        <main className="app-content" id="main-content">
          {error && (
            <div className="inline-alert inline-alert--danger app-content__error" role="alert">
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
              `app-mobile-nav__link${isActive ? " app-mobile-nav__link--active" : ""}`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            <small>{item.shortLabel}</small>
          </NavLink>
        ))}
      </nav>

      {secretMessage && (
        <div className="app-secret-toast" role="status">
          {secretMessage}
        </div>
      )}
    </div>
  );
}
