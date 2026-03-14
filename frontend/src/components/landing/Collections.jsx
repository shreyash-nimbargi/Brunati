import React, { useState } from 'react';
import ProductCard from '../product/ProductCard';
import { productsData } from '../../data/products';

const Collections = () => {
    const [activeTab, setActiveTab] = useState('him');

    const collectionsRows = {
        him: ['dominus', 'aqua', 'dusk'],
        her: ['mistia', 'midnight'],
        gift: ['gift1']
    };

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
            topNotes: p.topNotes
        };
    };


    return (
        <section className="content-wrap">
            <div className="section-header">
                <h2 className="section-title">Luxury Collections</h2>
                <div className="tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'him' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('him')}
                    >
                        For him
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'her' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('her')}
                    >
                        For her
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'gift' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('gift')}
                    >
                        Gift sets
                    </button>
                </div>
            </div>

            <div className={`category-view active`}>
                <div className="product-grid">
                    {collectionsRows[activeTab].map(id => (
                        <ProductCard key={id} {...getProductInfo(id)} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Collections;
