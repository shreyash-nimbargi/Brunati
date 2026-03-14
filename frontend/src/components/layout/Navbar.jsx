import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="nav-wrapper">
            <header className="apple-header" id="mainHeader">
                <div className="nav-group left">
                    <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                        <ion-icon name={isMenuOpen ? "close-outline" : "menu-outline"}></ion-icon>
                    </button>
                    <button className="icon-btn" aria-label="Wishlist">
                        <ion-icon name="heart-outline"></ion-icon>
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
