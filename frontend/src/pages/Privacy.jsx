import React from 'react';

export const Privacy = () => {
    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px 20px',
            color: 'var(--text-primary)', // Assuming these variables exist given other css files
            lineHeight: '1.6'
        }}>
            <h1 style={{ marginBottom: '24px', borderBottom: '1px solid #ccc', paddingBottom: '16px' }}>Privacy Policy</h1>

            <p style={{ marginBottom: '16px' }}>We collect the following information:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '24px' }}>
                <li>Google profile information (name, email address, profile image) when you sign in with Google.</li>
                <li>Email address if you create an account using email and password.</li>
                <li>Passwords are securely hashed using bcrypt. We never store plaintext passwords.</li>
            </ul>

            <p style={{ marginBottom: '24px' }}>We use this data only to provide authentication and core app functionality.</p>

            <p style={{ marginBottom: '24px' }}>We do not sell or share user data with third parties.</p>

            <p style={{ marginBottom: '24px' }}>This policy may be updated from time to time.</p>

            <p>If you have any questions about this policy, please contact: <a href="mailto:cspk1694@protonmail.com" style={{ color: 'var(--primary-color)' }}>cspk1694@protonmail.com</a></p>

        </div>
    );
};
