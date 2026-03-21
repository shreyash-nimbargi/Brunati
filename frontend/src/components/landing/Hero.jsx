import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

const Hero = () => {
    const originalSlides = [
        { id: 1, title: 'MISTIA', subtitle: 'An ethereal and captivating blend' },
        { id: 2, title: 'DOMINUS', subtitle: 'Commanding and powerful presence' },
        { id: 3, title: 'AQUA', subtitle: 'Fresh, vibrant, and deep oceanic notes' },
        { id: 4, title: 'MIDNIGHT', subtitle: 'A deep, mysterious evening experience' },
        { id: 5, title: 'DUSK', subtitle: 'Warm, woody notes for the bold' },
    ];
    
    // Add a cloned slide at the end for continuous forward scrolling
    const slides = [...originalSlides, { ...originalSlides[0], id: 'clone-start' }];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);

    const handleScroll = () => {
        if (!sliderRef.current) return;
        const slideWidth = sliderRef.current.offsetWidth;
        if (slideWidth > 0) {
            const newIndex = Math.round(sliderRef.current.scrollLeft / slideWidth);
            setCurrentIndex(newIndex);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!sliderRef.current) return;
            const slideWidth = sliderRef.current.offsetWidth;
            
            let nextIndex = currentIndex + 1;
            
            if (nextIndex >= slides.length) {
                // We are at the cloned slide (index 5), so it's time to jump to slide 1
                sliderRef.current.style.scrollBehavior = 'auto';
                sliderRef.current.scrollLeft = 0; // Jump silently to the real first slide (index 0)
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (sliderRef.current) {
                            sliderRef.current.style.scrollBehavior = 'smooth';
                            sliderRef.current.scrollTo({
                                left: slideWidth, // Smooth scroll to the second slide (index 1)
                                behavior: 'smooth'
                            });
                        }
                    });
                });
            } else {
                sliderRef.current.style.scrollBehavior = 'smooth';
                sliderRef.current.scrollTo({
                    left: nextIndex * slideWidth,
                    behavior: 'smooth'
                });
            }
        }, 5000); // Auto-advance every 5 seconds
        
        return () => clearInterval(interval);
    }, [currentIndex, slides.length]);

    const activeDotIndex = currentIndex % originalSlides.length;

    const goToSlide = (dotIndex) => {
        if (!sliderRef.current) return;
        sliderRef.current.style.scrollBehavior = 'smooth';
        sliderRef.current.scrollTo({
            left: dotIndex * sliderRef.current.offsetWidth,
            behavior: 'smooth'
        });
    };

    return (
        <section className="hero-poster">
            <div 
                className="hero-slider-container" 
                ref={sliderRef}
                onScroll={handleScroll}
            >
                {slides.map((slide, idx) => (
                    <div key={`${slide.id}-${idx}`} className="hero-slide placeholder-dark">
                        <div className="hero-slide-content">
                            <h2 className="hero-slide-title">{slide.title}</h2>
                            <p className="hero-slide-subtitle">{slide.subtitle}</p>
                            <button className="hero-slide-btn">Shop Collection</button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="hero-slider-dots">
                {originalSlides.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`hero-dot ${activeDotIndex === idx ? 'active' : ''}`}
                        onClick={() => goToSlide(idx)}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
