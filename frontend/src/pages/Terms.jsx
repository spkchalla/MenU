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

            <p style={{ marginBottom: '16px' }}>
                Authentication is handled using Google OAuth and/or email and password login.
                For email and password login, passwords are securely stored using industry-standard hashing and are never stored in plaintext.
            </p>

            <p style={{ marginBottom: '16px' }}>Users are responsible for maintaining the security of their accounts.</p>

            <p style={{ marginBottom: '16px' }}>We may suspend or terminate access for abuse or misuse of the service.</p>

            <p style={{ marginBottom: '16px' }}>The service is provided "as is" without warranties of any kind.</p>

            <p style={{ marginBottom: '16px' }}>These terms are governed by applicable local laws.</p>

            <p>For questions or concerns, please contact: <a href="mailto:cspk1694@protonmail.com" style={{ color: 'var(--primary-color)' }}>cspk1694@protonmail.com</a></p>
        </div>
    );
};
