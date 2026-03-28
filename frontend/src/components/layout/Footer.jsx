import React, { useState, useEffect, useRef } from 'react';

const Footer = () => {
    const secretInputRef = useRef(null);
    const [showSecretInput, setShowSecretInput] = useState(false);
    const [secretValue, setSecretValue] = useState('');
    const [longPressTimer, setLongPressTimer] = useState(null);

    useEffect(() => {
        if (showSecretInput && secretInputRef.current) {
            secretInputRef.current.focus();
        }
    }, [showSecretInput]);

    const handleTouchStart = () => {
        const timer = setTimeout(() => {
            setShowSecretInput(true);
        }, 2000); 
        setLongPressTimer(timer);
    };

    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    const handleSecretSubmit = (e) => {
        if (e) e.preventDefault();
        
        // Final trim check to avoid accidental spaces
        const trimmedVal = secretValue.trim().toLowerCase();
        
        if (trimmedVal === 'brunati') {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('user_auth');
            
            const adminUrl = window.location.origin + '/management-portal/login';
            
            // Mobile browsers often block window.open if not directly from a 'click' event.
            // We'll try window.open first, then fallback to window.location.href.
            const newWindow = window.open(adminUrl, '_blank');
            
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                // If blocked or failed, redirect in the same tab
                window.location.href = adminUrl;
            }
            
            setShowSecretInput(false);
            setSecretValue('');
        }
    };

    const handleSecretChange = (e) => {
        setSecretValue(e.target.value);
    };

    return (
        <footer>
            <div 
                className="footer-logo"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onContextMenu={(e) => { if (window.innerWidth <= 768) e.preventDefault(); }}
                style={{ cursor: 'pointer', userSelect: 'none' }}
            >
                Brunati
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Curated luxury • Timeless scents • Global presence
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                © 2026 Brunati Parfums. All rights reserved.
            </p>

            {/* Secret Mobile Input Overlay */}
            {showSecretInput && (
                <form 
                    onSubmit={handleSecretSubmit}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '24px', animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    <div style={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                        <p style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, color: '#000', marginBottom: '24px', fontSize: '18px' }}>
                            ENTER SECRET WORD
                        </p>
                        <input
                            ref={secretInputRef}
                            type="password"
                            value={secretValue}
                            onChange={handleSecretChange}
                            placeholder="••••••"
                            style={{
                                width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #000',
                                textAlign: 'center', fontSize: '24px', fontFamily: '"Roboto", sans-serif',
                                color: '#000', outline: 'none', padding: '8px 0'
                            }}
                        />
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
                            <button 
                                type="submit"
                                style={{
                                    padding: '14px', background: '#000', color: '#fff', border: 'none',
                                    borderRadius: '4px', fontFamily: '"Roboto", sans-serif', fontWeight: 700,
                                    fontSize: '16px', cursor: 'pointer'
                                }}
                            >
                                ACCESS PORTAL
                            </button>
                            <button 
                                type="button"
                                onClick={() => setShowSecretInput(false)}
                                style={{ background: 'none', border: 'none', color: '#666', fontSize: '14px', textDecoration: 'underline' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </footer>
    );
};

export default Footer;
