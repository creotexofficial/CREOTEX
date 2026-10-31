import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Boxes,
  Flame,
  CircleDot,
  Image as ImageIcon,
  Layers,
  Bot,
  ShoppingBag,
  TicketPercent,
  GraduationCap,
  FileText,
  Settings,
  Sun,
  Moon,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCoupons } from './AdminCoupons';
import { AdminUsers } from './AdminUsers';
import { AdminCustomers } from './AdminCustomers';
import { AdminSettings } from './AdminSettings';
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
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'products', label: '3D Catalog & Inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} Low` : null },
    { id: 'filaments', label: '3D Filaments & Spool Hub', icon: CircleDot, badge: 'Materials Hub' },
    { id: 'hero-banners', label: 'Hero Banners & Slider', icon: ImageIcon, badge: 'Hero Section' },
    { id: 'categories', label: 'Navbar 3D Categories', icon: Layers, badge: '3 Sections' },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: 'coupons', label: 'Promotions & Coupons', icon: TicketPercent, badge: null },
    { id: 'customers', label: 'Customer Accounts & Profiles', icon: GraduationCap, badge: null },
    { id: 'users', label: 'User Logins & Accounts', icon: Users, badge: users?.length > 0 ? `${users.length} Users` : null },
    { id: 'settings', label: 'Global Store Settings', icon: Settings, badge: null }
  ];

  const renderActiveView = () => {
    switch (adminActiveTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'filaments': return <AdminFilamentHub />;
      case 'hero-banners': return <AdminHeroBanners />;
      case 'categories': return <AdminCategories />;
      case 'orders': return <AdminOrders />;
      case 'coupons': return <AdminCoupons />;
      case 'customers': return <AdminCustomers />;
      case 'users': return <AdminUsers />;
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
              <Bot size={20} strokeWidth={2.4} />
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
            <X size={18} />
          </button>
        </div>

        {/* Navigation Modules */}
        <nav className="admin-nav">
          <div className="admin-nav-section-title">Navigation Modules</div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = adminActiveTab === item.id;
            return (
              <button
                key={item.id}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setAdminActiveTab(item.id);
                  setIsMobileNavOpen(false);
                }}
              >
                <Icon size={18} className="admin-nav-item-icon" />
                <span className="admin-nav-item-label">{item.label}</span>
                {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
              </button>
            );
          })}
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
            className="admin-logout-btn"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#EF4444',
              borderRadius: '8px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} />
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
              <Menu size={20} />
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
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Switch to Storefront Button */}
            <button
              className="admin-action-pill-btn"
              onClick={navigateToStorefront}
              title="Return to Customer Storefront Preview"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px'
              }}
            >
              <ExternalLink size={15} />
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
                gap: '7px'
              }}
            >
              <LogOut size={15} />
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
