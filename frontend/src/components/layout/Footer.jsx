import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="footer-logo">Brunati</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Curated luxury • Timeless scents • Global presence
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                © 2026 Brunati Parfums. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
