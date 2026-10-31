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
              <p>On all filament spools &amp; orders above ₹999</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="feature-info">
              <h5>Bambu Lab &amp; Voron Farm</h5>
              <p>±0.05mm high-precision print tolerance</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="feature-info">
              <h5>Rapid 24H Dispatch</h5>
              <p>Priority rush queue for instant 3D orders</p>
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
              <h5>100% Quality Inspected</h5>
              <p>Vacuum-sealed spools &amp; tested print beds</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
