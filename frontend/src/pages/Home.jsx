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
