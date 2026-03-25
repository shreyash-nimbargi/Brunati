import React, { useState, useEffect } from 'react';

const FONT = '"Roboto", sans-serif';

const ALL_CUSTOMERS = [
    { id: 'usr_001', name: 'Sneha Kulkarni', email: 'sneha.k@example.com', location: 'Pune, MH', ordersCount: 4, totalSpent: 18500 },
    { id: 'usr_002', name: 'Arjun Mehta',    email: 'arjun.mehta9@example.com', location: 'Mumbai, MH', ordersCount: 2, totalSpent: 4500 },
    { id: 'usr_003', name: 'Priya Sharma',   email: 'priyasharma_12@example.com', location: 'Delhi, DL', ordersCount: 1, totalSpent: 1795 },
    { id: 'usr_004', name: 'Rahul Desai',    email: 'rahul.desai@example.com', location: 'Bengaluru, KA', ordersCount: 3, totalSpent: 8900 },
    { id: 'usr_005', name: 'Neha Gupta',     email: 'nehagupta_88@example.com', location: 'Hyderabad, TS', ordersCount: 1, totalSpent: 3590 },
    { id: 'usr_006', name: 'Vikram Singh',   email: 'vikram.singh@example.com', location: 'Jaipur, RJ', ordersCount: 5, totalSpent: 21000 },
];

const Customers = () => {
    const [customers, setCustomers] = useState(ALL_CUSTOMERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'mobile' : 'desktop');

    useEffect(() => {
        const handleResize = () => setViewMode(window.innerWidth <= 768 ? 'mobile' : 'desktop');
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredCustomers = customers.filter(c => {
        return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               c.email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleExport = (e) => {
        e.preventDefault();
        alert('Exporting customers CSV...');
    };

    return (
        <div style={{ fontFamily: FONT, width: '100%', animation: 'fadeIn 0.3s ease-in-out' }}>
            {/* Header Area */}
            <div style={{ 
                display: 'flex', 
                flexDirection: viewMode === 'mobile' ? 'column' : 'row', 
                justifyContent: 'space-between', 
                alignItems: viewMode === 'mobile' ? 'flex-start' : 'center',
                gap: 16,
                marginBottom: 24,
                paddingBottom: 24,
                borderBottom: '1px solid rgba(0,0,0,0.08)'
            }}>
                <h1 style={{ fontFamily: FONT, fontSize: '1.4rem', fontWeight: 700, color: '#1d1d1f', margin: 0, letterSpacing: 'normal', textTransform: 'none' }}>Customers</h1>
                
                <div style={{ display: 'flex', gap: 16, width: viewMode === 'mobile' ? '100%' : 'auto', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: viewMode === 'mobile' ? 'auto' : '280px' }}>
                        <input 
                            type="text" 
                            placeholder="Find customers..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px 10px 32px', border: '1px solid #d1d5db',
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

                    <a href="#" onClick={handleExport} style={{
                        fontSize: '0.85rem', fontWeight: 500, color: '#2563eb', textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: FONT
                    }}>
                        Export CSV
                    </a>
                </div>
            </div>

            {/* Customers Table */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflowX: 'auto', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: viewMode === 'mobile' ? '100%' : '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                            <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Customer Name</th>
                            {viewMode === 'desktop' && (
                                <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Email</th>
                            )}
                            {viewMode === 'desktop' && (
                                <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Location</th>
                            )}
                            {viewMode === 'desktop' && (
                                <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Orders Count</th>
                            )}
                            <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', textAlign: 'right' }}>Total Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length > 0 ? filteredCustomers.map((c, idx) => (
                            <tr key={c.id} style={{ borderBottom: idx === filteredCustomers.length - 1 ? 'none' : '1px solid #e5e7eb', transition: 'background-color 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', fontFamily: FONT }}>{c.name}</div>
                                </td>
                                {viewMode === 'desktop' && (
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#6b7280', fontFamily: FONT }}>{c.email}</div>
                                    </td>
                                )}
                                {viewMode === 'desktop' && (
                                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#374151', fontFamily: FONT }}>
                                        {c.location}
                                    </td>
                                )}
                                {viewMode === 'desktop' && (
                                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#374151', fontFamily: FONT }}>
                                        {c.ordersCount} {c.ordersCount === 1 ? 'order' : 'orders'}
                                    </td>
                                )}
                                <td style={{ padding: '12px 16px', fontSize: '0.85rem', fontWeight: 700, color: '#111827', textAlign: 'right', fontFamily: FONT }}>₹{c.totalSpent.toLocaleString()}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={viewMode === 'desktop' ? 5 : 2} style={{ padding: '32px 16px', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', fontFamily: FONT }}>
                                    No customers yet.
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

export default Customers;
