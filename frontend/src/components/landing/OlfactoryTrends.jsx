import React, { useRef, useState } from 'react';
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
    const scrollRef = useRef(null);
    
    // We filter out the gift set and map the actual products for the trends section
    const trendProducts = Object.keys(productsData).filter(key => key !== 'gift1');

    // To ensure we have enough items to scroll (like the previous 10 cards), we can duplicate them to create a longer list:
    const trends = [...trendProducts, ...trendProducts];

    const handleProductClick = (id) => {
        // Navigate to product detail page
        navigate(`/product/${id}`);
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="olfactory-trends-section">
            <h2 className="section-title text-center">Olfactory Trends</h2>
            <div className="olfactory-trends-wrapper">
                <div className="trends-scroll-container" ref={scrollRef}>
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
            </div>
            <div className="trends-arrow-container">
                <button className="trends-slider-arrow left-arrow" onClick={() => scroll('left')}>&#8249;</button>
                <button className="trends-slider-arrow right-arrow" onClick={() => scroll('right')}>&#8250;</button>
            </div>
        </section>
    );
};

export default OlfactoryTrends;
