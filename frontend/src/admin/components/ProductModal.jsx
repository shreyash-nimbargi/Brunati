import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, AlertCircle, ChevronDown } from 'lucide-react';
import { useStorefront } from '../../context/StorefrontContext';

const FONT = '"Roboto", sans-serif';

const CategoryDropdown = ({ value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === 'ArrowDown') setIsOpen(true);
            return;
        }

        if (e.key === 'ArrowDown') {
            setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
        } else if (e.key === 'ArrowUp') {
            setFocusedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
            const opt = options[focusedIndex];
            onChange(typeof opt === 'string' ? opt : opt.name);
            setIsOpen(false);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const selectedOption = options.find(opt => (typeof opt === 'string' ? opt : opt.name) === value);
    const displayValue = selectedOption ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.name) : '';

    return (
        <div ref={dropdownRef} style={{ width: '100%', position: 'relative' }} onKeyDown={handleKeyDown}>
            {/* Trigger Box */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', 
                    fontSize: '0.9rem', outline: 'none', fontFamily: FONT, background: '#fff',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out', borderColor: isOpen ? '#111' : '#e5e7eb',
                    boxShadow: isOpen ? '0 0 0 1px #111' : 'none'
                }}
            >
                <span style={{ 
                    color: displayValue ? '#000' : '#9ca3af', 
                    fontWeight: displayValue ? 700 : 400 
                }}>
                    {displayValue || 'Select Category'}
                </span>
                <ChevronDown 
                    size={18} 
                    style={{ 
                        color: '#6b7280', transition: 'transform 0.3s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
                    }} 
                />
            </div>

            {/* Popover Menu */}
            {isOpen && (
                <div style={{
                    position: isMobile ? 'fixed' : 'absolute',
                    bottom: isMobile ? 0 : 'auto',
                    top: isMobile ? 'auto' : 'calc(100% + 4px)',
                    left: isMobile ? 0 : 0,
                    width: '100%',
                    background: '#fff',
                    zIndex: 2100,
                    borderRadius: isMobile ? '16px 16px 0 0' : '8px',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    animation: isMobile ? 'slideUp 0.3s ease-out' : 'slideDownFade 0.2s ease-out',
                    border: isMobile ? 'none' : '1px solid #f3f4f6',
                    padding: isMobile ? '12px 16px 32px' : '4px'
                }}>
                    {isMobile && <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '2px', margin: '0 auto 16px' }} />}
                    
                    {options.length > 0 ? options.map((opt, idx) => {
                        const name = typeof opt === 'string' ? opt : opt.name;
                        const isSelected = name === value;
                        const isFocused = idx === focusedIndex;

                        return (
                            <div
                                key={idx}
                                onClick={() => { onChange(name); setIsOpen(false); }}
                                onMouseEnter={() => setFocusedIndex(idx)}
                                style={{
                                    padding: '12px 16px', fontSize: '0.9rem', fontFamily: FONT, cursor: 'pointer',
                                    color: isSelected ? '#000' : '#4b5563', fontWeight: isSelected ? 700 : 400,
                                    background: isFocused ? '#f9fafb' : 'transparent',
                                    borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    transition: 'all 0.1s ease',
                                    borderLeft: `3px solid ${isFocused ? '#111' : 'transparent'}`,
                                    marginBottom: '2px'
                                }}
                            >
                                {name}
                                {isSelected && <Check size={16} strokeWidth={3} />}
                            </div>
                        );
                    }) : (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                            No Categories Found
                        </div>
                    )}
                </div>
            )}

            {isMobile && isOpen && (
                <div 
                    onClick={() => setIsOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 2050 }}
                />
            )}
        </div>
    );
};

