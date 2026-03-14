import React from 'react';

const ScentArt = () => {
    return (
        <section className="middle-poster content-wrap">
            <div className="section-header">
                <h2 className="section-title">The Art of Scent</h2>
                <p className="section-subtitle" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    Explore a symphony of olfactory notes, meticulously crafted for the modern visionary who demands excellence.
                </p>
            </div>
            
            <div className="scent-carousel-base">
                <div className="scent-track">
                    {[
                        "media/mistia/1.png",
                        "media/midnight/1.png",
                        "media/dusk/1.png",
                        "media/dominus/1.png",
                        "media/aqua/1.png",
                        "media/mistia/1.png",
                        "media/midnight/1.png",
                        "media/dusk/1.png",
                        "media/dominus/1.png",
                        "media/aqua/1.png"
                    ].map((img, idx) => (
                        <div key={idx} className="scent-slide-wrapper">
                            <img src={img} className="scent-slide-img" alt={`Scent ${idx}`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ScentArt;
