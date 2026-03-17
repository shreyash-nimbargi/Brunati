import React from 'react';
import './OlfactoryTrends.css';

const OlfactoryTrends = () => {
    const trends = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Mock array for 10 cards

    return (
        <section className="olfactory-trends-section">
            <h2 className="section-title text-center">Olfactory Trends</h2>
            <div className="trends-scroll-container">
                {trends.map((item, idx) => (
                    <div key={idx} className="trend-card">
                        <div className="trend-main-image placeholder-dark"></div>
                        <div className="trend-bottom-area">
                            <div className="trend-small-image placeholder-light">
                                <span role="img" aria-label="perfume">🧴</span>
                            </div>
                            <button className="trend-buy-btn">Buy Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OlfactoryTrends;