const ProductModal = ({ isOpen, onClose, product: initialProduct, onSave }) => {
    const { categories } = useStorefront();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        compareAtPrice: '',
        stock: 0,
        status: 'Active',
        category: '',
        image: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const isEdit = !!initialProduct;

    useEffect(() => {
        if (initialProduct && isOpen) {
            setProduct({
                ...initialProduct,
                price: initialProduct.price || (initialProduct.sizes?.[0]?.price || ''),
                compareAtPrice: initialProduct.compareAtPrice || '',
                stock: initialProduct.stock !== undefined ? initialProduct.stock : (initialProduct.sizes?.[0]?.stock || 0),
                category: initialProduct.category || '',
                status: initialProduct.status || 'Active',
                image: (initialProduct.images?.[0]?.startsWith('http') ? initialProduct.images[0] : (initialProduct.images?.[0] ? `/${initialProduct.images[0]}` : '')) || ''
            });
        } else if (isOpen) {
            setProduct({
                name: '',
                description: '',
                price: '',
                compareAtPrice: '',
                stock: 0,
                status: 'Active',
                category: '',
                image: ''
            });
        }
    }, [initialProduct, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!product.name || !product.price) return;
        
        setSaving(true);
        setError('');
        
        // Auto-generate slug from name
        const slug = product.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        const finalProduct = { ...product, slug };

        try {
            await onSave(finalProduct);
            onClose();
        } catch (err) {
            console.error('Save error:', err);
            setError('Failed to save product. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const isValid = product.name && product.price;
    const isMobile = window.innerWidth < 768;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center',
            padding: isMobile ? '0' : '20px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: '#fff', width: isMobile ? '100%' : '100%', maxWidth: isMobile ? '100%' : '720px', maxHeight: isMobile ? '92vh' : '90vh', overflowY: 'auto',
                borderRadius: isMobile ? '20px 20px 0 0' : '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative',
                animation: isMobile ? 'slideUpMobile 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'slideUp 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: isMobile ? '20px 24px' : '24px 32px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    position: 'sticky', top: 0, background: '#fff', zIndex: 10
                }}>
                    <h2 style={{ fontFamily: FONT, fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#111827', textTransform: 'none' }}>
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 8 }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSave} style={{ padding: isMobile ? '24px' : '32px' }}>
                    {/* Error Banner */}
                    {error && (
                        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Basic Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: 8, fontFamily: FONT }}>Product Name</label>
                                <input name="name" value={product.name} onChange={handleChange} placeholder="e.g. Brunati Aqua 100ml" required
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: FONT, boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: 8, fontFamily: FONT }}>Description</label>
                                <textarea name="description" value={product.description} onChange={handleChange} rows={3} placeholder="Tell us more about this fragrance..."
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: FONT, resize: 'none', boxSizing: 'border-box' }} />
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 20 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: 8, fontFamily: FONT }}>Price (₹)</label>
                                <input name="price" type="number" value={product.price} onChange={handleChange} required
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: FONT, boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: 8, fontFamily: FONT }}>Compare at Price (₹)</label>
                                <input name="compareAtPrice" type="number" value={product.compareAtPrice} onChange={handleChange}
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: FONT, boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: 8, fontFamily: FONT }}>Inventory</label>
                                <input name="stock" type="number" value={product.stock} onChange={handleChange}
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: FONT, boxSizing: 'border-box' }} />
                            </div>
                        </div>

                        {/* Organization */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: 8, fontFamily: FONT }}>Category</label>
                                <CategoryDropdown 
                                    value={product.category} 
                                    options={categories || []} 
                                    onChange={(val) => setProduct(prev => ({ ...prev, category: val }))} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: 8, fontFamily: FONT }}>Status</label>
                                <select name="status" value={product.status} onChange={handleChange}
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: FONT, background: '#fff' }}>
                                    <option value="Active">Active</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                        </div>

                        {/* Media */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#000', marginBottom: 8, fontFamily: FONT }}>Product Media (Cloudinary URL)</label>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <input name="image" value={product.image} onChange={handleChange} placeholder="https://res.cloudinary.com/..."
                                    className="admin-input"
                                    style={{ flex: 1, padding: '12px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: FONT }} />
                                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#000' }}>
                                    <Upload size={20} />
                                </button>
                                <input type="file" ref={fileInputRef} hidden />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'flex-end', gap: 12 }}>
                        <button type="submit" disabled={!isValid || saving} style={{
                            padding: '14px 32px', background: isValid ? '#000' : '#E5E7EB', color: isValid ? '#fff' : '#9CA3AF', border: 'none', borderRadius: '8px', fontSize: '0.9rem', 
                            fontWeight: 700, cursor: isValid ? 'pointer' : 'not-allowed', fontFamily: FONT, textTransform: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s',
                            order: isMobile ? 1 : 2
                        }}>
                            {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Add Product')}
                            {saving && <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>}
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: '14px 24px', background: 'none', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#000', cursor: 'pointer', fontFamily: FONT, textTransform: 'none', order: isMobile ? 2 : 1 }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes slideUpMobile { from { transform: translateY(100%); } to { transform: translateY(0); } }
                @keyframes slideDownFade { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default ProductModal;
