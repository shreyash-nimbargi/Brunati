import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminLayout from './admin/AdminLayout.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 20000 }}
        toastOptions={{
          duration: 5000,
        }}
      />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Admin Route */}
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
    </Router>
  );
}

export default App;
