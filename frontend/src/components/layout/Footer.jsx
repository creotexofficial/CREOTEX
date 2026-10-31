import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

// Native SVG vector icons for guaranteed bundler compatibility & crisp styling
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
  </svg>
);

const WhatsappIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="footer-link-chevron">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

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
                <span className="brand-tagline">3D Filaments, Prints &amp; Custom Studio</span>
              </div>
            </a>
            <p>
              CreotexShop is India's dedicated 3D printing ecosystem. Supplying precision 1.75mm engineering filament spools, ready-to-ship 3D printed functional products, and an on-demand high-speed custom 3D printing farm.
            </p>
            {/* 4 Professional Dynamic Icons */}
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub" title="GitHub">
                <GithubIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="YouTube" title="YouTube">
                <YoutubeIcon />
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="WhatsApp" title="WhatsApp">
                <WhatsappIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram" title="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* 3 Core 3D Sections */}
          <div className="footer-col">
            <h5>3D Printing Ecosystem</h5>
            <ul className="footer-links-list">
              <li>
                <a href="#filament-hub-section">
                  <ChevronRightIcon />
                  🧵 3D Filament Spool (PLA/PETG/ABS)
                </a>
              </li>
              <li>
                <a href="#section-3d-print-products" onClick={(e) => handleCategoryNav('3d-products', e)}>
                  <ChevronRightIcon />
                  📦 3D Print Product (Articulated &amp; Desk)
                </a>
              </li>
              <li>
                <a href="#custom-3d-print">
                  <ChevronRightIcon />
                  🖨️ Custom 3D Print (Instant CAD Quote)
                </a>
              </li>
              <li>
                <a href="#filament-hub-section">
                  <ChevronRightIcon />
                  🔥 Carbon Fiber PETG-CF Spools
                </a>
              </li>
              <li>
                <a href="#section-3d-print-products" onClick={(e) => handleCategoryNav('3d-products', e)}>
                  <ChevronRightIcon />
                  ⚙️ Planetary Mechanics &amp; Models
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="footer-col">
            <h5>Studio &amp; Support</h5>
            <ul className="footer-links-list">
              <li>
                <a href="#custom-3d-print">
                  <ChevronRightIcon />
                  Online CAD STL/STEP Uploader
                </a>
              </li>
              <li>
                <a href="#filament-hub-section">
                  <ChevronRightIcon />
                  3D Slicing &amp; Material Profiles
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast("Bambu Lab & Voron farm achieves ±0.05mm precision!", "info"); }}>
                  <ChevronRightIcon />
                  Industrial Tolerance (±0.05mm)
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast("Free express delivery on all orders above ₹999", "info"); }}>
                  <ChevronRightIcon />
                  Shipping &amp; Delivery Policy
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast("7-day replacement warranty on manufacturing defects", "info"); }}>
                  <ChevronRightIcon />
                  7-Day Replacement Policy
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast("Tracking dispatch updates via BlueDart/Delhivery", "info"); }}>
                  <ChevronRightIcon />
                  Track AWB Consignment
                </a>
              </li>
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
              <button type="submit" className="footer-subscribe-btn">
                <span>Subscribe</span>
                <SendIcon />
              </button>
            </form>
            <div className="footer-privacy-tag">
              <ShieldCheckIcon />
              <span>We respect your privacy. No spam ever.</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 Creotex Shop
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
