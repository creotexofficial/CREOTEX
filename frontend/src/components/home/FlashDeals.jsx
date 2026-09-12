import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { ProductCard } from './ProductCard';

export const FlashDeals = () => {
  const { products } = useCart();
  const [timeLeft, setTimeLeft] = useState(14 * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  const dealProducts = (products || []).filter((p) => p.isDeal).slice(0, 4);

  return (
    <section className="flash-deals-section">
      <div className="container">
        <div className="deals-banner-header">
          <div className="deals-title-box">
            <span className="deals-icon-fire">🔥</span>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Flash Maker Deals of the Day</h3>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                Limited stock at special tournament discount pricing
              </div>
            </div>
          </div>
          <div className="countdown-box">
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginRight: '4px' }}>
              Ends In:
            </span>
            <span className="timer-block">{String(hours).padStart(2, '0')}</span>
            <span className="timer-separator">:</span>
            <span className="timer-block">{String(mins).padStart(2, '0')}</span>
            <span className="timer-separator">:</span>
            <span className="timer-block">{String(secs).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Flash Deals Product Grid */}
        <div className="deals-grid" id="flash-deals-grid">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} isDealCard={true} />
          ))}
        </div>
      </div>
    </section>
  );
};
