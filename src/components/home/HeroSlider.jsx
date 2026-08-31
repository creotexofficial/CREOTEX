import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export const HeroSlider = () => {
  const { setCurrentCategory } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Main Slider */}
          <div className="hero-slider-box">
            {/* Slide 1: Competition Kits */}
            <div className={`hero-slide ${currentSlide === 0 ? 'active' : ''}`}>
              <div className="hero-slide-content">
                <span className="hero-tag">Championship Robotics 2026</span>
                <h1 className="hero-title">Dominate Every Arena with <span>Creotex Pro Kits</span></h1>
                <p className="hero-description">
                  High-torque planetary motors, sticky silicone race wheels, 360° omni soccer chassis, and sub-millimeter PID line follower robots.
                </p>
                <div className="hero-actions">
                  <a href="#store-catalog" className="btn btn-primary btn-lg">Explore Store Catalog →</a>
                  <a href="#robot-builder" className="btn btn-accent btn-lg">🛠️ Build Custom Bot</a>
                </div>
              </div>
              <div className="hero-visual-box">
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
              </div>
            </div>

            {/* Slide 2: 3D Filaments & Upgrades */}
            <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`}>
              <div className="hero-slide-content">
                <span className="hero-tag" style={{ borderColor: '#F59E0B', color: '#F59E0B', background: 'rgba(245,158,11,0.15)' }}>
                  Next-Gen Rapid Prototyping
                </span>
                <h1 className="hero-title">Hyper-Speed PLA &amp; <span>Carbon Fiber PETG</span></h1>
                <p className="hero-description">
                  Print up to 600mm/s without clogs. Rigid lightweight robot parts, shock-absorbing TPU wheels, and hardened steel volcano nozzles.
                </p>
                <div className="hero-actions">
                  <a
                    href="#store-catalog"
                    className="btn btn-primary btn-lg"
                    onClick={() => setCurrentCategory('filaments')}
                  >
                    Shop 3D Filaments
                  </a>
                  <a href="#datasheet-hub" className="btn btn-secondary btn-lg">Slicing Guides</a>
                </div>
              </div>
              <div className="hero-visual-box">
                <div style={{ width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="220" height="220" viewBox="0 0 300 240" fill="none">
                    <ellipse cx="150" cy="115" rx="85" ry="60" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
                    <ellipse cx="150" cy="115" rx="72" ry="48" fill="#F59E0B" fillOpacity="0.85" />
                    <ellipse cx="150" cy="115" rx="30" ry="20" fill="#0F172A" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="hero-slider-dots">
              <span
                className={`slider-dot ${currentSlide === 0 ? 'active' : ''}`}
                onClick={() => setCurrentSlide(0)}
              ></span>
              <span
                className={`slider-dot ${currentSlide === 1 ? 'active' : ''}`}
                onClick={() => setCurrentSlide(1)}
              ></span>
            </div>
          </div>

          {/* Side Promo Cards */}
          <div className="hero-side-cards">
            {/* Card 1: Fasteners Kit */}
            <div className="promo-card card-accent-1">
              <div>
                <span className="promo-card-tag">🔩 Workshop Essential</span>
                <h3 className="promo-card-title">M2–M5 Fastener Kits</h3>
                <p className="promo-card-desc">304 Stainless Steel Allen bolts, knurled brass standoffs &amp; anti-vibration nyloc nuts.</p>
              </div>
              <a
                href="#store-catalog"
                className="promo-card-link"
                onClick={() => setCurrentCategory('fasteners')}
              >
                Shop Fasteners →
              </a>
            </div>

            {/* Card 2: High Torque Motors */}
            <div className="promo-card card-accent-2">
              <div>
                <span className="promo-card-tag">⚙️ Heavy Duty Power</span>
                <h3 className="promo-card-title">Planetary &amp; Steppers</h3>
                <p className="promo-card-desc">12V PG36 high-torque all-metal motors, NEMA 17 steppers &amp; Cytron dual MOSFET drivers.</p>
              </div>
              <a
                href="#store-catalog"
                className="promo-card-link"
                onClick={() => setCurrentCategory('motors')}
              >
                Shop Motors &amp; Drivers →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
