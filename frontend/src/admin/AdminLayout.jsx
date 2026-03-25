import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

/* Child Pages */
import Summary from './pages/Summary';
import AdminInventory from './pages/AdminInventory';
import EditProduct from './pages/EditProduct';
import AdminOrders from './pages/AdminOrders';
import Customers from './pages/Customers';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(true);
            else setIsSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sync sidebar closure on mobile route changes
    useEffect(() => {
        if (isMobile) setIsSidebarOpen(false);
    }, [location.pathname, isMobile]);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#FFFFFF' }}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => isMobile && setIsSidebarOpen(false)} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Mobile Header Bar - Only visible on small screens */}
                {isMobile && (
                    <header style={{
                        height: '60px',
                        background: '#ffffff',
                        borderBottom: '1px solid #EEEEEE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 20px',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 40
                    }}>
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 5, display: 'flex' }}
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <span style={{ 
                            fontFamily: '"Roboto", sans-serif', 
                            fontSize: '1.4rem',
                            fontWeight: 700, 
                            margin: 0,
                            textTransform: 'none',
                            letterSpacing: 'normal',
                            color: '#000000'
                        }}>
                            Admin panel
                        </span>
                        <div style={{ width: 24 }}></div>
                    </header>
                )}

                <main style={{
                    marginLeft: isMobile ? 0 : '240px', // Proper offset for Sidebar
                    padding: isMobile ? '70px 16px 40px' : '32px 24px', // Optimized px-6
                    transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: '100vh',
                    background: '#FFFFFF'
                }}>
                    <div style={{ 
                        maxWidth: '1200px', 
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
