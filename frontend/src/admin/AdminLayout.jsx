import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X, LayoutDashboard, ShoppingCart, Package, Users, Store } from 'lucide-react';
import useAdminAuth from './hooks/useAdminAuth';
import { NavLink } from 'react-router-dom';

/* Child Pages */
import Summary from './pages/Summary';
import AdminInventory from './pages/AdminInventory';
import EditProduct from './pages/EditProduct';
import AdminOrders from './pages/AdminOrders';
import Customers from './pages/Customers';
import Storefront from './pages/Storefront';
import ErrorBoundary from './components/ErrorBoundary';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();
    const { isAdmin } = useAdminAuth();

    if (!isAdmin) return <Navigate to="/management-portal/login" replace />;

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
        <div style={{ display: 'flex', minHeight: '100svh', background: '#f9fafb', width: '100%' }}>
            <Sidebar 
                isOpen={isSidebarOpen} 
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                onClose={() => isMobile && setIsSidebarOpen(false)} 
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', width: '100%', minHeight: '100svh' }}>
                {/* Header Bar - Visible on all screens */}
                <header style={{
                    height: '60px',
                    background: '#ffffff',
                    borderBottom: '1px solid #EEEEEE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 24px',
                    position: 'fixed',
                    top: 0,
                    left: isMobile ? 0 : (isSidebarOpen ? (isCollapsed ? '80px' : '240px') : 0),
                    right: 0,
                    zIndex: 40,
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <span style={{ 
                        fontFamily: '"Roboto", sans-serif', 
                        fontSize: isMobile ? '1.15rem' : '1.35rem',
                        fontWeight: 700, 
                        color: '#000000',
                        textTransform: 'none',
                        letterSpacing: 'normal'
                    }}>
                         Admin Panel
                    </span>
                </header>

                <main style={{
                    marginLeft: isMobile ? 0 : (isSidebarOpen ? (isCollapsed ? '80px' : '240px') : 0), 
                    padding: isMobile ? '76px 16px 80px' : '92px 32px 32px', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: '100svh',
                    background: '#f9fafb',
                    display: 'block',
                    width: 'auto',
                    flex: 1
                }}>
                    <div style={{ 
                        maxWidth: '1200px', 
                        margin: '0 auto',
                        position: 'relative',
                        width: '100%',
                        minHeight: '100%'
                    }}>
                        <div 
                            key={location.pathname} 
                            style={{ 
                                animation: 'adminFadeIn 0.35s ease-out forwards'
                            }}
                        >
                            <Routes>
                                <Route index element={<Navigate to="dashboard" replace />} />
                                <Route path="dashboard" element={<Summary />} />
                                <Route path="inventory" element={<AdminInventory />} />
                                <Route path="inventory/edit/:id" element={<EditProduct />} />
                                <Route path="orders"    element={<AdminOrders />} />
                                <Route path="customers" element={<Customers />} />
                                <Route path="storefront" element={
                                    <ErrorBoundary>
                                        <Storefront />
                                    </ErrorBoundary>
                                } />
                            </Routes>
                        </div>
                    </div>
                </main>

                <style>{`
                    @keyframes adminFadeIn {
                        from { opacity: 0; transform: translateY(4px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

                {/* Mobile Bottom Navigation */}
                {isMobile && (
                    <nav style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '64px',
                        background: '#ffffff',
                        borderTop: '1px solid #EEEEEE',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        zIndex: 40,
                        padding: '0 8px'
                    }}>
                        {[
                            { path: '/management-portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { path: '/management-portal/orders', icon: ShoppingCart, label: 'Sales' },
                            { path: '/management-portal/inventory', icon: Package, label: 'Items' },
                            { path: '/management-portal/customers', icon: Users, label: 'People' },
                            { path: '/management-portal/storefront', icon: Store, label: 'Site' }
                        ].map(item => (
                            <NavLink 
                                key={item.path}
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    textDecoration: 'none',
                                    color: isActive ? '#000000' : '#9CA3AF',
                                    transition: 'color 0.2s'
                                })}
                            >
                                <item.icon size={20} />
                                <span style={{ fontSize: '0.65rem', fontWeight: 600, fontFamily: '"Roboto", sans-serif' }}>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                )}
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
