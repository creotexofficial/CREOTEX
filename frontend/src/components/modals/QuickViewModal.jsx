import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ProductImage } from '../../data/productImages';

export const QuickViewModal = () => {
  const { quickViewProduct, closeQuickView, addItem, showToast } = useCart();
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);

  if (!quickViewProduct) return null;

  const handleCheckPincode = () => {
    const pin = pincode.trim();
    if (pin.length === 6 && /^\d+$/.test(pin)) {
      setPincodeResult({
        success: true,
        text: `✓ Delivery available to ${pin} in 2-3 business days. (Free Delivery above ₹999)`
      });
    } else {
      setPincodeResult({
        success: false,
        text: `✗ Please enter a valid 6-digit Indian PIN code.`
      });
    }
  };

  const handleAddToCart = () => {
    addItem(quickViewProduct.id, qty);
    closeQuickView();
  };

  const handleDownloadDatasheet = () => {
    showToast(`Datasheet for ${quickViewProduct.sku} generated! (PDF Download Simulation)`, "info");
  };

  return (
    <div
      className="modal-backdrop active"
      id="quickview-modal"
      onClick={(e) => {
        if (e.target.id === 'quickview-modal') closeQuickView();
      }}
    >
      <div className="modal-card">
        <button className="modal-close-btn" onClick={closeQuickView}>
          ✕
        </button>
        <div id="quickview-modal-content">
          <div className="quickview-layout">
            {/* Left: Image Box */}
            <div className="quickview-gallery">
              <div className="quickview-img-box">
                <ProductImage type={quickViewProduct.image} className="modal-svg" />
              </div>
              <div className="badge-tag badge-spec" style={{ marginTop: '12px' }}>
                SKU: {quickViewProduct.sku}
              </div>
            </div>

            {/* Right: Details & Specs */}
            <div className="quickview-info">
              <div className="quickview-category">{quickViewProduct.categoryLabel}</div>
              <h2 className="quickview-title">{quickViewProduct.name}</h2>

              <div className="product-card-rating">
                <span className="stars-row">★★★★★</span>
                <span className="review-count">
                  ({quickViewProduct.rating} / 5.0 • Verified Maker Reviews)
                </span>
              </div>

              <div className="quickview-price-box">
                <span className="quickview-price">₹{quickViewProduct.price.toLocaleString('en-IN')}</span>
                <span className="strike-price">
                  ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="badge-tag badge-deal">{quickViewProduct.discount}</span>
              </div>

              <p className="quickview-desc">{quickViewProduct.shortDesc}</p>

              <table className="specs-table">
                <tbody>
                  {Object.entries(quickViewProduct.specs || {}).map(([key, val]) => (
                    <tr key={key}>
                      <td className="specs-key">{key}</td>
                      <td className="specs-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pincode Checker */}
              <div>
                <label className="form-label">Check Delivery Pincode:</label>
                <div className="pincode-checker">
                  <input
                    type="text"
                    className="pincode-input"
                    placeholder="e.g. 560001"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <button className="btn btn-secondary btn-sm" onClick={handleCheckPincode}>
                    Check
                  </button>
                </div>
                {pincodeResult && (
                  <div
                    className="pincode-result"
                    style={{
                      color: pincodeResult.success ? '#EA580C' : '#EF4444',
                      fontWeight: pincodeResult.success ? 'bold' : 'normal'
                    }}
                  >
                    {pincodeResult.text}
                  </div>
                )}
              </div>

              {/* Quantity and Action Buttons */}
              <div className="quickview-actions">
                <div
                  className="cart-qty-controls"
                  style={{ background: 'var(--bg-input)', padding: '6px', borderRadius: 'var(--radius-md)' }}
                >
                  <button className="qty-btn" onClick={() => setQty((prev) => Math.max(1, prev - 1))}>
                    -
                  </button>
                  <span className="qty-val">{qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQty((prev) => Math.min(quickViewProduct.stock || 99, prev + 1))}
                  >
                    +
                  </button>
                </div>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Add to Cart
                </button>
                <button
                  className="btn btn-secondary btn-icon"
                  title="Download Technical Datasheet"
                  onClick={handleDownloadDatasheet}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
