import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BannerCard = ({ banner, onEdit, onDelete }) => {
    const FONT_ROBOTO_BOLD = '"Roboto", sans-serif';
    const FONT_ROBOTO_REGULAR = '"Roboto", sans-serif';

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        
        let shouldDelete = true;
        
        const toastId = toast((t) => (
            <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                <span className="text-sm font-normal" style={{ fontFamily: FONT_ROBOTO_REGULAR }}>Banner deleted</span>
                <button 
                    onClick={() => {
                        shouldDelete = false;
                        toast.dismiss(t.id);
                        toast.success('Restored', { duration: 2000 });
                    }}
                    className="bg-white text-black px-4 py-1.5 rounded-lg text-xs font-bold border border-black hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
                    style={{ fontFamily: FONT_ROBOTO_BOLD }}
                >
                    Undo
                </button>
            </div>
        ), { 
            duration: 6000,
            position: 'bottom-center',
            style: { background: '#000', color: '#fff', padding: '12px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }
        });

        // Effect for delayed execution
        setTimeout(() => {
            if (shouldDelete) {
                onDelete(banner._id || banner.id);
            }
        }, 6000);
    };

    // Ensure image URL is handled properly (handling both local path and proxy)
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const imgKey = banner.imageUrl || banner.image;
    const imageUrl = imgKey?.startsWith('http') 
        ? imgKey 
        : (imgKey ? `${backendUrl}/${imgKey}` : null);

    return (
        <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative flex flex-col h-full font-roboto">
            {/* Draft Badge */}
            {banner?.isDefault && (
                <div className="absolute top-4 left-4 z-30 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg shadow-lg ring-2 ring-white/20" style={{ fontFamily: FONT_ROBOTO_BOLD }}>
                    Draft
                </div>
            )}
            
            {/* Banner Media Container */}
            <div className="relative h-56 w-full bg-gray-50 overflow-hidden flex-shrink-0">
                {imageUrl ? (
                    <>
                        <img 
                            src={imageUrl} 
                            alt={banner?.title || 'Banner'} 
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        {/* Luxury Gradient Overlay (Always there if image exists for text readability) */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${(banner?.title || banner?.subtitle) ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}></div>
                        
                        {/* Content Overlay */}
                        {(banner?.title || banner?.subtitle) && (
                            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end select-none">
                                {banner?.title && (
                                    <h3 
                                        className="text-white text-xl font-bold tracking-tight mb-1 animate-in slide-in-from-bottom-2 duration-700" 
                                        style={{ fontFamily: FONT_ROBOTO_BOLD }}
                                    >
                                        {banner?.title}
                                    </h3>
                                )}
                                {banner?.subtitle && (
                                    <p 
                                        className="text-white/80 text-[11px] leading-relaxed line-clamp-2 font-normal tracking-wide" 
                                        style={{ fontFamily: FONT_ROBOTO_REGULAR }}
                                    >
                                        {banner?.subtitle}
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                        <Camera size={24} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">No Image</span>
                    </div>
                )}
                
                {/* Inactive Overlay */}
                {!banner?.active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px] z-20">
                        <span className="bg-white/95 text-black px-6 py-2 rounded-full text-[11px] font-bold" style={{ fontFamily: FONT_ROBOTO_BOLD }}>Inactive</span>
                    </div>
                )}
            </div>

            {/* Controls Section */}
            <div className="p-5 bg-white flex items-center gap-3 border-t border-gray-50 mt-auto">
                <button 
                    onClick={() => onEdit(banner)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white hover:bg-gray-800 transition-all text-xs font-bold rounded-xl shadow-lg shadow-black/5"
                    style={{ fontFamily: FONT_ROBOTO_BOLD }}
                >
                    <Edit2 size={14} strokeWidth={2} /> Edit
                </button>
                <button 
                    onClick={handleDeleteClick}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl border border-gray-100 hover:border-red-100"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default BannerCard;
