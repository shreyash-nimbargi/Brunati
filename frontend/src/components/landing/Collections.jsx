import React, { useState } from 'react';
import ProductCard from '../product/ProductCard';
import { productsData } from '../../data/products';

const Collections = () => {
    const [activeTab, setActiveTab] = useState('him');
    const [sliderIndex, setSliderIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('100ml');

    const collectionsRows = {
        him: ['dominus', 'aqua', 'dusk'],
        her: ['mistia', 'midnight'],
        gift: ['gift1']
    };

    const currentTabProducts = collectionsRows[activeTab];

    // Reset slider index when tab changes
    React.useEffect(() => {
        setSliderIndex(0);
    }, [activeTab]);

    const getProductInfo = (id) => {
        const p = productsData[id];
        return {
            id,
            name: p.name,
            meta: p.badge,
            price: `₹ ${p.price}.00`,
            img1: p.images[0],
            img2: p.images[1] || p.images[0],
            accords: p.accords,
            description: p.description,
            topNotes: p.topNotes,
            middleNotes: p.middleNotes,
            baseNotes: p.baseNotes,
            gender: p.badge.split(' • ')[0]
        };
    };

    const nextSlide = () => {
        setSliderIndex((prev) => (prev + 1) % currentTabProducts.length);
    };

    const prevSlide = () => {
        setSliderIndex((prev) => (prev - 1 + currentTabProducts.length) % currentTabProducts.length);
    };

    const currentProduct = getProductInfo(currentTabProducts[sliderIndex]);

    return (
        <section className="content-wrap">
            <div className="section-header">
                <h2 className="section-title">Luxury Collections</h2>
                <div className="tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'him' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('him')}
                    >
                        For Him
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'her' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('her')}
                    >
                        For Her
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'gift' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('gift')}
                    >
                        Gift Sets
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
                        <div className="slider-title-row">
                            <h2 className="slider-title">{currentProduct.name.toUpperCase()}</h2>
                            <span className="slider-divider">\</span>
                            <span className="slider-category">{currentProduct.gender.toUpperCase()}</span>
                            <div className="red-dot" style={{width: '10px', height: '10px', background: '#D22B2B', borderRadius: '50%', marginLeft: 'auto', marginRight: '20px'}}></div>
                        </div>

                        <div className="slider-rating">
                            <div className="stars">★★★★★</div>
                            <span className="review-text-link">16 reviews</span>
                        </div>

                        <p className="slider-description">
                            {currentProduct.description.toUpperCase()}
                        </p>

                        <div className="slider-notes-grid">
                            <div className="slider-note-item">
                                <h4>THE INTRODUCTION:</h4>
                                <p>{currentProduct.topNotes && currentProduct.topNotes.replace(/,\s*/g, '/')}</p>
                            </div>
                            <div className="slider-note-item">
                                <h4>THE DISCOVERY:</h4>
                                <p>{(currentProduct.middleNotes || "Floral Symphony").replace(/,\s*/g, '/')}</p>
                            </div>
                            <div className="slider-note-item">
                                <h4>THE IMPRESSION:</h4>
                                <p>{currentProduct.baseNotes.split(',').slice(0,2).join('/')}</p>
                            </div>
                        </div>

                        <div className="slider-size-row">
                            {['20ML', '30ML', '50ML', '100ML'].map(size => (
                                <button 
                                    key={size} 
                                    className={`slider-size-btn ${selectedSize.toLowerCase() === size.toLowerCase() ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <div className="slider-add-bar">
                            <span>ADD TO CART</span>
                            <span>{currentProduct.price}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Grid View */}
            <div className="category-view active mobile-only-grid">
                <div className="product-grid">
                    {currentTabProducts.map(id => (
                        <ProductCard key={id} {...getProductInfo(id)} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Collections;
