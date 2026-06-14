import React, { useState, useEffect, useRef } from 'react';

const AdminTopbar = ({ onToggleSidebar, onLogout, searchQuery, setSearchQuery, websiteMode, onModeChange, onEditProfile }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('veda_admin_theme') || 'dark';
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [adminDetails, setAdminDetails] = useState({
    name: 'Admin',
    email: 'admin@vedaglobal.com',
    avatar: 'A'
  });

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      try {
        const parsed = JSON.parse(adminInfo);
        setAdminDetails({
          name: parsed.name || 'Admin',
          email: parsed.email || 'admin@vedaglobal.com',
          avatar: parsed.avatar || (parsed.name ? parsed.name.charAt(0).toUpperCase() : 'A')
        });
      } catch (err) {
        console.error('Error parsing adminInfo in topbar', err);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to the root element containing the admin panel
    const root = document.querySelector('.admin-layout');
    if (root) {
      if (theme === 'light') {
        root.classList.add('light-mode');
      } else {
        root.classList.remove('light-mode');
      }
    }
  }, [theme]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('veda_admin_theme', nextTheme);
  };

  return (
    <header className="admin-topbar admin-header">
      {/* Left side: Hamburger, Mobile title, and Search bar */}
      <div className="admin-topbar-left">
        <button className="admin-sidebar-toggle admin-menu-toggle" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
          ☰
        </button>
        
        {/* Hidden on desktop, shows as title on mobile grid */}
        <span className="admin-mobile-title">Veda Global</span>

        <div className="admin-search-wrapper">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search dashboard, products..."
            className="admin-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Center: Redesigned Website Mode Toggle Switch */}
      <div className="admin-topbar-center">
        <div className="admin-mode-pill-toggle">
          <button 
            type="button"
            className={`admin-mode-pill-btn ${websiteMode === 'B2C' ? 'active' : ''}`}
            onClick={() => onModeChange && onModeChange('B2C')}
          >
            B2C Retail
          </button>
          <button 
            type="button"
            className={`admin-mode-pill-btn ${websiteMode === 'B2B' ? 'active' : ''}`}
            onClick={() => onModeChange && onModeChange('B2B')}
          >
            B2B Wholesale
          </button>
        </div>
      </div>

      {/* Right Side: Theme button & Admin Profile Click Dropdown */}
      <div className="admin-topbar-right">
        {/* Dark/Light Mode Toggle Button */}
        <button 
          className="admin-theme-toggle-btn" 
          onClick={toggleTheme} 
          aria-label="Toggle Theme"
          style={{ 
            fontSize: '1.25rem', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--admin-text-main)',
            transition: 'var(--transition)'
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        {/* Admin profile click area */}
        <div className="admin-user-profile-wrapper admin-profile-wrapper" ref={dropdownRef}>
          <div className="admin-user-profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="admin-avatar">{adminDetails.avatar}</div>
            <span className="admin-username">{adminDetails.name}</span>
            <span style={{ fontSize: '0.6rem', color: 'var(--admin-text-muted)', marginLeft: '2px' }}>▼</span>
          </div>

          {/* Click-triggered dropdown box */}
          {isDropdownOpen && (
            <div className="admin-profile-dropdown" style={{ display: 'flex' }}>
              <div className="admin-profile-dropdown-info">
                <div className="admin-avatar">{adminDetails.avatar}</div>
                <div className="admin-profile-dropdown-details">
                  <span className="admin-profile-dropdown-name">{adminDetails.name}</span>
                  <span className="admin-profile-dropdown-email">{adminDetails.email}</span>
                </div>
              </div>
              
              <div className="admin-profile-dropdown-links">
                <button 
                  type="button"
                  className="admin-profile-dropdown-link" 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onEditProfile && onEditProfile();
                  }}
                >
                  👤 Edit Profile
                </button>
                <button 
                  type="button" 
                  className="admin-profile-dropdown-link logout" 
                  onClick={onLogout}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
