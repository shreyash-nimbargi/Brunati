import React from 'react';

const Hero = () => {
    return (
        <section className="hero-poster">
            <video autoPlay muted loop playsInline poster="/media/banner/1.png">
                <source src="/media/banner/1.mp4" type="video/mp4" />
            </video>
        </section>
    );
};

export default Hero;
