import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutFlow from '../components/checkout/CheckoutFlow';
import { useCart } from '../context/CartContext';
import { userService } from '../services/userService';

const CheckoutRoute = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const state = location.state || {};
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const validateAccessAndCheckAuth = async () => {
            // 1. Check if the user is following proper steps (clicked a button)
            const hasValidState = state.fromCheckout || state.isDirectBuy;
            const hasItems = cartItems.length > 0 || state.isDirectBuy;

            if (!hasValidState || !hasItems) {
                navigate('/cart', { replace: true });
                return;
            }

            // 2. Security: Ensure user is logged in
            try {
                const authRes = await userService.checkAuth();
                if (!authRes.isLoggedIn) {
                    // Redirect to signin, passing the current state back so they don't lose their "Direct Buy" product info
                    navigate('/signin', { 
                        replace: true, 
                        state: { 
                            redirect: location.pathname, 
                            redirectState: state 
                        } 
                    });
                } else {
                    setIsAuthorized(true);
                }
            } catch (err) {
                console.error("Auth check failed in CheckoutRoute", err);
                navigate('/cart', { replace: true });
            }
        };

        validateAccessAndCheckAuth();
    }, [state, cartItems, navigate, location.pathname]);

    if (!isAuthorized) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', color: '#6e6e73' }}>Securing checkout session...</p>
            </div>
        );
    }

    return (
        <CheckoutFlow 
            isOpen={true} 
            onClose={() => navigate(-1)}
            isDirectBuy={state.isDirectBuy || false} 
            directBuyProduct={state.directBuyProduct || null} 
        />
    );
};

export default CheckoutRoute;
