import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import './CreateMenu.css';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

export const CreateMenu = () => {
  const [menuText, setMenuText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('menu_token');

      if (!token) {
        throw new Error('Please login to create a menu');
      }

      // Call the API to create menu
      const response = await api.post('/menu/createMenu', menuText, {
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Menu created successfully:', response.data);
      setSuccess(true);
      setMenuText(''); // Clear the textarea on success

      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Error creating menu:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create menu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Loading Overlay with Blur */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Generating your menu...</p>
            <p className="loading-subtext">This may take a few moments</p>
          </div>
        </div>
      )}

      <div className={`auth-card ${isLoading ? 'blurred' : ''}`} style={{ maxWidth: '600px' }}>
        <h2>Create Weekly Menu</h2>
        <p className="auth-subtitle">Paste your menu text below to generate a new weekly plan</p>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            ✅ Menu created successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="menuText">Menu Content</label>
            <textarea
              id="menuText"
              value={menuText}
              onChange={(e) => setMenuText(e.target.value)}
              placeholder="Paste the menu text here..."
              required
              disabled={isLoading}
              style={{
                minHeight: '200px',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                padding: '16px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-main)',
                fontSize: '1rem',
                resize: 'vertical',
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? 'not-allowed' : 'text'
              }}
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Menu'}
          </button>
        </form>
      </div>
    </div>
  );
};
