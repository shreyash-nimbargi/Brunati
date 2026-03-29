import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* Child Pages */
import Summary from './pages/Summary';
import AdminInventory from './pages/AdminInventory';
import EditProduct from './pages/EditProduct';
import AdminOrders from './pages/AdminOrders';
import Customers from './pages/Customers';
import EditSite from './pages/EditSite';

const AdminLayout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();

    // Security check - redirect to login if not admin
    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/admin/login', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sync sidebar closure on mobile route changes
    useEffect(() => {
        if (isMobile) setIsSidebarOpen(false);
    }, [location.pathname, isMobile]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: '"Roboto", sans-serif', overflowX: 'hidden', maxWidth: '100vw' }}>
            <Sidebar 
                isOpen={isMobile ? isSidebarOpen : true} 
                isExpanded={isSidebarExpanded}
                onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
                onClose={() => isMobile && setIsSidebarOpen(false)} 
                isMobile={isMobile}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minWidth: 0 }}>
                {/* Mobile Header Bar - Only visible on small screens */}
                {isMobile && (
                    <header style={{
                        height: '64px',
                        background: '#ffffff',
                        borderBottom: '1px solid #EEEEEE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', // Center title
                        padding: '0 20px',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 40
                    }}>
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 5, position: 'absolute', left: '16px' }}
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <span style={{ 
                            fontFamily: '"Roboto", sans-serif', 
                            fontSize: '1.25rem',
                            fontWeight: 700, 
                            color: '#000000',
                            letterSpacing: '-0.02em'
                        }}>
                            Admin Access
                        </span>
                    </header>
                )}

                <main style={{
                    marginLeft: isMobile ? 0 : (isSidebarExpanded ? '256px' : '80px'),
                    padding: isMobile ? '80px 16px 40px' : '40px 32px', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: '100vh',
                    background: '#fcfcfc'
                }}>
                    <div style={{ 
                        maxWidth: '1280px', 
                        margin: '0 auto',
                        position: 'relative'
                    }}>
                        <Routes>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<Summary />} />
                            <Route path="inventory" element={<AdminInventory />} />
                            <Route path="inventory/edit/:id" element={<EditProduct />} />
                            <Route path="orders"    element={<AdminOrders />} />
                            <Route path="customers" element={<Customers />} />
                            <Route path="editsite"  element={<EditSite />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 45,
                        transition: 'opacity 0.3s'
                    }}
                />
            )}
        </div>
    );
};

export default AdminLayout;
