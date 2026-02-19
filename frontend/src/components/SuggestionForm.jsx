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

      // Clear success message after 5 seconds
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

  return (
    <div className="suggestion-form-container">
      <div className="suggestion-form-header">
        <h1 className="suggestion-form-title">Share Your Feedback</h1>
        <p className="suggestion-form-subtitle">
          Help us improve by sharing your suggestions, bug reports, or feature requests.
        </p>
      </div>

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
        <div className="form-group">
          <label className="form-label">Type of Feedback *</label>
          <div className="checkbox-group">
            {["bug", "feature request", "suggestion regarding food"].map((option) => (
              <label key={option} className="checkbox-label">
                <input
                  type="radio"
                  name="type"
                  value={option}
                  checked={type === option}
                  onChange={(e) => setType(e.target.value)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

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
    </div>
  );
};
