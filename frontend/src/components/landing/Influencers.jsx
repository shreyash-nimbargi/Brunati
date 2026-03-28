import React from 'react';
import { useStorefront } from '../../context/StorefrontContext';

const Influencers = () => {
    const { influencers: rawInfluencers } = useStorefront();
    const influencerData = rawInfluencers && rawInfluencers.length > 0 ? rawInfluencers : [];

    return (
        <section className="influencers-section">
            <div className="section-header">
                <h2 className="section-title">Influencers</h2>
            </div>
            <div className="influencers-container">
                <div className="influencers-grid">
                    {influencerData.map((inf, idx) => (
                        <div key={idx} className="influencer-card">
                            <div className="influencer-image-placeholder">
                                {/* Image left blank as requested */}
                            </div>
                            <div className="influencer-details">
                                <h3 className="inf-name">{inf.name}</h3>
                                <p className="inf-profession">{inf.role}</p>
                                <p className="inf-wearing">{inf.wearing}</p>
                            </div>
                        </div>
                    ))}
                    <div className="carousel-arrow">
                        <span>→</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Influencers;
