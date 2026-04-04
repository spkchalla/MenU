import React, { useState } from "react";
import api from "../utils/api";
import "./SuggestionForm.css";

export const SuggestionForm = () => {
  const [suggestion, setSuggestion] = useState("");
  const [type, setType] = useState("");
  const [wantToContribute, setWantToContribute] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!suggestion.trim() || !type) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      await api.post("/suggestions/createSuggestion", {
        suggestion: suggestion.trim(),
        type,
        wantToContribute,
      });

      setSuccess("Thank you! Your suggestion has been submitted successfully.");
      setSuggestion("");
      setType("");
      setWantToContribute(false);

      // Clear success message after 2 seconds
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit suggestion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showContributeCheckbox = ["bug", "feature request"].includes(type);
  const isAuthenticated = !!localStorage.getItem("menu_token");

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  return (
    <div className="suggestion-form-container">
      <div className="suggestion-form-header">
        <h1 className="suggestion-form-title">Share Your Feedback</h1>
        <p className="suggestion-form-subtitle">
          Help us improve by sharing your suggestions, bug reports, or feature requests.
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="login-prompt-card">
          <h2>Login Required</h2>
          <p>Please sign in to share your feedback and help us improve.</p>
          <button className="google-auth-btn" onClick={handleGoogleAuth}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      ) : (
        <form className="suggestion-form" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="message-box message-error">
              <span className="message-icon">✕</span>
              <span className="message-text">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="message-box message-success">
              <span className="message-icon">✓</span>
              <span className="message-text">{success}</span>
            </div>
          )}

          {/* Type Selection */}
          <fieldset className="form-group" style={{ border: "none", padding: 0, margin: 0 }}>
            <legend className="form-label">Type of Feedback *</legend>
            <div className="checkbox-group">
              {["bug", "feature request", "suggestion regarding food"].map((option) => {
                const radioId = `type-${option.replace(/\s+/g, "-")}`;
                return (
                  <div key={option} className="checkbox-label-container">
                    <div className="checkbox-label">
                      <input
                        type="radio"
                        id={radioId}
                        name="type"
                        value={option}
                        checked={type === option}
                        onChange={(e) => setType(e.target.value)}
                        className="checkbox-input"
                      />
                      <label htmlFor={radioId} className="checkbox-text">
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    </div>
                    {option === "suggestion regarding food" && (
                      <div className="warning-text">
                        Please keep your suggestions respectful.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>

          {/* Suggestion Text Area */}
          <div className="form-group">
            <label htmlFor="suggestion" className="form-label">
              Your Suggestion *
            </label>
            <textarea
              id="suggestion"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Please share your feedback here... (minimum 10 characters, maximum 500 characters)"
              className="form-textarea"
              minLength={10}
              maxLength={500}
              disabled={loading}
            />
            <div className="character-count">{suggestion.length}/500 characters</div>
          </div>

          {/* Contribute Checkbox - Conditional Rendering */}
          {showContributeCheckbox && (
            <div className="form-group">
              <label className="checkbox-label contribute-checkbox">
                <input
                  type="checkbox"
                  checked={wantToContribute}
                  onChange={(e) => setWantToContribute(e.target.checked)}
                  className="checkbox-input"
                  disabled={loading}
                />
                <span className="checkbox-text">I would like to contribute to fixing this</span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
};
