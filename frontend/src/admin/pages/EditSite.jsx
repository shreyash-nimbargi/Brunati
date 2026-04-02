import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, Edit2, Trash2, Save, Plus, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { useStorefront } from '../../context/StorefrontContext';
import BannerCard from '../components/banners/BannerCard';
import AddBannerModal from '../components/banners/AddBannerModal';
import { bannerService } from '../../services/bannerService';
import { reviewService } from '../../services/reviewService';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { toast } from 'react-hot-toast';
import OlfactoryTrends from '../components/trends/OlfactoryTrends';
import Reviews from '../components/reviews/Reviews';
import FamousPeople from '../components/influencers/FamousPeople';
import { famousPeopleService } from '../../services/famousPeopleService';

const EditSite = () => {
    const FONT_ROBOTO_BOLD = '"Roboto", sans-serif';
    const FONT_ROBOTO_REGULAR = '"Roboto", sans-serif';
    const navigate = useNavigate();
    const { scentArt, setScentArt, reviews, setReviews, influencers, setInfluencers, setTopPhotos, inventoryProducts, setInventoryProducts } = useStorefront();

    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'banners';
    
    const setActiveTab = (tab) => {
        setSearchParams({ tab });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    // Banners State
    const [banners, setBanners] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        fetchBanners();
        fetchProducts();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await productService.getAllProducts();
            if (res.status && res.data) {
                const products = res.data.luxury_collection || res.data.luxury || (Array.isArray(res.data) ? res.data : []);
                setInventoryProducts(products);
            }
        } catch (err) {
            console.error('Products fetch error:', err);
        }
    };

    const fetchBanners = async () => {
        setIsLoading(true);
        try {
            const res = await bannerService.getAllBanners();
            if (res.status) {
                setBanners(res.data || []);
                if (res.data && res.data.length > 0) {
                    setTopPhotos(res.data); // Sync with context for storefront
                }
            }
        } catch (err) {
            console.error('Banners fetch error:', err);
            setBanners([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveBanner = async (formData, id) => {
        try {
            let res;
            if (id) {
                res = await bannerService.updateBanner(id, formData);
                toast.success('Banner updated');
            } else {
                res = await bannerService.createBanner(formData);
                toast.success('Banner published');
            }
            if (res.status) {
                setIsModalOpen(false);
                setEditingBanner(null);
                fetchBanners();
            }
        } catch (err) {
            toast.error(err.message || 'Error saving banner');
        }
    };

    const handleDeleteBanner = async (id) => {
        try {
            const res = await bannerService.deleteBanner(id);
            if (res.status) {
                fetchBanners();
            }
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const tabs = [
        { id: 'banners', label: 'Banners' },
        { id: 'trends', label: 'Olfactory Trends' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'influencers', label: 'Famous People' }
    ];

    const cardStyle = {
        background: '#fff',
        borderRadius: '12px',
        padding: isMobile ? '20px' : '32px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        width: '100%',
        margin: '0'
    };

    const sectionHeaderStyle = {
        fontFamily: FONT_ROBOTO_BOLD,
        fontWeight: 700,
        fontSize: '1.25rem',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '16px' : '0',
        textTransform: 'none'
    };

    const renderSection = (id) => {
        switch(id) {
            case 'banners':
                return (
                    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className={`flex ${isMobile ? 'flex-col items-center text-center' : 'flex-row items-center justify-between'} mb-10`}>
                            <div className={isMobile ? 'mb-6' : ''}>
                                <h2 style={{ 
                                    fontFamily: FONT_ROBOTO_BOLD, 
                                    fontWeight: 700, 
                                    fontSize: isMobile ? '1.5rem' : '1.85rem',
                                    margin: 0,
                                    textTransform: 'none'
                                }}>
                                    Banners
                                </h2>
                                <p className="text-gray-500 mt-2 font-roboto font-normal text-sm">Manage your homepage hero slides and visual collections.</p>
                            </div>
                            <button 
                                onClick={() => { setEditingBanner(null); setIsModalOpen(true); }}
                                className={`
                                    bg-black text-white hover:bg-gray-800 transition-all rounded-xl font-bold flex items-center justify-center gap-2
                                    ${isMobile ? 'w-fit px-10 py-3.5 text-sm' : 'w-fit py-2.5 px-6 text-sm'}
                                `}
                                style={{ fontFamily: FONT_ROBOTO_BOLD }}
                            >
                                <Plus size={18} /> <span style={{ fontFamily: FONT_ROBOTO_BOLD }}>Add Photo</span>
                            </button>
                        </div>
                        
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                                <Loader2 className="animate-spin" size={32} />
                                <span className="text-sm font-medium">Synchronizing banners...</span>
                            </div>
                        ) : banners.length === 0 ? (
                            <div className="py-24 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                    <Camera size={24} className="text-gray-300" />
                                </div>
                                <h3 className="font-bold text-black" style={{ fontFamily: FONT_ROBOTO_BOLD }}>NO ACTIVE BANNERS</h3>
                                <p className="text-sm text-gray-500 mt-1">Add your first banner to see it on the storefront</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto">
                                {(banners || []).map(b => (
                                    <BannerCard 
                                        key={b._id || b.id} 
                                        banner={b} 
                                        onEdit={(bm) => { setEditingBanner(bm); setIsModalOpen(true); }}
                                        onDelete={handleDeleteBanner}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'trends':
                return <OlfactoryTrends isMobile={isMobile} />;
            case 'reviews':
                return <Reviews isMobile={isMobile} />;
            case 'influencers':
                return <FamousPeople isMobile={isMobile} />;
            default: return null;
        }
    };

    const getTabLabel = (tab) => {
        if (!isMobile) return tab.label;
        switch(tab.id) {
            case 'influencers': return 'People';
            case 'trends': return 'Trends';
            default: return tab.label;
        }
    };

    const handleTabChange = (id) => {
        setActiveTab(id);
        // Scroll to the top of the container for a fresh start
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full max-w-full overflow-x-hidden" style={{ paddingBottom: '100px', animation: 'fadeIn 0.4s ease-out' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
 
            <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'} w-full mb-8 mt-6`}>
                <div className="hidden md:flex mb-4">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="text-gray-400 hover:text-black transition-colors font-roboto font-normal text-sm flex items-center gap-1 group"
                    >
                        <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span> Back to Dashboard
                    </button>
                </div>
                <h1 style={{ 
                    fontFamily: FONT_ROBOTO_BOLD, 
                    fontWeight: 700, 
                    fontSize: isMobile ? '1.5rem' : '2rem', 
                    margin: 0,
                    textTransform: 'none'
                }}>
                    Edit Site
                </h1>
            </div>
 
            {/* Sticky Horizontal Navigation Ribbon - LUXURY PILL SCROLLER (Step 65) */}
            <div className={`
                ${isMobile 
                    ? 'sticky top-[64px] z-40 bg-white border-b border-gray-100 py-4 mb-6 overflow-hidden relative' 
                    : 'flex border-b border-gray-100 mb-10 gap-8 max-w-7xl mx-auto px-8'}
            `}>
                {isMobile ? (
                    <>
                        {/* Scroll Container */}
                        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide snap-x px-4 gap-3">
                            {tabs.map(t => {
                                const isActive = activeTab === t.id;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => handleTabChange(t.id)}
                                        className={`
                                            snap-center px-6 py-2 rounded-full transition-all duration-300 text-[13px] border
                                            ${isActive 
                                                ? 'bg-black text-white border-black shadow-md font-bold' 
                                                : 'bg-transparent text-gray-400 border-gray-100 font-normal'}
                                        `}
                                        style={{ 
                                            fontFamily: isActive ? FONT_ROBOTO_BOLD : '"Roboto", sans-serif',
                                        }}
                                    >
                                        {getTabLabel(t)}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Right Fade Mask */}
                        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
                    </>
                ) : (
                    tabs.map(t => {
                        const isActive = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => handleTabChange(t.id)}
                                className="relative py-4 px-4 transition-all duration-300 text-sm"
                                style={{
                                    border: 'none', background: 'none', cursor: 'pointer',
                                    fontFamily: isActive ? FONT_ROBOTO_BOLD : '"Roboto", sans-serif',
                                    fontWeight: isActive ? 700 : 400,
                                    color: isActive ? '#000' : '#888',
                                }}
                            >
                                {t.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
                                )}
                            </button>
                        );
                    })
                )}
            </div>
 
            <div className={`mt-4 ${isMobile ? 'px-4' : 'px-8 max-w-7xl mx-auto'}`}>
                {renderSection(activeTab)}
            </div>

            <AddBannerModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingBanner(null); }}
                onSave={handleSaveBanner}
                editingBanner={editingBanner}
            />
        </div>
    );
};

export default EditSite;
