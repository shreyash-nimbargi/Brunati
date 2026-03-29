import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminAuth from '../hooks/useAdminAuth';

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

/**
 * AdminLogin — dedicated /admin/login page.
 * Independent of the customer auth flow.
 * Minimalist "Staff Entry" look: white, black borders, 0px radius.
 */
const AdminLogin = () => {
    const { adminLogin } = useAdminAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            // Mock: email=admin@brunati.com, password=brunati2026
            const ok = adminLogin(email, password);
            if (ok) {
                navigate('/admin/dashboard', { replace: true });
            } else {
                setError('Invalid credentials. Access denied.');
            }
            setLoading(false);
        }, 300);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#ffffff',
            display: 'flex',
            fontFamily: FONT,
        }}>
            {/* Left decorative panel */}
            <div style={{
                display: 'none',
                width: '40%',
                background: '#1d1d1f',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px',
            }}
                className="admin-login-panel"
            >
                <div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'none', margin: 0 }}>
                        Brunati
                    </p>
                    <p style={{ fontFamily: '"Roboto", sans-serif', color: '#ffffff', fontSize: '1.4rem', fontWeight: 700, margin: '4px 0 0', textTransform: 'none', letterSpacing: 'normal' }}>
                        Admin panel
                    </p>
                </div>
                <div>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', letterSpacing: '0.04em', lineHeight: 1.6 }}>
                        Restricted access. Authorised staff only.<br />
                        All sessions are logged.
                    </p>
                </div>
            </div>

            {/* Right — form panel */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
            }}>
                <div style={{ width: '100%', maxWidth: 360 }}>

                    {/* Header */}
                    <div style={{ marginBottom: 40 }}>
                        <p style={{
                            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em',
                            textTransform: 'none', color: '#6e6e73', margin: '0 0 10px',
                        }}>
                            Brunati · Staff Entry
                        </p>
                        <h1 style={{
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: '1.4rem', fontWeight: 700, color: '#1d1d1f',
                            margin: 0, textTransform: 'none', letterSpacing: 'normal', lineHeight: 1.2,
                        }}>
                            Sign in to<br />Admin panel
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{
                                display: 'block', fontSize: '0.72rem', fontWeight: 600,
                                color: '#6e6e73', marginBottom: 8,
                                textTransform: 'none', letterSpacing: '0.07em',
                            }}>
                                Email Address
                            </label>
                            <input
                                id="admin-email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                placeholder="staff@brunati.com"
                                required
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    background: '#fff',
                                    border: '1px solid rgba(0,0,0,0.15)',
                                    borderRadius: 0,
                                    padding: '12px 14px',
                                    color: '#1d1d1f', fontFamily: FONT, fontSize: '0.92rem',
                                    outline: 'none', transition: 'border-color 0.2s',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#111'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={{
                                display: 'block', fontSize: '0.72rem', fontWeight: 600,
                                color: '#6e6e73', marginBottom: 8,
                                textTransform: 'none', letterSpacing: '0.07em',
                            }}>
                                Password
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                placeholder="••••••••••"
                                required
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    background: '#fff',
                                    border: '1px solid rgba(0,0,0,0.15)',
                                    borderRadius: 0,
                                    padding: '12px 14px',
                                    color: '#1d1d1f', fontFamily: FONT, fontSize: '0.92rem',
                                    outline: 'none', transition: 'border-color 0.2s',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#111'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; }}
                            />
                        </div>

                        {error && (
                            <div style={{
                                marginBottom: 20, padding: '10px 14px',
                                background: '#fff5f5',
                                border: '1px solid rgba(255,59,48,0.25)',
                                display: 'flex', alignItems: 'center', gap: 8,
                            }}>
                                <svg width="14" height="14" fill="none" stroke="#ff3b30" viewBox="0 0 24 24" strokeWidth={2} style={{ flexShrink: 0 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span style={{ fontFamily: FONT, fontSize: '0.78rem', color: '#ff3b30' }}>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="admin-login-btn"
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px 0',
                                background: loading ? '#555' : '#111',
                                color: '#fff', fontFamily: FONT,
                                fontSize: '0.85rem', fontWeight: 600,
                                border: '1px solid #111', borderRadius: 0,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                letterSpacing: '0.06em', transition: 'all 0.25s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#111'; } }}
                            onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; } }}
                        >
                            {loading ? (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: 'spin 0.8s linear infinite' }}>
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                    Verifying…
                                </>
                            ) : 'Staff Login'}
                        </button>
                    </form>

                    <p style={{
                        marginTop: 32, fontSize: '0.7rem', color: '#9ca3af',
                        textAlign: 'center', lineHeight: 1.6,
                    }}>
                        Restricted access. This page is not linked from the public site.<br />
                        All login attempts are monitored.
                    </p>
                </div>
            </div>

            {/* Spinning animation for loading */}
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (min-width: 769px) {
                    .admin-login-panel { display: flex !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
