import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <header className="hero-container">
      <div className="hero-overlay"></div>
      <div className="hero-content container animate-fade-in">
        <span className="hero-badge">PREMIUM INDIAN EXPORT</span>
        <h1 className="hero-title">
          Delivering India's <br />
          <span>Natural Goodness</span> Globally
        </h1>
        <p className="hero-subtitle">
          Sourcing the finest Rice, Spices, Seeds, Millets, and Cold Pressed Oils from India's fertile fields directly to international markets with guaranteed purity.
        </p>
        <div className="hero-actions">
          <Link to="/products" className="btn-primary">
            Our Products
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
          <Link to="/contact" className="btn-secondary">
            Enquire Now
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Hero;
