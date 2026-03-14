import React, { useState } from 'react';
import ProductCard from '../product/ProductCard';

const Collections = () => {
    const [activeTab, setActiveTab] = useState('him');

    const products = {
        him: [
            { id: 'dominus', name: "Dominus Emperor", meta: "100ml • Extrait De Parfum", price: "₹ 1795.00", img1: "media/dominus/1.png", img2: "media/dominus/2.png" },
            { id: 'aqua', name: "Brunati Aqua", meta: "100ml • Extrait De Parfum", price: "₹ 1795.00", img1: "media/aqua/1.png", img2: "media/aqua/2.png" },
            { id: 'dusk', name: "Citrine Dusk", meta: "100ml • Extrait De Parfum", price: "₹ 1795.00", img1: "media/dusk/1.png", img2: "media/dusk/2.png" }
        ],
        her: [
            { id: 'mistia', name: "Mestia", meta: "100ml • Extrait De Parfum", price: "₹ 1795.00", img1: "media/mistia/1.png", img2: "media/mistia/2.png" },
            { id: 'midnight', name: "Midnight Glammer", meta: "100ml • Extrait De Parfum", price: "₹ 1795.00", img1: "media/midnight/1.png", img2: "media/midnight/2.png" }
        ],
        gift: [
            { id: 'gift1', name: "The Discovery Kit", meta: "5 x 10ml • Premium Set", price: "₹ 499.00", img1: "https://images.unsplash.com/photo-154939602-43ebca2327af?w=600", img2: "https://images.unsplash.com/photo-154939602-43ebca2327af?w=600" }
        ]
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

            <div className={`category-view active`}>
                <div className="product-grid">
                    {products[activeTab].map(product => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Collections;
