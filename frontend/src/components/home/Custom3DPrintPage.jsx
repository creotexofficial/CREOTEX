import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Header } from '../layout/Header';
import { MegaNav } from '../layout/MegaNav';
import { Footer } from '../layout/Footer';
import { NeuralBackground } from '../layout/NeuralBackground';
import { Custom3DPrintSection } from './Custom3DPrintSection';

export const Custom3DPrintPage = () => {
  const { navigateToHome, currentUser, setAdminActiveTab, setCurrentView } = useCart();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const FAQS = [
    {
      q: 'What 3D and 2D file formats are accepted?',
      a: 'We accept 3D CAD files (.STL, .STEP, .STP) as well as 2D reference images (.JPG, .PNG, .WEBP, .BMP, .SVG) for custom manufacturing and lithophanes.'
    },
    {
      q: 'What is the dimensional tolerance and print quality?',
      a: 'Our high-end Bambu Lab X1-Carbon and Voron print farm achieves industrial tolerances within ±0.05mm to ±0.1mm. For micro-tolerance gears, our SLA UV Resin system operates at 0.025mm layer resolution.'
    },
    {
      q: 'Which material should I choose for robotics competition parts?',
      a: 'For high-impact gears and chassis plates, we recommend PLA+ or PETG Pro. For high-torque motor mounts and high-temperature environments, choose ABS Industrial. For drone arms and race brackets requiring maximum stiffness, Carbon Fiber PETG/Nylon (CF-15) is our championship choice. For tires and bumpers, TPU 95A flexible rubber is ideal.'
    },
    {
      q: 'How fast will my custom 3D printed parts be dispatched?',
      a: 'Standard orders are printed and dispatched within 24 to 48 hours. If you select our 24-Hour Rush Dispatch upgrade, your job jumps to the front of our print farm queue for same-day/next-day priority shipping.'
    },
    {
      q: 'Are my CAD design files kept confidential?',
      a: 'Yes, 100%. All uploaded 3D models and drawings are protected under strict Non-Disclosure Agreements (NDA). Your proprietary designs are never shared, publicly displayed, or reused.'
    }
  ];

  return (
    <>
      {/* Background canvas */}
      <NeuralBackground />

      <div className="creotex-app-root" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header & Navigation */}
        <Header />
        <MegaNav />

        {/* Dedicated Page Main Content */}
        <main id="main-content" style={{ minHeight: '85vh', padding: '24px 0 80px' }}>
          <div className="container">
            {/* Top Breadcrumb & Action Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '24px',
                paddingBottom: '14px',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span
                  onClick={navigateToHome}
                  style={{ cursor: 'pointer', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  🏠 Home
                </span>
                <span>/</span>
                <span style={{ color: '#F97316', fontWeight: '700' }}>
                  🖨️ Custom 3D Printing Studio
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {currentUser?.role === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAdminActiveTab('settings');
                      setCurrentView('admin');
                    }}
                    style={{
                      background: 'rgba(249, 115, 22, 0.1)',
                      border: '1.5px solid #F97316',
                      color: '#F97316',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>⚙️ Admin Panel</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={navigateToHome}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    padding: '7px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>← Back to Storefront</span>
                </button>
              </div>
            </div>

            {/* Core Interactive 3D Print Studio */}
            <Custom3DPrintSection hideHeader={true} />

            {/* 4-Step Production Workflow Strip */}
            <div style={{
              marginTop: '50px',
              padding: '36px 30px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                textAlign: 'center',
                margin: '0 0 28px'
              }}>
                How Creotex Custom 3D Printing Works
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(249, 115, 22, 0.15)',
                    color: '#F97316',
                    fontSize: '1.3rem',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    1
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    Upload File
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                    Drag &amp; drop any 3D model (.STL, .STEP) or 2D image (.JPG, .PNG).
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(249, 115, 22, 0.15)',
                    color: '#F97316',
                    fontSize: '1.3rem',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    2
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    Configure Material
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                    Pick your filament (PLA, PETG, ABS, TPU, Carbon Fiber) and chosen color swatch.
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(249, 115, 22, 0.15)',
                    color: '#F97316',
                    fontSize: '1.3rem',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    3
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    Instant Price
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                    Real-time automatic price calculation based on calculated weight and volume.
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    fontSize: '1.3rem',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    4
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    Print &amp; Deliver
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                    Manufactured on high-speed Bambu X1-C farm and delivered directly to your doorstep.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical FAQ Accordion */}
            <div style={{ marginTop: '40px' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                Frequently Asked Questions
              </h3>

              <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {FAQS.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-primary)',
                          fontSize: '0.92rem',
                          fontWeight: '700',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <span>{faq.q}</span>
                        <span style={{ fontSize: '1.1rem', color: '#F97316', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }}>
                          +
                        </span>
                      </button>

                      {isOpen && (
                        <div style={{
                          padding: '0 20px 16px',
                          fontSize: '0.84rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.6,
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          paddingTop: '12px'
                        }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Custom3DPrintPage;
