import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCoupons } from './AdminCoupons';
import { AdminUsers } from './AdminUsers';
import { AdminCustomers } from './AdminCustomers';
import { AdminDatasheets } from './AdminDatasheets';
import { AdminSettings } from './AdminSettings';
import { AdminRobotBuilder } from './AdminRobotBuilder';
import { AdminCategories } from './AdminCategories';
import { AdminHeroBanners } from './AdminHeroBanners';
import { AdminFilamentHub } from './AdminFilamentHub';

export const AdminLayout = () => {
  const {
    adminActiveTab,
    setAdminActiveTab,
    navigateToStorefront,
    theme,
    toggleTheme,
    orders,
    products,
    users,
    currentUser,
    openAuthModal,
    logout
  } = useCart();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const pendingOrdersCount = orders.filter(o => ['pending', 'processing'].includes(o.orderStatus?.toLowerCase())).length;
  const lowStockCount = products.filter(p => p.stock <= 15).length;

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: 'dashboard', badge: null },
    { id: 'users', label: 'User Logins & Accounts', icon: 'users', badge: users?.length > 0 ? `${users.length} Users` : null },
    { id: 'products', label: 'Robotics Catalog & Stock', icon: 'products', badge: lowStockCount > 0 ? `${lowStockCount} Low` : null },
    { id: 'filaments', label: '3D Filaments & Colors', icon: 'filaments', badge: 'Color Swatches' },
    { id: 'hero-banners', label: 'Hero Banners & Slider', icon: 'hero-banners', badge: 'Hero Section' },
    { id: 'categories', label: 'Navbar Categories', icon: 'categories', badge: 'Nav Strip' },
    { id: 'robot-builder', label: 'Robot Builder Config', icon: 'robot-builder', badge: 'Interactive' },
    { id: 'orders', label: 'Orders & Fulfillment', icon: 'orders', badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: 'coupons', label: 'Promotions & Coupons', icon: 'coupons', badge: null },
    { id: 'customers', label: 'Maker Accounts & Labs', icon: 'customers', badge: null },
    { id: 'datasheets', label: 'Technical Datasheets', icon: 'datasheets', badge: null },
    { id: 'settings', label: 'Global Store Settings', icon: 'settings', badge: null }
  ];

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'dashboard':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        );
      case 'users':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <rect x="16" y="11" width="6" height="8" rx="1" />
            <path d="M19 11V9a2 2 0 0 0-2-2" />
          </svg>
        );
      case 'products':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        );
      case 'filaments':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v6" />
            <path d="M12 15v6" />
            <path d="M3 12h6" />
            <path d="M15 12h6" />
          </svg>
        );
      case 'hero-banners':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
            <polygon points="10 8 16 10 10 12 10 8" fill="currentColor"></polygon>
          </svg>
        );
      case 'categories':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        );
      case 'robot-builder':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v4"></path>
            <line x1="8" y1="16" x2="8" y2="16"></line>
            <line x1="16" y1="16" x2="16" y2="16"></line>
          </svg>
        );
      case 'orders':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        );
      case 'coupons':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      case 'customers':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
        );
      case 'datasheets':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        );
      case 'settings':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const renderActiveView = () => {
    switch (adminActiveTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'users': return <AdminUsers />;
      case 'products': return <AdminProducts />;
      case 'filaments': return <AdminFilamentHub />;
      case 'hero-banners': return <AdminHeroBanners />;
      case 'categories': return <AdminCategories />;
      case 'robot-builder': return <AdminRobotBuilder />;
      case 'orders': return <AdminOrders />;
      case 'coupons': return <AdminCoupons />;
      case 'customers': return <AdminCustomers />;
      case 'datasheets': return <AdminDatasheets />;
      case 'settings': return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  const getTitle = () => {
    const current = navItems.find(item => item.id === adminActiveTab);
    return current ? current.label : 'Control Center';
  };

  return (
    <div className="creotex-admin-wrapper">
      {/* Mobile Backdrop */}
      <div
        className={`admin-sidebar-backdrop ${isMobileNavOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileNavOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <a href="#" className="admin-brand" onClick={navigateToStorefront}>
            <div className="admin-brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div className="admin-brand-text">
              <span className="admin-brand-title">CREOTEX<span>ADMIN</span></span>
              <span className="admin-brand-badge">Super Admin v2.4</span>
            </div>
          </a>

          {/* Close Sidebar Button for Mobile */}
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setIsMobileNavOpen(false)}
            title="Close navigation menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Modules */}
        <nav className="admin-nav">
          <div className="admin-nav-section-title">Navigation Modules</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${adminActiveTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setAdminActiveTab(item.id);
                setIsMobileNavOpen(false);
              }}
            >
              {renderIcon(item.icon)}
              <span>{item.label}</span>
              {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div
            className="admin-user-profile"
            style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
            onClick={() => openAuthModal('profile')}
            title="Click to view profile & account settings"
          >
            <div className="admin-avatar">
              {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'SA'}
            </div>
            <div className="admin-user-info" style={{ minWidth: 0 }}>
              <div className="admin-user-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'Root Admin'}
              </div>
              <div className="admin-user-role">
                <span className="pulse-dot" style={{ display: 'inline-block' }}></span>
                {currentUser?.role === 'super_admin' ? 'Super Admin' : 'Authorized'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Log Out from Admin Portal"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#EF4444',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main-container">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              title="Toggle sidebar navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1 className="admin-view-title">{getTitle()}</h1>
          </div>

          <div className="admin-topbar-actions">
            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title="Toggle Dark/Light Mode"
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            {/* Switch to Storefront Button */}
            <button
              className="admin-action-pill-btn"
              onClick={navigateToStorefront}
              title="Return to Customer Storefront Preview"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Storefront</span>
            </button>

            {/* Admin Logout Button */}
            <button
              className="admin-action-pill-btn"
              onClick={logout}
              title="Sign Out from Super Admin Portal"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#EF4444',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        {renderActiveView()}
      </div>
    </div>
  );
};
