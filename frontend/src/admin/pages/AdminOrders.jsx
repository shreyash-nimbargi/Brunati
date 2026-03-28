import React, { useState, useEffect } from 'react';
import { useStorefront } from '../../context/StorefrontContext';

const FONT = '"Roboto", sans-serif';

const TABS = [
    { id: 'all', label: 'All' },
    { id: 'unfulfilled', label: 'Unfulfilled' },
    { id: 'unpaid', label: 'Unpaid' },
];

const AdminOrders = () => {
    const { orders, setOrders } = useStorefront();
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

    const renderPaymentBadge = (status) => {
        if (status === 'Paid') return <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#166534', background: '#dcfce7', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600}}><span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e'}}></span>Paid</span>;
        return <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#374151', background: '#f3f4f6', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600}}><span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af'}}></span>Unpaid</span>;
    };

    const renderFulfillmentBadge = (status) => {
        if (status === 'Fulfilled') return <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#166534', background: '#dcfce7', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600}}><span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e'}}></span>Sent</span>;
        return <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#92400e', background: '#fef3c7', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600}}><span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24'}}></span>Packing</span>;
    };

    return (
        <div style={{ fontFamily: FONT, width: '100%', animation: 'fadeIn 0.3s ease-in-out', paddingBottom: '80px' }}>
            {/* Header Layout */}
            <div style={{ 
                display: 'flex', 
                flexDirection: viewMode === 'mobile' ? 'column' : 'row', 
                justifyContent: 'space-between', 
                alignItems: viewMode === 'mobile' ? 'flex-start' : 'center',
                gap: 16,
                marginBottom: 16 
            }}>
                <h1 style={{ fontFamily: FONT, fontSize: '1.4rem', fontWeight: 700, color: '#1d1d1f', margin: 0, letterSpacing: 'normal', textTransform: 'none' }}>Sales</h1>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', width: viewMode === 'mobile' ? '100%' : '280px' }}>
                    <input 
                        type="text" 
                        placeholder="Filter orders..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #d1d5db',
                            borderRadius: '6px', fontSize: '0.85rem', outline: 'none', background: '#fff',
                            boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: FONT
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                        onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                    <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
                                padding: '8px 0',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: isActive ? '#111827' : '#6b7280',
                                fontWeight: isActive ? 500 : 400,
                                borderBottom: isActive ? '2px solid #111827' : '2px solid transparent',
                                marginBottom: '-1px',
                                fontFamily: FONT
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Orders Table */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflowX: 'auto', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: viewMode === 'mobile' ? '100%' : '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                            <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Order</th>
                            {viewMode === 'desktop' && (
                                <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Date</th>
                            )}
                            <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Customer</th>
                            {viewMode === 'desktop' && (
                                <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Payment Status</th>
                            )}
                            {viewMode === 'desktop' && (
                                <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Fulfillment Status</th>
                            )}
                            <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? filteredOrders.map((o, idx) => (
                            <tr key={o.id} style={{ borderBottom: idx === filteredOrders.length - 1 ? 'none' : '1px solid #e5e7eb', cursor: 'pointer', transition: 'background-color 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '10px 16px', fontSize: '0.85rem', fontWeight: 500, color: '#111827' }}>{o.id}</td>
                                {viewMode === 'desktop' && (
                                    <td style={{ padding: '10px 16px', fontSize: '0.85rem', color: '#6b7280' }}>{o.date}</td>
                                )}
                                <td style={{ padding: '10px 16px', fontSize: '0.85rem', color: '#111827' }}>{o.customer}</td>
                                {viewMode === 'desktop' && (
                                    <td style={{ padding: '10px 16px' }}>
                                        <div 
                                            onClick={() => {
                                                const newStatus = o.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
                                                setOrders(orders.map(order => order.id === o.id ? { ...order, paymentStatus: newStatus, stockDecremented: false } : order));
                                            }}
                                            style={{ cursor: 'pointer', display: 'inline-block' }}
                                        >
                                            {renderPaymentBadge(o.paymentStatus)}
                                        </div>
                                    </td>
                                )}
                                {viewMode === 'desktop' && (
                                    <td style={{ padding: '10px 16px' }}>
                                        <div 
                                            onClick={() => {
                                                const newStatus = o.fulfillmentStatus === 'Fulfilled' ? 'Unfulfilled' : 'Fulfilled';
                                                setOrders(orders.map(order => order.id === o.id ? { ...order, fulfillmentStatus: newStatus, stockDecremented: false } : order));
                                            }}
                                            style={{ cursor: 'pointer', display: 'inline-block' }}
                                        >
                                            {renderFulfillmentBadge(o.fulfillmentStatus)}
                                        </div>
                                    </td>
                                )}
                                <td style={{ padding: '10px 16px', fontSize: '0.85rem', color: '#4b5563', textAlign: 'right' }}>₹{o.total.toLocaleString()}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={viewMode === 'desktop' ? 6 : 3} style={{ padding: '32px 16px', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
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
