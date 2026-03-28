import React, { useRef, useEffect } from 'react';
import Hero from '../components/landing/Hero';
import Collections from '../components/landing/Collections';
import ScentArt from '../components/landing/ScentArt';
import OlfactoryTrends from '../components/landing/OlfactoryTrends';
import { useStorefront } from '../context/StorefrontContext';

const Home = () => {
    const reviewsRef = useRef(null);
    const influencersRef = useRef(null);
    const { reviews, influencers: influencersList } = useStorefront();

    const scrollInfluencers = (direction) => {
        if (influencersRef.current) {
            const scrollAmount = 300; 
            influencersRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        let animationFrameId;
        const container = reviewsRef.current;
        if (!container) return;

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
    }, []);

    const scrollingInfluencers = [...(influencersList || []), ...(influencersList || [])];

    return (
        <main>
            <Hero />
            <Collections />

            <ScentArt />
            <OlfactoryTrends />

            {/* Reviews Section */}
            <section className="reviews-section">
                <div className="section-header"><h2 className="section-title">Reviews</h2></div>
                <div className="scroll-container" ref={reviewsRef}>
                    {reviews?.map((r, idx) => (
                        <div key={idx} className="review-card">
                            <div>
                                <div className="stars">★★★★★</div>
                                <p className="review-text">"{r.text}"</p>
                            </div>
                            <p className="review-author">{r.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Influencers Section */}
            <section className="influencers-section">
                <div className="influencers-slider-wrapper">
                    <button className="slider-arrow left-arrow" onClick={() => scrollInfluencers('left')}>
                        &#8249;
                    </button>

                    <div className="influencers-slider" ref={influencersRef}>
                        {scrollingInfluencers.map((influencer, idx) => (
                            <div key={idx} className="influencer-card">
                                <div className="influencer-image-placeholder"></div>
                                <div className="influencer-info">
                                    <p className="influencer-name">{influencer.name}</p>
                                    <p className="influencer-role">{influencer.role}</p>
                                    <p className="influencer-wearing">{influencer.wearing}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="slider-arrow right-arrow" onClick={() => scrollInfluencers('right')}>
                        &#8250;
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Home;
