import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductModal from '../components/ProductModal';
import CategoryManagement from '../components/CategoryManagement';

const FONT = '"Roboto", sans-serif';

const AdminInventory = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(location.state?.filterCategory || '');
    const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'mobile' : 'desktop');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(location.state?.filterCategory || null);
    const [toast, setToast] = useState('');
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        const handleResize = () => setViewMode(window.innerWidth <= 768 ? 'mobile' : 'desktop');
        window.addEventListener('resize', handleResize);
        fetchProducts();
        fetchCategories();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchCategories = async () => {
        try {
            // Mock or actual service fetch
            const res = [
                { _id: '1', name: 'Men', slug: 'men' },
                { _id: '2', name: 'Women', slug: 'women' },
                { _id: '3', name: 'Unisex', slug: 'unisex' }
            ];
            setAllCategories(res);
        } catch (err) {
            console.error('Categories fetch error:', err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await productService.getAllProducts();
            if (res.status && res.data) {
                const data = res.data.luxury_collection || res.data.luxury || (Array.isArray(res.data) ? res.data : []);
                setProducts(data);
            }
        } catch (err) {
            console.error('Inventory fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = async (productData) => {
        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct._id, productData);
            } else {
                await productService.createProduct(productData);
            }
            await fetchProducts(); // Refresh list
        } catch (err) {
            console.error('Save error:', err);
            throw err;
        }
    };

    const filteredProducts = products.filter(p => {
        const search = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(search) || 
               p.category?.toLowerCase() === search ||
               p._id?.toLowerCase().includes(search);
    });

    const handleCategoryChange = async (productId, newCategory, productName) => {
        try {
            // Step 1: Payload { category: newValue }
            const response = await productService.updateProduct(productId, { category: newCategory });
            
            if (response) {
                // Step 2: Toast only after 200 OK
                setToast(`<b>${productName}</b> moved to <b>${newCategory}</b>`);
                
                // Step 3: State Filtering for "Liquid" feel
                setProducts(prev => prev.filter(p => p._id !== productId));
                
                setTimeout(() => setToast(''), 3000);
            }
        } catch (err) {
            console.error('Category transfer failed:', err);
            // Optional: Error toast
            setToast(`<span class="text-red-400">Failed to move ${productName}</span>`);
            setTimeout(() => setToast(''), 3000);
        }
    };

    return (
        <div style={{ fontFamily: FONT, width: '100%', animation: 'fadeIn 0.3s ease-in-out', padding: viewMode === 'mobile' ? '0 16px' : '0' }}>
            {/* Header Area */}
            <div style={{ 
                display: 'flex', 
                flexDirection: viewMode === 'mobile' ? 'column' : 'row', 
                justifyContent: 'space-between', 
                alignItems: viewMode === 'mobile' ? 'flex-start' : 'center',
                gap: 20,
                marginBottom: 32,
                paddingBottom: 24,
                borderBottom: '1px solid rgba(0,0,0,0.06)'
            }}>
                <h1 style={{ 
                    fontFamily: FONT, 
                    fontSize: viewMode === 'mobile' ? '1.5rem' : '1.75rem', 
                    fontWeight: 700, 
                    color: '#000', 
                    margin: 0, 
                    letterSpacing: '-0.01em', 
                    textTransform: 'none' // Normal Case
                }}>Inventory</h1>
                
                <div style={{ display: 'flex', flexDirection: viewMode === 'mobile' ? 'column' : 'row', gap: 12, width: viewMode === 'mobile' ? '100%' : 'auto' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: viewMode === 'mobile' ? 'auto' : '280px' }}>
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="admin-input w-full p-3 pl-10 text-sm"
                            style={{ fontFamily: FONT }}
                        />
                        <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    
                    <button 
                        onClick={handleAddProduct}
                        style={{
                            padding: '12px 24px', background: '#000', color: '#fff', border: 'none',
                            borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                            whiteSpace: 'nowrap', transition: 'all 0.2s', fontFamily: FONT, height: '100%',
                            width: viewMode === 'mobile' ? '100%' : 'auto',
                            textTransform: 'none'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        Add Product
                    </button>
                </div>
            </div>

            {/* Liquid Toast Success Banner */}
            {toast && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] animate-fadeIn">
                    <div className="bg-black text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                                <path d="M20 6L9 17L4 12" />
                            </svg>
                        </div>
                        <span style={{ fontFamily: FONT, fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: toast }} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {selectedCategory ? (
                <div className="animate-fadeIn">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <button 
                            onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                            className="flex items-center gap-2 text-black bg-white border border-gray-200 px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all font-bold text-sm"
                            style={{ fontFamily: FONT }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Categories
                        </button>
                        
                        <h1 style={{ fontFamily: FONT, fontWeight: 700, fontSize: '1.75rem', textTransform: 'none', margin: 0 }}>
                            {selectedCategory} Collection
                        </h1>
                    </div>

                    <div className="w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left" style={{ fontFamily: FONT }}>Product</th>
                                        <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right" style={{ fontFamily: FONT }}>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                                        <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-all">
                                            <td className="p-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-2 shadow-sm shrink-0">
                                                        <img 
                                                            src={p.images?.[0]?.startsWith('http') ? p.images[0] : (p.images?.[0] ? `/${p.images[0]}` : '/placeholder.png')} 
                                                            alt={p.name} 
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: '15px', color: '#000', textTransform: 'none' }}>
                                                        {p.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end relative">
                                                    <select
                                                        value={p.category}
                                                        onChange={(e) => handleCategoryChange(p._id, e.target.value, p.name)}
                                                        className="appearance-none bg-white border border-gray-300 px-4 py-3 pr-10 rounded-lg text-sm transition-all focus:border-black focus:ring-0 outline-none cursor-pointer md:py-2"
                                                        style={{ fontFamily: FONT, fontSize: '14px', color: '#000' }}
                                                    >
                                                        {allCategories.map(cat => (
                                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                            <path d="M6 9l6 6 6-6" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="2" className="p-20 text-center text-gray-400 italic font-medium">No products remaining in this collection.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Category Management Section */}
                    <div className="mb-8">
                        <h2 className="mb-6" style={{ fontFamily: FONT, fontWeight: 700, fontSize: '1.25rem', textTransform: 'none' }}>Category Management</h2>
                        <CategoryManagement onCategorySelect={(cat) => {
                            setSelectedCategory(cat);
                            setSearchQuery(cat);
                        }} />
                    </div>

                    <div className="mb-6 flex items-center justify-between">
                        <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: '1.25rem', textTransform: 'none' }}>All Inventory</h2>
                    </div>

                    {/* Products Layout: Table for Desktop, 1-Column Grid for Mobile */}
                    {viewMode === 'desktop' ? (
                        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                                        <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', width: 80 }}>Image</th>
                                        <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Product Name</th>
                                        <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Status</th>
                                        <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Inventory</th>
                                        <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Price</th>
                                        <th style={{ fontFamily: FONT, padding: '14px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length > 0 ? filteredProducts.map((p, idx) => (
                                        <tr key={p._id} style={{ borderBottom: idx === filteredProducts.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '12px 20px' }}>
                                                <div style={{ width: 48, height: 48, border: '1px solid #e5e7eb', borderRadius: 6, background: '#f9fafb', overflow: 'hidden' }}>
                                                    <img src={p.images?.[0]?.startsWith('http') ? p.images[0] : (p.images?.[0] ? `/${p.images[0]}` : '/placeholder.png')} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 20px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#000' }}>{p.name}</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>{p.category}</div>
                                            </td>
                                            <td style={{ padding: '12px 20px' }}>
                                                <span style={{ 
                                                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                                                    background: p.isActive ? '#eefdf5' : '#f4f4f5', color: p.isActive ? '#10b981' : '#71717a'
                                                }}>
                                                    {p.isActive ? 'Active' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: '#444' }}>
                                                {p.sizes?.[0]?.stock || 0} in stock
                                            </td>
                                            <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: '#000', fontWeight: 600 }}>₹{p.sizes?.[0]?.price?.toLocaleString() || '0'}</td>
                                            <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                                <button onClick={() => handleEditProduct(p)} style={{ background: 'none', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No products found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                            {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                                <div key={p._id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                                    <div style={{ width: 80, height: 80, border: '1px solid #f3f4f6', borderRadius: 8, overflow: 'hidden', background: '#fcfcfc', flexShrink: 0 }}>
                                        <img src={p.images?.[0]?.startsWith('http') ? p.images[0] : (p.images?.[0] ? `/${p.images[0]}` : '/placeholder.png')} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h3>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: p.isActive ? '#10b981' : '#71717a' }}>• {p.isActive ? 'Active' : 'Draft'}</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 8 }}>{p.category}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000' }}>₹{p.sizes?.[0]?.price?.toLocaleString()}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{p.sizes?.[0]?.stock || 0} in stock</div>
                                            </div>
                                            <button onClick={() => handleEditProduct(p)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, color: '#000', cursor: 'pointer' }}>Edit</button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', border: '1px dashed #e5e7eb', borderRadius: 12 }}>No products found.</div>
                            )}
                        </div>
                    )}
                </>
            )}

            <ProductModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
                product={editingProduct}
                onSave={handleSaveProduct}
            />

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
