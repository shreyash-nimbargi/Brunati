import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsData } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = productsData[id] || productsData['dominus'];

    const [mainImg, setMainImg] = useState(product.images[0]);
    const [selectedSize, setSelectedSize] = useState('100ml');
    const [price, setPrice] = useState(product.price);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);

    const getImgSrc = (src) => src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

    const toggleAccordion = (idx) => {
        setActiveAccordion(activeAccordion === idx ? null : idx);
    };

    const handleProceed = () => {
        if (!selectedGift) {
            alert("Please select a free gift sample");
            return;
        }
        setIsGiftModalOpen(false);
        setIsCheckoutModalOpen(true);
    };

    return (
        <div className="product-page-wrapper">
            {/* Gift Modal */}
            {isGiftModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content">
                        <ion-icon name="close-outline" style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px', cursor: 'pointer' }} onClick={() => setIsGiftModalOpen(false)}></ion-icon>
                        <h2>Select Your Free Gift</h2>
                        <p style={{ color: '#6e6e73', marginBottom: '20px' }}>Choose 1 complimentary sample</p>
                        
                        <div className="sample-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.entries(productsData).filter(([key]) => key !== 'gift1').map(([key, p]) => (
                                <div 
                                    key={key} 
                                    className={`sample-item ${selectedGift === p.name ? 'selected' : ''}`} 
                                    onClick={() => setSelectedGift(p.name)}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '15px', 
                                        padding: '10px', 
                                        border: `1px solid ${selectedGift === p.name ? '#000' : '#eee'}`, 
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        background: selectedGift === p.name ? '#f9f9f9' : '#fff'
                                    }}
                                >
                                    <div style={{ width: '16px', height: '16px', border: '1px solid #000', borderRadius: '4px', background: selectedGift === p.name ? '#000' : 'transparent' }}></div>
                                    <img src={getImgSrc(p.images[0])} style={{ width: '40px', height: '40px', objectFit: 'cover' }} alt={p.name} />
                                    <span>{p.name}</span>
                                </div>
                            ))}
                        </div>
                        <button className="auth-btn" style={{ marginTop: '20px' }} onClick={handleProceed}>Proceed to Buy</button>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {isCheckoutModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content">
                        <ion-icon name="close-outline" style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px', cursor: 'pointer' }} onClick={() => setIsCheckoutModalOpen(false)}></ion-icon>
                        <h2>Order Summary</h2>
                        <div style={{ padding: '20px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span>Product</span><span>{product.name}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span>Size</span><span>{selectedSize}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span>Price</span><span>₹ {price}.00</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span>Gift Sample</span><span>{selectedGift}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Gift Price</span><span style={{ color: '#27ae60' }}>Free</span></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total Amount</span><span>₹ {price}.00</span>
                        </div>
                        <button className="auth-btn" onClick={() => alert('Redirecting to secure payment...')}>Pay to Checkout</button>
                    </div>
                </div>
            )}

            <main className="product-page-grid">
                <div className="gallery-container">
                    <div className="main-image-box">
                        <img src={getImgSrc(mainImg)} alt={product.name} />
                    </div>
                    <div className="carousel-track" style={{ display: 'flex', gap: '10px' }}>
                        {product.images.map((img, idx) => (
                            <div 
                                key={idx} 
                                className={`thumb ${mainImg === img ? 'active' : ''}`} 
                                onClick={() => setMainImg(img)}
                                style={{ width: '80px', height: '80px', borderRadius: '12px', border: `2px solid ${mainImg === img ? '#000' : '#eee'}`, cursor: 'pointer', overflow: 'hidden' }}
                            >
                                <img src={getImgSrc(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="product-info-sidebar">
                    <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <span className="badge" style={{ background: '#f5f5f7', padding: '6px 14px', borderRadius: '20px', width: 'fit-content', fontSize: '0.8rem', fontWeight: 600 }}>{product.badge}</span>
                        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{product.name}</h1>
                        <div className="price" style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹ {price}.00</div>

                        <div className="size-selector">
                            <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#6e6e73', marginBottom: '10px' }}>Select Size</span>
                            <div className="size-options" style={{ display: 'flex', gap: '10px' }}>
                                <button className={`tab-btn ${selectedSize === '100ml' ? 'active' : ''}`} onClick={() => { setSelectedSize('100ml'); setPrice(product.price); }}>100ml</button>
                                <button className={`tab-btn ${selectedSize === '50ml' ? 'active' : ''}`} onClick={() => { setSelectedSize('50ml'); setPrice(product.secondaryPrice); }}>50ml</button>
                            </div>
                        </div>

                        <button className="auth-btn" style={{ padding: '20px', fontSize: '1.1rem' }} onClick={() => setIsGiftModalOpen(true)}>
                            Buy Now With <span style={{ color: '#ff4d6d' }}>Free</span> Gift
                        </button>

                        <div className="accordion-group" style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#eee', borderRadius: '12px', overflow: 'hidden' }}>
                            <div className="acc-item" style={{ background: '#fff' }}>
                                <button onClick={() => toggleAccordion(0)} style={{ width: '100%', padding: '20px', border: 'none', background: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
                                    Main Accords <ion-icon name={activeAccordion === 0 ? "chevron-up-outline" : "chevron-down-outline"}></ion-icon>
                                </button>
                                {activeAccordion === 0 && (
                                    <div style={{ padding: '0 20px 20px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {product.accords.map(a => <span key={a} style={{ background: '#f5f5f7', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{a}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="acc-item" style={{ background: '#fff' }}>
                                <button onClick={() => toggleAccordion(1)} style={{ width: '100%', padding: '20px', border: 'none', background: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
                                    Perfume Pyramid <ion-icon name={activeAccordion === 1 ? "chevron-up-outline" : "chevron-down-outline"}></ion-icon>
                                </button>
                                {activeAccordion === 1 && (
                                    <div style={{ padding: '0 20px 20px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                        <div style={{ marginBottom: '10px' }}><b>Top Notes:</b> {product.topNotes}</div>
                                        <div style={{ marginBottom: '10px' }}><b>Middle Notes:</b> {product.middleNotes}</div>
                                        <div><b>Base Notes:</b> {product.baseNotes}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
};

export default ProductDetail;
