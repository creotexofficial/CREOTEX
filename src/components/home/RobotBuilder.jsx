import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

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
    badge: 'Interactive Engineering Tool',
    title: 'Custom Competition Robot Builder',
    subtitle: 'Configure your championship Line Follower, Robo Race, or 360° Soccer Robot in real time.',
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
  };

  const setComponent = (slotKey, productId) => {
    setSelections((prev) => ({ ...prev, [slotKey]: productId }));
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
  };

  return (
    <section className="robot-builder-section" id="robot-builder">
      <div className="container">
        <div className="section-header-center">
          <span className="section-badge">{settings.badge || 'Interactive Engineering Tool'}</span>
          <h2 className="section-title">{settings.title || 'Custom Competition Robot Builder'}</h2>
          <p className="section-subtitle">
            {settings.subtitle || 'Configure your championship Line Follower, Robo Race, Combat Bot, or 360° Soccer Robot in real time. 100% component compatibility guaranteed with a custom kit discount!'}
          </p>
        </div>

        <div className="builder-layout">
          {/* Left: Presets & Component Selector */}
          <div className="builder-controls">
            <div className="preset-selector">
              <label className="builder-section-label">Select Competition Category:</label>
              <div
                className="preset-tabs"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(presetKeys.length, 4)}, 1fr)`
                }}
              >
                {presetKeys.map((key) => {
                  const p = presets[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`preset-tab-btn ${currentPreset === key ? 'active' : ''}`}
                      onClick={() => applyPreset(key)}
                    >
                      <span className="preset-icon">{p.icon || '🤖'}</span>
                      <span className="preset-text">
                        <strong>{p.name}</strong>
                        <small>{p.subtitle || 'Championship Grade'}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="builder-slots">
              {slots.map((slot) => {
                const selectedOpt = getComponentOption(slot.key);
                const selectedId = selections[slot.key] || (slot.options?.[0]?.id || '');
                return (
                  <div key={slot.key} className="builder-slot-card">
                    <div className="slot-header">
                      <span className="slot-title">{slot.name}</span>
                      <span className="slot-price">
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
                            {opt.name} - ₹{Number(opt.price).toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Blueprint & Price Summary Card */}
          <div className="builder-summary-panel">
            <div className="blueprint-card">
              <div className="blueprint-header">
                <span className="live-dot"></span>
                <h4>Live Assembly Blueprint</h4>
                <span className="preset-badge">{currentInfo.name}</span>
              </div>

              <div className="blueprint-visual">
                <div className="schematic-display" id="schematic-view">
                  {slots.map((slot) => {
                    const opt = getComponentOption(slot.key);
                    return (
                      <div
                        key={slot.key}
                        className={`schematic-layer layer-${slot.key}`}
                        title={slot.name}
                      >
                        <span className="schematic-tag">
                          {slot.name.split('.')[1] || slot.name}: {opt?.name || 'Selected'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="blueprint-desc">{currentInfo.desc}</p>
              </div>

              {/* Price Breakdown */}
              <div className="builder-pricing">
                <div className="price-row">
                  <span>Individual Parts Total:</span>
                  <span className="old-price">₹{originalTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="price-row">
                  <span>Catalog Subtotal:</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="price-row bundle-save">
                  <span>Kit Bundle Discount ({settings.discountPercent || 10}% OFF):</span>
                  <span className="text-accent">- ₹{bundleDiscount.toLocaleString('en-IN')}</span>
                </div>
                <div className="price-divider"></div>
                <div className="price-row total-row">
                  <span className="total-label">Complete Custom Kit:</span>
                  <span className="total-val">₹{finalBundlePrice.toLocaleString('en-IN')}</span>
                </div>
                {savings > 0 && (
                  <div className="savings-pill">
                    🎉 Total Maker Savings: ₹{savings.toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary btn-block btn-bundle-add"
                id="btn-add-robot-bundle"
                onClick={handleAddBundleToCart}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Add Custom Kit to Cart</span>
              </button>

              <div className="builder-perks">
                {settings.perks && settings.perks.length > 0 ? (
                  settings.perks.map((perk, idx) => (
                    <div key={idx} className="perk-item">✓ {perk}</div>
                  ))
                ) : (
                  <>
                    <div className="perk-item">✓ 100% Component Compatibility Verified</div>
                    <div className="perk-item">✓ Includes Screws, Standoffs &amp; Wire Cables</div>
                    <div className="perk-item">✓ Free Express Delivery + Pre-Tuned Sample Code</div>
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

