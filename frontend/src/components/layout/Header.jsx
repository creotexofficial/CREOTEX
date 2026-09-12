import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { ProductImage } from '../../data/productImages';

export const Header = () => {
  const {
    theme,
    toggleTheme,
    products,
    items,
    wishlist,
    totalCount,
    setIsCartOpen,
    openQuickView,
    searchQuery,
    setSearchQuery,
    currentCategory,
    setCurrentCategory,
    setCurrentTag,
    currentUser,
    openAuthModal
  } = useCart();

  const [searchCat, setSearchCat] = useState("all");
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const searchBoxRef = useRef(null);

  // Search matches using dynamic catalog products
  const getSearchMatches = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return (products || []).filter(p => {
      if (searchCat !== "all" && p.category !== searchCat) return false;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        p.sku.toLowerCase().includes(q)
      );
    }).slice(0, 6);
  };

  const matches = getSearchMatches();

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSearchPopupOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-main">
          {/* Logo */}
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="logo-icon-box">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div className="logo-text-box">
              <span className="brand-title">CREOTEX<span>SHOP</span></span>
              <span className="brand-tagline">Robotics &amp; Maker Superstore</span>
            </div>
          </a>

          {/* Live Search Bar */}
          <div className="header-search-box" ref={searchBoxRef}>
            <div className="search-input-group">
              <select
                className="search-category-select"
                aria-label="Filter search by category"
                value={searchCat}
                onChange={(e) => setSearchCat(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="fasteners">Nuts &amp; Screws</option>
                <option value="filaments">3D Filaments</option>
                <option value="motors">Motors &amp; Gearboxes</option>
                <option value="drivers">Motor Drivers</option>
                <option value="bearings">Bearings &amp; Motion</option>
                <option value="line-follower">Line Follower Kits</option>
                <option value="robo-race">Robo Race Parts</option>
                <option value="soccer-robot">Soccer Robot Parts</option>
              </select>
              <input
                type="text"
                className="search-input"
                aria-label="Search products, motors, chassis, filaments"
                placeholder="Search 500+ motors, chassis, 3D filaments, screws, bearings..."
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchPopupOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchPopupOpen(true);
                }}
              />
              <button
                className="search-btn"
                aria-label="Submit search"
                onClick={() => {
                  if (searchCat !== "all") setCurrentCategory(searchCat);
                  setIsSearchPopupOpen(false);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            {/* Live Auto-suggest Popup */}
            {isSearchPopupOpen && searchQuery.trim() !== "" && (
              <div className="search-results-popup active">
                {matches.length > 0 ? (
                  matches.map((m) => (
                    <div
                      key={m.id}
                      className="search-result-item"
                      onClick={() => {
                        openQuickView(m);
                        setIsSearchPopupOpen(false);
                      }}
                    >
                      <div className="search-result-thumb">
                        <ProductImage type={m.image} className="product-svg-img" />
                      </div>
                      <div className="search-result-info">
                        <div className="search-result-title">{m.name}</div>
                        <div className="search-result-price">
                          ₹{m.price.toLocaleString('en-IN')}{' '}
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{m.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No matching robotics components found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {/* User Account / Sign In Action (Root Admin button removed from storefront navbar) */}
            {currentUser && currentUser.role !== 'super_admin' ? (
              <button
                className="header-action-btn user-account-btn"
                onClick={() => openAuthModal('profile')}
                aria-label={`User profile: ${currentUser.name}`}
                title={`Logged in as ${currentUser.name}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: '600', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                className="header-action-btn signin-btn"
                onClick={() => openAuthModal('login')}
                aria-label="Sign in or register account"
                title="Sign In / Register"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Sign In</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title="Toggle Dark/Light Mode"
              aria-label="Toggle dark and light mode theme"
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

            {/* Wishlist Action */}
            <button
              className="header-action-btn"
              onClick={() => setCurrentTag("M3")}
              aria-label="View wishlist"
              title="Saved Items"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="action-badge wishlist-count-badge">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Action */}
            <button
              className="header-action-btn cart-action-btn btn-open-cart"
              title="Shopping Cart"
              aria-label={`Shopping cart with ${totalCount} items`}
              onClick={() => setIsCartOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Cart</span>
              {totalCount > 0 && (
                <span className="action-badge cart-count-badge">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
