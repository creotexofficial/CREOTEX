import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const AdminRobotBuilder = () => {
  const {
    robotBuilderPresets,
    robotBuilderSlots,
    robotBuilderSettings,
    updateRobotBuilderSettings,
    saveRobotBuilderPreset,
    deleteRobotBuilderPreset,
    saveRobotBuilderSlot,
    deleteRobotBuilderSlot,
    addSlotOption,
    updateSlotOption,
    deleteSlotOption,
    resetRobotBuilderDefaults,
    products,
    navigateToStorefront,
    showToast
  } = useCart();

  const [activeSubTab, setActiveSubTab] = useState('presets'); // 'presets' | 'slots' | 'settings' | 'preview'
  const [selectedSlotKey, setSelectedSlotKey] = useState(robotBuilderSlots[0]?.key || 'chassis');

  // Modals state
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [editingPresetKey, setEditingPresetKey] = useState(null);
  const [presetForm, setPresetForm] = useState({
    id: '',
    name: '',
    subtitle: '',
    icon: '🤖',
    desc: '',
    active: true,
    defaults: {}
  });

  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlotKey, setEditingSlotKey] = useState(null);
  const [slotForm, setSlotForm] = useState({
    key: '',
    name: '',
    description: ''
  });

  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [targetSlotForOption, setTargetSlotForOption] = useState(null);
  const [editingOptionId, setEditingOptionId] = useState(null);
  const [selectedCatalogProductId, setSelectedCatalogProductId] = useState('');
  const [optionForm, setOptionForm] = useState({
    id: '',
    name: '',
    price: 999,
    sku: ''
  });

  // Settings local state
  const [settingsForm, setSettingsForm] = useState({
    enabled: robotBuilderSettings.enabled ?? true,
    badge: robotBuilderSettings.badge || 'Interactive Engineering Tool',
    title: robotBuilderSettings.title || 'Custom Competition Robot Builder',
    subtitle: robotBuilderSettings.subtitle || '',
    discountPercent: robotBuilderSettings.discountPercent || 10,
    perks: robotBuilderSettings.perks || []
  });
  const [newPerkInput, setNewPerkInput] = useState('');

  // Interactive Live Preview Local State
  const [previewPresetKey, setPreviewPresetKey] = useState(Object.keys(robotBuilderPresets)[0] || 'robo-race');
  const [previewSelections, setPreviewSelections] = useState(() => {
    const firstPreset = robotBuilderPresets[Object.keys(robotBuilderPresets)[0]];
    return firstPreset?.defaults ? { ...firstPreset.defaults } : {};
  });

  // Stats calculation
  const totalPresetsCount = Object.keys(robotBuilderPresets).length;
  const totalSlotsCount = robotBuilderSlots.length;
  const totalOptionsCount = robotBuilderSlots.reduce((sum, s) => sum + (s.options?.length || 0), 0);

  // PRESET MODAL HANDLERS
  const openNewPresetModal = () => {
    setEditingPresetKey(null);
    const initialDefaults = {};
    robotBuilderSlots.forEach(s => {
      if (s.options && s.options.length > 0) {
        initialDefaults[s.key] = s.options[0].id;
      }
    });

    setPresetForm({
      id: `preset-${Date.now().toString(36)}`,
      name: '',
      subtitle: 'Custom Championship Build',
      icon: '🤖',
      desc: '',
      active: true,
      defaults: initialDefaults
    });
    setIsPresetModalOpen(true);
  };

  const openEditPresetModal = (key) => {
    const p = robotBuilderPresets[key];
    if (!p) return;
    setEditingPresetKey(key);
    setPresetForm({
      id: key,
      name: p.name || '',
      subtitle: p.subtitle || '',
      icon: p.icon || '🤖',
      desc: p.desc || '',
      active: p.active !== false,
      defaults: p.defaults ? { ...p.defaults } : {}
    });
    setIsPresetModalOpen(true);
  };

  const handleSavePreset = (e) => {
    e.preventDefault();
    if (!presetForm.name.trim()) {
      showToast('Please enter a preset name', 'error');
      return;
    }

    const key = editingPresetKey || (presetForm.id ? presetForm.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : `preset-${Date.now().toString(36)}`);

    saveRobotBuilderPreset(key, {
      ...presetForm,
      id: key
    });
    setIsPresetModalOpen(false);
  };

  const handleDuplicatePreset = (key) => {
    const original = robotBuilderPresets[key];
    if (!original) return;
    const newKey = `${key}-copy-${Date.now().toString(36).slice(-3)}`;
    saveRobotBuilderPreset(newKey, {
      ...original,
      id: newKey,
      name: `${original.name} (Copy)`
    });
  };

  // SLOT MODAL HANDLERS
  const openNewSlotModal = () => {
    setEditingSlotKey(null);
    setSlotForm({
      key: `slot-${Date.now().toString(36).slice(-4)}`,
      name: '',
      description: ''
    });
    setIsSlotModalOpen(true);
  };

  const openEditSlotModal = (slot) => {
    setEditingSlotKey(slot.key);
    setSlotForm({
      key: slot.key,
      name: slot.name || '',
      description: slot.description || ''
    });
    setIsSlotModalOpen(true);
  };

  const handleSaveSlot = (e) => {
    e.preventDefault();
    if (!slotForm.name.trim()) {
      showToast('Please enter a slot name', 'error');
      return;
    }

    const key = editingSlotKey || (slotForm.key ? slotForm.key.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : `slot-${Date.now().toString(36).slice(-4)}`);

    const existingSlot = robotBuilderSlots.find(s => s.key === key);
    saveRobotBuilderSlot(key, {
      key,
      name: slotForm.name,
      description: slotForm.description,
      options: existingSlot ? existingSlot.options : []
    });

    setIsSlotModalOpen(false);
    setSelectedSlotKey(key);
  };

  // OPTION MODAL HANDLERS
  const openNewOptionModal = (slotKey) => {
    setTargetSlotForOption(slotKey);
    setEditingOptionId(null);
    setSelectedCatalogProductId('');
    setOptionForm({
      id: `opt-${Date.now().toString(36)}`,
      name: '',
      price: 999,
      sku: `CTX-${slotKey.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
    });
    setIsOptionModalOpen(true);
  };

  const openEditOptionModal = (slotKey, opt) => {
    setTargetSlotForOption(slotKey);
    setEditingOptionId(opt.id);
    setSelectedCatalogProductId('');
    setOptionForm({
      id: opt.id,
      name: opt.name || '',
      price: opt.price || 0,
      sku: opt.sku || ''
    });
    setIsOptionModalOpen(true);
  };

  const handleCatalogProductSelect = (prodId) => {
    setSelectedCatalogProductId(prodId);
    if (!prodId) return;
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setOptionForm({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        sku: prod.sku || `CTX-${prod.id.toUpperCase()}`
      });
    }
  };

  const handleSaveOption = (e) => {
    e.preventDefault();
    if (!optionForm.name.trim()) {
      showToast('Please enter component part name', 'error');
      return;
    }

    if (editingOptionId) {
      updateSlotOption(targetSlotForOption, editingOptionId, {
        name: optionForm.name,
        price: parseFloat(optionForm.price) || 0,
        sku: optionForm.sku
      });
    } else {
      addSlotOption(targetSlotForOption, {
        id: optionForm.id || `opt-${Date.now().toString(36)}`,
        name: optionForm.name,
        price: parseFloat(optionForm.price) || 0,
        sku: optionForm.sku
      });
    }

    setIsOptionModalOpen(false);
  };

  // SETTINGS HANDLER
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateRobotBuilderSettings(settingsForm);
  };

  const handleAddPerk = () => {
    if (!newPerkInput.trim()) return;
    setSettingsForm(prev => ({
      ...prev,
      perks: [...prev.perks, newPerkInput.trim()]
    }));
    setNewPerkInput('');
  };

  const handleRemovePerk = (idx) => {
    setSettingsForm(prev => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== idx)
    }));
  };

  // Simulation calculations
  const activePresetInfo = robotBuilderPresets[previewPresetKey] || Object.values(robotBuilderPresets)[0] || { name: 'Custom Bot', desc: '' };
  
  let simTotal = 0;
  let simOriginalTotal = 0;
  robotBuilderSlots.forEach(slot => {
    const selectedId = previewSelections[slot.key];
    const opt = slot.options?.find(o => o.id === selectedId) || slot.options?.[0];
    if (opt) {
      const price = Number(opt.price) || 0;
      simTotal += price;
      const catalogProd = (products || []).find(p => p.id === opt.id);
      const originalPrice = catalogProd?.originalPrice || Math.round(price * 1.15);
      simOriginalTotal += originalPrice;
    }
  });

  const simDiscountPercent = robotBuilderSettings.discountPercent ?? 10;
  const simDiscount = Math.round(simTotal * (simDiscountPercent / 100));
  const simFinalPrice = Math.max(0, simTotal - simDiscount);
  const simSavings = Math.max(0, simOriginalTotal - simFinalPrice);

  const currentActiveSlotObj = robotBuilderSlots.find(s => s.key === selectedSlotKey) || robotBuilderSlots[0];

  return (
    <div className="admin-page-content robot-builder-admin">
      {/* Top Banner / Metrics */}
      <div className="admin-card builder-top-card">
        <div className="admin-card-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 className="admin-card-title" style={{ margin: 0 }}>
                <span style={{ fontSize: '1.4rem' }}>🤖</span>
                Custom Competition Robot Builder Manager
              </h2>
              <span className={`badge-status ${robotBuilderSettings.enabled ? 'badge-instock' : 'badge-outofstock'}`}>
                {robotBuilderSettings.enabled ? 'Live on Storefront' : 'Disabled'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '750px' }}>
              Configure competition robot categories, modular engineering slots (Chassis, Motors, Wheels, Drivers, Battery, Addons), custom part options, catalog linking, and live discount bundles.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="admin-action-pill-btn"
              onClick={resetRobotBuilderDefaults}
              title="Reset all robot builder presets and slots to factory defaults"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
              </svg>
              <span>Restore Defaults</span>
            </button>

            <button
              type="button"
              className="admin-action-pill-btn"
              onClick={navigateToStorefront}
              title="Preview on customer storefront"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>View Storefront</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="builder-metrics-row">
          <div className="builder-metric-card">
            <span className="metric-label">Competition Presets</span>
            <span className="metric-val">{totalPresetsCount}</span>
            <span className="metric-sub">Robo Race, LFR, Soccer, Combat</span>
          </div>

          <div className="builder-metric-card">
            <span className="metric-label">Component Slots</span>
            <span className="metric-val">{totalSlotsCount}</span>
            <span className="metric-sub">Modular Assembly Layers</span>
          </div>

          <div className="builder-metric-card">
            <span className="metric-label">Available Parts</span>
            <span className="metric-val">{totalOptionsCount}</span>
            <span className="metric-sub">Across All Hardware Slots</span>
          </div>

          <div className="builder-metric-card highlight">
            <span className="metric-label">Kit Bundle Discount</span>
            <span className="metric-val">{robotBuilderSettings.discountPercent || 10}% OFF</span>
            <span className="metric-sub">Auto-Applied to Complete Kits</span>
          </div>
        </div>

        {/* Sub-Navigation Pill Tabs */}
        <div className="builder-subtabs-nav">
          <button
            type="button"
            className={`builder-subtab-btn ${activeSubTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('presets')}
          >
            <span style={{ fontSize: '1.1rem' }}>🏆</span>
            <span>Competition Presets ({totalPresetsCount})</span>
          </button>

          <button
            type="button"
            className={`builder-subtab-btn ${activeSubTab === 'slots' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('slots')}
          >
            <span style={{ fontSize: '1.1rem' }}>⚙️</span>
            <span>Component Slots &amp; Parts ({totalSlotsCount})</span>
          </button>

          <button
            type="button"
            className={`builder-subtab-btn ${activeSubTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('settings')}
          >
            <span style={{ fontSize: '1.1rem' }}>🛠️</span>
            <span>Global Settings &amp; Perks</span>
          </button>

          <button
            type="button"
            className={`builder-subtab-btn ${activeSubTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('preview')}
          >
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <span>Live Interactive Simulator</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: PRESETS MANAGER ================= */}
      {activeSubTab === 'presets' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title" style={{ fontSize: '1.1rem' }}>
                Configured Competition Robot Presets
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Preset configurations shown on customer builder tabs with pre-selected hardware
              </div>
            </div>

            <button className="admin-action-pill-btn primary" onClick={openNewPresetModal}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add New Robot Preset</span>
            </button>
          </div>

          <div className="builder-preset-grid">
            {Object.entries(robotBuilderPresets).map(([key, preset]) => {
              return (
                <div key={key} className="builder-preset-item-card">
                  <div className="preset-card-top">
                    <div className="preset-card-icon-title">
                      <span className="preset-big-icon">{preset.icon || '🤖'}</span>
                      <div>
                        <h4 className="preset-card-name">{preset.name}</h4>
                        <span className="preset-card-tag">{preset.subtitle || key}</span>
                      </div>
                    </div>

                    <span className={`badge-status ${preset.active !== false ? 'badge-instock' : 'badge-outofstock'}`}>
                      {preset.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="preset-card-desc">{preset.desc}</p>

                  <div className="preset-card-defaults-box">
                    <div className="defaults-header">Default Components Mapping:</div>
                    <div className="defaults-chips-list">
                      {robotBuilderSlots.map(slot => {
                        const optId = preset.defaults?.[slot.key];
                        const optObj = slot.options?.find(o => o.id === optId);
                        return (
                          <div key={slot.key} className="default-chip">
                            <strong style={{ color: 'var(--text-secondary)' }}>{slot.name.split('.')[1] || slot.name}:</strong>{' '}
                            <span>{optObj ? optObj.name.substring(0, 24) : (optId || 'Default')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="preset-card-actions">
                    <button
                      type="button"
                      className="admin-action-pill-btn"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      onClick={() => openEditPresetModal(key)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      <span>Edit Preset</span>
                    </button>

                    <button
                      type="button"
                      className="btn-table-icon"
                      title="Duplicate Preset"
                      onClick={() => handleDuplicatePreset(key)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="btn-table-icon danger"
                      title="Delete Preset"
                      onClick={() => {
                        if (window.confirm(`Delete preset "${preset.name}"?`)) {
                          deleteRobotBuilderPreset(key);
                        }
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: SLOTS & PARTS MANAGER ================= */}
      {activeSubTab === 'slots' && (
        <div className="builder-slots-manager-layout">
          {/* Left Column: List of Slots */}
          <div className="admin-card builder-slots-sidebar">
            <div className="admin-card-header" style={{ paddingBottom: '12px' }}>
              <div>
                <h3 className="admin-card-title" style={{ fontSize: '1.05rem' }}>Assembly Slots</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ordered modular layers</span>
              </div>
              <button className="btn-table-icon primary" title="Add New Slot Layer" onClick={openNewSlotModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <div className="slots-nav-list">
              {robotBuilderSlots.map((slot, index) => {
                const isSelected = slot.key === selectedSlotKey;
                return (
                  <div
                    key={slot.key}
                    className={`slot-nav-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedSlotKey(slot.key)}
                  >
                    <div className="slot-nav-info">
                      <span className="slot-nav-num">#{index + 1}</span>
                      <div style={{ minWidth: 0 }}>
                        <div className="slot-nav-title">{slot.name}</div>
                        <div className="slot-nav-count">{slot.options?.length || 0} part options</div>
                      </div>
                    </div>

                    <div className="slot-nav-actions" onClick={e => e.stopPropagation()}>
                      <button
                        className="btn-table-icon"
                        title="Edit Slot Info"
                        onClick={() => openEditSlotModal(slot)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>

                      {robotBuilderSlots.length > 1 && (
                        <button
                          className="btn-table-icon danger"
                          title="Delete Slot"
                          onClick={() => {
                            if (window.confirm(`Delete slot "${slot.name}" and all its parts?`)) {
                              deleteRobotBuilderSlot(slot.key);
                              const remaining = robotBuilderSlots.filter(s => s.key !== slot.key);
                              if (remaining.length > 0) setSelectedSlotKey(remaining[0].key);
                            }
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Slot Parts & Config */}
          <div className="admin-card builder-slot-details-card">
            {currentActiveSlotObj ? (
              <>
                <div className="admin-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="slot-badge-key">Slot Key: {currentActiveSlotObj.key}</span>
                      <h3 className="admin-card-title" style={{ fontSize: '1.2rem', margin: 0 }}>
                        {currentActiveSlotObj.name}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {currentActiveSlotObj.description || 'Parts available for customer selection in this assembly stage.'}
                    </p>
                  </div>

                  <button
                    className="admin-action-pill-btn primary"
                    onClick={() => openNewOptionModal(currentActiveSlotObj.key)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Add Component Part</span>
                  </button>
                </div>

                <div className="admin-table-wrapper" style={{ marginTop: '14px' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Part ID / SKU</th>
                        <th>Component Name &amp; Description</th>
                        <th>Price (₹)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentActiveSlotObj.options && currentActiveSlotObj.options.length > 0 ? (
                        currentActiveSlotObj.options.map((opt) => (
                          <tr key={opt.id}>
                            <td>
                              <span style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '0.8rem',
                                color: 'var(--primary)',
                                background: 'rgba(249, 115, 22, 0.12)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                border: '1px solid rgba(249, 115, 22, 0.3)'
                              }}>
                                {opt.sku || opt.id}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{opt.name}</div>
                            </td>
                            <td>
                              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                                ₹{Number(opt.price || 0).toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td>
                              <span className="badge-status badge-instock">Configured</span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  className="btn-table-icon"
                                  title="Edit Part Option"
                                  onClick={() => openEditOptionModal(currentActiveSlotObj.key, opt)}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                </button>
                                <button
                                  className="btn-table-icon danger"
                                  title="Delete Part Option"
                                  onClick={() => {
                                    if (window.confirm(`Delete part "${opt.name}" from ${currentActiveSlotObj.name}?`)) {
                                      deleteSlotOption(currentActiveSlotObj.key, opt.id);
                                    }
                                  }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                            No component parts configured in this slot yet. Click "+ Add Component Part" to add items or link store catalog.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Please select or create an assembly slot from the left column.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: GLOBAL SETTINGS & DISCOUNTS ================= */}
      {activeSubTab === 'settings' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Robot Builder Global Configuration</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Control visibility, marketing badges, bundle discounts, and engineering perks checklist
              </div>
            </div>

            <button
              type="button"
              className="admin-action-pill-btn primary"
              onClick={handleSaveSettings}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span>Save Configuration</span>
            </button>
          </div>

          <form onSubmit={handleSaveSettings} style={{ marginTop: '20px' }}>
            <div className="admin-form-grid">
              {/* Enabled Toggle */}
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settingsForm.enabled}
                    onChange={e => setSettingsForm({ ...settingsForm, enabled: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Display Custom Competition Robot Builder on Customer Storefront
                  </span>
                </label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '28px' }}>
                  When disabled, the interactive builder section will be hidden from the homepage and mega menu.
                </span>
              </div>

              {/* Section Badge */}
              <div className="admin-form-group">
                <label className="admin-form-label">Section Pill Badge Text</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={settingsForm.badge}
                  onChange={e => setSettingsForm({ ...settingsForm, badge: e.target.value })}
                  placeholder="e.g. Interactive Engineering Tool"
                />
              </div>

              {/* Bundle Discount % */}
              <div className="admin-form-group">
                <label className="admin-form-label">Kit Bundle Discount Rate (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  className="admin-form-input"
                  value={settingsForm.discountPercent}
                  onChange={e => setSettingsForm({ ...settingsForm, discountPercent: parseInt(e.target.value, 10) || 0 })}
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Percentage automatically subtracted when all components are configured together.
                </span>
              </div>

              {/* Section Title */}
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">Section Heading Title *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={settingsForm.title}
                  onChange={e => setSettingsForm({ ...settingsForm, title: e.target.value })}
                  required
                  placeholder="e.g. Custom Competition Robot Builder"
                />
              </div>

              {/* Section Subtitle */}
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">Section Subtitle / Description</label>
                <textarea
                  className="admin-form-textarea"
                  rows="2"
                  value={settingsForm.subtitle}
                  onChange={e => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
                  placeholder="Configure your championship Line Follower, Robo Race, Combat Bot..."
                />
              </div>

              {/* Builder Perks List */}
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">Engineering Perks &amp; Guarantees Checklist</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 100% Component Compatibility Verified"
                    value={newPerkInput}
                    onChange={e => setNewPerkInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPerk();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="admin-action-pill-btn primary"
                    onClick={handleAddPerk}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    + Add Perk
                  </button>
                </div>

                <div className="perks-pills-wrap">
                  {settingsForm.perks && settingsForm.perks.map((perk, idx) => (
                    <div key={idx} className="perk-editable-pill">
                      <span>✓ {perk}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePerk(idx)}
                        className="perk-remove-btn"
                        title="Remove perk"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="submit" className="admin-action-pill-btn primary" style={{ padding: '10px 24px' }}>
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 4: LIVE SIMULATOR ================= */}
      {activeSubTab === 'preview' && (
        <div className="admin-card sim-main-card">
          <div className="admin-card-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <h3 className="admin-card-title">Live Storefront Builder Simulation</h3>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Real-time interactive environment to test category switching, modular parts selection, schematic layering, and pricing calculations
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="admin-action-pill-btn"
                onClick={() => {
                  const currentP = robotBuilderPresets[previewPresetKey];
                  if (currentP?.defaults) {
                    setPreviewSelections({ ...currentP.defaults });
                    showToast(`Reset simulator to ${currentP.name} defaults`, 'info');
                  }
                }}
                title="Reset current slot selections back to preset defaults"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M8 16H3v5"></path>
                </svg>
                <span>Reset Selections</span>
              </button>
              <span className="badge-status badge-instock">Real-Time Sync Active</span>
            </div>
          </div>

          {/* Simulation Container Frame */}
          <div className="sim-storefront-wrapper">
            {/* Header Mirror */}
            <div className="section-header-center" style={{ margin: '10px auto 26px', textAlign: 'center' }}>
              <span className="section-badge">{robotBuilderSettings.badge || 'Interactive Engineering Tool'}</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
                {robotBuilderSettings.title || 'Custom Competition Robot Builder'}
              </h2>
              <p className="section-subtitle" style={{ fontSize: '0.9rem', maxWidth: '650px', margin: '0 auto' }}>
                {robotBuilderSettings.subtitle || 'Configure your championship Line Follower, Robo Race, Combat Bot, or 360° Soccer Robot in real time.'}
              </p>
            </div>

            <div className="sim-builder-layout">
              {/* Left Column: Preset Categories & Hardware Component Slots */}
              <div className="sim-builder-controls">
                {/* Category Preset Selector */}
                <div className="preset-selector" style={{ marginBottom: '20px' }}>
                  <label className="builder-section-label">Select Competition Category:</label>
                  <div className="sim-preset-tabs">
                    {Object.entries(robotBuilderPresets).map(([key, p]) => (
                      <button
                        key={key}
                        type="button"
                        className={`preset-tab-btn ${previewPresetKey === key ? 'active' : ''}`}
                        onClick={() => {
                          setPreviewPresetKey(key);
                          if (p.defaults) {
                            setPreviewSelections({ ...p.defaults });
                          }
                        }}
                      >
                        <span className="preset-icon">{p.icon || '🤖'}</span>
                        <span className="preset-text">
                          <strong>{p.name}</strong>
                          <small>{p.subtitle || 'Championship Grade'}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="sim-builder-slots">
                  {robotBuilderSlots.map((slot, sIdx) => {
                    const selectedId = previewSelections[slot.key];
                    const selectedOpt = slot.options?.find(o => o.id === selectedId) || slot.options?.[0];
                    return (
                      <div key={slot.key} className="builder-slot-card sim-slot-card">
                        <div className="slot-header">
                          <span className="slot-title">{slot.name}</span>
                          <span className="slot-price">
                            ₹{selectedOpt ? Number(selectedOpt.price).toLocaleString('en-IN') : 0}
                          </span>
                        </div>
                        <div className="slot-select-wrapper">
                          <select
                            className="builder-select custom-select"
                            value={selectedId || ''}
                            onChange={(e) => setPreviewSelections(prev => ({ ...prev, [slot.key]: e.target.value }))}
                          >
                            {slot.options && slot.options.map(opt => (
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

              {/* Right Column: Live Blueprint & Price Summary */}
              <div className="sim-builder-summary-panel">
                <div className="blueprint-card sim-blueprint-card">
                  <div className="blueprint-header">
                    <span className="live-dot"></span>
                    <h4 style={{ fontSize: '1.05rem', margin: 0 }}>Live Assembly Blueprint</h4>
                    <span className="preset-badge">{activePresetInfo.name}</span>
                  </div>

                  {/* Visual Layers */}
                  <div className="blueprint-visual" style={{ padding: '14px', marginBottom: '16px' }}>
                    <div className="schematic-display" style={{ minHeight: '120px', gap: '6px' }}>
                      {robotBuilderSlots.map((slot) => {
                        const selectedId = previewSelections[slot.key];
                        const opt = slot.options?.find(o => o.id === selectedId) || slot.options?.[0];
                        return (
                          <div
                            key={slot.key}
                            className={`schematic-layer layer-${slot.key}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '7px 10px' }}
                          >
                            <span className="schematic-tag" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <strong>{slot.name.split('.')[1] || slot.name}:</strong> {opt?.name || 'Selected'}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', flexShrink: 0 }}>
                              ₹{Number(opt?.price || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="blueprint-desc" style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                      {activePresetInfo.desc}
                    </p>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="builder-pricing">
                    <div className="price-row">
                      <span>Individual Parts Total:</span>
                      <span className="old-price">₹{simOriginalTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row">
                      <span>Catalog Subtotal:</span>
                      <span>₹{simTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row bundle-save">
                      <span>Kit Bundle Discount ({simDiscountPercent}% OFF):</span>
                      <span className="text-accent">- ₹{simDiscount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-divider"></div>
                    <div className="price-row total-row">
                      <span className="total-label">Complete Custom Kit:</span>
                      <span className="total-val">₹{simFinalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    {simSavings > 0 && (
                      <div className="savings-pill" style={{ margin: '10px 0 14px' }}>
                        🎉 Total Maker Savings: ₹{simSavings.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  {/* Simulation Add Test Action */}
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-bundle-add"
                    onClick={() => {
                      showToast(`Simulation Success! Custom ${activePresetInfo.name} kit configured at ₹${simFinalPrice.toLocaleString('en-IN')}`, 'success');
                    }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>Test Cart Configuration (₹{simFinalPrice.toLocaleString('en-IN')})</span>
                  </button>

                  {/* Perks List */}
                  <div className="builder-perks" style={{ marginTop: '16px' }}>
                    {robotBuilderSettings.perks && robotBuilderSettings.perks.map((perk, i) => (
                      <div key={i} className="perk-item">✓ {perk}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE/EDIT PRESET ================= */}
      {isPresetModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsPresetModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingPresetKey ? '✨ Edit Robot Preset' : '✨ Add New Competition Preset'}
              </h3>
              <button className="btn-table-icon" onClick={() => setIsPresetModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSavePreset} className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Preset ID / Key *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    disabled={!!editingPresetKey}
                    value={presetForm.id}
                    onChange={e => setPresetForm({ ...presetForm, id: e.target.value })}
                    placeholder="e.g. combat-robot"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Category Icon / Emoji</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={presetForm.icon}
                    onChange={e => setPresetForm({ ...presetForm, icon: e.target.value })}
                    placeholder="e.g. 🏎️, ⚡, ⚽, ⚔️, 🦾"
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Preset Robot Name *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    value={presetForm.name}
                    onChange={e => setPresetForm({ ...presetForm, name: e.target.value })}
                    placeholder="e.g. Titanium Combat Bot 150g"
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Subtitle / Focus Tag</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={presetForm.subtitle}
                    onChange={e => setPresetForm({ ...presetForm, subtitle: e.target.value })}
                    placeholder="e.g. Kinetic Weapon &amp; Armor"
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Engineering Description</label>
                  <textarea
                    className="admin-form-textarea"
                    rows="2"
                    value={presetForm.desc}
                    onChange={e => setPresetForm({ ...presetForm, desc: e.target.value })}
                    placeholder="Engineered for high torque impact and responsive cornering..."
                  />
                </div>

                {/* Default parts for each slot */}
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Default Assigned Hardware per Slot:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                    {robotBuilderSlots.map(slot => (
                      <div key={slot.key} style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                          {slot.name}
                        </span>
                        <select
                          className="admin-select"
                          style={{ fontSize: '0.8rem', padding: '6px', width: '100%' }}
                          value={presetForm.defaults?.[slot.key] || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setPresetForm(prev => ({
                              ...prev,
                              defaults: { ...prev.defaults, [slot.key]: val }
                            }));
                          }}
                        >
                          {slot.options && slot.options.map(opt => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer" style={{ margin: '24px -24px -24px', padding: '16px 24px' }}>
                <button type="button" className="admin-action-pill-btn" onClick={() => setIsPresetModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-action-pill-btn primary">Save Preset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE/EDIT SLOT ================= */}
      {isSlotModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsSlotModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingSlotKey ? '⚙️ Edit Assembly Slot' : '⚙️ Add Assembly Slot Layer'}
              </h3>
              <button className="btn-table-icon" onClick={() => setIsSlotModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveSlot} className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Slot Unique Key *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    disabled={!!editingSlotKey}
                    value={slotForm.key}
                    onChange={e => setSlotForm({ ...slotForm, key: e.target.value })}
                    placeholder="e.g. brain, telemetry, armor"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Slot Display Name *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    value={slotForm.name}
                    onChange={e => setSlotForm({ ...slotForm, name: e.target.value })}
                    placeholder="e.g. 7. Microcontroller &amp; Brain Module"
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Slot Engineering Description</label>
                  <textarea
                    className="admin-form-textarea"
                    rows="2"
                    value={slotForm.description}
                    onChange={e => setSlotForm({ ...slotForm, description: e.target.value })}
                    placeholder="Core compute unit processing sensor telemetry and motor PID..."
                  />
                </div>
              </div>

              <div className="admin-modal-footer" style={{ margin: '24px -24px -24px', padding: '16px 24px' }}>
                <button type="button" className="admin-action-pill-btn" onClick={() => setIsSlotModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-action-pill-btn primary">Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE/EDIT COMPONENT OPTION ================= */}
      {isOptionModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsOptionModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingOptionId ? '🛠️ Edit Component Part' : '🛠️ Add Component Part to Slot'}
              </h3>
              <button className="btn-table-icon" onClick={() => setIsOptionModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveOption} className="admin-modal-body">
              <div className="admin-form-grid">
                {/* Catalog Quick Import (Only for new options) */}
                {!editingOptionId && (
                  <div className="admin-form-group admin-form-full" style={{ background: 'rgba(249, 115, 22, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                    <label className="admin-form-label" style={{ color: 'var(--primary)' }}>
                      ⚡ Quick Link from Store Inventory (Optional)
                    </label>
                    <select
                      className="admin-select"
                      value={selectedCatalogProductId}
                      onChange={e => handleCatalogProductSelect(e.target.value)}
                    >
                      <option value="">-- Choose from Catalog Products or Enter Custom Below --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.price} | Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Part Name / Model *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    value={optionForm.name}
                    onChange={e => setOptionForm({ ...optionForm, name: e.target.value })}
                    placeholder="e.g. AeroForce Carbon Fiber Race Chassis (3mm)"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Component Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    className="admin-form-input"
                    required
                    value={optionForm.price}
                    onChange={e => setOptionForm({ ...optionForm, price: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Part SKU / Code</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={optionForm.sku}
                    onChange={e => setOptionForm({ ...optionForm, sku: e.target.value })}
                    placeholder="e.g. CTX-RAC-CF-01"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  />
                </div>
              </div>

              <div className="admin-modal-footer" style={{ margin: '24px -24px -24px', padding: '16px 24px' }}>
                <button type="button" className="admin-action-pill-btn" onClick={() => setIsOptionModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-action-pill-btn primary">Save Component</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
