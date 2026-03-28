import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { useStorefront } from '../../context/StorefrontContext';

const Hero = () => {
<<<<<<< Updated upstream
    const slides = [
        { id: 1, title: 'MISTIA', subtitle: 'An ethereal and captivating blend' },
        { id: 2, title: 'DOMINUS', subtitle: 'Commanding and powerful presence' },
        { id: 3, title: 'AQUA', subtitle: 'Fresh, vibrant, and deep oceanic notes' },
        { id: 4, title: 'MIDNIGHT', subtitle: 'A deep, mysterious evening experience' },
        { id: 5, title: 'DUSK', subtitle: 'Warm, woody notes for the bold' },
    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
=======
    const { topPhotos: originalSlides } = useStorefront();
    
    if (!originalSlides || originalSlides.length === 0) return null;
    
    // TRULY INFINITE SCROLL:
    // Append the last slide to the front, and the first slide to the back
    // Layout: [Clone DUSK] - [MISTIA] - [DOMINUS] - [AQUA] - [MIDNIGHT] - [DUSK] - [Clone MISTIA]
    // Index:      0             1           2          3           4         5           6
    const slides = [
        { ...(originalSlides[originalSlides.length - 1] || {}), id: 'clone-end' },
        ...(originalSlides || []),
        { ...(originalSlides[0] || {}), id: 'clone-start' }
    ];
    
    // Start at real MISTIA (Index 1)
    const [currentIndex, setCurrentIndex] = useState(1);
>>>>>>> Stashed changes
    const sliderRef = useRef(null);

    const handleScroll = () => {
        if (!sliderRef.current) return;
        const target = sliderRef.current;
        const maxScroll = target.scrollWidth - target.clientWidth;
        const progress = maxScroll > 0 ? (target.scrollLeft / maxScroll) : 0;
        setScrollProgress(progress);

        const slideWidth = target.offsetWidth;
        const newIndex = Math.round(target.scrollLeft / slideWidth);
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (sliderRef.current) {
                const nextIndex = (currentIndex + 1) % slides.length;
                const slideWidth = sliderRef.current.offsetWidth;
                sliderRef.current.scrollTo({
                    left: nextIndex * slideWidth,
                    behavior: 'smooth'
                });
            }
        }, 5000); // Auto-advance every 5 seconds
        
        return () => clearInterval(interval);
    }, [currentIndex, slides.length]);

    return (
        <section className="hero-poster">
            <div 
                className="hero-slider-container" 
                ref={sliderRef}
                onScroll={handleScroll}
            >
                {slides.map((slide) => (
                    <div key={slide.id} className="hero-slide placeholder-dark">
                        <div className="hero-slide-content">
                            <h2 className="hero-slide-title">{slide.title}</h2>
                            <p className="hero-slide-subtitle">{slide.subtitle}</p>
                            <button className="hero-slide-btn">Shop Collection</button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="hero-scrollbar-track">
                <div 
                    className="hero-scrollbar-thumb"
                    style={{ 
                        width: `${100 / slides.length}%`, 
                        transform: `translateX(${scrollProgress * (slides.length - 1) * 100}%)` 
                    }}
                />
            </div>
        </section>
    );
};

export default Hero;
