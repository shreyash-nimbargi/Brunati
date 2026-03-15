import React, { useRef, useEffect } from 'react';
import Hero from '../components/landing/Hero';
import Collections from '../components/landing/Collections';
import ScentArt from '../components/landing/ScentArt';


const Home = () => {
    const reviewsRef = useRef(null);

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

    return (
        <main>
            <Hero />

            {/* Sponsor/Ad Banner Space */}
            <section className="sponsor-banner-container">
                <div className="sponsor-banner">
                    <div className="ticker-wrapper">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="ticker-group">
                                <span>ARTISAN CRAFTED SCENTS</span>
                                <span className="ticker-dot">•</span>
                                <span>LONG LASTING SILLAGE</span>
                                <span className="ticker-dot">•</span>
                                <span>ELIXIR OF PURE LUXURY</span>
                                <span className="ticker-dot">•</span>
                                <span>SIGNATURE OLFACTORY NOTES</span>
                                <span className="ticker-dot">•</span>
                                <span>HAND-POURED IN SMALL BATCHES</span>
                                <span className="ticker-dot">•</span>
                                <span>ELEGANCE IN EVERY MIST</span>
                                <span className="ticker-dot">•</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Collections />

            <ScentArt />


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


        </main>
    );
};

export default Home;
