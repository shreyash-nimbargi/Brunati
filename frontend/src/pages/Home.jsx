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

    const scrollingInfluencers = [...(influencersList || []), ...(influencersList || [])];

    return (
        <main style={{ backgroundColor: '#ffffff' }}>
            <Hero />
            <Collections />
            <ScentArt />
            <OlfactoryTrends />

            {/* Client Experiences - Dynamic Feed */}
            <section style={{ padding: '80px 24px', background: '#f9f9fb', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#111', margin: 0 }}>Client Experiences</h2>
                            <p style={{ color: '#666', marginTop: '8px' }}>Real stories from our global community.</p>
                        </div>
                    </div>
                    
                    <div 
                        ref={reviewsRef}
                        style={{ 
                            display: 'flex', gap: '24px', overflowX: 'auto', scrollSnapType: 'x mandatory',
                            paddingBottom: '20px', cursor: 'grab', msOverflowStyle: 'none', scrollbarWidth: 'none'
                        }}
                        className="no-scrollbar"
                    >
                        {reviews?.map((review, idx) => (
                            <div key={idx} style={{ 
                                minWidth: '320px', background: '#fff', padding: '32px', borderRadius: '12px',
                                border: '1px solid #eee', scrollSnapAlign: 'start'
                            }}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <ion-icon key={i} name="star" style={{ color: '#000', fontSize: '14px' }}></ion-icon>
                                    ))}
                                </div>
                                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#111', lineHeight: 1.6, marginBottom: '24px' }}>
                                    "{review.text}"
                                </p>
                                <p style={{ fontWeight: 600, color: '#000', margin: 0 }}>{review.name}</p>
                                <p style={{ fontSize: '0.85rem', color: '#999', margin: 0 }}>Verified Client</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Influencers Section - Dynamic Feed */}
            <section style={{ padding: '80px 24px', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#111', margin: 0 }}>The Art of Scent</h2>
                            <p style={{ color: '#666', marginTop: '8px' }}>Worn by the world's most discerning individuals.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => scrollInfluencers('left')} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff' }}>
                                <ion-icon name="arrow-back-outline"></ion-icon>
                            </button>
                            <button onClick={() => scrollInfluencers('right')} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff' }}>
                                <ion-icon name="arrow-forward-outline"></ion-icon>
                            </button>
                        </div>
                    </div>

                    <div 
                        ref={influencersRef}
                        style={{ display: 'flex', gap: '32px', overflowX: 'hidden', paddingBottom: '20px' }}
                    >
                        {scrollingInfluencers.map((inf, idx) => (
                            <div key={idx} style={{ minWidth: '280px', flex: 1 }}>
                                <div style={{ aspectRatio: '4/5', background: '#f5f5f7', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden' }}>
                                    {/* Image placeholder */}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 4px' }}>{inf.name}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 12px' }}>{inf.role}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999' }}>Wearing:</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#111' }}>{inf.wearing}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
};

export default Home;
