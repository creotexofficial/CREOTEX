import React from 'react';
import { useCart } from '../../context/CartContext';
import { FILAMENT_SUBCATEGORIES } from '../../data/productsData';
import { ProductImage } from '../../data/productImages';
import { ProductCard } from './ProductCard';

export const FilamentSection = () => {
  const { products, filamentSubcategories, navigateToFilaments } = useCart();
  const allSubcategories = (filamentSubcategories && filamentSubcategories.length > 0)
    ? filamentSubcategories
    : FILAMENT_SUBCATEGORIES;

  // Only display published subcategories on the storefront
  const subcategoriesList = allSubcategories.filter(s => s.published !== false);

  // Pick top filament products for the trending shelf
  const filamentProducts = (products || [])
    .filter(p => p.category === 'filaments')
    .slice(0, 4);

  return (
    <section className="filament-section" id="filament-hub-section" style={{ position: 'relative' }}>
      <div className="container">
        {/* 1. Header Banner (Styled like Flash Maker Deals of the Day) */}
        <div className="deals-banner-header filament-banner-header">
          <div className="deals-title-box">
            <span className="deals-icon-fire" style={{ background: 'rgba(234, 88, 12, 0.2)', border: '1px solid #EA580C' }}>
              🧵
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#FFFFFF', fontWeight: '800' }}>
                  3D Printer Filament Spool Zone
                </h3>
                  <span
                    style={{
                      background: 'rgba(234, 88, 12, 0.25)',
                      color: '#FF7A29',
                      border: '1px solid #EA580C',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {subcategoriesList.length} SUB-CATEGORIES AVAILABLE
                  </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px' }}>
                Precision 1.75mm engineering filaments for rapid prototyping, combat robots &amp; heat-resistant parts
              </div>
            </div>
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
              padding: '9px 20px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Explore All 3D Filaments</span>
            <span style={{ fontSize: '14px' }}>→</span>
          </button>
        </div>

        {/* 2. Subcategory Visual Cards Grid (Large Product-Card Size + Clean Title) */}
        <div style={{ marginTop: '20px' }}>
          <div
            className="filament-subcats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}
          >
            {subcategoriesList.map((sub) => {
              return (
                <div
                  key={sub.id}
                  onClick={() => navigateToFilaments(sub.subCategoryKey)}
                  className="filament-subcat-card"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--border-color)',
                    borderTop: `3.5px solid ${sub.accentColor}`,
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Top Bar: Subcategory Badge & Spool Spec */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: `${sub.badgeColor}1A`,
                        color: sub.badgeColor,
                        border: `1px solid ${sub.badgeColor}4D`,
                        letterSpacing: '0.3px'
                      }}
                    >
                      {sub.badge}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      1.75mm Spool
                    </span>
                  </div>

                  {/* Big Product-Scale Spool Image Box */}
                  <div
                    className="filament-subcat-img-box"
                    style={{
                      width: '100%',
                      height: '230px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(145deg, #FFFFFF, #F1F5F9)',
                      borderRadius: '12px',
                      marginBottom: '14px',
                      overflow: 'hidden',
                      padding: '14px',
                      boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={sub.image}
                      alt={sub.displayName}
                      loading="lazy"
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      className="filament-card-img"
                    />
                  </div>

                  {/* Subcategory Clean Title */}
                  <div
                    style={{
                      padding: '2px 0 4px',
                      textAlign: 'left'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '4px'
                      }}
                    >
                      Engineering 3D Filament
                    </div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '17px',
                        fontWeight: '900',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        lineHeight: '1.3'
                      }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: sub.accentColor,
                          display: 'inline-block',
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${sub.accentColor}80`
                        }}
                      />
                      <span>{sub.displayName}</span>
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Featured Ready-to-Ship Spools Shelf */}
        <div style={{ marginTop: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                ⭐ Popular In-Stock 1KG Spools
              </h4>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Bambu Lab RFID &amp; Standard 1KG spools vacuum-sealed with desiccant
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigateToFilaments('all')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#EA580C',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View All Filaments ({filamentProducts.length}+)</span>
              <span>→</span>
            </button>
          </div>

          <div className="deals-grid">
            {filamentProducts.map((p) => (
              <ProductCard key={p.id} product={p} isDealCard={false} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
