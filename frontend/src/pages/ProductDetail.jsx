import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsData } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const product = productsData[id] || productsData['dominus'];

    const [mainImg, setMainImg] = useState(product.images[0]);
    const [selectedSize, setSelectedSize] = useState('100ml');
    const [price, setPrice] = useState(product.price);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);
    const [orderID, setOrderID] = useState('');
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [addresses, setAddresses] = useState([
        {
            name: "Shreyash Nimbargi",
            phone: "+91 98765 43210",
            email: "shreyash@example.com",
            address1: "123 Luxury Avenue, Penthouse 5",
            address2: "Bandra West, Mumbai, Maharashtra",
            pin: "400050"
        }
    ]);
    const [currentAddress, setCurrentAddress] = useState({
        name: "", phone: "", email: "", address1: "", address2: "", pin: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

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

    const handlePlaceOrder = () => {
        const id = `BRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setOrderID(id);
        setIsCheckoutModalOpen(false);
        setIsSuccessModalOpen(true);
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
                        <button className="buy-now-cta full-width-btn" style={{ marginTop: '20px' }} onClick={handleProceed}>Continue</button>
                    </div>
                </div>
            )}

            {/* Address Selection Modal */}
            {/* Address Selection Modal */}
            {isAddressModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content address-modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Select Address</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button className="add-new-btn" onClick={() => {
                                    setCurrentAddress({ name: "", phone: "", email: "", address1: "", address2: "", pin: "" });
                                    setIsEditing(false);
                                    setIsAddressFormOpen(true);
                                }}>Add New</button>
                                <button className="modal-close-btn" onClick={() => setIsAddressModalOpen(false)} aria-label="Close">✕</button>
                            </div>
                        </div>
                        
                        <div className="address-scroll-container">
                            {addresses.map((addr, idx) => (
                                <div key={idx} className={`address-card ${selectedAddressIndex === idx ? 'selected' : ''}`}>
                                    <h4 className="card-heading">{idx === 0 ? 'Saved Address' : 'New Address'}</h4>
                                    <div className="card-content">
                                        <div className="radio-group" onClick={() => setSelectedAddressIndex(idx)}>
                                            <input type="radio" id={`addr${idx}`} name="address" checked={selectedAddressIndex === idx} readOnly />
                                            <label htmlFor={`addr${idx}`}>
                                                <div className="recipient-row">
                                                    <span className="recipient-name">{addr.name}</span>
                                                    {idx === 0 && <ion-icon name="star" className="star-icon" style={{ color: '#FFD700', fontSize: '1.2rem' }}></ion-icon>}
                                                </div>
                                                <div className="address-details">
                                                    <p>{addr.address1}</p>
                                                    <p>{addr.address2}</p>
                                                    <p>PIN: {addr.pin}</p>
                                                </div>
                                                <div className="contact-info">
                                                    <p>{addr.phone}</p>
                                                    <p>{addr.email}</p>
                                                </div>
                                            </label>
                                        </div>
                                        <button className="edit-btn" onClick={() => {
                                            setCurrentAddress(addr);
                                            setIsEditing(true);
                                            setEditIndex(idx);
                                            setIsAddressFormOpen(true);
                                        }}>
                                            <ion-icon name="pencil-outline"></ion-icon>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modal-footer sticky-footer">
                            <button className="buy-now-cta full-width-btn" onClick={() => { setIsAddressModalOpen(false); setIsCheckoutModalOpen(true); }}>
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Address Form Modal */}
            {isAddressFormOpen && (
                <div className="modal-overlay active form-overlay">
                    <div className="modal-content address-form-modal">
                        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 className="modal-title">{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
                            <button className="modal-close-btn" onClick={() => setIsAddressFormOpen(false)} aria-label="Close">✕</button>
                        </div>
                        
                        <form className="address-form" onSubmit={(e) => {
                            e.preventDefault();
                            if(isEditing) {
                                const newAddrs = [...addresses];
                                newAddrs[editIndex] = currentAddress;
                                setAddresses(newAddrs);
                            } else {
                                setAddresses([...addresses, currentAddress]);
                                setSelectedAddressIndex(addresses.length);
                            }
                            setIsAddressFormOpen(false);
                        }}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Full Name</label>
                                    <input type="text" value={currentAddress.name} onChange={(e) => setCurrentAddress({...currentAddress, name: e.target.value})} required placeholder="Enter full name" />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" value={currentAddress.phone} onChange={(e) => setCurrentAddress({...currentAddress, phone: e.target.value})} required placeholder="+91" />
                                </div>
                                <div className="form-group">
                                    <label>Email ID</label>
                                    <input type="email" value={currentAddress.email} onChange={(e) => setCurrentAddress({...currentAddress, email: e.target.value})} required placeholder="example@gmail.com" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Building / Area / Street</label>
                                    <input type="text" value={currentAddress.address1} onChange={(e) => setCurrentAddress({...currentAddress, address1: e.target.value})} required placeholder="Address line 1" />
                                </div>
                                <div className="form-group">
                                    <label>City / State</label>
                                    <input type="text" value={currentAddress.address2} onChange={(e) => setCurrentAddress({...currentAddress, address2: e.target.value})} required placeholder="City, State" />
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input type="text" value={currentAddress.pin} onChange={(e) => setCurrentAddress({...currentAddress, pin: e.target.value})} required placeholder="XXXXXX" />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn">Save Address</button>
                                <button type="button" className="cancel-btn" onClick={() => setIsAddressFormOpen(false)}>Cancel</button>
                            </div>
                        </form>
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

                        <button className="buy-now-cta full-width-btn" onClick={handlePlaceOrder}>
                            Place Order
                        </button>
                    </div>
                </div>
            )}

            {/* Order Success Modal */}
            {isSuccessModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content success-modal">
                        <div className="success-animation">
                            <div className="checkmark-circle">
                                <div className="checkmark draw"></div>
                            </div>
                        </div>
                        <h2 className="modal-title">Your Order Is Placed!</h2>
                        <p className="order-id-text">Order ID: #{orderID}</p>
                        <button className="buy-now-cta full-width-btn" onClick={() => navigate('/')}>
                            Continue Shopping
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
                            >
                                <img src={getImgSrc(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="product-info-sidebar">
                    <div className="sidebar-content">
                        <span className="badge" style={{ background: '#f5f5f7', padding: '6px 14px', borderRadius: '20px', width: 'fit-content', fontSize: '0.8rem', fontWeight: 600 }}>{product.badge}</span>
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

                        <div className="size-selector" style={{ marginBottom: '32px' }}>
                            <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#6e6e73', marginBottom: '10px' }}>Select Size</span>
                            <div className="size-options" style={{ display: 'flex', gap: '10px' }}>
                                <button className={`tab-btn ${selectedSize === '100ml' ? 'active' : ''}`} onClick={() => { setSelectedSize('100ml'); setPrice(product.price); }}>100ml</button>
                                <button className={`tab-btn ${selectedSize === '50ml' ? 'active' : ''}`} onClick={() => { setSelectedSize('50ml'); setPrice(product.secondaryPrice); }}>50ml</button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <button 
                                className="buy-now-cta" 
                                style={{ background: '#fff', color: '#111', border: '1px solid #111' }}
                                onClick={() => {
                                    addToCart({
                                        id: id || 'dominus',
                                        name: product.name,
                                        size: selectedSize,
                                        price: parseFloat(String(price).replace(/[^0-9.]/g, '')),
                                        quantity: 1,
                                        image: getImgSrc(mainImg),
                                    });
                                    navigate('/cart');
                                }}
                            >
                                Add to Cart
                            </button>
                            <button className="buy-now-cta" onClick={() => setIsGiftModalOpen(true)}>
                                Buy Now With <span className="free-badge">FREE</span> Gift
                            </button>
                        </div>

                        <div className="accordion-group">
                            <div className={`acc-item ${activeAccordion === 0 ? 'active' : ''}`}>
                                <button className="acc-header" onClick={() => toggleAccordion(0)}>
                                    Main Accords
                                    <ion-icon name="chevron-down-outline" className="acc-chevron"></ion-icon>
                                </button>
                                <div className="acc-content">
                                    <div className="acc-inner">
                                        <div className="accords-list">
                                            {product.accords.map(a => <span key={a} className="accord-tag">{a}</span>)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`acc-item ${activeAccordion === 1 ? 'active' : ''}`}>
                                <button className="acc-header" onClick={() => toggleAccordion(1)}>
                                    Perfume Pyramid
                                    <ion-icon name="chevron-down-outline" className="acc-chevron"></ion-icon>
                                </button>
                                <div className="acc-content">
                                    <div className="acc-inner">
                                        <div className="pyramid-details">
                                            <div className="note-row"><b>Top Notes:</b> {product.topNotes}</div>
                                            <div className="note-row"><b>Middle Notes:</b> {product.middleNotes}</div>
                                            <div className="note-row"><b>Base Notes:</b> {product.baseNotes}</div>
                                        </div>
                                    </div>
                                </div>
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
                            fontSize: '19px',
                            marginBottom: '14px',
                            color: '#000000',
                            letterSpacing: '0.02em'
                        }}>Oceanic Inspiration</h3>
                        <p style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                            color: '#8e8e93',
                            lineHeight: '1.6',
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
                            fontSize: '19px',
                            marginBottom: '14px',
                            color: '#000000',
                            letterSpacing: '0.02em'
                        }}>Masterful Longevity</h3>
                        <p style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                            color: '#8e8e93',
                            lineHeight: '1.6',
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
                    fontSize: '1.8rem',
                    marginBottom: '32px',
                    color: '#111',
                    letterSpacing: '0.02em'
                }}>
                    Verified Reviews
                </h2>

                <style>{`
                    .review-track::-webkit-scrollbar { display: none; }
                    .review-track {
                        scrollbar-width: none; /* Firefox */
                        -ms-overflow-style: none; /* IE and Edge */
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
                    style={{
                        display: 'flex',
                        gap: '24px',
                        marginBottom: '60px',
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch',
                        paddingBottom: '10px'
                    }}>
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
                            gap: '12px',
                            textAlign: 'left',
                            alignItems: 'flex-start'
                        }}>
                            <div style={{ color: '#FFD700', fontSize: '1.2rem', letterSpacing: '2px', textAlign: 'left' }}>
                                ★★★★★
                            </div>
                            <div style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: '#111',
                                textAlign: 'left'
                            }}>
                                {review.name}
                            </div>
                            <p style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                                color: '#6e6e73',
                                lineHeight: '1.6',
                                fontSize: '1rem',
                                fontWeight: 400,
                                textAlign: 'left'
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
                    fontSize: '1.8rem',
                    marginBottom: '32px',
                    color: '#111',
                    letterSpacing: '0.02em'
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
                        .ymal-card-img-box {
                            aspect-ratio: 1 / 1.2 !important;
                        }
                    }
                    .ymal-card-img-box {
                        width: 100%;
                        aspect-ratio: 1;
                        background-color: #f5f5f7;
                        border-radius: 16px;
                        overflow: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        transition: all 0.3s ease;
                    }
                `}</style>
                <div className="ymal-grid">
                    {Object.entries(productsData)
                        .filter(([key, _]) => key !== (id || 'dominus') && key !== 'gift1')
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
                                <div className="ymal-card-img-box">
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
                                        style={{ 
                                            margin: '0 0 2px 0', 
                                            color: '#111',
                                            fontSize: '15px',
                                            fontWeight: 700,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                                        }}
                                    >
                                        {p.name}
                                    </h3>
                                    <div
                                        className="prod-meta strict-casing-override"
                                        style={{ 
                                            margin: 0, 
                                            fontWeight: 300,
                                            fontSize: '14px',
                                            color: '#6e6e73'
                                        }}
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
