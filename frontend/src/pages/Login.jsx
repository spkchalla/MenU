import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

// axios instance with env-based base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/user/login', formData);
      const { token } = res.data;

      // Store token in localStorage
      localStorage.setItem('menu_token', token);

      // Decode token to get role (simple decode, in prod use a library or just trust the backend response if it sent the user object)
      // For now, let's assume we can navigate to admin and let the admin page verify.
      // Or we can parse the JWT payload.
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('menu_user_role', payload.role);

      if (payload.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to manage your menu</p>

        {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
