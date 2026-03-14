import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [placeholder, setPlaceholder] = useState('');

    const placeholderPhrases = [
        "Search 'Dominus'...",
        "Find Fresh Aqua Scents...",
        "Gift Sets for her...",
        "Discover Mestia...",
        "Midnight Collection..."
    ];

    useEffect(() => {
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let timeout;

        const type = () => {
            const currentPhrase = placeholderPhrases[phraseIdx];
            if (isDeleting) {
                setPlaceholder(currentPhrase.substring(0, charIdx--));
            } else {
                setPlaceholder(currentPhrase.substring(0, charIdx++));
            }

            if (!isDeleting && charIdx === currentPhrase.length + 1) {
                isDeleting = true;
                timeout = setTimeout(type, 2000);
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % placeholderPhrases.length;
                timeout = setTimeout(type, 500);
            } else {
                timeout = setTimeout(type, isDeleting ? 50 : 100);
            }
        };

        type();
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="nav-wrapper">
            <header className={`apple-header ${isSearchActive ? 'search-active' : ''}`} id="mainHeader">
                <div className="nav-group left">
                    <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                        <ion-icon name={isMenuOpen ? "close-outline" : "menu-outline"}></ion-icon>
                    </button>
                    <button className="icon-btn" onClick={() => setIsSearchActive(true)} aria-label="Search">
                        <ion-icon name="search-outline"></ion-icon>
                    </button>
                </div>

                <Link to="/" className="logo-text">Brunati</Link>

                <div className="nav-group right">
                    <button className="icon-btn" aria-label="Cart">
                        <ion-icon name="bag-handle-outline"></ion-icon>
                    </button>
                    <button className="icon-btn" aria-label="Account">
                        <ion-icon name="person-outline"></ion-icon>
                    </button>
                </div>

                <div className="header-search-container">
                    <ion-icon name="search-outline" style={{ fontSize: '20px', opacity: 0.5 }}></ion-icon>
                    <input 
                        type="text" 
                        id="searchInput" 
                        placeholder={placeholder} 
                        autoFocus={isSearchActive}
                    />
                    <button className="close-search-btn" onClick={() => setIsSearchActive(false)}>
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>
            </header>

            <nav className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/shop" className="menu-item" onClick={() => setIsMenuOpen(false)}>Shop All Collections</Link>
                <Link to="/new" className="menu-item" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
                <Link to="/bestsellers" className="menu-item" onClick={() => setIsMenuOpen(false)}>Bestsellers</Link>
                <Link to="/discovery" className="menu-item" onClick={() => setIsMenuOpen(false)}>Discovery Sets</Link>
                <Link to="/story" className="menu-item" onClick={() => setIsMenuOpen(false)}>Our Story</Link>
                <Link to="/stores" className="menu-item" onClick={() => setIsMenuOpen(false)}>Store Locator</Link>
            </nav>
        </div>
    );
};

export default Navbar;
