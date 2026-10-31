import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export const HeroSlider = () => {
  const {
    heroSlides,
    heroSideBanners,
    heroSettings,
    setCurrentCategory,
    openQuickView,
    products
  } = useCart();

  // If master publish toggle is off, do not render on storefront home page
  if (heroSettings?.enabled === false) {
    return null;
  }

  const activeSlides = (heroSlides || [])
    .filter(s => s.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeSideBanners = (heroSideBanners || [])
    .filter(b => b.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const showSideBanners = heroSettings?.showSideBanners !== false && activeSideBanners.length > 0;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Keep index within bounds if active slides count changes
  useEffect(() => {
    if (activeSlides.length > 0 && currentSlideIndex >= activeSlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [activeSlides.length, currentSlideIndex]);

  // Autoplay
  useEffect(() => {
    if (heroSettings?.autoplay === false || activeSlides.length <= 1) return;

    const interval = heroSettings?.autoplayInterval || 5000;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [heroSettings?.autoplay, heroSettings?.autoplayInterval, activeSlides.length]);

  if (activeSlides.length === 0 && !showSideBanners) {
    return null;
  }

  // Action Dispatcher for CTAs
  const handleActionClick = (e, actionType, targetValue) => {
    if (actionType === 'product') {
      e.preventDefault();
      const matched = (products || []).find(
        p => p.id === targetValue || String(p.id) === String(targetValue) || p.name.toLowerCase() === (targetValue || '').toLowerCase()
      );
      if (matched) {
        openQuickView(matched);
      } else {
        const catalogEl = document.getElementById('store-catalog');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (actionType === 'category') {
      e.preventDefault();
      setCurrentCategory(targetValue || 'all');
      const catalogEl = document.getElementById('store-catalog');
      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
    } else if (actionType === 'catalog') {
      e.preventDefault();
      setCurrentCategory('all');
      const catalogEl = document.getElementById('store-catalog');
      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
    } else if (actionType === 'link') {
      if (targetValue && targetValue.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetValue);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const renderVisualGraphic = (slide) => {
    if (slide.imageUrl) {
      return (
        <div style={{ width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={slide.imageUrl}
            alt={slide.title}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
          />
        </div>
      );
    }

    const type = slide.imageType || 'robot';

    if (type === 'filament') {
      return (
        <div style={{ width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(245,158,11,0.22) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="220" height="220" viewBox="0 0 300 240" fill="none">
            <ellipse cx="150" cy="115" rx="85" ry="60" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
            <ellipse cx="150" cy="115" rx="72" ry="48" fill="#F59E0B" fillOpacity="0.85" />
            <ellipse cx="150" cy="115" rx="30" ry="20" fill="#0F172A" />
            <path d="M150 55 L210 30 L225 45" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    if (type === 'product') {
      return (
        <div style={{ width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="220" height="220" viewBox="0 0 300 240" fill="none">
            {/* 3D Printed Geometric Crystal / Polygon Model */}
            <polygon points="150,20 220,70 200,160 100,160 80,70" fill="#064E3B" stroke="#10B981" strokeWidth="3" />
            <polygon points="150,20 200,160 150,210 100,160" fill="#047857" stroke="#34D399" strokeWidth="2" />
            <polygon points="150,20 150,210 80,70" fill="#065F46" fillOpacity="0.8" />
            <polygon points="150,20 220,70 150,210" fill="#10B981" fillOpacity="0.3" />
            <circle cx="150" cy="115" r="8" fill="#6EE7B7" />
          </svg>
        </div>
      );
    }

    if (type === 'custom') {
      return (
        <div style={{ width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="220" height="220" viewBox="0 0 300 240" fill="none">
            {/* 3D Printer Heated Bed & Hotend Extruder */}
            <rect x="40" y="170" width="220" height="24" rx="4" fill="#1E293B" stroke="#6366F1" strokeWidth="3" />
            <line x1="40" y1="182" x2="260" y2="182" stroke="#4F46E5" strokeWidth="2" strokeDasharray="6 4" />
            {/* Printed Layer Box */}
            <rect x="100" y="115" width="100" height="55" rx="6" fill="#312E81" stroke="#818CF8" strokeWidth="2" />
            {/* Extruder Nozzle Assembly */}
            <rect x="130" y="40" width="40" height="50" rx="4" fill="#0F172A" stroke="#A5B4FC" strokeWidth="3" />
            <polygon points="135,90 165,90 150,110" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <circle cx="150" cy="112" r="3" fill="#FBBF24" />
          </svg>
        </div>
      );
    }

    // Default Filament Graphic
    return (
      <div style={{ width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(245,158,11,0.22) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="220" height="220" viewBox="0 0 300 240" fill="none">
          <ellipse cx="150" cy="115" rx="85" ry="60" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
          <ellipse cx="150" cy="115" rx="72" ry="48" fill="#F59E0B" fillOpacity="0.85" />
          <ellipse cx="150" cy="115" rx="30" ry="20" fill="#0F172A" />
          <path d="M150 55 L210 30 L225 45" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  };

  return (
    <section className="hero-section" id="hero-slider-section">
      <div className="container">
        <div className={`hero-grid ${!showSideBanners ? 'hero-grid-full' : ''}`} style={!showSideBanners ? { gridTemplateColumns: '1fr' } : {}}>
          {/* Main Slider */}
          {activeSlides.length > 0 && (
            <div className="hero-slider-box">
              {activeSlides.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                const badgeColor = slide.badgeColor || '#EA580C';

                return (
                  <div
                    key={slide.id || idx}
                    className={`hero-slide ${isActive ? 'active' : ''}`}
                  >
                    <div className="hero-slide-content">
                      {slide.badge && (
                        <span
                          className="hero-tag"
                          style={{
                            borderColor: badgeColor,
                            color: badgeColor,
                            background: `${badgeColor}1a`
                          }}
                        >
                          {slide.badge}
                        </span>
                      )}

                      <h1 className="hero-title">
                        {slide.title}{' '}
                        {slide.titleHighlight && (
                          <span style={{ color: badgeColor }}>
                            {slide.titleHighlight}
                          </span>
                        )}
                      </h1>

                      {slide.description && (
                        <p className="hero-description">{slide.description}</p>
                      )}

                      <div className="hero-actions">
                        {slide.primaryBtnText && (
                          <a
                            href={slide.primaryBtnTarget || '#store-catalog'}
                            className="hero-btn-primary"
                            onClick={(e) => handleActionClick(e, slide.primaryBtnAction || 'catalog', slide.primaryBtnTarget)}
                          >
                            {slide.primaryBtnText}
                          </a>
                        )}

                        {slide.secondaryBtnText && (
                          <a
                            href={slide.secondaryBtnTarget || '#robot-builder'}
                            className="hero-btn-secondary"
                            onClick={(e) => handleActionClick(e, slide.secondaryBtnAction || 'link', slide.secondaryBtnTarget)}
                          >
                            {slide.secondaryBtnText}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="hero-visual-box">
                      {renderVisualGraphic(slide)}
                    </div>
                  </div>
                );
              })}

              {/* Slider Dots */}
              {activeSlides.length > 1 && (
                <div className="hero-slider-dots">
                  {activeSlides.map((slide, idx) => (
                    <span
                      key={slide.id || idx}
                      className={`slider-dot ${idx === currentSlideIndex ? 'active' : ''}`}
                      onClick={() => setCurrentSlideIndex(idx)}
                      title={`Go to slide ${idx + 1}`}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Side Promo Cards */}
          {showSideBanners && (
            <div className="hero-side-cards">
              {activeSideBanners.map((banner, idx) => {
                const accentClass = banner.accentClass || (idx % 2 === 0 ? 'card-accent-1' : 'card-accent-2');
                const badgeColor = banner.badgeColor || '#EA580C';

                return (
                  <div key={banner.id || idx} className={`promo-card ${accentClass}`}>
                    <div>
                      {banner.badge && (
                        <span
                          className="promo-card-tag"
                          style={banner.badgeColor ? { color: badgeColor } : {}}
                        >
                          {banner.badge}
                        </span>
                      )}
                      <h3 className="promo-card-title">{banner.title}</h3>
                      {banner.description && (
                        <p className="promo-card-desc">{banner.description}</p>
                      )}
                    </div>
                    {banner.btnText && (
                      <a
                        href={banner.btnTarget || '#store-catalog'}
                        className="promo-card-link"
                        onClick={(e) => handleActionClick(e, banner.btnAction || 'category', banner.btnTarget)}
                      >
                        {banner.btnText}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
