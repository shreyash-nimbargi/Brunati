import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';

const ScentArt = () => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await productService.getAllProducts();
                if (response.status) {
                    setProducts(response.data);
                }
            } catch (err) {
                console.error('ScentArt fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    useEffect(() => {
        let animationFrameId;
        const container = scrollRef.current;
        if (!container || products.length === 0) return;

        let isDown = false;
        const handleDown = () => isDown = true;
        const handleUp = () => isDown = false;

        container.addEventListener('mousedown', handleDown);
        container.addEventListener('mouseup', handleUp);
        container.addEventListener('mouseleave', handleUp);
        container.addEventListener('touchstart', handleDown, { passive: true });
        container.addEventListener('touchend', handleUp);

        const scroll = () => {
            if (!isDown) {
                container.scrollLeft += 1;
                if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
                    container.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };
        animationFrameId = requestAnimationFrame(scroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
            container.removeEventListener('mousedown', handleDown);
            container.removeEventListener('mouseup', handleUp);
            container.removeEventListener('mouseleave', handleUp);
            container.removeEventListener('touchstart', handleDown);
            container.removeEventListener('touchend', handleUp);
        };
    }, [products]);

    // Construct image list (repeat to create infinite scroll effect if few products)
    const displayProducts = [...products, ...products];

    return (
        <section className="middle-poster content-wrap">
            <div className="section-header">
                <h2 className="section-title">The Art of Scent</h2>
                <p className="section-subtitle" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    Explore a symphony of olfactory notes, meticulously crafted for the modern visionary who demands excellence.
                </p>
            </div>
            
            <div className="scent-carousel-base" ref={scrollRef}>
                <div className="scent-track">
                    {products.length > 0 ? (
                        displayProducts.map((product, idx) => {
                            const imgPath = product.images?.[0]?.startsWith('http') || product.images?.[0]?.startsWith('/') 
                                ? product.images[0] 
                                : `/${product.images[0]}`;
                            
                            return (
                                <div 
                                    key={`${product._id || idx}-${idx}`} 
                                    className="scent-slide-wrapper" 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/product/${product.slug}`)}
                                >
                                    <img src={imgPath} className="scent-slide-img" alt={product.name} />
                                </div>
                            );
                        })
                    ) : (
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '80px 0',
                            color: '#86868b',
                            fontSize: '0.9rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase'
                        }}>
                            {loading ? "Preparing our masterpieces..." : "New artistic expressions coming soon."}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ScentArt;

