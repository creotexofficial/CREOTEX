import React from 'react';
import { useCart } from '../../context/CartContext';

export const MegaNav = () => {
  const { currentCategory, setCurrentCategory } = useCart();

  const handleCategoryClick = (catId, e) => {
    setCurrentCategory(catId);
    const catalogEl = document.getElementById("store-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="nav-bar">
      <div className="container">
        <div className="nav-categories">
          <a
            href="#store-catalog"
            className={`nav-link ${currentCategory === 'all' ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick('all', e)}
          >
            <span>⚡ All Products</span>
          </a>
          <a
            href="#store-catalog"
            className={`nav-link ${currentCategory === 'fasteners' ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick('fasteners', e)}
          >
            <span>🔩 Nut Bolt &amp; Screws</span>
          </a>
          <a
            href="#store-catalog"
            className={`nav-link ${currentCategory === 'filaments' ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick('filaments', e)}
          >
            <span>🧵 3D Filaments</span>
            <span className="nav-badge-hot">HOT</span>
          </a>
          <a
            href="#store-catalog"
            className={`nav-link ${currentCategory === 'motors' ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick('motors', e)}
          >
            <span>⚙️ Motors &amp; Gearboxes</span>
          </a>
          <a
            href="#store-catalog"
            className={`nav-link ${currentCategory === 'drivers' ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick('drivers', e)}
          >
            <span>🔌 Motor Drivers</span>
          </a>
          <a
            href="#store-catalog"
            className={`nav-link ${currentCategory === 'bearings' ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick('bearings', e)}
          >
            <span>🔄 Bearings &amp; Motion</span>
          </a>
          <a
            href="#store-catalog"
            className={`nav-link ${currentCategory === 'line-follower' ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick('line-follower', e)}
          >
            <span>🏁 Line Follower Kits</span>
            <span className="nav-badge-pro">PRO</span>
          </a>
          <a
            href="#store-catalog"
            className={`nav-link ${currentCategory === 'robo-race' ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick('robo-race', e)}
          >
            <span>🏎️ Robo Race</span>
          </a>
          <a
            href="#store-catalog"
            className={`nav-link ${currentCategory === 'soccer-robot' ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick('soccer-robot', e)}
          >
            <span>⚽ Soccer Robots</span>
          </a>
        </div>

        <a href="#robot-builder" className="nav-tools-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
          <span>Custom Robot Builder</span>
        </a>
      </div>
    </nav>
  );
};
