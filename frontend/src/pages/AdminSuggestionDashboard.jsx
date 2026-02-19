import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./AdminSuggestionDashboard.css";
import { useNavigate } from "react-router-dom";

export const AdminSuggestionDashboard = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    suggestionId: "",
    userId: "",
    name: "",
    email: "",
  });
  const [activeFilters, setActiveFilters] = useState({});
  const navigate = useNavigate();
  // Fetch suggestions
  const fetchSuggestions = React.useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.get("/suggestions/allSuggestions", {
        params: filterParams,
      });
      setSuggestions(res.data.data?.suggestions || []);

      if (Object.keys(filterParams).length > 0) {
        setMessage(`Found ${res.data.data?.suggestions?.length || 0} suggestion(s)`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch suggestions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const checkAndFetch = async () => {
      const token = localStorage.getItem("menu_token");
      const role = localStorage.getItem("menu_user_role");

      if (!token || role !== "admin") {
        navigate("/login");
        return;
      }
      setIsAdmin(true);
      setLoading(true);
      try {
        await fetchSuggestions();
      } catch (err) {
        // fetchSuggestions already handles error state
      }
      // loading will be set to false by fetchSuggestions finally block
    };
    checkAndFetch();
  }, [navigate, fetchSuggestions]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    const filterParams = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim() !== ""),
    );
    setActiveFilters(filterParams);
    fetchSuggestions(filterParams);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      suggestionId: "",
      userId: "",
      name: "",
      email: "",
    });
    setActiveFilters({});
    fetchSuggestions();
  };

  // Ban user
  const handleBanUser = async (userId) => {
    if (!window.confirm(`Are you sure you want to proceed?`)) {
      return;
    }

    try {
      const res = await api.patch(`/suggestions/banUser/${userId}`);
      // Inspect response for ban state
      const isBanned = res.data?.data?.isBanned;
      if (isBanned === true) {
        setMessage("User has been banned successfully");
      } else if (isBanned === false) {
        setMessage("User has been unbanned successfully");
      } else {
        setMessage("User ban status updated");
      }
      // Refresh suggestions
      fetchSuggestions(activeFilters);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to ban user");
      console.error(err);
    }
  };

  // Archive suggestion
  const handleArchiveSuggestion = async (suggestionId) => {
    if (!window.confirm("Are you sure you want to archive this suggestion?")) {
      return;
    }

    try {
      await api.patch(`/suggestions/archiveSuggestion/${suggestionId}`);
      setMessage("Suggestion has been archived");
      // Remove from list
      setSuggestions((prev) => prev.filter((s) => s._id !== suggestionId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to archive suggestion");
      console.error(err);
    }
  };

  // Report suggestion (placeholder for future implementation)
  const handleReportSuggestion = (suggestionId) => {
    setMessage("Suggestion reported. Our team will review it shortly.");
  };

  const getSuggestionTypeColor = (type) => {
    switch (type) {
      case "bug":
        return "type-bug";
      case "feature request":
        return "type-feature";
      case "suggestion regarding food":
        return "type-food";
      default:
        return "type-default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className="admin-dashboard-container">Loading...</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Suggestions Management</h1>
        <p className="dashboard-subtitle">Review, filter, and manage user feedback and suggestions</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="message-box message-error">
          <span className="message-icon">✕</span>
          <span className="message-text">{error}</span>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className="message-box message-info">
          <span className="message-icon">ℹ</span>
          <span className="message-text">{message}</span>
        </div>
      )}

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h2 className="filter-title">Filters</h2>
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="suggestionId" className="filter-label">
              Suggestion ID
            </label>
            <input
              id="suggestionId"
              type="text"
              name="suggestionId"
              value={filters.suggestionId}
              onChange={handleFilterChange}
              placeholder="Enter suggestion ID"
              className="filter-input"
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="userId" className="filter-label">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              placeholder="Enter user ID"
              className="filter-input"
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="name" className="filter-label">
              User Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Enter user name"
              className="filter-input"
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="email" className="filter-label">
              User Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Enter user email"
              className="filter-input"
              disabled={loading}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="filter-button apply-button" disabled={loading}>
            {loading ? "Applying..." : "Apply Filters"}
          </button>
          <button onClick={handleClearFilters} className="filter-button clear-button" disabled={loading}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="suggestions-section">
        <div className="suggestions-header">
          <h2 className="suggestions-count">
            {suggestions.length} Suggestion{suggestions.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {suggestions.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">
              {Object.keys(activeFilters).length > 0
                ? "No suggestions found matching your filters"
                : "No suggestions yet"}
            </p>
          </div>
        ) : (
          <div className="suggestions-list">
            {suggestions.map((suggestion) => (
              <div key={suggestion._id} className="suggestion-card">
                <div className="suggestion-header">
                  <div className="suggestion-meta">
                    <span className={`suggestion-type ${getSuggestionTypeColor(suggestion.type)}`}>
                      {suggestion.type}
                    </span>
                    <span className="suggestion-date">{formatDate(suggestion.createdAt)}</span>
                  </div>
                </div>

                <div className="suggestion-content">
                  <p className="suggestion-text">{suggestion.suggestion}</p>
                </div>

                <div className="suggestion-user-info">
                  <div className="user-details">
                    <div className="user-item">
                      <span className="user-label">User:</span>
                      <span className="user-value">{suggestion.user.name}</span>
                    </div>
                    <div className="user-item">
                      <span className="user-label">Email:</span>
                      <span className="user-value">{suggestion.user.email}</span>
                    </div>
                    <div className="user-item">
                      <span className="user-label">User ID:</span>
                      <span className="user-value user-id">{suggestion.user._id}</span>
                    </div>
                  </div>

                  {suggestion.wantToContribute && (
                    <div className="contribute-badge">Willing to Contribute</div>
                  )}
                </div>

                <div className="suggestion-actions">
                  <button
                    onClick={() => handleBanUser(suggestion.user._id)}
                    className={`action-button ban-button `}
                    title="Ban this user from making suggestions"
                  >
                    {suggestion.user.isBanned ? "Unban user" : "Ban User"}
                  </button>
                  <button
                    onClick={() => handleArchiveSuggestion(suggestion._id)}
                    className="action-button archive-button"
                    title="Archive this suggestion"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
