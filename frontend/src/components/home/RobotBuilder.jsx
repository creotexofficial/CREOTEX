import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

const SLOT_ICONS = {
  chassis: '📐',
  motors: '⚙️',
  wheels: '🛞',
  driver: '⚡',
  power: '🔋',
  addon: '🎯'
};

export const RobotBuilder = () => {
  const {
    addItem,
    showToast,
    setIsCartOpen,
    products,
    robotBuilderPresets,
    robotBuilderSlots,
    robotBuilderSettings
  } = useCart();

  const presets = robotBuilderPresets || {};
  const slots = robotBuilderSlots || [];
  const settings = robotBuilderSettings || {
    enabled: true,
    badge: 'Interactive Engineering Studio',
    title: 'Custom Competition Robot Builder',
    subtitle: 'Configure your championship Line Follower, Robo Race, Combat Bot, or 360° Soccer Robot in real time. 100% component compatibility guaranteed with a custom kit discount!',
    discountPercent: 10,
    perks: []
  };

  const presetKeys = Object.keys(presets).filter(k => presets[k].active !== false);
  const initialPresetKey = presetKeys.length > 0 ? presetKeys[0] : 'robo-race';

  const [currentPreset, setCurrentPreset] = useState(initialPresetKey);
  const [selections, setSelections] = useState(() => {
    const p = presets[initialPresetKey];
    return p && p.defaults ? { ...p.defaults } : {};
  });

  const [activeSlotHighlight, setActiveSlotHighlight] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Sync if preset changes or defaults update
  useEffect(() => {
    if (!presets[currentPreset] && presetKeys.length > 0) {
      setCurrentPreset(presetKeys[0]);
      if (presets[presetKeys[0]]?.defaults) {
        setSelections({ ...presets[presetKeys[0]].defaults });
      }
    }
  }, [presets, currentPreset, presetKeys]);

  const applyPreset = (presetKey) => {
    setCurrentPreset(presetKey);
    const p = presets[presetKey];
    if (p && p.defaults) {
      setSelections({ ...p.defaults });
    }
    showToast?.(`Loaded ${presets[presetKey]?.name || presetKey} template!`, 'info');
  };

  const setComponent = (slotKey, productId) => {
    setSelections((prev) => ({ ...prev, [slotKey]: productId }));
    setActiveSlotHighlight(slotKey);
    setTimeout(() => setActiveSlotHighlight(null), 1200);
  };

  const getComponentOption = (slotKey) => {
    const slot = slots.find(s => s.key === slotKey);
    if (!slot || !slot.options) return null;
    const selectedId = selections[slotKey];
    return slot.options.find(o => o.id === selectedId) || slot.options[0] || null;
  };

  if (settings.enabled === false) {
    return null;
  }

  // Price calculations
  let total = 0;
  let originalTotal = 0;
  for (const slot of slots) {
    const opt = getComponentOption(slot.key);
    if (opt) {
      const price = Number(opt.price) || 0;
      total += price;
      // If linked with catalog product, look up originalPrice
      const catalogProd = (products || []).find(p => p.id === opt.id);
      const originalPrice = catalogProd?.originalPrice || Math.round(price * 1.15);
      originalTotal += originalPrice;
    }
  }

  const discountRate = (settings.discountPercent ?? 10) / 100;
  const bundleDiscount = Math.round(total * discountRate);
  const finalBundlePrice = Math.max(0, total - bundleDiscount);
  const savings = Math.max(0, originalTotal - finalBundlePrice);

  const currentInfo = presets[currentPreset] || {
    name: 'Custom Robot Configuration',
    desc: 'Modular custom competition bot assembled to your precision requirements.',
    subtitle: 'Custom Maker Edition',
    icon: '🤖'
  };

  const handleAddBundleToCart = () => {
    setIsAdding(true);
    const customBundleProduct = {
      id: `custom-bundle-${currentPreset}-${Date.now()}`,
      name: `Custom ${currentInfo.name} Complete Kit`,
      price: finalBundlePrice,
      originalPrice: originalTotal,
      image: "kit-lfr-pro",
      category: "competition-kits",
      sku: `CTX-BND-${currentPreset.toUpperCase()}`,
      stock: 10
    };

    addItem(customBundleProduct, 1, {
      preset: currentPreset,
      presetName: currentInfo.name,
      components: { ...selections },
      customPrice: finalBundlePrice
    });

    setTimeout(() => {
      setIsAdding(false);
      setIsCartOpen?.(true);
    }, 400);
  };

  return (
    <section className="robot-builder-section" id="robot-builder">
      {/* Background Ambience / Cyber Grid Overlay */}
      <div className="builder-bg-glow"></div>
      
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center builder-header">
          <div className="builder-badge-pill">
            <span className="pulse-indicator"></span>
            <span>{settings.badge || 'Interactive Engineering Studio'}</span>
          </div>
          <h2 className="section-title builder-main-title">
            {settings.title || 'Custom Competition Robot Builder'}
          </h2>
          <p className="section-subtitle builder-main-subtitle">
            {settings.subtitle || 'Configure your championship Line Follower, Robo Race, Combat Bot, or 360° Soccer Robot in real time. 100% component compatibility guaranteed with a custom kit discount!'}
          </p>
        </div>

        <div className="builder-layout">
          {/* Left Column: Preset Categories & Modular Slots */}
          <div className="builder-controls">
            
            {/* Category Archetype Tabs */}
            <div className="preset-selector-card">
              <div className="preset-selector-header">
                <span className="builder-step-tag">STEP 1</span>
                <label className="builder-section-label">Select Competition Category Archetype</label>
              </div>
              
              <div className="preset-tabs-grid">
                {presetKeys.map((key) => {
                  const p = presets[key];
                  const isActive = currentPreset === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`preset-tab-card ${isActive ? 'active' : ''}`}
                      onClick={() => applyPreset(key)}
                    >
                      <div className="preset-icon-badge">{p.icon || '🤖'}</div>
                      <div className="preset-info-wrap">
                        <strong className="preset-card-title">{p.name}</strong>
                        <span className="preset-card-sub">{p.subtitle || 'Competition Grade'}</span>
                      </div>
                      {isActive && <div className="preset-active-check">✓ Active</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modular Component Slot Cards */}
            <div className="builder-slots-section">
              <div className="slots-section-header">
                <span className="builder-step-tag">STEP 2</span>
                <label className="builder-section-label">Customize &amp; Fine-Tune Hardware Modules</label>
              </div>

              <div className="builder-slots-grid">
                {slots.map((slot, index) => {
                  const selectedOpt = getComponentOption(slot.key);
                  const selectedId = selections[slot.key] || (slot.options?.[0]?.id || '');
                  const isHighlighted = activeSlotHighlight === slot.key;
                  const slotIcon = SLOT_ICONS[slot.key] || '🔧';

                  return (
                    <div 
                      key={slot.key} 
                      className={`builder-slot-card ${isHighlighted ? 'slot-highlight' : ''}`}
                    >
                      <div className="slot-card-header">
                        <div className="slot-title-wrap">
                          <span className="slot-index-pill">{String(index + 1).padStart(2, '0')}</span>
                          <span className="slot-icon">{slotIcon}</span>
                          <span className="slot-title">{slot.name.replace(/^[0-9.]+\s*/, '')}</span>
                        </div>
                        <span className="slot-price-badge">
                          ₹{selectedOpt ? Number(selectedOpt.price).toLocaleString('en-IN') : 0}
                        </span>
                      </div>

                      <div className="slot-select-wrapper">
                        <select
                          className="builder-select custom-select"
                          value={selectedId}
                          onChange={(e) => setComponent(slot.key, e.target.value)}
                        >
                          {slot.options && slot.options.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name} — ₹{Number(opt.price).toLocaleString('en-IN')}
                            </option>
                          ))}
                        </select>
                        <div className="select-arrow-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </div>

                      {selectedOpt && (
                        <div className="slot-spec-footer">
                          <span className="slot-sku-tag">SKU: {selectedOpt.sku || 'CTX-MOD'}</span>
                          <span className="slot-verified-tag">✓ Verified Fit</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Blueprint HUD & Pricing Panel */}
          <div className="builder-summary-panel">
            <div className="blueprint-card">
              
              {/* HUD Header */}
              <div className="blueprint-header">
                <div className="blueprint-status">
                  <span className="live-dot pulse"></span>
                  <span className="blueprint-hud-title">LIVE CAD BLUEPRINT</span>
                </div>
                <span className="preset-badge">{currentInfo.name}</span>
              </div>

              {/* Holographic Schematic Display */}
              <div className="blueprint-visual">
                <div className="schematic-display-hud" id="schematic-view">
                  <div className="schematic-grid-lines"></div>
                  
                  <div className="schematic-modules-list">
                    {slots.map((slot) => {
                      const opt = getComponentOption(slot.key);
                      const isHighlighted = activeSlotHighlight === slot.key;
                      const icon = SLOT_ICONS[slot.key] || '⚙️';
                      const cleanName = slot.name.replace(/^[0-9.]+\s*/, '');

                      return (
                        <div
                          key={slot.key}
                          className={`schematic-layer-hud layer-${slot.key} ${isHighlighted ? 'active-pulse' : ''}`}
                          title={slot.name}
                        >
                          <span className="schematic-layer-icon">{icon}</span>
                          <span className="schematic-layer-type">{cleanName}</span>
                          <span className="schematic-layer-val">{opt?.name || 'Selected'}</span>
                          <span className="schematic-check">✓</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="blueprint-meta-bar">
                  <span className="meta-tag">⚡ Compatibility 100%</span>
                  <span className="meta-tag">⚖️ Weight Optimized</span>
                  <span className="meta-tag">🔌 Plug &amp; Play</span>
                </div>

                <p className="blueprint-desc">{currentInfo.desc}</p>
              </div>

              {/* Price Breakdown */}
              <div className="builder-pricing-box">
                <div className="price-row">
                  <span className="price-label">Individual Components:</span>
                  <span className="old-price">₹{originalTotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="price-row">
                  <span className="price-label">Standard Subtotal:</span>
                  <span className="price-value">₹{total.toLocaleString('en-IN')}</span>
                </div>

                <div className="price-row bundle-save-row">
                  <span className="price-label flex-center-gap">
                    <span className="discount-tag">{settings.discountPercent || 10}% OFF</span>
                    Bundle Discount:
                  </span>
                  <span className="save-amount">- ₹{bundleDiscount.toLocaleString('en-IN')}</span>
                </div>

                <div className="price-divider"></div>

                <div className="price-row total-kit-row">
                  <div className="total-kit-label">
                    <span>Complete Custom Kit</span>
                    <small>Pre-calibrated &amp; Assembled</small>
                  </div>
                  <div className="total-kit-price">
                    ₹{finalBundlePrice.toLocaleString('en-IN')}
                  </div>
                </div>

                {savings > 0 && (
                  <div className="savings-pill-banner">
                    🎉 You Save ₹{savings.toLocaleString('en-IN')} with this Builder Kit!
                  </div>
                )}
              </div>

              {/* Add to Cart CTA */}
              <button
                className={`btn btn-primary btn-block btn-bundle-add ${isAdding ? 'loading' : ''}`}
                id="btn-add-robot-bundle"
                onClick={handleAddBundleToCart}
                disabled={isAdding}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>{isAdding ? 'Adding Custom Kit...' : 'Add Complete Custom Kit to Cart'}</span>
              </button>

              {/* Perks & Assurance */}
              <div className="builder-perks-list">
                {settings.perks && settings.perks.length > 0 ? (
                  settings.perks.map((perk, idx) => (
                    <div key={idx} className="perk-item-pill">
                      <span className="perk-check">✓</span>
                      <span>{perk}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="perk-item-pill">
                      <span className="perk-check">✓</span>
                      <span>100% Component Compatibility Guaranteed</span>
                    </div>
                    <div className="perk-item-pill">
                      <span className="perk-check">✓</span>
                      <span>Includes Standoffs, Fasteners &amp; Wiring Harness</span>
                    </div>
                    <div className="perk-item-pill">
                      <span className="perk-check">✓</span>
                      <span>Free Express Shipping + Pre-Tuned Sample Firmware</span>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


