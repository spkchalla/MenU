import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const UserDashboard = () => {
    const navigate = useNavigate();
    const [requestStatus, setRequestStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Check for token in URL first (OAuth callback scenario)
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        const urlRole = params.get('role');
        const urlId = params.get('id');

        if (urlToken) {
            localStorage.setItem('menu_token', urlToken);
            localStorage.setItem('menu_user_role', urlRole);
            localStorage.setItem('menu_user_id', urlId);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const token = localStorage.getItem('menu_token');
            const res = await api.get('/user/my-approval-status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequestStatus(res.data);
        } catch (err) {
            console.error("Error fetching status:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = async () => {
        setSubmitting(true);
        setError('');
        try {
            const token = localStorage.getItem('menu_token');
            await api.post('/user/request-admin', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchStatus();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="auth-container">Loading...</div>;

    return (
        <div className="auth-container">
            <Link to="/" className="auth-back-btn" style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                &larr; Back
            </Link>
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <h2>User Dashboard</h2>
                <p className="auth-subtitle">Manage your account and privileges</p>

                <div className="status-section" style={{ marginTop: '24px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    {!requestStatus ? (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                                You currently have standard user privileges. Would you like to request admin access?
                            </p>
                            {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}
                            <button
                                onClick={handleRequest}
                                className="submit-btn"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Request Admin Privileges'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            {requestStatus.status === 'pending' && (
                                <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                                    <p style={{ color: '#eab308', fontWeight: '600' }}>Request Pending</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                        Your request for admin privileges is currently under review.
                                    </p>
                                </div>
                            )}
                            {requestStatus.status === 'approved' && (
                                <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                                    <p style={{ color: '#22c55e', fontWeight: '600' }}>Request Approved!</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                        You have been granted admin privileges. Please log in again to see the changes.
                                    </p>
                                </div>
                            )}
                            {requestStatus.status === 'rejected' && (
                                <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                    <p style={{ color: '#ef4444', fontWeight: '600' }}>Request Rejected</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                        Your request for admin privileges was rejected. Contact the head admin for more details.
                                    </p>
                                    <button
                                        onClick={handleRequest}
                                        className="submit-btn"
                                        style={{ marginTop: '16px' }}
                                        disabled={submitting}
                                    >
                                        Re-request Admin Access
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
