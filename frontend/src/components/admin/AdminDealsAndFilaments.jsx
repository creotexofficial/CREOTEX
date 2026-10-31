import React, { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Flame,
  CircleDot,
  Clock,
  Tag,
  Sparkles,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ExternalLink,
  Save,
  Sliders,
  Eye,
  EyeOff,
  RotateCcw,
  Package,
  Layers,
  FileText,
  ImageIcon
} from 'lucide-react';

const FLASH_ICONS = ['🔥', '⚡', '🚀', '🏷️', '💥', '⏳', '⏱️', '🎯', '🎁', '🏆'];
const FILAMENT_ICONS = ['🧵', '🖨️', '⚡', '🎨', '🔬', '⚙️', '💎', '📦'];

export const AdminDealsAndFilaments = () => {
  const {
    products,
    filamentSubcategories,
    flashDealsSettings,
    filamentSectionSettings,
    updateFlashDealsSettings,
    updateFilamentSectionSettings,
    toggleProductFlashDeal,
    addProductToFlashDeals,
    removeProductFromFlashDeals,
    reorderFlashDeals,
    resetFlashDealsDefaults,
    resetFilamentSectionDefaults,
    setAdminActiveTab,
    navigateToStorefront,
    showToast
  } = useCart();

  // Active Tab: 'deals' | 'filament-zone' | 'overview'
  const [activeTab, setActiveTab] = useState('deals');

  // Flash Deals Local Form State
  const [dealsForm, setDealsForm] = useState({
    enabled: flashDealsSettings?.enabled !== false,
    title: flashDealsSettings?.title || 'Flash Maker Deals of the Day',
    subtitle: flashDealsSettings?.subtitle || 'Limited stock at special tournament discount pricing',
    icon: flashDealsSettings?.icon || '🔥',
    badgeText: flashDealsSettings?.badgeText || 'ENDS TODAY',
    showCountdown: flashDealsSettings?.showCountdown !== false,
    countdownHours: Math.floor((flashDealsSettings?.countdownSeconds || 52939) / 3600),
    countdownMins: Math.floor(((flashDealsSettings?.countdownSeconds || 52939) % 3600) / 60),
    maxProducts: flashDealsSettings?.maxProducts || 4
  });

  // Filament Section Local Form State
  const [filamentForm, setFilamentForm] = useState({
    enabled: filamentSectionSettings?.enabled !== false,
    title: filamentSectionSettings?.title || '3D Printer Filament Spool Zone',
    subtitle: filamentSectionSettings?.subtitle || 'Precision 1.75mm engineering filaments for rapid prototyping, combat robots & heat-resistant parts',
    icon: filamentSectionSettings?.icon || '🧵',
    badgeText: filamentSectionSettings?.badgeText || '',
    buttonText: filamentSectionSettings?.buttonText || 'Explore All 3D Filaments',
    showSubcategoriesGrid: filamentSectionSettings?.showSubcategoriesGrid !== false,
    showShelf: filamentSectionSettings?.showShelf !== false,
    shelfTitle: filamentSectionSettings?.shelfTitle || '⭐ Popular In-Stock 1KG Spools',
    shelfSubtitle: filamentSectionSettings?.shelfSubtitle || 'Bambu Lab RFID & Standard 1KG spools vacuum-sealed with desiccant',
    shelfButtonText: filamentSectionSettings?.shelfButtonText || 'View All Filaments',
    maxShelfProducts: filamentSectionSettings?.maxShelfProducts || 4,
    shelfMode: (filamentSectionSettings?.customShelfProductIds && filamentSectionSettings.customShelfProductIds.length > 0) ? 'custom' : 'auto'
  });

  // Search & Filters for Catalog pickers
  const [dealCatalogSearch, setDealCatalogSearch] = useState('');
  const [dealCategoryFilter, setDealCategoryFilter] = useState('all');

  const [shelfCatalogSearch, setShelfCatalogSearch] = useState('');

  // 1. Resolve currently featured Deal Products
  const activeDealProducts = useMemo(() => {
    const customIds = flashDealsSettings?.customProductIds;
    if (Array.isArray(customIds) && customIds.length > 0) {
      return customIds
        .map(id => (products || []).find(p => p.id === id))
        .filter(Boolean);
    }
    return (products || []).filter(p => p.isDeal);
  }, [products, flashDealsSettings?.customProductIds]);

  // 2. Filter available products to add to Flash Deals
  const availableForDeals = useMemo(() => {
    const activeIds = new Set(activeDealProducts.map(p => p.id));
    return (products || []).filter(p => {
      if (dealCategoryFilter !== 'all' && p.category !== dealCategoryFilter) return false;
      if (dealCatalogSearch.trim()) {
        const q = dealCatalogSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
      }
      return true;
    });
  }, [products, activeDealProducts, dealCategoryFilter, dealCatalogSearch]);

  // 3. Resolve currently featured Filament Shelf Products
  const activeShelfProducts = useMemo(() => {
    const customIds = filamentSectionSettings?.customShelfProductIds;
    if (Array.isArray(customIds) && customIds.length > 0) {
      return customIds
        .map(id => (products || []).find(p => p.id === id))
        .filter(Boolean);
    }
    return (products || []).filter(p => p.category === 'filaments').slice(0, filamentForm.maxShelfProducts || 4);
  }, [products, filamentSectionSettings?.customShelfProductIds, filamentForm.maxShelfProducts]);

  // 4. Filter available filament products to add to Filament Shelf
  const availableForShelf = useMemo(() => {
    const activeIds = new Set(activeShelfProducts.map(p => p.id));
    return (products || [])
      .filter(p => p.category === 'filaments')
      .filter(p => {
        if (shelfCatalogSearch.trim()) {
          const q = shelfCatalogSearch.toLowerCase();
          return p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
        }
        return true;
      });
  }, [products, activeShelfProducts, shelfCatalogSearch]);

  // Categories list for filter dropdown
  const allCategories = useMemo(() => {
    const cats = new Set((products || []).map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  // Handlers for Flash Deals Form Save
  const handleSaveFlashDeals = () => {
    const totalSecs = (parseInt(dealsForm.countdownHours, 10) || 0) * 3600 +
                      (parseInt(dealsForm.countdownMins, 10) || 0) * 60;
    updateFlashDealsSettings({
      enabled: dealsForm.enabled,
      title: dealsForm.title,
      subtitle: dealsForm.subtitle,
      icon: dealsForm.icon,
      badgeText: dealsForm.badgeText,
      showCountdown: dealsForm.showCountdown,
      countdownSeconds: totalSecs > 0 ? totalSecs : 14 * 3600 + 42 * 60 + 19,
      maxProducts: parseInt(dealsForm.maxProducts, 10) || 4
    });
  };

  // Handlers for Quick Timer Presets
  const handleApplyTimerPreset = (hours) => {
    setDealsForm(prev => ({
      ...prev,
      countdownHours: hours,
      countdownMins: 0,
      showCountdown: true
    }));
    updateFlashDealsSettings({
      countdownSeconds: hours * 3600,
      showCountdown: true
    });
    showToast(`Countdown timer set to ${hours} hours!`, 'success');
  };

  // Handlers for Reordering Deal Products
  const handleMoveDeal = (index, direction) => {
    const currentList = [...activeDealProducts];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;
    const temp = currentList[index];
    currentList[index] = currentList[targetIndex];
    currentList[targetIndex] = temp;
    reorderFlashDeals(currentList.map(p => p.id));
  };

  // Handlers for Filament Section Form Save
  const handleSaveFilamentSection = () => {
    updateFilamentSectionSettings({
      enabled: filamentForm.enabled,
      title: filamentForm.title,
      subtitle: filamentForm.subtitle,
      icon: filamentForm.icon,
      badgeText: filamentForm.badgeText,
      buttonText: filamentForm.buttonText,
      showSubcategoriesGrid: filamentForm.showSubcategoriesGrid,
      showShelf: filamentForm.showShelf,
      shelfTitle: filamentForm.shelfTitle,
      shelfSubtitle: filamentForm.shelfSubtitle,
      shelfButtonText: filamentForm.shelfButtonText,
      maxShelfProducts: parseInt(filamentForm.maxShelfProducts, 10) || 4
    });
  };

  // Toggle Subcategory visibility on home section
  const handleToggleSubcategoryHomeVisibility = (subKey) => {
    const currentHidden = filamentSectionSettings?.hiddenSubcategoryKeys || [];
    let nextHidden;
    if (currentHidden.includes(subKey)) {
      nextHidden = currentHidden.filter(k => k !== subKey);
      showToast(`Subcategory "${subKey}" is now visible on home section`, 'success');
    } else {
      nextHidden = [...currentHidden, subKey];
      showToast(`Subcategory "${subKey}" hidden from home section`, 'info');
    }
    updateFilamentSectionSettings({ hiddenSubcategoryKeys: nextHidden });
  };

  // Add / Remove from Curated Shelf
  const handleToggleShelfProduct = (productId) => {
    const currentList = filamentSectionSettings?.customShelfProductIds || [];
    let nextList;
    if (currentList.includes(productId)) {
      nextList = currentList.filter(id => id !== productId);
      showToast('Removed spool from featured shelf', 'info');
    } else {
      nextList = [...currentList, productId];
      showToast('Added spool to featured shelf!', 'success');
    }
    updateFilamentSectionSettings({ customShelfProductIds: nextList });
  };

  const handleSetShelfAutoMode = () => {
    setFilamentForm(prev => ({ ...prev, shelfMode: 'auto' }));
    updateFilamentSectionSettings({ customShelfProductIds: [] });
    showToast('Shelf set to Auto (displays top filament products)', 'info');
  };

  const handleSetShelfCustomMode = () => {
    const topFilamentIds = (products || []).filter(p => p.category === 'filaments').slice(0, 4).map(p => p.id);
    setFilamentForm(prev => ({ ...prev, shelfMode: 'custom' }));
    updateFilamentSectionSettings({ customShelfProductIds: topFilamentIds });
    showToast('Shelf set to Custom curated mode', 'success');
  };

  return (
    <div className="admin-page-content" style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header & Overview Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(249, 115, 22, 0.12)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F97316'
            }}>
              <Flame size={22} />
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Homepage Featured Sections Manager
            </h1>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '720px' }}>
            Control the two most prominent high-converting storefront sections: <strong>Flash Maker Deals of the Day</strong> and <strong>3D Printer Filament Spool Zone</strong>. Toggle visibility, edit titles, timers, and easily choose which products appear.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="admin-action-pill-btn"
            onClick={navigateToStorefront}
            title="Preview how these sections look on the actual storefront"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ExternalLink size={15} />
            <span>View Live Storefront</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Strip */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: 'var(--bg-surface)',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('deals')}
          style={{
            flex: '1 1 200px',
            padding: '12px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'deals' ? 'var(--accent-orange)' : 'transparent',
            color: activeTab === 'deals' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'deals' ? '0 4px 14px rgba(234, 88, 12, 0.35)' : 'none'
          }}
        >
          <Flame size={16} strokeWidth={2.2} />
          <span>Flash Maker Deals of the Day</span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '9999px',
              background: activeTab === 'deals' ? 'rgba(255,255,255,0.25)' : 'rgba(234, 88, 12, 0.15)',
              color: activeTab === 'deals' ? '#FFFFFF' : 'var(--accent-orange)',
              fontWeight: '800'
            }}
          >
            {activeDealProducts.length} Deals
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '6px',
              background: dealsForm.enabled ? '#22C55E22' : '#EF444422',
              color: dealsForm.enabled ? '#22C55E' : '#EF4444',
              fontWeight: '800'
            }}
          >
            {dealsForm.enabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('filament-zone')}
          style={{
            flex: '1 1 200px',
            padding: '12px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'filament-zone' ? 'var(--accent-orange)' : 'transparent',
            color: activeTab === 'filament-zone' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'filament-zone' ? '0 4px 14px rgba(234, 88, 12, 0.35)' : 'none'
          }}
        >
          <CircleDot size={16} strokeWidth={2.2} />
          <span>3D Printer Filament Spool Zone</span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '9999px',
              background: activeTab === 'filament-zone' ? 'rgba(255,255,255,0.25)' : 'rgba(14, 165, 233, 0.15)',
              color: activeTab === 'filament-zone' ? '#FFFFFF' : '#0EA5E9',
              fontWeight: '800'
            }}
          >
            6 Spool Subcats
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '6px',
              background: filamentForm.enabled ? '#22C55E22' : '#EF444422',
              color: filamentForm.enabled ? '#22C55E' : '#EF4444',
              fontWeight: '800'
            }}
          >
            {filamentForm.enabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          style={{
            flex: '0 0 auto',
            padding: '12px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'overview' ? 'var(--accent-orange)' : 'transparent',
            color: activeTab === 'overview' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={16} strokeWidth={2.2} />
          <span>Section Overview</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FLASH MAKER DEALS OF THE DAY                                       */}
      {/* ========================================================================= */}
      {activeTab === 'deals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Master Toggle & Live Status Banner */}
          <div
            className="admin-card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: dealsForm.enabled ? 'rgba(234, 88, 12, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                  border: `1.5px solid ${dealsForm.enabled ? '#EA580C' : '#64748B'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: dealsForm.enabled ? '#EA580C' : '#64748B'
                }}
              >
                <Flame size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Flash Maker Deals Section Status
                  </h3>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '800',
                      background: dealsForm.enabled ? '#22C55E22' : '#EF444422',
                      color: dealsForm.enabled ? '#22C55E' : '#EF4444',
                      border: `1px solid ${dealsForm.enabled ? '#22C55E55' : '#EF444455'}`
                    }}
                  >
                    {dealsForm.enabled ? '● PUBLISHED & ACTIVE' : '○ HIDDEN FROM HOME'}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {dealsForm.enabled
                    ? 'Section is live on the home page with tournament deals and countdown timer.'
                    : 'Section is hidden from makers on the home page.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                className={`admin-action-pill-btn ${dealsForm.enabled ? 'danger' : 'primary'}`}
                onClick={() => {
                  const nextState = !dealsForm.enabled;
                  setDealsForm(prev => ({ ...prev, enabled: nextState }));
                  updateFlashDealsSettings({ enabled: nextState });
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {dealsForm.enabled ? 'Deactivate Section (Hide)' : 'Activate Section (Show Live)'}
              </button>
            </div>
          </div>

          {/* Banner Settings & Countdown Config */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Header Content Config */}
            <div
              className="admin-card"
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <FileText size={18} strokeWidth={2} style={{ color: 'var(--primary)' }} />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Banner Title & Badges
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={dealsForm.title}
                    onChange={(e) => setDealsForm({ ...dealsForm, title: e.target.value })}
                    className="admin-input"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                    placeholder="e.g. Flash Maker Deals of the Day"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Subtitle / Promotional Tagline
                  </label>
                  <input
                    type="text"
                    value={dealsForm.subtitle}
                    onChange={(e) => setDealsForm({ ...dealsForm, subtitle: e.target.value })}
                    className="admin-input"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                    placeholder="e.g. Limited stock at special tournament discount pricing"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Icon Emoji
                    </label>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      {FLASH_ICONS.slice(0, 5).map(ico => (
                        <button
                          key={ico}
                          type="button"
                          onClick={() => setDealsForm({ ...dealsForm, icon: ico })}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: dealsForm.icon === ico ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-color)',
                            background: dealsForm.icon === ico ? 'rgba(234, 88, 12, 0.2)' : 'var(--bg-surface)',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          {ico}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Timer Box Label
                    </label>
                    <input
                      type="text"
                      value={dealsForm.badgeText}
                      onChange={(e) => setDealsForm({ ...dealsForm, badgeText: e.target.value })}
                      className="admin-input"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                      placeholder="Ends In"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="admin-action-pill-btn primary"
                  onClick={handleSaveFlashDeals}
                  style={{ marginTop: '8px', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Title & Text Changes
                </button>
              </div>
            </div>

            {/* Countdown Timer Config */}
            <div
              className="admin-card"
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} strokeWidth={2} style={{ color: 'var(--primary)' }} />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Countdown Timer Settings
                  </h4>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={dealsForm.showCountdown}
                    onChange={(e) => {
                      const nextVal = e.target.checked;
                      setDealsForm({ ...dealsForm, showCountdown: nextVal });
                      updateFlashDealsSettings({ showCountdown: nextVal });
                    }}
                  />
                  <span>Show Timer</span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Remaining Time Duration
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hours:</span>
                      <input
                        type="number"
                        min="0"
                        max="72"
                        value={dealsForm.countdownHours}
                        onChange={(e) => setDealsForm({ ...dealsForm, countdownHours: e.target.value })}
                        className="admin-input"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Minutes:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={dealsForm.countdownMins}
                        onChange={(e) => setDealsForm({ ...dealsForm, countdownMins: e.target.value })}
                        className="admin-input"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Quick Timer Duration Presets
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[6, 12, 24, 48].map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleApplyTimerPreset(h)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        +{h} Hours
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleApplyTimerPreset(24)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--accent-orange)',
                        background: 'rgba(234, 88, 12, 0.15)',
                        color: 'var(--accent-orange)',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Reset 24h
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Max Deal Products to Display on Home
                  </label>
                  <select
                    value={dealsForm.maxProducts}
                    onChange={(e) => {
                      const nextCount = parseInt(e.target.value, 10);
                      setDealsForm({ ...dealsForm, maxProducts: nextCount });
                      updateFlashDealsSettings({ maxProducts: nextCount });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    <option value={2}>2 Products</option>
                    <option value={4}>4 Products (Standard 1 Row)</option>
                    <option value={6}>6 Products</option>
                    <option value={8}>8 Products (2 Rows)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Products Currently Featured Shelf */}
          <div
            className="admin-card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={18} strokeWidth={2} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Active Flash Deal Products ({activeDealProducts.length})
                  </h3>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  These products are featured in the "Flash Maker Deals of the Day" carousel shelf. You can reorder them or remove any item with 1-click.
                </div>
              </div>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-surface)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)'
                }}
              >
                Displaying first {dealsForm.maxProducts} items on Storefront
              </span>
            </div>

            {activeDealProducts.length === 0 ? (
              <div
                style={{
                  padding: '30px',
                  textAlign: 'center',
                  background: 'var(--bg-surface)',
                  borderRadius: '12px',
                  border: '1px dashed var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                <Package size={36} strokeWidth={1.5} style={{ opacity: 0.6, color: 'var(--primary)', margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  No Flash Deals currently selected
                </div>
                <div style={{ fontSize: '13px' }}>
                  Use the product picker below to add items to Flash Deals with a single click!
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px'
                }}
              >
                {activeDealProducts.map((product, idx) => {
                  const isVisibleOnHome = idx < (dealsForm.maxProducts || 4);
                  return (
                    <div
                      key={product.id}
                      style={{
                        background: 'var(--bg-surface)',
                        border: isVisibleOnHome ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-color)',
                        borderRadius: '14px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative'
                      }}
                    >
                      {/* Top Rank Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: isVisibleOnHome ? 'var(--accent-orange)' : 'var(--bg-card)',
                            color: isVisibleOnHome ? '#FFFFFF' : 'var(--text-secondary)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          Slot #{idx + 1} {isVisibleOnHome ? '● LIVE' : '○ QUEUED'}
                        </span>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            color: '#EA580C',
                            background: 'rgba(234, 88, 12, 0.15)',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          {product.discount || 'FLASH DEAL'}
                        </span>
                      </div>

                      {/* Product Info */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                        <div
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '8px',
                            background: 'var(--bg-card)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <h5 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {product.name}
                          </h5>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            SKU: {product.sku || product.id} • Stock: {product.stock}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span style={{ fontSize: '11px', textDecoration: 'line-through', color: 'var(--text-secondary)' }}>
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar (Reorder & Remove) */}
                      <div style={{ display: 'flex', gap: '6px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveDeal(idx, -1)}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            color: idx === 0 ? 'var(--text-secondary)' : 'var(--text-primary)',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          title="Move earlier in shelf"
                        >
                          <ChevronLeft size={12} strokeWidth={2.5} /> Left
                        </button>

                        <button
                          type="button"
                          disabled={idx === activeDealProducts.length - 1}
                          onClick={() => handleMoveDeal(idx, 1)}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            color: idx === activeDealProducts.length - 1 ? 'var(--text-secondary)' : 'var(--text-primary)',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: idx === activeDealProducts.length - 1 ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          title="Move later in shelf"
                        >
                          Right <ChevronRight size={12} strokeWidth={2.5} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeProductFromFlashDeals(product.id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #EF444455',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Remove from Flash Deals"
                        >
                          <X size={12} strokeWidth={2.5} /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 1-Click Catalog Product Picker to Add to Flash Deals */}
          <div
            className="admin-card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={18} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Add Products to Flash Deals from Catalog
                  </h3>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Click "+ Add to Flash Deals" on any robotics product to immediately feature it.
                </div>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={dealCatalogSearch}
                  onChange={(e) => setDealCatalogSearch(e.target.value)}
                  className="admin-input"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    minWidth: '180px'
                  }}
                />

                <select
                  value={dealCategoryFilter}
                  onChange={(e) => setDealCategoryFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  <option value="all">All Categories</option>
                  {allCategories.filter(c => c !== 'all').map(c => (
                    <option key={c} value={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Catalog Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '14px',
                maxHeight: '440px',
                overflowY: 'auto',
                paddingRight: '6px'
              }}
            >
              {availableForDeals.slice(0, 24).map(product => {
                const isInDeals = activeDealProducts.some(p => p.id === product.id);
                return (
                  <div
                    key={product.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: isInDeals ? '1.5px solid #22C55E' : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '8px',
                          background: 'var(--bg-card)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          ₹{product.price} • {product.category}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isInDeals) {
                          removeProductFromFlashDeals(product.id);
                        } else {
                          addProductToFlashDeals(product.id);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: isInDeals ? '1px solid #22C55E55' : '1px solid var(--accent-orange)',
                        background: isInDeals ? 'rgba(34, 197, 94, 0.15)' : 'var(--accent-orange)',
                        color: isInDeals ? '#22C55E' : '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {isInDeals ? (
                        <>
                          <Check size={13} strokeWidth={2.5} /> In Flash Deals (Click to Remove)
                        </>
                      ) : (
                        <>
                          <Plus size={13} strokeWidth={2.5} /> Add to Flash Deals
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 3D PRINTER FILAMENT SPOOL ZONE                                     */}
      {/* ========================================================================= */}
      {activeTab === 'filament-zone' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Master Toggle & Live Status Banner */}
          <div
            className="admin-card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: filamentForm.enabled ? 'rgba(234, 88, 12, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                  border: `1.5px solid ${filamentForm.enabled ? '#EA580C' : '#64748B'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: filamentForm.enabled ? '#EA580C' : '#64748B'
                }}
              >
                <CircleDot size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    3D Filament Spool Zone Section Status
                  </h3>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '800',
                      background: filamentForm.enabled ? '#22C55E22' : '#EF444422',
                      color: filamentForm.enabled ? '#22C55E' : '#EF4444',
                      border: `1px solid ${filamentForm.enabled ? '#22C55E55' : '#EF444455'}`
                    }}
                  >
                    {filamentForm.enabled ? '● PUBLISHED & ACTIVE' : '○ HIDDEN FROM HOME'}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {filamentForm.enabled
                    ? 'Section is live on the home page displaying spool cards and ready-to-ship filaments.'
                    : 'Section is hidden from makers on the home page.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className={`admin-action-pill-btn ${filamentForm.enabled ? 'danger' : 'primary'}`}
                onClick={() => {
                  const nextState = !filamentForm.enabled;
                  setFilamentForm(prev => ({ ...prev, enabled: nextState }));
                  updateFilamentSectionSettings({ enabled: nextState });
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {filamentForm.enabled ? 'Deactivate Section (Hide)' : 'Activate Section (Show Live)'}
              </button>

              <button
                type="button"
                className="admin-action-pill-btn"
                onClick={() => setAdminActiveTab('filaments')}
                title="Open detailed 3D Filament Studio with color swatches & spools"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Open 3D Filaments Studio <ExternalLink size={13} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Banner Header Configuration */}
          <div
            className="admin-card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CircleDot size={18} strokeWidth={2} style={{ color: 'var(--primary)' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Banner Header & Headline Customization
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Banner Title
                </label>
                <input
                  type="text"
                  value={filamentForm.title}
                  onChange={(e) => setFilamentForm({ ...filamentForm, title: e.target.value })}
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                  placeholder="3D Printer Filament Spool Zone"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Explore Button Text
                </label>
                <input
                  type="text"
                  value={filamentForm.buttonText}
                  onChange={(e) => setFilamentForm({ ...filamentForm, buttonText: e.target.value })}
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                  placeholder="Explore All 3D Filaments"
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={filamentForm.subtitle}
                  onChange={(e) => setFilamentForm({ ...filamentForm, subtitle: e.target.value })}
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                  placeholder="Precision 1.75mm engineering filaments for rapid prototyping, combat robots & heat-resistant parts"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Banner Icon
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {FILAMENT_ICONS.slice(0, 6).map(ico => (
                      <button
                        key={ico}
                        type="button"
                        onClick={() => setFilamentForm({ ...filamentForm, icon: ico })}
                        style={{
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: filamentForm.icon === ico ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-color)',
                          background: filamentForm.icon === ico ? 'rgba(234, 88, 12, 0.2)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        {ico}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="admin-action-pill-btn primary"
                  onClick={handleSaveFilamentSection}
                  style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={14} strokeWidth={2.2} />
                  Save Header Changes
                </button>
              </div>
            </div>
          </div>

          {/* Subcategories Visual Grid Management */}
          <div
            className="admin-card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} strokeWidth={2} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Filament Subcategories Cards ({filamentSubcategories?.length || 6})
                  </h3>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Toggle which engineering filament subcategories are featured on the home storefront card grid.
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={filamentForm.showSubcategoriesGrid}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    setFilamentForm({ ...filamentForm, showSubcategoriesGrid: nextVal });
                    updateFilamentSectionSettings({ showSubcategoriesGrid: nextVal });
                  }}
                />
                <span>Show Subcategories Grid</span>
              </label>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}
            >
              {(filamentSubcategories || []).map(sub => {
                const isHidden = (filamentSectionSettings?.hiddenSubcategoryKeys || []).includes(sub.subCategoryKey);
                return (
                  <div
                    key={sub.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: isHidden ? '1px solid var(--border-color)' : `1.5px solid ${sub.accentColor || '#EA580C'}`,
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: isHidden ? 0.6 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: `${sub.badgeColor}1A`,
                            color: sub.badgeColor,
                            border: `1px solid ${sub.badgeColor}4D`
                          }}
                        >
                          {sub.badge}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: isHidden ? '#EF4444' : '#22C55E'
                          }}
                        >
                          {isHidden ? '○ HIDDEN' : '● ACTIVE ON HOME'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '8px',
                            background: '#FFFFFF',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid rgba(0,0,0,0.06)'
                          }}
                        >
                          <img src={sub.image} alt={sub.displayName} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {sub.displayName}
                          </h4>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Base Price: ₹{sub.price} • {sub.colors?.length || 4} Colors
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Temp: {sub.printTemp || '200-230°C'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleSubcategoryHomeVisibility(sub.subCategoryKey)}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: isHidden ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                          background: isHidden ? 'var(--accent-orange)' : 'var(--bg-card)',
                          color: isHidden ? '#FFFFFF' : 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {isHidden ? 'Show on Home' : 'Hide from Home'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdminActiveTab('filaments')}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                        title="Edit Colors & Studio Specs"
                      >
                        Studio ↗
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Ready-to-Ship Spools Shelf Management */}
          <div
            className="admin-card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>⭐</span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Popular In-Stock 1KG Spools Shelf
                  </h3>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Manage the featured spool products displayed directly beneath the subcategories grid.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={filamentForm.showShelf}
                    onChange={(e) => {
                      const nextVal = e.target.checked;
                      setFilamentForm({ ...filamentForm, showShelf: nextVal });
                      updateFilamentSectionSettings({ showShelf: nextVal });
                    }}
                  />
                  <span>Show Shelf on Home</span>
                </label>
              </div>
            </div>

            {/* Shelf Text Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Shelf Heading
                </label>
                <input
                  type="text"
                  value={filamentForm.shelfTitle}
                  onChange={(e) => setFilamentForm({ ...filamentForm, shelfTitle: e.target.value })}
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Shelf Subtitle
                </label>
                <input
                  type="text"
                  value={filamentForm.shelfSubtitle}
                  onChange={(e) => setFilamentForm({ ...filamentForm, shelfSubtitle: e.target.value })}
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  className="admin-action-pill-btn primary"
                  onClick={handleSaveFilamentSection}
                  style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Shelf Text
                </button>
              </div>
            </div>

            {/* Shelf Selection Mode Selector */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                background: 'var(--bg-surface)',
                borderRadius: '10px',
                marginBottom: '16px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                Spool Shelf Selection Mode:
              </span>

              <button
                type="button"
                onClick={handleSetShelfAutoMode}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: filamentForm.shelfMode === 'auto' ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-color)',
                  background: filamentForm.shelfMode === 'auto' ? 'rgba(234, 88, 12, 0.2)' : 'var(--bg-card)',
                  color: filamentForm.shelfMode === 'auto' ? 'var(--accent-orange)' : 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                ● Auto Mode (Top Filament Products from Catalog)
              </button>

              <button
                type="button"
                onClick={handleSetShelfCustomMode}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: filamentForm.shelfMode === 'custom' ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-color)',
                  background: filamentForm.shelfMode === 'custom' ? 'rgba(234, 88, 12, 0.2)' : 'var(--bg-card)',
                  color: filamentForm.shelfMode === 'custom' ? 'var(--accent-orange)' : 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                ★ Curated Mode (Manually Pick Specific Spools)
              </button>
            </div>

            {/* Currently Active Shelf Spools Grid */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                Featured Shelf Spools ({activeShelfProducts.length})
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '14px'
                }}
              >
                {activeShelfProducts.map((p, idx) => (
                  <div
                    key={p.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: 0 }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          background: 'var(--bg-card)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          #{idx + 1} {p.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          ₹{p.price} • Stock: {p.stock}
                        </div>
                      </div>
                    </div>

                    {filamentForm.shelfMode === 'custom' && (
                      <button
                        type="button"
                        onClick={() => handleToggleShelfProduct(p.id)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #EF444455',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          flexShrink: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <X size={11} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Mode Picker from Filament Catalog */}
            {filamentForm.shelfMode === 'custom' && (
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Add More Filament Spools to Shelf:
                  </div>
                  <input
                    type="text"
                    placeholder="Search filaments..."
                    value={shelfCatalogSearch}
                    onChange={(e) => setShelfCatalogSearch(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '10px',
                    maxHeight: '280px',
                    overflowY: 'auto'
                  }}
                >
                  {availableForShelf.map(p => {
                    const isAlreadyInShelf = activeShelfProducts.some(asp => asp.id === p.id);
                    return (
                      <div
                        key={p.id}
                        style={{
                          background: 'var(--bg-surface)',
                          border: isAlreadyInShelf ? '1.5px solid #22C55E' : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            ₹{p.price}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleShelfProduct(p.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: isAlreadyInShelf ? '1px solid #22C55E' : '1px solid var(--accent-orange)',
                            background: isAlreadyInShelf ? '#22C55E22' : 'var(--accent-orange)',
                            color: isAlreadyInShelf ? '#22C55E' : '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            flexShrink: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isAlreadyInShelf ? (
                            <>
                              <Check size={12} />
                              <span>In Shelf</span>
                            </>
                          ) : (
                            <>
                              <Plus size={12} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OVERVIEW & SECTION TOGGLES                                         */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            className="admin-card"
            style={{
              padding: '24px',
              borderRadius: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Storefront Section Sequencing & Live Toggles
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              On your storefront homepage, these two sections render right below the Hero Banner in the order shown below:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Order 1: Hero Banner (Reference) */}
              <div
                style={{
                  padding: '14px 20px',
                  borderRadius: '12px',
                  background: 'var(--bg-surface)',
                  border: '1px dashed var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: 0.8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(249, 115, 22, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F97316'
                  }}>
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>
                      Position 1: Hero Slider & Side Banners
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Managed in "Hero Banners & Slider" module
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-action-pill-btn"
                  onClick={() => setAdminActiveTab('hero-banners')}
                >
                  Configure Hero ↗
                </button>
              </div>

              {/* Order 2: Flash Maker Deals */}
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '14px',
                  background: 'var(--bg-surface)',
                  border: dealsForm.enabled ? '1.5px solid #EA580C' : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(234, 88, 12, 0.15)',
                      border: '1px solid #EA580C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#EA580C'
                    }}
                  >
                    <Flame size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>
                        Position 2: {dealsForm.title}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: dealsForm.enabled ? '#22C55E22' : '#EF444422',
                          color: dealsForm.enabled ? '#22C55E' : '#EF4444'
                        }}
                      >
                        {dealsForm.enabled ? 'ACTIVE' : 'MUTED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Features {activeDealProducts.length} tournament deals with countdown timer box
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !dealsForm.enabled;
                      setDealsForm({ ...dealsForm, enabled: next });
                      updateFlashDealsSettings({ enabled: next });
                    }}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: dealsForm.enabled ? '#EF4444' : '#22C55E',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {dealsForm.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('deals')}
                    className="admin-action-pill-btn"
                  >
                    Edit Deals →
                  </button>
                </div>
              </div>

              {/* Order 3: 3D Filament Spool Zone */}
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '14px',
                  background: 'var(--bg-surface)',
                  border: filamentForm.enabled ? '1.5px solid #EA580C' : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(234, 88, 12, 0.15)',
                      border: '1px solid #EA580C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#EA580C'
                    }}
                  >
                    <CircleDot size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>
                        Position 3: {filamentForm.title}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: filamentForm.enabled ? '#22C55E22' : '#EF444422',
                          color: filamentForm.enabled ? '#22C55E' : '#EF4444'
                        }}
                      >
                        {filamentForm.enabled ? 'ACTIVE' : 'MUTED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Features 6 engineering filament subcategory cards + Popular Spools shelf
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !filamentForm.enabled;
                      setFilamentForm({ ...filamentForm, enabled: next });
                      updateFilamentSectionSettings({ enabled: next });
                    }}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: filamentForm.enabled ? '#EF4444' : '#22C55E',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {filamentForm.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('filament-zone')}
                    className="admin-action-pill-btn"
                  >
                    Edit Filament Zone →
                  </button>
                </div>
              </div>
            </div>

            {/* Factory Reset Row */}
            <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="admin-action-pill-btn"
                onClick={() => {
                  if (window.confirm('Reset Flash Deals and 3D Filament Zone to factory defaults?')) {
                    resetFlashDealsDefaults();
                    resetFilamentSectionDefaults();
                  }
                }}
                style={{ fontSize: '12px', color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={14} />
                <span>Restore Both Sections to Factory Defaults</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDealsAndFilaments;
