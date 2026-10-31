import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { ProductCard } from './ProductCard';

export const FlashDeals = () => {
  const { products, flashDealsSettings } = useCart();
  const settings = flashDealsSettings || {};

  const initialTime = typeof settings.countdownSeconds === 'number'
    ? settings.countdownSeconds
    : 14 * 3600 + 42 * 60 + 19;

  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (typeof settings.countdownSeconds === 'number') {
      setTimeLeft(settings.countdownSeconds);
    }
  }, [settings.countdownSeconds]);

  useEffect(() => {
    if (settings.showCountdown === false) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.showCountdown]);

  if (settings.enabled === false) {
    return null;
  }

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  // Resolve deal products: custom list if specified, otherwise auto from isDeal flag
  let dealProducts = [];
  if (Array.isArray(settings.customProductIds) && settings.customProductIds.length > 0) {
    dealProducts = settings.customProductIds
      .map(id => (products || []).find(p => p.id === id))
      .filter(Boolean);
  } else {
    dealProducts = (products || []).filter((p) => p.isDeal);
  }

  const maxToShow = settings.maxProducts || 4;
  const displayedProducts = dealProducts.slice(0, maxToShow);

  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <section className="flash-deals-section" id="flash-deals-section">
      <div className="container">
        <div className="deals-banner-header">
          <div className="deals-title-box">
            <span className="deals-icon-fire">{settings.icon || '🔥'}</span>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                {settings.title || 'Flash Maker Deals of the Day'}
              </h3>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                {settings.subtitle || 'Limited stock at special tournament discount pricing'}
              </div>
            </div>
          </div>

          {settings.showCountdown !== false && (
            <div className="countdown-box">
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginRight: '4px' }}>
                {settings.badgeText ? `${settings.badgeText}:` : 'Ends In:'}
              </span>
              <span className="timer-block">{String(hours).padStart(2, '0')}</span>
              <span className="timer-separator">:</span>
              <span className="timer-block">{String(mins).padStart(2, '0')}</span>
              <span className="timer-separator">:</span>
              <span className="timer-block">{String(secs).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Flash Deals Product Grid */}
        <div className="deals-grid" id="flash-deals-grid">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} isDealCard={true} />
          ))}
        </div>
      </div>
    </section>
  );
};
