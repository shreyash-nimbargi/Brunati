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
    
    // TRULY INFINITE SCROLL:
    // Append the last slide to the front, and the first slide to the back
    // Layout: [Clone DUSK] - [MISTIA] - [DOMINUS] - [AQUA] - [MIDNIGHT] - [DUSK] - [Clone MISTIA]
    // Index:      0             1           2          3           4         5           6
    const slides = [
        { ...originalSlides[originalSlides.length - 1], id: 'clone-end' },
        ...originalSlides,
        { ...originalSlides[0], id: 'clone-start' }
    ];
    
    // Start at real MISTIA (Index 1)
    const [currentIndex, setCurrentIndex] = useState(1);
    const sliderRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const initializedRef = useRef(false);

    // Initial setup to jump to real MISTIA
    useEffect(() => {
        if (sliderRef.current && !initializedRef.current) {
            const slideWidth = sliderRef.current.offsetWidth;
            sliderRef.current.scrollLeft = slideWidth; // Jump to index 1 initially
            initializedRef.current = true;
        }
    }, []);

    const handleScroll = () => {
        if (!sliderRef.current) return;
        const slideWidth = sliderRef.current.offsetWidth;
        if (slideWidth === 0) return;

        const scrollPos = sliderRef.current.scrollLeft;
        const newIndex = Math.round(scrollPos / slideWidth);
        
        // Update the visual index state continuously so dots keep track
        if (currentIndex !== newIndex) {
            setCurrentIndex(newIndex);
        }

        // Clear previous timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Wait to detect when scrolling completely finishes
        scrollTimeoutRef.current = setTimeout(() => {
            if (!sliderRef.current) return;
            const currentPos = sliderRef.current.scrollLeft;
            const snappedIndex = Math.round(currentPos / slideWidth);

            if (snappedIndex === 0) {
                // Snapped to first clone (Clone DUSK), teleport to real DUSK
                const realDuskIndex = originalSlides.length; // Index 5
                sliderRef.current.style.scrollSnapType = 'none'; // Temporarily disable snapping to avoid bounce
                sliderRef.current.scrollLeft = realDuskIndex * slideWidth;
                setCurrentIndex(realDuskIndex);
                setTimeout(() => {
                    if (sliderRef.current) sliderRef.current.style.scrollSnapType = 'x mandatory';
                }, 50);
            } 
            else if (snappedIndex === slides.length - 1) {
                // Snapped to last clone (Clone MISTIA), teleport to real MISTIA
                const realMistiaIndex = 1; // Index 1
                sliderRef.current.style.scrollSnapType = 'none';
                sliderRef.current.scrollLeft = realMistiaIndex * slideWidth;
                setCurrentIndex(realMistiaIndex);
                setTimeout(() => {
                    if (sliderRef.current) sliderRef.current.style.scrollSnapType = 'x mandatory';
                }, 50);
            }
        }, 150); // Adjust debounce timer to ensure snapping is concluded
    };

    // Auto-advance
    useEffect(() => {
        const interval = setInterval(() => {
            if (!sliderRef.current) return;
            const slideWidth = sliderRef.current.offsetWidth;
            
            let nextIndex = currentIndex + 1;
            sliderRef.current.scrollTo({
                left: nextIndex * slideWidth,
                behavior: 'smooth'
            });
        }, 5000); // 5 seconds interval
        
        return () => clearInterval(interval);
        // Interval reset when currentIndex changes (like when teleport happens) 
        // to prevent instant double-scroll right after a swap.
    }, [currentIndex]);

    // Calculate which dot is active based on real slides mapping
    let activeDotIndex = 0;
    if (currentIndex === 0) {
        activeDotIndex = originalSlides.length - 1; // Show DUSK dot
    } else if (currentIndex === slides.length - 1) {
        activeDotIndex = 0; // Show MISTIA dot
    } else {
        activeDotIndex = currentIndex - 1; 
    }

    const goToSlide = (dotIndex) => {
        if (!sliderRef.current) return;
        const targetIndex = dotIndex + 1; // Offset by 1 because of clone
        sliderRef.current.scrollTo({
            left: targetIndex * sliderRef.current.offsetWidth,
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
