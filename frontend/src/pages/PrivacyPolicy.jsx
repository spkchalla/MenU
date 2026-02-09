import React from 'react';

export const PrivacyPolicy = () => {
    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px 20px',
            color: 'var(--text-primary)', // Assuming these variables exist given other css files
            lineHeight: '1.6'
        }}>
            <h1 style={{ marginBottom: '24px', borderBottom: '1px solid #ccc', paddingBottom: '16px' }}>Privacy Policy</h1>

            <p>We collect the following information:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '24px' }}>
                <li>Google profile information (name, email, profile image) when you sign in with Google</li>
                <li>Email address if you create an account using email and password</li>
            </ul>

            <p style={{ marginBottom: '24px' }}>
                Passwords are securely hashed using bcrypt.<br />
                We never store plaintext passwords.
            </p>

            <p style={{ marginBottom: '24px' }}>We use this data only to provide authentication and core app functionality.</p>

            <p style={{ marginBottom: '24px' }}>We do not sell or share user data with third parties.</p>

        </div>
    );
};
