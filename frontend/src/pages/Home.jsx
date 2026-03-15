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

            {/* Luxury Brand Banner */}
            <section className="brand-banner">
                <div className="brand-banner-inner">
                    <div className="brand-banner-ornament">✦</div>
                    <p className="brand-banner-tagline">The language of desire</p>
                    <h2 className="brand-banner-heading">Wear what cannot<br />be spoken</h2>
                    <p className="brand-banner-sub">
                        Each Brunati fragrance is a living signature — an invisible trail of memory,<br className="d-none-mobile" />
                        desire, and identity that lingers long after you have left the room.
                    </p>
                    <div className="brand-banner-divider">
                        <span className="brand-banner-line"></span>
                        <span className="brand-banner-diamond">◆</span>
                        <span className="brand-banner-line"></span>
                    </div>
                    <div className="brand-banner-notes">
                        <span>Oud</span>
                        <span className="dot">·</span>
                        <span>Amber</span>
                        <span className="dot">·</span>
                        <span>Sandalwood</span>
                        <span className="dot">·</span>
                        <span>Saffron</span>
                        <span className="dot">·</span>
                        <span>Vetiver</span>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Home;
