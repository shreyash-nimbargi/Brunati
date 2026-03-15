import React, { useRef, useEffect } from 'react';

const ScentArt = () => {
    const scrollRef = useRef(null);

    useEffect(() => {
        let animationFrameId;
        const container = scrollRef.current;
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

    return (
        <section className="middle-poster content-wrap">
            <div className="section-header">
                <h2 className="section-title">The Art of Scent</h2>
                <p className="section-subtitle" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    Explore a symphony of olfactory notes, meticulously crafted for the modern visionary who demands excellence.
                </p>
            </div>
            
            <div className="scent-carousel-base" ref={scrollRef}>
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
