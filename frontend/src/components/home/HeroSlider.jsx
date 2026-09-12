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

    if (type === 'motor') {
      return (
        <div style={{ width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(14,165,233,0.22) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="220" height="220" viewBox="0 0 300 240" fill="none">
            <rect x="70" y="50" width="130" height="140" rx="16" fill="#1E293B" stroke="#0EA5E9" strokeWidth="4" />
            <circle cx="135" cy="120" r="45" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
            <rect x="130" y="10" width="10" height="40" rx="3" fill="#94A3B8" />
            <circle cx="135" cy="120" r="14" fill="#0EA5E9" />
            <line x1="100" y1="190" x2="100" y2="230" stroke="#EF4444" strokeWidth="4" />
            <line x1="170" y1="190" x2="170" y2="230" stroke="#0F172A" strokeWidth="4" />
          </svg>
        </div>
      );
    }

    if (type === 'electronics') {
      return (
        <div style={{ width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="220" height="220" viewBox="0 0 300 240" fill="none">
            <rect x="50" y="40" width="200" height="160" rx="12" fill="#064E3B" stroke="#10B981" strokeWidth="3" />
            <rect x="100" y="80" width="100" height="80" rx="8" fill="#0F172A" stroke="#A855F7" strokeWidth="3" />
            <circle cx="150" cy="120" r="18" fill="#8B5CF6" />
            <circle cx="70" cy="60" r="6" fill="#F59E0B" />
            <circle cx="230" cy="60" r="6" fill="#F59E0B" />
            <line x1="80" y1="190" x2="220" y2="190" stroke="#34D399" strokeWidth="3" strokeDasharray="6 4" />
          </svg>
        </div>
      );
    }

    // Default: Robot Chassis
    return (
      <div style={{ width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(234,88,12,0.18) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="220" height="220" viewBox="0 0 300 240" fill="none">
          <polygon points="50,26 150,26 180,120 20,120" fill="#1E293B" stroke="#EA580C" strokeWidth="3" />
          <rect x="20" y="10" width="160" height="16" rx="6" fill="#C2410C" />
          <circle cx="35" cy="18" r="4" fill="#EF4444" />
          <circle cx="65" cy="18" r="4" fill="#EF4444" />
          <circle cx="95" cy="18" r="4" fill="#EF4444" />
          <circle cx="125" cy="18" r="4" fill="#EF4444" />
          <circle cx="155" cy="18" r="4" fill="#EF4444" />
          <rect x="0" y="85" width="22" height="40" rx="4" fill="#EA580C" />
          <rect x="178" y="85" width="22" height="40" rx="4" fill="#EA580C" />
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
