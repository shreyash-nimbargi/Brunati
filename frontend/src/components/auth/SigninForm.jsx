import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SigninForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                navigate('/account');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Sign In</h2>
            <p style={{ color: '#6e6e73', textAlign: 'center', marginBottom: '32px' }}>Welcome back to Brunati.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1d1d1f' }}>EMAIL</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: '12px', border: '1px solid #d2d2d7', borderRadius: '8px', fontSize: '1rem' }}
                        placeholder="email@example.com"
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1d1d1f' }}>PASSWORD</label>
                        <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#0066cc', textDecoration: 'none' }}>Forgot password?</Link>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '12px', border: '1px solid #d2d2d7', borderRadius: '8px', fontSize: '1rem' }}
                        placeholder="••••••••"
                    />
                </div>

                {error && <p style={{ color: '#ff3b30', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '16px',
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginTop: '12px'
                    }}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', color: '#6e6e73' }}>
                Don't have an account? <Link to="/signup" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
            </p>
        </div>
    );
};

export default SigninForm;
