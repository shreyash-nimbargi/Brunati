import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="nav-wrapper">
            <header className={`apple-header ${scrolled ? 'scrolled' : ''}`} id="mainHeader">
                <div className="nav-group left">
                    <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                        <ion-icon name={isMenuOpen ? "close-outline" : "menu-outline"}></ion-icon>
                    </button>
                    {/* Only visible on mobile */}
                    <button className="icon-btn wishlist-mobile-btn" aria-label="Wishlist">
                        <ion-icon name="heart-outline"></ion-icon>
                    </button>
                </div>

                <Link 
                    to="/" 
                    className="logo-text"
                >
                    Brunati
                </Link>

                <div className="nav-group right">
                    {/* Only visible on desktop */}
                    <button className="icon-btn wishlist-desktop-btn" aria-label="Wishlist">
                        <ion-icon name="heart-outline"></ion-icon>
                    </button>
                    <button className="icon-btn" aria-label="Cart">
                        <ion-icon name="bag-handle-outline"></ion-icon>
                    </button>
                    <button className="icon-btn" aria-label="Account">
                        <ion-icon name="person-outline"></ion-icon>
                    </button>
                </div>
            </header>

            <nav className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/shop" className="menu-item" onClick={() => setIsMenuOpen(false)}>Shop all collections</Link>
                <Link to="/bestsellers" className="menu-item" onClick={() => setIsMenuOpen(false)}>Bestsellers</Link>
                <Link to="/discovery" className="menu-item" onClick={() => setIsMenuOpen(false)}>Discovery sets</Link>
                <Link to="/stores" className="menu-item" onClick={() => setIsMenuOpen(false)}>Store locator</Link>
            </nav>

        </div>
    );
};

export default Navbar;
