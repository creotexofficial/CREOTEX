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
    // If clicking on 3D Filaments tab, open the dedicated 3D Filaments Hub
    if (cat.id === 'filaments') {
      e.preventDefault();
      navigateToFilaments('all');
      return;
    }

    // If currently on dedicated filament page, return to storefront
    if (currentView === 'filaments') {
      navigateToHome();
    }

    if (cat.targetType === 'link') {
      // Direct Anchor / URL navigation
      const target = cat.targetUrl || '#store-catalog';
      if (target.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
      return;
    }

    // Catalog Category Filter
    setCurrentCategory(cat.id);
    const catalogEl = document.getElementById("store-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <nav className="nav-bar">
      <div className="container">
        <div className="nav-categories">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <a
                key={cat.id}
                href={cat.targetUrl || '#store-catalog'}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleCategoryClick(cat, e)}
              >
                <span>
                  {cat.icon && <span style={{ marginRight: '4px' }}>{cat.icon}</span>}
                  {cat.name}
                </span>
                {cat.badge && (
                  <span className={`nav-badge-${cat.badgeType || 'hot'}`}>
                    {cat.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {navbarSettings?.showToolsLink !== false && (
          <a
            href={navbarSettings?.toolsLinkUrl || "#robot-builder"}
            className="nav-tools-link"
          >
            <span style={{ fontSize: '1.05rem', marginRight: '4px' }}>
              {navbarSettings?.toolsLinkIcon || '🔧'}
            </span>
            <span>{navbarSettings?.toolsLinkLabel || 'Custom Robot Builder'}</span>
          </a>
        )}
      </div>
    </nav>
  );
};
