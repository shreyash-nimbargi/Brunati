import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { useParams, useNavigate, useLocation } from 'react-router-dom';



import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import { productService } from '../services/productService';
import { userService } from '../services/userService';


const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [mainImg, setMainImg] = useState('');


    const [selectedSize, setSelectedSize] = useState('100ml');
    const [price, setPrice] = useState(0);
    const [activeAccordion, setActiveAccordion] = useState(null);

    const scrollRef = React.useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await productService.getProductBySlug(slug);
                if (response.status) {
                    const fetchedProduct = response.data;
                    setProduct(fetchedProduct);
                    setMainImg(fetchedProduct.images[0]);
                    setPrice(fetchedProduct.sizes?.[0]?.price || 0);
                    setSelectedSize(fetchedProduct.sizes?.[0]?.size || '100ml');

                    // Parallel fetches
                    const [reviewsRes, allResponse] = await Promise.all([
                        productService.getReviewsByProduct(fetchedProduct._id),
                        productService.getAllProducts()
                    ]);

                    if (reviewsRes.status) setReviews(reviewsRes.data.data || reviewsRes.data);

                    if (allResponse.status) {
                        setRelatedProducts(allResponse.data.filter(p => p.slug !== slug).slice(0, 4));
                    }




                } else {
                    setError('Product not found.');
                }
            } catch (err) {
                console.error('Fetch detail error:', err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProductData();
        window.scrollTo(0, 0);
    }, [slug]);


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

    if (loading) return <div className="text-center py-20 font-inter">Opening the vault...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-inter">{error}</div>;
    if (!product) return null;

    const getImgSrc = (src) => {
        if (!src) return '/media/dominus/1.png';
        return src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;
    };

    const toggleAccordion = (idx) => {
        setActiveAccordion(activeAccordion === idx ? null : idx);
    };

    return (
        <div className="product-page-wrapper">
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
                        <span className="badge" style={{ background: '#f5f5f7', padding: '6px 14px', borderRadius: '20px', width: 'fit-content', fontSize: '0.8rem', fontWeight: 600 }}>{product.category} • Extrait de Parfum</span>

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                            <h1 className="product-title-desktop">{product.name}</h1>
                            {/* Wishlist heart */}
                            <button
                                onClick={() => toggleWishlist({
                                    id: product._id,
                                    name: product.name,
                                    badge: `${product.category} • Extrait de Parfum`,
                                    price: price,
                                    image: getImgSrc(product.images[0]),
                                    size: selectedSize,
                                })}
                                title={isWishlisted(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
                                    color: isWishlisted(product._id) ? '#e74c3c' : '#9e9ea3',
                                    fontSize: 24, padding: '4px 0', marginTop: 4,
                                    transition: 'color 0.2s, transform 0.2s',
                                    display: 'flex', alignItems: 'center',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <ion-icon name={isWishlisted(product._id) ? 'heart' : 'heart-outline'}></ion-icon>
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
                                {product.sizes?.map((s, idx) => (
                                    <button
                                        key={idx}
                                        className={`tab-btn ${selectedSize === s.size ? 'active' : ''}`}
                                        onClick={() => { setSelectedSize(s.size); setPrice(s.price); }}
                                    >
                                        {s.size}
                                    </button>
                                ))}
                            </div>

                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <button
                                className="buy-now-cta"
                                style={{ background: '#fff', color: '#111', border: '1px solid #111' }}
                                onClick={() => {
                                    addToCart({
                                        id: product._id,
                                        name: product.name,
                                        size: selectedSize,
                                        price: parseFloat(String(price).replace(/[^0-9.]/g, '')),
                                        quantity: 1,
                                        image: getImgSrc(mainImg),
                                        stock: product.sizes.find(s => s.size === selectedSize)?.stock || 0
                                    });
                                    navigate('/cart');
                                }}
                            >
                                Add to Cart
                            </button>

                            <button className="buy-now-cta" onClick={() => {
                                navigate('/checkout', {
                                    state: {
                                        isDirectBuy: true,
                                        directBuyProduct: {
                                            id: product._id,
                                            name: product.name,
                                            size: selectedSize,
                                            price: parseFloat(String(price).replace(/[^0-9.]/g, '')),
                                            image: getImgSrc(mainImg),
                                            stock: product.sizes.find(s => s.size === selectedSize)?.stock || 0
                                        }
                                    }
                                });
                            }}>
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
                                            {product.mainAccords?.map(a => <span key={a} className="accord-tag">{a}</span>)}
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
                                            <div className="note-row"><b>Top Notes:</b> {product.perfumePyramid?.top?.join(', ')}</div>
                                            <div className="note-row"><b>Middle Notes:</b> {product.perfumePyramid?.middle?.join(', ')}</div>
                                            <div className="note-row"><b>Base Notes:</b> {product.perfumePyramid?.base?.join(', ')}</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* The Story Section */}
            {product.story && (
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
                            src={getImgSrc(product.story?.storyImages?.[0] || product.images[0])}
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
                        {product.story?.sections?.map((section, idx) => (
                            <div key={idx}>
                                <h3 className="strict-casing-override" style={{
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                                    fontWeight: 700,
                                    fontSize: '19px',
                                    marginBottom: '14px',
                                    color: '#000000',
                                    letterSpacing: '0.02em'
                                }}>{section.title}</h3>
                                <p style={{
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                                    color: '#8e8e93',
                                    lineHeight: '1.6',
                                    fontSize: '1rem',
                                    fontWeight: 400
                                }}>
                                    {section.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <hr style={{ border: 'none', borderBottom: '1px solid #e0e0e0', margin: '0' }} />
                </section>
            )}


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
                    {reviews.map((review, idx) => (

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
                                {'★'.repeat(review.rating || 5)}{'☆'.repeat(5 - (review.rating || 5))}
                            </div>
                            <div style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: '#111',
                                textAlign: 'left'
                            }}>
                                {review.reviewerName}
                            </div>
                            <p style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                                color: '#6e6e73',
                                lineHeight: '1.6',
                                fontSize: '1rem',
                                fontWeight: 400,
                                textAlign: 'left'
                            }}>
                                "{review.reviewText}"
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
                    {relatedProducts.map((p) => (
                        <div
                            key={p._id}
                            className="ymal-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                navigate(`/product/${p.slug}`);
                                window.scrollTo({ top: 0, behavior: 'instant' });
                            }}
                        >
                            <div className="ymal-card-img-box">
                                <img
                                    src={getImgSrc(p.images?.[0])}
                                    alt={p.name}
                                    style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                                />
                            </div>
                            <h4 style={{ fontSize: '1rem', marginTop: '12px', fontWeight: 600 }}>{p.name}</h4>
                            <p style={{ fontSize: '0.9rem', color: '#6e6e73' }}>₹ {p.sizes?.[0]?.price || 0}.00</p>
                        </div>
                    ))}
                </div>

                <hr style={{ border: 'none', borderBottom: '1px solid #e0e0e0', margin: '0' }} />
            </section>

        </div>
    );
};

export default ProductDetail;
