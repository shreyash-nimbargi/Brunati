import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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
    image: 'https://via.placeholder.com/80'
});

const EditProduct = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [originalProduct, setOriginalProduct] = useState(null);
    const fileInputRef = React.useRef(null);

    // --- UNDO TOAST LOGIC ---
    const triggerUndoToast = (message, stateSetter, previousState) => {
        toast((t) => (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontFamily: FONT, fontSize: '13px', color: '#fff' }}>{message}</span>
                    <button 
                        onClick={() => {
                            stateSetter(previousState);
                            toast.dismiss(t.id);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', padding: '0 0 0 16px', textDecoration: 'underline', fontSize: '13px' }}
                    >
                        UNDO
                    </button>
                </div>
                <div style={{ width: '100%', height: '2px', background: '#333', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                    <div style={{ height: '100%', background: '#fff', animation: 'shrinkBar 6s linear forwards' }} />
                </div>
                <style>{`
                    @keyframes shrinkBar { from { width: 100%; } to { width: 0%; } }
                `}</style>
            </div>
        ), { 
            duration: 6000,
            style: { background: '#000000', color: '#fff', padding: '12px 16px', borderRadius: '6px', minWidth: '280px', fontFamily: FONT, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
        });
    };

    useEffect(() => {
        if (location.state && location.state.product) {
            // Priority: Prefill from React Router State
            const p = location.state.product;
                const formattedProduct = {
                    id: p.id || id,
                    name: p.name || '',
                    description: p.description || '', // Default if missing
                    price: p.price || 0,
                    compareAtPrice: p.compareAtPrice || '',
                    stock: p.stock !== undefined ? p.stock : 0,
                    status: p.status || 'Active',
                    image: p.image || 'https://via.placeholder.com/80'
                };
                setProduct(formattedProduct);
                setOriginalProduct(formattedProduct);
                setLoading(false);
            } else {
                // Mock fetch fallback
                setTimeout(() => {
                    const mocked = getMockProduct(id);
                    setProduct(mocked);
                    setOriginalProduct(mocked);
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
        // Mock save API Call
        setTimeout(() => {
            setSaving(false);
            const prev = originalProduct;
            setOriginalProduct(product);
            triggerUndoToast('Data saved successfully', (st) => { setProduct(st); setOriginalProduct(st); }, prev);
        }, 600);
    };

    const handleDiscard = () => {
        if (window.confirm("Are you sure you want to discard your changes?")) {
            if (location.state && location.state.product) {
                const p = location.state.product;
                setProduct({ ...p, description: p.description || '', compareAtPrice: p.compareAtPrice || '' });
            } else {
                setProduct(getMockProduct(id));
            }
        }
    };

    // Validation: Disable Save if price is empty
    const isSaveDisabled = saving || !product?.price || product.price === '';

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                return;
            }
            // FileReader to preview instantly
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
            <Toaster position="bottom-right" />

            <div style={{ marginBottom: 20 }}>
                <Link to="/management-portal/inventory" style={{ 
                    color: '#6e6e73', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500,
                    display: 'inline-flex', alignItems: 'center', transition: 'color 0.2s'
                }} onMouseEnter={e => e.currentTarget.style.color = '#111'} onMouseLeave={e => e.currentTarget.style.color = '#6e6e73'}>
                    &larr; Back to inventory
                </Link>
            </div>

            {/* Header */}
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.08)'
            }}>
                <h1 style={{ fontFamily: FONT, fontSize: '1.4rem', fontWeight: 700, color: '#1d1d1f', margin: 0, textTransform: 'none', letterSpacing: 'normal' }}>
                    Manage Data
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
                        Discard Changes
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        style={{
                            background: isSaveDisabled ? '#e5e7eb' : '#111', color: isSaveDisabled ? '#9ca3af' : '#fff', border: 'none',
                            padding: '8px 20px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500,
                            cursor: isSaveDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s', fontFamily: FONT
                        }}
                        onMouseEnter={e => { if(!isSaveDisabled) e.currentTarget.style.background = '#15803d'; }}
                        onMouseLeave={e => { if(!isSaveDisabled) e.currentTarget.style.background = '#16a34a'; }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
                
                {/* Basic Info */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 16px', fontFamily: FONT }}>Basic info</h2>
                    
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8 }}>Product name</label>
                        <input 
                            type="text" 
                            value={product.name}
                            onChange={e => setProduct({...product, name: e.target.value})}
                            required
                            style={{ 
                                width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', 
                                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: FONT 
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                            onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8 }}>Description</label>
                        <textarea 
                            value={product.description}
                            onChange={e => setProduct({...product, description: e.target.value})}
                            rows={4}
                            style={{ 
                                width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', 
                                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: FONT, resize: 'vertical' 
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                            onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'}
                        />
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 16px', fontFamily: FONT }}>Pricing & Stock</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8 }}>Price (INR)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={product.price}
                                onChange={e => setProduct({...product, price: parseFloat(e.target.value)})}
                                required
                                style={{ 
                                    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: FONT 
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8 }}>Compare-at price</label>
                            <input 
                                type="number" 
                                min="0"
                                value={product.compareAtPrice}
                                onChange={e => setProduct({...product, compareAtPrice: parseFloat(e.target.value)})}
                                style={{ 
                                    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: FONT 
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#9ca3af'}
                                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8 }}>Stock quantity</label>
                        <input 
                            type="number" 
                            min="0"
                            value={product.stock}
                            onChange={handleStockChange}
                            required
                            style={{ 
                                width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: FONT 
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
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 16px', fontFamily: FONT }}>Media</h2>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ width: 80, height: 80, border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={product.image?.startsWith('/') || product.image?.startsWith('data:image') ? product.image : `/${product.image}`} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    background: '#fff', color: '#111827', border: '1px solid #d1d5db',
                                    padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500,
                                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: FONT
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
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 16px', fontFamily: FONT }}>Organization</h2>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 8 }}>Status</label>
                        <select 
                            value={product.status}
                            onChange={e => setProduct({...product, status: e.target.value})}
                            style={{ 
                                width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: FONT, background: '#fff', cursor: 'pointer' 
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
