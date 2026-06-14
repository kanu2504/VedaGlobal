import React from 'react';

const Logo = ({ light = false }) => {
  return (
    <div className="brand-logo-container">
      <svg 
        className="logo-icon-svg" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Globe Outline */}
        <circle 
          cx="50" 
          cy="55" 
          r="30" 
          stroke={light ? "#F7F2E8" : "#064E3B"} 
          strokeWidth="3.5" 
          strokeDasharray="4 2"
        />
        {/* Latitude Arcs */}
        <path 
          d="M23 45C35 52 65 52 77 45" 
          stroke={light ? "#F7F2E8" : "#064E3B"} 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />
        <path 
          d="M21 57C34 66 66 66 79 57" 
          stroke={light ? "#F7F2E8" : "#064E3B"} 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />
        {/* Longitude Arcs */}
        <path 
          d="M50 25C40 38 40 72 50 85" 
          stroke={light ? "#F7F2E8" : "#064E3B"} 
          strokeWidth="2.5"
        />
        <path 
          d="M50 25C60 38 60 72 50 85" 
          stroke={light ? "#F7F2E8" : "#064E3B"} 
          strokeWidth="2.5"
        />

        {/* Overlapping Organic Leaf */}
        <path 
          d="M50 15C68 22 75 42 68 60C62 50 48 40 30 35C40 24 45 18 50 15Z" 
          fill="#D4AF37" 
          opacity="0.95"
        />
        {/* Leaf Stem line */}
        <path 
          d="M50 15C55 28 58 42 68 60" 
          stroke={light ? "#064E3B" : "#F7F2E8"} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
      <div className="logo-text-wrapper">
        <span 
          className="logo-title-top" 
          style={{ color: light ? '#F7F2E8' : '#064E3B' }}
        >
          Veda<span style={{ color: '#D4AF37' }}>Global</span>
        </span>
        <span className="logo-title-bottom" style={{ color: light ? '#D4AF37' : '#033D2E' }}>Indian Exports</span>
      </div>
    </div>
  );
};

export default Logo;
