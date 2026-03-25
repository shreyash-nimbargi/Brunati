import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FONT = '"Roboto", sans-serif';

const ALL_PRODUCTS = [
    { id: 'BRN-101', name: 'Dominus Emperor',    price: 1795, stock: 24, image: '/media/dominus/1.png', status: 'Active' },
    { id: 'BRN-102', name: 'Brunati Aqua',       price: 1795, stock: 3,  image: '/media/aqua/1.png',    status: 'Active' },
    { id: 'BRN-103', name: 'Mestia',             price: 1795, stock: 32, image: '/media/mistia/1.png',  status: 'Draft' },
    { id: 'BRN-104', name: 'Citrine Dusk',       price: 1795, stock: 0,  image: '/media/dusk/1.png',    status: 'Archived' },
    { id: 'BRN-105', name: 'Midnight Glammer',   price: 1795, stock: 9,  image: '/media/midnight/1.png',status: 'Active' },
];

const AdminInventory = () => {
    const [products, setProducts] = useState(ALL_PRODUCTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'mobile' : 'desktop');

    useEffect(() => {
        const handleResize = () => setViewMode(window.innerWidth <= 768 ? 'mobile' : 'desktop');
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredProducts = products.filter(p => {
        return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               p.id.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getStatusBadgeStyle = (status) => {
        switch(status) {
            case 'Active': return { background: '#dcfce7', color: '#166534' };
            case 'Archived': return { background: '#fef3c7', color: '#92400e' };
            case 'Draft':
            default: return { background: '#f3f4f6', color: '#374151' };
        }
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
                <h1 style={{ fontFamily: FONT, fontSize: '1.4rem', fontWeight: 700, color: '#1d1d1f', margin: 0, letterSpacing: 'normal', textTransform: 'none' }}>Inventory</h1>
                
                <div style={{ display: 'flex', gap: 12, width: viewMode === 'mobile' ? '100%' : 'auto' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: viewMode === 'mobile' ? 'auto' : '280px' }}>
                        <input 
                            type="text" 
                            placeholder="Filter products..." 
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
                    
                    <button style={{
                        padding: '10px 16px', background: '#111827', color: '#fff', border: 'none',
                        borderRadius: '6px', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer',
                        whiteSpace: 'nowrap', transition: 'background-color 0.2s', fontFamily: FONT, height: '100%'
                    }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#000'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}>
                        Add product
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflowX: 'auto', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: viewMode === 'mobile' ? '100%' : '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                            <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', width: 60 }}>Image</th>
                            <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Product Name</th>
                            {viewMode === 'desktop' && (
                                <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Status</th>
                            )}
                            {viewMode === 'desktop' && (
                                <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Inventory</th>
                            )}
                            <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Price</th>
                            <th style={{ fontFamily: FONT, padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? filteredProducts.map((p, idx) => (
                            <tr key={p.id} style={{ borderBottom: idx === filteredProducts.length - 1 ? 'none' : '1px solid #e5e7eb', transition: 'background-color 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '8px 16px' }}>
                                    <div style={{ width: 40, height: 40, border: '1px solid #e5e7eb', borderRadius: 4, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                </td>
                                <td style={{ padding: '8px 16px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{p.name}</div>
                                </td>
                                {viewMode === 'desktop' && (
                                    <td style={{ padding: '8px 16px' }}>
                                        <span style={{ 
                                            ...getStatusBadgeStyle(p.status),
                                            padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {p.status}
                                        </span>
                                    </td>
                                )}
                                {viewMode === 'desktop' && (
                                    <td style={{ padding: '8px 16px', fontSize: '0.85rem', color: p.stock < 5 ? '#ef4444' : '#4b5563', fontWeight: p.stock < 5 ? 600 : 400 }}>
                                        {p.stock} in stock
                                    </td>
                                )}
                                <td style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#4b5563' }}>₹{p.price.toLocaleString()}</td>
                                <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                                    <Link to={`/admin/inventory/edit/${p.id}`} state={{ product: p }} style={{
                                        display: 'inline-block', textDecoration: 'none', color: '#2563eb', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', padding: '10px'
                                    }}>
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={viewMode === 'desktop' ? 6 : 4} style={{ padding: '32px 16px', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
                                    No products found.
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

export default AdminInventory;
