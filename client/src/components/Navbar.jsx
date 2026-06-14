import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useMode } from '../context/ModeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('veda_theme') || 'light';
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { cartCount } = useCart();
  const { customer } = useAuth();
  const { wishlistCount } = useWishlist();
  const { mode, blogEnabled } = useMode();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('veda_theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileShopOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`navbar-container ${isScrolled ? 'scrolled' : ''} ${!isHomePage ? 'not-home' : ''}`}>
      <div className="navbar-wrapper navbar">
        
        {/* Left Side: Logo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="navbar-left"
        >
          <Link to="/" className="navbar-logo-link">
            <Logo light={true} />
          </Link>
        </motion.div>

        {/* Center: Desktop Menu Items */}
        <motion.div 
          className="navbar-links nav-links"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          
          <div className="nav-item-dropdown">
            <span className={`nav-link dropdown-trigger ${location.pathname.startsWith('/products') ? 'active' : ''}`}>
              Shop <span className="dropdown-caret">▼</span>
            </span>
            <div className="dropdown-menu">
              <Link to="/products" className="dropdown-item">All Products</Link>
              <Link to="/products?category=Basmati Rice" className="dropdown-item">Basmati Rice</Link>
              <Link to="/products?category=Organic Seeds" className="dropdown-item">Organic Seeds</Link>
              <Link to="/products?category=Indian Spices" className="dropdown-item">Indian Spices</Link>
              <Link to="/products?category=Millets %26 Grains" className="dropdown-item">Millets & Grains</Link>
              <Link to="/products?category=Cold Pressed Oils" className="dropdown-item">Cold Pressed Oils</Link>
              <Link to="/products?category=Herbal Products" className="dropdown-item">Herbal Products</Link>
            </div>
          </div>

          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
          {blogEnabled && <Link to="/blog" className={`nav-link ${isActive('/blog')}`}>Blog</Link>}
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
        </motion.div>

        {/* Right Side: Action Icons */}
        <motion.div 
          className="navbar-actions nav-actions"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search Wrapper */}
          <div className="nav-search-wrapper">
            <form onSubmit={handleSearchSubmit} className="nav-search-form">
              <input
                type="text"
                placeholder="Search..."
                className="nav-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="nav-search-btn"
                aria-label="Search"
              >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>
          </div>

          {/* Theme Switcher Button */}
          <button onClick={toggleTheme} className="nav-icon-btn theme-toggle-btn" aria-label="Toggle Theme">
            {theme === 'light' ? (
              /* Moon Icon */
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              /* Sun Icon */
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* User/Login */}
          <Link to={customer ? "/profile" : "/login"} className="nav-icon-btn" aria-label="Customer Profile/Login">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Wishlist */}
          {mode === 'B2C' && (
            <Link to="/wishlist" className="nav-icon-btn hide-on-mobile" aria-label="Wishlist">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className="nav-cart-badge" style={{ backgroundColor: '#D4AF37', color: '#064E3B' }}>{wishlistCount}</span>}
            </Link>
          )}

          {/* Cart */}
          {mode === 'B2C' && (
            <Link to="/cart" className="nav-icon-btn nav-cart-btn" aria-label="Cart">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            </Link>
          )}

          {/* Hamburger Menu Icon */}
          <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle Menu">
            <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
          </button>
        </motion.div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <Logo light={true} />
          <button className="mobile-drawer-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mobile-drawer-links">
          <Link to="/" className={`mobile-nav-link ${isActive('/')}`}>Home</Link>
          
          {/* Mobile SHOP Expandable Accordion */}
          <div className="mobile-dropdown-wrapper">
            <button 
              className="mobile-dropdown-btn" 
              onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
            >
              Shop <span className={`caret ${isMobileShopOpen ? 'rotated' : ''}`}>▼</span>
            </button>
            {isMobileShopOpen && (
              <div className="mobile-dropdown-items">
                <Link to="/products" className="mobile-dropdown-item">All Products</Link>
                <Link to="/products?category=Basmati Rice" className="mobile-dropdown-item">Basmati Rice</Link>
                <Link to="/products?category=Organic Seeds" className="mobile-dropdown-item">Organic Seeds</Link>
                <Link to="/products?category=Indian Spices" className="mobile-dropdown-item">Indian Spices</Link>
                <Link to="/products?category=Millets %26 Grains" className="mobile-dropdown-item">Millets & Grains</Link>
                <Link to="/products?category=Cold Pressed Oils" className="mobile-dropdown-item">Cold Pressed Oils</Link>
                <Link to="/products?category=Herbal Products" className="mobile-dropdown-item">Herbal Products</Link>
              </div>
            )}
          </div>

          <Link to="/about" className={`mobile-nav-link ${isActive('/about')}`}>About</Link>
          {blogEnabled && <Link to="/blog" className={`mobile-nav-link ${isActive('/blog')}`}>Blog</Link>}
          <Link to="/contact" className={`mobile-nav-link ${isActive('/contact')}`}>Contact</Link>
          
          {/* Theme switcher for mobile */}
          <button onClick={toggleTheme} className="mobile-nav-link" style={{ background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Theme: {theme === 'light' ? 'Dark' : 'Light'}
          </button>

          <hr style={{ border: '0', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '15px 0' }} />
          
          {mode === 'B2C' && <Link to="/wishlist" className={`mobile-nav-link ${isActive('/wishlist')}`}>Wishlist ({wishlistCount})</Link>}
          {mode === 'B2C' && <Link to="/cart" className={`mobile-nav-link ${isActive('/cart')}`}>Cart ({cartCount})</Link>}
          <Link to={customer ? "/profile" : "/login"} className={`mobile-nav-link ${isActive('/profile') || isActive('/login')}`}>
            {customer ? "My Profile" : "Login / Register"}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
