import React from 'react';
import { useCart } from '../../context/CartContext';

export const MegaNav = () => {
  const {
    currentCategory,
    setCurrentCategory,
    navbarCategories,
    navbarSettings,
    currentView,
    navigateToFilaments,
    navigateToCustom3DPrint,
    navigateToHome
  } = useCart();

  // If master setting is unpublished / disabled, hide entire nav strip from home page
  if (navbarSettings?.enabled === false) {
    return null;
  }

  const categories = (navbarCategories || [])
    .filter(cat => cat.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleCategoryClick = (cat, e) => {
    e.preventDefault();

    // If currently on dedicated view, return to storefront first
    if (currentView === 'filaments' || currentView === 'custom-3d-print') {
      navigateToHome();
      setTimeout(() => {
        scrollToSection(cat.id);
      }, 100);
      return;
    }

    scrollToSection(cat.id);
  };

  const scrollToSection = (catId) => {
    if (catId === 'filaments') {
      const el = document.getElementById('filament-hub-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (catId === '3d-products') {
      setCurrentCategory('3d-products');
      const el = document.getElementById('section-3d-print-products') || document.getElementById('store-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (catId === 'custom-3d-print') {
      const el = document.getElementById('custom-3d-print');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigateToCustom3DPrint();
      }
      return;
    }

    // Fallback anchor scroll
    const el = document.getElementById('store-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="nav-bar">
      <div className="container">
        <div className="nav-categories">
          {categories.map((cat) => {
            const isActive = currentView === 'custom-3d-print'
              ? cat.id === 'custom-3d-print'
              : (currentCategory === cat.id && currentView === 'storefront');
            return (
              <a
                key={cat.id}
                href={cat.targetUrl || '#store-catalog'}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleCategoryClick(cat, e)}
              >
                <span>{cat.name}</span>
                {cat.badge && (
                  <span className={`nav-badge-${cat.badgeType || 'hot'}`}>
                    {cat.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
