import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Video, Package, Link as LinkIcon, AlertCircle, ExternalLink, Search } from 'lucide-react';
import { useStorefront } from '../../../context/StorefrontContext';
import { toast } from 'react-hot-toast';

const OlfactoryTrends = ({ isMobile }) => {
    const { inventoryProducts } = useStorefront();
    
    // Trends State (Real associations would come from an API, we use dummy initialization with correct structure)
    const [trends, setTrends] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Filter products based on search term
    const filteredInventory = useMemo(() => {
        if (!inventoryProducts) return [];
        return inventoryProducts.filter(p => 
            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.category?.toLowerCase().includes(productSearch.toLowerCase())
        );
    }, [inventoryProducts, productSearch]);

    const handleAddTrend = () => {
        if (!selectedProduct) {
            toast.error('Please select a product');
            return;
        }
        if (!videoUrl) {
            toast.error('Please provide a video URL');
            return;
        }

        const productObj = inventoryProducts.find(p => p._id === selectedProduct || p.id === selectedProduct);
        
        // Correct Cloudinary / Local Image Logic
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const imgKey = productObj?.images?.[0] || productObj?.image;
        const finalImgUrl = imgKey?.startsWith('http') 
            ? imgKey 
            : (imgKey ? `${backendUrl}/${imgKey}` : '/placeholder.png');
        
        const newTrend = {
            id: Date.now(),
            productId: selectedProduct,
            productName: productObj?.name || 'Selected Perfume',
            productImage: finalImgUrl,
            videoLink: videoUrl,
            category: productObj?.category || 'General'
        };

        setTrends([newTrend, ...trends]);
        setVideoUrl('');
        setSelectedProduct('');
        setProductSearch('');
        toast.success(`Trend for ${newTrend.productName} added`);
    };

    const handleDeleteTrend = (id) => {
        setTrends(trends.filter(t => t.id !== id));
        toast.success('Trend removed');
    };

    return (
        <div className="animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">
            {/* Module Heading Area */}
            <div className={`mb-8 ${isMobile ? 'px-0 text-center' : ''}`}>
                <h2 className={`text-black font-bold leading-tight tracking-tight font-roboto ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ textTransform: 'none' }}>
                    Olfactory Trends
                </h2>
                <p className={`text-gray-500 font-normal mt-2 font-roboto ${isMobile ? 'text-sm' : 'text-base'}`}>
                    Manage featured video trends and associate them with your luxury products.
                </p>
            </div>

            {/* Input Form Section (Mobile Optimized & Searchable) */}
            <div className={`max-w-4xl mx-auto w-full ${isMobile ? 'p-6' : 'p-8'} bg-white rounded-3xl border border-gray-100 mb-10 shadow-md overflow-hidden relative z-0`}>
                <div className={`flex flex-col gap-6 mb-8`}>
                    
                    {/* Select Product Area with Search */}
                    <div className="flex flex-col gap-3 relative z-10">
                        <label className="text-[11px] font-bold text-gray-700 flex items-center gap-2 normal-case tracking-wider">
                            <Package size={14} /> Select Product
                        </label>
                        
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={14} />
                            <input 
                                type="text"
                                placeholder="Search perfumes (e.g. Midnight)..."
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-roboto focus:border-black transition-all outline-none"
                            />
                        </div>

                        {inventoryProducts?.length > 0 ? (
                            <div className="relative">
                                <select 
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-roboto focus:outline-none focus:border-black transition-all appearance-none cursor-pointer hover:border-gray-400 pr-10"
                                >
                                    <option value="">{filteredInventory.length > 0 ? '-- Select perfume from results --' : '-- No perfumes found --'}</option>
                                    {(filteredInventory || []).map(p => (
                                        <option key={p._id || p.id} value={p._id || p.id}>
                                            {p.name} {p.category ? `(${p.category})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Plus size={14} className="rotate-45" /> 
                                </div>
                            </div>
                        ) : (
                            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-2 text-gray-400 text-sm italic">
                                <AlertCircle size={14} /> Loading products...
                            </div>
                        )}
                    </div>

                    {/* Video URL Field */}
                    <div className="flex flex-col gap-3 relative z-10">
                        <label className="text-[11px] font-bold text-gray-700 flex items-center gap-2 normal-case tracking-wider">
                            <Video size={14} /> Upload Trend Video / URL
                        </label>
                        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
                            <input 
                                type="url" 
                                placeholder="Paste Cloudinary URL..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-roboto focus:outline-none focus:border-black transition-all"
                            />
                            <button 
                                onClick={() => toast('Upload coming soon', { icon: '🚧' })}
                                className={`
                                    bg-white border border-gray-300 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 hover:text-black hover:border-black transition-all font-roboto
                                    ${isMobile ? 'w-full py-3.5' : 'px-8'}
                                `}
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'}`}>
                    <button 
                        onClick={handleAddTrend}
                        className={`
                            bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 font-roboto
                            ${isMobile ? 'w-full py-4' : 'px-16 py-3'}
                        `}
                    >
                        Add Trend
                    </button>
                </div>
            </div>

            {/* Gap between form and list */}
            <div className="h-6"></div>

            {/* Trends List (Responsive Optimization) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto px-0 md:px-0">
                {(trends || []).map(trend => (
                    <div key={trend.id} className={`
                        bg-white rounded-[20px] border border-gray-100 flex overflow-hidden group 
                        hover:border-gray-200 hover:shadow-2xl hover:shadow-black/[0.03] transition-all duration-300
                        ${isMobile ? 'flex-col w-full' : 'flex-row'}
                    `}>
                        {/* Image Area - Aspect Ratio Fix */}
                        <div className={`
                            bg-gray-100 relative overflow-hidden flex-shrink-0 flex items-center justify-center
                            ${isMobile ? 'w-full aspect-video' : 'w-1/3 aspect-square'}
                        `}>
                            {trend.productImage && trend.productImage !== '/placeholder.png' ? (
                                <img 
                                    src={trend.productImage} 
                                    alt={trend.productName} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    onError={(e) => { e.target.src = '/placeholder.png' }}
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-300">
                                    <Package size={24} strokeWidth={1} />
                                    <span className="text-[10px] font-roboto">No Image</span>
                                </div>
                            )}
                        </div>

                        {/* Details Area */}
                        <div className="flex-1 p-6 flex flex-col justify-center relative bg-white">
                            {/* Card Actions */}
                            <div className="absolute top-4 right-4 flex gap-1">
                                <button className="p-2 text-gray-400 hover:text-black transition-all"><Edit2 size={14} strokeWidth={1.5} /></button>
                                <button onClick={() => handleDeleteTrend(trend.id)} className="p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} strokeWidth={1.5} /></button>
                            </div>

                            <p className="text-[10px] text-gray-400 font-roboto mb-1">{trend.category}</p>
                            <h3 className="text-black text-[17px] font-bold leading-tight font-roboto mb-2">
                                {trend.productName}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-all cursor-pointer">
                                <ExternalLink size={12} />
                                <span className="text-[11px] font-roboto font-light truncate max-w-full">{trend.videoLink}</span>
                            </div>
                            
                            <div className="mt-6 flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Video size={10} className="text-gray-400" />
                                </div>
                                <span className="text-[10px] text-gray-400 font-roboto">Trend Active</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {trends.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <Video size={40} strokeWidth={1} className="mb-4 opacity-30" />
                    <p className="font-roboto italic text-sm text-center px-6">No trends associated yet. Create association with real perfume above.</p>
                </div>
            )}
        </div>
    );
};

export default OlfactoryTrends;
