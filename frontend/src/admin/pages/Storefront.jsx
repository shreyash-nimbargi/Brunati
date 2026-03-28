import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, Layers, Users as UsersIcon, MessageSquare, Star, Layout, Camera, Store, Edit2 } from 'lucide-react';
import { useStorefront } from '../../context/StorefrontContext';
import ProductSelectorModal from '../components/ProductSelectorModal';
import toast, { Toaster } from 'react-hot-toast';

/**
 * Storefront Module - High-density, premium management interface.
 * Strictly adheres to Roboto font system and square-button aesthetic.
 */
const Storefront = () => {
    const FONT_ROBOTO_BOLD = '"Roboto", sans-serif';
    const FONT_ROBOTO = '"Roboto", sans-serif';

    const [activeTab, setActiveTab] = useState('photos');
    const [selectorModalOpen, setSelectorModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [editingScentArt, setEditingScentArt] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { 
        topPhotos, setTopPhotos,
        collections, setCollections,
        scentArt, setScentArt,
        reviews, setReviews,
        influencers, setInfluencers
    } = useStorefront();

    // --- REUSABLE STYLES ---
    const btnStyle = {
        padding: '10px 20px', 
        borderRadius: '0', 
        border: '1px solid #111', 
        cursor: 'pointer',
        fontFamily: FONT_ROBOTO_BOLD, 
        fontSize: '0.82rem', 
        fontWeight: 700, 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px',
        backgroundColor: '#111', 
        color: '#fff',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        textTransform: 'none',
        letterSpacing: '0.02em'
    };

    const btnOutlineStyle = { 
        ...btnStyle, 
        backgroundColor: 'transparent', 
        color: '#111' 
    };

    const inputStyle = {
        width: '100%', 
        padding: '12px 14px', 
        border: '1px solid #E5E7EB', 
        borderRadius: '0',
        fontFamily: FONT_ROBOTO, 
        fontSize: '0.92rem', 
        marginBottom: '16px', 
        outline: 'none',
        boxSizing: 'border-box'
    };

    const labelStyle = { 
        display: 'block', 
        fontSize: '0.75rem', 
        fontWeight: 700, 
        marginBottom: '8px', 
        color: '#6e6e73', 
        fontFamily: FONT_ROBOTO_BOLD,
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
    };
    
    const [editingItem, setEditingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const triggerUndoToast = (message, stateSetter, previousState) => {
        toast((t) => (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontFamily: FONT_ROBOTO, fontSize: '13px', color: '#fff' }}>{message}</span>
                    <button 
                        onClick={() => {
                            stateSetter(previousState);
                            toast.dismiss(t.id);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT_ROBOTO_BOLD, fontWeight: 'bold', color: '#fff', textTransform: 'none', padding: '0 0 0 16px', textDecoration: 'underline', fontSize: '13px' }}
                    >
                        Undo
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
            style: { background: '#000000', color: '#fff', padding: '12px 16px', borderRadius: '4px', minWidth: '300px', fontFamily: FONT_ROBOTO, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }
        });
    };

    const tabs = [
        { id: 'photos', label: 'Banners', icon: Camera },
        { id: 'collections', label: 'Categories', icon: Layers },
        { id: 'scent', label: isMobile ? 'AOS' : 'Art of Scent', icon: ImageIcon },
        { id: 'reviews', label: 'Reviews', icon: MessageSquare },
        { id: 'influencers', label: isMobile ? 'Customers' : 'Customers', icon: UsersIcon }
    ];

    const renderTabs = () => (
        <div style={{ 
            display: 'flex', 
            gap: isMobile ? '12px' : '32px', 
            marginBottom: '40px', 
            borderBottom: '1px solid #EEEEEE',
            overflowX: 'auto',
            width: '100%',
            WebkitOverflowScrolling: 'touch'
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                        padding: '16px 4px',
                        fontFamily: FONT_ROBOTO_BOLD,
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        fontWeight: activeTab === tab.id ? 700 : 400,
                        color: activeTab === tab.id ? '#111' : '#888',
                        borderBottom: activeTab === tab.id ? '2px solid #111' : '2px solid transparent',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                        marginBottom: '-1px'
                    }}
                >
                    <tab.icon size={isMobile ? 16 : 18} />
                    {tab.label}
                </button>
            ))}
        </div>
    );

    // --- MANAGERS ---

    const handleSaveHero = (e) => {
        e.preventDefault();
        const previousState = [...(topPhotos || [])];
        const formData = new FormData(e.target);
        const newItem = {
            id: editingItem?.id || Date.now(),
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            image: formData.get('image') || ''
        };
        if (editingItem) setTopPhotos((topPhotos || []).map(s => s.id === editingItem.id ? newItem : s));
        else setTopPhotos([...(topPhotos || []), newItem]);
        triggerUndoToast('Banner saved.', setTopPhotos, previousState);
        closeModal();
    };

    const renderHeroManager = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontFamily: FONT_ROBOTO_BOLD, fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Banners</h2>
                <button style={btnStyle} onClick={() => openModal()}>
                    <Plus size={16} /> Add Photo
                </button>
            </div>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', 
                gap: '32px' 
            }}>
                {topPhotos?.map(slide => (
                    <div key={slide.id} style={{ background: '#fff', border: '1px solid #EEEEEE', padding: '24px' }}>
                        <div style={{ 
                            width: '100%', 
                            aspectRatio: '16/9', 
                            background: '#F9F9F9', 
                            marginBottom: '20px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            overflow: 'hidden' 
                        }}>
                            {slide.image ? (
                                <img src={slide.image.startsWith('/') ? slide.image : '/' + slide.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            ) : (
                                <ImageIcon color="#CCC" size={48} />
                            )}
                        </div>
                        <h3 style={{ fontFamily: FONT_ROBOTO_BOLD, fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0', textTransform: 'none' }}>{slide.title}</h3>
                        <p style={{ fontFamily: FONT_ROBOTO, fontSize: '0.85rem', color: '#666', margin: '0 0 20px 0' }}>{slide.subtitle}</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center', padding: '10px' }} onClick={() => openModal(slide)}>Edit</button>
                            <button style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center', padding: '10px', color: '#DC2626', borderColor: '#DC2626' }} onClick={() => {
                                const prev = [...topPhotos];
                                setTopPhotos(topPhotos.filter(s => s.id !== slide.id));
                                triggerUndoToast('Banner removed.', setTopPhotos, prev);
                            }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '480px', padding: '32px', position: 'relative' }}>
                        <X size={20} style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer' }} onClick={closeModal} />
                        <h3 style={{ fontFamily: FONT_ROBOTO_BOLD, margin: '0 0 24px 0', fontWeight: 700, fontSize: '1.1rem' }}>{editingItem ? 'Edit Banner' : 'New Banner'}</h3>
                        <form onSubmit={handleSaveHero}>
                            <label style={labelStyle}>Headline</label>
                            <input name="title" style={inputStyle} defaultValue={editingItem?.title || ''} required />
                            <label style={labelStyle}>Supporting Text</label>
                            <input name="subtitle" style={inputStyle} defaultValue={editingItem?.subtitle || ''} required />
                            <label style={labelStyle}>Image URL</label>
                            <input name="image" style={inputStyle} defaultValue={editingItem?.image || ''} placeholder="/media/banners/..." />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button type="button" style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center' }} onClick={closeModal}>Cancel</button>
                                <button type="submit" style={{ ...btnStyle, flex: 1, justifyContent: 'center', background: '#000', borderColor: '#000' }}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const renderCollectionsManager = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: FONT_ROBOTO_BOLD, fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Categories</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
                {Object.keys(collections).map(cat => (
                    <div key={cat} style={{ background: '#fff', border: '1px solid #EEEEEE', padding: '24px' }}>
                        <h3 style={{ fontFamily: FONT_ROBOTO_BOLD, fontWeight: 700, fontSize: '1rem', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #F5F5F5' }}>
                            {cat === 'him' ? 'Men' : cat === 'her' ? 'Women' : 'Unisex'} Collections
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                            {collections[cat].map(id => (
                                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#F9F9F9', alignItems: 'center' }}>
                                    <span style={{ fontFamily: FONT_ROBOTO, fontSize: '0.85rem', fontWeight: 500, color: '#111' }}>{id.toUpperCase()}</span>
                                    <button 
                                        style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: FONT_ROBOTO_BOLD }}
                                        onClick={() => {
                                            const prev = { ...collections };
                                            setCollections({ ...collections, [cat]: collections[cat].filter(itemId => itemId !== id) });
                                            triggerUndoToast('Item removed.', setCollections, prev);
                                        }}
                                    >REMOVE</button>
                                </div>
                            ))}
                            {collections[cat].length === 0 && <p style={{ fontSize: '0.85rem', color: '#888', textAlign: 'center', padding: '20px 0' }}>No products selected.</p>}
                        </div>
                        <button 
                            style={{ ...btnOutlineStyle, width: '100%', justifyContent: 'center' }}
                            onClick={() => { setEditingCollection(cat); setSelectorModalOpen(true); }}
                        >
                            <Plus size={16} /> Manage Items
                        </button>
                    </div>
                ))}
            </div>
            <ProductSelectorModal 
                isOpen={selectorModalOpen} 
                onClose={() => setSelectorModalOpen(false)} 
                initialSelectedIds={editingCollection ? collections[editingCollection] : []} 
                onSave={(newIds) => {
                    const prev = { ...collections };
                    setCollections({ ...collections, [editingCollection]: newIds });
                    setSelectorModalOpen(false);
                    setEditingCollection(null);
                    triggerUndoToast('Collection updated.', setCollections, prev);
                }}
            />
        </div>
    );

    const renderScentManager = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontFamily: FONT_ROBOTO_BOLD, fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Art of Scent</h2>
                <button style={btnStyle} onClick={() => setEditingScentArt(true)}>
                    <Plus size={16} /> Add Photo
                </button>
            </div>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '24px' 
            }}>
                {scentArt.map(img => (
                    <div key={img.id} style={{ position: 'relative', background: '#fff', border: '1px solid #EEEEEE', padding: '12px' }}>
                        <div style={{ width: '100%', aspectRatio: '1/1', background: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            <img src={img.url.startsWith('/') ? img.url : '/' + img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        </div>
                        <button 
                            style={{ position: 'absolute', top: 20, right: 20, background: '#fff', border: '1px solid #EEE', padding: '6px', color: '#DC2626', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                            onClick={() => {
                                const prev = [...scentArt];
                                setScentArt(scentArt.filter(a => a.id !== img.id));
                                triggerUndoToast('Photo removed.', setScentArt, prev);
                            }}
                        ><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
            {editingScentArt && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }}>
                        <X size={20} style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer' }} onClick={() => setEditingScentArt(false)} />
                        <h3 style={{ fontFamily: FONT_ROBOTO_BOLD, margin: '0 0 24px 0', fontWeight: 700, fontSize: '1.1rem' }}>Upload Photo</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const prev = [...scentArt];
                            const formData = new FormData(e.target);
                            setScentArt([...scentArt, { id: Date.now(), url: formData.get('url') }]);
                            setEditingScentArt(false);
                            triggerUndoToast('Gallery updated.', setScentArt, prev);
                        }}>
                            <label style={labelStyle}>Image Path</label>
                            <input name="url" style={inputStyle} required placeholder="/media/..." />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button type="button" style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center' }} onClick={() => setEditingScentArt(false)}>Cancel</button>
                                <button type="submit" style={{ ...btnStyle, flex: 1, justifyContent: 'center', background: '#000' }}>Add to AOS</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const renderReviewsManager = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontFamily: FONT_ROBOTO_BOLD, fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Reviews</h2>
                <button style={btnStyle} onClick={() => openModal()}>
                    <Plus size={16} /> Add Review
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews?.map(r => (
                    <div key={r.id} style={{ background: '#fff', border: '1px solid #EEEEEE', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontFamily: FONT_ROBOTO_BOLD, fontWeight: 700, fontSize: '1rem' }}>{r.name}</span>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? '#FFB800' : 'none'} stroke={i < r.rating ? '#FFB800' : '#CCC'} />)}
                                </div>
                            </div>
                            <p style={{ fontFamily: FONT_ROBOTO, fontSize: '0.92rem', color: '#111', fontStyle: 'italic', margin: 0 }}>"{r.text}"</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
                            <button style={{ ...btnOutlineStyle, padding: '8px 16px', flex: isMobile ? 1 : 0 }} onClick={() => openModal(r)}>Edit</button>
                            <button style={{ ...btnOutlineStyle, padding: '8px 16px', color: '#DC2626', borderColor: '#DC2626', flex: isMobile ? 1 : 0 }} onClick={() => {
                                const prev = [...reviews];
                                setReviews(reviews.filter(s => s.id !== r.id));
                                triggerUndoToast('Review removed.', setReviews, prev);
                            }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                 <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '480px', padding: '32px', position: 'relative' }}>
                        <X size={20} style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer' }} onClick={closeModal} />
                        <h3 style={{ fontFamily: FONT_ROBOTO_BOLD, margin: '0 0 24px 0', fontWeight: 700, fontSize: '1.1rem' }}>{editingItem ? 'Edit Review' : 'New Review'}</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const prev = [...reviews];
                            const formData = new FormData(e.target);
                            const newItem = { id: editingItem?.id || Date.now(), name: formData.get('name'), text: formData.get('text'), rating: parseInt(formData.get('rating')) };
                            if (editingItem) setReviews(reviews.map(s => s.id === editingItem.id ? newItem : s));
                            else setReviews([...reviews, newItem]);
                            triggerUndoToast('Review saved.', setReviews, prev);
                            closeModal();
                        }}>
                            <label style={labelStyle}>Customer Name</label>
                            <input name="name" style={inputStyle} defaultValue={editingItem?.name || ''} required />
                            <label style={labelStyle}>Review Text</label>
                            <textarea name="text" style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} defaultValue={editingItem?.text || ''} required />
                            <label style={labelStyle}>Rating (1-5)</label>
                            <input type="number" name="rating" min="1" max="5" style={inputStyle} defaultValue={editingItem?.rating || 5} required />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button type="button" style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center' }} onClick={closeModal}>Cancel</button>
                                <button type="submit" style={{ ...btnStyle, flex: 1, justifyContent: 'center', background: '#000' }}>Save Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const renderInfluencersManager = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontFamily: FONT_ROBOTO_BOLD, fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Customers</h2>
                <button style={btnStyle} onClick={() => openModal()}>
                    <Plus size={16} /> Add Person
                </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                {influencers?.map(inf => (
                    <div key={inf.id} style={{ background: '#fff', border: '1px solid #EEEEEE', padding: '24px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: FONT_ROBOTO_BOLD, fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{inf.name}</h3>
                            <p style={{ fontFamily: FONT_ROBOTO, fontSize: '0.75rem', color: '#888', margin: '0 0 8px 0', fontWeight: 600 }}>{inf.role}</p>
                            <p style={{ fontFamily: FONT_ROBOTO, fontSize: '0.85rem', color: '#111', margin: 0, background: '#F5F5F5', padding: '8px 12px', borderLeft: '2px solid #111' }}>{inf.wearing}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center', padding: '8px' }} onClick={() => openModal(inf)}>Edit</button>
                            <button style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center', padding: '8px', color: '#DC2626', borderColor: '#DC2626' }} onClick={() => {
                                const prev = [...influencers];
                                setInfluencers(influencers.filter(x => x.id !== inf.id));
                                triggerUndoToast('Person removed.', setInfluencers, prev);
                            }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                 <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '440px', padding: '32px', position: 'relative' }}>
                        <X size={20} style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer' }} onClick={closeModal} />
                        <h3 style={{ fontFamily: FONT_ROBOTO_BOLD, margin: '0 0 24px 0', fontWeight: 700, fontSize: '1.1rem' }}>{editingItem ? 'Edit Person' : 'New Person'}</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const prev = [...influencers];
                            const formData = new FormData(e.target);
                            const newItem = { id: editingItem?.id || Date.now(), name: formData.get('name'), role: formData.get('role'), wearing: formData.get('wearing') };
                            if (editingItem) setInfluencers(influencers.map(s => s.id === editingItem.id ? newItem : s));
                            else setInfluencers([...influencers, newItem]);
                            triggerUndoToast('Success.', setInfluencers, prev);
                            closeModal();
                        }}>
                            <label style={labelStyle}>Full Name</label>
                            <input name="name" style={inputStyle} defaultValue={editingItem?.name || ''} required placeholder="e.g. KATRINA KAIF" />
                            <label style={labelStyle}>Description/Role</label>
                            <input name="role" style={inputStyle} defaultValue={editingItem?.role || ''} required placeholder="e.g. INDIAN ACTRESS" />
                            <label style={labelStyle}>Wearing Highlight</label>
                            <input name="wearing" style={inputStyle} defaultValue={editingItem?.wearing || ''} required placeholder="e.g. WEARING: ILLUMINATI" />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button type="button" style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center' }} onClick={closeModal}>Cancel</button>
                                <button type="submit" style={{ ...btnStyle, flex: 1, justifyContent: 'center', background: '#000' }}>Save Person</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div style={{ paddingBottom: '100px', width: '100%', minHeight: '100vh', background: '#FFFFFF' }}>
            <Toaster position="bottom-right" />
            
            <div style={{ marginBottom: '48px' }}>
                <h1 style={{ fontFamily: FONT_ROBOTO_BOLD, fontSize: '1.6rem', fontWeight: 700, margin: '0 0 8px 0', color: '#111', textTransform: 'none' }}>Edit Site</h1>
                <p style={{ fontFamily: FONT_ROBOTO, color: '#666', margin: 0, fontSize: '0.9rem', letterSpacing: '0.01em' }}>Manage the visual content and words for your storefront components.</p>
            </div>

            {renderTabs()}

            <div style={{ 
                animation: 'fadeIn 0.3s ease-out forwards',
                width: '100%',
                position: 'relative'
            }}>
                {activeTab === 'photos' && renderHeroManager()}
                {activeTab === 'collections' && renderCollectionsManager()}
                {activeTab === 'scent' && renderScentManager()}
                {activeTab === 'reviews' && renderReviewsManager()}
                {activeTab === 'influencers' && renderInfluencersManager()}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                * {
                    box-sizing: border-box;
                }
            `}</style>
        </div>
    );
};

export default Storefront;
