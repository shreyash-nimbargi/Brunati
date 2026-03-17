import React from 'react';

const Influencers = () => {
    const influencerData = [
        {
            name: "KATRINA KAIF",
            profession: "INDIAN ACTRESS",
            wearing: "ILLUMINATI"
        },
        {
            name: "RAFTAAR",
            profession: "MUSICIAN, HIP HOP",
            wearing: "ILLUMINATI"
        },
        {
            name: "PANTHER",
            profession: "MUSICIAN, HIP HOP",
            wearing: "UM VISION"
        },
        {
            name: "SHANAYA KAPOOR",
            profession: "INDIAN ACTRESS",
            wearing: "NINJA NATION // 001"
        }
    ];

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
                                <p className="inf-profession">{inf.profession}</p>
                                <p className="inf-wearing">WEARING: {inf.wearing}</p>
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
