import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { bannerService } from '../../services/bannerService';

const Hero = () => {
    const [originalSlides, setOriginalSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await bannerService.getActiveBanners();
                if (res.status && res.data.length > 0) {
                    setOriginalSlides(res.data);
                } else {
                    // FALLBACK: Match exactly with StorefrontContext defaults
                    setOriginalSlides([
                        { id: 1, title: 'MISTIA', subtitle: 'An ethereal and captivating blend', imageUrl: 'media/mistia/1.png' },
                        { id: 2, title: 'DOMINUS', subtitle: 'Commanding and powerful presence', imageUrl: 'media/dominus/1.png' },
                        { id: 3, title: 'AQUA', subtitle: 'Fresh, vibrant, and deep oceanic notes', imageUrl: 'media/aqua/1.png' },
                        { id: 4, title: 'MIDNIGHT', subtitle: 'A deep, mysterious evening experience', imageUrl: 'media/midnight/1.png' },
                        { id: 5, title: 'DUSK', subtitle: 'Warm, woody notes for the bold', imageUrl: 'media/dusk/1.png' }
                    ]);
                }
            } catch (err) {
                console.error('Hero banner fetch failed:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // TRULY INFINITE SCROLL:
    // Append the last slide to the front, and the first slide to the back
    const slides = originalSlides.length > 0 ? [
        { ...originalSlides[originalSlides.length - 1], id: 'clone-end' },
        ...originalSlides,
        { ...originalSlides[0], id: 'clone-start' }
    ] : [];
    
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasMounted, setHasMounted] = useState(false);
    const sliderRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        setHasMounted(true);
        if (sliderRef.current && !initializedRef.current && slides.length > 0) {
            const slideWidth = sliderRef.current.offsetWidth;
            if (slideWidth > 0) {
                sliderRef.current.scrollLeft = slideWidth;
                initializedRef.current = true;
            }
        }
    }, [slides]);

    const handleScroll = () => {
        if (!sliderRef.current || slides.length === 0) return;
        const slideWidth = sliderRef.current.offsetWidth;
        if (slideWidth === 0) return;

        const scrollPos = sliderRef.current.scrollLeft;
        const newIndex = Math.round(scrollPos / slideWidth);
        
        if (currentIndex !== newIndex) {
            setCurrentIndex(newIndex);
        }

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            if (!sliderRef.current) return;
            const snappedIndex = Math.round(sliderRef.current.scrollLeft / slideWidth);

            if (snappedIndex === 0) {
                const realEndIndex = originalSlides.length;
                sliderRef.current.scrollLeft = realEndIndex * slideWidth;
                setCurrentIndex(realEndIndex);
            } 
            else if (snappedIndex === slides.length - 1) {
                const realStartIndex = 1;
                sliderRef.current.scrollLeft = realStartIndex * slideWidth;
                setCurrentIndex(realStartIndex);
            }
        }, 50);
    };

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            if (!sliderRef.current) return;
            const slideWidth = sliderRef.current.offsetWidth;
            let nextIndex = currentIndex + 1;
            sliderRef.current.scrollTo({
                left: nextIndex * slideWidth,
                behavior: 'smooth'
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, slides]);

    let activeDotIndex = 0;
    if (originalSlides.length > 0) {
        if (currentIndex === 0) activeDotIndex = originalSlides.length - 1;
        else if (currentIndex === slides.length - 1) activeDotIndex = 0;
        else activeDotIndex = currentIndex - 1;
    }

    const goToSlide = (dotIndex) => {
        if (!sliderRef.current) return;
        const targetIndex = dotIndex + 1;
        sliderRef.current.scrollTo({
            left: targetIndex * sliderRef.current.offsetWidth,
            behavior: 'smooth'
        });
    };

    if (isLoading) return <div className="h-[80vh] bg-black flex items-center justify-center text-white/20 font-bold tracking-widest">BRUNATI</div>;

    return (
        <section className="hero-poster">
            <div 
                className="hero-slider-container" 
                ref={sliderRef}
                onScroll={handleScroll}
            >
                {slides.map((slide, idx) => {
                    const bUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                    const img = slide.imageUrl ? (slide.imageUrl.startsWith('http') ? slide.imageUrl : `${bUrl}/${slide.imageUrl}`) : null;
                    
                    return (
                        <div key={`${slide._id || slide.id}-${idx}`} className="hero-slide placeholder-dark">
                            {img && <img src={img} className="absolute inset-0 w-full h-full object-cover opacity-60" alt={slide.title} />}
                            {(slide.title || slide.subtitle) && (
                                <div className="hero-slide-content relative z-10">
                                    {slide.title && <h2 className="hero-slide-title">{slide.title}</h2>}
                                    {slide.subtitle && <p className="hero-slide-subtitle">{slide.subtitle}</p>}
                                    <button className="hero-slide-btn">Shop Collection</button>
                                </div>
                            )}
                        </div>
                    );
                })}
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
