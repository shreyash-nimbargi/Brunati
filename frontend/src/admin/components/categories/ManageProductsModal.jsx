import React, { useState, useEffect } from 'react';
import { X, Save, Search, CheckCircle2, Circle } from 'lucide-react';
import { productService } from '../../../services/productService';
import { toast } from 'react-hot-toast';

const ManageProductsModal = ({ isOpen, onClose, category, allProducts, onUpdateComplete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [tempCategoryName, setTempCategoryName] = useState('');

    useEffect(() => {
        if (isOpen && category) {
            const name = typeof category === 'string' ? category : category.name;
            setTempCategoryName(name);
            
            // Identify products already in this category
            const existingIds = allProducts
                .filter(p => p.category?.toLowerCase() === name.toLowerCase())
                .map(p => p._id);
            setSelectedProductIds(existingIds);
        }
    }, [isOpen, category, allProducts]);

    if (!isOpen) return null;

    const filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleProduct = (id) => {
        setSelectedProductIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        const name = typeof category === 'string' ? category : category.name;
        
        try {
            // Logic:
            // 1. Products in selectedProductIds -> set category to 'name'
            // 2. Products previously in 'name' but NOT in selectedProductIds -> set category to ""
            
            const previouslyIn = allProducts
                .filter(p => p.category?.toLowerCase() === name.toLowerCase())
                .map(p => p._id);

            const toAdd = selectedProductIds.filter(id => !previouslyIn.includes(id));
            const toRemove = previouslyIn.filter(id => !selectedProductIds.includes(id));

            // Perform individual updates (batching if possible, but existing controller is for single product)
            const updatePromises = [
                ...toAdd.map(id => productService.updateProduct(id, { category: name })),
                ...toRemove.map(id => productService.updateProduct(id, { category: "" }))
            ];

            await Promise.all(updatePromises);
            
            toast.success(`Updated associations for ${name}`);
            onUpdateComplete();
            onClose();
        } catch (err) {
            console.error('Update associations error:', err);
            toast.error('Failed to update product associations');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <style>{`
                .visible-scrollbar::-webkit-scrollbar { width: 6px; }
                .visible-scrollbar::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 10px; }
                .visible-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
                .visible-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
            `}</style>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-xl rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div>
                        <h2 className="text-[22px] font-bold text-black" style={{ fontFamily: '"Roboto", sans-serif' }}>
                            Assign products to <span className="font-bold">{tempCategoryName}</span>
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                        <X size={20} strokeWidth={1} />
                    </button>
                </div>

                {/* Search Bar Area */}
                <div className="px-8 py-5 border-b border-gray-100 bg-white">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text"
                            placeholder="Find collections by product name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 focus:border-black rounded-lg outline-none transition-all font-normal text-sm"
                            style={{ fontFamily: '"Roboto", sans-serif' }}
                        />
                    </div>
                </div>

                {/* Product List Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4 visible-scrollbar max-h-[60vh]">
                    <div className="flex flex-col gap-3">
                        {filteredProducts.map(product => {
                            const isSelected = selectedProductIds.includes(product._id);
                            return (
                                <div 
                                    key={product._id}
                                    onClick={() => toggleProduct(product._id)}
                                    className={`
                                        flex items-center justify-between p-4 px-6 cursor-pointer transition-all bg-white border border-gray-200 rounded-xl shadow-sm
                                        ${isSelected ? 'border-black' : 'hover:border-gray-400'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 p-1 border border-gray-100">
                                            <img 
                                                src={product.images?.[0]?.startsWith('http') ? product.images[0] : (product.images?.[0] ? `/${product.images[0]}` : '/placeholder.png')} 
                                                alt="" 
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[15px] text-gray-900" style={{ fontFamily: '"Roboto", sans-serif' }}>
                                                {product.name}
                                            </p>
                                            <p className="text-[11px] text-gray-400 font-light mt-0.5" style={{ fontFamily: '"Roboto", sans-serif' }}>
                                                Category: <span className="font-normal text-gray-500">{product.category || 'Unassigned'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`
                                            w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all group-hover:border-black
                                            ${isSelected ? 'bg-black border-black' : 'border-gray-400'}
                                        `}>
                                            {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-[2px]"></div>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 pt-6 border-t border-gray-100 bg-white">
                    <button 
                        disabled={isSaving}
                        onClick={handleSave}
                        className="w-full py-4 bg-black text-white hover:bg-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm shadow-lg shadow-black/10"
                        style={{ fontFamily: '"Roboto", sans-serif' }}
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : null}
                        Save Selection
                    </button>
                    <p className="text-center text-[13px] text-gray-500 mt-4 font-normal" style={{ fontFamily: '"Roboto", sans-serif' }}>
                        {selectedProductIds.length} products selected for this collection
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManageProductsModal;
