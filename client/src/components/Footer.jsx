import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { useMode } from '../context/ModeContext';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { blogEnabled } = useMode();

  // Replaced smooth scroll click with direct route navigation

  return (
    <footer className="footer-container">
      <motion.div 
        className="footer-content container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Logo light={true} />
          </Link>
          <p className="footer-tagline" style={{ marginTop: '15px', textAlign: 'center' }}>
            “Delivering India’s Natural Goodness Globally”
          </p>
          <p className="footer-desc">
            Veda Global is a premier exporter of organic agricultural goods. We preserve natural crop potency, sourcing directly from domestic farms to international markets under certified labs.
          </p>
        </div>

        <div className="footer-links-group">
          <h3>Useful Links</h3>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/return-refund">Refund Policy</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h3>Brand</h3>
          <ul>
            {blogEnabled && <li><Link to="/blog">Blog</Link></li>}
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/products">Our Product</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/products?category=Basmati Rice">Basmati Rice</Link></li>
            <li><Link to="/products?category=Organic Seeds">Organic Seeds</Link></li>
            <li><Link to="/products?category=Indian Spices">Indian Spices</Link></li>
            <li><Link to="/products?category=Millets %26 Grains">Millets & Grains</Link></li>
            <li><Link to="/products?category=Cold Pressed Oils">Cold Pressed Oils</Link></li>
            <li><Link to="/products?category=Herbal Products">Herbal Products</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p><strong>Address:</strong> Phase-II Export Terminal, New Delhi, India</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Email:</strong> info@vedaglobal.com</p>
        </div>
      </motion.div>

      <div className="footer-bottom">
        <div className="container footer-bottom-layout">
          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="X/Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
          </div>
          <div className="footer-copyright-text">
            &copy; {new Date().getFullYear()} Veda Global. Sourced with care from India's organic farmers.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
