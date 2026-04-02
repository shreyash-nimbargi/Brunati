import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};

/**
 * Mock auth context — replaces with real backend integration later.
 * isAdmin is toggled via the admin login flow in AdminLayout.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const adminToken = localStorage.getItem('adminToken');
        return {
            name: 'Shreyash Nimbargi',
            email: 'shreyash@example.com',
            isAdmin: !!adminToken,
            isLoggedIn: !!adminToken,
        };
    });

    const adminLogin = (email, password) => {
        // Mock credentials — swap for real API call in production
        if (email === 'admin@brunati.com' && password === 'brunati2026') {
            const adminUser = { ...user, isAdmin: true, isLoggedIn: true };
            setUser(adminUser);
            localStorage.setItem('adminToken', 'mock_token_2026'); // Persist token for services/api.js
            return true;
        }
        return false;
    };

    const adminLogout = () => {
        setUser(prev => ({ ...prev, isAdmin: false, isLoggedIn: false }));
        localStorage.removeItem('adminToken');
    };

    return (
        <AuthContext.Provider value={{ user, adminLogin, adminLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
