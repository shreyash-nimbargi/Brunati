import { useState, useEffect } from 'react';

/**
 * useAdminAuth - Simple hook to manage Admin session.
 * For now, uses localStorage but in production should use secure HttpOnly cookies/JWT.
 */
const useAdminAuth = () => {
    const [isAdmin, setIsAdmin] = useState(() => {
        return !!localStorage.getItem('admin_token');
    });

    const adminLogin = (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        // Mock authentication
        if (cleanEmail === 'admin@brunati.com' && cleanPassword === 'brunati2026') {
            localStorage.setItem('admin_token', 'mock_token_' + Date.now());
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const adminLogout = () => {
        localStorage.removeItem('admin_token');
        setIsAdmin(false);
    };

    return {
        isAdmin,
        adminLogin,
        adminLogout
    };
};

export default useAdminAuth;
