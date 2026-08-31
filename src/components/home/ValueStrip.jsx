import React from 'react';

export const ValueStrip = () => {
  return (
    <section className="features-strip-section">
      <div className="container">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div className="feature-info">
              <h5>Free Express Shipping</h5>
              <p>On all orders above ₹999 across India</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="feature-info">
              <h5>100% Genuine Components</h5>
              <p>Direct from factory &amp; lab certified</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div className="feature-info">
              <h5>Maker Tech Support</h5>
              <p>Engineer assistance for project wiring</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </div>
            <div className="feature-info">
              <h5>7-Day Easy Replacements</h5>
              <p>Hassle-free replacement guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
