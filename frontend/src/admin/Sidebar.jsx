import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import useAdminAuth from './hooks/useAdminAuth';

const Sidebar = ({ isOpen, onClose, isCollapsed, setIsCollapsed }) => {
    const FONT_ROBOTO = '"Roboto", sans-serif';

    const location = useLocation();
    const navigate = useNavigate();
    const { adminLogout } = useAdminAuth();
    const [toast, setToast] = useState('');
    const [hoveredPath, setHoveredPath] = useState(null);

    const menuItems = [
        { name: 'Dashboard', path: '/management-portal/dashboard', icon: LayoutDashboard, pathsPrefix: '/management-portal/dashboard' },
        { name: 'Sales', path: '/management-portal/orders', icon: ShoppingCart, pathsPrefix: '/management-portal/orders' },
        { name: 'My Items', path: '/management-portal/inventory', icon: Package, pathsPrefix: '/management-portal/inventory' },
        { name: 'Customers', path: '/management-portal/customers', icon: Users, pathsPrefix: '/management-portal/customers' },
        { name: 'Edit Site', path: '/management-portal/storefront', icon: Store, pathsPrefix: '/management-portal/storefront' },
    ];

    const handleLogout = () => {
        if (adminLogout) adminLogout();
        else {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('user_auth');
        }
        
        setToast('Logged out successfully');
        setTimeout(() => navigate('/'), 1200);
    };

    return (
        <aside style={{
            width: isCollapsed ? '80px' : '240px',
            background: '#ffffff',
            borderRight: '1px solid #EEEEEE',
            height: '100vh',
            position: 'fixed',
            left: isOpen ? 0 : (isCollapsed ? '-80px' : '-240px'),
            top: 0,
            zIndex: 50,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 0',
            boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.05)' : 'none',
            overflow: 'hidden'
        }}>
            
            {/* Log out Toast Wrapper Context */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: '#111827', color: '#fff',
                    padding: '12px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, fontFamily: FONT_ROBOTO,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 1000, animation: 'fadeInDown 0.3s ease-out'
                }}>
                    {toast}
                </div>
            )}
            {/* "Admin panel" Heading: Sans-serif + Sentence case */}
            <div style={{ padding: '0 20px 48px', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', position: 'relative' }}>
                {!isCollapsed && (
                    <h1 style={{
                        fontFamily: FONT_ROBOTO,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        margin: 0,
                        textTransform: 'none',
                        letterSpacing: 'normal',
                        color: '#000000',
                        whiteSpace: 'nowrap'
                    }}>
                        Admin Panel
                    </h1>
                )}
                
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        background: '#ffffff',
                        border: '1px solid #EEEEEE',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#666',
                        position: isCollapsed ? 'static' : 'absolute',
                        right: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        zIndex: 60
                    }}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            <nav style={{ flex: 1 }}>
                {menuItems.map(item => {
                    const isActive = location.pathname.startsWith(item.pathsPrefix);
                    const isHovered = hoveredPath === item.path;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            onMouseEnter={() => setHoveredPath(item.path)}
                            onMouseLeave={() => setHoveredPath(null)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                padding: isCollapsed ? '14px 0' : '14px 24px',
                                color: isActive ? '#000000' : '#666666',
                                backgroundColor: isHovered && !isActive ? '#f9fafb' : 'transparent',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontFamily: FONT_ROBOTO,
                                fontWeight: isActive ? 500 : 400,
                                borderLeft: !isCollapsed && isActive ? '2px solid #000000' : '2px solid transparent',
                                transition: 'all 0.15s ease-in-out',
                                gap: isCollapsed ? '0' : '14px'
                            }}
                        >
                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            {!isCollapsed && <span style={{ marginTop: '2px', whiteSpace: 'nowrap' }}>{item.name}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout Action */}
            <div style={{ padding: isCollapsed ? '0' : '0 24px' }}>
                <button 
                    onClick={handleLogout}
                    onMouseEnter={() => setHoveredPath('logout')}
                    onMouseLeave={() => setHoveredPath(null)}
                    style={{
                        display: 'flex', width: '100%', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: isCollapsed ? '0' : '14px', padding: '14px',
                        color: '#666666', backgroundColor: hoveredPath === 'logout' ? '#fef2f2' : 'transparent',
                        border: 'none', borderRadius: '6px', fontSize: '14px', fontFamily: FONT_ROBOTO, 
                        fontWeight: 400, cursor: 'pointer', transition: 'all 0.15s ease-in-out', textAlign: 'left'
                    }}
                >
                    <LogOut size={18} strokeWidth={2} style={{ color: hoveredPath === 'logout' ? '#ef4444' : '#666666', transition: 'color 0.15s' }} />
                    {!isCollapsed && <span style={{ marginTop: '2px', color: hoveredPath === 'logout' ? '#ef4444' : '#666666', transition: 'color 0.15s' }}>Exit</span>}
                </button>
            </div>

            <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
        </aside>
    );
};

export default Sidebar;
