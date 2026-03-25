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
    const [user, setUser] = useState({
        name: 'Shreyash Nimbargi',
        email: 'shreyash@example.com',
        isAdmin: false,
        isLoggedIn: false,
    });

    const adminLogin = (email, password) => {
        // Mock credentials — swap for real API call in production
        if (email === 'admin@brunati.com' && password === 'brunati2026') {
            setUser(prev => ({ ...prev, isAdmin: true, isLoggedIn: true }));
            return true;
        }
        return false;
    };

    const adminLogout = () => {
        setUser(prev => ({ ...prev, isAdmin: false, isLoggedIn: false }));
    };

    return (
        <AuthContext.Provider value={{ user, adminLogin, adminLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
