import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useStorefront } from '../../context/StorefrontContext';

const FONT = '"Roboto", sans-serif';

// Mock get product
const getMockProduct = (id) => ({
    id: id || '#1023',
    name: 'Brunati Classic Perfume',
    description: 'A timeless fragrance featuring notes of bergamot, amber, and vanilla.',
    price: 3500,
    compareAtPrice: 4200,
    stock: 12,
    status: 'Active',
    category: 'Men',
    image: 'https://via.placeholder.com/80'
});

const EditProduct = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { categories } = useStorefront();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [isMobile] = useState(window.innerWidth <= 768);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (location.state && location.state.product) {
            const p = location.state.product;
            setProduct({
                id: p.id || id,
                name: p.name || '',
                description: p.description || '',
                price: p.price || 0,
                compareAtPrice: p.compareAtPrice || '',
                stock: p.stock !== undefined ? p.stock : 0,
                status: p.status || 'Active',
                category: p.category || '',
                image: p.image || 'https://via.placeholder.com/80'
            });
            setLoading(false);
        } else {
            setTimeout(() => {
                setProduct(getMockProduct(id));
                setLoading(false);
            }, 400);
        }
    }, [id, location.state]);

    const handleStockChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setProduct(prev => ({ ...prev, stock: val }));
    };

    const handleSave = (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setToast('Product updated successfully');
            setTimeout(() => setToast(''), 3000);
        }, 600);
    };

    const handleDiscard = () => {
        if (window.confirm("Are you sure you want to discard your changes?")) {
            if (location.state && location.state.product) {
                const p = location.state.product;
                setProduct({ ...p, description: p.description || '', compareAtPrice: p.compareAtPrice || '', category: p.category || '' });
            } else {
                setProduct(getMockProduct(id));
            }
        }
    };

    const isSaveDisabled = saving || !product?.price || product.price === '';

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setProduct(prev => ({ ...prev, image: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading || !product) {
        return <div style={{ fontFamily: FONT, padding: 40, color: '#6e6e73' }}>Loading product details...</div>;
    }

    return (
        <div style={{ fontFamily: FONT, animation: 'fadeIn 0.3s ease-in-out', maxWidth: 800, margin: '0 auto', position: 'relative' }}>
            
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 32, right: 32, background: '#111827', color: '#fff',
                    padding: '12px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                    zIndex: 100, animation: 'fadeInUp 0.3s ease-out'
                }}>
                    {toast}
                </div>
            )}

            {/* Top Navigation */}
            <div style={{ marginBottom: 20 }}>
                <Link to="/admin/inventory" style={{ 
                    color: '#6e6e73', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500,
                    display: 'inline-flex', alignItems: 'center', transition: 'color 0.2s'
                }} onMouseEnter={e => e.currentTarget.style.color = '#111'} onMouseLeave={e => e.currentTarget.style.color = '#6e6e73'}>
                    ← Back to inventory
                </Link>
            </div>

            {/* Header */}
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.08)'
            }}>
                <h1 style={{ fontFamily: 'Roboto', fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: 700, color: '#1d1d1f', margin: 0, textTransform: 'none', letterSpacing: 'normal' }}>
                    Edit Product
                </h1>
                
                <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                        onClick={handleDiscard}
                        style={{
                            background: '#fff', color: '#dc2626', border: '1px solid #dc2626',
                            padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500,
                            cursor: 'pointer', transition: 'all 0.15s', fontFamily: FONT
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        style={{
                            background: isSaveDisabled ? '#e5e7eb' : '#111', color: isSaveDisabled ? '#9ca3af' : '#fff', border: 'none',
                            padding: '8px 20px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700,
                            cursor: isSaveDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s', fontFamily: 'Roboto'
                        }}
                        onMouseEnter={e => { if(!isSaveDisabled) e.currentTarget.style.background = '#333'; }}
                        onMouseLeave={e => { if(!isSaveDisabled) e.currentTarget.style.background = '#111'; }}
                    >
                        <span style={{ textTransform: 'none' }}>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
                
                {/* Basic Info */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 16px', fontFamily: 'Roboto', textTransform: 'none' }}>Basic Info</h2>
                    
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8, fontFamily: 'Roboto' }}>Product name</label>
                        <input 
                            type="text" 
                            value={product.name}
                            onChange={e => setProduct({...product, name: e.target.value})}
                            required
                            style={{ 
                                width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', 
                                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Roboto' 
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                            onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8, fontFamily: 'Roboto' }}>Description</label>
                        <textarea 
                            value={product.description}
                            onChange={e => setProduct({...product, description: e.target.value})}
                            rows={4}
                            style={{ 
                                width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', 
                                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Roboto', resize: 'vertical' 
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                            onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'}
                        />
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 16px', fontFamily: 'Roboto', textTransform: 'none' }}>Pricing & Stock</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8, fontFamily: 'Roboto' }}>Price (₹)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={product.price}
                                onChange={e => setProduct({...product, price: parseFloat(e.target.value)})}
                                required
                                style={{ 
                                    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Roboto' 
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8, fontFamily: 'Roboto' }}>Compare-at price</label>
                            <input 
                                type="number" 
                                min="0"
                                value={product.compareAtPrice}
                                onChange={e => setProduct({...product, compareAtPrice: parseFloat(e.target.value)})}
                                style={{ 
                                    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Roboto' 
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8, fontFamily: 'Roboto' }}>Stock quantity</label>
                        <input 
                            type="number" 
                            min="0"
                            value={product.stock}
                            onChange={handleStockChange}
                            required
                            style={{ 
                                width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Roboto' 
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                            onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                        />
                        {product.stock === 0 && (
                            <p style={{ fontSize: '0.75rem', color: '#d97706', marginTop: 8, margin: '8px 0 0', fontWeight: 500 }}>
                                Stock is 0. Product status set to "Draft".
                            </p>
                        )}
                    </div>
                </div>

                {/* Media */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 16px', fontFamily: 'Roboto', textTransform: 'none' }}>Media</h2>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ width: 80, height: 80, border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={product.image} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    background: '#fff', color: '#111827', border: '1px solid #d1d5db',
                                    padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500,
                                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Roboto'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                            >
                                Change image
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                accept="image/png, image/jpeg" 
                                onChange={handleImageChange}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '8px 0 0' }}>Supports JPG, PNG (Max 5MB)</p>
                        </div>
                    </div>
                </div>

                {/* Organization */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 16px', fontFamily: 'Roboto', textTransform: 'none' }}>Organization</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 400, color: '#6b7280', marginBottom: 8, fontFamily: 'Roboto' }}>Product Category</label>
                            <select 
                                value={product.category || ''}
                                onChange={e => setProduct({...product, category: e.target.value})}
                                style={{ 
                                    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Roboto', background: '#fff', cursor: 'pointer' 
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                            >
                                <option value="" disabled>Select Category</option>
                                {(categories || []).map((cat, idx) => (
                                    <option key={idx} value={typeof cat === 'string' ? cat : cat.name}>
                                        {typeof cat === 'string' ? cat : cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 400, color: '#6b7280', marginBottom: 8, fontFamily: 'Roboto' }}>Status</label>
                            <select 
                                value={product.status}
                                onChange={e => setProduct({...product, status: e.target.value})}
                                style={{ 
                                    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Roboto', background: '#fff', cursor: 'pointer' 
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                            >
                                <option value="Active">Active</option>
                                <option value="Draft">Draft</option>
                                <option value="Archived">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default EditProduct;
