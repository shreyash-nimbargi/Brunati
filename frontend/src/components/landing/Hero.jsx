import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { useStorefront } from '../../context/StorefrontContext';

const Hero = () => {
    const { topPhotos: originalSlides } = useStorefront();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const sliderRef = useRef(null);

    const slides = originalSlides || [];
    
    if (slides.length === 0) return null;

    const handleScroll = () => {
        if (!sliderRef.current) return;
        const target = sliderRef.current;
        const maxScroll = target.scrollWidth - target.clientWidth;
        const progress = maxScroll > 0 ? (target.scrollLeft / maxScroll) : 0;
        setScrollProgress(progress);

        const slideWidth = target.offsetWidth || 1;
        const newIndex = Math.round(target.scrollLeft / slideWidth);
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (sliderRef.current && slides.length > 1) {
                const nextIndex = (currentIndex + 1) % slides.length;
                const slideWidth = sliderRef.current.offsetWidth;
                sliderRef.current.scrollTo({
                    left: nextIndex * slideWidth,
                    behavior: 'smooth'
                });
            }
        }, 5000); 
        
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
                        <div key={slide.id} className="hero-slide placeholder-dark" style={{ backgroundImage: slide.image ? `url(${slide.image.startsWith('/') ? slide.image : '/' + slide.image})` : 'none' }}>
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
                        width: `${100 / (slides.length || 1)}%`, 
                        transform: `translateX(${scrollProgress * ((slides.length - 1) || 0) * 100}%)` 
                    }}
                />
            </div>
        </section>
    );
};

export default Hero;
