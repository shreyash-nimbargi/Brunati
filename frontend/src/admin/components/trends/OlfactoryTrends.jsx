import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Video, Package, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useStorefront } from '../../../context/StorefrontContext';
import { toast } from 'react-hot-toast';

const OlfactoryTrends = ({ isMobile }) => {
    const { inventoryProducts } = useStorefront();
    
    // Dummy State Array
    const [trends, setTrends] = useState([
        { id: 1, productId: "P001", videoLink: "cloudinary.com/v123", productName: "Midnight Glammer", productImage: "https://via.placeholder.com/150" },
        { id: 2, productId: "P002", videoLink: "cloudinary.com/v456", productName: "Oceanic Breeze", productImage: "https://via.placeholder.com/150" }
    ]);

    const [selectedProduct, setSelectedProduct] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

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
        const newTrend = {
            id: Date.now(),
            productId: selectedProduct,
            productName: productObj?.name || 'Selected Perfume',
            productImage: productObj?.image || 'https://via.placeholder.com/150',
            videoLink: videoUrl
        };

        setTrends([newTrend, ...trends]);
        setVideoUrl('');
        setSelectedProduct('');
        toast.success('Trend added (Preview)');
    };

    const handleDeleteTrend = (id) => {
        setTrends(trends.filter(t => t.id !== id));
        toast.success('Trend removed');
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Section */}
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center justify-between'} mb-10`}>
                <div>
                    <h2 className="text-black text-[22px] font-bold leading-tight tracking-tight font-roboto">
                        Olfactory Trends
                    </h2>
                    <p className="text-sm text-gray-500 font-normal mt-1.5 font-roboto">
                        Manage featured video trends and associate them with your luxury products.
                    </p>
                </div>
            </div>

            {/* Input Form Section (Top) */}
            <div className="bg-white p-8 rounded-[20px] border border-gray-100 mb-10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {/* Select Product Dropdown */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-roboto font-normal text-gray-600 flex items-center gap-2">
                            <Package size={14} /> Select Product
                        </label>
                        {inventoryProducts?.length > 0 ? (
                            <select 
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-roboto focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
                            >
                                <option value="">-- Choose a perfume --</option>
                                {inventoryProducts.map(p => (
                                    <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 text-gray-400 text-sm">
                                <AlertCircle size={14} /> Loading products...
                            </div>
                        )}
                    </div>

                    {/* Video URL Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-roboto font-normal text-gray-600 flex items-center gap-2">
                            <Video size={14} /> Upload Trend Video / URL
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Paste Video URL (Cloudinary, Vimeo, etc.)"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-roboto focus:outline-none focus:border-black transition-all"
                            />
                            <button 
                                onClick={() => toast('Upload feature coming soon', { icon: '🚧' })}
                                className="bg-white border border-gray-200 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all font-roboto"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={handleAddTrend}
                        className="bg-black text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2 font-roboto"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Trends List (Bottom Section) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {trends.map(trend => (
                    <div key={trend.id} className="bg-white rounded-[20px] border border-gray-100 flex overflow-hidden group hover:border-gray-200 hover:shadow-2xl hover:shadow-black/[0.03] transition-all duration-300">
                        {/* Left Side: Product Image */}
                        <div className="w-1/3 aspect-[4/5] bg-gray-50 relative overflow-hidden">
                            <img src={trend.productImage} alt={trend.productName} className="w-full h-full object-cover" />
                        </div>

                        {/* Right Side: Trend Details */}
                        <div className="flex-1 p-6 flex flex-col justify-center relative">
                            {/* Card Actions */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="p-2 text-gray-300 hover:text-black transition-all"><Edit2 size={14} strokeWidth={1.2} /></button>
                                <button onClick={() => handleDeleteTrend(trend.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={14} strokeWidth={1.2} /></button>
                            </div>

                            <p className="text-[10px] text-gray-400 font-roboto mb-1">Featured Trend</p>
                            <h3 className="text-black text-[18px] font-bold leading-tight font-roboto mb-3">
                                {trend.productName}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-all cursor-pointer">
                                <LinkIcon size={12} />
                                <span className="text-[12px] font-roboto truncate max-w-[150px]">{trend.videoLink}</span>
                            </div>
                            
                            <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-roboto">
                                <Video size={12} />
                                <span>Trend Video Linked</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {trends.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <Video size={40} strokeWidth={1} className="mb-4 opacity-30" />
                    <p className="font-roboto italic">No trends associated yet. Create your first trend above.</p>
                </div>
            )}
        </div>
    );
};

export default OlfactoryTrends;
