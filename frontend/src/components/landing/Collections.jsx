import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';

import { useStorefront } from '../../context/StorefrontContext';

const Collections = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { categories, setCategories, fetchCategories } = useStorefront();
    const [activeTab, setActiveTab] = useState('him');
    const [sliderIndex, setSliderIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('100ml');
    const [productsByTab, setProductsByTab] = useState({ him: [], her: [], gift: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dynamic labels from context
    const labelMen = categories?.[0] || 'Men';
    const labelWomen = categories?.[1] || 'Women';
    const labelUnisex = categories?.[2] || 'Unisex';

    useEffect(() => {
        const fetchAndCategorize = async () => {
            try {
                setLoading(true);
                const response = await productService.getAllProducts();
                if (response.status) {
                    console.log("[Collections] API Response Data:", response.data);
                    
                    let allProducts = response.data?.luxury_collection || response.data?.luxury || [];
                    
                    // If no explicit luxury collection key, filter from global product array using new backend keys
                    if (!allProducts || allProducts.length === 0) {
                        const rawData = Array.isArray(response.data) ? response.data : [];
                        allProducts = rawData.filter(p => p?.collectionType === 'luxury' || p?.isLuxury === true);
                        
                        // Fallback to basic categorizing if collectionType isn't found
                        if (allProducts.length === 0) {
                            allProducts = rawData;
                        }
                    }

                    const categorized = {
                        him: [],
                        her: [],
                        gift: []
                    };

                    allProducts?.forEach(p => {
                        const cat = p?.category?.toLowerCase() || '';
                        const type = p?.collectionType?.toLowerCase() || '';
                        
                        // Use collectionType if available, or fallback to category text matching
                        if (cat.includes('women') || type === 'her') {
                            categorized.her.push(p);
                        } else if (cat.includes('men') || type === 'him') {
                            categorized.him.push(p);
                        } else {
                            categorized.gift.push(p);
                        }
                    });
                    
                    // Final fallback to populated tabs if some are empty but data exists
                    if (allProducts?.length > 0) {
                        if (categorized.him.length === 0) categorized.him = allProducts.slice(0, 3);
                        if (categorized.her.length === 0) categorized.her = allProducts.slice(3, 5);
                    }


                    setProductsByTab(categorized);
                }
            } catch (err) {
                console.error('Collections fetch error:', err);
                setError('Failed to load collections.');
            } finally {
                setLoading(false);
            }
        };

        fetchAndCategorize();
    }, []);

    // Reset slider index when tab changes
    useEffect(() => {
        setSliderIndex(0);
    }, [activeTab]);

    if (loading) return null; // Or a subtle loader
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    const currentTabProducts = productsByTab[activeTab] || [];
    // if (currentTabProducts.length === 0) return null; // MOVED: Replaced with an inline message below to prevent page from looking blank

    const getProductInfo = (p) => {
        if (!p) return {};
        return {
            id: p?._id,
            slug: p?.slug,
            name: p?.name,
            meta: `${p?.category} • Extrait De Parfum`,
            price: `₹ ${p?.sizes?.[0]?.price || 0}.00`,
            img1: p?.images?.[0]?.startsWith('http') ? p?.images?.[0] : `/${p?.images?.[0]}`,
            img2: p?.images?.[1] ? (p?.images?.[1]?.startsWith('http') ? p?.images?.[1] : `/${p?.images?.[1]}`) : (p?.images?.[0]?.startsWith('http') ? p?.images?.[0] : `/${p?.images?.[0]}`),
            accords: p?.mainAccords,
            description: p?.description,
            topNotes: p?.perfumePyramid?.top?.join(', '),
            middleNotes: p?.perfumePyramid?.middle?.join(', '),
            baseNotes: p?.perfumePyramid?.base?.join(', '),
            gender: p?.category
        };
    };

    const nextSlide = () => {
        setSliderIndex((prev) => (prev + 1) % currentTabProducts.length);
    };

    const prevSlide = () => {
        setSliderIndex((prev) => (prev - 1 + currentTabProducts.length) % currentTabProducts.length);
    };

    const currentProduct = getProductInfo(currentTabProducts?.[sliderIndex]);


    if (!currentTabProducts || currentTabProducts.length === 0) {
        return (
            <section className="content-wrap">
                <div className="section-header">
                    <h2 className="section-title" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, textTransform: 'none' }}>Luxury Collections</h2>
                    <div className="tabs">
                        {['him', 'her', 'gift'].map(tab => (
                            <button 
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`} 
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'him' ? labelMen : tab === 'her' ? labelWomen : labelUnisex}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ padding: '100px 0', textAlign: 'center', color: '#6e6e73', fontSize: '1.1rem' }}>
                    Discover our {activeTab === 'gift' ? labelUnisex : activeTab === 'him' ? labelMen : labelWomen} collection soon.
                </div>
            </section>
        );
    }

    return (
        <section className="content-wrap">
            <div className="section-header">
                <h2 className="section-title" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, textTransform: 'none' }}>Luxury Collections</h2>
                <div className="tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'him' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('him')}
                    >
                        {labelMen}
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'her' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('her')}
                    >
                        {labelWomen}
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'gift' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('gift')}
                    >
                        {labelUnisex}
                    </button>
                </div>
            </div>

            {/* Desktop Slider View */}
            <div className="product-slider-desktop">
                <div className="slider-side-nav">
                    <button className="side-nav-btn" onClick={prevSlide}>
                        <svg width="20" height="34" viewBox="0 0 24 40" fill="none" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 2 2 20 20 38"></polyline></svg>
                    </button>
                    <button className="side-nav-btn" onClick={nextSlide}>
                        <svg width="20" height="34" viewBox="0 0 24 40" fill="none" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 2 22 20 4 38"></polyline></svg>
                    </button>
                </div>

                <div className="slider-main-container">
                    <div className="slider-img-wrap">
                        <img 
                            src={currentProduct.img1} 
                            alt={currentProduct.name} 
                            className="slider-img" 
                            key={currentProduct.id}
                        />
                    </div>

                    <div className="slider-info-col">
                        <div className="slider-title-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                            <h2 className="slider-title" style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 700, textTransform: 'none' }}>{currentProduct.name}</h2>
                            <span className="slider-divider" style={{ margin: '0 8px' }}>\</span>
                            <span className="slider-category">{currentProduct.gender}</span>
                            <div className="red-dot" style={{ width: '4px', height: '4px', background: '#D22B2B', borderRadius: '50%', marginLeft: '4px', alignSelf: 'baseline' }}></div>
                        </div>

                        <div className="slider-rating">
                            <div className="stars">★★★★★</div>
                            <span className="review-text-link">16 reviews</span>
                        </div>

                        <p className="slider-description">
                            {currentProduct.description}
                        </p>

                        <div className="slider-notes-grid">
                            <div className="slider-note-item">
                                <h4>Introduction:</h4>
                                <p>{currentProduct.topNotes && currentProduct.topNotes.replace(/,\s*/g, '/')}</p>
                            </div>
                            <div className="slider-note-item">
                                <h4>Discovery:</h4>
                                <p>{(currentProduct.middleNotes || "Floral Symphony").replace(/,\s*/g, '/')}</p>
                            </div>
                            <div className="slider-note-item">
                                <h4>Impression:</h4>
                                <p>{currentProduct.baseNotes.split(',').slice(0,2).join('/')}</p>
                            </div>
                        </div>

                        <div className="slider-size-row">
                            {['50ML', '100ML'].map(size => (
                                <button 
                                    key={size} 
                                    className={`slider-size-btn ${selectedSize.toLowerCase() === size.toLowerCase() ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <div 
                            className="slider-add-bar"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                addToCart({
                                    id: currentProduct.id,
                                    name: currentProduct.name,
                                    size: selectedSize,
                                    price: parseFloat(currentProduct.price.replace(/[^0-9.]/g, '')),
                                    quantity: 1,
                                    image: currentProduct.img1,
                                });
                                navigate('/cart');
                            }}
                        >
                            <span>Add to cart</span>
                            <span>{currentProduct.price}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Grid View */}
            <div className="category-view active mobile-only-grid">
                <div className="product-grid">
                    {currentTabProducts?.map(p => (
                        <ProductCard key={p?._id || Math.random()} {...getProductInfo(p)} />
                    ))}
                </div>
            </div>

        </section>
    );
};

export default Collections;
