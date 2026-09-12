import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

const PRESET_EMOJIS = [
  '⚡', '🔩', '🧵', '⚙️', '🔌', '🔲', '🏁', '🏎️', '⚽', '🔧',
  '🔋', '🤖', '🛰️', '📡', '💡', '🧪', '🔥', '🎯', '🚀', '💎'
];

export const AdminCategories = () => {
  const {
    navbarCategories,
    navbarSettings,
    addNavbarCategory,
    updateNavbarCategory,
    deleteNavbarCategory,
    toggleNavbarCategoryActive,
    updateNavbarSettings,
    reorderNavbarCategories,
    resetNavbarCategoriesDefaults,
    navigateToStorefront,
    setAdminActiveTab,
    showToast
  } = useCart();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    icon: '⚡',
    badge: '',
    badgeType: 'hot',
    targetType: 'category',
    targetUrl: '#store-catalog',
    order: 1,
    active: true
  });

  const isNavPublished = navbarSettings?.enabled !== false;
  const categoriesList = [...(navbarCategories || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const activeCount = categoriesList.filter(c => c.active !== false).length;

  // Master Publish / Unpublish Toggle for Home Page
  const handleToggleMasterPublish = () => {
    const nextState = !isNavPublished;
    updateNavbarSettings({
      ...navbarSettings,
      enabled: nextState
    });
    if (nextState) {
      showToast('🚀 Navbar Categories are now PUBLISHED & Live on Home Page!', 'success');
    } else {
      showToast('🔒 Navbar Categories are now HIDDEN from Home Page.', 'info');
    }
  };

  // Open Add Category Modal
  const handleOpenAddModal = () => {
    setEditingCatId(null);
    setCategoryForm({
      id: '',
      name: '',
      icon: '⚡',
      badge: '',
      badgeType: 'hot',
      targetType: 'category',
      targetUrl: '#store-catalog',
      order: categoriesList.length + 1,
      active: true
    });
    setIsModalOpen(true);
  };

  // Open Edit Category Modal
  const handleOpenEditModal = (cat) => {
    setEditingCatId(cat.id);
    setCategoryForm({
      id: cat.id,
      name: cat.name || '',
      icon: cat.icon || '⚡',
      badge: cat.badge || '',
      badgeType: cat.badgeType || 'hot',
      targetType: cat.targetType || 'category',
      targetUrl: cat.targetUrl || '#store-catalog',
      order: cat.order || 1,
      active: cat.active !== false
    });
    setIsModalOpen(true);
  };

  // Save Category (Add or Update)
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }

    if (editingCatId) {
      updateNavbarCategory(editingCatId, categoryForm);
      showToast(`Category "${categoryForm.name}" updated successfully!`, 'success');
    } else {
      addNavbarCategory(categoryForm);
      showToast(`Category "${categoryForm.name}" added successfully!`, 'success');
    }
    setIsModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = (cat) => {
    if (window.confirm(`Are you sure you want to remove category "${cat.name}"?`)) {
      deleteNavbarCategory(cat.id);
      showToast(`Category "${cat.name}" removed`, 'info');
    }
  };

  // Move Order Up
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newList = [...categoriesList];
    const temp = newList[index - 1];
    newList[index - 1] = newList[index];
    newList[index] = temp;
    reorderNavbarCategories(newList);
  };

  // Move Order Down
  const handleMoveDown = (index) => {
    if (index === categoriesList.length - 1) return;
    const newList = [...categoriesList];
    const temp = newList[index + 1];
    newList[index + 1] = newList[index];
    newList[index] = temp;
    reorderNavbarCategories(newList);
  };

  return (
    <div className="admin-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. TOP HEADER & ACTION BAR */}
      <div
        className="admin-card"
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📑</span>
              Navbar Categories Manager
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '12px',
                background: isNavPublished ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isNavPublished ? '#22C55E' : '#EF4444',
                border: `1px solid ${isNavPublished ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}
            >
              {isNavPublished ? `● Live (${activeCount} Active)` : '○ Hidden on Home'}
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Manage category strip items, icons, badges, order, and storefront visibility.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Master Home Page Publish / Hide Toggle */}
          <button
            type="button"
            onClick={handleToggleMasterPublish}
            style={{
              background: isNavPublished ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: isNavPublished ? '#22C55E' : '#EF4444',
              border: `1.5px solid ${isNavPublished ? '#22C55E' : '#EF4444'}`,
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            title={isNavPublished ? 'Click to hide navbar from Home Page' : 'Click to publish navbar on Home Page'}
          >
            <span>{isNavPublished ? '✓ Published on Home' : '🔒 Unpublished (Hidden)'}</span>
          </button>

          {/* Add Category Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            style={{
              background: 'linear-gradient(135deg, var(--primary), #EA580C)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px var(--primary-glow)'
            }}
          >
            <span>+ Add Category</span>
          </button>

          {/* Reset Defaults */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all navbar categories back to factory defaults?')) {
                resetNavbarCategoriesDefaults();
                showToast('Navbar categories reset to defaults', 'info');
              }
            }}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Reset to factory default categories"
          >
            🔄 Reset
          </button>

          {/* View Storefront */}
          <button
            type="button"
            onClick={navigateToStorefront}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Preview changes on Storefront"
          >
            👁️ View Store
          </button>
        </div>
      </div>

      {/* 3D Filament Subcategories & Colors Hub Shortcut Banner */}
      <div
        className="admin-card"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.08), rgba(234, 88, 12, 0.08))',
          border: '1.5px solid rgba(0, 102, 204, 0.25)',
          borderRadius: '14px',
          padding: '16px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '26px' }}>🧵</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
              Looking to customize 3D Filament Subcategories &amp; Color Swatches?
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Edit Hyper PLA, PLA+, PETG, upload dedicated spool photos for every color, and set engineering profiles.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAdminActiveTab('filaments')}
          className="admin-action-pill-btn primary"
          style={{ fontSize: '12px', padding: '8px 18px', borderRadius: '8px' }}
        >
          Open 3D Filaments &amp; Colors Hub →
        </button>
      </div>

      {/* 2. LIVE STOREFRONT NAVIGATION STRIP PREVIEW */}
      <div className="admin-card" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👁️</span>
              Live Storefront Navigation Strip Preview
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Real-time visualization of how the categories strip appears on customer storefront
            </span>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '6px',
              background: isNavPublished ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isNavPublished ? '#22C55E' : '#EF4444'
            }}
          >
            {isNavPublished ? '● Synchronized' : '🔒 Strip Hidden on Home'}
          </span>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            overflowX: 'auto',
            opacity: isNavPublished ? 1 : 0.65
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap', minWidth: '600px' }}>
            {categoriesList.filter(c => c.active !== false).map(cat => (
              <div
                key={cat.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: cat.id === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: cat.id === 'all' ? '2px solid var(--primary)' : '2px solid transparent',
                  cursor: 'default',
                  whiteSpace: 'nowrap',
                  borderRadius: '6px 6px 0 0'
                }}
              >
                <span>{cat.icon} {cat.name}</span>
                {cat.badge && (
                  <span className={`nav-badge-${cat.badgeType || 'hot'}`}>
                    {cat.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CATEGORY ITEMS MANAGEMENT LIST */}
      <div className="admin-card" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Configured Category Items ({categoriesList.length})
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Reorder positions, edit emojis/titles, configure badges, and toggle visibility
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>+ Add Category</span>
          </button>
        </div>

        <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ width: '85px', textAlign: 'center', padding: '10px 8px', fontSize: '12px' }}>Order</th>
                <th style={{ padding: '10px 12px', fontSize: '12px' }}>Category &amp; Icon</th>
                <th style={{ padding: '10px 12px', fontSize: '12px' }}>Slug ID</th>
                <th style={{ padding: '10px 12px', fontSize: '12px' }}>Badge</th>
                <th style={{ padding: '10px 12px', fontSize: '12px' }}>Target</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '12px' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesList.map((cat, idx) => {
                const isPublished = cat.active !== false;
                return (
                  <tr
                    key={cat.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      opacity: isPublished ? 1 : 0.6
                    }}
                  >
                    {/* Order Up/Down */}
                    <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: '800', fontSize: '11px', color: 'var(--text-secondary)', minWidth: '22px', textAlign: 'right' }}>
                          #{idx + 1}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveUp(idx)}
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-primary)',
                              borderRadius: '3px',
                              padding: '1px 5px',
                              cursor: idx === 0 ? 'not-allowed' : 'pointer',
                              opacity: idx === 0 ? 0.3 : 1,
                              fontSize: '9px'
                            }}
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === categoriesList.length - 1}
                            onClick={() => handleMoveDown(idx)}
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-primary)',
                              borderRadius: '3px',
                              padding: '1px 5px',
                              cursor: idx === categoriesList.length - 1 ? 'not-allowed' : 'pointer',
                              opacity: idx === categoriesList.length - 1 ? 0.3 : 1,
                              fontSize: '9px'
                            }}
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Name & Icon */}
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontSize: '18px',
                            background: 'var(--bg-secondary)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            lineHeight: 1
                          }}
                        >
                          {cat.icon || '📁'}
                        </span>
                        <div>
                          <strong style={{ color: 'var(--text-primary)', fontSize: '13px', display: 'block' }}>
                            {cat.name}
                          </strong>
                          {cat.id === 'all' && (
                            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '700' }}>
                              Primary Default Tab
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug ID */}
                    <td style={{ padding: '10px 12px' }}>
                      <code
                        style={{
                          background: 'var(--bg-secondary)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: 'var(--primary)',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}
                      >
                        {cat.id}
                      </code>
                    </td>

                    {/* Badge */}
                    <td style={{ padding: '10px 12px' }}>
                      {cat.badge ? (
                        <span className={`nav-badge-${cat.badgeType || 'hot'}`} style={{ display: 'inline-block' }}>
                          {cat.badge}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>—</span>
                      )}
                    </td>

                    {/* Action Target */}
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {cat.targetType === 'link'
                          ? `🔗 Anchor: ${cat.targetUrl || '#store-catalog'}`
                          : `🔍 Catalog Filter: ${cat.id}`}
                      </span>
                    </td>

                    {/* Publication Status Toggle */}
                    <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                      <button
                        type="button"
                        onClick={() => toggleNavbarCategoryActive(cat.id)}
                        style={{
                          background: isPublished ? 'rgba(34, 197, 94, 0.12)' : 'rgba(100, 116, 139, 0.15)',
                          color: isPublished ? '#22C55E' : '#64748B',
                          border: `1.5px solid ${isPublished ? '#22C55E' : '#64748B'}`,
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title={isPublished ? 'Click to Hide from navbar' : 'Click to Publish on navbar'}
                      >
                        {isPublished ? '● Published' : '○ Hidden'}
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td style={{ textAlign: 'right', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cat)}
                          style={{
                            background: '#0284C7',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Edit Category"
                        >
                          ✏️ Edit
                        </button>

                        {/* Delete Button */}
                        {cat.id !== 'all' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            style={{
                              background: '#EF4444',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '5px',
                              padding: '5px 9px',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                            title="Delete Category"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL: ADD / EDIT NAVBAR CATEGORY */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingCatId ? '✏️ Edit Navbar Category' : '➕ Add New Navbar Category'}
              </h3>
              <button
                type="button"
                className="btn-table-icon"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Category Display Name */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Category Display Name *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    value={categoryForm.name}
                    onChange={e => {
                      const name = e.target.value;
                      setCategoryForm(prev => ({
                        ...prev,
                        name,
                        id: editingCatId ? prev.id : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      }));
                    }}
                    placeholder="e.g. 3D Filaments, Microcontrollers, Wheels"
                  />
                </div>

                {/* Category Slug / ID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category Slug / ID *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      disabled={editingCatId === 'all'}
                      value={categoryForm.id}
                      onChange={e => setCategoryForm({ ...categoryForm, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                      placeholder="e.g. filaments, motors"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Order Position</label>
                    <input
                      type="number"
                      min="1"
                      className="admin-form-input"
                      value={categoryForm.order}
                      onChange={e => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value, 10) || 1 })}
                    />
                  </div>
                </div>

                {/* Emoji / Icon Selection */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Category Icon / Emoji *</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      className="admin-form-input"
                      style={{ fontSize: '1.2rem', width: '80px', textAlign: 'center' }}
                      value={categoryForm.icon}
                      onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                      placeholder="⚡"
                      required
                    />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', alignSelf: 'center' }}>
                      Click preset emoji below or type custom emoji
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {PRESET_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, icon: emoji })}
                        style={{
                          background: categoryForm.icon === emoji ? 'var(--primary)' : 'var(--bg-secondary)',
                          color: categoryForm.icon === emoji ? '#fff' : 'inherit',
                          border: `1px solid ${categoryForm.icon === emoji ? 'var(--primary)' : 'var(--border-color)'}`,
                          borderRadius: '6px',
                          padding: '5px 8px',
                          fontSize: '15px',
                          cursor: 'pointer'
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge Pill & Style */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Badge Text (Optional)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={categoryForm.badge}
                      onChange={e => setCategoryForm({ ...categoryForm, badge: e.target.value.toUpperCase() })}
                      placeholder="e.g. HOT, NEW, PRO, SALE"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Badge Color Scheme</label>
                    <select
                      className="admin-form-select"
                      value={categoryForm.badgeType}
                      onChange={e => setCategoryForm({ ...categoryForm, badgeType: e.target.value })}
                    >
                      <option value="hot">🔥 Red (HOT)</option>
                      <option value="pro">⚡ Amber (PRO)</option>
                      <option value="new">🟢 Green (NEW)</option>
                      <option value="deal">💜 Purple (SALE)</option>
                    </select>
                  </div>
                </div>

                {/* Target Type & Target URL */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Action Target Type</label>
                    <select
                      className="admin-form-select"
                      value={categoryForm.targetType}
                      onChange={e => setCategoryForm({ ...categoryForm, targetType: e.target.value })}
                    >
                      <option value="category">🔍 Filter Store Catalog</option>
                      <option value="link">🔗 Scroll to Section Anchor (#)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Target URL / Anchor</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={categoryForm.targetUrl}
                      onChange={e => setCategoryForm({ ...categoryForm, targetUrl: e.target.value })}
                      placeholder="#store-catalog or #robot-builder"
                    />
                  </div>
                </div>

                {/* Active Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="cat-active-check"
                    checked={categoryForm.active}
                    onChange={e => setCategoryForm({ ...categoryForm, active: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <label htmlFor="cat-active-check" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    Publish this category on the Storefront Navbar
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-action-pill-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-action-pill-btn primary"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), #EA580C)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '700'
                  }}
                >
                  {editingCatId ? '💾 Save Changes' : '➕ Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
