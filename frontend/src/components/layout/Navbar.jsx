import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Verify Authentication to map Header action destination
        userService.checkAuth().then(res => {
            if (res.status && res.isLoggedIn) {
                setIsLoggedIn(true);
            }
        }).catch(err => {
            console.error("Auth check failed in Navbar", err);
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="nav-wrapper">
            <header className={`apple-header ${scrolled ? 'scrolled' : ''}`} id="mainHeader">
                <div className="nav-group left">
                    <button className="icon-btn menu-toggle-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                        <ion-icon name={isMenuOpen ? "close-outline" : "menu-outline"}></ion-icon>
                    </button>
                    {/* Mobile wishlist → /wishlist */}
                    <Link to="/wishlist" className="icon-btn wishlist-mobile-btn" aria-label="Wishlist">
                        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ion-icon name="heart-outline"></ion-icon>
                            {wishlistCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: -6, right: -8,
                                    background: '#D4AF37', color: '#000',
                                    borderRadius: '50%', width: 15, height: 15,
                                    fontSize: 8, fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    lineHeight: 1, pointerEvents: 'none',
                                }}>
                                    {wishlistCount}
                                </span>
                            )}
                        </span>
                    </Link>
                </div>

                <Link to="/" className="logo-text">Brunati</Link>

                <div className="nav-group right pr-6">
                    {/* Desktop wishlist → /wishlist */}
                    <Link to="/wishlist" className="icon-btn wishlist-desktop-btn" aria-label="Wishlist">
                        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ion-icon name="heart-outline"></ion-icon>
                            {wishlistCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: -6, right: -8,
                                    background: '#D4AF37', color: '#000',
                                    borderRadius: '50%', width: 15, height: 15,
                                    fontSize: 8, fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    lineHeight: 1, pointerEvents: 'none',
                                }}>
                                    {wishlistCount}
                                </span>
                            )}
                        </span>
                    </Link>
                    <Link to="/cart" className="icon-btn" aria-label="Cart">
                        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ion-icon name="bag-handle-outline"></ion-icon>
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: -6, right: -8,
                                    background: '#D4AF37', color: '#000',
                                    borderRadius: '50%', width: 15, height: 15,
                                    fontSize: 8, fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    lineHeight: 1, pointerEvents: 'none',
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </span>
                    </Link>
                    <button 
                        onClick={() => navigate(isLoggedIn ? "/account" : "/signin")} 
                        className="icon-btn" 
                        aria-label="Account"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
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
