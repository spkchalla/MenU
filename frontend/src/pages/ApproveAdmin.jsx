import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const ApproveAdmin = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const token = localStorage.getItem('menu_token');
      const res = await api.get('/user/approvals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(res.data);
    } catch (err) {
      setError('Failed to fetch pending approvals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (approvalId, action) => {
    try {
      const token = localStorage.getItem('menu_token');
      await api.post('/user/handle-approval', { approvalId, action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(pendingUsers.filter(req => req._id !== approvalId));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <div className="auth-container">Loading...</div>;

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h2>Approve Admins</h2>
        <p className="auth-subtitle">Review pending admin access requests</p>

        {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}

        <div className="pending-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendingUsers.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No pending requests.</p>
          ) : (
            pendingUsers.map(request => (
              <div key={request._id} style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--card-border)'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{request.user?.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{request.user?.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Requested: {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleDecision(request._id, 'approve')}
                    style={{
                      background: 'var(--accent-color)',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(request._id, 'reject')}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
