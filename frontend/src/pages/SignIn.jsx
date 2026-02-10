import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Auth.css';
import { isPreviewEnv, isVercelDomain } from "../utils/env";

export const SignIn = () => {
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



    const isPreview = isPreviewEnv();
    const isVercel = isVercelDomain();

    const handleGoogleLogin = () => {
        if (isPreview || isVercel) {
            alert("Authentication is disabled on this domain. Please use mu-menu.in.");
            return;
        }
        // Redirect to backend Google Auth endpoint
        window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/google`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isPreview || isVercel) {
            setError("Authentication is disabled on this domain. Please use mu-menu.in.");
            return;
        }
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/user/login', formData);
            const { token } = res.data;

            // Email login still returns token
            // Store in localStorage for hybrid support
            localStorage.setItem('menu_token', token);

            const payload = JSON.parse(atob(token.split('.')[1]));
            localStorage.setItem('menu_user_role', payload.role);
            localStorage.setItem('menu_user_id', payload.userId);

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
            <Link to="/" className="auth-back-btn">
                &larr; Back
            </Link>
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Sign in to manage your menu</p>

                <h3 className="auth-section-title">Sign in with Google</h3>
                <button className="google-btn" onClick={handleGoogleLogin}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    Sign in with Google
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <h3 className="auth-section-title">Email / Password Login</h3>
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
                        <small style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                            Passwords are securely hashed and never stored in plaintext.
                        </small>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In with Email'}
                    </button>
                </form>

                <div className="auth-info-box">
                    <p className="auth-info-text">We use Google OAuth for Google Sign-In.</p>
                    <p className="auth-info-text">For email/password login, passwords are securely hashed using bcrypt.</p>
                    <p className="auth-info-text">We never store plaintext passwords.</p>
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );
};
