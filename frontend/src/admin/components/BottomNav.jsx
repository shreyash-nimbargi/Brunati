import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();
    const FONT_ROBOTO = '"Roboto", sans-serif';

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Orders',    path: '/admin/orders',    icon: ShoppingCart },
        { name: 'Inventory', path: '/admin/inventory', icon: Package },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Edit Site', path: '/admin/editsite',  icon: Settings }
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '64px',
            background: '#ffffff',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 50,
            paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
            {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: isActive ? '#000000' : '#9ca3af',
                            gap: '4px',
                            minWidth: '60px'
                        }}
                    >
                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{ 
                            fontSize: '10px', 
                            fontFamily: FONT_ROBOTO,
                            fontWeight: isActive ? 700 : 400,
                            letterSpacing: '0.02em'
                        }}>
                            {item.name}
                        </span>
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNav;
