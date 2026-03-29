import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const pressTimer = useRef(null);

    const handlePressStart = () => {
        pressTimer.current = setTimeout(() => {
            const code = window.prompt("Admin mode enabled. Enter passkey:");
            if (code && code.toLowerCase() === 'brunati') {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('admin_token');
                localStorage.removeItem('user_auth');
                window.open('/admin/login', '_blank');
            }
        }, 2000); // 2 seconds
    };

    const handlePressEnd = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    return (
        <footer>
            <div 
                className="footer-logo"
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                style={{ cursor: 'pointer', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
            >
                Brunati
            </div>
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
