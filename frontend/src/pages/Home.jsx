import React, { useRef, useEffect } from 'react';
import Hero from '../components/landing/Hero';
import Collections from '../components/landing/Collections';
import ScentArt from '../components/landing/ScentArt';
import OlfactoryTrends from '../components/landing/OlfactoryTrends';

const Home = () => {
    const reviewsRef = useRef(null);
    const influencersRef = useRef(null);

    const scrollInfluencers = (direction) => {
        if (influencersRef.current) {
            const scrollAmount = 300; // manual scroll distance
            influencersRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const setupDragToScroll = (container) => {
            if (!container) return null;
            
            let isDown = false;
            let startX;
            let scrollLeft;
            
            const handleDown = (e) => {
                isDown = true;
                container.style.cursor = 'grabbing';
                startX = (e.pageX || e.touches[0].pageX) - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            };
            
            const handleLeaveOrUp = () => {
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
            container.addEventListener('mouseleave', handleLeaveOrUp);
            container.addEventListener('mouseup', handleLeaveOrUp);
            container.addEventListener('mousemove', handleMove);
            container.addEventListener('touchstart', handleDown, { passive: true });
            container.addEventListener('touchend', handleLeaveOrUp);
            container.addEventListener('touchmove', handleMove, { passive: false });
            
            return () => {
                container.removeEventListener('mousedown', handleDown);
                container.removeEventListener('mouseleave', handleLeaveOrUp);
                container.removeEventListener('mouseup', handleLeaveOrUp);
                container.removeEventListener('mousemove', handleMove);
                container.removeEventListener('touchstart', handleDown);
                container.removeEventListener('touchend', handleLeaveOrUp);
                container.removeEventListener('touchmove', handleMove);
            };
        };

        const cleanupReviews = setupDragToScroll(reviewsRef.current);
        const cleanupInfluencers = setupDragToScroll(influencersRef.current);

        return () => {
            if (cleanupReviews) cleanupReviews();
            if (cleanupInfluencers) cleanupInfluencers();
        };
    }, []);

    // Content for Client Experiences (Reviews)
    const reviews = [
        { name: "Julian V.", text: "The most sophisticated scent I have ever worn. Truly a masterpiece of modern luxury." },
        { name: "Sophia L.", text: "Brilliant longevity and the sillage is perfect. I get compliments everywhere I go." },
        { name: "Marcus G.", text: "Fast shipping and the packaging is absolute luxury. A premium experience from start to finish." },
        { name: "Elena R.", text: "Unique, bold, and staying power that lasts all day. My new signature scent." },
        { name: "David K.", text: "The Art of Scent indeed. Brunati has redefined what a luxury fragrance should feel like." }
    ];

    const influencersList = [
        {
            name: "KATRINA KAIF",
            role: "INDIAN ACTRESS",
            wearing: "WEARING: ILLUMINATI"
        },
        {
            name: "RAFTAAR",
            role: "MUSICIAN, HIP HOP",
            wearing: "WEARING: ILLUMINATI"
        },
        {
            name: "PANTHER",
            role: "MUSICIAN, HIP HOP",
            wearing: "WEARING: UM VISION"
        },
        {
            name: "SHANAYA KAPOOR",
            role: "INDIAN ACTRESS",
            wearing: "WEARING: NINJA NATION // 001"
        },
        {
            name: "VICKY KAUSHAL",
            role: "INDIAN ACTOR",
            wearing: "WEARING: OUD WOOD"
        },
        {
            name: "ALIA BHATT",
            role: "INDIAN ACTRESS",
            wearing: "WEARING: NIGHT BLOOM"
        }
    ];

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
                    {reviews.map((r, idx) => (
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
                        {influencersList.map((influencer, idx) => (
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
