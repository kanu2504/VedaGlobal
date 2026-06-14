import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const AdminLayout = ({ children, activeTab, setActiveTab, onLogout, searchQuery, setSearchQuery, websiteMode, onModeChange, onEditProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* Backdrop overlay on mobile */}
      <div 
        className={`admin-sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <AdminTopbar
          onToggleSidebar={toggleSidebar}
          onLogout={onLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          websiteMode={websiteMode}
          onModeChange={onModeChange}
          onEditProfile={onEditProfile}
        />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
