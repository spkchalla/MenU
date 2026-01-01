import React, { useState, useEffect } from 'react';
import './Auth.css';

export const ApproveAdmin = () => {
  // Mock data - replace with API call
  const [pendingUsers, setPendingUsers] = useState([
    { id: 1, username: 'john_doe', email: 'john@example.com' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com' }
  ]);

  const handleApprove = (id) => {
    console.log('Approve user:', id);
    // Add API call logic here
    setPendingUsers(pendingUsers.filter(user => user.id !== id));
  };

  const handleReject = (id) => {
    console.log('Reject user:', id);
    // Add API call logic here
    setPendingUsers(pendingUsers.filter(user => user.id !== id));
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h2>Approve Admins</h2>
        <p className="auth-subtitle">Review pending admin access requests</p>

        <div className="pending-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendingUsers.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No pending requests.</p>
          ) : (
            pendingUsers.map(user => (
              <div key={user.id} style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--card-border)'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.username}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleApprove(user.id)}
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
                    onClick={() => handleReject(user.id)}
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
