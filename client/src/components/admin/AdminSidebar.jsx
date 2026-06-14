import React, { useState } from 'react';
import { useMode } from '../../context/ModeContext';
import axios from '../../api/axios';

const getSidebarIcon = (id) => {
  const props = {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#D4AF37", // Premium Gold
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { marginRight: "10px", flexShrink: 0 }
  };

  switch (id) {
    case "dashboard":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      );
    case "products":
      return (
        <svg {...props}>
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
          <polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08" />
          <polygon points="12 22.08 12 12 21 6.92 21 17.08 12 22.08" />
          <polygon points="12 12 3 6.92 12 1.92 21 6.92 12 12" />
        </svg>
      );
    case "categories":
      return (
        <svg {...props}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case "homepage-cms":
      return (
        <svg {...props}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "about-us":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case "blogs":
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    case "policies":
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "enquiries":
      return (
        <svg {...props}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case "orders":
      return (
        <svg {...props}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    case "banners":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "testimonials":
      return (
        <svg {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "settings":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "users-admins":
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return null;
  }
};

const AdminSidebar = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { blogEnabled, setBlogEnabled } = useMode();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBlogToggle = async () => {
    setIsUpdating(true);
    try {
      const newValue = !blogEnabled;
      const { data } = await axios.put('/settings/blog-visibility', { blogEnabled: newValue });
      setBlogEnabled(data.blogEnabled);
    } catch (err) {
      console.error(err);
      alert('Failed to update blog visibility');
    } finally {
      setIsUpdating(false);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "categories", label: "Categories" },
    { id: "homepage-cms", label: "Homepage CMS" },
    { id: "about-us", label: "About Us" },
    { id: "blogs", label: "Blogs" },
    { id: "policies", label: "Policies" },
    { id: "enquiries", label: "Enquiries" },
    { id: "orders", label: "Orders" },
    { id: "banners", label: "Banners" },
    { id: "testimonials", label: "Testimonials" },
    { id: "settings", label: "Website Settings" },
    { id: "users-admins", label: "Users/Admins" }
  ];

  const handleItemClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-header" style={{ padding: '16px 20px' }}>
        <div className="admin-sidebar-logo">
          Veda<span>Global</span>
        </div>
        <button className="admin-sidebar-close-btn" onClick={onClose}>×</button>
      </div>
      <div className="admin-sidebar-content" style={{ padding: '12px 8px', gap: '8px' }}>
        <div className="admin-sidebar-group" style={{ margin: 0 }}>
          <h5 className="admin-sidebar-group-title" style={{ marginBottom: '6px', fontSize: '0.7rem', padding: '0 8px' }}>Menu Panel</h5>
          <div className="admin-sidebar-menu" style={{ gap: '2px' }}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <React.Fragment key={item.id}>
                  {item.id === 'blogs' && (
                    <div className="admin-sidebar-toggle-row" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      margin: '2px 0',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'var(--transition)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--admin-text-main)', fontSize: '0.9rem', fontWeight: '600' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', flexShrink: 0 }}>
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span className="admin-sidebar-label">Blog Page</span>
                      </div>
                      <button 
                        onClick={handleBlogToggle}
                        disabled={isUpdating}
                        title={blogEnabled ? 'Blog Page Visible' : 'Blog Page Hidden'}
                        style={{
                          width: '40px',
                          height: '20px',
                          borderRadius: '10px',
                          backgroundColor: blogEnabled ? '#0FB981' : '#D9D9D9',
                          border: 'none',
                          position: 'relative',
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px',
                          transition: 'background-color 0.3s ease',
                          outline: 'none',
                          flexShrink: 0
                        }}
                      >
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: blogEnabled ? '#D4AF37' : '#FFFFFF',
                          position: 'absolute',
                          left: blogEnabled ? '22px' : '2px',
                          transition: 'left 0.3s ease, background-color 0.3s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </button>
                    </div>
                  )}
                  <button
                    className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                    style={{
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span className="admin-sidebar-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      {getSidebarIcon(item.id)}
                    </span>
                    <span className="admin-sidebar-label">{item.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
