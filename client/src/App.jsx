import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layout/PublicLayout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import FAQ from './pages/FAQ';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnRefundPolicy from './pages/ReturnRefundPolicy';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Testimonials from './pages/Testimonials';

import ModeSwitch from './components/ModeSwitch';
import CartDrawer from './components/CartDrawer';
import CookiesPopup from './components/CookiesPopup';
import { useCart } from './context/CartContext';
import { useMode } from './context/ModeContext';

import ScrollToTop from './components/ScrollToTop';

import './styles/responsive.css';

// Route Protection Wrapper for Admin
const ProtectedAdminRoute = ({ children }) => {
  const adminInfo = localStorage.getItem('adminInfo');
  if (!adminInfo) {
    return <Navigate to="/admin" replace />;
  }
  try {
    const parsed = JSON.parse(adminInfo);
    if (!parsed || parsed.email !== 'admin@vedaglobal.com' || !parsed.token) {
      localStorage.removeItem('adminInfo');
      return <Navigate to="/admin" replace />;
    }
  } catch (e) {
    localStorage.removeItem('adminInfo');
    return <Navigate to="/admin" replace />;
  }
  return children;
};

function App() {
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { mode, blogEnabled } = useMode();

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        
        <Routes>
          {/* Public Pages wrapped in PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={blogEnabled ? <Blog /> : <Navigate to="/" replace />} />
            <Route path="/blog/:slug" element={blogEnabled ? <BlogDetails /> : <Navigate to="/" replace />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cart" element={mode === 'B2B' ? <Navigate to="/" replace /> : <Cart />} />
            <Route path="/checkout" element={mode === 'B2B' ? <Navigate to="/" replace /> : <Checkout />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/return-refund" element={<ReturnRefundPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={mode === 'B2B' ? <Navigate to="/" replace /> : <Wishlist />} />
            <Route path="/testimonials" element={<Testimonials />} />
          </Route>

          {/* Admin routes - separate layouts */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/products" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/blogs" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/customers" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/enquiries" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        </Routes>

        {/* Global floating B2B/B2C Switch */}
        <ModeSwitch />

        {/* Slide-out Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Cookies Consent Popup */}
        <CookiesPopup />
      </div>
    </Router>
  );
}

export default App;
