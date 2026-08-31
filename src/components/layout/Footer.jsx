import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const Footer = () => {
  const { setCurrentCategory, showToast } = useCart();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      showToast("Subscribed! Your ₹100 welcome voucher is sent.", "success");
      setEmail("");
    }
  };

  const handleCategoryNav = (catId, e) => {
    setCurrentCategory(catId);
    const catalogEl = document.getElementById("store-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <a href="#" className="brand-logo">
              <div className="logo-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <div className="logo-text-box">
                <span className="brand-title">CREOTEX<span>SHOP</span></span>
                <span className="brand-tagline">Robotics &amp; Maker Superstore</span>
              </div>
            </a>
            <p>
              CreotexShop is India's dedicated robotics, STEM, and mechanical components hub. Supplying top tier components to engineering colleges, hobbyists, and competition combat robotics teams nationwide.
            </p>
            <div className="social-links">
              <a href="#" className="social-btn" aria-label="GitHub">💻</a>
              <a href="#" className="social-btn" aria-label="YouTube">▶️</a>
              <a href="#" className="social-btn" aria-label="WhatsApp">💬</a>
              <a href="#" className="social-btn" aria-label="Instagram">📸</a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="footer-col">
            <h5>Hardware Categories</h5>
            <ul className="footer-links-list">
              <li>
                <a href="#store-catalog" onClick={(e) => handleCategoryNav('fasteners', e)}>
                  Nut Bolt &amp; Screws (M2-M5)
                </a>
              </li>
              <li>
                <a href="#store-catalog" onClick={(e) => handleCategoryNav('filaments', e)}>
                  3D Printer Filaments (PLA/PETG)
                </a>
              </li>
              <li>
                <a href="#store-catalog" onClick={(e) => handleCategoryNav('motors', e)}>
                  Planetary &amp; Stepper Motors
                </a>
              </li>
              <li>
                <a href="#store-catalog" onClick={(e) => handleCategoryNav('drivers', e)}>
                  Cytron &amp; MOSFET Motor Drivers
                </a>
              </li>
              <li>
                <a href="#store-catalog" onClick={(e) => handleCategoryNav('bearings', e)}>
                  608ZZ &amp; Linear LM8UU Bearings
                </a>
              </li>
              <li>
                <a href="#store-catalog" onClick={(e) => handleCategoryNav('robo-race', e)}>
                  Carbon Fiber Race Chassis
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="footer-col">
            <h5>Maker Support</h5>
            <ul className="footer-links-list">
              <li><a href="#datasheet-hub">Datasheets &amp; Pinouts</a></li>
              <li><a href="#robot-builder">Robot Kit Builder Tool</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToast("Quotation system request initiated!", "info"); }}>Bulk College Lab Quotation</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToast("Free delivery on all orders above ₹999", "info"); }}>Shipping &amp; Delivery Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToast("7-day replacement warranty on manufacturing defects", "info"); }}>7-Day Replacement Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); showToast("Tracking dispatch updates via BlueDart/Delhivery", "info"); }}>Track AWB Consignment</a></li>
            </ul>
          </div>

          {/* Newsletter & Promo */}
          <div className="footer-col newsletter-box">
            <h5>Join the Maker Club</h5>
            <p>Get exclusive launch discounts on competition kits, monthly CAD files, and a ₹100 voucher on signup.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className="newsletter-input"
                aria-label="Your email address for newsletter subscription"
                placeholder="Enter your email..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
            </form>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              🔒 We respect your privacy. No spam ever.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div>
            © 2026 CreotexShop Technologies Pvt. Ltd. All rights reserved. GST Registered.
          </div>
          <div className="payment-badges">
            <span className="payment-chip">UPI (GPay/PhonePe)</span>
            <span className="payment-chip">RuPay</span>
            <span className="payment-chip">Visa</span>
            <span className="payment-chip">Mastercard</span>
            <span className="payment-chip">NetBanking</span>
            <span className="payment-chip">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
