import React from 'react';

const Story = () => {
    return (
        <section className="story-section">
            <div className="story-grid">
                <div className="story-img-wrap">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200" alt="Founder Julian Brunati" />
                </div>
                <div className="story-content">
                    <span className="story-label">The Heritage</span>
                    <h2 className="story-title">Crafting the Essence of Modern Luxury</h2>
                    <p className="story-text">
                        Founded by Julian Brunati, our fragrance house was born from a singular vision: to bridge the gap between ancient Italian perfumery traditions and contemporary minimalist aesthetics.
                    </p>
                    <p className="story-text">
                        Every bottle tells a story of travel, emotion, and the relentless pursuit of the perfect note.
                    </p>
                    <div className="founder-sig">
                        <p className="founder-name">Julian Brunati</p>
                        <p className="founder-role">Founder & Lead Nose</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Story;
