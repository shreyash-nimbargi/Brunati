import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useStorefront } from '../../context/StorefrontContext';

const ProductSelectorModal = ({ isOpen, onClose, onSave, initialSelectedIds }) => {
    const { inventoryProducts } = useStorefront();
    const FONT_ROBOTO = '"Roboto", sans-serif';
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState(initialSelectedIds || []);

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(initialSelectedIds || []);
            setSearchQuery('');
        }
    }, [isOpen, initialSelectedIds]);

    if (!isOpen) return null;

    const allProducts = inventoryProducts || [];
    const filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSave = () => {
        onSave(selectedIds);
    };

    const btnStyle = {
        padding: '8px 16px', borderRadius: '4px', border: '1px solid #000', cursor: 'pointer',
        fontFamily: FONT_ROBOTO, fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px',
        backgroundColor: '#000', color: '#fff'
    };
    const btnOutlineStyle = { ...btnStyle, backgroundColor: 'transparent', color: '#000' };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '500px', maxWidth: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: FONT_ROBOTO, fontSize: '1.25rem', fontWeight: 700, margin: 0, textTransform: 'none' }}>Choose Items</h3>
                    <X size={20} cursor="pointer" onClick={onClose} />
                </div>
                
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input 
                        type="text" 
                        placeholder="Find Items..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 12px 12px 36px', border: '1px solid #E5E7EB', borderRadius: '6px',
                            fontFamily: FONT_ROBOTO, fontSize: '0.9rem', outline: 'none'
                        }}
                    />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '12px' }}>
                    {filteredProducts.length > 0 ? filteredProducts.map(product => {
                        const id = product.id;
                        const isSelected = selectedIds.includes(id);
                        return (
                            <div 
                                key={id} 
                                onClick={() => toggleSelection(id)}
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', 
                                    cursor: 'pointer', borderBottom: '1px solid #F3F4F6',
                                    backgroundColor: isSelected ? '#F9FAFB' : 'transparent'
                                }}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    readOnly
                                    style={{ cursor: 'pointer' }}
                                />
                                <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
                                    <img src={product.image.startsWith('/') ? product.image : '/' + product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontFamily: FONT_ROBOTO, fontSize: '0.9rem', fontWeight: 500 }}>{product.name}</p>
                                    <p style={{ margin: 0, fontFamily: FONT_ROBOTO, fontSize: '0.8rem', color: '#6B7280' }}>ID: {id}</p>
                                </div>
                            </div>
                        );
                    }) : (
                        <p style={{ fontFamily: FONT_ROBOTO, fontSize: '0.9rem', color: '#6B7280', textAlign: 'center', padding: '20px 0' }}>No products found.</p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    <button onClick={onClose} style={{...btnOutlineStyle, padding: '12px', justifyContent: 'center'}}>Close</button>
                    <button onClick={handleSave} style={{...btnStyle, padding: '12px', background: '#16a34a', borderColor: '#16a34a', justifyContent: 'center'}}>Save Group</button>
                </div>
            </div>
        </div>
    );
};

export default ProductSelectorModal;
