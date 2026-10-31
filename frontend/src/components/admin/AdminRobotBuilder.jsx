import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Bot,
  Cpu,
  Wrench,
  Zap,
  Trophy,
  Sliders,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  ExternalLink,
  RotateCcw,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Settings,
  ShieldCheck,
  Link2,
  Copy
} from 'lucide-react';

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
    icon: 'Bot',
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
      icon: 'Bot',
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
      icon: p.icon || 'Bot',
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

  // Publish / Unpublish Section to Home Page Handlers
  const isSectionPublished = robotBuilderSettings?.enabled !== false;

  const handlePublishSection = () => {
    updateRobotBuilderSettings({
      ...robotBuilderSettings,
      enabled: true
    });
    setSettingsForm(prev => ({
      ...prev,
      enabled: true
    }));
    showToast('Robot Builder Section is now PUBLISHED & Live on Home Page!', 'success');
  };

  const handleUnpublishSection = () => {
    updateRobotBuilderSettings({
      ...robotBuilderSettings,
      enabled: false
    });
    setSettingsForm(prev => ({
      ...prev,
      enabled: false
    }));
    showToast('Robot Builder Section is now UNPUBLISHED (Hidden from Home Page).', 'info');
  };

  const handlePublishAllChanges = () => {
    updateRobotBuilderSettings({
      ...robotBuilderSettings,
      enabled: true
    });
    setSettingsForm(prev => ({
      ...prev,
      enabled: true
    }));
    showToast('All Robot Builder changes have been published live to the Home Page!', 'success');
  };

  return (
    <div className="admin-page-content robot-builder-admin">
      {/* Top Banner / Metrics */}
      <div className="admin-card builder-top-card">
        <div className="admin-card-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(249, 115, 22, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F97316'
              }}>
                <Bot size={22} />
              </div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>
                Custom Competition Robot Builder Manager
              </h2>
              <span className={`badge-status ${isSectionPublished ? 'badge-instock' : 'badge-outofstock'}`} style={{ fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                {isSectionPublished ? (
                  <>
                    <CheckCircle2 size={12} color="#22C55E" />
                    <span>Published on Home Page</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={12} color="#EF4444" />
                    <span>Hidden / Unpublished</span>
                  </>
                )}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '750px' }}>
              Configure competition robot categories, modular engineering slots (Chassis, Motors, Wheels, Drivers, Battery, Addons), custom part options, catalog linking, and live discount bundles.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* 1. Explicit Publish Button */}
            <button
              type="button"
              className="admin-action-pill-btn"
              style={{
                background: isSectionPublished 
                  ? 'rgba(34, 197, 94, 0.18)' 
                  : 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: isSectionPublished ? '#22C55E' : '#FFFFFF',
                borderColor: isSectionPublished ? '#22C55E' : 'transparent',
                fontWeight: '700',
                padding: '8px 16px',
                boxShadow: isSectionPublished 
                  ? '0 0 12px rgba(34, 197, 94, 0.25)' 
                  : '0 2px 10px rgba(34, 197, 94, 0.4)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={handlePublishSection}
              title="Publish the Robot Builder section live onto the customer home page"
            >
              {isSectionPublished ? <Check size={15} /> : <Zap size={15} />}
              <span>{isSectionPublished ? 'Published on Home' : 'Publish to Home Page'}</span>
            </button>

            {/* 2. Explicit Unpublish Button */}
            <button
              type="button"
              className="admin-action-pill-btn"
              style={{
                background: !isSectionPublished 
                  ? 'rgba(239, 68, 68, 0.18)' 
                  : 'transparent',
                color: !isSectionPublished ? '#EF4444' : 'var(--text-secondary)',
                borderColor: !isSectionPublished ? '#EF4444' : 'rgba(239, 68, 68, 0.35)',
                fontWeight: '700',
                padding: '8px 16px',
                boxShadow: !isSectionPublished 
                  ? '0 0 12px rgba(239, 68, 68, 0.25)' 
                  : 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={handleUnpublishSection}
              title="Unpublish / Hide the Robot Builder section from the customer home page"
            >
              <EyeOff size={15} />
              <span>{!isSectionPublished ? 'Unpublished (Hidden)' : 'Unpublish from Home'}</span>
            </button>

            {/* 3. Publish All Changes Button */}
            <button
              type="button"
              className="admin-action-pill-btn primary"
              onClick={handlePublishAllChanges}
              title="Publish all presets, parts, and bundle pricing changes to home page"
              style={{
                background: 'linear-gradient(135deg, var(--primary), #EA580C)',
                color: '#FFFFFF',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Save size={15} />
              <span>Save &amp; Publish All</span>
            </button>

            {/* 4. Restore Defaults Button */}
            <button
              type="button"
              className="admin-action-pill-btn"
              onClick={resetRobotBuilderDefaults}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Reset all robot builder presets and slots to factory defaults"
            >
              <RotateCcw size={15} />
              <span>Restore Defaults</span>
            </button>

            {/* 5. View Storefront Shortcut */}
            <button
              type="button"
              className="admin-action-pill-btn"
              onClick={navigateToStorefront}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Preview on customer storefront"
            >
              <ExternalLink size={15} />
              <span>View Storefront</span>
            </button>
          </div>
        </div>

        {/* Live Publication Status Banner */}
        <div style={{
          margin: '16px 20px 0',
          padding: '14px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          background: isSectionPublished 
            ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.02))' 
            : 'linear-gradient(90deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.02))',
          border: `1px solid ${isSectionPublished ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isSectionPublished ? (
              <CheckCircle2 size={18} color="#22C55E" />
            ) : (
              <EyeOff size={18} color="#EF4444" />
            )}
            <div>
              <strong style={{ color: isSectionPublished ? '#22C55E' : '#EF4444', fontSize: '0.92rem' }}>
                {isSectionPublished ? 'Section Status: Live & Visible on Home Page' : 'Section Status: Unpublished & Hidden from Home Page'}
              </strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isSectionPublished 
                  ? 'The Robot Builder is actively visible on the Storefront Home Page for all customers. Click "Unpublish" anytime to hide it.'
                  : 'The Robot Builder is currently hidden from customers on the home page. Click "Publish to Home Page" to make it live.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="admin-action-pill-btn"
              style={{
                background: isSectionPublished ? 'rgba(34, 197, 94, 0.15)' : 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: isSectionPublished ? '#22C55E' : '#FFFFFF',
                borderColor: '#22C55E',
                fontWeight: '700',
                padding: '7px 16px',
                fontSize: '0.84rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={handlePublishSection}
            >
              <CheckCircle2 size={14} /> {isSectionPublished ? 'Published (Active)' : 'Publish to Home Page'}
            </button>

            <button
              type="button"
              className="admin-action-pill-btn"
              style={{
                background: !isSectionPublished ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                color: '#EF4444',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                fontWeight: '700',
                padding: '7px 16px',
                fontSize: '0.84rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={handleUnpublishSection}
            >
              <EyeOff size={14} /> {!isSectionPublished ? 'Unpublished (Active)' : 'Unpublish from Home'}
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
            <Trophy size={16} />
            <span>Competition Presets ({totalPresetsCount})</span>
          </button>

          <button
            type="button"
            className={`builder-subtab-btn ${activeSubTab === 'slots' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('slots')}
          >
            <Sliders size={16} />
            <span>Component Slots &amp; Parts ({totalSlotsCount})</span>
          </button>

          <button
            type="button"
            className={`builder-subtab-btn ${activeSubTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('settings')}
          >
            <Settings size={16} />
            <span>Global Settings &amp; Perks</span>
          </button>

          <button
            type="button"
            className={`builder-subtab-btn ${activeSubTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('preview')}
          >
            <Zap size={16} />
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

            <button className="admin-action-pill-btn primary" onClick={openNewPresetModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={15} />
              <span>Add New Robot Preset</span>
            </button>
          </div>

          <div className="builder-preset-grid">
            {Object.entries(robotBuilderPresets).map(([key, preset]) => {
              return (
                <div key={key} className="builder-preset-item-card">
                  <div className="preset-card-top">
                    <div className="preset-card-icon-title">
                      <span className="preset-big-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={22} color="#F97316" />
                      </span>
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
                      style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      onClick={() => openEditPresetModal(key)}
                    >
                      <Edit3 size={13} />
                      <span>Edit Preset</span>
                    </button>

                    <button
                      type="button"
                      className="btn-table-icon"
                      title="Duplicate Preset"
                      onClick={() => handleDuplicatePreset(key)}
                    >
                      <Copy size={14} />
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
                      <Trash2 size={14} />
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
                <Plus size={15} />
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
                        <Edit3 size={13} />
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
                          <Trash2 size={13} />
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
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={15} />
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
                                  <Edit3 size={13} />
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
                                  <Trash2 size={13} />
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={15} />
              <span>Save Configuration</span>
            </button>
          </div>

          <form onSubmit={handleSaveSettings} style={{ marginTop: '20px' }}>
            <div className="admin-form-grid">
              {/* Publication Status Selector Cards */}
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label" style={{ marginBottom: '10px', display: 'block', fontSize: '0.9rem', fontWeight: '700' }}>
                  Storefront Visibility &amp; Publication Options
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {/* Option 1: Publish Card */}
                  <div
                    onClick={() => {
                      setSettingsForm(prev => ({ ...prev, enabled: true }));
                      updateRobotBuilderSettings({ ...robotBuilderSettings, enabled: true });
                      showToast('Robot Builder Section is now PUBLISHED on Home Page!', 'success');
                    }}
                    style={{
                      border: settingsForm.enabled !== false ? '2px solid #22C55E' : '1px solid var(--border-color)',
                      background: settingsForm.enabled !== false ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-card)',
                      borderRadius: '12px',
                      padding: '16px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: settingsForm.enabled !== false ? '0 0 16px rgba(34, 197, 94, 0.18)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '800', color: settingsForm.enabled !== false ? '#22C55E' : 'var(--text-primary)', fontSize: '0.96rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={18} color="#22C55E" />
                        <span>Published to Home Page</span>
                      </span>
                      <span style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: `2px solid ${settingsForm.enabled !== false ? '#22C55E' : 'var(--border-color)'}`,
                        background: settingsForm.enabled !== false ? '#22C55E' : 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {settingsForm.enabled !== false ? <Check size={13} /> : null}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      The interactive Robot Builder section is live and visible to all customers on the Home Page and top navigation bar.
                    </p>
                    <div style={{ marginTop: '6px' }}>
                      <span className={`badge-status ${settingsForm.enabled !== false ? 'badge-instock' : ''}`} style={{ fontSize: '0.75rem' }}>
                        {settingsForm.enabled !== false ? '● Currently Active & Live' : 'Click to Set Published'}
                      </span>
                    </div>
                  </div>

                  {/* Option 2: Unpublish Card */}
                  <div
                    onClick={() => {
                      setSettingsForm(prev => ({ ...prev, enabled: false }));
                      updateRobotBuilderSettings({ ...robotBuilderSettings, enabled: false });
                      showToast('Robot Builder Section is now UNPUBLISHED (Hidden from Home Page).', 'info');
                    }}
                    style={{
                      border: settingsForm.enabled === false ? '2px solid #EF4444' : '1px solid var(--border-color)',
                      background: settingsForm.enabled === false ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-card)',
                      borderRadius: '12px',
                      padding: '16px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: settingsForm.enabled === false ? '0 0 16px rgba(239, 68, 68, 0.18)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '800', color: settingsForm.enabled === false ? '#EF4444' : 'var(--text-primary)', fontSize: '0.96rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <EyeOff size={18} color="#EF4444" />
                        <span>Unpublished (Hidden from Home)</span>
                      </span>
                      <span style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: `2px solid ${settingsForm.enabled === false ? '#EF4444' : 'var(--border-color)'}`,
                        background: settingsForm.enabled === false ? '#EF4444' : 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {settingsForm.enabled === false ? <Check size={13} /> : null}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      The section is completely hidden from storefront visitors. Store admins can still configure presets, slots, and preview in simulator.
                    </p>
                    <div style={{ marginTop: '6px' }}>
                      <span className={`badge-status ${settingsForm.enabled === false ? 'badge-outofstock' : ''}`} style={{ fontSize: '0.75rem' }}>
                        {settingsForm.enabled === false ? '● Currently Hidden / Unpublished' : 'Click to Set Unpublished'}
                      </span>
                    </div>
                  </div>
                </div>
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
                    style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Plus size={14} /> Add Perk
                  </button>
                </div>

                <div className="perks-pills-wrap">
                  {settingsForm.perks && settingsForm.perks.map((perk, idx) => (
                    <div key={idx} className="perk-editable-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={13} color="#22C55E" />
                      <span>{perk}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePerk(idx)}
                        className="perk-remove-btn"
                        title="Remove perk"
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="submit" className="admin-action-pill-btn primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Save size={15} />
                <span>Save Settings</span>
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
                <Zap size={18} color="#F97316" />
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
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Reset current slot selections back to preset defaults"
              >
                <RotateCcw size={14} />
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
                        <span className="preset-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <Bot size={18} color="#F97316" />
                        </span>
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
                      <div className="savings-pill" style={{ margin: '10px 0 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} /> Total Maker Savings: ₹{simSavings.toLocaleString('en-IN')}
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
                      <div key={i} className="perk-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={12} color="#22C55E" />
                        <span>{perk}</span>
                      </div>
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
              <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#F97316" />
                <span>{editingPresetKey ? 'Edit Robot Preset' : 'Add New Competition Preset'}</span>
              </h3>
              <button className="btn-table-icon" onClick={() => setIsPresetModalOpen(false)}>
                <X size={16} />
              </button>
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
                  <label className="admin-form-label">Category Icon Name</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={presetForm.icon}
                    onChange={e => setPresetForm({ ...presetForm, icon: e.target.value })}
                    placeholder="e.g. Race, Combat, Soccer"
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
                <button type="submit" className="admin-action-pill-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={14} />
                  <span>Save Preset</span>
                </button>
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
              <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#F97316" />
                <span>{editingSlotKey ? 'Edit Assembly Slot' : 'Add Assembly Slot Layer'}</span>
              </h3>
              <button className="btn-table-icon" onClick={() => setIsSlotModalOpen(false)}>
                <X size={16} />
              </button>
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
                <button type="submit" className="admin-action-pill-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={14} />
                  <span>Save Slot</span>
                </button>
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
              <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={18} color="#F97316" />
                <span>{editingOptionId ? 'Edit Component Part' : 'Add Component Part to Slot'}</span>
              </h3>
              <button className="btn-table-icon" onClick={() => setIsOptionModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveOption} className="admin-modal-body">
              <div className="admin-form-grid">
                {/* Catalog Quick Import (Only for new options) */}
                {!editingOptionId && (
                  <div className="admin-form-group admin-form-full" style={{ background: 'rgba(249, 115, 22, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                    <label className="admin-form-label" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Link2 size={14} />
                      <span>Quick Link from Store Inventory (Optional)</span>
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
                <button type="submit" className="admin-action-pill-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={14} />
                  <span>Save Component</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
