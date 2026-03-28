import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsData } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useStorefront } from '../context/StorefrontContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const { collections } = useStorefront();
    const product = productsData[id] || productsData['dominus'];

    const getDynamicBadge = () => {
        if (!collections) return product.badge;
        const matchingCats = [];
        for (const [key, pIds] of Object.entries(collections)) {
            if (pIds.includes(id)) {
                let formatted = key.charAt(0).toUpperCase() + key.slice(1);
                const lKey = key.toLowerCase();
                if (lKey === 'him') formatted = 'Men';
                else if (lKey === 'her') formatted = 'Women';
                else if (lKey === 'gift' || lKey === 'unisex') formatted = 'Unisex';
                matchingCats.push(formatted);
            }
        }
        
        if (matchingCats.length > 0) {
            const catStr = matchingCats.join(', ');
            const splitBadge = product.badge.split(' • ');
            if (splitBadge.length > 1) {
                return (
                    <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                        <span style={{ marginRight: 0 }}>{catStr}</span>
                        <div className="red-dot" style={{ width: '6px', height: '6px', background: '#D22B2B', borderRadius: '50%', marginLeft: '4px', marginRight: '4px', transform: 'translateY(0px)' }}></div>
                        <span>{splitBadge[1]}</span>
                    </span>
                );
            }
            return catStr;
        }
        return product.badge;
    };

    const [mainImg, setMainImg] = useState(product.images[0]);
    const [selectedSize, setSelectedSize] = useState('100ml');
    const [price, setPrice] = useState(product.price);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);

    const scrollRef = React.useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setMainImg(product.images[0]);
        setPrice(product.price);
        setSelectedSize('100ml');
        setActiveAccordion(null);
    }, [id, product]);

    useEffect(() => {
        let interval;
        if (!isHovered) {
            interval = setInterval(() => {
                if (scrollRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                    if (scrollLeft + clientWidth >= scrollWidth - 10) {
                        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        const scrollAmount = clientWidth > 768 ? clientWidth / 3 : clientWidth * 0.85;
                        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    }
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isHovered]);

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
        setIsAddressModalOpen(true);
    };

    return (
        <div className="product-page-wrapper">
            {/* Gift Modal */}
            {isGiftModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content gift-modal">
                        <ion-icon name="close-outline" style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px', cursor: 'pointer' }} onClick={() => setIsGiftModalOpen(false)}></ion-icon>
                        <h2 className="modal-title">Select Your Free Gift</h2>
                        <p className="modal-subtitle">Choose 1 complimentary sample</p>

                        <div className="sample-list">
                            {Object.entries(productsData).filter(([key]) => key !== 'gift1').map(([key, p]) => (
                                <div
                                    key={key}
                                    className={`sample-item ${selectedGift === p.name ? 'selected' : ''}`}
                                    onClick={() => setSelectedGift(p.name)}
                                >
                                    <div className="radio-icon">
                                        <div className="radio-inner"></div>
                                    </div>
                                    <img src={getImgSrc(p.images[0])} alt={p.name} className="sample-img" />
                                    <span className="sample-name">{p.name}</span>
                                </div>
                            ))}
                        </div>
                        <button className="buy-now-cta full-width-btn" style={{ marginTop: '20px' }} onClick={handleProceed}>Proceed to Buy</button>
                    </div>
                </div>
            )}

            {/* Address Selection Modal */}
            {isAddressModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content address-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Select Address</h2>
                            <button className="add-new-btn">Add New</button>
                        </div>
                        
                        <div className="address-scroll-container">
                            <div className="address-card">
                                <h4 className="card-heading">Saved Address</h4>
                                <div className="card-content">
                                    <div className="radio-group">
                                        <input type="radio" id="addr1" name="address" checked readOnly />
                                        <label htmlFor="addr1">
                                            <div className="recipient-row">
                                                <span className="recipient-name">Shreyash Nimbargi</span>
                                                <ion-icon name="star" className="star-icon" style={{ color: '#FFD700', fontSize: '1.2rem' }}></ion-icon>
                                            </div>
                                            <div className="address-details">
                                                <p>123 Luxury Avenue, Penthouse 5</p>
                                                <p>Bandra West, Mumbai, Maharashtra</p>
                                                <p>PIN: 400050</p>
                                            </div>
                                            <div className="contact-info">
                                                <p>+91 98765 43210</p>
                                                <p>shreyash@example.com</p>
                                            </div>
                                            <div className="info-note">
                                                <ion-icon name="information-circle-outline" style={{ color: '#f39c12' }}></ion-icon>
                                                <span>For better reach, include an alternate number.</span>
                                            </div>
                                        </label>
                                    </div>
                                    <button className="edit-btn">
                                        <ion-icon name="pencil-outline"></ion-icon>
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="buy-now-cta" onClick={() => { setIsAddressModalOpen(false); setIsCheckoutModalOpen(true); }}>
                                Proceed to checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCheckoutModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content checkout-modal">
                        <ion-icon name="close-outline" style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px', cursor: 'pointer' }} onClick={() => setIsCheckoutModalOpen(false)}></ion-icon>
                        <h2 className="modal-title">Order Summary</h2>
                        
                        <div className="summary-list">
                            <div className="summary-row">
                                <span className="label">Product</span>
                                <span className="value">{product.name}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Size</span>
                                <span className="value">{selectedSize}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Price</span>
                                <span className="value">₹ {price}.00</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Gift Sample</span>
                                <span className="value">{selectedGift}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Gift Price</span>
                                <span className="value" style={{ color: '#27ae60' }}>Free</span>
                            </div>
                        </div>

                        <div className="total-row">
                            <span>Total Amount</span>
                            <span className="total-price">₹ {price}.00</span>
                        </div>
                        
                        <button className="buy-now-cta full-width-btn" onClick={() => alert('Redirecting to secure payment...')}>
                            Pay to Checkout
                        </button>
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
                    <div className="sidebar-content">
                        <span className="badge" style={{ background: '#f5f5f7', padding: '6px 14px', borderRadius: '20px', width: 'fit-content', fontSize: '0.8rem', fontWeight: 600 }}>{getDynamicBadge()}</span>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                            <h1 className="product-title-desktop">{product.name}</h1>
                            {/* Wishlist heart */}
                            <button
                                onClick={() => toggleWishlist({
                                    id: id || 'dominus',
                                    name: product.name,
                                    badge: product.badge,
                                    price: price,
                                    image: getImgSrc(product.images[0]),
                                    size: selectedSize,
                                })}
                                title={isWishlisted(id || 'dominus') ? 'Remove from wishlist' : 'Add to wishlist'}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
                                    color: isWishlisted(id || 'dominus') ? '#e74c3c' : '#9e9ea3',
                                    fontSize: 24, padding: '4px 0', marginTop: 4,
                                    transition: 'color 0.2s, transform 0.2s',
                                    display: 'flex', alignItems: 'center',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <ion-icon name={isWishlisted(id || 'dominus') ? 'heart' : 'heart-outline'}></ion-icon>
                            </button>
                        </div>
                        <div className="price" style={{
                            fontSize: '1.8rem',
                            fontWeight: 360,
                            marginBottom: '24px',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                            color: '#1d1d1f'
                        }}>₹ {price}.00</div>

                        <div className="size-selector">
                            <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#6e6e73', marginBottom: '10px' }}>Select Size</span>
                            <div className="size-options" style={{ display: 'flex', gap: '10px' }}>
                                <button className={`tab-btn ${selectedSize === '100ml' ? 'active' : ''}`} onClick={() => { setSelectedSize('100ml'); setPrice(product.price); }}>100ml</button>
                                <button className={`tab-btn ${selectedSize === '50ml' ? 'active' : ''}`} onClick={() => { setSelectedSize('50ml'); setPrice(product.secondaryPrice); }}>50ml</button>
                            </div>
                        </div>

                        <button className="buy-now-cta" onClick={() => setIsGiftModalOpen(true)}>
                            Buy Now With <span className="free-badge">FREE</span> Gift
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

            {/* The Story Section */}
            <section className="the-story-section" style={{ padding: '20px 20px 60px', maxWidth: '1200px', margin: '40px auto 0' }}>
                <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', marginBottom: '40px' }} />

                <style>{`
                    .strict-casing-override {
                        text-transform: none !important;
                        font-variant: normal !important;
                    }
                `}</style>
                <h2 className="strict-casing-override" style={{
                    textAlign: 'left',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                    marginBottom: '40px',
                    color: '#111',
                    letterSpacing: '0.05em'
                }}>
                    Our Story
                </h2>

                <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '60px' }}>
                    <img
                        src={getImgSrc(product.storyVisual || `media/${id || 'dominus'}/DE.png`)}
                        alt={`${product.name} Story`}
                        style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', margin: '0 auto' }}
                    />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    marginBottom: '60px',
                    textAlign: 'left',
                    alignItems: 'start'
                }}>
                    <div>
                        <h3 className="strict-casing-override" style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                            fontWeight: 700,
                            fontSize: '1.4rem',
                            marginBottom: '18px',
                            color: '#111',
                            letterSpacing: '0.05em'
                        }}>Oceanic Inspiration</h3>
                        <p style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                            color: '#6e6e73',
                            lineHeight: '1.5',
                            fontSize: '1rem',
                            fontWeight: 400
                        }}>
                            Inspired by the deep turquoise waters of the Mediterranean, {product.name === 'Mestia' ? 'Mistia' : product.name} is a refreshing olfactive journey.
                        </p>
                    </div>
                    <div>
                        <h3 className="strict-casing-override" style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                            fontWeight: 700,
                            fontSize: '1.4rem',
                            marginBottom: '18px',
                            color: '#111',
                            letterSpacing: '0.05em'
                        }}>Masterful Longevity</h3>
                        <p style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                            color: '#6e6e73',
                            lineHeight: '1.5',
                            fontSize: '1rem',
                            fontWeight: 400
                        }}>
                            As an Extrait de Parfum, {product.name === 'Mestia' ? 'Mistia' : product.name} boasts a high concentration of rare essential oils ensuring all-day wear.
                        </p>
                    </div>
                </div>

                <hr style={{ border: 'none', borderBottom: '1px solid #e0e0e0', margin: '0' }} />
            </section>

            {/* Verified Reviews Section */}
            <section className="verified-reviews-section" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 className="strict-casing-override" style={{
                    textAlign: 'left',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                    marginBottom: '40px',
                    color: '#111',
                    letterSpacing: '0.05em'
                }}>
                    Verified Reviews
                </h2>

                <style>{`
                    .review-track::-webkit-scrollbar { display: none; }
                    .review-track {
                        scrollbar-width: none; /* Firefox */
                        -ms-overflow-style: none; /* IE and Edge */
                        display: flex;
                        gap: 24px;
                        margin-bottom: 60px;
                        overflow-x: auto;
                        scroll-behavior: smooth;
                        -webkit-overflow-scrolling: touch;
                        padding-bottom: 10px;
                    }
                    .review-card {
                        flex: 0 0 calc(33.3333% - 16px);
                    }
                    @media (max-width: 768px) {
                        .review-card {
                            flex: 0 0 85%;
                        }
                    }
                `}</style>
                <div
                    ref={scrollRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={() => setIsHovered(true)}
                    onTouchEnd={() => setTimeout(() => setIsHovered(false), 2500)}
                    className="review-track"
                >
                    {[
                        { name: "Marcus J.", text: "Absolutely phenomenal presence. The opening is sharp and the dry down lasts easily 12+ hours on my skin. Definitely my new signature." },
                        { name: "Elena S.", text: "A truly elegant and refreshing masterpiece. The complexity of the notes is stunning and it pulls compliments everywhere I go." },
                        { name: "Rahul K.", text: "Very premium feel and exceptional longevity. You can tell they use highly concentrated, high-quality oils. Worth every penny." },
                        { name: "Sophie M.", text: "I bought this blindly and it exceeded every expectation. An intoxicating blend that evolves gorgeously over an entire day." },
                        { name: "David L.", text: "The presentation alone feels royal, but the juice inside is world-class. Striking the perfect balance of bold and refined." },
                        { name: "Omar T.", text: "A fragrance that announces your arrival. The sillage is massive and the scent trail is remarkably seductive." },
                        { name: "Lucas H.", text: "Stunning presentation and an even more stunning fragrance. Always turns heads." },
                        { name: "Mia W.", text: "One of the deepest, richest extrait forms I have ever purchased. Stunning quality." }
                    ].map((review, idx) => (
                        <div key={idx} className="review-card" style={{
                            border: '1px solid #FFD700',
                            borderRadius: '16px',
                            background: '#fff',
                            padding: '30px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ color: '#FFD700', fontSize: '1.2rem', letterSpacing: '2px' }}>
                                ★★★★★
                            </div>
                            <div style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: '#111'
                            }}>
                                {review.name}
                            </div>
                            <p style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                                color: '#6e6e73',
                                lineHeight: '1.6',
                                fontSize: '1rem',
                                fontWeight: 400
                            }}>
                                "{review.text}"
                            </p>
                        </div>
                    ))}
                </div>

                <hr style={{ border: 'none', borderBottom: '1px solid #e0e0e0', margin: '0' }} />
            </section>

            {/* You Might Also Love Section */}
            <section className="you-might-also-love-section" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 className="strict-casing-override" style={{
                    textAlign: 'left',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                    marginBottom: '40px',
                    color: '#111',
                    letterSpacing: '0.05em'
                }}>
                    You Might Also Love
                </h2>

                <style>{`
                    .ymal-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 24px;
                        margin-bottom: 60px;
                    }
                    @media (max-width: 768px) {
                        .ymal-grid {
                            grid-template-columns: repeat(2, 1fr);
                            gap: 16px;
                        }
                    }
                `}</style>
                <div className="ymal-grid">
                    {Object.entries(productsData)
                        .filter(([key]) => key !== (id || 'dominus') && key !== 'gift1')
                        .slice(0, 4)
                        .map(([key, p]) => (
                            <div key={key}
                                onClick={() => {
                                    navigate(`/product/${key}`);
                                    window.scrollTo({ top: 0, behavior: 'instant' });
                                }}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    backgroundColor: '#f5f5f7',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '20px'
                                }}>
                                    <img
                                        src={getImgSrc(p.images[0])}
                                        alt={p.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <h3
                                        className="prod-name strict-casing-override"
                                        style={{ margin: '0 0 2px 0', color: '#111' }}
                                    >
                                        {p.name}
                                    </h3>
                                    <div
                                        className="prod-meta strict-casing-override"
                                        style={{ margin: 0, fontWeight: 500 }}
                                    >
                                        ₹ {p.price}.00
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <hr style={{ border: 'none', borderBottom: '1px solid #e0e0e0', margin: '0' }} />
            </section>

        </div>
    );
};

export default ProductDetail;
