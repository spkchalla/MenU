import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('menu_token');
    const role = localStorage.getItem('menu_user_role');

    console.log("Header Auth Check - Token:", !!token, "Role:", role);

    setIsAuthenticated(!!token);
    // Check for 'admin' case-insensitive and handle potential null/undefined
    setIsAdmin(role && role.toLowerCase() === 'admin');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('menu_token');
    localStorage.removeItem('menu_user_role');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <a href="/" className="logo">MenU</a>

        <div className="header-actions">
          {isAdmin && (
            <Link to="/admin/dashboard" className="nav-link admin-link" style={{ display: 'inline-block' }}>
              Dashboard
            </Link>
          )}

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <button className="auth-btn" onClick={handleLogout}>Sign Out</button>
          ) : (
            <Link to="/login" className="auth-btn">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;