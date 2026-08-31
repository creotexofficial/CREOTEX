import React from 'react';
import { useCart } from '../../context/CartContext';

export const DatasheetsHub = () => {
  const { showToast } = useCart();

  return (
    <section className="datasheet-hub-section" id="datasheet-hub">
      <div className="container">
        <div className="section-header-center" style={{ marginBottom: '20px' }}>
          <span className="section-badge">Maker Knowledge Hub</span>
          <h2 className="section-title">Technical Guides &amp; Datasheets</h2>
          <p className="section-subtitle">
            Download wiring diagrams, pinout schematics, and PID tuning firmware for your engineering projects.
          </p>
        </div>

        <div className="guides-grid">
          <div className="guide-card">
            <div className="guide-icon">🔌</div>
            <h4 className="guide-title">Cytron MDD10A &amp; TB6612 Wiring Guide</h4>
            <p className="guide-desc">Detailed Arduino, ESP32, and STM32 PWM control connections with code samples.</p>
            <a
              href="#datasheet-hub"
              className="guide-link"
              onClick={(e) => {
                e.preventDefault();
                showToast('Downloaded Motor Driver Wiring Guide PDF', 'info');
              }}
            >
              Download PDF Schematics →
            </a>
          </div>

          <div className="guide-card">
            <div className="guide-icon">🏁</div>
            <h4 className="guide-title">High-Speed LFR PID Auto-Tuning Code</h4>
            <p className="guide-desc">Optimized Kp, Ki, Kd coefficients for QTR-8RC reflectance sensor arrays at 2.5m/s.</p>
            <a
              href="#datasheet-hub"
              className="guide-link"
              onClick={(e) => {
                e.preventDefault();
                showToast('Downloaded PID Tuning Arduino Library & Code', 'info');
              }}
            >
              Get Arduino Sketch →
            </a>
          </div>

          <div className="guide-card">
            <div className="guide-icon">🧵</div>
            <h4 className="guide-title">Carbon Fiber &amp; TPU 3D Print Profiles</h4>
            <p className="guide-desc">Cura &amp; Bambu Studio profiles with optimal retraction, temperature, and layer speeds.</p>
            <a
              href="#datasheet-hub"
              className="guide-link"
              onClick={(e) => {
                e.preventDefault();
                showToast('Downloaded 3D Slicer Profile .3mf', 'info');
              }}
            >
              Download Slicer 3MF →
            </a>
          </div>

          <div className="guide-card">
            <div className="guide-icon">🔩</div>
            <h4 className="guide-title">Metric Fastener Sizing &amp; Torque Chart</h4>
            <p className="guide-desc">M2, M3, M4, M5 screw pitch standards, standoff lengths, and drill hole tolerances.</p>
            <a
              href="#datasheet-hub"
              className="guide-link"
              onClick={(e) => {
                e.preventDefault();
                showToast('Downloaded Fastener Wall Chart PDF', 'info');
              }}
            >
              Download Metric Wall Chart →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
