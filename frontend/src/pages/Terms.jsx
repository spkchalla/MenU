import React from 'react';

export const TermsComponent = () => {
    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px 20px',
            color: 'var(--text-primary)',
            lineHeight: '1.6'
        }}>
            <h1 style={{ marginBottom: '24px', borderBottom: '1px solid #ccc', paddingBottom: '16px' }}>Terms & Conditions</h1>

            <p style={{ marginBottom: '16px' }}>This service allows users to create accounts and participate in app features.</p>

            <p style={{ marginBottom: '16px' }}>Users are responsible for maintaining the security of their accounts.</p>

            <p style={{ marginBottom: '16px' }}>Authentication is handled using Google OAuth and/or email and password login.</p>

            <p style={{ marginBottom: '16px' }}>We may suspend or terminate access for abuse or misuse of the service.</p>

            <p>The service is provided "as is" without warranties.</p>
        </div>
    );
};
