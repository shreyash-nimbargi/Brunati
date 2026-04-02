import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AccountDashboard from './pages/AccountDashboard';
import CheckoutRoute from './pages/CheckoutRoute';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { StorefrontProvider } from './context/StorefrontContext';
import AdminLayout from './admin/AdminLayout.jsx';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './admin/pages/AdminLogin.jsx';

function App() {
  React.useEffect(() => {
    let keyBuffer = '';
    let timeoutId;

    const handleKeyDown = (e) => {
      if (!e.key) return; // Safety check
      clearTimeout(timeoutId);
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 7) {
        keyBuffer = keyBuffer.slice(-7);
      }

      if (keyBuffer === 'brunati') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user_auth');
        window.open('/admin/login', '_blank');
      }

      timeoutId = setTimeout(() => {
        keyBuffer = '';
      }, 3000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Router>
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 20000 }}
        toastOptions={{
          duration: 5000,
        }}
      />
      <StorefrontProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                {/* 
                  Admin Route 
                  Hidden management route behind secret key sequence.
                */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/*" element={<AdminLayout />} />

                {/* Storefront Routes */}
                <Route
                  path="/*"
                  element={
                    <div className="App flex flex-col min-h-screen relative">
                      <Navbar />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/product/:slug" element={<ProductDetail />} />

                          <Route path="/signin" element={<Signin />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/account" element={<AccountDashboard />} />
                          <Route path="/checkout" element={<CheckoutRoute />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  }
                />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </StorefrontProvider>
    </Router>
  );
}

export default App;
