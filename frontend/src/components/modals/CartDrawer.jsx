import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ProductImage } from '../../data/productImages';

export const CartDrawer = () => {
  const {
    items,
    totalCount,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discountAmount,
    shippingCost,
    total,
    freeShipping,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeItem,
    openCheckoutModal
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isCartOpen ? 'active' : ''}`}
        id="cart-drawer-overlay"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className={`cart-drawer ${isCartOpen ? 'active' : ''}`} id="cart-drawer">
        <div className="cart-drawer-header">
          <div className="cart-title-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h3>Your 3D Printing Cart</h3>
            <span className="cart-count-pill cart-count-badge">{totalCount}</span>
          </div>
          <button
            className="close-drawer-btn"
            id="close-cart-drawer"
            title="Close Cart"
            onClick={() => setIsCartOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="free-shipping-bar-box">
          <div className="free-shipping-text" id="free-shipping-text">
            {freeShipping.qualified ? (
              <span>🎉 <strong>Congratulations!</strong> You unlocked FREE Express Delivery!</span>
            ) : (
              <span>
                🚚 Add <strong>₹{freeShipping.needed.toLocaleString('en-IN')}</strong> more for{' '}
                <strong>FREE Express Delivery</strong>!
              </span>
            )}
          </div>
          <div className="free-shipping-progress">
            <div
              className="progress-fill"
              id="free-shipping-fill"
              style={{ width: `${freeShipping.percent}%` }}
            ></div>
          </div>
        </div>

        {/* Items List */}
        <div className="cart-drawer-items" id="cart-drawer-items-list">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">🛒</div>
              <h4>Your Cart is Empty</h4>
              <p>Explore high performance robotics kits, motors, screws &amp; filaments!</p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '12px' }}
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="cart-item-row" data-cart-id={item.cartItemId}>
                <div className="cart-item-thumb">
                  <ProductImage type={item.image} className="mini-cart-svg" />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  {item.customConfig && (
                    <div style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      margin: '3px 0 4px'
                    }}>
                      {item.customConfig.material && (
                        <span style={{
                          background: 'rgba(249, 115, 22, 0.12)',
                          color: '#F97316',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: '700'
                        }}>
                          {item.customConfig.material}
                        </span>
                      )}
                      {item.customConfig.color && (
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: 'var(--text-secondary)',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          {item.customConfig.color}
                        </span>
                      )}
                      {item.customConfig.infill && (
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: 'var(--text-secondary)',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          {item.customConfig.infill}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                  <div className="cart-qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-item-btn"
                  title="Remove item"
                  onClick={() => removeItem(item.cartItemId)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Calculations */}
        <div className="cart-drawer-footer">
          <form className="coupon-section" onSubmit={handleApplyCoupon}>
            <input
              type="text"
              className="coupon-input"
              id="cart-coupon-input"
              placeholder="Coupon (e.g. ROBO10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary btn-sm" id="btn-apply-coupon">
              Apply
            </button>
          </form>

          <div id="cart-applied-coupon-area">
            {appliedCoupon && (
              <div className="applied-coupon-pill">
                <span>🏷️ {appliedCoupon.code} ({appliedCoupon.label})</span>
                <button
                  onClick={removeCoupon}
                  style={{ color: '#EF4444', fontWeight: 'bold', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="cart-summary-breakdown">
            <div className="summary-row">
              <span>Subtotal (Inclusive of GST):</span>
              <span id="cart-subtotal-val" className="mono">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="summary-row">
              <span>Coupon Discount:</span>
              <span id="cart-discount-val" className="mono" style={{ color: 'var(--primary)' }}>
                {discountAmount > 0 ? `- ₹${discountAmount.toLocaleString('en-IN')}` : '₹0'}
              </span>
            </div>
            <div className="summary-row">
              <span>Express Shipping:</span>
              <span id="cart-shipping-val" className="mono">
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </span>
            </div>
            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span id="cart-total-val" className="mono" style={{ color: 'var(--primary)' }}>
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            id="btn-checkout-drawer"
            onClick={openCheckoutModal}
          >
            <span>Proceed to Secure Checkout →</span>
          </button>
        </div>
      </div>
    </>
  );
};
