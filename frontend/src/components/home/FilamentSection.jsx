import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FILAMENT_SUBCATEGORIES } from '../../data/productsData';

export const FilamentSection = () => {
  const {
    filamentSubcategories,
    filamentSectionSettings,
    navigateToFilaments
  } = useCart();

  const [activeTab, setActiveTab] = useState('all');
  const settings = filamentSectionSettings || {};

  if (settings.enabled === false) {
    return null;
  }

  const allSubcategories = (filamentSubcategories && filamentSubcategories.length > 0)
    ? filamentSubcategories
    : FILAMENT_SUBCATEGORIES;

  // Filter out unpublished or admin-hidden subcategories
  const hiddenKeys = settings.hiddenSubcategoryKeys || [];
  const subcategoriesList = allSubcategories.filter(
    s => s.published !== false && !hiddenKeys.includes(s.subCategoryKey)
  );

  // Material filter tabs
  const filterTabs = [
    {
      id: 'all',
      label: '✨ All Filaments',
      filterFn: () => true
    },
    {
      id: 'pla',
      label: '⚡ Hyper PLA & Tough',
      filterFn: (s) => s.displayName.includes('PLA') && !['PLA Stone', 'PLA Wood', 'PLA Starlight', 'PLA Glow in the Dark'].includes(s.displayName)
    },
    {
      id: 'petg',
      label: '🛡️ PETG & Translucent',
      filterFn: (s) => s.displayName.includes('PETG')
    },
    {
      id: 'engineering',
      label: '⚙️ ABS, ASA & CF Carbon',
      filterFn: (s) => ['ABS', 'ASA', 'PETG CF', 'PLA CF'].some(k => s.displayName.includes(k))
    },
    {
      id: 'specialty',
      label: '🌟 Glow, Wood & Stone',
      filterFn: (s) => ['Stone', 'Wood', 'Glow', 'Starlight', 'Silk', 'Dual'].some(k => s.displayName.includes(k))
    }
  ];

  const currentTabObj = filterTabs.find(t => t.id === activeTab) || filterTabs[0];
  const displayedSubcategories = subcategoriesList.filter(currentTabObj.filterFn);

  return (
    <section className="filament-section" id="filament-hub-section">
      <div className="container">
        {/* 1. High-Tech Industrial Filament Banner Header */}
        <div className="deals-banner-header filament-banner-header">
          <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <div className="filament-live-radar">
                    <span className="filament-live-dot" />
                    <span>AMS & MULTI-MATERIAL IN STOCK</span>
                  </div>
                  <span className="filament-banner-subtag">
                    ±0.02MM LASER TOLERANCE
                  </span>
                </div>

                <h3 className="filament-banner-title">
                  {settings.title || '3D Printer Filament Spool Zone'}
                </h3>

                <p className="filament-banner-subtitle">
                  {settings.subtitle || 'Precision 1.75mm virgin polymers with ±0.02mm laser diameter inspection. Vacuum sealed with desiccant for high-speed Bambu Lab, Voron & Creality 3D printers.'}
                </p>
              </div>

              <button
                type="button"
                className="admin-action-pill-btn primary"
                onClick={() => navigateToFilaments('all')}
                style={{
                  background: 'linear-gradient(135deg, #EA580C, #C2410C)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '12px 24px',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(234, 88, 12, 0.45)',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{settings.buttonText || 'Explore Full Material Hub'}</span>
                <span style={{ fontSize: '15px' }}>→</span>
              </button>
            </div>

            {/* Quality & Performance Feature Ribbon */}
            <div className="filament-feature-strip">
              <div className="filament-feature-pill">
                <span className="feat-icon">🌀</span>
                <span>Zero-Tangle Precision Winding</span>
              </div>
              <div className="filament-feature-pill">
                <span className="feat-icon">⚡</span>
                <span>600 mm/s High-Flow Polymers</span>
              </div>
              <div className="filament-feature-pill">
                <span className="feat-icon">🔬</span>
                <span>±0.02mm Laser Inspected</span>
              </div>
              <div className="filament-feature-pill">
                <span className="feat-icon">🏷️</span>
                <span>Bambu AMS & Universal Spool Hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive Material Filter Navigation Tabs */}
        {settings.showSubcategoriesGrid !== false && subcategoriesList.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div className="filament-filter-tabs">
              {filterTabs.map((tab) => {
                const count = subcategoriesList.filter(tab.filterFn).length;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`filament-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <span>{tab.label}</span>
                    <span className="filament-tab-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Clean Visual Grid: ONLY IMAGE AND CATEGORY NAME */}
            <div
              className="filament-subcats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '20px',
                marginTop: '18px'
              }}
            >
              {displayedSubcategories.map((sub) => {
                return (
                  <div
                    key={sub.id}
                    className="filament-clean-card"
                    onClick={() => navigateToFilaments(sub.subCategoryKey)}
                    style={{
                      '--card-accent': sub.accentColor || '#EA580C',
                      '--card-glow': `${sub.accentColor || '#EA580C'}40`
                    }}
                  >
                    {/* Big Crisp 3D Spool Image Box with Studio Lighting & Ambient Glow */}
                    <div className="filament-clean-img-box">
                      <div className="filament-clean-glow" />
                      <img
                        src={sub.image}
                        alt={sub.displayName}
                        loading="lazy"
                        className="filament-clean-img"
                      />
                      {sub.badge && (
                        <span
                          className="filament-clean-badge"
                          style={{
                            background: `${sub.badgeColor || sub.accentColor}25`,
                            color: sub.badgeColor || sub.accentColor,
                            borderColor: `${sub.badgeColor || sub.accentColor}50`
                          }}
                        >
                          {sub.badge}
                        </span>
                      )}
                    </div>

                    {/* Clean Category Title */}
                    <div className="filament-clean-info">
                      <div className="filament-clean-category">3D Filament Spool</div>
                      <h4 className="filament-clean-title">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className="filament-clean-dot"
                            style={{ background: sub.accentColor || '#EA580C' }}
                          />
                          <span>{sub.displayName}</span>
                        </div>
                        <span className="filament-clean-arrow">→</span>
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
