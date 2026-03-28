import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const wishlistCount = wishlistItems ? wishlistItems.length : 0;

    return (
        <div className="nav-wrapper">
            <header className={`apple-header ${scrolled ? 'scrolled' : ''}`} id="mainHeader">
                <div className="nav-group left">
                    <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                        <ion-icon name={isMenuOpen ? "close-outline" : "menu-outline"}></ion-icon>
                    </button>
                    {/* wishlist-mobile-btn */}
                    <Link to="/wishlist" className="icon-btn wishlist-mobile-btn" aria-label="Wishlist">
                        <ion-icon name="heart-outline"></ion-icon>
                        {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
                    </Link>
                </div>

                <Link to="/" className="logo-text">Brunati</Link>

                <div className="nav-group right">
                    <Link to="/wishlist" className="icon-btn wishlist-desktop-btn" aria-label="Wishlist">
                        <ion-icon name="heart-outline"></ion-icon>
                        {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
                    </Link>
                    <Link to="/cart" className="icon-btn" aria-label="Cart">
                        <ion-icon name="bag-handle-outline"></ion-icon>
                        {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
                    </Link>
                    <Link to="/account" className="icon-btn" aria-label="Account">
                        <ion-icon name="person-outline"></ion-icon>
                    </Link>
                </div>
            </header>

            <nav className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/account" className="menu-item" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                <Link to="/" className="menu-item" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/cart" className="menu-item" onClick={() => setIsMenuOpen(false)}>Shopping Cart</Link>
                <Link to="/wishlist" className="menu-item" onClick={() => setIsMenuOpen(false)}>My Wishlist</Link>
            </nav>
        </div>
    );
};

export default Navbar;
