import React, { useState, useEffect } from 'react';

const FONT = '"Roboto", sans-serif';

const ALL_ORDERS = [
    { id: '#1004', customer: 'Arjun Mehta',    total: 1795, date: '25 Mar, 2026', paymentStatus: 'Paid', fulfillmentStatus: 'Fulfilled' },
    { id: '#1003', customer: 'Priya Sharma',   total: 3590, date: '25 Mar, 2026', paymentStatus: 'Paid', fulfillmentStatus: 'Unfulfilled' },
    { id: '#1002', customer: 'Rahul Desai',    total: 1795, date: '24 Mar, 2026', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
    { id: '#1001', customer: 'Sneha Kulkarni', total: 7200, date: '24 Mar, 2026', paymentStatus: 'Paid', fulfillmentStatus: 'Fulfilled' },
    { id: '#1000', customer: 'Rohan Gupta',    total: 1795, date: '23 Mar, 2026', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
];

const TABS = [
    { id: 'all', label: 'All' },
    { id: 'unfulfilled', label: 'Unfulfilled' },
    { id: 'unpaid', label: 'Unpaid' },
];

const AdminOrders = () => {
    const [orders, setOrders] = useState(ALL_ORDERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'mobile' : 'desktop');

    useEffect(() => {
        const handleResize = () => setViewMode(window.innerWidth <= 768 ? 'mobile' : 'desktop');
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             o.customer.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesTab = true;
        if (activeTab === 'unfulfilled') {
            matchesTab = o.fulfillmentStatus === 'Unfulfilled';
        } else if (activeTab === 'unpaid') {
            matchesTab = o.paymentStatus === 'Pending';
        }

        return matchesSearch && matchesTab;
    });

    const getPaymentBadgeStyle = (status) => {
        if (status === 'Paid') return { background: '#dcfce7', color: '#166534' }; // Light green bg, dark green text
        return { background: '#f3f4f6', color: '#374151' }; // Pending: Light grey bg, dark grey text
    };

    const getFulfillmentBadgeStyle = (status) => {
        if (status === 'Fulfilled') return { background: '#dcfce7', color: '#166534' }; // Light green bg, dark green text
        return { background: '#fef3c7', color: '#92400e' }; // Unfulfilled: Light yellow bg, dark yellow/brown text
    };

    return (
        <div style={{ fontFamily: FONT, width: '100%', animation: 'fadeIn 0.3s ease-in-out', padding: viewMode === 'mobile' ? '0 16px' : '0' }}>
            {/* Header Layout */}
            <div style={{ 
                display: 'flex', 
                flexDirection: viewMode === 'mobile' ? 'column' : 'row', 
                justifyContent: 'space-between', 
                alignItems: viewMode === 'mobile' ? 'flex-start' : 'center',
                gap: 20,
                marginBottom: 24 
            }}>
                <h1 style={{ 
                    fontFamily: FONT, 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: '#000', 
                    margin: 0, 
                    letterSpacing: '-0.01em', 
                    textTransform: 'none' 
                }}>Orders</h1>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', width: viewMode === 'mobile' ? '100%' : '280px' }}>
                    <input 
                        type="text" 
                        placeholder="Search orders..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 12px 12px 36px', border: '1px solid #D1D5DB', // High contrast
                            borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: '#fff',
                            boxSizing: 'border-box', transition: 'all 0.2s', fontFamily: FONT
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = '#000'}
                        onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                    />
                    <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
                {TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '12px 0',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: isActive ? '#000' : '#6b7280',
                                fontWeight: isActive ? 700 : 400,
                                borderBottom: isActive ? '2px solid #000' : '2px solid transparent',
                                marginBottom: '-1px',
                                fontFamily: FONT,
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Orders Layout: Table for Desktop, 1-Column Grid for Mobile */}
            {viewMode === 'desktop' ? (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                                <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Order</th>
                                <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Date</th>
                                <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Customer</th>
                                <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Payment</th>
                                <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Fulfillment</th>
                                <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? filteredOrders.map((o, idx) => (
                                <tr key={o.id} style={{ borderBottom: idx === filteredOrders.length - 1 ? 'none' : '1px solid #e5e7eb', cursor: 'pointer' }}>
                                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 700, color: '#000' }}>{o.id}</td>
                                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: '#666' }}>{o.date}</td>
                                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: '#000' }}>{o.customer}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{ 
                                            ...getPaymentBadgeStyle(o.paymentStatus),
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600
                                        }}>
                                            {o.paymentStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{ 
                                            ...getFulfillmentBadgeStyle(o.fulfillmentStatus),
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600
                                        }}>
                                            {o.fulfillmentStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: '#000', fontWeight: 700, textAlign: 'right' }}>₹{o.total.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                    {filteredOrders.length > 0 ? filteredOrders.map((o) => (
                        <div key={o.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000', marginBottom: 2 }}>Order {o.id}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{o.date}</div>
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#000' }}>₹{o.total.toLocaleString()}</div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#111', marginBottom: 16 }}>{o.customer}</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <span style={{ ...getPaymentBadgeStyle(o.paymentStatus), padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>{o.paymentStatus}</span>
                                <span style={{ ...getFulfillmentBadgeStyle(o.fulfillmentStatus), padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>{o.fulfillmentStatus}</span>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', border: '1px dashed #e5e7eb', borderRadius: 12 }}>No orders found.</div>
                    )}
                </div>
            )}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AdminOrders;
