import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api";
import "./Header.css";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const checkNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications/unread-status");
      setHasUnread(res.data.hasUnread);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check URL params (Oauth callback fallback)
      const params = new URLSearchParams(location.search);
      const urlToken = params.get("token");

      if (urlToken) {
        const urlRole = params.get("role");
        const urlId = params.get("id");

        console.log("Oauth Login Detected from URL");
        localStorage.setItem("menu_token", urlToken);
        localStorage.setItem("menu_user_role", urlRole);
        localStorage.setItem("menu_user_id", urlId);

        // Clear URL params to clean up
        window.history.replaceState({}, document.title, location.pathname);

        setIsAuthenticated(true);
        setIsAdmin(urlRole === "admin");
        return;
      }

      const token = localStorage.getItem("menu_token");
      const role = localStorage.getItem("menu_user_role");

      console.log("Header Auth Check - Token:", !!token, "Role:", role);

      if (token) {
        setIsAuthenticated(!!token);
        setIsAdmin(role && role.toLowerCase() === "admin");
      } else {
        // Check with Cookie
        try {
          const res = await api.get("/user/me");
          if (res.data.user) {
            console.log("Cookie Login Successful");
            setIsAuthenticated(true);
            setIsAdmin(res.data.user.role === "admin");
            // Sync basic info to localStorage for other components (legacy support)
            localStorage.setItem("menu_user_role", res.data.user.role);
            localStorage.setItem("menu_user_id", res.data.user._id);
          }
        } catch (err) {
          console.error("Cookie Auth Check Failed:", err.response ? err.response.data : err.message);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      }
    };
    checkAuth();
    if (localStorage.getItem("menu_token")) {
      checkNotifications();
    }
  }, [location, checkNotifications]);

  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch (e) {
      console.error("Logout error", e);
    }
    localStorage.removeItem("menu_token");
    localStorage.removeItem("menu_user_role");
    localStorage.removeItem("menu_user_id");
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">
          MenU
        </Link>

        <div className="header-actions">
          <Link
            to="/about"
            className="nav-link admin-link"
          >
            About
          </Link>

          <Link
            to={isAdmin ? "/admin/suggestions" : "/suggestions"}
            className="nav-link admin-link suggestions-link"
          >
            Suggestion/
            <br />
            Feedback
          </Link>

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {isAuthenticated ? (
            <div className="profile-container">
              <button
                className="profile-icon-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="User Profile"
              >
                <div className="profile-icon">
                  {/* Placeholder icon or user initial */}
                  👤
                  {hasUnread && <span className="unread-dot-header"></span>}
                </div>
              </button>

              {showDropdown && (
                <div className="profile-dropdown">
                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    {isAdmin ? "Admin Dashboard" : "User Dashboard"}
                  </Link>
                  <Link
                    to="/notifications"
                    className="dropdown-item dropdown-item-with-dot"
                    onClick={() => setShowDropdown(false)}
                  >
                    Notifications {hasUnread && <span className="unread-dot-inline"></span>}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/notifications"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Manage Notifications
                    </Link>
                  )}
                  <button
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="auth-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
