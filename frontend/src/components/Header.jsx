import React, { useEffect, useState } from "react";
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
  }, [location]);

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
          {isAuthenticated &&
            (isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="nav-link admin-link"
                  style={{ display: "inline-block" }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/suggestions"
                  className="nav-link admin-link"
                  style={{ marginRight: "1rem", display: "inline-block" }}
                >
                  Suggestions
                </Link>
              </>
            ) : (
              <Link to="/user/dashboard" className="nav-link admin-link" style={{ display: "inline-block" }}>
                User Dashboard
              </Link>
            ))}

          <Link
            to="/about"
            className="nav-link admin-link"
            style={{ marginRight: "1rem", display: "inline-block" }}
          >
            About
          </Link>

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {isAuthenticated ? (
            <button className="auth-btn" onClick={handleLogout}>
              Sign Out
            </button>
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
