import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Edit2, Trash2, Save, Plus, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { useStorefront } from '../../context/StorefrontContext';
import BannerCard from '../components/banners/BannerCard';
import AddBannerModal from '../components/banners/AddBannerModal';
import AddCategoryModal from '../components/categories/AddCategoryModal';
import ManageProductsModal from '../components/categories/ManageProductsModal';
import { bannerService } from '../../services/bannerService';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { toast } from 'react-hot-toast';
import OlfactoryTrends from '../components/trends/OlfactoryTrends';

const EditSite = () => {
    const FONT_ROBOTO_BOLD = '"Roboto", sans-serif';
    const FONT_ROBOTO_REGULAR = '"Roboto", sans-serif';
    const navigate = useNavigate();
    const { scentArt, setScentArt, reviews, setReviews, influencers, setInfluencers, setTopPhotos, categories: siteCategories, setCategories, inventoryProducts, setInventoryProducts } = useStorefront();

    const [activeTab, setActiveTab] = useState('banners');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    // Banners State
    const [banners, setBanners] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Categories State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isManageProductsModalOpen, setIsManageProductsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        fetchBanners();
        fetchCategories();
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

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAllCategories();
            if (res.status && res.data) {
                const names = res.data.map(c => c.name);
                setCategories(names.length > 0 ? names : ['Men', 'Women', 'Unisex']);
            }
        } catch (err) {
            console.error('Categories fetch error:', err);
        }
    };

    const handleSaveCategory = async (name, id) => {
        try {
            if (id) {
                await categoryService.updateCategory(id, { name });
                toast.success('Category updated');
            } else {
                await categoryService.createCategory({ name });
                toast.success('Category added');
            }
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (err) {
            toast.error('Save failed');
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
        { id: 'categories', label: 'Categories' },
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
        maxWidth: '1200px',
        margin: '0 auto'
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
                    <div className="max-w-[1200px] mx-auto w-full px-0 md:px-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center justify-between'} mb-8`}>
                            <h2 style={{ 
                                fontFamily: FONT_ROBOTO_BOLD, 
                                fontWeight: 700, 
                                fontSize: isMobile ? '1.75rem' : '1.5rem',
                                margin: 0
                            }}>
                                Banners
                            </h2>
                            <button 
                                onClick={() => { setEditingBanner(null); setIsModalOpen(true); }}
                                className={`
                                    bg-black text-white hover:bg-gray-800 transition-all rounded-xl font-bold flex items-center justify-center gap-2
                                    ${isMobile ? 'w-full py-4 text-base mt-4' : 'w-fit py-2 px-5 text-sm'}
                                `}
                                style={{ fontFamily: FONT_ROBOTO_BOLD }}
                            >
                                <Plus size={18} /> Add Photo
                            </button>
                        </div>
                        
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                                <Loader2 className="animate-spin" size={32} />
                                <span className="text-sm font-medium">Synchronizing banners...</span>
                            </div>
                        ) : banners.length === 0 ? (
                            <div className="py-32 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                    <Camera size={24} className="text-gray-300" />
                                </div>
                                <h3 className="font-bold text-black" style={{ fontFamily: FONT_ROBOTO_BOLD }}>No Active Banners</h3>
                                <p className="text-sm text-gray-500 mt-1">Add your first banner to see it on the storefront</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {banners.map(b => (
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
            case 'categories':
                const getProductCount = (catName) => {
                    const name = typeof catName === 'string' ? catName : catName.name;
                    return inventoryProducts.filter(p => p.category?.toLowerCase() === name.toLowerCase()).length;
                };

                const handleDeleteCategory = (catId, catName) => {
                    const count = getProductCount(catName);
                    if (count > 0) {
                        toast.error(`Cannot delete category "${catName}" because it contains ${count} product(s). Remove products first.`, { duration: 4000 });
                        return;
                    }

                    let shouldDelete = true;
                    toast((t) => (
                        <div className="flex items-center gap-4">
                            <span style={{ fontFamily: '"Roboto", sans-serif' }}>Category "{catName}" deleted</span>
                            <button 
                                onClick={() => {
                                    shouldDelete = false;
                                    toast.dismiss(t.id);
                                    toast.success('Restored', { duration: 2000 });
                                }}
                                className="bg-white text-black px-3 py-1 rounded text-xs font-bold border border-black hover:bg-black hover:text-white transition-colors"
                            >
                                Undo
                            </button>
                        </div>
                    ), { 
                        duration: 6000,
                        position: 'bottom-center',
                        style: { background: '#000', color: '#fff', padding: '12px 20px', borderRadius: '12px' }
                    });

                    setTimeout(async () => {
                        if (shouldDelete) {
                            try {
                                await categoryService.deleteCategory(catId);
                                fetchCategories();
                                toast.success('Category removed');
                            } catch (err) {
                                toast.error('Delete failed');
                            }
                        }
                    }, 6000);
                };

                return (
                    <div className="max-w-[1200px] mx-auto w-full px-0 md:px-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center justify-between'} mb-10`}>
                            <div>
                                <h2 style={{ 
                                    fontFamily: FONT_ROBOTO_BOLD, 
                                    fontWeight: 700, 
                                    fontSize: isMobile ? '1.75rem' : '1.85rem',
                                    margin: 0
                                }}>
                                    Categories
                                </h2>
                                <p className="text-gray-500 mt-2 font-roboto font-normal">Manage your luxury collections and product assignments.</p>
                            </div>
                            <button 
                                onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                                className={`
                                    bg-black text-white hover:bg-gray-800 transition-all rounded-xl font-bold flex items-center justify-center gap-2
                                    ${isMobile ? 'w-full py-4 text-base mt-4' : 'w-fit py-2.5 px-6 text-sm'}
                                `}
                                style={{ fontFamily: FONT_ROBOTO_BOLD }}
                            >
                                <Plus size={18} /> Add Category
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {siteCategories.map((cat, idx) => {
                                const catName = typeof cat === 'string' ? cat : cat.name;
                                const count = getProductCount(catName);
                                
                                return (
                                    <div key={cat._id || idx} className="bg-white p-8 rounded-[20px] border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-black/[0.03] transition-all duration-300 flex flex-col h-full group relative">
                                        <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button 
                                                onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }}
                                                className="w-9 h-9 flex items-center justify-center border border-gray-100 text-gray-400 hover:text-black hover:border-black rounded-full transition-all duration-200 bg-white"
                                                title="Rename Category"
                                            >
                                                <Edit2 size={12} strokeWidth={1.2} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteCategory(cat._id || cat, catName)}
                                                className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                                                title="Delete"
                                            >
                                                <Trash2 size={13} strokeWidth={1.2} />
                                            </button>
                                        </div>

                                        <div className="mb-0">
                                            <h3 className="text-black text-[22px] font-bold leading-tight tracking-tight" style={{ fontFamily: '"Roboto", sans-serif' }}>
                                                {catName}
                                            </h3>
                                            <p className="text-sm text-gray-400 font-light mt-1.5" style={{ fontFamily: '"Roboto", sans-serif' }}>
                                                {count} {count === 1 ? 'item' : 'items'}
                                            </p>
                                        </div>

                                        <div className="mt-14">
                                            <button 
                                                onClick={() => { setEditingCategory(cat); setIsManageProductsModalOpen(true); }}
                                                className="inline-flex items-center gap-3 text-[11px] font-bold text-black hover:text-gray-600 transition-all duration-300 border-b border-black/20 hover:border-black pb-1 tracking-[0.05em]"
                                                style={{ fontFamily: FONT_ROBOTO_BOLD }}
                                            >
                                                Assign Products 
                                                <ArrowRight size={11} strokeWidth={1.2} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'trends':
                return <OlfactoryTrends isMobile={isMobile} />;
            case 'reviews':
                return (
                    <div style={cardStyle} className="font-roboto">
                        <div style={sectionHeaderStyle}>
                            <span className="font-bold text-black text-xl">Reviews</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {reviews.map(rev => (
                                <div key={rev.id} className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-[15px] mb-1">{rev.name}</h4>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-300 hover:text-black hover:bg-gray-50 rounded-full transition-all"><Edit2 size={14} strokeWidth={1.5} /></button>
                                            <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={14} strokeWidth={1.5} /></button>
                                        </div>
                                    </div>
                                    <p className="text-[14px] text-gray-500 font-normal leading-relaxed italic" style={{ fontFamily: FONT_ROBOTO_REGULAR }}>
                                        "{rev.text}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'influencers':
                return (
                    <div style={cardStyle} className="font-roboto text-normal">
                        <div style={sectionHeaderStyle}>
                            <span className="font-bold text-black text-xl">Famous People</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {influencers.map(inf => (
                                <div key={inf.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full mb-4 flex items-center justify-center text-gray-300 border border-gray-50">
                                        <Plus size={24} strokeWidth={1} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-[15px] mb-1">{inf.name}</h4>
                                    <p className="text-[12px] text-gray-500 font-light mb-6">{inf.role}</p>
                                    <button className="w-full py-2.5 text-[11px] font-bold text-red-500 border border-red-100 hover:bg-red-50 rounded-lg transition-all">Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    const getTabLabel = (tab) => {
        if (!isMobile) return tab.label;
        switch(tab.id) {
            case 'scent': return 'AOS';
            case 'influencers': return 'People';
            case 'categories': return 'Cats';
            default: return tab.label;
        }
    };

    const handleTabChange = (id) => {
        setActiveTab(id);
        // Scroll to the top of the container for a fresh start
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ paddingBottom: '100px', animation: 'fadeIn 0.4s ease-out' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
 
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '16px' : '32px', maxWidth: '1200px', margin: '0 auto 32px' }}>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="text-gray-500 hover:text-black transition-colors font-roboto text-sm flex items-center gap-1"
                    >
                        ← Back
                    </button>
                    <h1 style={{ fontFamily: FONT_ROBOTO_BOLD, fontWeight: 700, fontSize: isMobile ? '1.5rem' : '1.75rem', margin: 0 }}>Edit Site</h1>
                </div>
            </div>
 
            {/* Sticky Horizontal Navigation Ribbon */}
            <div className={`
                ${isMobile ? 'sticky top-[64px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 flex overflow-x-auto whitespace-nowrap scrollbar-hide snap-x px-4' : 'flex border-b border-gray-100 mb-8 gap-8 max-w-[1200px] mx-auto'}
            `}>
                {tabs.map(t => {
                    const isActive = activeTab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => handleTabChange(t.id)}
                            className={`
                                relative py-4 px-4 transition-all duration-300 snap-center
                                ${isMobile ? 'text-[13px]' : 'text-sm'}
                            `}
                            style={{
                                border: 'none', background: 'none', cursor: 'pointer',
                                fontFamily: isActive ? FONT_ROBOTO_BOLD : '"Roboto", sans-serif',
                                fontWeight: isActive ? 700 : 400,
                                color: isActive ? '#000' : '#888',
                            }}
                        >
                            {getTabLabel(t)}
                            {/* Active Tab Indicator */}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
                            )}
                        </button>
                    );
                })}
            </div>
 
            <div className={`mt-8 ${isMobile ? 'px-4' : ''}`}>
                {renderSection(activeTab)}
            </div>

            <AddBannerModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingBanner(null); }}
                onSave={handleSaveBanner}
                editingBanner={editingBanner}
            />

            {/* Add/Edit Category Modal */}
            <AddCategoryModal 
                isOpen={isCategoryModalOpen}
                onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
                onSave={handleSaveCategory}
                editingCategory={editingCategory}
            />
            {/* Manage Category Products Modal */}
            <ManageProductsModal
                isOpen={isManageProductsModalOpen}
                onClose={() => { setIsManageProductsModalOpen(false); setEditingCategory(null); }}
                category={editingCategory}
                allProducts={inventoryProducts}
                onUpdateComplete={fetchProducts}
            />
        </div>
    );
};

export default EditSite;
