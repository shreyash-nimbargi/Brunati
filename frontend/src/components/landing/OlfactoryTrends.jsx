import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../../data/products';
import './OlfactoryTrends.css';

const TrendVideo = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    return (
        <div className="trend-video-wrapper" onClick={togglePlay}>
            <video 
                ref={videoRef}
                className="trend-main-video placeholder-dark" 
                loop 
                muted 
                playsInline
                src={src}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            >
                Your browser does not support the video tag.
            </video>
            {!isPlaying && (
                <div className="video-play-overlay">
                    <div className="play-icon">&#9654;</div>
                </div>
            )}
        </div>
    );
};

const OlfactoryTrends = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    
    // We filter out the gift set and map the actual products for the trends section
    const trendProducts = Object.keys(productsData).filter(key => key !== 'gift1');

    // No infinite scroll for this section as per requirements
    const trends = trendProducts;

    const handleProductClick = (id) => {
        // Navigate to product detail page
        navigate(`/product/${id}`);
    };

    const scroll = (direction) => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = 300;
        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        const handleDown = (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = (e.pageX || e.touches[0].pageX) - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        };

        const handleLeave = () => {
            isDown = false;
            container.style.cursor = 'grab';
        };

        const handleUp = () => {
            isDown = false;
            container.style.cursor = 'grab';
        };

        const handleMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = (e.pageX || e.touches[0].pageX) - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        };

        container.style.cursor = 'grab';
        container.addEventListener('mousedown', handleDown);
        container.addEventListener('mouseleave', handleLeave);
        container.addEventListener('mouseup', handleUp);
        container.addEventListener('mousemove', handleMove);
        container.addEventListener('touchstart', handleDown, { passive: true });
        container.addEventListener('touchend', handleUp);
        container.addEventListener('touchmove', handleMove, { passive: false });

        return () => {
            container.removeEventListener('mousedown', handleDown);
            container.removeEventListener('mouseleave', handleLeave);
            container.removeEventListener('mouseup', handleUp);
            container.removeEventListener('mousemove', handleMove);
            container.removeEventListener('touchstart', handleDown);
            container.removeEventListener('touchend', handleUp);
            container.removeEventListener('touchmove', handleMove);
        };
    }, []);

    return (
        <section className="olfactory-trends-section">
            <h2 className="section-title text-center">Olfactory Trends</h2>
            <div className="trends-container">
                <div className="trends-scroll-container" ref={scrollContainerRef}>
                    {trends.map((item, idx) => {
                        const productInfo = productsData[item];
                        return (
                            <div key={idx} className="trend-card">
                                <TrendVideo src={productInfo.videoReel || ""} />
                                <div className="trend-bottom-area">
                                    <div 
                                        className="trend-small-image placeholder-light"
                                        onClick={() => handleProductClick(item)}
                                        title={`View ${productInfo.name}`}
                                    >
                                        <img 
                                            src={`/${productInfo.images[0]}`} 
                                            alt={productInfo.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                                        />
                                    </div>
                                    <button className="trend-buy-btn" onClick={() => handleProductClick(item)}>Buy Now</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button className="trend-arrow trend-arrow-left" onClick={() => scroll('left')} aria-label="Scroll left">
                    &#8249;
                </button>
                <button className="trend-arrow trend-arrow-right" onClick={() => scroll('right')} aria-label="Scroll right">
                    &#8250;
                </button>
            </div>
        </section>
    );
};

export default OlfactoryTrends;
